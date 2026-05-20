import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generateRoomId, reserveHost } from "../lib/room.js";

export default function LandingPage() {
  const navigate = useNavigate();
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

  function handleOpenChat() {
    reserveHost(roomId);
    window.open(`/chat/${roomId}`, "_blank", "noopener,noreferrer");
    navigate(`/chat/${roomId}`);
  }

  return (
    <div className="wrap home-page">
      <header className="home-header">
        <img src="/logo.png" alt="ChatBFF" className="logo" />
        <h1 className="home-headline">Healthy conversations, powered by AI.</h1>
        <p className="home-subtitle">
          Create a shareable Host/Guest chat with AI-assisted moderation.
        </p>
      </header>

      <div className="landing-card">
        {!roomId ? (
          <div className="home-cta-group">
            <button type="button" className="btn btn-gradient" onClick={handleCreate}>
              Start friendly chat
            </button>
            <Link to="/api" className="btn btn-secondary home-api-btn">
              API Docs
            </Link>
          </div>
        ) : (
          <div className="link-result visible">
            <label htmlFor="chatLink">Your chat link</label>
            <div className="link-row">
              <input type="text" id="chatLink" readOnly value={chatUrl} aria-label="Chat link" />
              <button type="button" className="btn btn-primary" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="helper-text">
              You&apos;ll join as Host. Open chat launches a Guest tab for testing.
            </p>
            <div className="home-cta-group home-cta-group-inline">
              <button type="button" className="btn btn-gradient open-chat-link" onClick={handleOpenChat}>
                Open chat →
              </button>
              <Link to="/api" className="btn btn-secondary home-api-btn">
                API Docs
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
