import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const BLOCKED = [
  {
    match: ["idiot", "moron", "loser", "worthless", "hate you", "kill yourself", "kill you"],
    flag: "insult",
    reason: "This message may escalate the conversation",
    risk: "high",
  },
];

const CAUTION = [
  {
    match: ["dumb", "stupid", "annoying", "shut up", "whatever", "don't care"],
    flag: "harsh tone",
    reason: "This message may sound harsh",
    tone: "harsh",
    risk: "medium",
  },
  {
    match: ["you have to", "do it now", "right now or", "don't make me", "last chance", "or else"],
    flag: "pressure",
    reason: "This message may use pressure",
    tone: "pressuring",
    risk: "medium",
  },
  {
    match: ["you never", "after everything", "if you cared", "you always", "how could you", "you make me"],
    flag: "guilt-tripping",
    reason: "This message may use guilt",
    tone: "guilt-tripping",
    risk: "medium",
  },
  {
    match: ["everyone thinks", "you owe me", "you're being selfish", "nobody likes you", "you're the only one"],
    flag: "pressure",
    reason: "This message may sound manipulative",
    tone: "manipulative",
    risk: "medium",
  },
  {
    match: ["send money", "wire transfer", "gift card", "click this link", "verify your account", "crypto wallet", "urgent payment"],
    flag: "scam-like request",
    reason: "This message may contain scam-like language",
    tone: "suspicious",
    risk: "high",
  },
];

const REWRITES = {
  "harsh tone": "I don't think this works for me yet, but I'd like to explain why.",
  pressure: "Could we talk about this when you have a moment? No rush.",
  "guilt-tripping": "I feel disappointed, but I want to understand your side.",
  insult: "I disagree, but I'd like to keep this respectful.",
  "scam-like request": "Let's keep this conversation here and avoid sharing payment details.",
  manipulative: "I'd like to share how I feel without putting pressure on you.",
};

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function findMatch(rules, text) {
  const n = normalize(text);
  for (const rule of rules) {
    for (const phrase of rule.match) {
      if (n.includes(phrase)) return { ...rule, phrase };
    }
  }
  return null;
}

function blockedFromProfanity() {
  return {
    status: "blocked",
    tone: "hostile",
    risk: "high",
    reason: "This message may escalate the conversation",
    flag: "insult",
    rewrite: REWRITES.insult,
  };
}

function blockedFromRule(rule) {
  return {
    status: "blocked",
    tone: rule.tone || "hostile",
    risk: rule.risk,
    reason: rule.reason,
    flag: rule.flag,
    rewrite: REWRITES[rule.flag] || REWRITES.insult,
  };
}

function cautionFromRule(rule) {
  return {
    status: "caution",
    tone: rule.tone || "concerning",
    risk: rule.risk,
    reason: rule.reason,
    flag: rule.flag,
    rewrite: REWRITES[rule.flag] || "I'd like to rephrase that in a kinder way.",
  };
}

export function analyze(text) {
  // TODO: replace obscenity + phrase rules with OpenAI moderation call
  // e.g. const result = await openai.moderations.create({ input: text });

  if (matcher.hasMatch(text)) {
    return blockedFromProfanity();
  }

  const blocked = findMatch(BLOCKED, text);
  if (blocked) {
    return blockedFromRule(blocked);
  }

  const caution = findMatch(CAUTION, text);
  if (caution) {
    return cautionFromRule(caution);
  }

  return {
    status: "safe",
    tone: "friendly",
    risk: "low",
    reason: "",
    flag: null,
    rewrite: text,
  };
}
