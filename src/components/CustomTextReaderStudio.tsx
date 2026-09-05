import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Mic,
  Square,
  Sparkles,
  Download,
  Trash2,
  BookOpen,
  Settings2,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FileText,
  HelpCircle,
  Clock,
  Flame,
  Wand2,
  Music,
  Share2,
  Eye,
  Sliders,
  X,
  ArrowRight,
} from 'lucide-react';
import { speakArabic, stopAudio, playSoundEffect } from '../utils/audio';
import { SupportedLanguage } from '../types';
import confetti from 'canvas-confetti';

interface CustomTextReaderStudioProps {
  language: SupportedLanguage;
  onBack?: () => void;
  onEarnXp?: (amount: number) => void;
  initialText?: string;
}

export type HighlightStyle = 'circle' | 'karaoke' | 'underline' | 'zoom';

export interface PresetText {
  id: string;
  titleAr: string;
  titleFr: string;
  category: string;
  textAr: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
}

export const PRESET_TEXTS: PresetText[] = [
  {
    id: 'preset-1',
    titleAr: 'فِي صَبَاحِ يَوْمٍ جَمِيلٍ',
    titleFr: 'Par un beau matin',
    category: 'قصص قصيرة',
    level: 'مبتدئ',
    textAr: 'فِي صَبَاحِ يَوْمٍ مُشْرِقٍ، اسْتَيْقَظَ سَامِي مُبَكِّرًا وَفَتَحَ نَافِذَةَ غُرْفَتِهِ. رَأَى الشَّمْسَ الذَّهَبِيَّةَ تَمْلَأُ السَّمَاءَ، وَسَمِعَ العَصَافِيرَ تُغَرِّدُ فَوْقَ أَغْصَانِ الأَشْجَارِ بِأَلْحَانٍ عَذْبَةٍ. غَسَلَ وَجْهَهُ بِالمَاءِ البَارِدِ، وَتَنَاوَلَ فُطُورَهُ الشَّهِيَّ مَعَ أُسْرَتِهِ قَبْلَ الذَّهَابِ إِلَى المَدْرَسَةِ.',
  },
  {
    id: 'preset-2',
    titleAr: 'رِحْلَةٌ إِلَى حَدِيقَةِ الحَيَوَانِ',
    titleFr: 'Visite au zoo',
    category: 'مغامرات',
    level: 'مبتدئ',
    textAr: 'ذَهَبَتِ الأُسْرَةُ فِي نُزْهَةٍ رَائِعَةٍ إِلَى حَدِيقَةِ الحَيَوَانَاتِ. شَاهَدَ الأَطْفَالُ الأَسَدَ القَوِيَّ وَهُوَ يَمْشِي بِفَخْرٍ، وَالفِيلَ الضَّخْمَ يَلْعَبُ بِالمَاءِ بِخُرْطُومِهِ الطَّوِيلِ، وَالقِرَدَةَ المَرِحَةَ تَقْفِزُ بَيْنَ الأَغْصَانِ بِخِفَّةٍ وَسُرُورٍ.',
  },
  {
    id: 'preset-3',
    titleAr: 'حِكْمَةُ التَّعَاوُنِ وَالعَمَلِ',
    titleFr: 'La valeur de la coopération',
    category: 'قيم وتربية',
    level: 'متوسط',
    textAr: 'التَّعَاوُنُ خُلُقٌ نَبِيلٌ يَبْنِي المُجْتَمَعَاتِ وَيَنْشُرُ المَحَبَّةَ بَيْنَ النَّاسِ. عِنْدَمَا يَتَّحِدُ الجَمِيعُ لِمُسَاعَدَةِ المُحْتَاجِ وَبِنَاءِ الوَطَنِ، تَتَحَقَّقُ النَّجَاحَاتُ العَظِيمَةُ وَيَعِيشُ الجَمِيعُ فِي سَلَامٍ وَأَمَانٍ.',
  },
  {
    id: 'preset-4',
    titleAr: 'فَصْلُ الرَّبِيعِ البَدِيعُ',
    titleFr: 'Le printemps magnifique',
    category: 'طبيعة',
    level: 'مبتدئ',
    textAr: 'أَقْبَلَ فَصْلُ الرَّبِيعِ بِأَلْوَانِهِ الزَّاهِيَةِ وَأَزْهَارِهِ العَطِرَةِ. اكْتَسَتِ الأَرْضُ ثَوْبًا أَخْضَرَ سَاحِرًا، وَتَفَتَّحَتِ الوُرُودُ الحَمْرَاءُ وَالصَّفْرَاءُ، وَرَقَصَتِ الفَرَاشَاتُ المُلَوَّنَةُ فِي كُلِّ مَكَانٍ فَرَحًا بِهَذَا الجَمَالِ.',
  },
  {
    id: 'preset-5',
    titleAr: 'حِوَارُ التَّعَارُفِ فِي المَدْرَسَةِ',
    titleFr: 'Dialogue de présentation',
    category: 'محادثة',
    level: 'مبتدئ',
    textAr: 'قَالَ زَيْدٌ: السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ. أَجَابَ عُمَرُ: وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ. قَالَ زَيْدٌ: أَنَا اسْمِي زَيْدٌ وَأَدْرُسُ فِي الصَّفِّ الثَّانِي، وَأَنْتَ مَا اسْمُكَ؟ رَدَّ عُمَرُ: اسْمِي عُمَرُ وَأَنَا سَعِيدٌ بِمَعْرِفَتِكَ يَا صَدِيقِي.',
  },
];

