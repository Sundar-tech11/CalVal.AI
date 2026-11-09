import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import express from 'express';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';

import {
  DATASET_STATS,
  LOCATION_PRESETS,
  MODELS_META,
  computePrediction,
} from './server/ml_service';

import { HouseFeatures, ModelId } from './src/types';

type PythonPrediction = {
  model_id: string;
  predicted_value: number;
  predictions: Record<string, number>;
};

type PythonExplanation = {
  model_id: string;
  model_name: string;
  explanation_method: string;
  baseline_prediction: number;
  predicted_value: number;
  ranked_contributions: Array<{
    feature: string;
    label: string;
    user_value: number;
    impact_dollars: number;
    direction: string;
  }>;
  disclaimer: string;
};

type Pending<T> = {
  resolve: (value: T) => void;
  reject: (error: Error) => void;
};

class PythonWorker<T> {
  private child: ChildProcessWithoutNullStreams | null = null;
  private buffer = '';
  private starting: Promise<void> | null = null;
  private queue: Pending<T>[] = [];
  private stderr = '';

  constructor(private readonly script: string) {}

  private start(): Promise<void> {
    if (
      this.child &&
      this.child.exitCode === null &&
      !this.child.killed
    ) {
      return Promise.resolve();
    }

    if (this.starting) {
      return this.starting;
    }

    this.starting = new Promise<void>((resolve, reject) => {
      const executable =
        process.env.PYTHON_EXECUTABLE ||
        (process.platform === 'win32' ? 'py' : 'python3');

      const child = spawn(executable, ['-u', this.script], {
        cwd: process.cwd(),
        windowsHide: true,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      this.child = child;
      this.buffer = '';
      this.stderr = '';

      let settled = false;

      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');

      child.stdout.on('data', (chunk: string) => {
        this.buffer += chunk;

        let index = this.buffer.indexOf('\n');

        while (index !== -1) {
          const line = this.buffer.slice(0, index).trim();
          this.buffer = this.buffer.slice(index + 1);

          if (line) {
            const pending = this.queue.shift();

            if (pending) {
              try {
                const response = JSON.parse(line);

                if (response.error) {
                  pending.reject(new Error(response.error));
                } else {
                  pending.resolve(response as T);
                }
              } catch {
                pending.reject(
                  new Error(`Invalid JSON returned by ${this.script}`)
                );
              }
            }
          }

          index = this.buffer.indexOf('\n');
        }
      });

      child.stderr.on('data', (chunk: string) => {
        this.stderr += chunk;

        if (this.stderr.length > 12000) {
          this.stderr = this.stderr.slice(-12000);
        }
      });

      child.once('spawn', () => {
        settled = true;
        resolve();
      });

      child.on('error', (error) => {
        if (!settled) {
          settled = true;
          reject(error);
        }

        if (this.child === child) {
          this.child = null;
        }

        this.starting = null;
        this.rejectAll(error);
      });

      child.on('close', (code) => {
        if (this.child === child) {
          this.child = null;
        }

        this.buffer = '';
        this.starting = null;

        const message =
          this.stderr.trim() ||
          `${this.script} exited with code ${code}`;

        this.rejectAll(new Error(message));

        if (!settled) {
          settled = true;
          reject(new Error(message));
        }
      });
    }).finally(() => {
      this.starting = null;
    });

    return this.starting;
  }

  private rejectAll(error: Error) {
    const pending = this.queue.splice(0);

    for (const item of pending) {
      item.reject(error);
    }
  }

  async request(payload: unknown): Promise<T> {
    await this.start();

    const child = this.child;

    if (!child || child.exitCode !== null || child.killed) {
      throw new Error(`${this.script} is not running`);
    }

    return new Promise<T>((resolve, reject) => {
      this.queue.push({ resolve, reject });

      const line = JSON.stringify(payload) + '\n';

      child.stdin.write(line, (error) => {
        if (!error) {
          return;
        }

        const index = this.queue.findIndex(
          (item) => item.resolve === resolve
        );

        if (index !== -1) {
          this.queue.splice(index, 1);
        }

        reject(error);
      });
    });
  }
}

// Keep Python processes and trained models alive between requests.
const predictionWorker = new PythonWorker<PythonPrediction>(
  'ml/predict.py'
);

const explanationWorker = new PythonWorker<PythonExplanation>(
  'ml/explain.py'
);

function predictUsingPython(
  features: HouseFeatures,
  modelId: ModelId
): Promise<PythonPrediction> {
  return predictionWorker.request({
    features,
    model_id: modelId,
  });
}

function explainUsingPython(
  features: HouseFeatures,
  modelId: ModelId
): Promise<PythonExplanation> {
  return explanationWorker.request({
    features,
    model_id: modelId,
  });
}

function buildFeatures(
  body: Record<string, any>
): HouseFeatures & Record<string, any> {
  const medInc = Number(
    body.median_income ?? body.MedInc ?? 3.87
  );

  const houseAge = Number(
    body.housing_median_age ?? body.HouseAge ?? 28
  );

  const latitude = Number(
    body.latitude ?? body.Latitude ?? 36.75
  );

  const longitude = Number(
    body.longitude ?? body.Longitude ?? -119.75
  );

  const population = Number(
    body.population ?? body.Population ?? 1400
  );

  const aveRooms =
    body.AveRooms !== undefined
      ? Number(body.AveRooms)
      : undefined;

  const aveBedrms =
    body.AveBedrms !== undefined
      ? Number(body.AveBedrms)
      : undefined;

  const aveOccup =
    body.AveOccup !== undefined
      ? Number(body.AveOccup)
      : undefined;

  const households = Number(
    body.households ??
      (aveOccup ? population / aveOccup : 500)
  );

  const totalRooms = Number(
    body.total_rooms ??
      (aveRooms ? aveRooms * households : 2500)
  );

  const totalBedrooms = Number(
    body.total_bedrooms ??
      (aveBedrms ? aveBedrms * households : 500)
  );

  return {
    median_income: medInc,
    housing_median_age: houseAge,
    total_rooms: totalRooms,
    total_bedrooms: totalBedrooms,
    population,
    households,
    latitude,
    longitude,
    ocean_proximity: body.ocean_proximity || 'INLAND',

    MedInc: medInc,
    HouseAge: houseAge,
    AveRooms: aveRooms ?? totalRooms / Math.max(1, households),
    AveBedrms:
      aveBedrms ?? totalBedrooms / Math.max(1, households),
    AveOccup:
      aveOccup ?? population / Math.max(1, households),
    Population: population,
    Latitude: latitude,
    Longitude: longitude,
  };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'CalVal.AI ML Valuation Engine',
      loaded_models: Object.keys(MODELS_META),
      dataset_records: DATASET_STATS.count,
      timestamp: new Date().toISOString(),
    });
  });

  // Available models
  app.get('/api/models', (_req, res) => {
    res.json({
      models: MODELS_META,
      default_model: 'xgboost',
    });
  });

  // Dataset statistics
  app.get('/api/dataset-stats', (_req, res) => {
    res.json({
      stats: DATASET_STATS,
      presets: LOCATION_PRESETS,
      models: MODELS_META,
    });
  });

  app.get('/api/stats', (_req, res) => {
    res.json({
      stats: DATASET_STATS,
      presets: LOCATION_PRESETS,
      models: MODELS_META,
    });
  });

  // Location presets
  app.get('/api/presets', (_req, res) => {
    res.json({
      presets: LOCATION_PRESETS,
    });
  });

  // Property valuation
  app.post('/api/predict', async (req, res) => {
    try {
      const body = req.body || {};
      const modelId: ModelId = body.model_id || 'xgboost';
      const features = buildFeatures(body.features ?? body);

      const [result, actual] = await Promise.all([
        Promise.resolve(computePrediction(features, modelId)),
        predictUsingPython(features, modelId),
      ]);

      // Use predictions from the actual trained Python models.
      result.predicted_value = actual.predicted_value;

      for (const [id, prediction] of Object.entries(
        actual.predictions
      )) {
        if (result.multi_model_comparison[id]) {
          result.multi_model_comparison[id].prediction =
            prediction;
        }
      }

      const value = actual.predicted_value;
      const margin = result.confidence_band.margin;

      result.confidence_band.low = Math.max(
        15000,
        value - margin
      );

      result.confidence_band.high = Math.min(
        550000,
        value + margin
      );

      res.json(result);
    } catch (err: unknown) {
      console.error('Prediction calculation error:', err);

      const message =
        err instanceof Error
          ? err.message
          : 'Failed to compute prediction';

      res.status(500).json({
        error: message,
      });
    }
  });

  // Real SHAP explanations for the selected trained model.
  const handleExplain = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const body = req.body || {};

      const modelId: ModelId = body.model_id || 'xgboost';
      const features = buildFeatures(body.features ?? body);

      const explanation = await explainUsingPython(
        features,
        modelId
      );

      // IMPORTANT:
      // Do not overwrite model_id or model_name with XGBoost.
      // Return the actual model-specific SHAP response.
      res.json(explanation);
    } catch (err: unknown) {
      console.error('SHAP explanation error:', err);

      const message =
        err instanceof Error
          ? err.message
          : 'Failed to generate SHAP explanation';

      res.status(500).json({
        error: message,
      });
    }
  };

  app.post('/api/explain', handleExplain);
  app.post('/api/xai', handleExplain);

  // Vite development server / production static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `CalVal.AI Server running on http://localhost:${PORT}`
    );
  });
}

startServer().catch((error) => {
  console.error('Failed to start CalVal.AI server:', error);
  process.exit(1);
});