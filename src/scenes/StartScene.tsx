import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, HelpCircle, Compass, Sparkles, BookOpen, Map, Footprints } from 'lucide-react';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { sound } from '../utils/audio';

interface StartSceneProps {
  playerName?: string;
  initialStudentName?: string;
  onUpdatePlayerName?: (name: string) => void;
  onStartAdventure?: () => void;
  onStart?: (name: string) => void;
  onOpenHowToPlay?: () => void;
  onOpenHelp?: () => void;
  onGoToMaterial?: () => void;
  onGoToMap?: () => void;
}

export const StartScene: React.FC<StartSceneProps> = ({
  playerName,
  initialStudentName,
  onUpdatePlayerName,
  onStartAdventure,
  onStart,
  onOpenHowToPlay,
  onOpenHelp,
  onGoToMaterial,
  onGoToMap,
}) => {
  const [localName, setLocalName] = useState(initialStudentName || playerName || '');

  const handleStart = () => {
    const finalName = localName.trim() || 'Penjelajah Muda';
    if (onUpdatePlayerName) {
      onUpdatePlayerName(finalName);
    }
    sound.playFootstep();
    if (onStartAdventure) {
      onStartAdventure();
    }
    if (onStart) {
      onStart(finalName);
    }
  };

  const handleOpenHelp = () => {
    sound.playClick();
    if (onOpenHowToPlay) {
      onOpenHowToPlay();
    } else if (onOpenHelp) {
      onOpenHelp();
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] w-full flex flex-col justify-between items-center px-4 pt-3 pb-8 sm:pt-6 sm:pb-12 z-10">
      
      {/* 
        MAIN CONTENT POSITIONED IN THE SKY / RELATIVELY EMPTY UPPER REGION
        This leaves the school building, trees, natural pond, and the winding 
        earthen walking trail below completely visible!
      */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-7 border-2 border-emerald-200/80 shadow-2xl shadow-emerald-950/10 text-center relative z-20 space-y-4"
      >
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-100/90 border border-emerald-300 rounded-full text-emerald-900 text-xs sm:text-sm font-bold shadow-xs">
          <span>🌿</span>
          <span>Media Pembelajaran IPAS Kelas V SD</span>
        </div>

        {/* Main Title: JELAJAH EKOSISTEM */}
        <div className="space-y-1">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-emerald-950 tracking-tight leading-tight flex items-center justify-center gap-2">
            <span>JELAJAH EKOSISTEM</span>
          </h1>
          {/* Subtitle */}
          <p className="font-medium text-stone-700 text-xs sm:text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Petualangan seru mengenal ekosistem, komponen biotik, dan komponen abiotik di alam sekitar kita.
          </p>
        </div>

        {/* Explorer Student Input & Guide */}
        <div className="bg-amber-50/85 rounded-2xl p-3.5 border border-amber-200/90 flex flex-col sm:flex-row items-center gap-3 text-left">
          <div className="shrink-0 flex items-center gap-2">
            <CharacterAvatar size="md" isCelebrating={true} />
            <div className="sm:hidden">
              <span className="font-display font-bold text-xs text-emerald-950 block">
                Dara Si Penjelajah
              </span>
              <span className="text-[10px] text-stone-500">Pemandu Petualangan</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <span>🎒 Siapakah Namamu?</span>
              </span>
              <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                Kelas 5 SD
              </span>
            </div>

            <input
              id="input-player-name"
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Ketik nama siswa penjelajah..."
              maxLength={24}
              className="w-full px-3.5 py-2 bg-white/95 border border-amber-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-stone-800 shadow-2xs"
            />
          </div>
        </div>

        {/* Primary Action Button: MULAI PETUALANGAN */}
        <div className="space-y-2 pt-1">
          <motion.button
            id="btn-start-adventure"
            onClick={handleStart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 sm:py-4 px-6 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-lg shadow-emerald-800/25 border-2 border-emerald-400/50 flex items-center justify-center gap-2.5 transition cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>MULAI PETUALANGAN</span>
          </motion.button>

          {/* Secondary Quick Navigation Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {onGoToMaterial && (
              <button
                id="btn-start-material"
                onClick={() => {
                  sound.playClick();
                  onGoToMaterial();
                }}
                className="py-2 px-2 bg-white/90 hover:bg-white text-emerald-950 font-display font-bold text-[11px] sm:text-xs rounded-xl border border-emerald-300/80 shadow-xs flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>Materi</span>
              </button>
            )}

            {onGoToMap && (
              <button
                id="btn-start-map"
                onClick={() => {
                  sound.playClick();
                  onGoToMap();
                }}
                className="py-2 px-2 bg-white/90 hover:bg-white text-emerald-950 font-display font-bold text-[11px] sm:text-xs rounded-xl border border-emerald-300/80 shadow-xs flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
              >
                <Map className="w-3.5 h-3.5 text-emerald-700" />
                <span>Peta Jalan</span>
              </button>
            )}

            <button
              id="btn-how-to-play-start"
              onClick={handleOpenHelp}
              className="py-2 px-2 bg-white/90 hover:bg-white text-amber-950 font-display font-bold text-[11px] sm:text-xs rounded-xl border border-amber-300/80 shadow-xs flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Cara Main</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 
        SPACIOUS LOWER VIEWPORT:
        Allows the background world's elements (Sekolah Dasar on the left, 
        winding jalan setapak in the center/foreground, pond, and lush trees) 
        to remain open, scenic, and inviting!
      */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 sm:mt-16 text-center relative z-20 pointer-events-none"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-900/60 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-md border border-white/20">
          <Footprints className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
          <span>Ikuti jalan setapak di alam bebas untuk menyelesaikan 8 Misi Ekosistem!</span>
        </div>
      </motion.div>

    </div>
  );
};
