import { MissionMeta, QuizQuestion, BadgeInfo } from '../types';

export const MISSIONS_DATA: MissionMeta[] = [
  {
    id: 1,
    title: 'Apa Itu Ekosistem?',
    subtitle: 'Mengenal Kesatuan Alam',
    location: 'Taman Depan Sekolah',
    icon: '🌎',
    description: 'Ekosistem adalah kesatuan antara makhluk hidup dan lingkungan tak hidup yang terdapat dalam suatu tempat.',
    points: 10
  },
  {
    id: 2,
    title: 'Jelajah Jenis Ekosistem',
    subtitle: 'Ekosistem Darat & Air',
    location: 'Jalur Bebatuan & Perairan',
    icon: '🏞️',
    description: 'Kenali dua kelompok besar ekosistem: Ekosistem Darat (hutan, kebun, taman) dan Ekosistem Air (sungai, kolam, laut).',
    points: 15
  },
  {
    id: 3,
    title: 'Siapa Aku? (Individu)',
    subtitle: 'Satu Makhluk Hidup',
    location: 'Kebun Tanaman Rindang',
    icon: '👤',
    description: 'Individu adalah satu makhluk hidup tunggal. Temukan dan hitung berbagai individu di alam!',
    points: 15
  },
  {
    id: 4,
    title: 'Temukan Populasi',
    subtitle: 'Kumpulan Individu Sejenis',
    location: 'Padang Rumput & Tepi Kolam',
    icon: '👥',
    description: 'Populasi adalah kumpulan individu sejenis yang hidup di suatu tempat. Bedakan mana yang populasi!',
    points: 15
  },
  {
    id: 5,
    title: 'Temukan Komunitas',
    subtitle: 'Kumpulan Berbagai Populasi',
    location: 'Pojok Lingkungan Terpadu',
    icon: '👨‍👩‍👧‍👦',
    description: 'Komunitas adalah kumpulan berbagai populasi yang hidup bersama di suatu tempat.',
    points: 15
  },
  {
    id: 6,
    title: 'Detektif Biotik & Abiotik',
    subtitle: 'Game Pilahkan Komponen',
    location: 'Laboratorium Alam Terbuka',
    icon: '🌱',
    description: 'Biotik adalah makhluk hidup, sedangkan abiotik adalah benda/faktor tak hidup. Kelompokkan komponen ke wadah yang tepat!',
    points: 15
  },
  {
    id: 7,
    title: 'Misi Gabungan Ekosistem',
    subtitle: 'Individu ➔ Populasi ➔ Komunitas ➔ Ekosistem',
    location: 'Danau & Kolam Alami',
    icon: '🔍',
    description: 'Amati alur pembentukan ekosistem bertahap: dari satu individu, populasi, komunitas, hingga menyatu dengan abiotik.',
    points: 15
  },
  {
    id: 8,
    title: 'Tantangan Susun Piramida Ekosistem',
    subtitle: 'Susun tingkat trofik ekosistem dari dasar hingga puncak!',
    location: 'Puncak Pandang Ekosistem',
    icon: '🔺',
    description: 'Susun tingkat trofik ekosistem dari Produsen (tumbuhan hijau) hingga Konsumen III (elang) membentuk Piramida Ekosistem yang utuh!',
    points: 20
  }
];

export const MISSION_JOURNAL_DETAILS: Record<
  number,
  {
    summary: string;
    keyDiscovery: string;
    categoryTag: 'biotik' | 'abiotik' | 'ekosistem';
    learningObjective: string;
    keyConcepts: {
      biotik: string;
      abiotik: string;
      relationship: string;
    };
  }
