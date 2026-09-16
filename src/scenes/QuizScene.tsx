import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, RotateCcw, Award, Star, Map, Trophy, FileBadge } from 'lucide-react';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { QUIZ_QUESTIONS, BADGE_CRITERIA } from '../data/missions';
import { sound } from '../utils/audio';
import { triggerQuizFinishConfetti, triggerCertificateConfetti } from '../utils/confetti';
import { getExplorerLevel } from '../utils/levels';

interface QuizSceneProps {
  onFinishQuiz: (finalScore: number) => void;
  onOpenCertificate: () => void;
  onGoToMap: () => void;
  onRestartAll: () => void;
  totalGameStars: number;
}

export const QuizScene: React.FC<QuizSceneProps> = ({
  onFinishQuiz,
  onOpenCertificate,
  onGoToMap,
  onRestartAll,
  totalGameStars,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  useEffect(() => {
    sound.startSoundscape('grassland');
    return () => {
      sound.stopSoundscape();
    };
  }, []);

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;

    setSelectedOptionId(optionId);
    setIsAnswerSubmitted(true);

    const isCorrect = currentQ.options.find((o) => o.id === optionId)?.isCorrect;
    if (isCorrect) {
      sound.playCorrect();
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      sound.playWrong();
    }
  };

  const handleNextQuestion = () => {
    sound.playFootstep();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished
      const finalPercentage = Math.round((correctAnswersCount / totalQuestions) * 100);
      setIsQuizCompleted(true);
      sound.playFanfare();
      triggerQuizFinishConfetti();
      onFinishQuiz(finalPercentage);
    }
  };

  const finalScore = Math.round((correctAnswersCount / totalQuestions) * 100);
  const earnedBadge = BADGE_CRITERIA.find((b) => finalScore >= b.minScore) || BADGE_CRITERIA[BADGE_CRITERIA.length - 1];

  const handleRetakeQuiz = () => {
    sound.playClick();
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setCorrectAnswersCount(0);
    setIsQuizCompleted(false);
  };

  return (
    <div className="min-h-[calc(100vh-115px)] w-full p-3 sm:p-6 flex flex-col justify-between relative z-10">
      <div className="max-w-4xl mx-auto w-full space-y-5">
        {/* If Quiz is in progress: */}
        {!isQuizCompleted ? (
          <div className="space-y-4">
            {/* Header & Progress */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-amber-300/80 shadow-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shrink-0">
                  🏆
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                      Evaluasi Pembelajaran
                    </span>
                    <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900">
                      Kuis Bintang Ekosistem
                    </h2>
                  </div>
                  <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                    Soal {currentIndex + 1} dari {totalQuestions}: Pilih salah satu jawaban yang paling tepat!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-28 sm:w-36 h-3 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-stone-700">
                  {currentIndex + 1}/{totalQuestions}
                </span>
              </div>
            </div>

            {/* Question Card */}
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/95 rounded-3xl p-5 sm:p-7 border-2 border-amber-200 shadow-lg space-y-4"
            >
              {/* Scenario Badge & Category */}
              {currentQ.badge && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full inline-block">
                    {currentQ.badge}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-500">
                    Soal Berbasis Kasus
                  </span>
                </div>
              )}

              {/* Scenario Narrative Box */}
              {currentQ.scenario && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-stone-800 leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
                    <span>📖 Cerita Skenario:</span>
                  </div>
                  <p>{currentQ.scenario}</p>

                  {/* Ecosystem Illustration Scene if available */}
                  {currentQ.illustration && (
                    <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-sky-50 via-emerald-50/50 to-teal-50 border-2 border-emerald-300 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🖼️</span>
                          <h4 className="font-display font-bold text-xs sm:text-sm text-emerald-950">
                            {currentQ.illustration.caption}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-full">
                          Amati Label [A], [B], [C], [D]
                        </span>
                      </div>

                      {/* Labeled visual grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentQ.illustration.labels.map((lbl) => {
                          const badgeColor =
                            lbl.badgeId === 'A'
                              ? 'bg-amber-500 text-white'
                              : lbl.badgeId === 'B'
                              ? 'bg-blue-600 text-white'
                              : lbl.badgeId === 'C'
                              ? 'bg-purple-600 text-white'
                              : 'bg-stone-700 text-white';

                          const cardBg =
                            lbl.badgeId === 'A'
                              ? 'bg-amber-50/90 border-amber-300'
                              : lbl.badgeId === 'B'
                              ? 'bg-blue-50/90 border-blue-300'
                              : lbl.badgeId === 'C'
                              ? 'bg-purple-50/90 border-purple-300'
                              : 'bg-stone-50 border-stone-300';

                          return (
                            <div
                              key={lbl.badgeId}
                              className={`p-2.5 sm:p-3 rounded-xl border-2 flex items-start gap-2.5 shadow-2xs transition hover:shadow-sm ${cardBg}`}
                            >
                              <span
                                className={`w-6 h-6 rounded-lg font-display font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${badgeColor}`}
                              >
                                {lbl.badgeId}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 font-display font-bold text-xs text-stone-900">
                                  <span className="text-base">{lbl.icon}</span>
                                  <span>{lbl.name}</span>
                                </div>
                                <p className="text-[11px] text-stone-600 leading-snug mt-0.5">
                                  {lbl.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Fallback Image/Visual Identification Box */}
                  {!currentQ.illustration && currentQ.imageVisual && (
                    <div className="mt-2 p-2.5 bg-white/90 rounded-xl border border-amber-200 text-center font-display font-bold text-xs sm:text-sm text-stone-900 shadow-xs">
                      <span className="text-stone-400 text-[10px] uppercase block mb-0.5">
                        Visualisasi Kasus / Objek:
                      </span>
                      <span>{currentQ.imageVisual}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Main Question Text */}
              <div className="flex items-start gap-3 pt-1">
                <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-display font-black flex items-center justify-center text-sm shrink-0 mt-0.5 shadow-xs">
                  {currentIndex + 1}
                </span>
                <h3 className="font-display font-extrabold text-base sm:text-lg text-stone-900 leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options list */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrect = opt.isCorrect;

                  let cardStyle =
                    'bg-stone-50 hover:bg-emerald-50/70 border-stone-200 hover:border-emerald-300 text-stone-800';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      cardStyle =
                        'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-300';
                    } else if (isSelected) {
                      cardStyle =
                        'bg-red-50 border-red-400 text-red-950 font-bold ring-2 ring-red-200';
                    } else {
                      cardStyle = 'bg-stone-50/60 border-stone-200 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      id={`quiz-opt-${opt.id}`}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left font-medium text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white/80 border border-stone-300 flex items-center justify-center font-bold text-xs uppercase text-stone-700">
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {isAnswerSubmitted && isCorrect && (
                        <span className="text-emerald-700 font-bold text-sm">
                          ✓ Benar!
                        </span>
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <span className="text-red-600 font-bold text-sm">
                          ✕ Kurang tepat
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Banner */}
              <AnimatePresence>
                {isAnswerSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border-2 space-y-1.5 ${
                      currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {currentQ.options.find((o) => o.id === selectedOptionId)?.isCorrect
                          ? '🌟 Tepat Sekali!'
                          : '🤔 Kurang tepat, coba ingat kembali...'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {currentQ.explanation}
                    </p>

                    <div className="pt-2 flex justify-end">
                      <button
                        id="btn-quiz-next"
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-display font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md"
                      >
                        <span>
                          {currentIndex < totalQuestions - 1
                            ? 'Soal Berikutnya'
                            : 'Lihat Hasil Akhir'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : (
          /* Final Results & Celebration Screen: */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/95 rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl text-center space-y-6"
          >
            {/* Crown & Character Celebration */}
            <div className="relative flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-4xl shadow-md mb-2 animate-bounce-gentle">
                {earnedBadge.icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Pencapaian Petualangan
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mt-0.5">
                {earnedBadge.title}
              </h2>

              {/* Explorer Level Badge based on total stars */}
              {(() => {
                const explorerLevel = getExplorerLevel(totalGameStars);
                return (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs mt-2">
                    <span className="text-base">{explorerLevel.icon}</span>
                    <span>
                      Tingkat Penjelajah:{' '}
                      <strong className="text-emerald-800">
                        Level {explorerLevel.level} ({explorerLevel.title})
                      </strong>
                    </span>
                  </div>
                );
              })()}

              <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto mt-2">
                “Hebat! Kamu sekarang adalah <strong>Penjelajah Ekosistem Sejati!</strong>”
              </p>
            </div>

            {/* Score & Stars Display Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="text-xs font-bold text-amber-800 block">
                  Nilai Kuis
                </span>
                <span className="font-display font-black text-3xl text-amber-950">
                  {finalScore}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  {correctAnswersCount} dari {totalQuestions} benar
                </span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 block">
                  Total Bintang
                </span>
                <div className="flex items-center justify-center gap-1 my-1">
                  <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                  <span className="font-display font-black text-3xl text-emerald-950">
                    {totalGameStars}
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 block">
                  Bintang petualangan
                </span>
              </div>

              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
                <span className="text-xs font-bold text-sky-800 block">
                  Status Misi
                </span>
                <span className="font-display font-black text-2xl text-sky-950 flex items-center justify-center gap-1 mt-1">
                  8 / 8 Selesai
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  Jalan setapak tuntas!
                </span>
              </div>
            </div>

            {/* Badge detail */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 max-w-xl mx-auto text-left">
              <p className="font-bold text-xs sm:text-sm text-emerald-950 mb-1">
                Catatan Guru IPAS:
              </p>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {earnedBadge.description}
              </p>
            </div>

            {/* Action Buttons: Certificate, Retake, Map */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                id="btn-view-certificate"
                onClick={() => {
                  sound.playStarEarned();
                  triggerCertificateConfetti();
                  onOpenCertificate();
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-stone-950 font-display font-black rounded-2xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition"
              >
                <FileBadge className="w-4 h-4" />
                <span>Lihat & Unduh Sertifikat 📜</span>
              </button>

              <button
                id="btn-retake-quiz"
                onClick={handleRetakeQuiz}
                className="px-5 py-3 bg-white hover:bg-stone-50 border-2 border-stone-300 text-stone-800 font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Kuis</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onGoToMap();
                }}
                className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition shadow-xs"
              >
                <Map className="w-4 h-4" />
                <span>Buka Peta Petualangan</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              sound.playClick();
              onGoToMap();
            }}
            className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-xs"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Peta Petualangan</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestartAll();
            }}
            className="text-xs text-stone-500 hover:text-stone-800 underline"
          >
            Mulai Dari Awal Gerbang Sekolah
          </button>
        </div>
      </div>
    </div>
  );
};
