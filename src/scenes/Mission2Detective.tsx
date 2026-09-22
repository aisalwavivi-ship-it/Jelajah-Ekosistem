import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, RotateCcw, AlertCircle, Sparkles, Map } from 'lucide-react';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { sound } from '../utils/audio';
import { AudioNarratorButton } from '../components/AudioNarratorButton';

interface Mission2Props {
  onComplete: (points: number) => void;
  onGoToMap: () => void;
  onNextMission: () => void;
}

interface ItemToClassify {
  id: string;
  name: string;
  correctCategory: 'darat' | 'air';
  icon: string;
  image: string;
  correctFeedback: string;
  wrongFeedback: string;
}

const ITEMS: ItemToClassify[] = [
  {
    id: 'forest',
    name: 'Hutan Hujan',
    correctCategory: 'darat',
    icon: '🌲',
    image: '/lingkungan/hutan-hujan.jpg',
    correctFeedback: 'Tepat sekali! Hutan hujan adalah ekosistem darat karena lingkungan utamanya berupa daratan berpepohonan lebat.',
    wrongFeedback: 'Coba amati lagi. Hutan hujan memiliki tanah dan pepohonan di daratan, bukan perairan utuh.'
  },
  {
    id: 'river',
    name: 'Sungai Berbatu',
    correctCategory: 'air',
    icon: '🌊',
    image: '/lingkungan/sungai-berbatu.jpg',
    correctFeedback: 'Hebat! Sungai merupakan ekosistem air (perairan tawar mengalir).',
    wrongFeedback: 'Perhatikan baik-baik. Sungai lingkungan utamanya adalah badan air mengalir, jadi termasuk ekosistem air.'
  },
  {
    id: 'garden',
    name: 'Kebun Bunga',
    correctCategory: 'darat',
    icon: '🏡',
    image: '/lingkungan/kebun-bunga.jpg',
    correctFeedback: 'Benar! Kebun bunga berada di hamparan tanah daratan, sehingga termasuk ekosistem darat.',
    wrongFeedback: 'Kebun bunga ditanam di tanah daratan, bukan di dalam air perairan.'
  },
  {
    id: 'pond',
    name: 'Kolam Ikan',
    correctCategory: 'air',
    icon: '🐟',
    image: '/lingkungan/kolam-ikan.jpg',
    correctFeedback: 'Tepat! Kolam adalah genangan air tempat ikan dan tumbuhan air hidup, merupakan ekosistem air.',
    wrongFeedback: 'Kolam lingkungan utamanya adalah genangan perairan, jadi termasuk ekosistem air.'
  },
  {
    id: 'savanna',
    name: 'Padang Rumput',
    correctCategory: 'darat',
    icon: '🌾',
    image: '/lingkungan/padang-rumput.jpg',
    correctFeedback: 'Bagus! Padang rumput adalah hamparan rumput luas di daratan, contoh ekosistem darat.',
    wrongFeedback: 'Padang rumput membentang luas di atas tanah daratan, bukan perairan.'
  },
  {
    id: 'lake',
    name: 'Danau Alami',
    correctCategory: 'air',
    icon: '🏞️',
    image: '/lingkungan/danau-alami.jpg',
    correctFeedback: 'Benar sekali! Danau merupakan cekungan air tawar yang luas, contoh nyata ekosistem air.',
    wrongFeedback: 'Danau adalah perairan diam yang luas, sehingga tergolong ekosistem air.'
  },
  {
    id: 'park',
    name: 'Taman Kota',
    correctCategory: 'darat',
    icon: '🌳',
    image: '/lingkungan/taman-kota.jpg',
    correctFeedback: 'Hebat! Taman kota berisi pepohonan dan rumput di daratan, termasuk ekosistem darat.',
    wrongFeedback: 'Taman kota dibangun di atas daratan hijau terbuka.'
  },
  {
    id: 'sea',
    name: 'Laut Tropis',
    correctCategory: 'air',
    icon: '🐠',
    image: '/lingkungan/laut-tropis.jpg',
    correctFeedback: 'Tepat sekali! Laut adalah ekosistem perairan asin terluas di bumi.',
    wrongFeedback: 'Laut merupakan perairan luas, sehingga termasuk ekosistem air.'
  }
];

