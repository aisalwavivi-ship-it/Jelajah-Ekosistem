// Educational Concepts & Narration Texts for Jelajah Ekosistem (IPAS Kelas V SD)

export interface LearningMaterial {
  id: string;
  title: string;
  subtitle?: string;
  category: 'ekosistem' | 'jenis' | 'tingkatan' | 'komponen' | 'contoh';
  icon: string;
  content: string;
  audioText: string;
  example?: string;
}

export const LEARNING_MATERIALS: Record<string, LearningMaterial> = {
  // 1. Ekosistem
  ekosistem: {
    id: 'ekosistem',
    title: 'Ekosistem',
    subtitle: 'Kesatuan Alam Menyeluruh',
    category: 'ekosistem',
    icon: '🌎',
    content: 'Ekosistem adalah kesatuan antara makhluk hidup dan lingkungan tak hidup yang terdapat dalam suatu tempat.',
    audioText: 'Ekosistem adalah kesatuan antara makhluk hidup dan lingkungan tak hidup yang terdapat dalam suatu tempat. Makhluk hidup berinteraksi satu sama lain dan juga bergantung pada lingkungan tak hidup di sekitarnya.',
    example: 'Contohnya ekosistem kolam, di mana ikan dan tumbuhan air hidup bersama air, tanah lumpur, dan cahaya matahari.',
  },

  // 2. Jenis Ekosistem
  jenis_ekosistem: {
    id: 'jenis_ekosistem',
    title: 'Jenis Ekosistem',
    subtitle: 'Dua Wilayah Utama Kehidupan',
    category: 'jenis',
    icon: '🏞️',
    content: 'Ekosistem terbagi menjadi dua jenis utama, yaitu ekosistem darat dan ekosistem air.',
    audioText: 'Jenis ekosistem terbagi menjadi dua, yaitu ekosistem darat dan ekosistem air. Ekosistem darat berada di permukaan daratan, sedangkan ekosistem air lingkungan utamanya berupa perairan. Masing-masing memiliki ciri dan penghuni yang khas.',
    example: 'Darat: Hutan & Kebun. Air: Sungai & Danau.',
  },

  // 3. Ekosistem Darat
  ekosistem_darat: {
    id: 'ekosistem_darat',
    title: 'Ekosistem Darat',
    subtitle: 'Kehidupan di Permukaan Daratan',
    category: 'jenis',
    icon: '🌳',
    content: 'Ekosistem darat adalah ekosistem yang lingkungan fisiknya berupa daratan.',
    audioText: 'Ekosistem darat adalah ekosistem yang lingkungan fisiknya berupa daratan. Contohnya seperti hutan, kebun, taman, dan padang rumput.',
    example: 'Hutan hujan tropis, kebun bunga, taman sekolah, dan padang rumput savana.',
  },

  // 4. Ekosistem Air
  ekosistem_air: {
    id: 'ekosistem_air',
    title: 'Ekosistem Air',
    subtitle: 'Kehidupan di Lingkungan Perairan',
    category: 'jenis',
    icon: '💧',
    content: 'Ekosistem air adalah ekosistem yang lingkungan hidup utamanya berupa perairan.',
    audioText: 'Ekosistem air adalah ekosistem yang lingkungan hidup utamanya berupa perairan. Contohnya seperti sungai, kolam, danau, dan laut.',
    example: 'Sungai mengalir, kolam ikan, danau air tawar, dan laut terumbu karang.',
  },

  // 5. Individu
  individu: {
    id: 'individu',
    title: 'Individu',
    subtitle: 'Satu Makhluk Hidup Tunggal',
    category: 'tingkatan',
    icon: '👤',
    content: 'Individu adalah satu makhluk hidup tunggal.',
    audioText: 'Individu adalah satu makhluk hidup. Contohnya satu ikan, satu burung, atau satu pohon.',
    example: 'Satu ekor ikan mas di kolam, satu burung kutilang di dahan pohon, atau satu batang pohon beringin.',
  },

  // Visual Khusus Individu (1 Ikan)
  individu_ikan: {
    id: 'individu_ikan',
    title: 'Individu (Satu Ikan)',
    subtitle: 'Satuan Tunggal Ikan',
    category: 'tingkatan',
    icon: '🐟',
    content: 'Satu ekor ikan yang berenang sendirian.',
    audioText: 'Ini adalah satu ikan. Satu makhluk hidup disebut individu.',
    example: '1 ekor ikan.',
  },

  // 6. Populasi
  populasi: {
    id: 'populasi',
    title: 'Populasi',
    subtitle: 'Kumpulan Individu Sejenis',
    category: 'tingkatan',
    icon: '👥',
    content: 'Populasi adalah kumpulan individu sejenis yang hidup di suatu tempat.',
    audioText: 'Populasi adalah kumpulan individu sejenis yang hidup di suatu tempat. Contohnya sekumpulan ikan sejenis dalam satu kolam.',
    example: 'Sekelompok 10 ekor ikan mas di kolam, kawanan lebah madu, atau rumpun pohon pinus di bukit.',
  },

  // Visual Khusus Populasi (Kumpulan Ikan)
  populasi_ikan: {
    id: 'populasi_ikan',
    title: 'Populasi (Kumpulan Ikan)',
    subtitle: 'Kumpulan Ikan Sejenis',
    category: 'tingkatan',
    icon: '🐟🐟🐟',
    content: 'Kumpulan beberapa ekor ikan mas sejenis dalam satu kolam.',
    audioText: 'Ada beberapa ikan sejenis yang hidup di tempat yang sama. Kumpulan individu sejenis seperti ini disebut populasi.',
    example: 'Sekumpulan ikan nila di kolam.',
  },

  // 7. Komunitas
  komunitas: {
    id: 'komunitas',
    title: 'Komunitas',
    subtitle: 'Kumpulan Berbagai Populasi',
    category: 'tingkatan',
    icon: '👨‍👩‍👧‍👦',
    content: 'Komunitas adalah kumpulan berbagai populasi yang hidup bersama di suatu tempat.',
    audioText: 'Komunitas adalah kumpulan berbagai populasi yang hidup bersama di suatu tempat. Contohnya populasi ikan, katak, dan tumbuhan yang hidup di kolam.',
    example: 'Gabungan populasi ikan mas, populasi teratai, dan populasi katak hijau di kolam taman.',
  },

  // Visual Khusus Komunitas (Kolam Terpadu)
  komunitas_kolam: {
    id: 'komunitas_kolam',
    title: 'Komunitas (Ekosistem Kolam)',
    subtitle: 'Perpaduan Berbagai Populasi',
    category: 'tingkatan',
    icon: '🪷🐟🐸',
    content: 'Berbagai populasi makhluk hidup yang hidup rukun bersama.',
    audioText: 'Di kolam ini terdapat populasi ikan, populasi katak, dan populasi tumbuhan. Kumpulan berbagai populasi yang hidup bersama di suatu tempat disebut komunitas.',
    example: 'Populasi ikan, katak, dan tanaman teratai.',
  },

  // 8. Komponen Biotik
  biotik: {
    id: 'biotik',
    title: 'Komponen Biotik',
    subtitle: 'Semua Makhluk Hidup',
    category: 'komponen',
    icon: '🌱',
    content: 'Komponen biotik adalah semua makhluk hidup yang ada di dalam ekosistem.',
    audioText: 'Komponen biotik adalah semua makhluk hidup yang terdapat di dalam ekosistem. Contohnya manusia, hewan, dan tumbuhan.',
    example: 'Tumbuhan penghasil makanan, hewan pemakan, cacing penggembur tanah, dan manusia.',
  },

  // 9. Komponen Abiotik
  abiotik: {
    id: 'abiotik',
    title: 'Komponen Abiotik',
    subtitle: 'Benda & Faktor Tak Hidup',
    category: 'komponen',
    icon: '☀️',
    content: 'Komponen abiotik adalah semua benda atau faktor tak hidup dalam ekosistem yang menunjang kehidupan.',
    audioText: 'Komponen abiotik adalah benda atau faktor tak hidup yang terdapat dalam ekosistem. Contohnya air, tanah, batu, udara, dan cahaya matahari.',
    example: 'Sinar matahari untuk fotosintesis, air untuk minum, udara untuk bernapas, dan tanah tempat tumbuh.',
  },
};

