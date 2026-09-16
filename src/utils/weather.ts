import { AppScene } from '../types';

export type WeatherType = 'sunny' | 'clouds' | 'rain' | 'sunset' | 'night';
export type WeatherAutoMode = 'realtime' | 'mission';
export type WeatherMode = 'auto-time' | 'auto-mission' | WeatherType;

export interface WeatherCondition {
  type: WeatherType;
  label: string;
  sublabel: string;
  icon: string;
  temperature: string;
  humidity: string;
  windSpeed: string;
  abioticDescription: string;
  learningFact: string;
}

export const WEATHER_CONDITIONS: Record<WeatherType, WeatherCondition> = {
  sunny: {
    type: 'sunny',
    label: 'Sinar Mentari Terik',
    sublabel: 'Cahaya Melimpah untuk Tumbuhan',
    icon: '☀️',
    temperature: '31°C',
    humidity: '62%',
    windSpeed: '8 km/jam',
    abioticDescription:
      'Intensitas cahaya matahari tinggi, menghangatkan suhu tanah dan memicu fotosintesis klorofil pada daun.',
    learningFact:
      '💡 Faktor Abiotik: Cahaya matahari adalah sumber energi primer terbesar yang menopang seluruh kehidupan makhluk hidup di bumi.',
  },
  clouds: {
    type: 'clouds',
    label: 'Awan Mendung Teduh',
    sublabel: 'Cahaya Baur & Suasana Sejuk',
    icon: '⛅',
    temperature: '26°C',
    humidity: '76%',
    windSpeed: '12 km/jam',
    abioticDescription:
      'Gumpalan awan menyaring radiasi sinar terik, mengurangi penguapan air (transpirasi) dari tanaman.',
    learningFact:
      '💡 Faktor Abiotik: Awan terbentuk dari kondensasi uap air. Keteduhan awan membantu hewan mempertahankan suhu tubuh stabil.',
  },
  rain: {
    type: 'rain',
    label: 'Hujan Gerimis Sejuk',
    sublabel: 'Air Menyuburkan Pori Tanah & Kolam',
    icon: '🌧️',
    temperature: '23°C',
    humidity: '92%',
    windSpeed: '15 km/jam',
    abioticDescription:
      'Tetesan air hujan menyegarkan tumbuhan, melarutkan mineral hara tanah, dan memicu aktivitas cacing tanah.',
    learningFact:
      '💡 Faktor Abiotik: Air adalah pelarut esensial bagi metabolisme seluruh sel makhluk hidup dan habitat ekosistem perairan.',
  },
  sunset: {
    type: 'sunset',
    label: 'Senja Keemasan',
    sublabel: 'Peralihan Cahaya & Suhu Sore',
    icon: '🌅',
    temperature: '27°C',
    humidity: '70%',
    windSpeed: '9 km/jam',
    abioticDescription:
      'Sudut datang sinar matahari merendah, menghasilkan bias lembayung dan mengawali pergantian siklus aktif fauna.',
    learningFact:
      '💡 Keseimbangan Ekosistem: Menjelang malam, hewan diurnal mulai beristirahat sedangkan hewan nokturnal mulai aktif berburu.',
  },
  night: {
    type: 'night',
    label: 'Malam Berbintang',
    sublabel: 'Embun Dingin & Suasana Rimba Tenang',
    icon: '🌙',
    temperature: '21°C',
    humidity: '86%',
    windSpeed: '6 km/jam',
    abioticDescription:
      'Ketiadaan cahaya matahari menurunkan suhu lingkungan secara alami; kelembapan tinggi memicu terbentuknya tetes embun.',
    learningFact:
      '💡 Adaptasi Makhluk Hidup: Tumbuhan menutup stomata di malam hari untuk mencegah kehilangan air berlebihan.',
  },
};

/**
 * Resolves weather based on local device time
 */
export function getWeatherFromLocalTime(date: Date = new Date()): WeatherType {
  const hour = date.getHours();

  if (hour >= 5 && hour < 10) {
    return 'sunny'; // Pagi cerah segar
  } else if (hour >= 10 && hour < 14) {
    return 'sunny'; // Siang terik bersinar
  } else if (hour >= 14 && hour < 17) {
    return 'clouds'; // Sore teduh berawan
  } else if (hour >= 17 && hour < 19) {
    return 'sunset'; // Senja keemasan
  } else {
    return 'night'; // Malam berbintang
  }
}

/**
 * Resolves weather based on mission progression along the trail
 */
export function getWeatherFromMissionContext(
  currentScene: AppScene,
  completedCount: number
): WeatherType {
  // If in specific missions, mirror the thematic environment
  if (currentScene === 'mission-1' || currentScene === 'mission-2') {
    return 'sunny'; // Pos Awal: Taman Terang
  }
  if (currentScene === 'mission-3') {
    return 'clouds'; // Kebun Rindang yang teduh
  }
  if (currentScene === 'mission-4') {
    return 'sunny'; // Area Terbuka & Faktor Abiotik Cahaya
  }
  if (currentScene === 'mission-5' || currentScene === 'mission-6') {
    return 'rain'; // Kolam & Aliran Air Sejuk
  }
  if (currentScene === 'mission-7') {
    return 'clouds'; // Pojok Terpadu
  }
  if (currentScene === 'mission-8' || currentScene === 'quiz') {
    return 'sunset'; // Puncak Pandang & Evaluasi Senja
  }
  if (currentScene === 'finish') {
    return 'sunset';
  }

  // Fallback on map or start: based on completed missions count
  if (completedCount <= 2) return 'sunny';
  if (completedCount <= 4) return 'clouds';
  if (completedCount <= 6) return 'rain';
  if (completedCount <= 7) return 'sunset';
  return 'sunny';
}

/**
 * Primary selector that computes active weather based on mode
 */
export function resolveActiveWeather(
  mode: WeatherMode,
  currentScene: AppScene,
  completedCount: number,
  localDate: Date = new Date()
): WeatherType {
  if (mode === 'auto-time') {
    return getWeatherFromLocalTime(localDate);
  }
  if (mode === 'auto-mission') {
    return getWeatherFromMissionContext(currentScene, completedCount);
  }
  // Manual override (sunny | clouds | rain | sunset | night)
  return mode;
}
