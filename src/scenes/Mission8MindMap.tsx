import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Map,
  Layers,
  HelpCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { sound } from '../utils/audio';

interface Mission8Props {
  onComplete: (points: number) => void;
  onGoToMap: () => void;
  onNextMission: () => void;
}

interface PyramidTier {
  tierId: number; // 4: Puncak, 3: Konsumen II, 2: Konsumen I, 1: Produsen
  title: string;
  category: string;
  expectedCardId: string;
  example: string;
  roleHint: string;
  widthClass: string;
  accentBorder: string;
  accentBg: string;
  filledBg: string;
}

interface PyramidCard {
  id: string;
  name: string;
  type: 'trofik' | 'abiotik';
  tier?: number;
  image: string;
  icon: string;
  role: string;
  desc: string;
  distractorReason?: string;
}

const PYRAMID_TIERS: PyramidTier[] = [
  {
    tierId: 4,
    title: 'TINGKAT 4 — PUNCAK',
    category: 'KONSUMEN III',
    expectedCardId: 'card_elang',
    example: 'Burung Elang',
    roleHint: 'Predator tingkat tertinggi yang memangsa konsumen sebelumnya',
    widthClass: 'w-full sm:w-[50%] md:w-[44%]',
    accentBorder: 'border-rose-400',
    accentBg: 'bg-rose-50/90 hover:bg-rose-100/90',
    filledBg: 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-400'
  },
  {
    tierId: 3,
    title: 'TINGKAT 3',
    category: 'KONSUMEN II',
    expectedCardId: 'card_katak',
    example: 'Katak Hijau',
    roleHint: 'Karnivora/pemakan hewan tingkat pertama (pemakan serangga)',
    widthClass: 'w-full sm:w-[68%] md:w-[62%]',
    accentBorder: 'border-amber-400',
    accentBg: 'bg-amber-50/90 hover:bg-amber-100/90',
    filledBg: 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-400'
  },
  {
    tierId: 2,
    title: 'TINGKAT 2',
    category: 'KONSUMEN I',
    expectedCardId: 'card_belalang',
    example: 'Belalang',
    roleHint: 'Herbivora yang memakan langsung tumbuhan hijau (produsen)',
    widthClass: 'w-full sm:w-[84%] md:w-[80%]',
    accentBorder: 'border-lime-400',
    accentBg: 'bg-lime-50/90 hover:bg-lime-100/90',
    filledBg: 'bg-gradient-to-r from-lime-50 to-emerald-50 border-lime-400'
  },
  {
    tierId: 1,
    title: 'TINGKAT 1 — DASAR',
    category: 'PRODUSEN',
    expectedCardId: 'card_tumbuhan',
    example: 'Tumbuhan Hijau',
    roleHint: 'Menghasilkan makanan sendiri melalui proses fotosintesis',
    widthClass: 'w-full sm:w-[98%] md:w-[96%]',
    accentBorder: 'border-emerald-500',
    accentBg: 'bg-emerald-50/90 hover:bg-emerald-100/90',
    filledBg: 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-500'
  }
];

