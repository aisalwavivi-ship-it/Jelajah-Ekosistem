import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Map, 
  Layers, 
  Users, 
  Leaf, 
  Droplet, 
  Sun, 
  Globe, 
  Search,
  CheckCircle,
  HelpCircle,
  Footprints
} from 'lucide-react';
import { AppScene, MissionId } from '../types';
import { sound } from '../utils/audio';
import { AudioNarratorButton } from '../components/AudioNarratorButton';

interface MaterialSceneProps {
  onGoToMap: () => void;
  onSelectMission: (scene: AppScene) => void;
  onGoToQuiz: () => void;
}

interface MaterialCardData {
  id: string;
  title: string;
  subtitle: string;
  category: 'ekosistem' | 'tingkatan' | 'komponen' | 'jenis';
  icon: string;
  badge: string;
  color: string;
  accentBorder: string;
  summary: string;
  details: string[];
  examples: string[];
  audioText: string;
  relatedMissionId?: MissionId;
  relatedMissionLabel?: string;
}

const MATERIALS_LIST: MaterialCardData[] = [
  {
    id: 'ekosistem',
    title: 'Ekosistem',
    subtitle: 'Kesatuan Alam & Kehidupan',
    category: 'ekosistem',
    icon: '🌎',
    badge: 'Konsep Dasar',
    color: 'from-emerald-500/20 to-teal-500/20',
    accentBorder: 'border-emerald-300',
    summary: 'Ekosistem adalah hubungan timbal balik dan kesatuan menyeluruh antara makhluk hidup (biotik) dengan lingkungan tak hidup (abiotik) di suatu tempat.',
    details: [
      'Makhluk hidup tidak dapat hidup sendirian tanpa lingkungan sekitarnya.',
      'Terjadi interaksi saling membutuhkan, seperti tumbuhan butuh sinar matahari dan air untuk hidup.',
      'Rumus sederhana: Makhluk Hidup (Biotik) + Benda Tak Hidup (Abiotik) = Ekosistem.'
    ],
    examples: [
      'Ekosistem Kolam: Ikan, teratai, katak, air kolam, lumpur dasar, dan sinar matahari.',
      'Ekosistem Taman Sekolah: Rumput, pohon beringin, kupu-kupu, cacing, tanah, dan udara segar.'
    ],
    audioText: 'Ekosistem adalah hubungan timbal balik dan kesatuan utuh antara makhluk hidup dengan lingkungan tak hidup di suatu tempat. Makhluk hidup bergantung pada benda tak hidup di sekitarnya.',
    relatedMissionId: 1,
    relatedMissionLabel: 'Jelajahi di Misi 1: Apa Itu Ekosistem?'
  },
  {
    id: 'individu',
    title: 'Individu',
    subtitle: 'Satuan Makhluk Hidup Tunggal',
    category: 'tingkatan',
    icon: '🐟',
    badge: 'Tingkatan 1',
    color: 'from-amber-500/20 to-yellow-500/20',
    accentBorder: 'border-amber-300',
    summary: 'Individu adalah satu makhluk hidup tunggal yang berdiri sendiri dalam suatu ekosistem.',
    details: [
      'Berasal dari kata latin "individuum" yang artinya tidak dapat dibagi-bagi.',
      'Menunjukkan satu sosok organisme saja, bukan kelompok.',
      'Memiliki organ tubuh yang bekerja bersama untuk bertahan hidup.'
    ],
    examples: [
      'Seekor ikan mas yang berenang di kolam.',
      'Sebatang pohon mangga di pekarangan sekolah.',
      'Seekor burung kutilang yang bertengger di dahan ranting.'
    ],
    audioText: 'Individu adalah satu makhluk hidup tunggal. Contohnya adalah satu ekor ikan mas, satu pohon mangga, atau seekor burung yang bertengger.',
    relatedMissionId: 2,
    relatedMissionLabel: 'Latih di Misi 2: Detektif Tingkatan Ekosistem'
  },
  {
    id: 'populasi',
    title: 'Populasi',
    subtitle: 'Kumpulan Makhluk Hidup Sejenis',
    category: 'tingkatan',
    icon: '🐠',
    badge: 'Tingkatan 2',
    color: 'from-blue-500/20 to-sky-500/20',
    accentBorder: 'border-blue-300',
    summary: 'Populasi adalah sekumpulan individu makhluk hidup sejenis yang hidup bersama di suatu tempat pada waktu tertentu.',
    details: [
      'Syarat penting populasi: anggotanya harus sejenis (satu spesies yang sama).',
      'Jumlah anggota populasi bisa bertambah karena kelahiran dan berkurang karena kematian.',
      'Bisa dihitung jumlah kepadatannya di wilayah tersebut.'
    ],
    examples: [
      'Sekelompok 15 ekor ikan nila yang hidup di satu kolam.',
      'Rumpun 20 batang pohon pisang di kebun belakang.',
      'Kawanan lebah madu penghuni sarang di dahan pohon.'
    ],
    audioText: 'Populasi adalah sekumpulan individu sejenis yang hidup di suatu tempat pada waktu yang sama. Contohnya kawanan lima belas ekor ikan nila dalam satu kolam.',
    relatedMissionId: 2,
    relatedMissionLabel: 'Latih di Misi 2: Detektif Tingkatan Ekosistem'
  },
  {
    id: 'komunitas',
    title: 'Komunitas',
    subtitle: 'Kumpulan Berbagai Populasi Berbeda',
    category: 'tingkatan',
    icon: '🐸',
    badge: 'Tingkatan 3',
    color: 'from-purple-500/20 to-indigo-500/20',
    accentBorder: 'border-purple-300',
    summary: 'Komunitas adalah kumpulan dari bermacam-macam populasi makhluk hidup berbeda jenis yang hidup bersama di suatu daerah.',
    details: [
      'Terdiri dari banyak jenis makhluk hidup: ada tumbuhan, hewan herbivora, karnivora, dan pengurai.',
      'Antar populasi saling berinteraksi, misalnya ikan memakan lumut dan capung bertelur di daun teratai.',
      'Hanya mencakup seluruh makhluk hidupnya saja (seluruh komponen biotik).'
    ],
    examples: [
      'Komunitas Kolam: Populasi ikan mas, populasi teratai, populasi katak, dan populasi siput air.',
      'Komunitas Kebun: Populasi pohon jeruk, populasi rumput teki, populasi kupu-kupu, dan populasi belalang.'
    ],
    audioText: 'Komunitas adalah kumpulan berbagai populasi berbeda jenis yang hidup bersama di suatu wilayah. Misalnya di kolam ada populasi ikan, populasi teratai, dan populasi katak.',
    relatedMissionId: 2,
    relatedMissionLabel: 'Latih di Misi 2: Detektif Tingkatan Ekosistem'
  },
  {
    id: 'biotik',
    title: 'Komponen Biotik',
    subtitle: 'Segala Makhluk Hidup Penjaga Ekosistem',
    category: 'komponen',
    icon: '🌿',
    badge: 'Komponen Hidup',
    color: 'from-emerald-500/20 to-green-500/20',
    accentBorder: 'border-emerald-300',
    summary: 'Komponen biotik adalah seluruh makhluk hidup yang ada di dalam ekosistem, baik yang berukuran besar maupun mikroorganisme.',
    details: [
      'Produsen (Tumbuhan): Mampu membuat makanannya sendiri melalui fotosintesis dengan bantuan sinar matahari.',
      'Konsumen (Hewan & Manusia): Memakan makhluk hidup lain karena tidak dapat membuat makanan sendiri.',
      'Pengurai / Dekomposer (Jamur & Bakteri): Menguraikan sisa makhluk hidup yang mati menjadi zat hara untuk tanah.'
    ],
    examples: [
      'Produsen: Pohon, rumput, lumut, ganggang air, eceng gondok.',
      'Konsumen: Ikan, burung, belalang, kupu-kupu, kucing, katak.',
      'Pengurai: Cacing tanah, jamur pelapuk, bakteri tanah.'
    ],
    audioText: 'Komponen biotik adalah semua makhluk hidup di ekosistem. Terdiri atas produsen yaitu tumbuhan, konsumen yaitu hewan dan manusia, serta pengurai yaitu jamur dan bakteri.',
    relatedMissionId: 3,
    relatedMissionLabel: 'Uji di Misi 3: Petualangan Biotik'
  },
  {
    id: 'abiotik',
    title: 'Komponen Abiotik',
    subtitle: 'Benda Tak Hidup Penunjang Kehidupan',
    category: 'komponen',
    icon: '☀️',
    badge: 'Lingkungan Tak Hidup',
    color: 'from-amber-500/20 to-orange-500/20',
    accentBorder: 'border-amber-300',
    summary: 'Komponen abiotik adalah semua benda tak hidup dan kondisi fisik atau kimia di lingkungan yang memengaruhi kehidupan makhluk hidup.',
    details: [
      'Cahaya Matahari: Sumber energi utama untuk fotosintesis tumbuhan dan menghangatkan suhu bumi.',
      'Air: Kebutuhan utama minum, melarutkan nutrisi, dan habitat bagi hewan air.',
      'Udara: Mengandung oksigen (O2) untuk bernapas dan karbon dioksida (CO2) untuk fotosintesis.',
      'Tanah & Bebatuan: Media tempat akar berpijak serta menyimpan air dan mineral penting.',
      'Suhu & Kelembapan: Menentukan kenyamanan dan jenis makhluk hidup yang mampu bertahan.'
    ],
    examples: [
      'Sinar mentari pagi, air kolam jernih, hembusan angin segar, tanah gembur, dan kerikil sungai.'
    ],
    audioText: 'Komponen abiotik adalah benda tak hidup di lingkungan, seperti cahaya matahari, air, tanah, udara, dan suhu. Benda tak hidup ini sangat dibutuhkan makhluk hidup untuk bernapas dan bertumbuh.',
    relatedMissionId: 4,
    relatedMissionLabel: 'Uji di Misi 4: Laboratorium Abiotik'
  },
  {
    id: 'jenis_ekosistem',
    title: 'Jenis-Jenis Ekosistem',
    subtitle: 'Darat vs Air & Alami vs Buatan',
    category: 'jenis',
    icon: '🏞️',
    badge: 'Klasifikasi Alam',
    color: 'from-teal-500/20 to-cyan-500/20',
    accentBorder: 'border-teal-300',
    summary: 'Ekosistem dibedakan berdasarkan habitat fisiknya (darat & air) serta proses terbentuknya (alami & buatan).',
    details: [
      'Ekosistem Darat: Lingkungan fisiknya berupa daratan luas (misal: hutan hujan tropis, padang rumput savana, padang pasir tursina, tundra salju).',
      'Ekosistem Air: Lingkungan fisiknya didominasi oleh perairan tawar (danau, sungai, rawa) atau air asin (laut, terumbu karang).',
      'Ekosistem Alami: Terbentuk sendirinya oleh alam tanpa campur tangan manusia (hutan, laut lepas, sungai).',
      'Ekosistem Buatan: Diciptakan atau dibentuk oleh manusia untuk memenuhi kebutuhannya (sawah, kolam ikan, waduk, akuarium, kebun sekolah).'
    ],
    examples: [
      'Darat Alami: Hutan rimba Kalimantan, Taman Nasional Komodo.',
      'Air Alami: Danau Toba, Sungai Musi, Laut Banda.',
      'Darat Buatan: Sawah bertingkat, kebun jagung, taman kota.',
      'Air Buatan: Kolam lele sekolah, bendungan waduk Jatiluhur.'
    ],
    audioText: 'Jenis ekosistem terbagi menjadi ekosistem darat dan air. Berdasarkan pembuatannya, ada ekosistem alami seperti hutan dan sungai alami, serta ekosistem buatan manusia seperti sawah dan kolam ikan.',
    relatedMissionId: 5,
    relatedMissionLabel: 'Rancang di Misi 5: Bangun Ekosistem Mandiri'
  }
];

