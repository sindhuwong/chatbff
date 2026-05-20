import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { analyzeMessage } from "../lib/api.js";
import {
  claimRole,
  createSync,
  loadRoom,
  roleLabel,
} from "../lib/room.js";
import ChatComposer from "../components/ChatComposer.jsx";
import HealthPanel from "../components/HealthPanel.jsx";
import InterventionCard from "../components/InterventionCard.jsx";
import MessageBubble from "../components/MessageBubble.jsx";

export default function ChatPage() {
  const { roomId } = useParams();
  const myRole = claimRole(roomId);
  const myLabel = roleLabel(myRole);
  const otherLabel = myRole === "host" ? "Guest" : "Host";

  const [room, setRoom] = useState(() => loadRoom(roomId));
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [intervention, setIntervention] = useState(null);
  const [error, setError] = useState(null);

  const syncRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    syncRef.current = createSync(roomId, setRoom);
    setRoom(loadRoom(roomId));
  }, [roomId]);

  useEffect(() => {
    function onStorage(e) {
      if (e.key === `chatbff:${roomId}`) {
        setRoom(loadRoom(roomId));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room.messages]);

  const commitMessage = useCallback(
    (text, analysis) => {
      syncRef.current?.addMessage(text, myRole, analysis);
      setInput("");
      setIntervention(null);
      setError(null);
    },
    [myRole]
  );

  const attemptSend = useCallback(async () => {
    const raw = input.trim();
    if (!raw || sending) return;

    setIntervention(null);
    setError(null);
    setSending(true);

    try {
      const analysis = await analyzeMessage(raw);

      if (analysis.status === "safe") {
        commitMessage(raw, analysis);
        return;
      }

      if (analysis.status === "caution") {
        setIntervention({ type: "caution", original: raw, analysis });
        return;
      }

      setIntervention({ type: "blocked", original: raw, analysis });
    } catch {
      setError("Could not check message. Try again in a moment.");
    } finally {
      setSending(false);
    }
  }, [input, sending, commitMessage]);

  return (
    <div className="wrap">
      <div className="top-bar">
        <Link to="/">
          <img src="/logo.png" alt="ChatBFF" className="logo" />
        </Link>
        <Link to="/">← New chat</Link>
      </div>

      <div className="layout">
        <div className="panel">
          <div className="chat-header">
            <div className="chat-header-info">
              Conversation <span className="room-id">{roomId}</span>
            </div>
            <span className={`role-badge ${myRole}`}>{myLabel}</span>
          </div>

          <div className={`chat-messages${room.messages.length ? "" : " empty"}`} aria-live="polite">
            {room.messages.map((msg) => {
              const isSelf = msg.role === myRole;
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isSelf={isSelf}
                  label={isSelf ? myLabel : otherLabel}
                  myRole={myRole}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="intervention-slot">
            {sending && <div className="sending-indicator visible">Checking message…</div>}
            {error && (
              <div className="intervention blocked intervention-enter" role="alert">
                <h3>Could not check message</h3>
                <p className="flag-reason">{error}</p>
              </div>
            )}
            {intervention && (
              <InterventionCard
                type={intervention.type}
                original={intervention.original}
                analysis={intervention.analysis}
                onUseSuggestion={() =>
                  commitMessage(intervention.analysis.rewrite, {
                    ...intervention.analysis,
                    status: "safe",
                    usedRewrite: true,
                  })
                }
                onSendAnyway={() => commitMessage(intervention.original, intervention.analysis)}
                onEdit={() => {
                  setInput(intervention.original);
                  setIntervention(null);
                }}
              />
            )}
          </div>

          <ChatComposer
            input={input}
            sending={sending}
            onInputChange={setInput}
            onSend={attemptSend}
            onFillPrompt={setInput}
          />
        </div>

        <HealthPanel messages={room.messages} />
      </div>
    </div>
  );
}
