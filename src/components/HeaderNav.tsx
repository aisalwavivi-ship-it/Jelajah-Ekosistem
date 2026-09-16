import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Map, 
  Award, 
  BookOpen, 
  Music, 
  Home, 
  Target, 
  Trophy, 
  User,
  Sun,
  Sparkles,
  ChevronDown,
  Calendar
} from 'lucide-react';
import { AppScene, MissionId } from '../types';
import { sound } from '../utils/audio';
import { getExplorerLevel } from '../utils/levels';
import { StudentLevelModal } from './StudentLevelModal';
import { WeatherType, WeatherMode, WEATHER_CONDITIONS } from '../utils/weather';
import { WeatherModal } from './WeatherModal';
import { MISSIONS_DATA } from '../data/missions';

interface HeaderNavProps {
  stars: number;
  playerName?: string;
  soundEnabled?: boolean;
  isMuted?: boolean;
  onToggleSound?: () => void;
  onToggleMute?: () => void;
  onOpenHowToPlay?: () => void;
  onOpenHelp?: () => void;
  onGoToStart?: () => void;
  onGoToMap: () => void;
  onGoToMaterial?: () => void;
  onGoToMissions?: (missionId?: MissionId) => void;
  onGoToQuiz?: () => void;
  currentScene: AppScene;
  onResetGame?: () => void;
  onOpenCertificate?: () => void;
  isCertificateUnlocked?: boolean;
  onOpenJournal?: () => void;
  completedCount?: number;
  completedMissions?: Record<MissionId, boolean>;
  isMusicPlaying?: boolean;
  onToggleMusic?: () => void;
  activeWeather?: WeatherType;
  weatherMode?: WeatherMode;
  onChangeWeatherMode?: (mode: WeatherMode) => void;
  localTimeStr?: string;
  onOpenDailyCheckIn?: () => void;
  isDailyClaimedToday?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  stars,
  playerName,
  soundEnabled,
  isMuted,
  onToggleSound,
  onToggleMute,
  onOpenHowToPlay,
  onOpenHelp,
  onGoToStart,
  onGoToMap,
  onGoToMaterial,
  onGoToMissions,
  onGoToQuiz,
  currentScene,
  onOpenCertificate,
  isCertificateUnlocked,
  onOpenJournal,
  completedCount = 0,
  completedMissions = {},
  isMusicPlaying = false,
  onToggleMusic,
  activeWeather = 'sunny',
  weatherMode = 'auto-time',
  onChangeWeatherMode,
  localTimeStr = '',
  onOpenDailyCheckIn,
  isDailyClaimedToday = false,
}) => {
  const [isLevelModalOpen, setIsLevelModalOpen] = useState<boolean>(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState<boolean>(false);
  const [isMissionsMenuOpen, setIsMissionsMenuOpen] = useState<boolean>(false);

  const explorerLevel = getExplorerLevel(stars);
  const currentWeatherCond = WEATHER_CONDITIONS[activeWeather];
  const isSoundActive = soundEnabled !== undefined ? soundEnabled : !isMuted;

  const handleToggleSound = () => {
    sound.playClick();
    if (onToggleSound) {
      onToggleSound();
    } else if (onToggleMute) {
      onToggleMute();
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

  const isHomeActive = currentScene === 'start';
  const isMapActive = currentScene === 'map';
  const isMaterialActive = currentScene === 'material';
  const isMissionActive = currentScene.startsWith('mission-');
  const isQuizActive = currentScene === 'quiz';

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-emerald-200/80 shadow-sm sticky top-0 z-30 px-3 sm:px-5 py-2">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Top / Left Section: Brand Logo & Title */}
        <div className="w-full md:w-auto flex items-center justify-between gap-3">
          <div
            onClick={() => {
              sound.playClick();
              if (onGoToStart) onGoToStart();
              else onGoToMap();
            }}
            className="cursor-pointer flex items-center gap-2 group"
            title="Beranda Jelajah Ekosistem"
          >
            <span className="text-2xl transform group-hover:scale-110 transition-transform">
              🌿
            </span>
            <div>
              <h1 className="font-display font-black text-sm sm:text-base text-emerald-950 tracking-tight leading-tight flex items-center gap-1.5">
                Jelajah Ekosistem
                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 hidden sm:inline-block">
                  IPAS Kelas V
                </span>
              </h1>
              <p className="text-[10px] text-stone-500 hidden sm:block">
                Harmoni Biotik & Abiotik
              </p>
            </div>
          </div>

          {/* Quick status on mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Star count pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full shadow-2xs">
              <span className="text-xs">⭐</span>
              <span className="font-display font-bold text-amber-900 text-xs">
                {stars}
              </span>
            </div>

            {/* Profile trigger */}
            <button
              id="btn-header-profile-mobile"
              type="button"
              onClick={() => {
                sound.playClick();
                setIsLevelModalOpen(true);
              }}
              className="p-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center"
              title="Profil Petualang"
            >
              <span>{explorerLevel.icon}</span>
            </button>
          </div>
        </div>

        {/* 
          CENTRAL MAIN NAVIGATION BAR:
          Mandated Navigation Items:
          1. Beranda
          2. Peta/Jelajah
          3. Materi
          4. Misi
          5. Kuis
          6. Profil/Progres
        */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full scrollbar-none py-0.5">
          {/* 1. Beranda */}
          <button
            id="nav-btn-home"
            onClick={() => {
              sound.playClick();
              if (onGoToStart) onGoToStart();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-display text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap ${
              isHomeActive
                ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-300'
                : 'bg-stone-100/90 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200/70'
            }`}
            title="Halaman Beranda"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </button>

          {/* 2. Peta/Jelajah */}
          <button
            id="nav-btn-map"
            onClick={() => {
              sound.playClick();
              onGoToMap();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-display text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap ${
              isMapActive
                ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-300'
                : 'bg-stone-100/90 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200/70'
            }`}
            title="Peta Petualangan Jalan Setapak"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Peta</span>
          </button>

          {/* 3. Materi */}
          <button
            id="nav-btn-material"
            onClick={() => {
              sound.playClick();
              if (onGoToMaterial) onGoToMaterial();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-display text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap ${
              isMaterialActive
                ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-300'
                : 'bg-stone-100/90 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200/70'
            }`}
            title="Halaman Materi & Ensiklopedi Sains"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Materi</span>
          </button>

          {/* 4. Misi (with dropdown / quick jump) */}
          <div className="relative">
            <button
              id="nav-btn-missions"
              onClick={() => {
                sound.playClick();
                if (isMissionActive) {
                  setIsMissionsMenuOpen(!isMissionsMenuOpen);
                } else {
                  if (onGoToMissions) onGoToMissions();
                  else onGoToMap();
                }
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl font-display text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap ${
                isMissionActive
                  ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-300'
                  : 'bg-stone-100/90 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200/70'
              }`}
              title="8 Misi Petualangan Ekosistem"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Misi</span>
              {completedCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isMissionActive ? 'bg-amber-300 text-amber-950' : 'bg-emerald-200 text-emerald-950'
                }`}>
                  {completedCount}/8
                </span>
              )}
            </button>

            {/* Quick mission selector popover */}
            {isMissionsMenuOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-200 p-2 z-50 space-y-1">
                <div className="text-[10px] font-bold text-stone-500 uppercase px-2 py-1">
                  Pilih Misi Petualangan:
                </div>
                {MISSIONS_DATA.map((m) => {
                  const isDone = completedMissions[m.id];
                  const isCur = currentScene === `mission-${m.id}`;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        sound.playClick();
                        setIsMissionsMenuOpen(false);
                        if (onGoToMissions) onGoToMissions(m.id);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                        isCur
                          ? 'bg-emerald-100 text-emerald-950 font-bold'
                          : 'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{m.icon}</span>
                        <span className="truncate">M{m.id}: {m.title}</span>
                      </span>
                      {isDone && <span className="text-emerald-600 font-bold text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Kuis */}
          <button
            id="nav-btn-quiz"
            onClick={() => {
              sound.playStarEarned();
              if (onGoToQuiz) onGoToQuiz();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-display text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap ${
              isQuizActive
                ? 'bg-amber-500 text-stone-950 shadow-xs ring-2 ring-amber-300'
                : 'bg-stone-100/90 hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200/70'
            }`}
            title="Evaluasi Tantangan Kuis Penjelajah"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Kuis</span>
          </button>

          {/* 6. Profil/Progres */}
          <button
            id="nav-btn-profile"
            onClick={() => {
              sound.playClick();
              setIsLevelModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-display text-xs font-bold bg-stone-100/90 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200/70 transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap"
            title="Profil & Tingkatan Progres Petualang"
          >
            <User className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Profil/Progres</span>
            <span className="sm:hidden">Profil</span>
            <span className="text-[10px] font-black text-amber-600">⭐{stars}</span>
          </button>
        </nav>

        {/* Right Section: Sound, Music, Weather & Modals */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {/* Weather Abiotic Factor Pill */}
          <button
            id="btn-header-weather"
            type="button"
            onClick={() => {
              sound.playClick();
              setIsWeatherModalOpen(true);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-2xl border transition text-left cursor-pointer shadow-2xs ${
              activeWeather === 'sunny'
                ? 'bg-amber-50/90 border-amber-300 text-amber-950 hover:bg-amber-100'
                : 'bg-sky-50/90 border-sky-300 text-sky-950 hover:bg-sky-100'
            }`}
            title={`Cuaca & Faktor Abiotik: ${currentWeatherCond.label}`}
          >
            <span className="text-sm">{currentWeatherCond.icon}</span>
            <span className="text-[11px] font-bold">{currentWeatherCond.label}</span>
          </button>

          {/* Jurnal Button */}
          {onOpenJournal && (
            <button
              id="btn-header-journal"
              onClick={() => {
                sound.playClick();
                onOpenJournal();
              }}
              className="p-1.5 bg-amber-100/90 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl transition shadow-2xs"
              title="Jurnal Penjelajah"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}

          {/* Daily Check-in Button */}
          {onOpenDailyCheckIn && (
            <button
              id="btn-header-daily-checkin"
              onClick={() => {
                sound.playClick();
                onOpenDailyCheckIn();
              }}
              className={`p-1.5 rounded-xl border transition shadow-2xs relative cursor-pointer ${
                isDailyClaimedToday
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-400'
              }`}
              title="Bonus Kunjungan Harian (Daily Check-in)"
            >
              <Calendar className="w-4 h-4" />
              {!isDailyClaimedToday && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>
          )}

          {/* Background Nature Music */}
          {onToggleMusic && (
            <button
              id="btn-toggle-bgm"
              onClick={() => {
                sound.playClick();
                onToggleMusic();
              }}
              className={`p-1.5 rounded-xl border transition shadow-2xs ${
                isMusicPlaying
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-stone-100 text-stone-400 border-stone-200'
              }`}
              title={isMusicPlaying ? 'Matikan Musik Alam' : 'Putar Musik Alam'}
            >
              <Music className="w-4 h-4" />
            </button>
          )}

          {/* Sound FX Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={handleToggleSound}
            className={`p-1.5 rounded-xl border transition shadow-2xs ${
              isSoundActive
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-stone-100 text-stone-400 border-stone-200'
            }`}
            title={isSoundActive ? 'Efek Suara Aktif' : 'Efek Suara Mati'}
          >
            {isSoundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Petunjuk / Cara Main */}
          <button
            id="btn-how-to-play"
            onClick={handleOpenHelp}
            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-xl transition shadow-2xs"
            title="Cara Bermain & Petunjuk"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Modals */}
      <StudentLevelModal
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        playerName={playerName || 'Penjelajah Muda'}
        stars={stars}
      />

      <WeatherModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        activeWeather={activeWeather}
        weatherMode={weatherMode}
        onSelectMode={(newMode) => {
          if (onChangeWeatherMode) {
            onChangeWeatherMode(newMode);
          }
        }}
        localTimeStr={localTimeStr}
      />
    </header>
  );
};
