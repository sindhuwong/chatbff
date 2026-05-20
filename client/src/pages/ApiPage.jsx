import { Link } from "react-router-dom";
import ApiEndpoint from "../components/ApiEndpoint.jsx";

const EXAMPLE_REQUEST = `{
  "message": "You're an idiot"
}`;

const EXAMPLE_RESPONSE = `{
  "status": "blocked",
  "tone": "hostile",
  "risk": "high",
  "reason": "This message may contain an insult.",
  "rewrite": "I disagree, but I want to keep this respectful."
}`;

const STEPS = [
  "Send a message to the API",
  "ChatBFF analyzes tone and risk",
  "Return a safety decision and rewrite",
];

const USE_CASES = [
  "Dating apps",
  "Gaming communities",
  "School platforms",
  "Forums",
  "Customer support chat",
];

export default function ApiPage() {
  return (
    <div className="wrap api-page">
      <div className="api-top-bar">
        <Link to="/">
          <img src="/logo.png" alt="ChatBFF" className="logo" />
        </Link>
        <Link to="/" className="api-back-link">
          ← Back to home
        </Link>
      </div>

      <header className="api-hero">
        <p className="api-eyebrow">ChatBFF API</p>
        <h1>AI safety for online conversations</h1>
        <p className="api-subtitle">
          Analyze messages before they are sent and return safety, tone, risk, and rewrite
          suggestions.
        </p>
      </header>

      <section className="api-section panel">
        <h2>How it works</h2>
        <ol className="api-steps">
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="api-section panel">
        <h2>Example</h2>
        <ApiEndpoint
          method="POST"
          path="/api/analyze"
          request={EXAMPLE_REQUEST}
          response={EXAMPLE_RESPONSE}
        />
      </section>

      <section className="api-section panel">
        <h2>Use cases</h2>
        <ul className="api-use-cases">
          {USE_CASES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="api-section panel api-note">
        <h2>Under the hood</h2>
        <p>
          The demo API uses{" "}
          <a href="https://www.npmjs.com/package/obscenity" target="_blank" rel="noopener noreferrer">
            obscenity
          </a>
          , a profanity filter npm package, plus custom phrase rules for pressure, guilt-tripping,
          and scam-like language. A future version will layer in OpenAI for richer context-aware
          moderation.
        </p>
      </section>

      <section className="api-cta panel">
        <p>Want API access?</p>
        <a href="mailto:henrywong@gatech.edu" className="btn btn-gradient api-cta-btn">
          Email me
        </a>
      </section>
    </div>
  );
}
