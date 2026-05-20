import { computeHealth, collectFlags } from "../lib/room.js";

export default function HealthPanel({ messages }) {
  const health = computeHealth(messages);
  const flags = collectFlags(messages);

  return (
    <div className="panel health-panel">
      <h2>Conversation health</h2>
      <div className="health-status">
        <span className={`health-dot ${health.status}`} />
        <div>
          <div className="health-label">{health.label}</div>
          <div className="health-desc">{health.desc}</div>
        </div>
      </div>
      <div className="flags-section">
        <h3>Recent flags</h3>
        <ul className={`flags-list${flags.length ? "" : " empty"}`}>
          {flags.length ? (
            flags.map((flag) => <li key={flag}>{flag}</li>)
          ) : (
            <li>No recent flags</li>
          )}
        </ul>
      </div>
    </div>
  );
}
