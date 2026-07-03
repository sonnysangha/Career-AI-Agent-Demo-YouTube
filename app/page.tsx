import { AgentChat } from "./components/AgentChat";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex h-[calc(100vh-4rem)] w-full max-w-3xl flex-col bg-white dark:bg-black">
        <AgentChat />
      </main>
    </div>
  );
}
