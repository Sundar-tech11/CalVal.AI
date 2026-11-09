
FROM node:22-trixie-slim

WORKDIR /app

# Install Python and native libraries required by XGBoost
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-venv \
    libgomp1 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create an isolated Python environment
RUN python3 -m venv /opt/venv

ENV PYTHON_EXECUTABLE=/opt/venv/bin/python
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Install ML dependencies
COPY requirements.txt ./

RUN /opt/venv/bin/python -m pip install --upgrade pip \
    && /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# Pre-download California Housing data for SHAP explanations
RUN /opt/venv/bin/python -c \
    "from sklearn.datasets import fetch_california_housing; fetch_california_housing()"

# Install Node dependencies
COPY package.json package-lock.json ./

RUN npm ci

# Copy the complete project
COPY . .

# Build React frontend and Express backend
RUN npm run build

# Production configuration
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
