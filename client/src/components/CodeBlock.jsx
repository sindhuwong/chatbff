export default function CodeBlock({ label, children }) {
  return (
    <div className="code-block">
      {label && <div className="code-block-label">{label}</div>}
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}