> = {
  1: {
    summary: 'Mengenal pengertian ekosistem sebagai kesatuan makhluk hidup dan benda tak hidup.',
    keyDiscovery: 'Ekosistem adalah kesatuan antara makhluk hidup (biotik) dan lingkungan tak hidup (abiotik) yang terdapat dalam suatu tempat.',
    categoryTag: 'ekosistem',
    learningObjective: 'Memahami pengertian dasar ekosistem dan mengidentifikasi unsur pembentuknya.',
    keyConcepts: {
      biotik: 'Semua makhluk hidup di taman sekolah (pohon mangga, burung kutilang, kucing, serangga).',
      abiotik: 'Benda/faktor tak hidup penyokong kehidupan (tanah tempat berpijak, udara untuk bernapas, cahaya matahari, dan air hujan).',
      relationship: 'Ekosistem tercipta karena adanya hubungan timbal balik yang erat antara komponen biotik dan abiotik.',
    },
  },
  2: {
    summary: 'Menjelajahi dan membedakan dua jenis ekosistem: darat dan air.',
    keyDiscovery: 'Ekosistem darat memiliki lingkungan utama daratan (hutan, kebun, taman, padang rumput), sedangkan ekosistem air berupa perairan (sungai, kolam, danau, laut).',
    categoryTag: 'ekosistem',
    learningObjective: 'Mengklasifikasikan berbagai lingkungan ke dalam ekosistem darat atau ekosistem air.',
    keyConcepts: {
      biotik: 'Biotik darat hidup di permukaan tanah (pohon pinus, rusa, burung); biotik air beradaptasi di perairan (ikan, teratai, lumut air).',
      abiotik: 'Abiotik darat didominasi tanah dan udara kering; abiotik air didominasi volume cairan air, lumpur dasar, dan kejernihan air.',
      relationship: 'Karakteristik fisik komponen abiotik (daratan vs perairan) menentukan jenis makhluk hidup (biotik) yang mampu hidup di dalamnya.',
    },
  },
  3: {
    summary: 'Mengamati dan menemukan konsep individu sebagai satu makhluk hidup tunggal.',
    keyDiscovery: 'Individu adalah satu makhluk hidup (misalnya satu pohon, satu ikan, satu kupu-kupu, atau satu burung).',
    categoryTag: 'biotik',
    learningObjective: 'Mengenali dan membedakan individu dari kumpulan makhluk hidup.',
    keyConcepts: {
      biotik: 'Individu adalah satu makhluk hidup tunggal (misal 1 ekor burung merpati atau 1 batang pohon mangga).',
      abiotik: 'Benda mati di sekitarnya (sebutir batu kali, setetes air) BUKAN individu karena tidak memiliki ciri kehidupan.',
      relationship: 'Setiap individu biotik membutuhkan ruang abiotik tertentu (seperti udara dan suhu yang pas) untuk bertahan hidup mandiri.',
    },
  },
  4: {
    summary: 'Mengidentifikasi populasi sebagai kumpulan individu sejenis di suatu tempat.',
    keyDiscovery: 'Populasi adalah sekumpulan individu sejenis yang hidup bersama di tempat yang sama (misal sekumpulan ikan mas di kolam).',
    categoryTag: 'biotik',
    learningObjective: 'Membedakan populasi (individu sejenis) dengan individu tunggal maupun campuran hewan.',
    keyConcepts: {
      biotik: 'Populasi adalah kumpulan individu SEJENIS (spesies yang sama), seperti sekawanan 10 ekor ikan mas atau 6 pohon cemara.',
      abiotik: 'Komponen abiotik (luas area tanah, ketersediaan air minum, dan udara) menjadi daya dukung bagi kelangsungan populasi.',
      relationship: 'Kepadatan suatu populasi biotik sangat dibatasi oleh ketersediaan faktor abiotik di habitat tersebut.',
    },
  },
  5: {
    summary: 'Menemukan komunitas sebagai kumpulan berbagai populasi yang hidup bersama.',
    keyDiscovery: 'Komunitas terbentuk ketika beberapa populasi berbeda (misal populasi ikan, katak, dan teratai) hidup berdampingan di suatu tempat.',
    categoryTag: 'ekosistem',
    learningObjective: 'Memahami hubungan antara individu, populasi, dan komunitas.',
    keyConcepts: {
      biotik: 'Komunitas adalah gabungan dari bermacam-macam populasi makhluk hidup yang berbeda jenis di satu kawasan.',
      abiotik: 'Faktor abiotik yang sama (danau, dasar lumpur, sinar mentari) digunakan dan dinikmati secara bersamaan oleh seluruh populasi.',
      relationship: 'Seluruh populasi biotik dalam komunitas saling berbagi dan berinteraksi di dalam lingkungan abiotik yang sama.',
    },
  },
  6: {
    summary: 'Memilah komponen alam menjadi biotik (makhluk hidup) dan abiotik (faktor tak hidup).',
    keyDiscovery: 'Biotik adalah semua makhluk hidup (hewan, tumbuhan, manusia). Abiotik adalah benda/faktor tak hidup (air, tanah, batu, udara, cahaya matahari).',
    categoryTag: 'abiotik',
    learningObjective: 'Mengelompokkan komponen ekosistem ke dalam biotik dan abiotik secara akurat.',
    keyConcepts: {
      biotik: 'Biotik mencakup organisme hidup yang bernapas, bergerak, tumbuh, dan berkembang biak (ikan, katak, lebah, jamur, tanaman).',
      abiotik: 'Abiotik mencakup faktor fisik dan kimia alam tak hidup (sinar matahari, air tawar, udara oksigen, bebatuan, tanah humus).',
      relationship: 'Komponen biotik tidak dapat bertahan hidup tanpa ketersediaan faktor abiotik (air, cahaya matahari, dan udara).',
    },
  },
  7: {
    summary: 'Menelusuri hierarki utuh: Individu ➔ Populasi ➔ Komunitas ➔ Ekosistem.',
    keyDiscovery: 'Satu ikan (individu) ➔ kumpulan ikan (populasi) ➔ populasi ikan + katak + teratai (komunitas) ➔ menyatu dengan air, tanah, batu, matahari menjadi EKOSISTEM!',
    categoryTag: 'ekosistem',
    learningObjective: 'Menghubungkan seluruh tingkatan organisasi kehidupan dalam satu ekosistem nyata.',
    keyConcepts: {
      biotik: 'Tingkatan biotik berjenjang dari satuan terkecil: Individu (1) ➔ Populasi (sejenis) ➔ Komunitas (berbagai populasi).',
      abiotik: 'Lingkungan fisik tak hidup (air, tanah, udara, sinar mentari) yang melingkupi komunitas.',
      relationship: 'Ketika Komunitas (seluruh makhluk hidup) berpadu dan berinteraksi dengan Lingkungan Abiotik, terbentuklah kesatuan utuh yang disebut EKOSISTEM.',
    },
  },
  8: {
    summary: 'Menyusun tingkat trofik ekosistem dari Produsen hingga Konsumen III membentuk Piramida Ekosistem yang utuh.',
    keyDiscovery: 'Piramida ekosistem tersusun dari Produsen di dasar (tumbuhan hijau), Konsumen I (herbivora/belalang), Konsumen II (katak), dan Konsumen III (elang) di puncak.',
    categoryTag: 'ekosistem',
    learningObjective: 'Memahami tingkat trofik ekosistem dan membedakan komponen trofik rantai makanan dari faktor abiotik.',
    keyConcepts: {
      biotik: 'Organisme trofik berjenjang: Produsen (penghasil energi) ➔ Konsumen I (pemakan tumbuhan) ➔ Konsumen II (pemakan serangga) ➔ Konsumen III (predator puncak).',
      abiotik: 'Faktor fisik tak hidup (air, tanah, batu, cahaya matahari) menyokong kehidupan tetapi bukan merupakan tingkat trofik rantai makanan.',
      relationship: 'Semakin ke atas tingkat trofik piramida, jumlah organisme biasanya semakin sedikit dan energi yang dialirkan semakin berkurang.',
    },
  },
};

export interface ExplorerBadge {
  id: string;
  missionId: number;
  title: string;
  category: string;
  icon: string;
  badgeName: string;
  unlockedDesc: string;
  lockedDesc: string;
  color: string;
}

