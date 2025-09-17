// __mocks__/risk-seq.js
// Keep this tiny and deterministic to avoid pulling TFJS in tests.

const loadSeqModel = jest.fn(async () => ({
  // pretend model handle
  name: "mock-seq-model",
}));

/**
 * @param {Array<{score?: number, mood?: string, date?: string}>} sequence
 * @returns {{ risk: number, sequence: Array<number> }}
 */
const predictSeqRisk = jest.fn(async (sequence = []) => {
  // Simple mock: average any numeric "score" fields and clamp to [0,1]
  const nums = sequence
    .map((x) => (typeof x?.score === "number" ? x.score : null))
    .filter((x) => x !== null);

  const avg = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  const risk = Math.max(0, Math.min(1, avg));
  return { risk, sequence: nums };
});

module.exports = { loadSeqModel, predictSeqRisk };
