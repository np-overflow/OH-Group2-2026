"use client";

import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-cover bg-center" style={{ backgroundImage: "radial-gradient(circle at center, #ffffff 0%, #f0f4f8 100%)" }}>
      <main className="max-w-4xl w-full flex flex-col items-center gap-12 text-center animate-in fade-in zoom-in duration-700">

        {/* Glowing Container */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple opacity-30 blur-lg group-hover:opacity-50 transition duration-1000 animate-pulse-glow"></div>
          <div className="relative glass-panel rounded-2xl p-12 ring-1 ring-black/5 bg-white/70">

            {/* Icon */}
            <div className="flex justify-center mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-20 h-20 text-neon-blue drop-shadow-[0_0_5px_rgba(0,112,243,0.5)]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple drop-shadow-sm">
                Photobooth App
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 font-light max-w-lg mx-auto leading-relaxed">
                Capture the moment with our futuristic photobooth experience.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