const CARDS_DATA: PyramidCard[] = [
  // 4 Kartu Tingkat Trofik
  {
    id: 'card_tumbuhan',
    name: 'Tumbuhan Hijau',
    type: 'trofik',
    tier: 1,
    image: '/misi8/tumbuhan-hijau.jpg',
    icon: '🌿',
    role: 'PRODUSEN',
    desc: 'Menghasilkan energi dari sinar matahari untuk seluruh rantai makanan.'
  },
  {
    id: 'card_belalang',
    name: 'Belalang',
    type: 'trofik',
    tier: 2,
    image: '/misi8/belalang.jpg',
    icon: '🦗',
    role: 'KONSUMEN I',
    desc: 'Herbivora yang memakan daun dan rerumputan hijau.'
  },
  {
    id: 'card_katak',
    name: 'Katak',
    type: 'trofik',
    tier: 3,
    image: '/misi6/katak-hijau.png',
    icon: '🐸',
    role: 'KONSUMEN II',
    desc: 'Karnivora kecil pemakan serangga seperti belalang.'
  },
  {
    id: 'card_elang',
    name: 'Elang',
    type: 'trofik',
    tier: 4,
    image: '/misi8/elang.jpg',
    icon: '🦅',
    role: 'KONSUMEN III',
    desc: 'Predator puncak pemangsa katak, tikus, atau ular.'
  },

  // 4 Kartu Pengecoh (Komponen Abiotik)
  {
    id: 'distractor_air',
    name: 'Air',
    type: 'abiotik',
    image: '/misi6/air-bersih.png',
    icon: '💧',
    role: 'Bukan Trofik (Abiotik)',
    desc: 'Zat cair tak hidup yang dibutuhkan makhluk hidup untuk minum.',
    distractorReason: 'Air adalah komponen abiotik (tak hidup), bukan tingkat trofik piramida makanan!'
  },
  {
    id: 'distractor_tanah',
    name: 'Tanah',
    type: 'abiotik',
    image: '/misi6/tanah-subur.png',
    icon: '🪴',
    role: 'Bukan Trofik (Abiotik)',
    desc: 'Lapisan mineral dan humus tempat tumbuhnya tanaman.',
    distractorReason: 'Tanah adalah media abiotik, bukan makhluk hidup di tingkatan trofik piramida!'
  },
  {
    id: 'distractor_batu',
    name: 'Batu',
    type: 'abiotik',
    image: '/misi6/batu-taman.png',
    icon: '🪨',
    role: 'Bukan Trofik (Abiotik)',
    desc: 'Benda padat keras dan mati di lingkungan ekosistem.',
    distractorReason: 'Batu adalah benda abiotik tak bernyawa, tidak memiliki peran rantai makanan!'
  },
  {
    id: 'distractor_matahari',
    name: 'Cahaya Matahari',
    type: 'abiotik',
    image: '/misi6/cahaya-matahari.png',
    icon: '☀️',
    role: 'Bukan Trofik (Abiotik)',
    desc: 'Sumber energi alami yang membantu proses fotosintesis.',
    distractorReason: 'Cahaya matahari adalah energi abiotik, sedangkan piramida trofik diisi organisme hidup!'
  }
];

