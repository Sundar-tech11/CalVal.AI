import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 bg-[#0b0d11] border-t border-stone-800/90 text-stone-300 text-xs font-normal shadow-[0_-8px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="text-xl font-serif tracking-wider text-stone-50 font-normal">
                CalVal<span className="text-amber-400 italic">.AI</span>
              </Link>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-amber-300 font-medium">
                Maison ML Edition
              </span>
            </div>
            <p className="text-stone-300 text-xs leading-relaxed max-w-sm">
              Algorithmic residential valuation engine and spatial intelligence for California housing.
              Combining multi-model consensus, empirical census distributions, and explainable feature attribution.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-stone-300 font-medium">Valuation Engine Online</span>
              <span>•</span>
              <span>20,640 Census Records</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-stone-100 text-xs font-semibold uppercase tracking-wider font-mono">
              Valuation Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-stone-300 hover:text-amber-300 transition-colors">
                  Home / Overview
                </Link>
              </li>
              <li>
                <Link to="/valuation" className="text-stone-300 hover:text-amber-300 transition-colors">
                  Property Valuation Studio
                </Link>
              </li>
              <li>
                <Link to="/california-map" className="text-stone-300 hover:text-amber-300 transition-colors">
                  California Spatial Map
                </Link>
              </li>
              <li>
                <Link to="/consensus" className="text-stone-300 hover:text-amber-300 transition-colors">
                  Model Architecture Consensus
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-stone-300 hover:text-amber-300 transition-colors">
                  Market Analytics & Benchmarks
                </Link>
              </li>
              <li>
                <Link to="/explainable-ai" className="text-stone-300 hover:text-amber-300 transition-colors">
                  Explainable AI & Attribution
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="text-stone-300 hover:text-amber-300 transition-colors">
                  How CalVal.AI Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Machine Learning Models */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-stone-100 text-xs font-semibold uppercase tracking-wider font-mono">
              Model Architectures
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li className="flex items-center justify-between">
                <span className="text-stone-200">XGBoost Regressor</span>
                <span className="font-mono text-amber-300 font-medium">R² 0.844</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-stone-200">Random Forest</span>
                <span className="font-mono text-stone-300">R² 0.803</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-stone-200">Decision Tree</span>
                <span className="font-mono text-stone-300">R² 0.686</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-stone-200">Ridge Regression (L2)</span>
                <span className="font-mono text-stone-300">R² 0.653</span>
              </li>
            </ul>
          </div>

          {/* Back to top */}
          <div className="lg:col-span-2 flex flex-col justify-between items-start lg:items-end">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-100 text-xs font-medium transition cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <p>
            © {new Date().getFullYear()} CalVal.AI. Pace & Barry (1997) California Census Machine Learning Benchmark.
            For analytical and research estimation purposes.
          </p>
          <div className="flex items-center gap-4 text-stone-400 font-mono">
            <span>StandardScaler 10-Feature Pipeline</span>
            <span>•</span>
            <span>SHAP Marginal Attributions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