export const EXPLORER_BADGES: ExplorerBadge[] = [
  {
    id: 'badge-1',
    missionId: 1,
    title: 'Pengamat Ekosistem',
    category: 'Konsep Dasar',
    icon: '🌱',
    badgeName: 'Lencana Penjelajah Pemula',
    unlockedDesc: 'Memahami kesatuan hubungan timbal balik antara makhluk hidup dan lingkungan tak hidup.',
    lockedDesc: 'Selesaikan Misi 1 di Taman Sekolah untuk membuka lencana ini!',
    color: 'from-emerald-400 to-green-600',
  },
  {
    id: 'badge-2',
    missionId: 2,
    title: 'Penjelajah Darat & Air',
    category: 'Jenis Ekosistem',
    icon: '🏞️',
    badgeName: 'Lencana Dua Alam',
    unlockedDesc: 'Berhasil mengidentifikasi ciri khas ekosistem daratan dan perairan.',
    lockedDesc: 'Selesaikan Misi 2 untuk membuka lencana ini!',
    color: 'from-sky-400 to-blue-600',
  },
  {
    id: 'badge-3',
    missionId: 3,
    title: 'Detektif Individu',
    category: 'Tingkatan 1',
    icon: '👤',
    badgeName: 'Lencana Pengamat Tunggal',
    unlockedDesc: 'Tepat mengenali satu makhluk hidup mandiri sebagai satu individu.',
    lockedDesc: 'Selesaikan Misi 3 untuk membuka lencana ini!',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'badge-4',
    missionId: 4,
    title: 'Pakar Populasi',
    category: 'Tingkatan 2',
    icon: '👥',
    badgeName: 'Lencana Kawan Sejenis',
    unlockedDesc: 'Mahir membedakan kumpulan individu sejenis di berbagai habitat.',
    lockedDesc: 'Selesaikan Misi 4 untuk membuka lencana ini!',
    color: 'from-purple-400 to-indigo-600',
  },
  {
    id: 'badge-5',
    missionId: 5,
    title: 'Penemu Komunitas',
    category: 'Tingkatan 3',
    icon: '👨‍👩‍👧‍👦',
    badgeName: 'Lencana Harmoni Komunitas',
    unlockedDesc: 'Memahami keberagaman berbagai populasi yang hidup rukun berdampingan.',
    lockedDesc: 'Selesaikan Misi 5 untuk membuka lencana ini!',
    color: 'from-pink-400 to-rose-600',
  },
  {
    id: 'badge-6',
    missionId: 6,
    title: 'Pakar Biotik & Abiotik',
    category: 'Klasifikasi',
    icon: '⚖️',
    badgeName: 'Lencana Pemilah Sejati',
    unlockedDesc: 'Sempurna memilah unsur makhluk hidup (biotik) dan faktor tak hidup (abiotik).',
    lockedDesc: 'Selesaikan Misi 6 untuk membuka lencana ini!',
    color: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'badge-7',
    missionId: 7,
    title: 'Detektif Alur Ekosistem',
    category: 'Alur Hierarki',
    icon: '🔍',
    badgeName: 'Lencana Jenjang Kehidupan',
    unlockedDesc: 'Menguasai urutan hierarki: Individu ➔ Populasi ➔ Komunitas ➔ Ekosistem.',
    lockedDesc: 'Selesaikan Misi 7 untuk membuka lencana ini!',
    color: 'from-yellow-400 to-amber-600',
  },
  {
    id: 'badge-8',
    missionId: 8,
    title: 'Master Harmoni Alam',
    category: 'Puncak Konsep',
    icon: '👑',
    badgeName: 'Lencana Mahkota Penjelajah',
    unlockedDesc: 'Menyelesaikan susunan piramida ekosistem dari Produsen hingga Konsumen III.',
    lockedDesc: 'Selesaikan Misi 8 untuk membuka lencana mahkota ini!',
    color: 'from-amber-300 via-yellow-400 to-orange-500',
  },
];

