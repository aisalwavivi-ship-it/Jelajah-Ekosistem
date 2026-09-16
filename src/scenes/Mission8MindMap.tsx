import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Map,
  Check,
  ChevronDown,
  Info,
  Layers,
  BookOpen
} from 'lucide-react';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { sound } from '../utils/audio';

interface Mission8Props {
  onComplete: (points: number) => void;
  onGoToMap: () => void;
  onNextMission: () => void;
}

interface HierarchyNode {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  definition: string;
  example: string;
  formulaHint: string;
}

const HIERARCHY_NODES: HierarchyNode[] = [
  {
    id: 'individu',
    level: 1,
    title: 'Individu',
    subtitle: 'Tingkat 1: Satuan Tunggal',
    icon: '👤',
    color: 'from-amber-500 to-orange-500',
    definition: 'Satu makhluk hidup tunggal yang hidup mandiri.',
    example: '1 ekor ikan mas di sudut kolam, 1 pohon beringin, atau 1 ekor burung kutilang.',
    formulaHint: '1 Makhluk Hidup = 1 Individu'
  },
  {
    id: 'populasi',
    level: 2,
    title: 'Populasi',
    subtitle: 'Tingkat 2: Kumpulan Sejenis',
    icon: '👥',
    color: 'from-sky-500 to-blue-600',
    definition: 'Kumpulan individu dari jenis (spesies) yang sama yang hidup di suatu tempat pada waktu tertentu.',
    example: 'Sekumpulan 15 ekor ikan mas di dalam kolam, atau sekelompok 8 pohon pinus di bukit.',
    formulaHint: 'Banyak Individu Sejenis = 1 Populasi'
  },
  {
    id: 'komunitas',
    level: 3,
    title: 'Komunitas',
    subtitle: 'Tingkat 3: Berbagai Populasi',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-purple-500 to-indigo-600',
    definition: 'Kumpulan dari berbagai populasi makhluk hidup yang berbeda jenis yang hidup bersama di suatu wilayah.',
    example: 'Populasi ikan mas + populasi bunga teratai + populasi katak hijau di kolam taman.',
    formulaHint: 'Populasi A + Populasi B + Populasi C = Komunitas'
  },
  {
    id: 'ekosistem',
    level: 4,
    title: 'Ekosistem',
    subtitle: 'Tingkat 4: Kesatuan Menyeluruh',
    icon: '🌎',
    color: 'from-emerald-600 to-teal-700',
    definition: 'Kesatuan hubungan timbal balik antara komunitas makhluk hidup (biotik) dengan lingkungan tak hidupnya (abiotik).',
    example: 'Komunitas kolam (ikan, katak, teratai) berinteraksi dengan air, sinar matahari, lumpur, dan oksigen.',
    formulaHint: 'Komponen Biotik + Komponen Abiotik = Ekosistem'
  }
];

interface HierarchySlot {
  slotId: string;
  expectedCardId: string;
  label: string;
  hierarchyGroup: 'tingkatan' | 'jenis' | 'komponen';
}

interface ConceptCard {
  id: string;
  title: string;
  icon: string;
  group: 'tingkatan' | 'jenis' | 'komponen';
  description: string;
}

const HIERARCHY_SLOTS: HierarchySlot[] = [
  { slotId: 'slot_ind', expectedCardId: 'card_ind', label: '1. Satuan Tunggal', hierarchyGroup: 'tingkatan' },
  { slotId: 'slot_pop', expectedCardId: 'card_pop', label: '2. Kumpulan Sejenis', hierarchyGroup: 'tingkatan' },
  { slotId: 'slot_kom', expectedCardId: 'card_kom', label: '3. Berbagai Populasi', hierarchyGroup: 'tingkatan' },
  { slotId: 'slot_darat', expectedCardId: 'card_darat', label: 'Jenis: Daratan', hierarchyGroup: 'jenis' },
  { slotId: 'slot_air', expectedCardId: 'card_air', label: 'Jenis: Perairan', hierarchyGroup: 'jenis' },
  { slotId: 'slot_biotik', expectedCardId: 'card_biotik', label: 'Komponen Hidup', hierarchyGroup: 'komponen' },
  { slotId: 'slot_abiotik', expectedCardId: 'card_abiotik', label: 'Komponen Tak Hidup', hierarchyGroup: 'komponen' }
];

