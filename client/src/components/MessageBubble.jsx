export default function MessageBubble({ message, isSelf, label, myRole }) {
  const className = [
    "bubble",
    "bubble-enter",
    isSelf ? "self" : "other",
    isSelf && myRole === "guest" ? "guest-self" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <div className="bubble-meta">{label}</div>
      {message.text}
    </div>
  );
}