// Interactive item narration texts for cards and objects clicked by students
export const OBJECT_NARRATIONS: Record<string, { title: string; category: 'biotik' | 'abiotik'; audioText: string }> = {
  // Fauna / Hewan (Biotik)
  fish: {
    title: 'Ikan',
    category: 'biotik',
    audioText: 'Ikan adalah makhluk hidup sehingga termasuk komponen biotik. Ikan bernapas dengan insang dan berenang di perairan.',
  },
  bird: {
    title: 'Burung',
    category: 'biotik',
    audioText: 'Burung adalah makhluk hidup sehingga termasuk komponen biotik. Burung bernapas, terbang, dan bertengger di dahan pohon.',
  },
  butterfly: {
    title: 'Kupu-kupu',
    category: 'biotik',
    audioText: 'Kupu-kupu adalah serangga yang hidup sehingga termasuk komponen biotik. Kupu-kupu membantu penyerbukan tanaman bunga.',
  },
  frog: {
    title: 'Katak',
    category: 'biotik',
    audioText: 'Katak adalah hewan amfibi hidup sehingga termasuk komponen biotik. Katak dapat hidup di darat dan di air tawar.',
  },
  rabbit: {
    title: 'Kelinci',
    category: 'biotik',
    audioText: 'Kelinci adalah hewan mamalia hidup sehingga termasuk komponen biotik. Kelinci membutuhkan makanan dan bernapas.',
  },
  bee: {
    title: 'Lebah',
    category: 'biotik',
    audioText: 'Lebah adalah serangga hidup sehingga termasuk komponen biotik. Lebah mengumpulkan nektar dan hidup dalam koloni.',
  },
  caterpillar: {
    title: 'Ulat Daun',
    category: 'biotik',
    audioText: 'Ulat daun adalah hewan kecil hidup pemakan daun, sehingga termasuk komponen biotik.',
  },
  student: {
    title: 'Manusia / Siswa',
    category: 'biotik',
    audioText: 'Manusia adalah makhluk hidup yang berpikir dan beraktivitas, sehingga termasuk komponen biotik.',
  },

  // Flora / Tumbuhan (Biotik)
  tree: {
    title: 'Pohon',
    category: 'biotik',
    audioText: 'Pohon adalah tumbuhan hidup yang bernapas dan berfotosintesis, sehingga termasuk komponen biotik.',
  },
  flower: {
    title: 'Bunga',
    category: 'biotik',
    audioText: 'Bunga adalah bagian dari tumbuhan hidup yang berkembang biak, sehingga termasuk komponen biotik.',
  },
  grass: {
    title: 'Rumput',
    category: 'biotik',
    audioText: 'Rumput adalah tumbuhan hidup yang menyerap air dan mineral dari tanah, sehingga termasuk komponen biotik.',
  },
  lotus: {
    title: 'Teratai',
    category: 'biotik',
    audioText: 'Teratai adalah tumbuhan air yang hidup mengapung di kolam, sehingga termasuk komponen biotik.',
  },

  // Benda / Faktor Tak Hidup (Abiotik)
  stone: {
    title: 'Batu',
    category: 'abiotik',
    audioText: 'Batu bukan makhluk hidup sehingga termasuk komponen abiotik. Batu menjadi tempat berpijak dan berteduh makhluk hidup.',
  },
  water: {
    title: 'Air',
    category: 'abiotik',
    audioText: 'Air adalah benda tak hidup sehingga termasuk komponen abiotik. Air sangat dibutuhkan makhluk hidup untuk minum dan habitat.',
  },
  soil: {
    title: 'Tanah',
    category: 'abiotik',
    audioText: 'Tanah adalah benda tak hidup sehingga termasuk komponen abiotik. Tanah menjadi media tumbuh akar tanaman dan menyimpan nutrisi.',
  },
  sun: {
    title: 'Cahaya Matahari',
    category: 'abiotik',
    audioText: 'Cahaya matahari adalah faktor alam tak hidup sehingga termasuk komponen abiotik. Matahari memancarkan energi untuk fotosintesis tumbuhan.',
  },
  wind: {
    title: 'Udara & Angin',
    category: 'abiotik',
    audioText: 'Udara dan angin adalah faktor tak hidup sehingga termasuk komponen abiotik. Udara menyediakan oksigen untuk pernapasan.',
  },
  mud: {
    title: 'Lumpur Dasar Kolam',
    category: 'abiotik',
    audioText: 'Lumpur adalah tanah perairan tak hidup sehingga termasuk komponen abiotik tempat teratai menancapkan akarnya.',
  },
};
