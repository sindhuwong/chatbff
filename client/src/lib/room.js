export function generateRoomId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function storageKey(roomId) {
  return `chatbff:${roomId}`;
}

function metaKey(roomId) {
  return `chatbff-meta:${roomId}`;
}

function roleSessionKey(roomId) {
  return `chatbff-role:${roomId}`;
}

export function loadRoom(roomId) {
  try {
    const raw = localStorage.getItem(storageKey(roomId));
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { messages: [], flags: [] };
}

export function saveRoom(roomId, data) {
  localStorage.setItem(storageKey(roomId), JSON.stringify(data));
}

export function reserveHost(roomId) {
  sessionStorage.setItem(roleSessionKey(roomId), "host");
  localStorage.setItem(metaKey(roomId), JSON.stringify({ hostClaimed: true }));
}

export function claimRole(roomId) {
  const cached = sessionStorage.getItem(roleSessionKey(roomId));
  if (cached === "host" || cached === "guest") return cached;

  let meta = {};
  try {
    meta = JSON.parse(localStorage.getItem(metaKey(roomId)) || "{}");
  } catch {
    meta = {};
  }

  const role = meta.hostClaimed ? "guest" : "host";
  if (!meta.hostClaimed) {
    meta.hostClaimed = true;
    localStorage.setItem(metaKey(roomId), JSON.stringify(meta));
  }

  sessionStorage.setItem(roleSessionKey(roomId), role);
  return role;
}

export function roleLabel(role) {
  return role === "host" ? "Host" : "Guest";
}

export function computeHealth(messages) {
  const recent = messages.slice(-6);
  const analyses = recent.map((m) => m.analysis).filter(Boolean);

  if (!analyses.length) {
    return { status: "healthy", label: "Healthy", desc: "Conversation looks friendly so far." };
  }

  const blocked = analyses.filter((a) => a.status === "blocked").length;
  const caution = analyses.filter((a) => a.status === "caution").length;

  if (blocked >= 1 || caution >= 3) {
    return { status: "escalating", label: "Escalating", desc: "Recent messages may be heating up." };
  }
  if (caution >= 1) {
    return { status: "tense", label: "Tense", desc: "Some messages could use a softer tone." };
  }
  return { status: "healthy", label: "Healthy", desc: "Conversation looks friendly so far." };
}

export function collectFlags(messages) {
  const seen = new Set();
  const flags = [];
  for (let i = messages.length - 1; i >= 0 && flags.length < 5; i--) {
    const flag = messages[i].analysis?.flag;
    if (flag && !seen.has(flag)) {
      seen.add(flag);
      flags.push(flag);
    }
  }
  return flags;
}

export function createSync(roomId, onUpdate) {
  const channel =
    typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(`chatbff-${roomId}`) : null;

  if (channel) {
    channel.onmessage = (event) => {
      if (event.data?.type === "room-update") {
        onUpdate(event.data.room);
      }
    };
  }

  function broadcast(room) {
    channel?.postMessage({ type: "room-update", room });
  }

  function addMessage(text, role, analysis) {
    const room = loadRoom(roomId);
    const msg = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text,
      role,
      sender: roleLabel(role),
      timestamp: Date.now(),
      analysis: analysis || null,
    };
    room.messages.push(msg);

    if (analysis?.flag) {
      room.flags = collectFlags(room.messages);
    }

    saveRoom(roomId, room);
    broadcast(room);
    onUpdate(room);
    return msg;
  }

  return { addMessage };
}