export const BADGES: BadgeInfo[] = [
  {
    id: 'master',
    title: 'Penjelajah Ekosistem',
    minScore: 90,
    icon: '🌿',
    description: 'Luar biasa! Kamu menguasai konsep ekosistem, darat-air, individu, populasi, komunitas, biotik, dan abiotik dengan sempurna.',
    color: 'from-emerald-400 to-green-600'
  },
  {
    id: 'habitats',
    title: 'Penjelajah Darat dan Air',
    minScore: 80,
    icon: '🏞️',
    description: 'Hebat! Kamu sangat mahir membedakan karakteristik ekosistem darat dan perairan.',
    color: 'from-sky-400 to-blue-600'
  },
  {
    id: 'community',
    title: 'Penemu Komunitas',
    minScore: 70,
    icon: '👨‍👩‍👧‍👦',
    description: 'Bagus sekali! Kamu memahami bagaimana berbagai populasi hidup rukun membentuk komunitas.',
    color: 'from-purple-400 to-indigo-600'
  },
  {
    id: 'population',
    title: 'Detektif Populasi',
    minScore: 60,
    icon: '👥',
    description: 'Bagus! Kamu bisa membedakan kumpulan individu sejenis di berbagai lingkungan.',
    color: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'individual',
    title: 'Detektif Individu',
    minScore: 50,
    icon: '👤',
    description: 'Tepat sekali! Kamu memahami arti satu makhluk hidup tunggal sebagai individu.',
    color: 'from-teal-400 to-emerald-500'
  },
  {
    id: 'biotic-abiotic',
    title: 'Detektif Biotik-Abiotik',
    minScore: 0,
    icon: '🌱',
    description: 'Terus semangat! Kamu telah mengenal perbedaan makhluk hidup dan benda/faktor tak hidup.',
    color: 'from-amber-500 to-orange-500'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    badge: '🖼️ Ilustrasi Ekosistem: Taman Halaman Sekolah',
    scenario: 'Amatilah kartu ilustrasi ekosistem taman halaman sekolah di bawah ini. Terdapat berbagai bagian berlabel [A], [B], [C], dan [D]. Perhatikan ciri fisik dan jumlah organisme di setiap label.',
    imageVisual: '🐈 Kucing Tunggal [A]  |  🐜🐜 Semut Merah [B]  |  🌳🐈🪴 Komunitas Taman [C]  |  ☀️ Tanah & Mentari [D]',
    illustration: {
      theme: 'garden',
      caption: 'Ilustrasi Ekosistem Taman Halaman Sekolah',
      labels: [
        {
          badgeId: 'A',
          name: 'Seekor Kucing Belang Tiga',
          level: 'individu',
          icon: '🐈',
          description: 'Satu ekor kucing belang tiga yang berada sendirian di bawah pohon mangga di halaman sekolah (satu individu tunggal).',
          imageUrl: '/tantangan/individu_kucing.jpg',
        },
        {
          badgeId: 'B',
          name: 'Sekumpulan Semut Merah',
          level: 'populasi',
          icon: '🐜',
          description: 'Sekumpulan semut merah dari jenis yang sama yang hidup dan beraktivitas bersama di sekitar batang pohon.',
          imageUrl: '/tantangan/populasi_semut.jpg',
        },
        {
          badgeId: 'C',
          name: 'Makhluk Hidup Taman Sekolah',
          level: 'komunitas',
          icon: '🌳🐈🪴🦋',
          description: 'Berbagai jenis makhluk hidup (pohon, rumput, semut, kucing, kupu-kupu, dan burung) yang hidup berdampingan dalam satu lingkungan taman.',
          imageUrl: '/tantangan/komunitas_taman.jpg',
        },
        {
          badgeId: 'D',
          name: 'Ekosistem Taman Sekolah',
          level: 'abiotik',
          icon: '☀️💧🪴',
          description: 'Ekosistem lengkap yang menyatukan komponen biotik (makhluk hidup) dan komponen abiotik (tanah, air, udara, serta sinar matahari).',
          imageUrl: '/tantangan/ekosistem_sekolah.jpg',
        },
      ],
    },
    question: 'Berdasarkan kartu ilustrasi ekosistem taman di atas, bagian yang ditunjukkan oleh label [A] (seekor kucing belang yang sendirian) tergolong ke dalam tingkatan...',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Individu (satu makhluk hidup tunggal)', isCorrect: true },
      { id: 'b', text: 'Populasi hewan' },
      { id: 'c', text: 'Komunitas taman' },
      { id: 'd', text: 'Komponen abiotik tak hidup' },
    ],
    explanation: 'Label [A] hanya memperlihatkan satu ekor makhluk hidup tunggal (seekor kucing), sehingga merupakan contoh nyata dari INDIVIDU.',
  },
  {
    id: 2,
    badge: '🖼️ Ilustrasi Ekosistem: Danau & Lereng Pinus',
    scenario: 'Perhatikan gambar ilustrasi ekosistem danau alami di bawah ini. Amatilah kawanan ikan mas yang berenang bersama di label [B].',
    imageVisual: '🦅 Rajawali [A]  |  🐟🐟 Kawanan Ikan Mas [B]  |  🌲🦅🐟 Danau Komunitas [C]  |  💧 Air & Tebing [D]',
    illustration: {
      theme: 'pond',
      caption: 'Ilustrasi Ekosistem Perairan Danau Alami',
      labels: [
        {
          badgeId: 'A',
          name: 'Seekor Burung Rajawali',
          level: 'individu',
          icon: '🦅',
          description: '1 ekor burung rajawali tunggal bertengger di dahan pinus pinggir danau.',
        },
        {
          badgeId: 'B',
          name: 'Sekawanan 12 Ikan Mas',
          level: 'populasi',
          icon: '🐟',
          description: 'Sekelompok 12 ekor ikan mas sejenis yang berenang bersama di dalam air danau.',
        },
        {
          badgeId: 'C',
          name: 'Aneka Ragam Makhluk Danau',
          level: 'komunitas',
          icon: '🌲🦅🐟🌿',
          description: 'Seluruh populasi ikan mas, rajawali, pohon pinus, dan lumut air di danau.',
        },
        {
          badgeId: 'D',
          name: 'Air Tawar & Bebatuan Tebing',
          level: 'abiotik',
          icon: '💧🪨',
          description: 'Faktor abiotik air jernih dan batuan penopang habitat danau.',
        },
      ],
    },
    question: 'Berdasarkan kartu ilustrasi danau di atas, kelompok pada label [B] (sekawanan 12 ekor ikan mas sejenis) tepat digolongkan sebagai...',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Populasi, karena merupakan sekumpulan individu sejenis di tempat yang sama', isCorrect: true },
      { id: 'b', text: 'Individu, karena tinggal di danau yang sama' },
      { id: 'c', text: 'Komunitas, karena jumlah ikannya banyak' },
      { id: 'd', text: 'Komponen abiotik perairan' },
    ],
    explanation: 'Label [B] menunjukkan sekumpulan individu dari jenis yang sama (ikan mas) di tempat yang sama, yang secara ilmiah disebut POPULASI.',
  },
  {
    id: 3,
    badge: '🖼️ Ilustrasi Ekosistem: Kebun Belakang Rumah',
    scenario: 'Perhatikan gambar ilustrasi kebun belakang rumah di bawah ini. Terdapat sebatang mawar [A], kawanan lebah [B], serta gabungan lebah, kupu-kupu, dan berbagai tanaman bunga [C].',
    imageVisual: '🌹 Mawar [A]  |  🐝🐝 Kawanan Lebah [B]  |  🌹🐝🦋 Komunitas Kebun [C]  |  💨 Udara & Tanah [D]',
    illustration: {
      theme: 'garden',
      caption: 'Ilustrasi Ekosistem Kebun Belakang Rumah',
      labels: [
        {
          badgeId: 'A',
          name: 'Sebatang Tanaman Mawar',
          level: 'individu',
          icon: '🌹',
          description: '1 batang tanaman mawar tunggal yang sedang mekar di sudut kebun.',
        },
        {
          badgeId: 'B',
          name: 'Sekelompok 10 Ekor Lebah',
          level: 'populasi',
          icon: '🐝',
          description: 'Kawanan 10 ekor lebah madu sejenis yang sedang menghisap nektar bersama.',
        },
        {
          badgeId: 'C',
          name: 'Kumpulan Berbagai Ragam Hayati',
          level: 'komunitas',
          icon: '🌹🐝🦋🪴',
          description: 'Gabungan populasi lebah, kupu-kupu, semut, dan tanaman bunga di kebun.',
        },
        {
          badgeId: 'D',
          name: 'Udara Hangat & Tanah Kebun',
          level: 'abiotik',
          icon: '💨🪴',
          description: 'Faktor abiotik berupa tanah gembur dan hembusan angin segar.',
        },
      ],
    },
    question: 'Perhatikan bagian berlabel [C] pada gambar kebun di atas. Mengapa gabungan lebah, kupu-kupu, semut, dan tanaman bunga tersebut disebut KOMUNITAS?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Karena terdiri dari kumpulan berbagai macam populasi yang berbeda jenis yang hidup bersama', isCorrect: true },
      { id: 'b', text: 'Karena semua organisme di kebun hanya berjumlah satu ekor' },
      { id: 'c', text: 'Karena semuanya berasal dari spesies dan jenis yang sama persis' },
      { id: 'd', text: 'Karena merupakan komponen tak hidup' },
    ],
    explanation: 'Kelompok [C] terdiri atas bermacam-macam jenis populasi (lebah, kupu-kupu, bunga mawar) yang hidup berdampingan di satu kawasan, sehingga memenuhi definisi KOMUNITAS.',
  },
  {
    id: 4,
    badge: '🖼️ Ilustrasi Ekosistem: Kolam Teratai Sekolah',
    scenario: 'Perhatikan kartu ilustrasi kolam teratai di bawah ini. Amatilah seekor kura-kura air tawar yang berada di atas kayu apung berlabel [A].',
    imageVisual: '🐢 Kura-kura [A]  |  🐟🐟 Kawanan Kecebong [B]  |  🪷 Teratai & Kura-kura [C]  |  💧 Air Kolam [D]',
    illustration: {
      theme: 'pond',
      caption: 'Ilustrasi Ekosistem Kolam Teratai Sekolah',
      labels: [
        {
          badgeId: 'A',
          name: 'Seekor Kura-kura Air Tawar',
          level: 'individu',
          icon: '🐢',
          description: '1 ekor kura-kura air tawar tunggal yang sedang beristirahat sendirian.',
        },
        {
          badgeId: 'B',
          name: 'Sekumpulan Kecebong',
          level: 'populasi',
          icon: '🐟',
          description: 'Kumpulan puluhan kecebong sejenis yang berenang lincah di tepian kolam.',
        },
        {
          badgeId: 'C',
          name: 'Kehidupan Kolam Terpadu',
          level: 'komunitas',
          icon: '🐢🪷🐟🌿',
          description: 'Kumpulan populasi kura-kura, kecebong, ikan kecil, dan tanaman teratai.',
        },
        {
          badgeId: 'D',
          name: 'Air Kolam & Lumpur Dasar',
          level: 'abiotik',
          icon: '💧🪨',
          description: 'Lingkungan fisik air tenang dan lumpur dasar kolam.',
        },
      ],
    },
    question: 'Berdasarkan kartu ilustrasi kolam di atas, bagian berlabel [A] (seekor kura-kura air tawar tunggal) merupakan contoh dari tingkatan...',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Individu (satu makhluk hidup tunggal)', isCorrect: true },
      { id: 'b', text: 'Populasi kura-kura' },
      { id: 'c', text: 'Komunitas perairan' },
      { id: 'd', text: 'Komponen abiotik' },
    ],
    explanation: 'Label [A] hanya terdiri dari satu organisme hidup tunggal (seekor kura-kura), sehingga tergolong sebagai INDIVIDU.',
  },
  {
    id: 5,
    badge: '🖼️ Ilustrasi Ekosistem: Danau & Kolam Alami',
    scenario: 'Perhatikan gambar ilustrasi ekosistem kolam di bawah ini. Terdapat berbagai bagian berlabel [A], [B], [C], dan [D]. Amatilah ciri fisik dan jumlah makhluk hidup di setiap label.',
    imageVisual: '🐸 Katak Tunggal [A]  |  🐟🐟 Kawanan Ikan [B]  |  🪷 Teratai & Katak & Ikan [C]  |  💧 Air & Kerikil [D]',
    illustration: {
      theme: 'pond',
      caption: 'Ilustrasi Ekosistem Perairan (Kolam Teratai Alami)',
      labels: [
        {
          badgeId: 'A',
          name: 'Seekor Katak Pohon',
          level: 'individu',
          icon: '🐸',
          description: '1 ekor katak sedang berdiam sendirian di atas satu daun teratai.',
        },
        {
          badgeId: 'B',
          name: 'Sekawanan Ikan Nila',
          level: 'populasi',
          icon: '🐟',
          description: 'Sekelompok 8 ekor ikan nila yang sejenis berenang bersama di dalam air.',
        },
        {
          badgeId: 'C',
          name: 'Kumpulan Makhluk Hidup Kolam',
          level: 'komunitas',
          icon: '🪷🐸🐟',
          description: 'Seluruh makhluk hidup (ikan nila + katak + tanaman teratai) yang hidup di kolam.',
        },
        {
          badgeId: 'D',
          name: 'Air & Bebatuan Dasar',
          level: 'abiotik',
          icon: '💧🪨',
          description: 'Air jernih dan batu kerikil di dasar kolam penyokong kehidupan.',
        },
      ],
    },
    question: 'Berdasarkan gambar ilustrasi ekosistem kolam di atas, bagian yang ditunjukkan oleh label [A] (seekor katak pohon yang sendirian) merupakan contoh dari...',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Individu (satu makhluk hidup tunggal)', isCorrect: true },
      { id: 'b', text: 'Populasi katak' },
      { id: 'c', text: 'Komunitas perairan' },
      { id: 'd', text: 'Komponen abiotik' },
    ],
    explanation: 'Label [A] hanya menampilkan satu ekor makhluk hidup tunggal (seekor katak), sehingga merupakan contoh nyata dari INDIVIDU.',
  },
  {
    id: 6,
    badge: '🖼️ Ilustrasi Ekosistem: Danau & Kolam Alami',
    scenario: 'Masih berdasarkan gambar ilustrasi ekosistem kolam yang sama, perhatikan bagian berlabel [B] yang memperlihatkan sekelompok ikan nila.',
    imageVisual: '🐟🐟🐟🐟 Kumpulan 8 Ekor Ikan Nila Sejenis',
    illustration: {
      theme: 'pond',
      caption: 'Ilustrasi Ekosistem Perairan (Kolam Teratai Alami)',
      labels: [
        {
          badgeId: 'A',
          name: 'Seekor Katak Pohon',
          level: 'individu',
          icon: '🐸',
          description: '1 ekor katak tunggal di daun teratai.',
        },
        {
          badgeId: 'B',
          name: 'Sekawanan Ikan Nila',
          level: 'populasi',
          icon: '🐟',
          description: 'Sekelompok 8 ekor ikan nila yang sejenis berenang bersama di dalam air.',
        },
        {
          badgeId: 'C',
          name: 'Kumpulan Makhluk Hidup Kolam',
          level: 'komunitas',
          icon: '🪷🐸🐟',
          description: 'Seluruh makhluk hidup (ikan nila + katak + tanaman teratai) yang hidup di kolam.',
        },
        {
          badgeId: 'D',
          name: 'Air & Bebatuan Dasar',
          level: 'abiotik',
          icon: '💧🪨',
          description: 'Air jernih dan batu kerikil di dasar kolam.',
        },
      ],
    },
    question: 'Berdasarkan ilustrasi kolam di atas, bagian berlabel [B] (sekawanan 8 ekor ikan nila yang sejenis) tergolong ke dalam tingkatan...',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Populasi, karena sekumpulan individu sejenis di tempat yang sama', isCorrect: true },
      { id: 'b', text: 'Individu, karena jumlah ikannya banyak' },
      { id: 'c', text: 'Komunitas, karena ikan bercampur dengan lumpur' },
      { id: 'd', text: 'Komponen abiotik perairan' },
    ],
    explanation: 'Label [B] menunjukkan sekumpulan individu dari jenis yang sama (ikan nila) di satu kolam, sehingga memenuhi syarat mutlak POPULASI.',
  },
  {
    id: 7,
    badge: '🖼️ Ilustrasi Ekosistem: Danau & Kolam Alami',
    scenario: 'Perhatikan bagian berlabel [C] pada gambar ilustrasi kolam, di mana terdapat populasi ikan nila, katak pohon, dan tanaman teratai yang saling hidup berdampingan.',
    imageVisual: '🪷 Tanaman Teratai + 🐸 Katak + 🐟 Ikan Nila',
    illustration: {
      theme: 'pond',
      caption: 'Ilustrasi Ekosistem Perairan (Kolam Teratai Alami)',
      labels: [
        {
          badgeId: 'A',
          name: 'Seekor Katak Pohon',
          level: 'individu',
          icon: '🐸',
          description: '1 ekor katak tunggal di daun.',
        },
        {
          badgeId: 'B',
          name: 'Sekawanan Ikan Nila',
          level: 'populasi',
          icon: '🐟',
          description: 'Sekelompok ikan nila sejenis.',
        },
        {
          badgeId: 'C',
          name: 'Berbagai Ragam Populasi',
          level: 'komunitas',
          icon: '🪷🐸🐟',
          description: 'Gabungan populasi ikan nila, populasi katak pohon, dan populasi tanaman teratai.',
        },
        {
          badgeId: 'D',
          name: 'Air & Lumpur Kolam',
          level: 'abiotik',
          icon: '💧',
          description: 'Lingkungan fisik perairan tak hidup.',
        },
      ],
    },
    question: 'Ketika berbagai macam populasi berbeda jenis (ikan nila + katak + teratai) pada label [C] hidup bersama di kolam tersebut, mereka membentuk...',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Komunitas kolam', isCorrect: true },
      { id: 'b', text: 'Satu individu raksasa' },
      { id: 'c', text: 'Satu populasi campuran' },
      { id: 'd', text: 'Komponen abiotik perairan' },
    ],
    explanation: 'Label [C] menggabungkan berbagai ragam populasi makhluk hidup yang berbeda jenis di satu kawasan, yang secara ilmiah disebut KOMUNITAS.',
  },
  {
    id: 8,
    badge: '🖼️ Ilustrasi Ekosistem: Padang Rumput Savana',
    scenario: 'Perhatikan gambar ilustrasi padang savana terbuka di bawah ini. Terdapat sebatang pohon akasia [A], kawanan 6 zebra [B], serta gabungan zebra, jerapah, dan rusa [C].',
    imageVisual: '🌳 Pohon [A]  |  🦓 Zebra [B]  |  🦓🦒🦌 Aneka Hewan [C]  |  ☀️ Tanah & Mentari [D]',
    illustration: {
      theme: 'grassland',
      caption: 'Ilustrasi Ekosistem Padang Rumput Sabana',
      labels: [
        {
          badgeId: 'A',
          name: 'Sebatang Pohon Akasia',
          level: 'individu',
          icon: '🌳',
          description: '1 batang pohon akasia tunggal menjulang di padang.',
        },
        {
          badgeId: 'B',
          name: 'Sekelompok 6 Ekor Zebra',
          level: 'populasi',
          icon: '🦓',
          description: 'Kawanan 6 ekor zebra sejenis sedang memakan rumput bersama.',
        },
        {
          badgeId: 'C',
          name: 'Kawanan Zebra, Jerapah, & Rusa',
          level: 'komunitas',
          icon: '🦓🦒🦌',
          description: 'Berbagai jenis populasi hewan pemakan rumput yang hidup berdampingan.',
        },
        {
          badgeId: 'D',
          name: 'Tanah Kering & Sinar Mentari',
          level: 'abiotik',
          icon: '☀️🪴',
          description: 'Tanah savana berdebu dan pancaran sinar matahari terik.',
        },
      ],
    },
    question: 'Perhatikan gambar ilustrasi padang rumput di atas! Mengapa kelompok pada label [C] (zebra + jerapah + rusa) disebut KOMUNITAS dan BUKAN populasi?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Karena terdiri dari beberapa populasi makhluk hidup yang berbeda jenis', isCorrect: true },
      { id: 'b', text: 'Karena semua hewannya memiliki warna kulit yang sama' },
      { id: 'c', text: 'Karena jumlah mereka hanya satu ekor saja' },
      { id: 'd', text: 'Karena mereka adalah benda tak hidup di padang rumput' },
    ],
    explanation: 'Kelompok [C] terdiri dari berbagai macam jenis/spesies yang berlainan (zebra, jerapah, rusa), sehingga merupakan KOMUNITAS. Populasi hanya boleh untuk satu jenis saja.',
  },
  {
    id: 9,
    badge: '🖼️ Ilustrasi Ekosistem: Hutan Rimba Tropis',
    scenario: 'Perhatikan gambar ilustrasi ekosistem hutan rimba tropis di bawah ini. Terdapat seekor burung enggang di pucuk pohon [A] dan sekelompok monyet ekor panjang [B].',
    imageVisual: '🦅 Burung Enggang [A]  |  🐒🐒 Kawanan Monyet [B]  |  🌳🍄 Hutan Komunitas [C]',
    illustration: {
      theme: 'forest',
      caption: 'Ilustrasi Ekosistem Hutan Rimba Tropis',
      labels: [
        {
          badgeId: 'A',
          name: 'Seekor Burung Enggang',
          level: 'individu',
          icon: '🦅',
          description: '1 ekor burung berparuh besar sendirian di dahan pohon.',
        },
        {
          badgeId: 'B',
          name: 'Kawanan 5 Ekor Monyet',
          level: 'populasi',
          icon: '🐒',
          description: 'Sekelompok monyet ekor panjang sejenis yang sedang berayun bersama.',
        },
        {
          badgeId: 'C',
          name: 'Monyet, Burung, Rusa & Pohon Jati',
          level: 'komunitas',
          icon: '🐒🦅🦌🌳',
          description: 'Seluruh makhluk hidup beraneka ragam jenis yang menghuni rimba.',
        },
        {
          badgeId: 'D',
          name: 'Udara Lembap, Tanah Humus & Sungai',
          level: 'abiotik',
          icon: '💧⛰️',
          description: 'Lingkungan fisik alam tak hidup penopang kehidupan hutan.',
        },
      ],
    },
    question: 'Berdasarkan ilustrasi hutan tropis di atas, jika kamu diminta memilih bagian yang menunjukkan INDIVIDU dan bagian yang menunjukkan POPULASI secara berturut-turut, manakah yang benar?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Label [A] adalah Individu, dan Label [B] adalah Populasi', isCorrect: true },
      { id: 'b', text: 'Label [B] adalah Individu, dan Label [C] adalah Populasi' },
      { id: 'c', text: 'Label [C] adalah Individu, dan Label [D] adalah Populasi' },
      { id: 'd', text: 'Label [D] adalah Individu, dan Label [A] adalah Populasi' },
    ],
    explanation: 'Label [A] adalah seekor burung tunggal (Individu), sedangkan Label [B] adalah sekumpulan monyet sejenis (Populasi).',
  },
  {
    id: 10,
    badge: '🖼️ Ilustrasi Ekosistem: Terumbu Karang Bawah Laut',
    scenario: 'Amatilah kartu ilustrasi ekosistem terumbu karang di bawah ini. Terdapat seekor kuda laut [A], sekawanan 15 ekor ikan badut sejenis [B], serta gabungan ikan badut, kuda laut, bintang laut, dan anemon [C].',
    imageVisual: '🐠 Kuda Laut [A]  |  🐟🐟 Kawanan Ikan Badut [B]  |  🐠🐟⭐ Komunitas Karang [C]  |  💧 Air Laut [D]',
    illustration: {
      theme: 'pond',
      caption: 'Ilustrasi Ekosistem Terumbu Karang Bawah Laut',
      labels: [
        {
          badgeId: 'A',
          name: 'Seekor Kuda Laut Emas',
          level: 'individu',
          icon: '🐠',
          description: '1 ekor kuda laut mandiri berpegangan pada tanaman laut.',
        },
        {
          badgeId: 'B',
          name: 'Sekawanan 15 Ikan Badut',
          level: 'populasi',
          icon: '🐟',
          description: 'Sekelompok 15 ekor ikan badut sejenis yang berenang bersama di sekitar anemon.',
        },
        {
          badgeId: 'C',
          name: 'Seluruh Ragam Hayati Terumbu Karang',
          level: 'komunitas',
          icon: '🐠🐟⭐🪸',
          description: 'Gabungan populasi ikan badut, kuda laut, anemon, dan bintang laut yang hidup berdampingan.',
        },
        {
          badgeId: 'D',
          name: 'Air Laut Asin & Pasir Putih',
          level: 'abiotik',
          icon: '💧🏖️',
          description: 'Faktor abiotik berupa cairan air laut bergaram dan pasir putih dasar laut.',
        },
      ],
    },
    question: 'Berdasarkan kartu ilustrasi terumbu karang di atas, kesatuan seluruh makhluk hidup beraneka ragam jenis pada label [C] (ikan badut + kuda laut + bintang laut + anemon) membentuk...',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Komunitas laut (kumpulan berbagai populasi yang berbeda jenis)', isCorrect: true },
      { id: 'b', text: 'Satu individu berukuran besar' },
      { id: 'c', text: 'Satu populasi sejenis' },
      { id: 'd', text: 'Komponen abiotik perairan' },
    ],
    explanation: 'Label [C] menggabungkan berbagai macam populasi berbeda jenis (ikan badut, kuda laut, anemon) yang hidup bersama di terumbu karang, yang disebut KOMUNITAS.',
  },
  {
    id: 11,
    badge: '🖼️ Ilustrasi Ekosistem: Sawah Pedesaan',
    scenario: 'Perhatikan kartu ilustrasi ekosistem sawah pedesaan di bawah ini. Amatilah seekor burung kuntul putih di pematang [A] dan sekumpulan katak sawah sejenis [B].',
    imageVisual: '🦩 Burung Kuntul [A]  |  🐸🐸 Kumpulan Katak Sawah [B]  |  🌾🐸🦩 Komunitas Sawah [C]  |  💧 Lumpur [D]',
    illustration: {
      theme: 'garden',
      caption: 'Ilustrasi Ekosistem Sawah Pedesaan',
      labels: [
        {
          badgeId: 'A',
          name: 'Seekor Burung Kuntul Putih',
          level: 'individu',
          icon: '🦩',
          description: '1 ekor burung kuntul tunggal yang sedang mengintai mangsa di pematang sawah.',
        },
        {
          badgeId: 'B',
          name: 'Sekelompok Katak Sawah',
          level: 'populasi',
          icon: '🐸',
          description: 'Sekumpulan katak sawah sejenis yang berbunyi bersahutan di parit sawah.',
        },
        {
          badgeId: 'C',
          name: 'Tanaman Padi, Belalang, Katak & Burung',
          level: 'komunitas',
          icon: '🌾🐸🦗🦩',
          description: 'Kumpulan seluruh populasi makhluk hidup yang tinggal bersama di sawah.',
        },
        {
          badgeId: 'D',
          name: 'Lumpur Basah & Aliran Irigasi',
          level: 'abiotik',
          icon: '💧🪴',
          description: 'Komponen abiotik berupa tanah lumpur basah dan air irigasi yang mengalir.',
        },
      ],
    },
    question: 'Perhatikan bagian berlabel [A] dan [B] pada gambar ekosistem sawah di atas. Istilah tingkatan organisasi makhluk hidup yang tepat untuk [A] dan [B] secara berurutan adalah...',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Label [A] adalah Individu, dan Label [B] adalah Populasi', isCorrect: true },
      { id: 'b', text: 'Label [A] adalah Populasi, dan Label [B] adalah Individu' },
      { id: 'c', text: 'Label [A] adalah Komunitas, dan Label [B] adalah Abiotik' },
      { id: 'd', text: 'Label [A] dan Label [B] keduanya adalah Komunitas' },
    ],
    explanation: 'Label [A] hanya satu ekor burung tunggal (Individu), sedangkan Label [B] adalah kumpulan katak sejenis (Populasi).',
  },
  {
    id: 12,
    badge: '🖼️ Ilustrasi Hierarki: Tangga Kehidupan Rimba',
    scenario: 'Perhatikan kartu ilustrasi tahapan organisasi kehidupan rimba di bawah ini. Amatilah perubahan dari tingkat [A] (satu ekor harimau), [B] (sekeluarga harimau), [C] (seluruh hewan dan tumbuhan rimba), hingga [D] (hutan utuh menyatu dengan alam abiotik).',
    imageVisual: '🐯 Harimau [A]  ➔  🐯🐯 Keluarga Harimau [B]  ➔  🐯🦌🌳 Komunitas [C]  ➔  🏞️ Ekosistem [D]',
    illustration: {
      theme: 'forest',
      caption: 'Ilustrasi Tangga Hierarki Organisasi Ekosistem Rimba',
      labels: [
        {
          badgeId: 'A',
          name: '1 Ekor Harimau Sumatera',
          level: 'individu',
          icon: '🐯',
          description: 'Satuan tunggal: seekor harimau mandiri (Individu).',
        },
        {
          badgeId: 'B',
          name: 'Sekeluarga 4 Ekor Harimau',
          level: 'populasi',
          icon: '🐯🐾',
          description: 'Kumpulan sejenis: sekawanan harimau yang hidup bersama (Populasi).',
        },
        {
          badgeId: 'C',
          name: 'Harimau, Rusa, Kera & Hutan Jati',
          level: 'komunitas',
          icon: '🐯🦌🐒🌳',
          description: 'Berbagai ragam populasi berbeda jenis yang hidup berdampingan (Komunitas).',
        },
        {
          badgeId: 'D',
          name: 'Seluruh Kehidupan Rimba + Sungai & Udara',
          level: 'abiotik',
          icon: '🏞️💧☀️',
          description: 'Kesatuan komunitas makhluk hidup dengan lingkungan fisik abiotik (Ekosistem).',
        },
      ],
    },
    question: 'Berdasarkan kartu ilustrasi berjenjang dari [A] menuju [D] di atas, urutan tingkatan hierarki organisasi kehidupan dari yang paling sederhana hingga terbentuk kesatuan ekosistem yang utuh adalah...',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Individu [A] → Populasi [B] → Komunitas [C] → Ekosistem [D]', isCorrect: true },
      { id: 'b', text: 'Ekosistem → Komunitas → Populasi → Individu' },
      { id: 'c', text: 'Populasi → Individu → Ekosistem → Komunitas' },
      { id: 'd', text: 'Komunitas → Ekosistem → Individu → Populasi' },
    ],
    explanation: 'Urutan hierarki organisasi kehidupan yang benar dari yang paling sederhana: Individu (1 makhluk hidup) ➔ Populasi (kumpulan sejenis) ➔ Komunitas (kumpulan berbagai populasi) ➔ Ekosistem (komunitas menyatu dengan lingkungan abiotik).',
  }
];

export const MISSIONS = MISSIONS_DATA;
export const BADGE_CRITERIA = BADGES;

