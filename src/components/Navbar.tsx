import React from 'react';
import { CEFRLevel, SupportedLanguage } from '../types';
import { Sparkles, Flame, Zap, Gem, Award, Search, HelpCircle, Volume2, Globe, Video, BookOpen, GraduationCap, Mic } from 'lucide-react';

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
}) => {
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const levelLabels: Record<CEFRLevel, { nameAr: string; nameEn: string; nameFr: string }> = {
    A1: { nameAr: 'المبتدئ', nameEn: 'Discovery', nameFr: 'Débutant' },
    A2: { nameAr: 'الأساسي', nameEn: 'Elementary', nameFr: 'Élémentaire' },
    B1: { nameAr: 'المستقل', nameEn: 'Intermediate', nameFr: 'Intermédiaire' },
    B2: { nameAr: 'المتمكن', nameEn: 'Vantage', nameFr: 'Avancé B2' },
    C1: { nameAr: 'المتقدم', nameEn: 'Proficient', nameFr: 'Autonome C1' },
    C2: { nameAr: 'الفصيح (الإتقان)', nameEn: 'Mastery', nameFr: 'Maîtrise C2' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-sm shadow-amber-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Primary Bar */}
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
              <span className="font-serif font-bold text-2xl leading-none">ض</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  فَصِيح <span className="text-emerald-700 text-lg font-semibold">Faseeh</span>
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-amber-100 text-amber-950 border border-amber-300/80">
                  CEFR A1 ➔ C2
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium hidden md:block">
                {language === 'ar' ? 'تعليم العربية لغير الناطقين بها بمتعة وتدرج' : language === 'fr' ? 'Apprendre l\'arabe de A1 à C2 de manière ludique' : 'Fun & Interactive Arabic for Global Learners'}
              </p>
            </div>
          </div>

          {/* Right Area: Quick Tools & Stats & Language */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            
            {/* Quick Tools */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {onOpenUnit1Lab && (
                <button
                  id="btn-unit1-lab"
                  onClick={onOpenUnit1Lab}
                  className="px-2.5 py-1.5 text-amber-950 hover:bg-amber-200/80 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-amber-300 to-amber-400 border border-amber-500/80 shadow-xs active:scale-95"
                  title="منهاج الوحدة 1 (المجال الثاني: الأسرة والمحيط - حوارات التعارف والمكونات الـ5)"
                >
                  <span className="text-sm">👨‍👩‍👧‍👦</span>
                  <span className="hidden sm:inline font-black font-arabic">{language === 'fr' ? 'Unité 1' : 'الوحدة 1'}</span>
                  <span className="bg-emerald-800 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">2025</span>
                </button>
              )}

              {onOpenSpeakingLab && (
                <button
                  id="btn-speaking-lab"
                  onClick={onOpenSpeakingLab}
                  className="px-2.5 py-1.5 text-rose-700 hover:text-rose-950 hover:bg-rose-100/80 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 bg-rose-50 border border-rose-300 shadow-2xs active:scale-95"
                  title="مختبر التعبير الشفهي المسترسل والاستماع"
                >
                  <Mic className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span className="hidden sm:inline font-extrabold">{language === 'fr' ? 'Oral & Écoute' : language === 'ar' ? 'التعبير الشفهي' : 'Speaking Lab'}</span>
                </button>
              )}

              <button
                id="btn-reading-lab"
                onClick={onOpenReadingLab}
                className="px-2.5 py-1.5 text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100 rounded-xl transition-all text-xs font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-300 shadow-2xs active:scale-95"
                title="مختبر القراءة والتهجئة - الصف الأول متقدم"
              >
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span className="hidden lg:inline">{language === 'fr' ? '1re Avancé' : language === 'ar' ? 'القراءة (1 متقدم)' : 'Reading Lab'}</span>
              </button>

              <button
                id="btn-video-library"
                onClick={onOpenVideoLibrary}
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-100/70 rounded-xl transition-all text-xs font-bold flex items-center gap-1 bg-rose-50 border border-rose-200 active:scale-95"
                title="Arabe EILE Video Library"
              >
                <Video className="w-4 h-4 text-red-600" />
                <span className="hidden md:inline">{language === 'fr' ? 'Vidéos' : language === 'ar' ? 'الفيديوهات' : 'Videos'}</span>
              </button>

              <button
                id="btn-phonetics-guide"
                onClick={onOpenPhonetics}
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 hover:text-emerald-800 hover:bg-emerald-100/70 rounded-xl transition-all text-xs font-bold flex items-center gap-1 active:scale-95"
                title="Phonetics & Mouth Articulation Guide"
              >
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span className="hidden md:inline">{language === 'fr' ? 'Sons' : language === 'ar' ? 'الأصوات' : 'Sounds'}</span>
              </button>

              <button
                id="btn-grammar-analyzer"
                onClick={onOpenGrammarAnalyzer}
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 hover:text-teal-800 hover:bg-teal-100/70 rounded-xl transition-all text-xs font-bold flex items-center gap-1 active:scale-95"
                title="AI Grammar & Tashkeel Analyzer"
              >
                <Search className="w-4 h-4 text-teal-700" />
                <span className="hidden md:inline">{language === 'fr' ? 'Grammaire' : language === 'ar' ? 'المحلل' : 'Analyzer'}</span>
              </button>

              <button
                id="btn-placement-test"
                onClick={onOpenPlacementTest}
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 hover:text-amber-900 hover:bg-amber-100 rounded-xl transition-all text-xs font-bold flex items-center gap-1 active:scale-95"
                title="Placement Diagnostic Test"
              >
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span className="hidden md:inline">{language === 'fr' ? 'Test' : language === 'ar' ? 'تحديد المستوى' : 'Level Test'}</span>
              </button>
            </div>

            {/* Gamification Stats: Streak & XP & Gems */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100/90 via-orange-100/70 to-amber-100/90 border border-amber-300/80 px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-950 shadow-2xs shrink-0">
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

            {/* Language Switcher Dropdown */}
            <div className="relative flex items-center bg-amber-100/80 rounded-lg p-0.5 border border-amber-300/80 text-xs font-bold shrink-0">
              <button
                id="btn-lang-fr"
                onClick={() => onSelectLanguage('fr')}
                className={`px-2 py-1 rounded-md transition-all ${language === 'fr' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                FR 🇫🇷
              </button>
              <button
                id="btn-lang-ar"
                onClick={() => onSelectLanguage('ar')}
                className={`px-2 py-1 rounded-md transition-all ${language === 'ar' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                عربي 🇸🇦
              </button>
              <button
                id="btn-lang-en"
                onClick={() => onSelectLanguage('en')}
                className={`px-2 py-1 rounded-md transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'}`}
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

        {/* Dedicated Lower Sub-Bar: CEFR Levels Selector (Spacious & Non-cramped) */}
        <div className="border-t border-amber-200/70 py-2.5 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          {/* Label indicator */}
          <div className="flex items-center gap-2 shrink-0 text-xs font-extrabold text-slate-700 pl-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-slate-500 uppercase tracking-wider text-[11px] font-black">
              {language === 'ar' ? 'المستوى الدراسي:' : language === 'fr' ? 'Niveau CECRL :' : 'CEFR Level:'}
            </span>
          </div>

          {/* Level Pills Grid / Flex */}
          <div className="flex items-center gap-2 flex-1 max-w-5xl justify-start sm:justify-center overflow-x-auto no-scrollbar py-0.5">
            {levels.map((lvl) => {
              const isActive = currentLevel === lvl;
              return (
                <button
                  key={lvl}
                  id={`nav-level-${lvl}`}
                  onClick={() => onSelectLevel(lvl)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-md shadow-emerald-700/20 border-emerald-500 scale-105'
                      : 'bg-amber-50/80 hover:bg-white text-slate-700 hover:text-slate-950 border-amber-200/80 hover:border-amber-400 shadow-2xs'
                  }`}
                  title={`${lvl} - ${levelLabels[lvl].nameEn}`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      isActive ? 'bg-amber-400 ring-2 ring-white/50' : 'bg-slate-300'
                    }`}
                  />
                  <span className="text-sm font-black tracking-wide">{lvl}</span>
                  <span
                    className={`text-[11px] font-semibold hidden md:inline ${
                      isActive ? 'text-emerald-100 font-arabic' : 'text-slate-500'
                    }`}
                  >
                    {language === 'ar'
                      ? levelLabels[lvl].nameAr
                      : language === 'fr'
                      ? levelLabels[lvl].nameFr
                      : levelLabels[lvl].nameEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Level Summary badge */}
          <div className="hidden lg:flex items-center gap-2 shrink-0 pr-1">
            <span className="text-[11px] bg-emerald-100/90 text-emerald-950 px-2.5 py-1 rounded-lg font-bold border border-emerald-300/80">
              {currentLevel} : {language === 'ar' ? levelLabels[currentLevel].nameAr : language === 'fr' ? levelLabels[currentLevel].nameFr : levelLabels[currentLevel].nameEn}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
