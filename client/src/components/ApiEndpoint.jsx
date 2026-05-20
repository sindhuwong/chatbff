import CodeBlock from "./CodeBlock.jsx";

export default function ApiEndpoint({ method, path, request, response }) {
  return (
    <div className="api-endpoint">
      <div className="api-endpoint-header">
        <span className={`http-method ${method.toLowerCase()}`}>{method}</span>
        <code className="api-path">{path}</code>
      </div>
      {request && <CodeBlock label="Request">{request}</CodeBlock>}
      {response && <CodeBlock label="Response">{response}</CodeBlock>}
    </div>
  );
}
