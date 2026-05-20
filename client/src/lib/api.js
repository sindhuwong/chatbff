export async function analyzeMessage(message) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Analysis failed");
  }

  return res.json();
}