export const MaterialScene: React.FC<MaterialSceneProps> = ({
  onGoToMap,
  onSelectMission,
  onGoToQuiz,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ekosistem' | 'tingkatan' | 'komponen' | 'jenis'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('ekosistem');

  const filteredMaterials = MATERIALS_LIST.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.examples.some((ex) => ex.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full p-3 sm:p-6 flex flex-col items-center justify-start min-h-[calc(100vh-120px)] relative z-10">
      <div className="max-w-5xl w-full space-y-4 sm:space-y-5">
        
        {/* Header Glassmorphism Panel */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border-2 border-emerald-200/80 shadow-lg shadow-emerald-950/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-3xl shadow-md border-2 border-emerald-200 shrink-0">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  Ensiklopedi Petualang
                </span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  IPAS Kelas V SD
                </span>
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-emerald-950 mt-1 leading-tight">
                Materi Lengkap: Jelajah Ekosistem
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                Pelajari konsep dasar, tingkatan kehidupan, komponen biotik, abiotik, dan aneka ragam ekosistem alam!
              </p>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto shrink-0">
            <button
              id="btn-material-to-map"
              onClick={() => {
                sound.playClick();
                onGoToMap();
              }}
              className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-display font-bold rounded-2xl shadow-sm text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Kembali ke Peta</span>
            </button>
            <button
              id="btn-material-to-quiz"
              onClick={() => {
                sound.playStarEarned();
                onGoToQuiz();
              }}
              className="flex-1 md:flex-none px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-stone-950 font-display font-bold rounded-2xl shadow-sm text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <span>🏆 Uji Kuis</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills & Live Search Bar */}
        <div className="bg-white/88 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-emerald-200/70 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { key: 'all', label: '🌟 Semua Materi' },
              { key: 'ekosistem', label: '🌎 Ekosistem' },
              { key: 'tingkatan', label: '👥 Individu, Populasi & Komunitas' },
              { key: 'komponen', label: '🌿 Biotik & Abiotik' },
              { key: 'jenis', label: '🏞️ Jenis Ekosistem' },
            ].map((tab) => {
              const isActive = selectedCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  id={`tab-material-${tab.key}`}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategory(tab.key as any);
                  }}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-all duration-200 active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-300'
                      : 'bg-stone-100/90 text-stone-700 hover:bg-emerald-100 hover:text-emerald-900 border border-stone-200/70'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi atau contoh..."
              className="w-full pl-9 pr-3 py-1.5 bg-white/90 border border-stone-300 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
            />
          </div>
        </div>

        {/* Material Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredMaterials.map((mat) => {
            const isExpanded = expandedId === mat.id;

            return (
              <motion.div
                key={mat.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border-2 shadow-lg shadow-stone-900/5 transition-all duration-300 hover:shadow-xl ${
                  isExpanded ? `${mat.accentBorder} ring-3 ring-emerald-300/40` : 'border-emerald-100/80'
                }`}
              >
                {/* Top Row: Icon, Title & Audio Button */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
                      {mat.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {mat.badge}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-emerald-950 leading-tight mt-0.5">
                        {mat.title}
                      </h3>
                      <p className="text-[11px] text-stone-500 font-medium">
                        {mat.subtitle}
                      </p>
                    </div>
                  </div>

                  <AudioNarratorButton
                    id={`audio-mat-${mat.id}`}
                    audioText={mat.audioText}
                    label="Dengar"
                    size="sm"
                    variant="pill"
                  />
                </div>

                {/* Summary Box */}
                <div className="mt-3.5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                  {mat.summary}
                </div>

                {/* Core Concept Key Points */}
                <div className="mt-3 space-y-1.5">
                  <h4 className="font-display font-bold text-xs text-stone-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Poin Penting Sains:</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-stone-600 pl-1">
                    {mat.details.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Real-life Examples Accordion / Box */}
                <div className="mt-3.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70">
                  <span className="text-[11px] font-display font-bold text-amber-900 block mb-1">
                    🔍 Contoh di Lingkungan Sekitar:
                  </span>
                  <div className="space-y-1">
                    {mat.examples.map((ex, i) => (
                      <p key={i} className="text-xs text-stone-700 leading-relaxed pl-2 border-l-2 border-amber-400">
                        {ex}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Footer Action: Go to Related Mission */}
                {mat.relatedMissionId && (
                  <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between">
                    <button
                      id={`btn-mat-explore-${mat.id}`}
                      onClick={() => {
                        sound.playClick();
                        onSelectMission(`mission-${mat.relatedMissionId}` as AppScene);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <Footprints className="w-3.5 h-3.5" />
                      <span>{mat.relatedMissionLabel || `Misi ${mat.relatedMissionId}`}</span>
                    </button>
                    
                    <span className="text-[11px] text-stone-500 font-medium">
                      Praktik langsung di alam!
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 text-center border border-emerald-200 shadow-md">
            <span className="text-4xl block mb-2">🔍</span>
            <p className="font-display font-bold text-stone-700">
              Tidak ada materi yang cocok dengan pencarian "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-3 px-4 py-2 bg-emerald-700 text-white font-display text-xs rounded-xl cursor-pointer"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
