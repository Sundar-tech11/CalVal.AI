
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

# Firebase configuration for Vite frontend
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_FIREBASE_FIRESTORE_DATABASE_ID

# Make Firebase variables available during the Vite build
ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
ENV VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
ENV VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
ENV VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
ENV VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
ENV VITE_FIREBASE_MEASUREMENT_ID=${VITE_FIREBASE_MEASUREMENT_ID}
ENV VITE_FIREBASE_FIRESTORE_DATABASE_ID=${VITE_FIREBASE_FIRESTORE_DATABASE_ID}

# Build React frontend and Express backend
RUN npm run build

# Production configuration
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
