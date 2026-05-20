import { useState } from "react";
import { Link } from "react-router-dom";
import { generateRoomId } from "../lib/room.js";

export default function LandingPage() {
  const [roomId, setRoomId] = useState(null);
  const [copied, setCopied] = useState(false);

  const chatUrl = roomId ? `${window.location.origin}/chat/${roomId}` : "";

  function handleCreate() {
    setRoomId(generateRoomId());
    setCopied(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(chatUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="wrap">
      <header>
        <img src="/logo.png" alt="ChatBFF" className="logo" />
        <p>AI that helps keep conversations friendly</p>
      </header>

      <div className="landing-card">
        <h2>Start a friendly chat</h2>
        <button type="button" className="btn btn-gradient" onClick={handleCreate}>
          Create chat link
        </button>

        {roomId && (
          <div className="link-result visible">
            <label htmlFor="chatLink">Your chat link</label>
            <div className="link-row">
              <input type="text" id="chatLink" readOnly value={chatUrl} aria-label="Chat link" />
              <button type="button" className="btn btn-primary" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="helper-text">Open this link in another tab to test Host + Guest.</p>
            <div style={{ marginTop: "1rem" }}>
              <Link to={`/chat/${roomId}`} className="btn btn-secondary open-chat-link">
                Open chat →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
