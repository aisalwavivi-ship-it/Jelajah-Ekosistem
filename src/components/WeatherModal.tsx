import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sun,
  Cloud,
  CloudRain,
  Sunset,
  Moon,
  Clock,
  Compass,
  Info,
  Thermometer,
  Droplets,
  Wind,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { WeatherType, WeatherMode, WEATHER_CONDITIONS, WeatherCondition } from '../utils/weather';
import { sound } from '../utils/audio';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeWeather: WeatherType;
  weatherMode: WeatherMode;
  onSelectMode: (mode: WeatherMode) => void;
  localTimeStr: string;
}

export const WeatherModal: React.FC<WeatherModalProps> = ({
  isOpen,
  onClose,
  activeWeather,
  weatherMode,
  onSelectMode,
  localTimeStr,
}) => {
  if (!isOpen) return null;

  const currentCondition: WeatherCondition = WEATHER_CONDITIONS[activeWeather];

  const weatherOptions: { type: WeatherType; label: string; icon: React.ReactNode; color: string }[] = [
    {
      type: 'sunny',
      label: 'Sinar Mentari Terik',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      color: 'hover:border-amber-400 hover:bg-amber-50',
    },
    {
      type: 'clouds',
      label: 'Awan Mendung Teduh',
      icon: <Cloud className="w-4 h-4 text-slate-500" />,
      color: 'hover:border-slate-400 hover:bg-slate-50',
    },
    {
      type: 'rain',
      label: 'Hujan Gerimis Sejuk',
      icon: <CloudRain className="w-4 h-4 text-sky-500" />,
      color: 'hover:border-sky-400 hover:bg-sky-50',
    },
    {
      type: 'sunset',
      label: 'Senja Keemasan',
      icon: <Sunset className="w-4 h-4 text-orange-500" />,
      color: 'hover:border-orange-400 hover:bg-orange-50',
    },
    {
      type: 'night',
      label: 'Malam Berbintang',
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
      color: 'hover:border-indigo-400 hover:bg-indigo-50',
    },
  ];

  const modalElement = (
    <AnimatePresence>
      <div
        id="modal-weather-backdrop"
        style={{ zIndex: 9998 }}
        className="fixed inset-0 flex items-center justify-center p-3 sm:p-5 bg-stone-950/75 backdrop-blur-xs overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            sound.playClick();
            onClose();
          }
        }}
      >
        <motion.div
          id="modal-weather-content"
          style={{ zIndex: 9999 }}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-3 border-amber-300 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        >
          {/* Header Modal - Identik dengan Header Riwayat Pengerjaan */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-amber-700 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl sm:text-3xl shadow-inner">
                {currentCondition.icon || '🌤️'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                    Simulasi Abiotik
                  </span>
                  <span className="text-xs text-emerald-200">
                    IPAS Bab 2
                  </span>
                </div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
                  Pilih Mode Cuaca Lingkungan
                </h2>
              </div>
            </div>

            <button
              id="btn-close-weather-modal"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Body - Bersih, Proporsional, & Bersahabat */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            
            {/* 1. KONDISI CUACA AKTIF SAAT INI (Gaya Card Utama Riwayat Pengerjaan) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kondisi Cuaca Saat Ini</span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Faktor Abiotik Aktif
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-50/90 via-emerald-50/40 to-teal-50/80 border-2 border-amber-300 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/80">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentCondition.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-base sm:text-lg text-stone-900">
                          {currentCondition.label}
                        </span>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                          ✓ Berjalan
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5">
                        {currentCondition.sublabel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Parameter Abiotik Metrics */}
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-3.5">
                  <div className="px-3 py-2 rounded-2xl bg-white/90 border border-amber-200 text-center shadow-xs">
                    <div className="flex items-center justify-center gap-1 text-amber-800 text-[10px] sm:text-[11px] font-bold">
                      <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                      <span>Suhu Udara</span>
                    </div>
                    <span className="font-display font-black text-sm sm:text-base text-amber-950 block mt-0.5">
                      {currentCondition.temperature}
                    </span>
                  </div>

                  <div className="px-3 py-2 rounded-2xl bg-white/90 border border-sky-200 text-center shadow-xs">
                    <div className="flex items-center justify-center gap-1 text-sky-800 text-[10px] sm:text-[11px] font-bold">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                      <span>Kelembapan</span>
                    </div>
                    <span className="font-display font-black text-sm sm:text-base text-sky-950 block mt-0.5">
                      {currentCondition.humidity}
                    </span>
                  </div>

                  <div className="px-3 py-2 rounded-2xl bg-white/90 border border-teal-200 text-center shadow-xs">
                    <div className="flex items-center justify-center gap-1 text-teal-800 text-[10px] sm:text-[11px] font-bold">
                      <Wind className="w-3.5 h-3.5 text-teal-600" />
                      <span>Angin</span>
                    </div>
                    <span className="font-display font-black text-sm sm:text-base text-teal-950 block mt-0.5">
                      {currentCondition.windSpeed}
                    </span>
                  </div>
                </div>

                {/* Educational Abiotic Fact Box */}
                <div className="mt-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/95 border border-emerald-200 text-emerald-950 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Pengaruh Terhadap Ekosistem:</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {currentCondition.abioticDescription}
                  </p>
                  <div className="pt-1.5 border-t border-emerald-100 text-[11px] font-medium text-emerald-800 italic">
                    {currentCondition.learningFact}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PILIH MODE CUACA LINGKUNGAN (DUA KARTU UTAMA) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>PILIH MODE CUACA LINGKUNGAN</span>
                </span>
                <span className="text-[11px] text-stone-500">
                  Mode Otomatis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Card 1: Jam Nyata Lokal */}
                <button
                  type="button"
                  id="btn-mode-auto-time"
                  onClick={() => {
                    sound.playClick();
                    onSelectMode('auto-time');
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3.5 cursor-pointer relative ${
                    weatherMode === 'auto-time'
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-white border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    weatherMode === 'auto-time'
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-stone-100 border-stone-200 text-stone-600'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-sm font-bold text-stone-900">Jam Nyata Lokal</span>
                      {weatherMode === 'auto-time' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Aktif
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-600 block">
                      Waktu saat ini: <strong className="text-stone-800 font-semibold">{localTimeStr}</strong>
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Cuaca berganti otomatis mengikuti waktu jam setempat
                    </span>
                  </div>
                </button>

                {/* Card 2: Alur Pos Misi */}
                <button
                  type="button"
                  id="btn-mode-auto-mission"
                  onClick={() => {
                    sound.playClick();
                    onSelectMode('auto-mission');
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3.5 cursor-pointer relative ${
                    weatherMode === 'auto-mission'
                      ? 'bg-emerald-50/90 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-white border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    weatherMode === 'auto-mission'
                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                      : 'bg-stone-100 border-stone-200 text-stone-600'
                  }`}>
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-sm font-bold text-stone-900">Alur Pos Misi</span>
                      {weatherMode === 'auto-mission' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Aktif
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-600 block">
                      Sesuai lokasi pos yang dijelajahi
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Menyesuaikan suasana habitat pos misi petualangan
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. PRESET SIMULASI CUACA TERTENTU */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Atau Uji Coba Cuaca Tertentu:</span>
                </span>
                <span className="text-[11px] text-stone-500">
                  Simulasi Manual
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {weatherOptions.map((opt) => {
                  const isCurrent = weatherMode === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onSelectMode(opt.type);
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${opt.color} ${
                        isCurrent
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 font-bold'
                          : 'bg-white border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{WEATHER_CONDITIONS[opt.type].icon}</span>
                        <span className="text-xs text-stone-800">{opt.label}</span>
                      </div>
                      {isCurrent ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 ring-2 ring-emerald-200" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Footer Modal - Seragam dengan Riwayat Pengerjaan */}
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <p className="text-[11px] text-stone-500 italic text-center sm:text-left">
              Faktor abiotik cuaca memengaruhi perilaku seluruh makhluk hidup.
            </p>
            <button
              id="btn-apply-weather-modal"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-full transition cursor-pointer shadow-sm active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <span>Terapkan & Tutup</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalElement, document.body) : modalElement;
};
