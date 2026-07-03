"use client";

import { useEveAgent } from "eve/react";
import { useState } from "react";

export function AgentChat() {
  const agent = useEveAgent();
  const [input, setInput] = useState("");
  const isBusy = agent.status === "submitted" || agent.status === "streaming";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = input.trim();
    if (message.length === 0 || isBusy) return;
    setInput("");
    agent.send({ message });
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {agent.data.messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-lg font-semibold tracking-tight">
              Career AI Agent
            </h2>
            <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              Ask me anything to get started — try &ldquo;What is the weather in
              Brooklyn?&rdquo;
            </p>
          </div>
        )}

        {agent.data.messages.map((message) => (
          <article
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                message.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-black/4 dark:bg-white/8"
              }`}
            >
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <p key={index} className="whitespace-pre-wrap">
                      {part.text}
                    </p>
                  );
                }
                if (part.type === "dynamic-tool") {
                  return (
                    <p
                      key={index}
                      className="font-mono text-xs text-zinc-500 dark:text-zinc-400"
                    >
                      {part.state === "output-available" ? "✓" : "…"}{" "}
                      {part.toolName}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </article>
        ))}

        {agent.status === "submitted" && (
          <p className="text-sm text-zinc-400">Thinking…</p>
        )}
        {agent.error && (
          <p className="text-sm text-red-500">{agent.error.message}</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-black/8 p-4 dark:border-white/[.145]"
      >
        <input
          name="message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Message the agent…"
          autoComplete="off"
          className="h-11 flex-1 rounded-full border border-black/8 bg-transparent px-4 text-sm outline-none placeholder:text-zinc-400 focus:border-black/24 dark:border-white/[.145] dark:focus:border-white/40"
        />
        {isBusy ? (
          <button
            type="button"
            onClick={() => void agent.stop()}
            className="h-11 rounded-full border border-black/8 px-5 text-sm font-medium transition-colors hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-white/8"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={input.trim().length === 0}
            className="h-11 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-40 dark:hover:bg-[#ccc]"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
