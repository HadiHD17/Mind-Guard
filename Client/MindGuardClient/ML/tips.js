// src/ml/tips.js
export const TIPS = {
  LOW: {
    anxiety: ["2-min breathing: 4-4-4", "Short walk outside"],
    sadness: ["Write 3 small wins", "Text a friend hello"],
    anger: ["Pause 10 min before reply"],
    fear: ["Worst/best/likely outcome"],
    shame: ["What would you tell a friend?"],
    stress: ["Pick 1 tiny task (10 min)"],
    lonely: ["Say hi to someone you trust"],
    calm: ["Body scan for 1 minute"],
    happy: ["Savor it—what caused it?"],
    excited: ["15-min focus sprint"],
    confused: ["Write the problem as 1 question"],
  },
  MEDIUM: {
    anxiety: ["Box breathing 5 min", "5 lines about the worry"],
    sadness: ["Light + sunlight 10–15m", "Plan a call with a friend"],
    anger: ["Move 5m; reply later calmly"],
    fear: ["List 3 actions you control"],
    shame: ["3 kind sentences to yourself"],
    stress: ["Say no to 1 non-essential thing"],
    lonely: ["Join a short community chat today"],
    calm: ["Keep routine; aim for good sleep"],
    happy: ["Share one good thing with someone"],
    excited: ["Prioritize the top next step"],
    confused: ["Ask for help / read 1 trusted source"],
  },
  HIGH: {
    anxiety: ["5-4-3-2-1 grounding", "Call a trusted person now"],
    sadness: [
      "If self-harm thoughts: seek emergency help",
      "Call a close friend now",
    ],
    anger: ["Cold water on face; step away"],
    fear: ["Safety first: leave if unsafe"],
    shame: ["Talk to someone safe; you deserve care"],
    stress: ["Defer tasks; hydrate; slow breathing"],
    lonely: ["Call a helpline if feeling unsafe"],
    calm: ["Maintain supports; check in tomorrow"],
    happy: ["Protect sleep for tomorrow"],
    excited: ["Avoid impulsive choices; sleep on it"],
    confused: ["Pause big decisions; ask for support"],
  },
};

export function tipsFor(risk, mood) {
  const list = TIPS[risk]?.[mood];
  return Array.isArray(list) && list.length
    ? list
    : ["Take one kind action for yourself."];
}
