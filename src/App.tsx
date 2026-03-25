/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Neon Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <header className="mb-8 text-center z-10 flex flex-col items-center">
        <div className="w-80 h-14 bg-gradient-to-r from-cyan-400 to-fuchsia-500"></div>
        <p className="text-cyan-200/60 mt-4 tracking-widest text-sm uppercase font-mono">
          Snake & Synthwave
        </p>
      </header>

      <main className="flex flex-col items-center justify-center gap-12 w-full max-w-6xl z-10">
        <div className="flex justify-center w-full">
          <SnakeGame />
        </div>
        
        <div className="flex justify-center w-full">
          <MusicPlayer />
        </div>
      </main>

      <footer className="mt-12 text-center text-xs text-neutral-600 font-mono z-10">
        <p>Use Arrow Keys to move. Space to pause.</p>
        <p className="mt-1">Music by SoundHelix</p>
      </footer>
    </div>
  );
}
