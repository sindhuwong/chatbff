export default function InterventionCard({ type, original, analysis, onUseSuggestion, onSendAnyway, onEdit }) {
  const isCaution = type === "caution";

  return (
    <div className={`intervention ${type} intervention-enter`} role={isCaution ? "status" : "alert"}>
      <h3>{isCaution ? "Heads up before sending" : "Message needs a revision"}</h3>
      <p className="interception-note">Stopped before sending</p>
      <p className="why-flag-label">Why it was flagged</p>
      <p className="flag-reason">{analysis.reason}</p>
      <div className="compare">
        <p className="compare-line">
          <span className="label">Original:</span> &quot;{original}&quot;
        </p>
        <p className="compare-line">
          <span className="label">Suggested:</span> &quot;{analysis.rewrite}&quot;
        </p>
      </div>
      <div className="intervention-actions">
        <button type="button" className="btn btn-primary" onClick={onUseSuggestion}>
          Use suggestion
        </button>
        {isCaution ? (
          <button type="button" className="btn btn-secondary" onClick={onSendAnyway}>
            Send anyway
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={onEdit}>
            Edit message
          </button>
        )}
      </div>
    </div>
  );
}
