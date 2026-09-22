/**
 * ecosystemAssets.ts
 * Single source of truth for all ecosystem asset paths across the application.
 * Documents asset paths, file existence, and transparency status.
 */

export interface EcosystemAssetInfo {
  id: string;
  name: string;
  category: 'biotik' | 'abiotik' | 'lingkungan' | 'ui';
  primaryPath: string;
  backupPath?: string;
  status: 'available' | 'needs_transparency' | 'missing_from_disk';
  notes: string;
}

export const ECOSYSTEM_ASSETS: Record<string, EcosystemAssetInfo> = {
  // Lingkungan & Backgrounds
  backgroundUtama: {
    id: 'bg_utama',
    name: 'Jelajah Ekosistem Background',
    category: 'ui',
    primaryPath: '/jelajah-ekosistem-bg.jpg',
    status: 'available',
    notes: 'Background utama petualangan dan peta setapak'
  },
  misi1Bg: {
    id: 'misi1_bg',
    name: 'Taman Sekolah Misi 1',
    category: 'lingkungan',
    primaryPath: '/misi1-bg.jpg',
    status: 'available',
    notes: 'Background panorama taman untuk Misi 1'
  },
  misi5ForkBg: {
    id: 'misi5_fork_bg',
    name: 'Cabang Jalur Komunitas',
    category: 'lingkungan',
    primaryPath: '/misi5-fork-bg.jpg',
    status: 'available',
    notes: 'Background pemilihan ekosistem taman vs kolam'
  },
  tamanKomunitasBg: {
    id: 'taman_komunitas_bg',
    name: 'Taman Komunitas Background',
    category: 'lingkungan',
    primaryPath: '/misi5/taman-komunitas-bg.jpg',
    status: 'available',
    notes: 'Kanvas rancang komunitas taman'
  },
  kolamKomunitasBg: {
    id: 'kolam_komunitas_bg',
    name: 'Kolam Komunitas Background',
    category: 'lingkungan',
    primaryPath: '/misi5/kolam-komunitas-bg.jpg',
    status: 'available',
    notes: 'Kanvas rancang komunitas kolam'
  },

  // Maskot Karakter
  karakterPenjelajah: {
    id: 'karakter_penjelajah',
    name: 'Dara Penjelajah Cilik',
    category: 'ui',
    primaryPath: '/karakter-penjelajah.png',
    backupPath: '/karakter-penjelajah.jpg',
    status: 'available',
    notes: 'PNG transparan maskot siswa penjelajah'
  },

  // Komponen Biotik (Tumbuhan)
  pohonRindang: {
    id: 'pohon_rindang',
    name: 'Pohon Rindang',
    category: 'biotik',
    primaryPath: '/misi1/tree.png',
    status: 'available',
    notes: 'Foto realistis pohon rindang rimbun terisolasi dengan background transparan'
  },
  rumputHijau: {
    id: 'rumput_hijau',
    name: 'Rumput Hijau',
    category: 'biotik',
    primaryPath: '/misi1/grass.png',
    status: 'available',
    notes: 'Foto realistis rumpun rumput taman hijau alami dengan background transparan'
  },
  tanamanBunga: {
    id: 'tanaman_bunga',
    name: 'Tanaman Bunga',
    category: 'biotik',
    primaryPath: '/misi1/flower.png',
    status: 'available',
    notes: 'Foto realistis tanaman bunga mekar alami dengan background transparan'
  },
  bungaTeratai: {
    id: 'bunga_teratai',
    name: 'Bunga Teratai',
    category: 'biotik',
    primaryPath: '/bunga-teratai-populasi.jpg',
    backupPath: '/misi6/bunga-teratai.png',
    status: 'available',
    notes: 'Foto rumpun teratai mekar di kolam dan versi transparan'
  },
  tumbuhanHijau: {
    id: 'tumbuhan_hijau',
    name: 'Tumbuhan Hijau',
    category: 'biotik',
    primaryPath: '/misi8/tumbuhan-hijau.jpg',
    status: 'available',
    notes: 'Foto produsen tumbuhan hijau di piramida makanan'
  },

  // Komponen Biotik (Hewan)
  kupuKupu: {
    id: 'kupu_kupu',
    name: 'Kupu-kupu Cantik',
    category: 'biotik',
    primaryPath: '/misi1/butterfly.png',
    status: 'available',
    notes: 'Foto realistis makro kupu-kupu sayap terbuka dengan background transparan'
  },
  burungBerkicau: {
    id: 'burung_berkicau',
    name: 'Burung Berkicau',
    category: 'biotik',
    primaryPath: '/misi1/bird.png',
    status: 'available',
    notes: 'Foto realistis burung berkicau bertengger dengan background transparan'
  },
  ikanKolam: {
    id: 'ikan_kolam',
    name: 'Ikan Kolam / Ikan Mas',
    category: 'biotik',
    primaryPath: '/misi1/fish.png',
    backupPath: '/misi6/ikan-mas.png',
    status: 'available',
    notes: 'Foto realistis ikan mas berenang dengan background transparan'
  },
  ulatDaun: {
    id: 'ulat_daun',
    name: 'Ulat Daun',
    category: 'biotik',
    primaryPath: '/misi7/ulat-daun.jpg',
    status: 'available',
    notes: 'Foto realistis makro ulat daun hijau'
  },
  katakHijau: {
    id: 'katak_hijau',
    name: 'Katak Hijau',
    category: 'biotik',
    primaryPath: '/misi6/katak-hijau.png',
    status: 'available',
    notes: 'Foto realistis katak hijau alami'
  },
  belalang: {
    id: 'belalang',
    name: 'Belalang',
    category: 'biotik',
    primaryPath: '/misi8/belalang.jpg',
    status: 'available',
    notes: 'Foto realistis belalang hinggap di dedaunan'
  },
  elang: {
    id: 'elang',
    name: 'Burung Elang',
    category: 'biotik',
    primaryPath: '/misi8/elang.jpg',
    status: 'available',
    notes: 'Foto realistis burung pemangsa elang'
  },

  // Komponen Abiotik
  batuTaman: {
    id: 'batu_taman',
    name: 'Batu Taman',
    category: 'abiotik',
    primaryPath: '/batu-taman.png',
    backupPath: '/misi5/batu-kali.png',
    status: 'available',
    notes: 'Foto realistis batu taman alami dengan saluran alpha transparan'
  },
  tanahSubur: {
    id: 'tanah_subur',
    name: 'Tanah Subur',
    category: 'abiotik',
    primaryPath: '/tanah-subur.png',
    backupPath: '/misi6/tanah-subur.png',
    status: 'available',
    notes: 'Foto realistis gundukan tanah gembur subur dengan saluran alpha transparan'
  },
  cahayaMatahari: {
    id: 'cahaya_matahari',
    name: 'Cahaya Matahari',
    category: 'abiotik',
    primaryPath: '/misi1/sun.png',
    status: 'available',
    notes: 'Representasi fotografi optik pendaran surya emas dengan falloff alami'
  },
  airJernihKolam: {
    id: 'air_jernih_kolam',
    name: 'Air Jernih Kolam',
    category: 'abiotik',
    primaryPath: '/misi1/water.png',
    status: 'available',
    notes: 'Foto realistis riak cipratan air jernih dengan transparansi natural'
  },
  udaraOksigen: {
    id: 'udara_oksigen',
    name: 'Udara Oksigen',
    category: 'abiotik',
    primaryPath: '/misi6/udara-oksigen.png',
    status: 'available',
    notes: 'Grafis visual edukasi molekul oksigen'
  },

  // 8 Ekosistem Misi 2 (Lingkungan)
  hutanHujan: {
    id: 'hutan_hujan',
    name: 'Hutan Hujan',
    category: 'lingkungan',
    primaryPath: '/lingkungan/hutan-hujan.jpg',
    status: 'available',
    notes: 'Foto fotografi nyata lanskap kanopi hutan hujan tropis berkabut'
  },
  sungaiBerbatu: {
    id: 'sungai_berbatu',
    name: 'Sungai Berbatu',
    category: 'lingkungan',
    primaryPath: '/lingkungan/sungai-berbatu.jpg',
    status: 'available',
    notes: 'Foto fotografi nyata aliran sungai jernih berbatu'
  },
  kebunBunga: {
    id: 'kebun_bunga',
    name: 'Kebun Bunga',
    category: 'lingkungan',
    primaryPath: '/lingkungan/kebun-bunga.jpg',
    status: 'available',
    notes: 'Foto fotografi nyata kebun aneka bunga mekar semarak'
  },
  kolamIkan: {
    id: 'kolam_ikan',
    name: 'Kolam Ikan',
    category: 'lingkungan',
    primaryPath: '/lingkungan/kolam-ikan.jpg',
    status: 'available',
    notes: 'Foto fotografi nyata kolam air tawar asri dengan daun teratai'
  },
  padangRumput: {
    id: 'padang_rumput',
    name: 'Padang Rumput',
    category: 'lingkungan',
    primaryPath: '/lingkungan/padang-rumput.jpg',
    status: 'available',
    notes: 'Foto fotografi nyata hamparan luas padang rumput hijau'
  },
  danauAlami: {
    id: 'danau_alami',
    name: 'Danau Alami',
    category: 'lingkungan',
    primaryPath: '/lingkungan/danau-alami.jpg',
    status: 'available',
    notes: 'Foto fotografi nyata lanskap danau alami berair tenang'
  },
  tamanKota: {
    id: 'taman_kota',
    name: 'Taman Kota',
    category: 'lingkungan',
    primaryPath: '/lingkungan/taman-kota.jpg',
    status: 'available',
    notes: 'Foto fotografi nyata ruang terbuka hijau taman kota yang asri'
  },
  lautTropis: {
    id: 'laut_tropis',
    name: 'Laut Tropis',
    category: 'lingkungan',
    primaryPath: '/lingkungan/laut-tropis.jpg',
    status: 'available',
    notes: 'Foto fotografi nyata laut tropis air toska dengan ekosistem pesisir dan terumbu'
  }
};
