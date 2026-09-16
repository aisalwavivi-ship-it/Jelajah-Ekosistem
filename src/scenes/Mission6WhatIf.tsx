import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Map,
  AlertTriangle,
  RefreshCw,
  HelpCircle,
  Layers,
  Flame,
  Check,
  X
} from 'lucide-react';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { sound } from '../utils/audio';
import { BatuTamanImage, isBatuTaman } from '../components/BatuTamanImage';
import { TanahSuburImage, isTanahSubur } from '../components/TanahSuburImage';

interface Mission6Props {
  onComplete: (points: number) => void;
  onGoToMap: () => void;
  onNextMission: () => void;
}

interface SortItem {
  id: string;
  name: string;
  category: 'biotik' | 'abiotik';
  icon: string;
  description: string;
  explanation: string;
}

const SORT_ITEMS: SortItem[] = [
  {
    id: 'ikan',
    name: 'Ikan Mas',
    category: 'biotik',
    icon: '🐟',
    description: 'Berenang dan bernapas menggunakan insang',
    explanation: 'Ikan mas adalah hewan (makhluk hidup) yang bernapas, bergerak, dan berkembang biak. Jadi tergolong BIOTIK!'
  },
  {
    id: 'matahari',
    name: 'Cahaya Matahari',
    category: 'abiotik',
    icon: '☀️',
    description: 'Sumber energi utama dan kehangatan bumi',
    explanation: 'Cahaya matahari adalah energi dan faktor fisik alami tak hidup. Jadi tergolong ABIOTIK!'
  },
  {
    id: 'teratai',
    name: 'Bunga Teratai',
    category: 'biotik',
    icon: '🪷',
    description: 'Tumbuhan air berdaun lebar mengapung',
    explanation: 'Bunga teratai adalah tumbuhan (makhluk hidup) yang melakukan fotosintesis. Jadi tergolong BIOTIK!'
  },
  {
    id: 'air',
    name: 'Air Bersih',
    category: 'abiotik',
    icon: '💧',
    description: 'Cairan penghidupan bagi seluruh ekosistem',
    explanation: 'Air adalah zat cair mati (benda tak hidup) yang sangat dibutuhkan makhluk hidup. Jadi tergolong ABIOTIK!'
  },
  {
    id: 'katak',
    name: 'Katak Hijau',
    category: 'biotik',
    icon: '🐸',
    description: 'Hewan amfibi yang hidup di darat dan air',
    explanation: 'Katak adalah hewan (makhluk hidup) yang membutuhkan makan dan oksigen. Jadi tergolong BIOTIK!'
  },
  {
    id: 'batu',
    name: 'Batu Taman',
    category: 'abiotik',
    icon: '🪨',
    description: 'Bebatuan alam di taman atau tanah',
    explanation: 'Batu taman tidak bertumbuh, tidak bernapas, dan tidak berketurunan. Jadi tergolong ABIOTIK!'
  },
  {
    id: 'lebah',
    name: 'Lebah Madu',
    category: 'biotik',
    icon: '🐝',
    description: 'Serangga penyerbuk bunga tanaman',
    explanation: 'Lebah adalah serangga hidup yang beraktivitas dan berkembang biak. Jadi tergolong BIOTIK!'
  },
  {
    id: 'udara',
    name: 'Udara (Oksigen)',
    category: 'abiotik',
    icon: '🌬️',
    description: 'Campuran gas untuk pernapasan makhluk hidup',
    explanation: 'Udara adalah campuran gas alami tak hidup penyedia oksigen dan karbon dioksida. Jadi tergolong ABIOTIK!'
  },
  {
    id: 'jamur',
    name: 'Jamur Kayu',
    category: 'biotik',
    icon: '🍄',
    description: 'Organisme yang tumbuh di batang lapuk',
    explanation: 'Jamur adalah organisme hidup dari dunia fungi yang tumbuh dan menyerap nutrisi. Jadi tergolong BIOTIK!'
  },
  {
    id: 'tanah',
    name: 'Tanah Subur',
    category: 'abiotik',
    icon: '🪴',
    description: 'Lapisan mineral tempat tumbuhnya akar tanaman',
    explanation: 'Tanah merupakan campuran partikel batuan dan mineral tak hidup tempat berdirinya tumbuhan. Jadi tergolong ABIOTIK!'
  }
];