export const Mission2Detective: React.FC<Mission2Props> = ({
  onComplete,
  onGoToMap,
  onNextMission,
}) => {
  const [placedItems, setPlacedItems] = useState<Record<string, 'darat' | 'air'>>({});
  const [selectedItem, setSelectedItem] = useState<ItemToClassify | null>(null);
  const [feedback, setFeedback] = useState<{
    text: string;
    isCorrect: boolean;
    itemName: string;
  } | null>(null);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  useEffect(() => {
    sound.startSoundscape('forest');
    return () => {
      sound.stopSoundscape();
    };
  }, []);

  // Remaining unclassified items
  const unplacedItems = ITEMS.filter((item) => !placedItems[item.id]);

  const handleClassify = (item: ItemToClassify, targetCategory: 'darat' | 'air') => {
    if (item.correctCategory === targetCategory) {
      sound.playCorrect();
      const updated = { ...placedItems, [item.id]: targetCategory };
      setPlacedItems(updated);
      setSelectedItem(null);
      setFeedback({
        text: item.correctFeedback,
        isCorrect: true,
        itemName: item.name,
      });

      // Check if all items completed
      if (Object.keys(updated).length === ITEMS.length && !hasCompleted) {
        setHasCompleted(true);
        sound.playStarEarned();
        onComplete(15);
      }
    } else {
      sound.playWrong();
      setFeedback({
        text: item.wrongFeedback,
        isCorrect: false,
        itemName: item.name,
      });
    }
  };

  const handleReset = () => {
    sound.playClick();
    setPlacedItems({});
    setSelectedItem(null);
    setFeedback(null);
    setHasCompleted(false);
  };

  return (
    <div
      className="relative w-full min-h-[calc(100vh-115px)] p-3 sm:p-6 flex flex-col justify-between rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-400/90 my-1 select-none"
      style={{
        backgroundImage: "url('/misi2-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background vignette & atmospheric depth overlay (Layer Belakang) */}
      <div className="absolute inset-0 bg-stone-900/20 pointer-events-none z-0" />

      {/* Main Content Area (Layer Tengah & Atas) */}
      <div className="max-w-5xl mx-auto w-full space-y-4 relative z-10">
        {/* Header Bar */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-300/80 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 flex items-center justify-center p-1 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-xs">
              <CharacterAvatar size="sm" isWalking={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
                  Misi 2
                </span>
                <h2 className="font-display font-extrabold text-lg sm:text-xl text-stone-900">
                  Jelajah Jenis Ekosistem: Darat & Air
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                <p className="text-emerald-950 font-semibold text-xs sm:text-sm">
                  “Ekosistem Darat utamanya berupa daratan, sedangkan Ekosistem Air utamanya berupa perairan.”
                </p>
                <AudioNarratorButton
                  id="audio-mission2-header"
                  audioText="Jenis ekosistem terbagi menjadi dua, yaitu ekosistem darat dan ekosistem air. Ekosistem darat berada di daratan seperti hutan dan taman, sedangkan ekosistem air berada di perairan seperti kolam dan laut."
                  label="Dengarkan Penjelasan"
                  size="sm"
                  variant="pill"
                />
              </div>
              <p className="text-stone-700 text-xs mt-0.5">
                Amati foto lingkungan alam nyata di bawah, lalu kelompokkan ke kotak <strong>🌳 Ekosistem Darat</strong> atau <strong>💧 Ekosistem Air</strong>!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-1.5 bg-emerald-50/95 border border-emerald-300 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                Terkelompokkan
              </span>
              <span className="font-display font-extrabold text-base sm:text-lg text-emerald-950">
                {Object.keys(placedItems).length} / {ITEMS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between gap-3 shadow-md backdrop-blur-md ${
                feedback.isCorrect
                  ? 'bg-emerald-50/95 border-emerald-400 text-emerald-950'
                  : 'bg-amber-50/95 border-amber-400 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{feedback.isCorrect ? '🌟' : '🤔'}</span>
                <div>
                  <p className="font-bold text-xs sm:text-sm">
                    {feedback.isCorrect ? 'Jawaban Tepat!' : 'Ayo Amati Kembali:'}
                  </p>
                  <p className="text-xs sm:text-sm">{feedback.text}</p>
                </div>
              </div>

              {!feedback.isCorrect && (
                <button
                  onClick={() => setFeedback(null)}
                  className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                >
                  Coba Lagi
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Two Target Baskets: EKOSISTEM DARAT & EKOSISTEM AIR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ekosistem Darat Basket */}
          <div
            onClick={() => {
              if (selectedItem) {
                handleClassify(selectedItem, 'darat');
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const itemId = e.dataTransfer.getData('text/plain');
              const it = ITEMS.find((i) => i.id === itemId);
              if (it) handleClassify(it, 'darat');
            }}
            className={`bg-white/85 backdrop-blur-md border-3 rounded-3xl p-4 sm:p-5 transition-all shadow-xl relative min-h-[220px] flex flex-col justify-between ${
              selectedItem
                ? 'border-emerald-500 ring-4 ring-emerald-300/80 bg-emerald-50/95 cursor-pointer animate-pulse-subtle scale-[1.01]'
                : 'border-emerald-300/90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl">🌳</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-extrabold text-base sm:text-lg text-emerald-950">
                        EKOSISTEM DARAT
                      </h3>
                      <AudioNarratorButton
                        id="audio-ekosistem-darat"
                        audioText="Ekosistem darat adalah ekosistem yang lingkungan fisiknya berupa daratan. Contohnya seperti hutan hujan, kebun bunga, taman kota, dan padang rumput."
                        label="Dengarkan"
                        size="sm"
                        variant="compact"
                      />
                    </div>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      Lingkungan utamanya daratan (hutan, kebun, taman, padang rumput)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-200 text-emerald-900 rounded-full border border-emerald-300 shadow-2xs">
                  {Object.values(placedItems).filter((v) => v === 'darat').length} Lingkungan
                </span>
              </div>

              {/* Items placed in Ekosistem Darat */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ITEMS.filter((item) => placedItems[item.id] === 'darat').map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-1.5 bg-white/95 rounded-2xl border border-emerald-300 shadow-xs flex items-center gap-2 overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-9 rounded-xl object-cover shrink-0 border border-emerald-200 shadow-2xs"
                      referrerPolicy="no-referrer"
                      loading="eager"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-emerald-950 block truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold block">
                        Darat
                      </span>
                    </div>
                    <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                      ✓
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {selectedItem && (
              <div className="mt-3 text-center py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors">
                👉 Klik di sini untuk memasukkan "{selectedItem.name}" ke Ekosistem Darat
              </div>
            )}
          </div>

          {/* Ekosistem Air Basket */}
          <div
            onClick={() => {
              if (selectedItem) {
                handleClassify(selectedItem, 'air');
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const itemId = e.dataTransfer.getData('text/plain');
              const it = ITEMS.find((i) => i.id === itemId);
              if (it) handleClassify(it, 'air');
            }}
            className={`bg-white/85 backdrop-blur-md border-3 rounded-3xl p-4 sm:p-5 transition-all shadow-xl relative min-h-[220px] flex flex-col justify-between ${
              selectedItem
                ? 'border-sky-500 ring-4 ring-sky-300/80 bg-sky-50/95 cursor-pointer animate-pulse-subtle scale-[1.01]'
                : 'border-sky-300/90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-sky-200 pb-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl">💧</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-extrabold text-base sm:text-lg text-sky-950">
                        EKOSISTEM AIR
                      </h3>
                      <AudioNarratorButton
                        id="audio-ekosistem-air"
                        audioText="Ekosistem air adalah ekosistem yang lingkungan hidup utamanya berupa perairan. Contohnya seperti sungai, kolam, danau, dan laut."
                        label="Dengarkan"
                        size="sm"
                        variant="compact"
                      />
                    </div>
                    <p className="text-[11px] text-sky-800 font-medium">
                      Lingkungan utamanya perairan (sungai, kolam, danau, laut)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-sky-200 text-sky-900 rounded-full border border-sky-300 shadow-2xs">
                  {Object.values(placedItems).filter((v) => v === 'air').length} Lingkungan
                </span>
              </div>

              {/* Items placed in Ekosistem Air */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ITEMS.filter((item) => placedItems[item.id] === 'air').map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-1.5 bg-white/95 rounded-2xl border border-sky-300 shadow-xs flex items-center gap-2 overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-9 rounded-xl object-cover shrink-0 border border-sky-200 shadow-2xs"
                      referrerPolicy="no-referrer"
                      loading="eager"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-sky-950 block truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-sky-700 font-semibold block">
                        Air
                      </span>
                    </div>
                    <span className="shrink-0 w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                      ✓
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {selectedItem && (
              <div className="mt-3 text-center py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors">
                👉 Klik di sini untuk memasukkan "{selectedItem.name}" ke Ekosistem Air
              </div>
            )}
          </div>
        </div>

        {/* Source Items Tray with Realistic Photographic Cards */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-amber-200/90 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-stone-200/70 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🗺️</span>
              <h4 className="font-display font-bold text-sm sm:text-base text-stone-900">
                Kartu Foto Lingkungan Alam (Pilih / Tarik ke Kotak yang Sesuai)
              </h4>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mulai Ulang</span>
            </button>
          </div>

          {unplacedItems.length === 0 ? (
            <div className="text-center py-6 bg-emerald-50/95 backdrop-blur-sm rounded-2xl border-2 border-emerald-300 shadow-md">
              <span className="text-4xl">🎉</span>
              <h4 className="font-display font-extrabold text-lg text-emerald-950 mt-1">
                Semua Lingkungan Berhasil Dikelompokkan!
              </h4>
              <p className="text-stone-700 text-xs sm:text-sm mt-1 max-w-xl mx-auto px-4">
                Hebat! Kamu telah memahami bahwa ekosistem terbagi menjadi <strong>Ekosistem Darat</strong> (hutan hujan, kebun bunga, taman kota, padang rumput) dan <strong>Ekosistem Air</strong> (sungai berbatu, kolam ikan, danau alami, laut tropis).
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
                {unplacedItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', item.id);
                      }}
                      onClick={() => {
                        sound.playClick();
                        setSelectedItem(isSelected ? null : item);
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center select-none shadow-sm ${
                        isSelected
                          ? 'bg-amber-100/95 border-amber-500 ring-4 ring-amber-300 shadow-lg scale-105'
                          : 'bg-white/95 hover:bg-amber-50/90 border-stone-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-1.5 shadow-sm border border-stone-200 bg-stone-100 shrink-0 relative group">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                          loading="eager"
                        />
                      </div>
                      <span className="font-bold text-xs text-stone-900 leading-tight block w-full truncate">
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-amber-400 text-amber-950 font-bold'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {isSelected ? 'Pilih Wadah 👆' : 'Pilih / Tarik'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Active Selection Quick Inspection & Classification Bar */}
              {selectedItem && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50/95 backdrop-blur-md border-2 border-amber-400 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-amber-300 shadow-sm shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md">
                          Sedang Dipilih
                        </span>
                        <h5 className="font-display font-bold text-sm sm:text-base text-stone-900">
                          {selectedItem.name}
                        </h5>
                      </div>
                      <p className="text-stone-600 text-xs mt-0.5">
                        Termasuk kelompok manakah lingkungan ini? Klik wadah di atas atau tombol di samping:
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleClassify(selectedItem, 'darat')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <span>🌳 Ekosistem Darat</span>
                    </button>
                    <button
                      onClick={() => handleClassify(selectedItem, 'air')}
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <span>💧 Ekosistem Air</span>
                    </button>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              sound.playClick();
              onGoToMap();
            }}
            className="px-4 py-2 bg-white/95 hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
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
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-display font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>Lanjut ke Misi 3: Individu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