export const Mission8MindMap: React.FC<Mission8Props> = ({
  onComplete,
  onGoToMap,
  onNextMission,
}) => {
  // State: placedMap maps tierId (number) -> cardId (string)
  const [placedMap, setPlacedMap] = useState<Record<number, string>>({});
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [shakingTierId, setShakingTierId] = useState<number | null>(null);
  const [shakingCardId, setShakingCardId] = useState<string | null>(null);

  // Dynamic Dara speech feedback
  const [daraDialog, setDaraDialog] = useState<{
    text: string;
    type: 'default' | 'error' | 'success';
  }>({
    text: 'Yuk, susun piramida ekosistem dari dasar sampai puncak! 🌱',
    type: 'default',
  });

  useEffect(() => {
    sound.startSoundscape('forest');
    return () => {
      sound.stopSoundscape();
    };
  }, []);

  const placedCount = Object.keys(placedMap).length;

  // Process a card placement on a tier
  const handleAttemptPlacement = (tierId: number, cardId: string) => {
    const tier = PYRAMID_TIERS.find((t) => t.tierId === tierId);
    const card = CARDS_DATA.find((c) => c.id === cardId);

    if (!tier || !card) return;

    // Check if card is an abiotic distractor
    if (card.type === 'abiotik') {
      sound.playWrong();
      setShakingCardId(cardId);
      setShakingTierId(tierId);
      setTimeout(() => {
        setShakingCardId(null);
        setShakingTierId(null);
      }, 600);

      setDaraDialog({
        text: card.distractorReason || 'Kartu ini adalah komponen abiotik, bukan tingkat trofik!',
        type: 'error'
      });
      return;
    }

    // Check if card matches this tier
    if (card.id === tier.expectedCardId) {
      sound.playCorrect();
      const updated = { ...placedMap, [tierId]: card.id };
      setPlacedMap(updated);
      setSelectedCardId(null);
      setDraggedCardId(null);

      // Check for completion
      if (Object.keys(updated).length === PYRAMID_TIERS.length && !hasCompleted) {
        setHasCompleted(true);
        sound.playFanfare();
        onComplete(20);
        setDaraDialog({
          text: 'Hebat! Kamu berhasil menyusun tingkat trofik dengan tepat! ⭐',
          type: 'success'
        });
      } else {
        setDaraDialog({
          text: `Tepat sekali! ${card.name} adalah ${tier.category}. Lanjutkan susun tingkat lainnya! ✨`,
          type: 'success'
        });
      }
    } else {
      // Wrong tier for a valid trophic card
      sound.playWrong();
      setShakingCardId(cardId);
      setShakingTierId(tierId);
      setTimeout(() => {
        setShakingCardId(null);
        setShakingTierId(null);
      }, 600);

      setDaraDialog({
        text: `Kurang tepat! ${card.name} berperan sebagai ${card.role}, bukan di ${tier.category}. Coba letakkan di tingkat yang sesuai ya!`,
        type: 'error'
      });
    }
  };

  // Click on slot handler (for click-to-place support)
  const handleSlotClick = (tierId: number) => {
    if (placedMap[tierId]) return; // already filled
    if (!selectedCardId) {
      sound.playClick();
      setDaraDialog({
        text: 'Pilih kartu di bawah terlebih dahulu, lalu klik tingkat piramida ini!',
        type: 'default'
      });
      return;
    }
    handleAttemptPlacement(tierId, selectedCardId);
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedCardId(cardId);
    setSelectedCardId(cardId);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, tierId: number) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain') || draggedCardId;
    if (cardId) {
      handleAttemptPlacement(tierId, cardId);
    }
  };

  // Reset challenge
  const handleReset = () => {
    sound.playClick();
    setPlacedMap({});
    setSelectedCardId(null);
    setDraggedCardId(null);
    setHasCompleted(false);
    setDaraDialog({
      text: 'Yuk, susun piramida ekosistem dari dasar sampai puncak! 🌱',
      type: 'default'
    });
  };

  // Available cards (not placed yet)
  const availableCards = CARDS_DATA.filter(
    (c) => !Object.values(placedMap).includes(c.id)
  );

  return (
    <div className="min-h-[calc(100vh-115px)] w-full p-3 sm:p-6 flex flex-col justify-between relative z-10">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        {/* Header Box */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-300/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-300 flex items-center justify-center text-2xl text-white shadow-sm shrink-0">
              🔺
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  Misi 8
                </span>
                <h2 className="font-display font-black text-lg sm:text-xl text-stone-900 tracking-tight">
                  Tantangan Susun Piramida Ekosistem
                </h2>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm font-medium mt-0.5">
                Susun tingkat trofik ekosistem dari dasar hingga puncak!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                Tingkat Terisi
              </span>
              <span className="font-display font-extrabold text-base sm:text-lg text-emerald-950">
                {placedCount} / 4
              </span>
            </div>

            <button
              onClick={handleReset}
              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-stone-300"
              title="Mulai Ulang Piramida"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Pemandu Dara Character & Interactive Speech Bubble */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-3.5 sm:p-4 shadow-md border-2 border-emerald-500/80 flex items-center gap-3 sm:gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="shrink-0 flex items-center justify-center">
            <CharacterAvatar
              size="sm"
              isCelebrating={hasCompleted}
              className="scale-110 sm:scale-125"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-display font-black text-xs sm:text-sm text-amber-300">
                Pemandu Dara
              </span>
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.2 rounded-full">
                {hasCompleted ? 'Piramida Sempurna!' : 'Panduan Misi'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-medium">
              {daraDialog.text}
            </p>
          </div>
        </div>

        {/* Educational Info Pill */}
        <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-900 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold uppercase tracking-wide text-[11px] text-emerald-800">
              PIRAMIDA EKOSISTEM
            </span>
            <span className="hidden sm:inline text-emerald-400">•</span>
            <span className="font-medium text-stone-700">
              Semakin ke atas, jumlah organisme biasanya semakin sedikit.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-semibold bg-white/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Aliran Energi: Dasar ➔ Puncak</span>
          </div>
        </div>

        {/* MAIN GAME AREA: Stepped Horizontal Pyramid */}
        <div className="bg-white/95 rounded-3xl p-4 sm:p-6 border-2 border-emerald-300/80 shadow-md space-y-4">
          <div className="text-center pb-1">
            <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
              Bangun Struktur Tingkat Trofik Piramida
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Seret kartu atau klik kartu di bawah lalu klik tingkat piramida yang sesuai.
            </p>
          </div>

          {/* Stepped Pyramid Container */}
          <div className="flex flex-col items-center gap-2.5 sm:gap-3 py-2">
            {PYRAMID_TIERS.map((tier) => {
              const placedCardId = placedMap[tier.tierId];
              const placedCard = CARDS_DATA.find((c) => c.id === placedCardId);
              const isShaking = shakingTierId === tier.tierId;
              const isSelectedTarget =
                selectedCardId &&
                selectedCardId === tier.expectedCardId &&
                !placedCard;

              return (
                <motion.div
                  key={tier.tierId}
                  id={`pyramid-tier-${tier.tierId}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, tier.tierId)}
                  onClick={() => handleSlotClick(tier.tierId)}
                  animate={
                    isShaking
                      ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                  className={`relative ${tier.widthClass} transition-all duration-300 rounded-2xl sm:rounded-3xl border-2 p-3 sm:p-4 cursor-pointer select-none shadow-sm ${
                    placedCard
                      ? `${tier.filledBg} shadow-md`
                      : isSelectedTarget
                      ? `${tier.accentBg} ring-3 ring-amber-400 border-amber-500 shadow-md scale-[1.01]`
                      : `${tier.accentBg} border-dashed ${tier.accentBorder}`
                  }`}
                >
                  {/* Tier Ribbon Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-stone-200/60 pb-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-xs sm:text-sm text-stone-800">
                        {tier.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-stone-200 text-stone-700">
                        {tier.category}
                      </span>
                    </div>

                    {placedCard ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sesuai</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-stone-400">
                        Slot Kosong
                      </span>
                    )}
                  </div>

                  {/* Tier Body Content */}
                  {placedCard ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-3 sm:gap-4"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white border-2 border-emerald-300 shadow-xs shrink-0 flex items-center justify-center p-1">
                        <img
                          src={placedCard.image}
                          alt={placedCard.name}
                          className="w-full h-full object-cover rounded-xl"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">{placedCard.icon}</span>
                          <h4 className="font-display font-black text-sm sm:text-base text-stone-900 leading-tight">
                            {placedCard.name}
                          </h4>
                        </div>
                        <p className="text-[11px] sm:text-xs text-stone-600 mt-0.5 line-clamp-2">
                          {placedCard.desc}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-md">
                          Peran: {placedCard.role}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="py-2.5 sm:py-3 flex flex-col items-center justify-center text-center">
                      <p className="text-xs sm:text-sm font-bold text-stone-700">
                        Letakkan <span className="text-emerald-800 underline underline-offset-2">{tier.category}</span> di sini
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5 max-w-md">
                        Contoh: {tier.example} — {tier.roleHint}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Cards Selection Deck */}
          <div className="pt-3 border-t border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
              <h4 className="font-display font-bold text-xs sm:text-sm text-stone-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Kumpulan Kartu Pilihan (Tersedia: {availableCards.length})</span>
              </h4>
              <span className="text-[11px] text-stone-500">
                Pilih atau seret kartu trofik yang tepat (Hati-hati kartu pengecoh!)
              </span>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {CARDS_DATA.map((card) => {
                const isPlaced = Object.values(placedMap).includes(card.id);
                const isSelected = selectedCardId === card.id;
                const isShaking = shakingCardId === card.id;

                if (isPlaced) return null;

                return (
                  <motion.div
                    key={card.id}
                    id={`card-piramida-${card.id}`}
                    draggable={!isPlaced}
                    onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, card.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCardId(isSelected ? null : card.id);
                    }}
                    animate={
                      isShaking
                        ? { x: [-6, 6, -4, 4, 0] }
                        : {}
                    }
                    transition={{ duration: 0.35 }}
                    className={`p-2 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center cursor-pointer select-none bg-white ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/90 ring-3 ring-amber-300 shadow-md scale-105'
                        : 'border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/40 shadow-xs'
                    }`}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-stone-50 border border-stone-200 flex items-center justify-center mb-1">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="w-full">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm">{card.icon}</span>
                        <h5 className="font-display font-bold text-xs text-stone-900 leading-tight truncate">
                          {card.name}
                        </h5>
                      </div>
                      <p className="text-[10px] font-semibold text-stone-500 truncate mt-0.5">
                        {card.role}
                      </p>
                    </div>

                    <div className="mt-1 w-full pt-1 border-t border-stone-100">
                      <span
                        className={`text-[9px] font-bold block py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-amber-500 text-white'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {isSelected ? 'Terpilih ✨' : 'Klik / Seret'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Success Modal / Banner */}
        <AnimatePresence>
          {hasCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-5 sm:p-6 text-white shadow-xl border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center text-3xl font-black shadow-md shrink-0">
                  🏆
                </div>
                <div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-amber-300">
                    Hebat! Piramida ekosistemmu sudah lengkap! 🌿🦗🐸🦅
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100 mt-1 leading-relaxed">
                    Kamu berhasil menyusun tingkat trofik dari Produsen (Tumbuhan hijau) di dasar, Konsumen I (Belalang), Konsumen II (Katak), hingga Konsumen III (Elang) di puncak piramida!
                  </p>
                </div>
              </div>

              <button
                id="btn-lanjut-misi-8"
                onClick={() => {
                  sound.playFanfare();
                  onNextMission();
                }}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-display font-black text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Lanjutkan Misi</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              sound.playClick();
              onGoToMap();
            }}
            className="px-4 py-2.5 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-xs cursor-pointer transition"
          >
            <Map className="w-4 h-4 text-emerald-600" />
            <span>Peta Petualangan</span>
          </button>

          {hasCompleted && (
            <button
              onClick={() => {
                sound.playFanfare();
                onNextMission();
              }}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-display font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
            >
              <span>Lanjutkan ke Kuis Evaluasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
