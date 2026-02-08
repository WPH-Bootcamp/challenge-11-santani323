"use client";


import { useState } from "react";
import { motion } from "motion/react";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";


type PlayerState = "playing" | "paused" | "loading";

export function MusicPlayer() {
 
  const [playerState, setPlayerState] = useState<PlayerState>("paused");
  const [progress] = useState(83); 
  const duration = 225;  
  const [volume, setVolume] = useState(70);

  // Handler play/pause
  const handlePlayPause = () => {
    if (playerState === "loading") return;
    setPlayerState("loading");
    setTimeout(() => {
      setPlayerState((prev) => (prev === "playing" ? "paused" : "playing"));
    }, 500);
  };

  // Format waktu mm:ss
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

 
  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center min-h-100">
      <motion.div
        className={cn(
          "w-full rounded-2xl p-16 shadow-lg flex flex-col items-center bg-[#181926] relative",
          "transition-colors duration-300"
        )}
        animate={playerState}
        variants={{
          playing: { backgroundColor: "#181926", boxShadow: "0 0 32px 0 #a855f7aa" },
          paused: { backgroundColor: "#181926", boxShadow: "0 0 16px 0 #2224" },
          loading: { backgroundColor: "#181926", boxShadow: "0 0 24px 0 #a855f766" },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
 
        <div className="flex gap-8 items-center w-full">
          <motion.div
            className="rounded-xl overflow-hidden w-28 h-28 flex items-center justify-center bg-linear-to-br from-purple-500 to-pink-500"
            animate={playerState}
            variants={{
              playing: { scale: 1, rotate: 360 },
              paused: { scale: 0.95, rotate: 0 },
              loading: { scale: 0.9, rotate: 0 },
            }}
            transition={{
              scale: { type: "spring", duration: 0.3 },
              rotate: playerState === "playing" ? { repeat: Infinity, duration: 20, ease: "linear" } : { duration: 0.3 },
            }}
            style={{ willChange: "transform" }}
          >
            <Image src="/music-note.svg" alt="Album Art" width={64} height={64} />
          </motion.div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Awesome Song Title</h2>
            <p className="text-gray-400">Amazing Artist</p>
   
            <div className="flex gap-1 mt-4 h-4 items-end">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 rounded bg-purple-500"
                  animate={playerState}
                  variants={{
                    playing: { height: "100%", opacity: 1 },
                    paused: { height: "20%", opacity: 1 },
                    loading: { height: "50%", opacity: 0.5 },
                  }}
                  transition={{
                    height: {
                      duration: 0.5,
                      repeat: playerState === "playing" ? Infinity : 0,
                      repeatType: "reverse",
                      delay: i * 0.1,
                      ease: "easeInOut",
                    },
                    opacity: { duration: 0.3 },
                  }}
                  style={{ minHeight: 8, maxHeight: 16 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-8">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-2 rounded-full"
              style={{ background: playerState === "playing" ? "#a855f7" : "#6b7280" }}
              animate={{ width: `${(progress / duration) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button className="hover:text-white text-gray-400 transition-colors">
            <Shuffle size={24} />
          </button>
          <button className="hover:text-white text-gray-400 transition-colors">
            <SkipBack size={28} />
          </button>
          <motion.button
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center bg-purple-600 text-white shadow-lg",
              playerState === "loading" && "bg-gray-500 cursor-not-allowed"
            )}
            whileHover={{ scale: playerState === "loading" ? 1 : 1.05 }}
            whileTap={{ scale: playerState === "loading" ? 1 : 0.95 }}
            onClick={handlePlayPause}
            disabled={playerState === "loading"}
            transition={{ type: "spring" }}
          >
            {playerState === "playing" ? <Pause size={32} /> : <Play size={32} />}
          </motion.button>
          <button className="hover:text-white text-gray-400 transition-colors">
            <SkipForward size={28} />
          </button>
          <button className="hover:text-white text-gray-400 transition-colors">
            <Repeat size={24} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-full mt-8">
          <Volume2 className="text-gray-400" size={20} />
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden relative group cursor-pointer">
            <motion.div
              className="h-2 rounded-full absolute top-0 left-0"
              style={{ background: "#a855f7" }}
              animate={{ width: `${volume}%` }}
              transition={{ duration: 0.2 }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2 opacity-0 absolute top-0 left-0 cursor-pointer"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