interface WhatIfScenario {
  id: number;
  title: string;
  conditionNormalTitle: string;
  conditionChangedTitle: string;
  normalDescription: string;
  changedDescription: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  abiotikFactor: string;
}

const SCENARIOS: WhatIfScenario[] = [
  {
    id: 1,
    title: 'Bagaimana jika taman tidak mendapatkan air sama sekali?',
    conditionNormalTitle: 'Kondisi Normal: Cukup Air 💧',
    conditionChangedTitle: 'Kondisi Berubah: Tanpa Air 🏜️',
    normalDescription: 'Tanah lembap, bunga bermekaran cerah, dan rerumputan hijau segar.',
    changedDescription: 'Tanah menjadi kering dan retak-retak, daun tanaman menguning dan terkulai layu.',
    question: 'Apa yang mungkin terjadi pada makhluk hidup (biotik) di taman tersebut?',
    options: [
      { id: 'a', text: 'Tumbuhan layu, hewan kehausan, dan kehidupan terancam mati', isCorrect: true },
      { id: 'b', text: 'Tumbuhan akan tumbuh semakin lebat dan cepat berbuah', isCorrect: false },
      { id: 'c', text: 'Bebatuan di taman akan bertambah banyak dan membesar', isCorrect: false }
    ],
    explanation: 'Air adalah komponen abiotik vital. Tanpa air, komponen biotik (tumbuhan & hewan) tidak dapat bertahan hidup.',
    abiotikFactor: 'Air (Abiotik)'
  },
  {
    id: 2,
    title: 'Bagaimana jika lingkungan tertutup rapat dari cahaya matahari?',
    conditionNormalTitle: 'Kondisi Normal: Terang & Hangat ☀️',
    conditionChangedTitle: 'Kondisi Berubah: Gelap Gulita 🌑',
    normalDescription: 'Sinar matahari menghangatkan lingkungan, daun hijau segar membuat makanan.',
    changedDescription: 'Lingkungan menjadi gelap, udara dingin, daun kehilangan warna hijaunya.',
    question: 'Apa dampak hilangnya cahaya matahari bagi komponen biotik?',
    options: [
      { id: 'a', text: 'Tumbuhan gagal fotosintesis dan suhu menjadi terlalu dingin', isCorrect: true },
      { id: 'b', text: 'Semua hewan akan langsung bisa melihat dalam gelap sempurna', isCorrect: false },
      { id: 'c', text: 'Tanah akan mengeras menjadi intan berkilau', isCorrect: false }
    ],
    explanation: 'Cahaya matahari adalah komponen abiotik penyedia energi fotosintesis bagi tumbuhan hijau dan kehangatan suhu bumi.',
    abiotikFactor: 'Cahaya Matahari (Abiotik)'
  }
];

