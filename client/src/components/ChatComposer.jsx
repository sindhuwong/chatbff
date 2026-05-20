const SAMPLE_PROMPTS = [
  { emoji: "😊", text: "Hey! How's it going?" },
  { emoji: "⚠️", text: "That's a dumb idea" },
  { emoji: "⛔", text: "You're an idiot" },
  { emoji: "🚨", text: "Send money now or else" },
];

export default function ChatComposer({ input, sending, onInputChange, onSend, onFillPrompt }) {
  return (
    <div className="chat-composer">
      <div className="try-these">
        <span className="try-these-label">Try these:</span>
        <div className="try-these-pills">
          {SAMPLE_PROMPTS.map(({ emoji, text }) => (
            <button
              key={text}
              type="button"
              className="pill-btn"
              onClick={() => onFillPrompt(text)}
            >
              {emoji} {text}
            </button>
          ))}
        </div>
      </div>
      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Type a message…"
          autoComplete="off"
          aria-label="Message"
          disabled={sending}
        />
        <button type="button" className="btn btn-primary" onClick={onSend} disabled={sending}>
          Send
        </button>
      </div>
    </div>
  );
}
