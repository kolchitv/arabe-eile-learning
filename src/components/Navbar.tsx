import React, { useState, useRef, useEffect } from 'react';
import { CEFRLevel, SupportedLanguage } from '../types';
import {
  Sparkles,
  Flame,
  Zap,
  Gem,
  Award,
  Search,
  HelpCircle,
  Volume2,
  Globe,
  Video,
  BookOpen,
  GraduationCap,
  Mic,
  ChevronDown,
  LayoutGrid,
} from 'lucide-react';

interface NavbarProps {
  currentLevel: CEFRLevel;
  onSelectLevel: (lvl: CEFRLevel) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  streak: number;
  xp: number;
  gems: number;
  onOpenPlacementTest: () => void;
  onOpenGrammarAnalyzer: () => void;
  onOpenCertificate: () => void;
  onOpenPhonetics: () => void;
  onOpenVideoLibrary: () => void;
  onOpenReadingLab: () => void;
  onOpenSpeakingLab?: () => void;
  onOpenUnit1Lab?: () => void;
  onOpenSpeedReading?: () => void;
  onOpenThematicVocab?: (categoryId?: string) => void;
  onOpenTextStudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLevel,
  onSelectLevel,
  language,
  onSelectLanguage,
  streak,
  xp,
  gems,
  onOpenPlacementTest,
  onOpenGrammarAnalyzer,
  onOpenCertificate,
  onOpenPhonetics,
  onOpenVideoLibrary,
  onOpenReadingLab,
  onOpenSpeakingLab,
  onOpenUnit1Lab,
  onOpenSpeedReading,
  onOpenThematicVocab,
  onOpenTextStudio,
}) => {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const levelLabels: Record<CEFRLevel, { nameAr: string; nameEn: string; nameFr: string }> = {
    A1: { nameAr: 'المبتدئ', nameEn: 'Discovery', nameFr: 'Débutant' },
    A2: { nameAr: 'الأساسي', nameEn: 'Elementary', nameFr: 'Élémentaire' },
    B1: { nameAr: 'المستقل', nameEn: 'Intermediate', nameFr: 'Intermédiaire' },
    B2: { nameAr: 'المتمكن', nameEn: 'Vantage', nameFr: 'Avancé B2' },
    C1: { nameAr: 'المتقدم', nameEn: 'Proficient', nameFr: 'Autonome C1' },
    C2: { nameAr: 'الفصيح (الإتقان)', nameEn: 'Mastery', nameFr: 'Maîtrise C2' },
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(e.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-sm shadow-amber-500/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Bar: Brand Logo + CEFR Levels + Language & Certificate */}
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
              <span className="font-serif font-bold text-xl sm:text-2xl leading-none">ض</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  فَصِيح <span className="text-emerald-700 text-base sm:text-lg font-semibold">Faseeh</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium hidden md:block">
                {language === 'ar' ? 'تعليم العربية لغير الناطقين بها' : language === 'fr' ? 'Arabe Langue Vivante (A1 ➔ C2)' : 'Arabic for Global Learners'}
              </p>
            </div>
          </div>

          {/* CEFR Level Selector Pills (In the Top Bar) */}
          <div className="flex items-center bg-amber-100/70 p-1 rounded-2xl border border-amber-200/80 overflow-x-auto no-scrollbar max-w-2xl">
            {levels.map((lvl) => {
              const isActive = currentLevel === lvl;
              return (
                <button
                  key={lvl}
                  id={`nav-level-${lvl}`}
                  onClick={() => onSelectLevel(lvl)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-sm shadow-emerald-800/20 border border-emerald-600'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-white/80'
                  }`}
                  title={`${lvl} - ${levelLabels[lvl].nameEn}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive ? 'bg-amber-300 ring-2 ring-emerald-300' : 'bg-amber-400'
                    }`}
                  />
                  <span className="font-black text-xs sm:text-sm">{lvl}</span>
                  <span className="text-[10px] opacity-90 hidden lg:inline font-medium">
                    ({language === 'ar' ? levelLabels[lvl].nameAr : language === 'fr' ? levelLabels[lvl].nameFr : levelLabels[lvl].nameEn})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Area: Language Switcher + Certificate */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Switcher Dropdown */}
            <div className="relative flex items-center bg-amber-100/80 rounded-xl p-0.5 border border-amber-300/80 text-xs font-bold shrink-0">
              <button
                id="btn-lang-fr"
                onClick={() => onSelectLanguage('fr')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all ${language === 'fr' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                FR 🇫🇷
              </button>
              <button
                id="btn-lang-ar"
                onClick={() => onSelectLanguage('ar')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all ${language === 'ar' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                عربي 🇸🇦
              </button>
              <button
                id="btn-lang-en"
                onClick={() => onSelectLanguage('en')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                EN 🇬🇧
              </button>
            </div>

            {/* Certificate Button */}
            <button
              id="btn-nav-certificate"
              onClick={onOpenCertificate}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm shadow-amber-500/25 active:scale-95 transition-all shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>{language === 'ar' ? 'الشهادة' : language === 'fr' ? 'Certificat' : 'Certificate'}</span>
            </button>
          </div>
        </div>

        {/* Lower Bar: Structured & Organized Navigation Bar */}
        <div className="border-t border-amber-200/70 py-2 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          
          {/* Main Primary Sections (Organized Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* 1. المفردات المصورة بالبطاقات */}
            {onOpenThematicVocab && (
              <button
                id="btn-nav-thematic-vocab"
                onClick={() => onOpenThematicVocab()}
                className="px-3 py-1.5 text-slate-950 hover:bg-amber-300 rounded-xl transition-all text-xs font-black flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 border border-amber-500 shadow-sm active:scale-95 shrink-0"
                title="بطاقات المفردات المصورة مصنفة حسب المجالات (الأسرة، المنزل، الفواكه...)"
              >
                <span className="text-base">🖼️</span>
                <span className="font-arabic">{language === 'ar' ? 'بطاقات المفردات (المجالات)' : language === 'fr' ? 'Vocabulaire par Thèmes' : 'Vocabulary Domains'}</span>
                <span className="bg-slate-950 text-amber-300 text-[9px] px-1.5 py-0.2 rounded-full font-black">12 مجالاً</span>
              </button>
            )}

            {/* 2. قارئ ومسجل النصوص المخصص */}
            {onOpenTextStudio && (
              <button
                id="btn-nav-text-studio"
                onClick={onOpenTextStudio}
                className="px-3 py-1.5 text-slate-950 hover:bg-amber-200/90 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 bg-amber-100 border border-amber-400 shadow-2xs active:scale-95 shrink-0"
                title="قارئ النصوص المخصص مع تتبع الكلمات بالدائرة المضيئة وتسجيل الصوت"
              >
                <span className="text-base">🎙️</span>
                <span className="font-arabic">{language === 'fr' ? 'Studio Textes & Voix' : language === 'ar' ? 'قارئ ومسجل النصوص' : 'Text & Voice Studio'}</span>
              </button>
            )}

            {/* 3. منهاج الوحدة 1 (الأسرة والمحيط) */}
            {onOpenUnit1Lab && (
              <button
                id="btn-unit1-lab"
                onClick={onOpenUnit1Lab}
                className="px-3 py-1.5 text-amber-950 hover:bg-amber-200/90 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 bg-white border border-amber-300 shadow-2xs active:scale-95 shrink-0"
                title="منهاج الوحدة 1 (المجال الثاني: الأسرة والمحيط - حوارات التعارف والمكونات الـ5)"
              >
                <span className="text-base">👨‍👩‍👧‍👦</span>
                <span className="font-black font-arabic">{language === 'fr' ? 'Unité 1 (Famille)' : language === 'ar' ? 'الوحدة 1 (الأسرة)' : 'Unit 1 (Family)'}</span>
              </button>
            )}

            {/* 4. مختبر التعبير الشفهي */}
            {onOpenSpeakingLab && (
              <button
                id="btn-speaking-lab"
                onClick={onOpenSpeakingLab}
                className="px-3 py-1.5 text-rose-700 hover:text-rose-950 hover:bg-rose-100/90 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 bg-rose-50 border border-rose-200 shadow-2xs active:scale-95 shrink-0"
                title="مختبر التعبير الشفهي المسترسل والاستماع"
              >
                <Mic className="w-3.5 h-3.5 text-rose-600" />
                <span className="font-bold">{language === 'fr' ? 'Oral & Écoute' : language === 'ar' ? 'التعبير الشفهي' : 'Speaking Lab'}</span>
              </button>
            )}

            {/* 5. مختبر القراءة والتهجئة */}
            <button
              id="btn-reading-lab"
              onClick={onOpenReadingLab}
              className="px-3 py-1.5 text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 shadow-2xs active:scale-95 shrink-0"
              title="مختبر القراءة والتهجئة - الصف الأول متقدم"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-bold">{language === 'fr' ? '1re Avancé' : language === 'ar' ? 'القراءة (1 متقدم)' : 'Reading'}</span>
            </button>

            {/* 6. قائمة الأدوات والألعاب الإضافية المنظمة (Dropdown Menu) */}
            <div className="relative" ref={toolsDropdownRef}>
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="px-3 py-1.5 text-slate-800 hover:bg-slate-100 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 bg-slate-50 border border-slate-300 shadow-2xs active:scale-95 shrink-0"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'ar' ? 'الأدوات والألعاب' : language === 'fr' ? 'Outils & Jeux' : 'Tools & Games'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Tools Dropdown Menu */}
              {isToolsDropdownOpen && (
                <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-2 z-50 animate-fade-in space-y-1">
                  
                  {onOpenSpeedReading && (
                    <button
                      onClick={() => {
                        setIsToolsDropdownOpen(false);
                        onOpenSpeedReading();
                      }}
                      className="w-full text-right sm:text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-50 flex items-center justify-between text-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">⚡</span>
                        <span>{language === 'ar' ? 'لعبة: من يقرأ أسرع؟' : 'Jeu : Qui lit vite ?'}</span>
                      </div>
                      <span className="text-[10px] bg-amber-200 text-amber-950 px-1.5 py-0.5 rounded font-mono font-bold">⏱️ WPM</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsToolsDropdownOpen(false);
                      onOpenVideoLibrary();
                    }}
                    className="w-full text-right sm:text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-rose-50 flex items-center justify-between text-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-rose-600" />
                      <span>{language === 'ar' ? 'مكتبة الفيديوهات التعليمية' : 'Vidéothèque'}</span>
                    </div>
                    <span className="text-[10px] bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded">🎬</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsToolsDropdownOpen(false);
                      onOpenPhonetics();
                    }}
                    className="w-full text-right sm:text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 flex items-center justify-between text-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'ar' ? 'دليل مخارج الأصوات والحروف' : 'Guide Phonétique'}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">🔊</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsToolsDropdownOpen(false);
                      onOpenGrammarAnalyzer();
                    }}
                    className="w-full text-right sm:text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-teal-50 flex items-center justify-between text-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-teal-600" />
                      <span>{language === 'ar' ? 'محلل الإعراب والتشكيل' : 'Analyseur de Grammaire'}</span>
                    </div>
                    <span className="text-[10px] bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded">🔍</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsToolsDropdownOpen(false);
                      onOpenPlacementTest();
                    }}
                    className="w-full text-right sm:text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-50 flex items-center justify-between text-slate-800 transition-colors border-t border-slate-100 mt-1 pt-2"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>{language === 'ar' ? 'اختبار تحديد المستوى' : 'Test de Positionnement'}</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">📋</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Gamification Stats: Streak & XP & Gems */}
          <div className="flex items-center gap-2 sm:gap-2.5 bg-gradient-to-r from-amber-100/90 via-orange-100/70 to-amber-100/90 border border-amber-300/80 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-amber-950 shadow-2xs shrink-0">
            <div className="flex items-center gap-1" title={`${streak} Day Learning Streak!`}>
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span>{streak}</span>
            </div>
            <span className="text-amber-300 font-light">|</span>
            <div className="flex items-center gap-1" title={`${xp} Total XP Points`}>
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>{xp}</span>
            </div>
            <span className="text-amber-300 font-light">|</span>
            <div className="flex items-center gap-1 text-emerald-900" title={`${gems} Dhad Gems`}>
              <Gem className="w-4 h-4 text-emerald-600 fill-emerald-500" />
              <span>{gems}</span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

