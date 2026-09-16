import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Award, CheckCircle2, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface DailyCheckInModalProps {
  isOpen: boolean;
  studentName: string;
  streak: number;
  bonusStars: number;
  isAlreadyClaimedToday: boolean;
  onClaimBonus: () => void;
  onClose: () => void;
}

const DAILY_SCIENCE_TIPS = [
  'Matahari adalah sumber energi utama yang menggerakkan seluruh kehidupan di ekosistem bumi!',
  'Tumbuhan hijau disebut produsen karena bisa memasak makanan sendiri melalui proses fotosintesis.',
  'Komponen abiotik seperti air dan tanah sangat menentukan jenis tumbuhan yang bisa hidup di suatu tempat.',
  'Katak, ikan, dan teratai di sebuah kolam saling bergantung membentuk satu komunitas perairan.',
  'Batu dan pasir di tepi sungai memberikan tempat persembunyian yang aman bagi hewan-hewan air kecil.',
  'Cacing tanah membantu menggemburkan tanah sehingga akar tanaman lebih mudah menyerap oksigen dan air.',
  'Keseimbangan ekosistem terjaga jika jumlah produsen selalu mencukupi kebutuhan hewan konsumen di atasnya.'
];

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  isOpen,
  studentName,
  streak,
  bonusStars,
  isAlreadyClaimedToday,
  onClaimBonus,
  onClose,
}) => {
  const [hasClaimedAnim, setHasClaimedAnim] = useState(false);

  if (!isOpen) return null;

  // Determine time-aware greeting
  const currentHour = new Date().getHours();
  let timeGreeting = 'Selamat Pagi';
  if (currentHour >= 11 && currentHour < 15) timeGreeting = 'Selamat Siang';
  else if (currentHour >= 15 && currentHour < 18) timeGreeting = 'Selamat Sore';
  else if (currentHour >= 18 || currentHour < 5) timeGreeting = 'Selamat Malam';

  // Get daily tip of the day based on day of month
  const dayIndex = new Date().getDate() % DAILY_SCIENCE_TIPS.length;
  const todayTip = DAILY_SCIENCE_TIPS[dayIndex];

  const handleClaim = () => {
    sound.playFanfare();
    sound.playStarEarned();
    setHasClaimedAnim(true);
    setTimeout(() => {
      onClaimBonus();
    }, 450);
  };

  // 7-day streak representation
  const daysOfWeek = ['H-1', 'H-2', 'H-3', 'H-4', 'H-5', 'H-6', 'H-7'];
  const currentStreakDay = ((streak - 1) % 7) + 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-emerald-300 shadow-2xl p-5 sm:p-7 max-w-lg w-full relative overflow-hidden text-stone-900"
        >
          {/* Decorative background aura */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Avatar Greeting */}
          <div className="text-center space-y-2 mt-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-amber-900 text-xs font-bold shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Check-in Kunjungan Harian</span>
            </div>

            <div className="text-4xl my-1 animate-bounce">🌟</div>

            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-950">
              {timeGreeting}, {studentName || 'Penjelajah Muda'}!
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
              Terima kasih sudah kembali bertualang di <strong>Jelajah Ekosistem</strong> hari ini!
            </p>
          </div>

          {/* Star Bonus Card */}
          <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border-2 border-amber-200 shadow-inner text-center space-y-1 relative">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-amber-800">
              Bonus Kunjungan Harian
            </span>
            <div className="flex items-center justify-center gap-2 text-3xl font-display font-black text-amber-600">
              <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
              <span>+{bonusStars} Bintang</span>
              <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-stone-500">
              {isAlreadyClaimedToday
                ? '✓ Bintang harian sudah berhasil kamu klaim hari ini!'
                : 'Bintang ini langsung ditambahkan ke koleksi bintang petualangmu.'}
            </p>
          </div>

          {/* 7-Day Streak Tracker */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs text-stone-600 font-bold px-1">
              <span>Jejak Hari Kehadiran</span>
              <span className="text-emerald-700 font-extrabold">
                🔥 {streak} Hari Berturut-turut!
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {daysOfWeek.map((dayLabel, idx) => {
                const dayNum = idx + 1;
                const isPassed = dayNum < currentStreakDay || isAlreadyClaimedToday && dayNum <= currentStreakDay;
                const isCurrent = dayNum === currentStreakDay && !isAlreadyClaimedToday;

                return (
                  <div
                    key={dayLabel}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                      isPassed
                        ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-300 ring-offset-1 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold block opacity-90">{dayLabel}</span>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-white" />
                    ) : isCurrent ? (
                      <span className="text-sm mt-0.5">⭐</span>
                    ) : (
                      <span className="text-xs mt-0.5 opacity-40">⚪</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Nature Tip */}
          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950 mb-5">
            <span className="text-lg shrink-0">💡</span>
            <div>
              <span className="font-bold block text-emerald-900 text-[11px] uppercase tracking-wide">
                Fakta Alam Hari Ini:
              </span>
              <p className="mt-0.5 leading-relaxed text-stone-700">
                {todayTip}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div>
            {!isAlreadyClaimedToday ? (
              <button
                id="btn-claim-daily-checkin"
                onClick={handleClaim}
                disabled={hasClaimedAnim}
                className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-display font-extrabold rounded-2xl shadow-lg transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-5 h-5 text-amber-300" />
                <span>{hasClaimedAnim ? 'Menambahkan Bintang...' : 'Klaim Bintang & Mulai Jelajah!'}</span>
              </button>
            ) : (
              <button
                id="btn-close-daily-checkin"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-full py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-display font-bold rounded-2xl shadow-md transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lanjutkan Petualangan</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