const HIERARCHY_CARDS: ConceptCard[] = [
  { id: 'card_ind', title: 'Individu (1 Ekor Ikan)', icon: '👤', group: 'tingkatan', description: 'Satu makhluk hidup tunggal' },
  { id: 'card_pop', title: 'Populasi (Kumpulan Ikan)', icon: '👥', group: 'tingkatan', description: 'Kumpulan banyak individu sejenis' },
  { id: 'card_kom', title: 'Komunitas (Ikan + Katak + Teratai)', icon: '👨‍👩‍👧‍👦', group: 'tingkatan', description: 'Kumpulan bermacam populasi berbeda' },
  { id: 'card_darat', title: 'Ekosistem Darat (Hutan & Taman)', icon: '🌳', group: 'jenis', description: 'Berada di daratan bumi' },
  { id: 'card_air', title: 'Ekosistem Air (Kolam & Danau)', icon: '💧', group: 'jenis', description: 'Berada di lingkungan perairan' },
  { id: 'card_biotik', title: 'Biotik (Tumbuhan & Hewan)', icon: '🌱', group: 'komponen', description: 'Seluruh makhluk hidup bernyawa' },
  { id: 'card_abiotik', title: 'Abiotik (Cahaya, Air, Tanah)', icon: '☀️', group: 'komponen', description: 'Benda & faktor alam tak hidup' }
];

