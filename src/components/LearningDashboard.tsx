import React, { useState, useEffect } from 'react';
import { BookOpen, Headphones, Pencil, Gamepad2, ChartNoAxesCombined, ArrowUpLeft, Volume2, Sparkles, MessageCircle, Trophy, Map, Video } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { speakArabic, stopAudio } from '../utils/audio';
import './LearningDashboard.css';

type Action = 'letters' | 'reading' | 'writing' | 'games' | 'assessment' | 'speaking' | 'roadmap' | 'videos';
interface Props { language: SupportedLanguage; onLanguage: (language: SupportedLanguage) => void; onOpen: (action: Action) => void; completed: number; total: number; }
const words = ['بَاب', 'دَار', 'مَاء'];
const normalize = (value: string) => value.normalize('NFC').replace(/[\u064B-\u0652\u0670\u0640]/g, '').trim();
export function LearningDashboard({ language, onLanguage, onOpen, completed, total }: Props) {
  const ar = language === 'ar';
  useEffect(() => () => stopAudio(), []);
  const [dictation, setDictation] = useState(false);
  const [word, setWord] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'retry' | null>(null);
  const [choice, setChoice] = useState<string | null>(null);
  const [heard, setHeard] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const play = (text: string) => { setAudioError(false); void speakArabic(text).catch(() => setAudioError(true)); };
  const open = (action: Action) => { stopAudio(); onOpen(action); };
  const cards = [
    { action: 'letters' as const, ar: 'عالم الحروف', fr: 'Lettres et sons', detail: 'الحركات والمدود والمقاطع', icon: BookOpen, color: 'mint', symbol: 'مَ' },
    { action: null, ar: 'الإملاء المتدرّج', fr: 'Dictée progressive', detail: 'أستمع، أتذكّر، ثم أكتب', icon: Headphones, color: 'peach', symbol: '✎' },
    { action: 'reading' as const, ar: 'أقرأ وأفهم', fr: 'Lecture et compréhension', detail: 'كلمات وقصص صغيرة', icon: BookOpen, color: 'blue', symbol: '📖' },
    { action: 'games' as const, ar: 'ألعاب الحروف', fr: 'Jeux de lettres', detail: 'ألعب وأميّز الأصوات', icon: Gamepad2, color: 'purple', symbol: 'ب ت' },
    { action: 'writing' as const, ar: 'تدريبات الكتابة', fr: 'Atelier d’écriture', detail: 'أتدرّب مع أنشطة الوحدة', icon: Pencil, color: 'pink', symbol: 'مـ' },
    { action: 'assessment' as const, ar: 'تقويمي ودعمي', fr: 'Je me situe', detail: 'أكتشف ما أتقنه', icon: ChartNoAxesCombined, color: 'lime', symbol: '★' },
  ];
  return <div className="eile-home" dir={ar ? 'rtl' : 'ltr'}>
    <header className="eile-header"><div className="eile-brand"><BookOpen size={36}/><span>EILE <b lang="ar">عربي</b><small>Apprendre l’arabe en s’amusant</small></span></div><div className="eile-header-actions"><button onClick={() => onLanguage(ar ? 'fr' : 'ar')} aria-label={ar ? 'Passer en français' : 'التبديل إلى العربية'}>FR <span aria-hidden="true">/</span> العربية</button><button onClick={() => open('roadmap')}><Map size={18}/>{ar ? 'مساري' : 'Mon parcours'}</button></div></header>
    <section className="eile-hero"><div className="eile-hero-copy"><span className="eile-eyebrow"><Sparkles size={16}/> {ar ? 'كل يوم، اكتشاف جديد' : 'UN PETIT PAS, UNE GRANDE DÉCOUVERTE'}</span><h1 lang="ar" dir="rtl">هيا نتعلّم <em>العربية!</em></h1><p>{ar ? 'أستمع، أتحدث، أقرأ وأكتب. مغامرتي تبدأ هنا!' : 'J’écoute, je parle, je lis et j’écris. À moi de jouer !'}</p><button className="eile-primary" onClick={() => open('roadmap')}>{ar ? 'هيا نبدأ' : 'C’est parti !'} <ArrowUpLeft size={20}/></button></div><div className="eile-letter-garden" aria-hidden="true"><span className="garden-star">✦</span><span className="letter-tile tile-m">م</span><span className="letter-tile tile-b">ب</span><span className="letter-tile tile-a">أ</span><span className="garden-caption">أهلاً وسهلاً</span><span className="garden-dot">✦</span></div></section>
    <nav className="eile-skills" aria-label={ar ? 'مهاراتي' : 'Mes ateliers'}>{[
      { icon: Headphones, ar: 'أستمع', fr: 'J’écoute', action: 'games' as const },
      { icon: MessageCircle, ar: 'أتحدث', fr: 'Je parle', action: 'speaking' as const },
      { icon: BookOpen, ar: 'أقرأ', fr: 'Je lis', action: 'reading' as const },
      { icon: Pencil, ar: 'أكتب', fr: 'J’écris', action: 'writing' as const },
      { icon: Gamepad2, ar: 'ألعب', fr: 'Je joue', action: 'games' as const },
    ].map(({icon: Icon, ...item}) => <button key={item.action + item.fr} onClick={() => open(item.action)}><Icon/><span>{ar ? item.ar : item.fr}</span></button>)}</nav>
    <div className="eile-section-heading"><div><span className="eile-eyebrow">{ar ? 'أختار نشاطي' : 'À CHACUN SON AVENTURE'}</span><h2>{ar ? 'ماذا سنتعلّم اليوم؟' : 'Que veux-tu découvrir ?'}</h2></div><span className="eile-level">A1 · {ar ? 'خطوة بخطوة' : 'Pas à pas'}</span></div>
    <section className="eile-card-grid" aria-label={ar ? 'الأنشطة' : 'Activités'}>{cards.map(card => <button key={card.ar} className={`eile-card ${card.color}`} onClick={() => { if (card.action) open(card.action); else { setDictation(v => !v); setFeedback(null); } }} aria-expanded={card.action === null ? dictation : undefined}><div className="eile-card-top"><card.icon size={22}/><ArrowUpLeft size={20}/></div><span className="eile-card-art" aria-hidden="true">{card.symbol}</span><h3 lang="ar" dir="rtl">{card.ar}</h3><p lang="fr">{card.fr}</p><small lang="ar" dir="rtl">{card.detail}</small></button>)}</section>
    {dictation && <section className="eile-practice" aria-label={ar ? 'تدريب الإملاء' : 'Dictée'}><div><span className="eile-eyebrow">{ar ? 'الإملاء · كلمات قصيرة' : 'DICTÉE · MOTS COURTS'}</span><h2>{ar ? 'أستمع ثم أكتب' : 'Écoute, puis écris'}</h2><p>{ar ? 'يمكنك كتابة الكلمة دون حركات.' : 'Tu peux écrire le mot sans les voyelles.'}</p></div><button className="eile-audio" aria-label={ar ? 'استمع إلى الكلمة' : 'Écouter le mot'} onClick={() => play(words[word])}><Volume2/></button><form onSubmit={e => { e.preventDefault(); setFeedback(normalize(answer) === normalize(words[word]) ? 'correct' : 'retry'); }}><label htmlFor="eile-dictation">{ar ? 'الكلمة التي سمعتها' : 'Le mot que tu as entendu'}</label><div className="eile-answer-row"><input id="eile-dictation" value={answer} onChange={e => { setAnswer(e.target.value); setFeedback(null); }} dir="rtl" lang="ar" autoComplete="off"/><button className="eile-primary" type="submit">{ar ? 'تحقّق' : 'Vérifier'}</button></div><p role="status">{feedback === 'correct' ? (ar ? 'أحسنت! إجابة صحيحة.' : 'Bravo ! Bonne réponse.') : feedback === 'retry' ? (ar ? 'استمع مرة أخرى وحاول من جديد.' : 'Écoute encore et réessaie.') : ''}</p>{feedback === 'correct' && <button type="button" className="eile-text-button" onClick={() => { setWord(i => (i + 1) % words.length); setAnswer(''); setFeedback(null); }}>{ar ? 'الكلمة التالية ←' : 'Mot suivant →'}</button>}</form></section>}
    <section className="eile-bottom"><div className="eile-challenge"><span className="eile-eyebrow"><Trophy size={16}/> {ar ? 'تحدّي الاستماع' : 'LE DÉFI DES SONS'}</span><h2>{ar ? 'استمع واختر المقطع الصحيح' : 'Écoute et choisis le bon son'}</h2><div className="eile-challenge-options"><button className="eile-audio" aria-label={ar ? 'استمع إلى المقطع' : 'Écouter le son'} onClick={() => { play('مُ'); setHeard(true); }}><Volume2/></button>{['مَ', 'مُ', 'مِ'].map(s => <button className={`eile-syllable ${choice === s ? (s === 'مُ' ? 'correct' : 'retry') : ''}`} key={s} disabled={!heard} aria-pressed={choice === s} onClick={() => setChoice(s)} lang="ar">{s}</button>)}</div><p className="eile-feedback" role="status">{!heard ? (ar ? 'اضغط على الصوت أولاً.' : 'Appuie d’abord sur le haut-parleur.') : choice ? (choice === 'مُ' ? (ar ? 'رائع! هذه ميم بالضمة.' : 'Bravo ! C’est le mīm avec une damma.') : (ar ? 'حاول مرة أخرى، أنت تستطيع!' : 'Essaie encore, tu peux y arriver !')) : (ar ? 'الآن اختر المقطع.' : 'À toi de choisir !')}</p></div><div className="eile-progress"><span className="eile-eyebrow">{ar ? 'رحلتي' : 'MON PARCOURS'}</span><h2>{ar ? 'كل خطوة تُحتسب' : 'Chaque pas compte'}</h2><p><strong>{completed}</strong> / {total} {ar ? 'وحدات مكتملة' : 'unités terminées'}</p><progress value={completed} max={Math.max(total, 1)} aria-label={ar ? 'الوحدات المكتملة' : 'Unités terminées'}/><button className="eile-text-button" onClick={() => open('roadmap')}>{ar ? 'عرض المسار' : 'Voir mon parcours'} <ArrowUpLeft size={18}/></button><button className="eile-video-link" onClick={() => open('videos')}><Video size={18}/>{ar ? 'مكتبة الفيديو' : 'La médiathèque'}</button></div></section>
    {audioError && <p role="alert">{ar ? 'تعذّر تشغيل الصوت. حاول مرة أخرى.' : 'Le son est indisponible. Réessaie.'}</p>}
    <footer className="eile-home-footer">EILE عربي <span>•</span> {ar ? 'نتعلّم بفرح، ونتقدّم بثقة' : 'Le plaisir d’apprendre, la confiance de grandir'}</footer>
  </div>;
}
