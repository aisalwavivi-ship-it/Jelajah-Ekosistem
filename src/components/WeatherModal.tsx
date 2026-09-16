import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sun, Cloud, CloudRain, Sunset, Moon, Clock, Compass, Info, Thermometer, Droplets, Wind, Sparkles } from 'lucide-react';
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-emerald-200 overflow-hidden flex flex-col max-h-[90vh]"
          id="modal-weather-simulator"
        >
          {/* Top Banner Card */}
          <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-sky-900 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-3xl shadow-inner">
                  {currentCondition.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                      Simulasi Cuaca & Faktor Abiotik
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                      IPAS Bab 2
                    </span>
                  </div>
                  <h2 className="font-display font-black text-xl sm:text-2xl text-white leading-tight">
                    {currentCondition.label}
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

            {/* Subtitle / Ecological context */}
            <p className="mt-2 text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
              {currentCondition.sublabel}
            </p>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
            {/* Abiotic Parameters Bar */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col items-center text-center">
                <div className="flex items-center gap-1 text-amber-800 text-[11px] font-bold">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                  <span>Suhu Udara</span>
                </div>
                <span className="font-display font-black text-lg text-amber-950 mt-0.5">
                  {currentCondition.temperature}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-sky-50/80 border border-sky-200 flex flex-col items-center text-center">
                <div className="flex items-center gap-1 text-sky-800 text-[11px] font-bold">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  <span>Kelembapan</span>
                </div>
                <span className="font-display font-black text-lg text-sky-950 mt-0.5">
                  {currentCondition.humidity}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/80 border border-teal-200 flex flex-col items-center text-center">
                <div className="flex items-center gap-1 text-teal-800 text-[11px] font-bold">
                  <Wind className="w-3.5 h-3.5 text-teal-600" />
                  <span>Hembusan Angin</span>
                </div>
                <span className="font-display font-black text-lg text-teal-950 mt-0.5">
                  {currentCondition.windSpeed}
                </span>
              </div>
            </div>

            {/* Educational Abiotic Fact Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-300 text-emerald-950 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Pengaruh Terhadap Ekosistem:</span>
              </div>
              <p className="text-xs text-emerald-900/90 leading-relaxed">
                {currentCondition.abioticDescription}
              </p>
              <div className="pt-1.5 border-t border-emerald-200/80 text-[11px] font-medium text-emerald-800 italic">
                {currentCondition.learningFact}
              </div>
            </div>

            {/* Mode Selection Options */}
            <div>
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pilih Mode Cuaca Lingkungan</span>
              </h3>

              {/* Automatic Modes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {/* Auto Time */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSelectMode('auto-time');
                  }}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    weatherMode === 'auto-time'
                      ? 'bg-emerald-100/80 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900">Jam Nyata Lokal</span>
                      {weatherMode === 'auto-time' && (
                        <span className="px-1.5 py-0.2 rounded-md bg-emerald-700 text-white text-[9px] font-bold">
                          Aktif
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 block">
                      Waktu saat ini: {localTimeStr}
                    </span>
                  </div>
                </button>

                {/* Auto Mission */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSelectMode('auto-mission');
                  }}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    weatherMode === 'auto-mission'
                      ? 'bg-emerald-100/80 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-stone-300 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900">Alur Pos Misi</span>
                      {weatherMode === 'auto-mission' && (
                        <span className="px-1.5 py-0.2 rounded-md bg-emerald-700 text-white text-[9px] font-bold">
                          Aktif
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 block">
                      Sesuai lokasi pos yang dijelajahi
                    </span>
                  </div>
                </button>
              </div>

              {/* Manual Weather Preset Tiles */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-stone-500 block">
                  Atau Uji Coba Cuaca Tertentu:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30 font-bold'
                            : 'bg-stone-50/70 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{WEATHER_CONDITIONS[opt.type].icon}</span>
                          <span className="text-xs text-stone-800">{opt.label}</span>
                        </div>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
            <p className="text-[11px] text-stone-500 italic">
              Faktor abiotik cuaca memengaruhi perilaku seluruh makhluk hidup.
            </p>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-xs active:scale-95"
            >
              Terapkan & Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