export const Mission8MindMap: React.FC<Mission8Props> = ({
  onComplete,
  onGoToMap,
  onNextMission,
}) => {
  const [activeView, setActiveView] = useState<'reference' | 'challenge'>('reference');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ekosistem');
  
  // Interactive Slot Challenge state
  const [placedMap, setPlacedMap] = useState<Record<string, string>>({});
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  useEffect(() => {
    sound.startSoundscape('forest');
    return () => {
      sound.stopSoundscape();
    };
  }, []);

  const placedCount = Object.keys(placedMap).length;

  const handlePlace = (slotId: string, expectedCardId: string) => {
    if (!selectedCardId) return;

    if (selectedCardId === expectedCardId) {
      sound.playCorrect();
      const updated = { ...placedMap, [slotId]: selectedCardId };
      setPlacedMap(updated);
      setSelectedCardId(null);

      if (Object.keys(updated).length === HIERARCHY_SLOTS.length && !hasCompleted) {
        setHasCompleted(true);
        sound.playFanfare();
        onComplete(20);
      }
    } else {
      sound.playWrong();
    }
  };

  const handleReset = () => {
    sound.playClick();
    setPlacedMap({});
    setSelectedCardId(null);
    setHasCompleted(false);
  };

  const activeNodeData = HIERARCHY_NODES.find((n) => n.id === selectedNodeId) || HIERARCHY_NODES[3];

  return (
    <div className="min-h-[calc(100vh-115px)] w-full p-3 sm:p-6 flex flex-col justify-between relative z-10">
      <div className="max-w-5xl mx-auto w-full space-y-4">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-300/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-2xl shrink-0">
              🧭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  Misi 8: Peta Pikiran Hierarki
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                  Mind Map Hierarki Struktur Ekosistem
                </h2>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                Struktur berjenjang: <strong>Individu → Populasi → Komunitas → Ekosistem</strong> serta komponen penyusunnya.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                Tantangan Bagan
              </span>
              <span className="font-display font-extrabold text-base sm:text-lg text-emerald-950">
                {placedCount} / {HIERARCHY_SLOTS.length}
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Toggle: Peta Referensi vs Tantangan Susun */}
        <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-emerald-200">
          <button
            onClick={() => {
              sound.playClick();
              setActiveView('reference');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-display font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeView === 'reference'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-700 hover:bg-emerald-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Peta Pikiran Interaktif (Referensi Lengkap)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveView('challenge');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-display font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeView === 'challenge'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-700 hover:bg-amber-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tantangan Susun Bagan ({placedCount}/{HIERARCHY_SLOTS.length})</span>
          </button>
        </div>

        {/* VIEW 1: INTERACTIVE HIERARCHY REFERENCE MAP */}
        {activeView === 'reference' && (
          <div className="space-y-4">
            {/* Visual Hierarchical Ladder Bar */}
            <div className="bg-white/95 rounded-3xl p-4 sm:p-6 border-2 border-emerald-300 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Alur Jenjang Organisasi Kehidupan: Klik Tingkatan untuk Membuka Detail</span>
                </h3>
                <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                  Dari Sederhana ke Luas
                </span>
              </div>

              {/* Step Flow: Individu -> Populasi -> Komunitas -> Ekosistem */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {HIERARCHY_NODES.map((node, index) => {
                  const isSelected = selectedNodeId === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedNodeId(node.id);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 ring-3 ring-emerald-200 shadow-md scale-[1.02]'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-2xl">{node.icon}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700">
                            Tingkat {node.level}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-sm sm:text-base text-stone-900 leading-tight">
                          {node.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {node.subtitle}
                        </p>
                      </div>

                      {index < HIERARCHY_NODES.length - 1 && (
                        <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-500 font-black text-sm">
                          →
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detail Inspector Card for the selected Hierarchy Node */}
              <motion.div
                key={activeNodeData.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{activeNodeData.icon}</span>
                    <div>
                      <h4 className="font-display font-extrabold text-base sm:text-lg text-emerald-950">
                        {activeNodeData.title} (Tingkat {activeNodeData.level})
                      </h4>
                      <span className="text-xs font-semibold text-emerald-700">
                        Rumus Konsep: {activeNodeData.formulaHint}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white/90 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-0.5">📖 Pengertian:</span>
                    <p className="text-stone-700 leading-relaxed">{activeNodeData.definition}</p>
                  </div>
                  <div className="p-3 bg-white/90 rounded-xl border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-0.5">💡 Contoh Nyata:</span>
                    <p className="text-stone-700 leading-relaxed">{activeNodeData.example}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tree Branching: Ekosistem Darat & Air, Biotik & Abiotik */}
            <div className="bg-white/95 rounded-3xl p-4 sm:p-6 border-2 border-emerald-200 shadow-md space-y-4">
              <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Pencabangan Lengkap: Jenis & Komponen Ekosistem</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Branch 1: Jenis Ekosistem */}
                <div className="p-4 rounded-2xl bg-sky-50/90 border-2 border-sky-300 space-y-3">
                  <div className="flex items-center gap-2 text-sky-950 font-bold border-b border-sky-200 pb-2">
                    <span className="text-xl">🏞️</span>
                    <h4 className="font-display text-sm font-extrabold">2 Jenis Ekosistem</h4>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 bg-white rounded-xl border border-sky-200">
                      <div className="flex items-center gap-1.5 font-bold text-sky-900 mb-0.5">
                        <span>🌳</span>
                        <span>Ekosistem Darat</span>
                      </div>
                      <p className="text-stone-600 text-[11px]">
                        Berada di permukaan daratan bumi. Contoh: hutan hujan tropis, padang rumput, taman sekolah, kebun, dan sawah.
                      </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-sky-200">
                      <div className="flex items-center gap-1.5 font-bold text-sky-900 mb-0.5">
                        <span>💧</span>
                        <span>Ekosistem Air</span>
                      </div>
                      <p className="text-stone-600 text-[11px]">
                        Berada di lingkungan perairan. Meliputi ekosistem air tawar (kolam, danau, sungai) dan air asin (laut, terumbu karang).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Branch 2: Komponen Ekosistem */}
                <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 space-y-3">
                  <div className="flex items-center gap-2 text-amber-950 font-bold border-b border-amber-200 pb-2">
                    <span className="text-xl">⚖️</span>
                    <h4 className="font-display text-sm font-extrabold">2 Komponen Penyusun</h4>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-0.5">
                        <span>🌱</span>
                        <span>Komponen Biotik (Makhluk Hidup)</span>
                      </div>
                      <p className="text-stone-600 text-[11px]">
                        Seluruh organisme bernyawa: tumbuhan hijau, hewan, jamur, mikroorganisme, serta manusia.
                      </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-amber-200">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-0.5">
                        <span>☀️</span>
                        <span>Komponen Abiotik (Benda Tak Hidup)</span>
                      </div>
                      <p className="text-stone-600 text-[11px]">
                        Faktor fisik & kimia mati penyokong kehidupan: cahaya matahari, air, tanah, bebatuan, udara, dan suhu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE HIERARCHY SLOT CHALLENGE */}
        {activeView === 'challenge' && (
          <div className="space-y-4">
            {/* Slot-Filling Interactive Board */}
            <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border-2 border-emerald-300 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <div>
                  <h3 className="font-display font-bold text-base text-stone-900">
                    Lengkapi Struktur Hierarki Ekosistem
                  </h3>
                  <p className="text-xs text-stone-500">
                    Pilih kartu konsep di bagian bawah, lalu klik slot bagan yang bersesuaian di atas!
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Slots Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {HIERARCHY_SLOTS.map((slot) => {
                  const placedCardId = placedMap[slot.slotId];
                  const placedCard = HIERARCHY_CARDS.find((c) => c.id === placedCardId);

                  return (
                    <div
                      key={slot.slotId}
                      onClick={() => handlePlace(slot.slotId, slot.expectedCardId)}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer min-h-[90px] ${
                        placedCard
                          ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                          : selectedCardId === slot.expectedCardId
                          ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300 animate-pulse-subtle'
                          : 'bg-stone-50 hover:bg-emerald-50/50 border-dashed border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-stone-500">
                          {slot.label}
                        </span>
                        {placedCard && (
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="mt-1">
                        {placedCard ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{placedCard.icon}</span>
                            <div>
                              <p className="font-bold text-xs text-stone-900 leading-tight">
                                {placedCard.title}
                              </p>
                              <p className="text-[10px] text-stone-500">{placedCard.description}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-700">
                            {selectedCardId === slot.expectedCardId ? 'Klik di sini untuk menempatkan! 👈' : 'Slot Kosong...'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cards Deck to Select from */}
              <div className="pt-3 border-t border-stone-200">
                <h4 className="font-display font-bold text-xs text-stone-700 mb-2">
                  Kartu Konsep Tersedia (Pilih kartu terlebih dahulu):
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {HIERARCHY_CARDS.map((card) => {
                    const isAlreadyPlaced = Object.values(placedMap).includes(card.id);
                    const isSelected = selectedCardId === card.id;

                    if (isAlreadyPlaced) return null;

                    return (
                      <button
                        key={card.id}
                        id={`btn-mindcard-${card.id}`}
                        onClick={() => {
                          sound.playClick();
                          setSelectedCardId(isSelected ? null : card.id);
                        }}
                        className={`p-2.5 rounded-2xl border-2 transition text-center flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-amber-300 border-amber-500 ring-3 ring-amber-300 shadow-md scale-105'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        <span className="text-2xl mb-0.5">{card.icon}</span>
                        <span className="font-bold text-[11px] text-stone-900 leading-tight">
                          {card.title}
                        </span>
                        <span className="text-[9px] text-stone-500 mt-0.5">{card.group}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
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
                sound.playFanfare();
                onNextMission();
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-stone-950 font-display font-black text-xs sm:text-sm rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Uji Pemahaman: Kuis Evaluasi 🏆</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