export const Mission6WhatIf: React.FC<Mission6Props> = ({
  onComplete,
  onGoToMap,
  onNextMission,
}) => {
  const [activeTab, setActiveTab] = useState<'sorting' | 'whatif'>('sorting');
  
  // Sorting Game state
  const [classifiedMap, setClassifiedMap] = useState<Record<string, 'biotik' | 'abiotik'>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<'biotik' | 'abiotik' | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    text: string;
    isCorrect: boolean;
    name: string;
  } | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  useEffect(() => {
    sound.startSoundscape('forest');
    return () => {
      sound.stopSoundscape();
    };
  }, []);

  // What-If Simulation state
  const [scenarioIndex, setScenarioIndex] = useState<number>(0);
  const [isChangedMode, setIsChangedMode] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const totalItems = SORT_ITEMS.length;
  const sortedCount = Object.keys(classifiedMap).length;
  const remainingItems = SORT_ITEMS.filter((item) => !classifiedMap[item.id]);

  const biotikList = SORT_ITEMS.filter((item) => classifiedMap[item.id] === 'biotik');
  const abiotikList = SORT_ITEMS.filter((item) => classifiedMap[item.id] === 'abiotik');

  const handleClassify = (item: SortItem, targetCategory: 'biotik' | 'abiotik', isFromDrop = false) => {
    if (item.category === targetCategory) {
      // Subtle success chime feedback
      sound.playDropSuccess();
      const nextMap = { ...classifiedMap, [item.id]: targetCategory };
      setClassifiedMap(nextMap);
      setSelectedItemId(null);
      setFeedback({
        text: item.explanation,
        isCorrect: true,
        name: item.name,
      });

      if (Object.keys(nextMap).length === totalItems && !hasCompleted) {
        setHasCompleted(true);
        setTimeout(() => sound.playFanfare(), 300);
        onComplete(20);
      }
    } else {
      // Subtle error thud feedback
      sound.playDropError();
      setFeedback({
        text: `Kurang tepat untuk ${item.name}! ${item.explanation}`,
        isCorrect: false,
        name: item.name,
      });
    }
  };

  const handleResetSort = () => {
    sound.playClick();
    setClassifiedMap({});
    setSelectedItemId(null);
    setDragOverTarget(null);
    setDraggingItemId(null);
    setFeedback(null);
    setHasCompleted(false);
  };

  const currentScenario = SCENARIOS[scenarioIndex];

  return (
    <div className="min-h-[calc(100vh-115px)] w-full p-3 sm:p-6 flex flex-col justify-between relative z-10">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-300/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-2xl shrink-0">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  Misi 6: Klasifikasi & Hubungan
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                  Game Sortir: Biotik vs Abiotik
                </h2>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                “<strong>Biotik</strong> = Makhluk Hidup” sedangkan “<strong>Abiotik</strong> = Benda / Faktor Tak Hidup”. Kelompokkan dengan tepat!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                Tersortir
              </span>
              <span className="font-display font-extrabold text-base sm:text-lg text-emerald-950">
                {sortedCount} / {totalItems}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation: Game Sortir vs Simulasi Hubungan */}
        <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-emerald-200">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('sorting');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-display font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'sorting'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-700 hover:bg-emerald-50'
            }`}
          >
            <span>🎮 Game Sortir Biotik & Abiotik</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {sortedCount}/{totalItems}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('whatif');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-display font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'whatif'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:bg-amber-50'
            }`}
          >
            <span>💭 Simulasi Ketergantungan: Andaikan...</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE SORTING GAME */}
        {activeTab === 'sorting' && (
          <div className="space-y-4">
            {/* Visual Concept Rule Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-100/90 border-2 border-emerald-400 flex items-start gap-3">
                <span className="text-3xl shrink-0">🌱</span>
                <div>
                  <h4 className="font-display font-bold text-sm text-emerald-950">
                    Wadah BIOTIK (Makhluk Hidup)
                  </h4>
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    Memiliki ciri kehidupan: bernapas, butuh nutrisi, bergerak, bertumbuh, dan berkembang biak. (Contoh: hewan, tumbuhan, jamur, manusia).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-100/90 border-2 border-sky-400 flex items-start gap-3">
                <span className="text-3xl shrink-0">☀️</span>
                <div>
                  <h4 className="font-display font-bold text-sm text-sky-950">
                    Wadah ABIOTIK (Benda / Faktor Tak Hidup)
                  </h4>
                  <p className="text-sky-800 text-[11px] mt-0.5">
                    Faktor fisik dan kimia alam yang tidak bernyawa, namun mutlak diperlukan biotik untuk bertahan. (Contoh: cahaya matahari, air, tanah, batu, udara).
                  </p>
                </div>
              </div>
            </div>

              {/* Immediate Feedback Banner */}
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 shadow-md ${
                    feedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-red-50 border-red-300 text-red-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{feedback.isCorrect ? '🌟' : '💡'}</span>
                    <span className="text-xs sm:text-sm font-medium">{feedback.text}</span>
                  </div>
                  <button
                    onClick={() => setFeedback(null)}
                    className="p-1 hover:bg-stone-200/50 rounded-lg text-stone-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drag & Drop instruction notice */}
            <div className="px-4 py-2 bg-white/70 rounded-xl border border-stone-200 text-stone-600 text-xs flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-500">✨</span>
                <span>
                  <strong>Petunjuk:</strong> Kamu dapat <strong>menarik kartu (Drag & Drop)</strong> langsung ke wadah Biotik / Abiotik, atau klik tombol pilihan cepat di bawah setiap kartu!
                </span>
              </span>
              <span className="text-[10px] text-stone-400 shrink-0 hidden sm:inline">Audio Aktif 🔊</span>
            </div>

            {/* Unsorted Items Pool */}
            <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border-2 border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-sm">
                    📦
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-stone-800">
                    Komponen yang Belum Terklasifikasi ({remainingItems.length})
                  </h3>
                </div>

                {sortedCount > 0 && (
                  <button
                    onClick={handleResetSort}
                    className="text-xs text-stone-500 hover:text-stone-700 underline cursor-pointer"
                  >
                    Mulai Ulang Sortir
                  </button>
                )}
              </div>

              {remainingItems.length === 0 ? (
                <div className="p-6 text-center bg-emerald-50 rounded-2xl border-2 border-emerald-300">
                  <span className="text-4xl">🎉</span>
                  <h4 className="font-display font-bold text-emerald-950 text-base mt-2">
                    Luar Biasa! Semua Komponen Berhasil Terklasifikasi!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Kamu telah menguasai pemisahan antara komponen <strong>Biotik (makhluk hidup)</strong> dan <strong>Abiotik (benda tak hidup)</strong>.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {remainingItems.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    const isDragging = draggingItemId === item.id;
                    return (
                      <div
                        key={item.id}
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', item.id);
                          setDraggingItemId(item.id);
                          sound.playClick();
                        }}
                        onDragEnd={() => setDraggingItemId(null)}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all shadow-xs cursor-grab active:cursor-grabbing select-none ${
                          isDragging
                            ? 'opacity-40 scale-95 border-amber-500'
                            : isSelected
                            ? 'bg-amber-50 border-amber-400 ring-3 ring-amber-200'
                            : 'bg-stone-50 hover:bg-stone-100 hover:border-emerald-300 border-stone-200'
                        }`}
                        title="Tarik kartu ini dan letakkan di wadah Biotik atau Abiotik"
                      >
                        <div className="text-[10px] text-stone-400 font-semibold mb-0.5 flex items-center gap-1">
                          <span>🖐️ Tarik</span>
                        </div>
                        {isBatuTaman(item.name) ? (
                          <BatuTamanImage className="w-9 h-9 mb-1" alt={item.name} />
                        ) : isTanahSubur(item.name) ? (
                          <TanahSuburImage className="w-9 h-9 mb-1" alt={item.name} />
                        ) : (
                          <span className="text-3xl mb-1">{item.icon}</span>
                        )}
                        <span className="font-display font-bold text-xs text-stone-900 leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                          {item.description}
                        </span>

                        {/* Quick sorting buttons directly on card */}
                        <div className="w-full grid grid-cols-2 gap-1 mt-2.5 pt-1.5 border-t border-stone-200">
                          <button
                            id={`btn-sort-biotik-${item.id}`}
                            onClick={() => handleClassify(item, 'biotik', false)}
                            className="px-1.5 py-1 bg-emerald-100 hover:bg-emerald-600 hover:text-white text-emerald-900 rounded-lg text-[10px] font-bold transition cursor-pointer"
                            title="Masukkan ke Biotik"
                          >
                            🌱 Biotik
                          </button>
                          <button
                            id={`btn-sort-abiotik-${item.id}`}
                            onClick={() => handleClassify(item, 'abiotik', false)}
                            className="px-1.5 py-1 bg-sky-100 hover:bg-sky-600 hover:text-white text-sky-900 rounded-lg text-[10px] font-bold transition cursor-pointer"
                            title="Masukkan ke Abiotik"
                          >
                            ☀️ Abiotik
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Classification Buckets (Side-by-Side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Wadah Biotik */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragOverTarget('biotik');
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverTarget(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverTarget(null);
                  setDraggingItemId(null);
                  const itemId = e.dataTransfer.getData('text/plain');
                  const item = SORT_ITEMS.find((s) => s.id === itemId);
                  if (item) {
                    handleClassify(item, 'biotik', true);
                  }
                }}
                className={`rounded-3xl p-4 sm:p-5 border-3 transition-all duration-200 shadow-md space-y-3 ${
                  dragOverTarget === 'biotik'
                    ? 'bg-emerald-100/95 border-emerald-500 ring-4 ring-emerald-300 scale-[1.01]'
                    : 'bg-emerald-50/90 border-emerald-400'
                }`}
              >
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌱</span>
                    <div>
                      <h4 className="font-display font-bold text-sm sm:text-base text-emerald-950">
                        Wadah Komponen Biotik
                      </h4>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        Makhluk Hidup ({biotikList.length})
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-full">
                    {biotikList.length} / 5
                  </span>
                </div>

                {dragOverTarget === 'biotik' && (
                  <div className="p-2 text-center bg-emerald-200/80 rounded-xl text-xs font-bold text-emerald-950 animate-pulse">
                    📥 Lepaskan kartu di sini untuk kategori BIOTIK
                  </div>
                )}

                <div className="min-h-[140px] flex flex-wrap gap-2 p-2 bg-white/80 rounded-2xl border border-emerald-200">
                  {biotikList.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center text-xs text-stone-400 py-6">
                      <span>Belum ada komponen biotik yang dimasukkan</span>
                      <span className="text-[10px] text-emerald-600 mt-1">
                        Tarik kartu ke wadah ini atau pilih tombol "🌱 Biotik"!
                      </span>
                    </div>
                  ) : (
                    biotikList.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center gap-2 shadow-xs"
                      >
                        {isBatuTaman(item.name) ? (
                          <BatuTamanImage className="w-5 h-5" alt={item.name} />
                        ) : isTanahSubur(item.name) ? (
                          <TanahSuburImage className="w-5 h-5" alt={item.name} />
                        ) : (
                          <span className="text-lg">{item.icon}</span>
                        )}
                        <div className="text-left">
                          <span className="font-bold text-xs text-emerald-950 block leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[9px] text-emerald-700">Makhluk Hidup ✓</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Wadah Abiotik */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragOverTarget('abiotik');
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverTarget(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverTarget(null);
                  setDraggingItemId(null);
                  const itemId = e.dataTransfer.getData('text/plain');
                  const item = SORT_ITEMS.find((s) => s.id === itemId);
                  if (item) {
                    handleClassify(item, 'abiotik', true);
                  }
                }}
                className={`rounded-3xl p-4 sm:p-5 border-3 transition-all duration-200 shadow-md space-y-3 ${
                  dragOverTarget === 'abiotik'
                    ? 'bg-sky-100/95 border-sky-500 ring-4 ring-sky-300 scale-[1.01]'
                    : 'bg-sky-50/90 border-sky-400'
                }`}
              >
                <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">☀️</span>
                    <div>
                      <h4 className="font-display font-bold text-sm sm:text-base text-sky-950">
                        Wadah Komponen Abiotik
                      </h4>
                      <span className="text-[10px] text-sky-700 font-semibold">
                        Benda / Faktor Tak Hidup ({abiotikList.length})
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-sky-200 text-sky-900 rounded-full">
                    {abiotikList.length} / 5
                  </span>
                </div>

                {dragOverTarget === 'abiotik' && (
                  <div className="p-2 text-center bg-sky-200/80 rounded-xl text-xs font-bold text-sky-950 animate-pulse">
                    📥 Lepaskan kartu di sini untuk kategori ABIOTIK
                  </div>
                )}

                <div className="min-h-[140px] flex flex-wrap gap-2 p-2 bg-white/80 rounded-2xl border border-sky-200">
                  {abiotikList.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center text-xs text-stone-400 py-6">
                      <span>Belum ada komponen abiotik yang dimasukkan</span>
                      <span className="text-[10px] text-sky-600 mt-1">
                        Tarik kartu ke wadah ini atau pilih tombol "☀️ Abiotik"!
                      </span>
                    </div>
                  ) : (
                    abiotikList.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-3 py-1.5 bg-sky-100 border border-sky-300 rounded-xl flex items-center gap-2 shadow-xs"
                      >
                        {isBatuTaman(item.name) ? (
                          <BatuTamanImage className="w-5 h-5" alt={item.name} />
                        ) : isTanahSubur(item.name) ? (
                          <TanahSuburImage className="w-5 h-5" alt={item.name} />
                        ) : (
                          <span className="text-lg">{item.icon}</span>
                        )}
                        <div className="text-left">
                          <span className="font-bold text-xs text-sky-950 block leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[9px] text-sky-700">Faktor Tak Hidup ✓</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SIMULASI KETERGANTUNGAN (WHAT-IF) */}
        {activeTab === 'whatif' && (
          <div className="space-y-4">
            {/* Simulation Canvas */}
            <div
              className={`relative w-full min-h-[280px] rounded-3xl border-4 transition-all duration-700 shadow-xl overflow-hidden p-5 flex flex-col justify-between ${
                isChangedMode
                  ? 'bg-gradient-to-b from-amber-200 via-stone-200 to-amber-300 border-amber-600'
                  : 'bg-gradient-to-b from-sky-200 via-emerald-100 to-green-200 border-emerald-400'
              }`}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-stone-200 shadow-sm max-w-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                    Kondisi Simulasi:
                  </span>
                  <p className="font-display font-extrabold text-sm text-stone-900">
                    {isChangedMode ? currentScenario.conditionChangedTitle : currentScenario.conditionNormalTitle}
                  </p>
                  <p className="text-xs text-stone-600 mt-1">
                    {isChangedMode ? currentScenario.changedDescription : currentScenario.normalDescription}
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setIsChangedMode(!isChangedMode);
                  }}
                  className={`px-4 py-2.5 rounded-2xl font-display font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 border-2 cursor-pointer ${
                    isChangedMode
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-400 animate-pulse-subtle'
                      : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-300'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{isChangedMode ? 'Kembalikan Kondisi Normal 🌿' : 'Ubah Kondisi: Andaikan... 💭'}</span>
                </button>
              </div>

              {/* Visual scene elements */}
              <div className="my-auto flex items-center justify-around py-3">
                <motion.div
                  animate={isChangedMode ? { rotate: [0, 8, 5], opacity: 0.6 } : { rotate: [0, -2, 2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, type: 'tween', ease: 'easeInOut' }}
                  className="text-center"
                >
                  <span className="text-6xl block filter drop-shadow-md">
                    {isChangedMode ? '🥀' : '🌻'}
                  </span>
                  <span className="text-xs font-bold text-stone-800 bg-white/80 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {isChangedMode ? 'Tanaman Layu' : 'Tanaman Segar'}
                  </span>
                </motion.div>

                <div className="text-center flex flex-col items-center">
                  <div className="h-14 flex items-center justify-center">
                    {isChangedMode ? (
                      <span className="text-5xl block">🪨</span>
                    ) : (
                      <TanahSuburImage className="w-14 h-14" alt="Tanah Subur Lembap" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-stone-800 bg-white/80 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {isChangedMode ? 'Tanah Kering' : 'Tanah Subur Lembap'}
                  </span>
                </div>

                <div className="text-center flex flex-col items-center">
                  <CharacterAvatar size="md" isWalking={false} />
                  <span className="text-xs font-bold text-stone-800 bg-white/80 px-2 py-0.5 rounded-full mt-1 inline-block">
                    Dara Mengamati
                  </span>
                </div>
              </div>
            </div>

            {/* Question card */}
            <div className="bg-white/95 rounded-3xl p-5 border-2 border-amber-200 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Pertanyaan Penyelidikan: {currentScenario.abiotikFactor}</span>
              </div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-stone-900">
                {currentScenario.question}
              </h3>

              <div className="space-y-2">
                {currentScenario.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedOptionId(opt.id);
                        if (opt.isCorrect) {
                          sound.playCorrect();
                        } else {
                          sound.playWrong();
                        }
                      }}
                      className={`w-full p-3 rounded-2xl border-2 text-left font-medium text-xs sm:text-sm transition flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300'
                            : 'bg-red-50 border-red-400 text-red-950'
                          : 'bg-stone-50 hover:bg-amber-50/70 border-stone-200 text-stone-800'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {isSelected && (
                        <span className="text-base shrink-0">{opt.isCorrect ? '✅' : '❌'}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedOptionId && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950">
                  <p className="font-bold mb-0.5">🌟 Kesimpulan Hubungan Biotik & Abiotik:</p>
                  <p>{currentScenario.explanation}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              sound.playClick();
              onGoToMap();
            }}
            className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Peta Petualangan</span>
          </button>

          {hasCompleted && (
            <button
              onClick={() => {
                sound.playFootstep();
                onNextMission();
              }}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-display font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
            >
              <span>Lanjut ke Misi 7: Detektif Ekosistem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
