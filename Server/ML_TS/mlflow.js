const axios = require("axios");
const BASE = process.env.MLFLOW_TRACKING_URI || "http://localhost:5000";

async function getOrCreateExperiment(name) {
  try {
    const r = await axios.get(
      `${BASE}/api/2.0/mlflow/experiments/get-by-name`,
      {
        params: { experiment_name: name },
      }
    );
    return r.data.experiment.experiment_id;
  } catch (e) {
    // create if missing
    if (e.response?.data?.error_code === "RESOURCE_DOES_NOT_EXIST") {
      const c = await axios.post(`${BASE}/api/2.0/mlflow/experiments/create`, {
        name,
      });
      return c.data.experiment_id;
    }
    throw e;
  }
}

async function createRun(experiment_id, run_name) {
  const r = await axios.post(`${BASE}/api/2.0/mlflow/runs/create`, {
    experiment_id,
    run_name,
    tags: [{ key: "mlflow.source.name", value: "train_seq_risk.js" }],
  });
  return r.data.run.info.run_id;
}

async function logParam(run_id, key, value) {
  return axios.post(`${BASE}/api/2.0/mlflow/runs/log-parameter`, {
    run_id,
    key,
    value: String(value),
  });
}

async function logMetric(run_id, key, value, step = 0) {
  return axios.post(`${BASE}/api/2.0/mlflow/runs/log-metric`, {
    run_id,
    key,
    value: Number(value),
    timestamp: Date.now(),
    step,
  });
}

module.exports = { getOrCreateExperiment, createRun, logParam, logMetric };