export const CustomTextReaderStudio: React.FC<CustomTextReaderStudioProps> = ({
  language,
  onBack,
  onEarnXp,
  initialText = PRESET_TEXTS[0].textAr,
}) => {
  // Text Content State
  const [customText, setCustomText] = useState<string>(initialText);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Playback & Tracking State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [wordsList, setWordsList] = useState<string[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.85); // TTS speed rate
  const [readingPaceWpm, setReadingPaceWpm] = useState<number>(75); // Target Words Per Minute
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Highlighting & Visual Styling
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyle>('circle');
  const [highlightColor, setHighlightColor] = useState<string>('amber'); // amber, emerald, blue, rose, purple
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(2); // 0: sm, 1: base, 2: lg, 3: xl, 4: 2xl

  // Voice Recording Studio State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState<boolean>(false);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const playTimerRef = useRef<any>(null);
  const wordsContainerRef = useRef<HTMLDivElement | null>(null);

  // Split text into words safely
  useEffect(() => {
    const raw = customText.trim();
    if (!raw) {
      setWordsList([]);
      return;
    }
    // Split by whitespace
    const words = raw.split(/\s+/).filter(Boolean);
    setWordsList(words);
    setCurrentWordIndex(-1);
    setIsPlaying(false);
    clearTimeout(playTimerRef.current);
  }, [customText]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(playTimerRef.current);
      clearInterval(recordingTimerRef.current);
      stopAudio();
    };
  }, []);

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        playSoundEffect('correct');
        if (onEarnXp) onEarnXp(25);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.8 },
        });
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      playSoundEffect('tap');

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      alert(
        language === 'ar'
          ? 'تعذر الوصول إلى الميكروفون. يرجى التأكد من منح الإذن للمتصفح.'
          : 'Impossible d’accéder au microphone. Veuillez autoriser l’accès dans votre navigateur.'
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
      playSoundEffect('tap');
    }
  };

  const deleteRecording = () => {
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
      setIsPlayingUserAudio(false);
      playSoundEffect('tap');
    }
  };

  const togglePlayUserAudio = () => {
    if (!recordedAudioUrl) return;
    if (!userAudioPlayerRef.current) {
      userAudioPlayerRef.current = new Audio(recordedAudioUrl);
      userAudioPlayerRef.current.onended = () => setIsPlayingUserAudio(false);
    } else {
      userAudioPlayerRef.current.src = recordedAudioUrl;
    }

    if (isPlayingUserAudio) {
      userAudioPlayerRef.current.pause();
      setIsPlayingUserAudio(false);
    } else {
      userAudioPlayerRef.current.play();
      setIsPlayingUserAudio(true);
    }
  };

  // Automated Karaoke Reading Loop
  const startReading = async () => {
    if (wordsList.length === 0) return;
    setIsPlaying(true);
    playSoundEffect('tap');

    // Calculate delay per word based on target reading pace (WPM)
    // 60 WPM = 1000ms per word, 120 WPM = 500ms per word
    const msPerWord = Math.max(300, Math.round((60 / readingPaceWpm) * 1000));

    let idx = currentWordIndex >= 0 && currentWordIndex < wordsList.length ? currentWordIndex : 0;

    const advanceWord = async () => {
      if (idx >= wordsList.length) {
        setIsPlaying(false);
        setCurrentWordIndex(-1);
        playSoundEffect('levelup');
        if (onEarnXp) onEarnXp(20);
        return;
      }

      setCurrentWordIndex(idx);

      // Auto scroll word into view smoothly if out of container
      const wordElement = document.getElementById(`studio-word-${idx}`);
      if (wordElement) {
        wordElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }

      // If sound is enabled, pronounce this specific word
      if (soundEnabled) {
        const wordText = wordsList[idx];
        speakArabic(wordText, playbackSpeed);
      }

      idx++;
      playTimerRef.current = setTimeout(advanceWord, msPerWord);
    };

    advanceWord();
  };

  const pauseReading = () => {
    setIsPlaying(false);
    clearTimeout(playTimerRef.current);
    stopAudio();
    playSoundEffect('tap');
  };

  const resetReading = () => {
    setIsPlaying(false);
    clearTimeout(playTimerRef.current);
    stopAudio();
    setCurrentWordIndex(-1);
    playSoundEffect('tap');
  };

  const handleWordClick = (index: number) => {
    setCurrentWordIndex(index);
    playSoundEffect('tap');
    if (soundEnabled && wordsList[index]) {
      speakArabic(wordsList[index], playbackSpeed);
    }
  };

  // Font sizes for the text display
  const fontSizes = [
    'text-xl sm:text-2xl leading-loose',
    'text-2xl sm:text-3xl leading-loose',
    'text-3xl sm:text-4xl leading-loose',
    'text-4xl sm:text-5xl leading-loose',
    'text-5xl sm:text-6xl leading-loose',
  ];

  // Helper formatting for seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Color mappings for highlighting
  const getColorClasses = (isActive: boolean) => {
    if (!isActive) return '';

    switch (highlightStyle) {
      case 'circle':
        return 'ring-4 ring-amber-400 bg-amber-400/20 text-amber-950 font-black rounded-2xl scale-110 shadow-lg shadow-amber-400/30';
      case 'karaoke':
        return 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black rounded-xl px-2 py-0.5 shadow-md scale-105';
      case 'underline':
        return 'border-b-4 border-amber-500 text-amber-900 font-black bg-amber-100/60 rounded-md';
      case 'zoom':
        return 'text-amber-700 font-black scale-125 bg-amber-100/90 rounded-2xl px-2.5 shadow-xl';
      default:
        return 'bg-amber-300 text-slate-950 font-black rounded-lg';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      
      {/* ========================================================================= */}
      {/* 1. TOP HERO HEADER & CONTROLS                                             */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950/50 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-2 border-amber-500/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'مختبر القراءة الذكي وتسجيل الصوت' : language === 'fr' ? 'Studio de Lecture & Enregistrement' : 'Custom Text Karaoke & Voice Studio'}</span>
              </span>
              <span className="bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-0.5 rounded-full border border-white/10">
                تتبع الكلمات • نطق فصيح • تسجيل مباشر
              </span>
            </div>

            <h1 dir="rtl" className="font-arabic text-3xl sm:text-4xl font-black text-amber-200 leading-tight">
              قَارِئُ النُّصُوصِ المُتَطَوِّرُ مَعَ التَّتَبُّعِ البَصَرِيِّ
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              {language === 'fr'
                ? 'Tapez ou collez vos propres textes arabes. Suivez la lecture mot par mot avec un cercle ou surlignage animé, et enregistrez votre voix pour vous écouter.'
                : 'أدخل أو ألصق أي نص تريده، وسيتم تمييز كل كلمة بدائرة أو تظليل مضيء أثناء القراءة، مع إمكانية تسجيل صوتك ومقارنة نطقك.'}
            </p>
          </div>

          {/* Action Navigation */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all border ${
                isEditing
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/25 font-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{isEditing ? (language === 'ar' ? 'إغلاق المحرر' : 'Fermer l’éditeur') : (language === 'ar' ? 'تعديل أو كتابة نص جديد' : 'Changer de texte')}</span>
            </button>

            {onBack && (
              <button
                onClick={onBack}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl transition-colors border border-slate-700"
                title="Retour"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TEXT EDITING & PRESETS MODAL DRAWER                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {language === 'ar' ? 'أدخل نصك المخصص أو اختر من المكتبة الجاهزة' : 'Saisissez votre texte ou choisissez un modèle :'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preset Text Selector Pills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 block">
                {language === 'ar' ? 'نصوص ونماذج جاهزة للقراءة :' : 'Textes modèles prêts à l’emploi :'}
              </span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {PRESET_TEXTS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setCustomText(preset.textAr);
                      playSoundEffect('tap');
                    }}
                    className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 shrink-0 transition-colors flex items-center gap-2 group"
                  >
                    <span>📖</span>
                    <span className="font-arabic font-extrabold">{preset.titleAr}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-slate-600 border border-amber-100">
                      {preset.level}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Textarea Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{language === 'ar' ? 'اكتب أو الصق النص هنا (يدعم التشكيل والحركات بالكامل) :' : 'Votre texte en arabe (avec ou sans voyelles) :'}</span>
                <span className="text-slate-400 font-mono text-[11px]">{customText.length} حرفاً</span>
              </label>
              <textarea
                dir="rtl"
                rows={5}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="أدخل النص العربي هنا مع التشكيل أو بدونه..."
                className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 font-arabic text-xl sm:text-2xl leading-loose focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-400/20 transition-all resize-y"
              />
            </div>

            {/* Quick Action buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCustomText('')}
                className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'مسح النص' : 'Effacer'}</span>
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  playSoundEffect('tap');
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>{language === 'ar' ? 'تطبيق وبدء القراءة 🚀' : 'Appliquer et lire 🚀'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. SETTINGS & VISUAL STYLING BAR                                          */}
      {/* ========================================================================= */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-amber-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Pointer / Highlight Style Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Eye className="w-4 h-4 text-amber-600" />
            <span>{language === 'ar' ? 'نمط المؤشر :' : 'Style de curseur :'}</span>
          </span>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => {
                setHighlightStyle('circle');
                playSoundEffect('tap');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                highlightStyle === 'circle'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⭕</span>
              <span>{language === 'ar' ? 'دائرة مضيئة' : 'Cercle Halo'}</span>
            </button>

            <button
              onClick={() => {
                setHighlightStyle('karaoke');
                playSoundEffect('tap');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                highlightStyle === 'karaoke'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🟨</span>
              <span>{language === 'ar' ? 'تظليل كاريوكي' : 'Surlignage'}</span>
            </button>

            <button
              onClick={() => {
                setHighlightStyle('underline');
                playSoundEffect('tap');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                highlightStyle === 'underline'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>〰️</span>
              <span>{language === 'ar' ? 'سطر سفلي' : 'Ligne'}</span>
            </button>

            <button
              onClick={() => {
                setHighlightStyle('zoom');
                playSoundEffect('tap');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                highlightStyle === 'zoom'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔍</span>
              <span>{language === 'ar' ? 'تكبير الكلمة' : 'Zoom'}</span>
            </button>
          </div>
        </div>

        {/* Speed & Reading Pace Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Target WPM (Words per minute pace) */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-2xl text-xs">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-700">{language === 'ar' ? 'السرعة :' : 'Vitesse :'}</span>
            <select
              value={readingPaceWpm}
              onChange={(e) => {
                setReadingPaceWpm(Number(e.target.value));
                setPlaybackSpeed(Number(e.target.value) / 90);
              }}
              className="bg-transparent font-black text-emerald-800 focus:outline-none cursor-pointer text-xs"
            >
              <option value={45}>45 ك/د (هادئ جداً)</option>
              <option value={60}>60 ك/د (بطيء ومتأنٍ)</option>
              <option value={80}>80 ك/د (طبيعي متوازن)</option>
              <option value={110}>110 ك/د (سريع وطلاقة)</option>
              <option value={140}>140 ك/د (تحدي سريع)</option>
            </select>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSoundEffect('tap');
            }}
            className={`p-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title="تفعيل أو تعطيل صوت النطق الآلي"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? (language === 'ar' ? 'صوت ناطق' : 'Audio On') : (language === 'ar' ? 'صامت (مؤشر فقط)' : 'Silencieux')}</span>
          </button>

          {/* Font scale buttons */}
          <div className="flex items-center bg-slate-100 rounded-2xl p-1 text-xs">
            <button
              onClick={() => setFontSizeIndex((prev) => Math.max(0, prev - 1))}
              className="p-1 text-slate-500 hover:text-slate-900 rounded-xl"
              title="A-"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-black text-amber-700">A</span>
            <button
              onClick={() => setFontSizeIndex((prev) => Math.min(fontSizes.length - 1, prev + 1))}
              className="p-1 text-slate-500 hover:text-slate-900 rounded-xl"
              title="A+"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN INTERACTIVE TELEPROMPTER & TEXT READING STAGE                     */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-50/70 rounded-3xl p-6 sm:p-10 border-3 border-amber-300/90 shadow-xl relative min-h-[320px] flex flex-col justify-between">
        
        {/* Top Status Bar: Current Word Index & Progress */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-amber-100 pb-3 mb-6">
          <div className="flex items-center gap-2 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {language === 'ar'
                ? `الكلمة الحالية: ${currentWordIndex >= 0 ? currentWordIndex + 1 : 0} من ${wordsList.length}`
                : `Mot: ${currentWordIndex >= 0 ? currentWordIndex + 1 : 0} / ${wordsList.length}`}
            </span>
          </div>

          <div className="text-slate-400 font-medium">
            💡 {language === 'ar' ? 'انقر على أي كلمة للاستماع إليها مباشرة' : 'Cliquez sur n’importe quel mot pour l’écouter'}
          </div>
        </div>

        {/* The Text Stage: Words wrapped in spans with dynamic animated markers */}
        <div
          ref={wordsContainerRef}
          dir="rtl"
          className={`font-arabic text-slate-900 text-right tracking-wide select-none ${fontSizes[fontSizeIndex]} max-h-[460px] overflow-y-auto pr-2`}
        >
          {wordsList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-sans text-sm">
              {language === 'ar' ? 'لا يوجد نص حالياً. انقر على "تعديل أو كتابة نص جديد" في الأعلى.' : 'Aucun texte. Cliquez sur "Changer de texte" ci-dessus.'}
            </div>
          ) : (
            wordsList.map((word, index) => {
              const isActive = currentWordIndex === index;
              return (
                <span
                  key={`word-${index}`}
                  id={`studio-word-${index}`}
                  onClick={() => handleWordClick(index)}
                  className={`inline-block mx-1.5 my-1 px-1.5 py-0.5 rounded-xl cursor-pointer transition-all duration-200 relative ${getColorClasses(
                    isActive
                  )} ${!isActive ? 'hover:bg-amber-100 hover:text-amber-900' : ''}`}
                >
                  {/* Floating pointer indicator icon if active */}
                  {isActive && highlightStyle === 'circle' && (
                    <motion.span
                      layoutId="karaoke-pointer"
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-amber-600 select-none pointer-events-none"
                    >
                      👇
                    </motion.span>
                  )}
                  {word}
                </span>
              );
            })
          )}
        </div>

        {/* Bottom Playback Action Bar */}
        <div className="mt-8 pt-6 border-t-2 border-amber-200/80 flex flex-wrap items-center justify-between gap-4">
          
          {/* Main Play / Pause / Reset Buttons */}
          <div className="flex items-center gap-3">
            {!isPlaying ? (
              <button
                onClick={startReading}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{language === 'ar' ? 'بدء القراءة والتتبع ▶️' : 'Démarrer la lecture ▶️'}</span>
              </button>
            ) : (
              <button
                onClick={pauseReading}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-sm sm:text-base shadow-lg shadow-amber-500/30 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Pause className="w-5 h-5 fill-slate-950" />
                <span>{language === 'ar' ? 'إيقاف مؤقت ⏸️' : 'Pause ⏸️'}</span>
              </button>
            )}

            <button
              onClick={resetReading}
              className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors border border-slate-200"
              title="إعادة القراءة من البداية"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Voice Recording Trigger Button */}
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-5 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl text-xs sm:text-sm shadow-md shadow-rose-500/25 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Mic className="w-4 h-4" />
                <span>{language === 'ar' ? 'سجّل صوتك وأنت تقرأ 🎙️' : 'Enregistrer ma voix 🎙️'}</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-5 py-3.5 bg-slate-900 text-rose-400 font-black rounded-2xl text-xs sm:text-sm border-2 border-rose-500 shadow-xl flex items-center gap-2 animate-pulse"
              >
                <Square className="w-4 h-4 fill-rose-500" />
                <span>{language === 'ar' ? `جارٍ التسجيل (${formatTime(recordingTime)}) - انقر للإيقاف` : `Enregistrement (${formatTime(recordingTime)}) - Stop`}</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. USER VOICE RECORDING PLAYBACK & COMPARISON STUDIO                       */}
      {/* ========================================================================= */}
      {recordedAudioUrl && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 sm:p-7 border-2 border-amber-500/40 text-white shadow-2xl space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black shadow-md">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-white text-base">
                  {language === 'ar' ? 'استوديو الاستماع لتسجيلك الصوتي ومقارنة النطق' : 'Votre enregistrement vocal :'}
                </h3>
                <span className="text-xs text-slate-400">
                  {language === 'fr' ? 'Écoutez votre lecture et comparez-la avec la prononciation modèle' : 'استمع لتلاوتك وقراءتك وقارنها بالنطق الفصيح'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={recordedAudioUrl}
                download="my-arabic-reading.webm"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تحميل الصوت' : 'Télécharger'}</span>
              </a>

              <button
                onClick={deleteRecording}
                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                title="Supprimer l'enregistrement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Audio Player Controls */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayUserAudio}
                className={`p-3.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-md ${
                  isPlayingUserAudio
                    ? 'bg-amber-400 text-slate-950 shadow-amber-400/25'
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
                }`}
              >
                {isPlayingUserAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                <span>{isPlayingUserAudio ? (language === 'ar' ? 'إيقاف التسجيل' : 'Pause') : (language === 'ar' ? 'تشغيل تسجيلك 🎧' : 'Écouter mon audio 🎧')}</span>
              </button>
            </div>

            {/* Simulated Animated Waveform Bars */}
            <div className="flex items-center gap-1 flex-1 max-w-xs h-8 px-3">
              {[40, 70, 90, 60, 30, 80, 100, 65, 45, 85, 95, 55, 35, 75, 90, 60].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    isPlayingUserAudio ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
                  }`}
                  style={{ height: isPlayingUserAudio ? `${h}%` : '25%' }}
                />
              ))}
            </div>

            {/* Model Comparison Button */}
            <button
              onClick={() => {
                if (customText.trim()) {
                  speakArabic(customText.trim(), playbackSpeed);
                  playSoundEffect('tap');
                }
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'استمع للنطق النموذجي' : 'Modèle de référence'}</span>
            </button>

          </div>
        </motion.div>
      )}

    </div>
  );
};
