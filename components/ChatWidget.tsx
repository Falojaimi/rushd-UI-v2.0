"use client";

import { useState, useRef } from "react";
import { ChatBox } from "./ChatBox";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatWidget() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // 🔹 Webhook endpoints
  const CHAT_WEBHOOK = "https://n8n.rushd.site/webhook/chatbox";
  const UPLOAD_WEBHOOK = "https://n8n.rushd.site/webhook/chatbox-upload";

  // =============================
  // 🧠 Handle text message sending
  // =============================
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(CHAT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const reply = data.reply ?? data.message ?? "No response";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error connecting to Rushd AI." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // 📎 Handle image (study plan screenshot) upload
  // =========================================
  async function handleImageUpload(file: File) {
    if (!file) return;

    // ✅ File type validation
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "❌ Only JPG or PNG images are allowed." },
      ]);
      return;
    }

    // ✅ File size validation (max 25 MB)
    if (file.size > 25 * 1024 * 1024) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "❌ File too large. Max size: 25 MB." },
      ]);
      return;
    }

    // 📎 Inform the user upload started
    setMessages((prev) => [
      ...prev,
      { role: "user", text: `📎 Uploaded: ${file.name}` },
    ]);
    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("source", "plan-processor");

      const res = await fetch(UPLOAD_WEBHOOK, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      const reply = data.reply ?? data.message ?? "✅ Study plan received.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error analyzing your image. Please try again." },
      ]);
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Messages */}
      <div className="space-y-2 overflow-y-auto min-h-[400px] max-h-[65vh] pb-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <ChatBox
              className={m.role === "user" ? "" : ""}
              shadow={m.role === "user"}
              glass={m.role === "assistant"}
            >
              <span className="text-sm text-black/90">{m.text}</span>
            </ChatBox>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <ChatBox glass>
              <span className="text-sm text-black/60 italic">Thinking…</span>
            </ChatBox>
          </div>
        )}
      </div>

      {/* Input + Upload */}
      <form onSubmit={sendMessage} className="flex items-center gap-2">
        <ChatBox className="flex-1 items-center gap-2" shadow>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Rushd…"
            className="bg-transparent outline-none text-sm w-[60vw] max-w-[600px]"
          />
        </ChatBox>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImageUpload(f);
          }}
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm"
          disabled={loading}
        >
          Upload
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-60"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}