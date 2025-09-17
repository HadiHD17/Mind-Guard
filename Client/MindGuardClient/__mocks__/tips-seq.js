// __mocks__/tips-seq.js
// Lightweight, deterministic mock for tests.

const tipsFor = jest.fn((risk = 0) => {
  if (risk >= 0.8)
    return ["Reach out to a friend", "Try a short walk", "Breathing exercise"];
  if (risk >= 0.5)
    return ["Jot down 3 things you’re grateful for", "5-minute stretch"];
  return ["Keep journaling regularly", "Stay hydrated"];
});

module.exports = { tipsFor };
