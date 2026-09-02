import React, { useState, useEffect } from 'react';
import { CEFRLevel, LessonUnit, SupportedLanguage } from './types';
import { CURRICULUM_UNITS } from './data/curriculumData';
import { Navbar } from './components/Navbar';
import { LevelRoadmap } from './components/LevelRoadmap';
import { LessonView } from './components/LessonView';
import { AITutorChat } from './components/AITutorChat';
import { AudioDiscriminationGame } from './components/AudioDiscriminationGame';
import { GrammarAnalyzerModal } from './components/GrammarAnalyzerModal';
import { PlacementTestModal } from './components/PlacementTestModal';
import { CertificateModal } from './components/CertificateModal';
import { PhoneticsGuideModal } from './components/PhoneticsGuideModal';
import { VideoLibraryModal } from './components/VideoLibraryModal';
import { ReadingLabModal } from './components/ReadingLabModal';
import { Footer } from './components/Footer';
import { CulturalProverbs } from './components/CulturalProverbs';
import { playSoundEffect } from './utils/audio';
import {
  Compass,
  MessageSquare,
  Volume2,
  Award,
  Search,
  Sparkles,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Flame,
  Crown,
  Video,
} from 'lucide-react';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>('A1');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [activeView, setActiveView] = useState<'roadmap' | 'lesson' | 'tutor' | 'soundLab'>('roadmap');
  const [selectedUnit, setSelectedUnit] = useState<LessonUnit | null>(null);

  // Gamification State (with local storage persistence)
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('arabiya_xp');
    return saved ? parseInt(saved, 10) : 120;
  });
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('arabiya_streak');
    return saved ? parseInt(saved, 10) : 4;
  });
  const [gems, setGems] = useState<number>(() => {
    const saved = localStorage.getItem('arabiya_gems');
    return saved ? parseInt(saved, 10) : 45;
  });
  const [completedUnits, setCompletedUnits] = useState<string[]>(() => {
    const saved = localStorage.getItem('arabiya_completed_units');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal States
  const [isGrammarModalOpen, setIsGrammarModalOpen] = useState(false);
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isPhoneticsModalOpen, setIsPhoneticsModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoModalCategory, setVideoModalCategory] = useState<'all' | 'letters' | 'texts' | 'vocabulary' | 'dialogues'>('all');
  const [videoModalInitialId, setVideoModalInitialId] = useState<string | undefined>(undefined);
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);
  const [readingModalCategoryId, setReadingModalCategoryId] = useState<string | undefined>(undefined);

  const handleOpenReadingLab = (categoryId?: string) => {
    setReadingModalCategoryId(categoryId);
    setIsReadingModalOpen(true);
    playSoundEffect('tap');
  };

  const handleOpenVideoLibrary = (category?: string, queryOrId?: string) => {
    if (category) {
      setVideoModalCategory(category as any);
    } else {
      setVideoModalCategory('all');
    }
    setVideoModalInitialId(queryOrId);
    setIsVideoModalOpen(true);
    playSoundEffect('tap');
  };

  // Persist gamification changes
  useEffect(() => {
    localStorage.setItem('arabiya_xp', xp.toString());
    localStorage.setItem('arabiya_streak', streak.toString());
    localStorage.setItem('arabiya_gems', gems.toString());
    localStorage.setItem('arabiya_completed_units', JSON.stringify(completedUnits));
  }, [xp, streak, gems, completedUnits]);

  const handleSelectUnit = (unit: LessonUnit) => {
    setSelectedUnit(unit);
    setActiveView('lesson');
  };

  const handleCompleteUnit = (unitId: string, earnedXp: number) => {
    if (!completedUnits.includes(unitId)) {
      setCompletedUnits((prev) => [...prev, unitId]);
    }
    setXp((x) => x + earnedXp);
    setGems((g) => g + 10);
    setActiveView('roadmap');
    setSelectedUnit(null);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-slate-900 font-sans flex flex-col selection:bg-amber-400 selection:text-amber-950">
      {/* Navigation Bar */}
      <Navbar
        currentLevel={currentLevel}
        onSelectLevel={(lvl) => {
          setCurrentLevel(lvl);
          setActiveView('roadmap');
          setSelectedUnit(null);
        }}
        language={language}
        onSelectLanguage={setLanguage}
        streak={streak}
        xp={xp}
        gems={gems}
        onOpenPlacementTest={() => setIsPlacementModalOpen(true)}
        onOpenGrammarAnalyzer={() => setIsGrammarModalOpen(true)}
        onOpenCertificate={() => setIsCertificateModalOpen(true)}
        onOpenPhonetics={() => setIsPhoneticsModalOpen(true)}
        onOpenVideoLibrary={() => handleOpenVideoLibrary('all')}
        onOpenReadingLab={() => handleOpenReadingLab()}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Utility Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-amber-200/80 shadow-sm shadow-amber-500/5">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveView('roadmap');
                setSelectedUnit(null);
                playSoundEffect('tap');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'roadmap'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-slate-700 hover:bg-amber-50 hover:text-emerald-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{language === 'ar' ? 'خريطة المستويات' : language === 'fr' ? 'Parcours A1-C2' : 'Curriculum Roadmap'}</span>
            </button>

            <button
              onClick={() => handleOpenReadingLab()}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-700 text-white shadow-sm shadow-emerald-700/25 hover:brightness-105 active:scale-95"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>{language === 'ar' ? 'مختبر القراءة والتهجئة (الصف 1 متقدم)' : language === 'fr' ? 'Atelier Lecture (1re Avancé)' : 'Reading Lab (1st Grade)'}</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">جديد</span>
            </button>

            <button
              onClick={() => {
                setActiveView('tutor');
                playSoundEffect('tap');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'tutor'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/30'
                  : 'text-slate-700 hover:bg-amber-50 hover:text-amber-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'ar' ? 'المعلم الذكي (فصيح)' : language === 'fr' ? 'Tuteur IA' : 'AI Tutor'}</span>
            </button>

            <button
              onClick={() => {
                setActiveView('soundLab');
                playSoundEffect('tap');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'soundLab'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm shadow-teal-600/30'
                  : 'text-slate-700 hover:bg-amber-50 hover:text-teal-900'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'مختبر الأصوات' : language === 'fr' ? 'Laboratoire Sons' : 'Phonetics Lab'}</span>
            </button>
          </div>

          {/* Quick Tools: Grammar Analyzer, Phonetics Reference & Video Library */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenVideoLibrary('all')}
              className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-900 text-xs font-bold border border-red-200/90 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Video className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>{language === 'ar' ? 'مكتبة الفيديوهات (45 شريط)' : language === 'fr' ? 'Médiathèque (45 vidéos)' : 'Video Library (45 videos)'}</span>
            </button>

            <button
              onClick={() => {
                setIsGrammarModalOpen(true);
                playSoundEffect('tap');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold border border-teal-200/80 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Search className="w-3.5 h-3.5 text-teal-600" />
              <span>{language === 'ar' ? 'محلل التشكيل والإعراب' : language === 'fr' ? 'Analyseur Tashkeel' : 'Grammar & Tashkeel'}</span>
            </button>

            <button
              onClick={() => {
                setIsPhoneticsModalOpen(true);
                playSoundEffect('tap');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-100/70 hover:bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300/80 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'ar' ? 'دليل المخارج' : language === 'fr' ? 'Guide Phonétique' : 'Sounds Guide'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Main View */}
        {activeView === 'roadmap' && (
          <div className="space-y-6">
            <LevelRoadmap
              currentLevel={currentLevel}
              onSelectUnit={handleSelectUnit}
              completedUnits={completedUnits}
              language={language}
              onOpenTutor={() => setActiveView('tutor')}
              onOpenSoundGame={() => setActiveView('soundLab')}
            />

            {/* Cultural wisdom and dialect comparisons widget */}
            <CulturalProverbs language={language} />
          </div>
        )}

        {activeView === 'lesson' && selectedUnit && (
          <LessonView
            unit={selectedUnit}
            onBack={() => {
              setActiveView('roadmap');
              setSelectedUnit(null);
            }}
            onCompleteUnit={handleCompleteUnit}
            language={language}
            onOpenVideoLibrary={handleOpenVideoLibrary}
          />
        )}

        {activeView === 'tutor' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  {language === 'ar' ? 'المحادثة الشفهية والذكية مع الأستاذ فصيح' : language === 'fr' ? 'Pratique Orale avec le Tuteur IA Faseeh' : 'Oral & Conversational Practice with Tutor Faseeh'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'fr'
                    ? 'Parlez ou écrivez en arabe pour recevoir des corrections personnalisées et le Tashkeel'
                    : 'Speak or type in Arabic to get instant vocalized pedagogical feedback'}
                </p>
              </div>
            </div>
            <AITutorChat currentLevel={currentLevel} language={language} />
          </div>
        )}

        {activeView === 'soundLab' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  {language === 'ar' ? 'مختبر تمييز الأصوات ومخارج الحروف الصعبة' : language === 'fr' ? 'Laboratoire de Discrimination Auditive & Phonétique' : 'Auditory Discrimination & Tricky Arabic Sounds'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'fr'
                    ? 'Développez votre oreille pour différencier les sons proches de la langue arabe'
                    : 'Train your brain to recognize minimal pairs and subtle pharyngeal/emphatic distinctions'}
                </p>
              </div>
            </div>
            <AudioDiscriminationGame language={language} onComplete={() => setXp((x) => x + 30)} />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <GrammarAnalyzerModal
        isOpen={isGrammarModalOpen}
        onClose={() => setIsGrammarModalOpen(false)}
        language={language}
      />

      <PlacementTestModal
        isOpen={isPlacementModalOpen}
        onClose={() => setIsPlacementModalOpen(false)}
        onSelectLevel={(lvl) => {
          setCurrentLevel(lvl);
          setActiveView('roadmap');
        }}
        language={language}
      />

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        level={currentLevel}
        xp={xp}
        language={language}
      />

      <PhoneticsGuideModal
        isOpen={isPhoneticsModalOpen}
        onClose={() => setIsPhoneticsModalOpen(false)}
        language={language}
      />

      <VideoLibraryModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        language={language}
        initialCategory={videoModalCategory}
        initialVideoId={videoModalInitialId}
      />

      <ReadingLabModal
        isOpen={isReadingModalOpen}
        onClose={() => setIsReadingModalOpen(false)}
        language={language}
        initialCategoryId={readingModalCategoryId}
      />

      {/* Footer ArabFacile.com */}
      <Footer
        language={language}
        onOpenPhonetics={() => setIsPhoneticsModalOpen(true)}
        onOpenVideoLibrary={() => handleOpenVideoLibrary('all')}
        onOpenPlacement={() => setIsPlacementModalOpen(true)}
        onOpenReadingLab={() => handleOpenReadingLab()}
      />
    </div>
  );
}
