import React, { useState } from "react";

interface LobbyRoomProps {
  onJoin: (id: string) => void;
}

const LobbyRoom = ({ onJoin }: LobbyRoomProps) => {
  const [joinId, setJoinId] = useState<string | null>(null);

  const handleCreateRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    onJoin(roomId);
  };

  return (
    <div className="bg-[#0e0e11] text-white min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#6965db]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-md bg-[#18181c]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col gap-7">
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6965db]/20 border border-[#6965db]/30 text-[#6965db] mx-auto mb-1">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Scribble Whiteboard
          </h1>
          <p className="text-sm text-zinc-400">
            Realtime collaborative canvas with hand-drawn vibes.
          </p>
        </div>

        {/* Create Room Button */}
        <button
          onClick={handleCreateRoom}
          className="w-full py-3.5 px-4 bg-[#6965db] hover:bg-[#5b57d1] active:scale-[0.98] cursor-pointer text-white font-medium rounded-2xl shadow-lg shadow-[#6965db]/30 transition-all duration-150 flex items-center justify-center gap-2 group"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:rotate-90 duration-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create a New Room
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
            or join existing
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Join Room Section */}
        <div className="flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Room Code (e.g. ab3k9z)"
              value={joinId ?? ""}
              onChange={(e) => setJoinId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && joinId && joinId.trim() !== "") {
                  onJoin(joinId.trim());
                }
              }}
              className="w-full py-3 px-4 bg-[#232329]/80 border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#6965db] focus:ring-2 focus:ring-[#6965db]/20 transition-all font-mono text-sm"
            />
          </div>

          <button
            onClick={() => {
              if (joinId && joinId.trim() !== "") {
                onJoin(joinId.trim());
              }
            }}
            disabled={!joinId || joinId.trim() === ""}
            className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer text-white font-medium rounded-2xl border border-white/10 transition-all duration-150 flex items-center justify-center gap-2"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default LobbyRoom;
