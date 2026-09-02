import React, { useState } from 'react';
import { CEFRLevel } from '../types';
import { Award, X, Printer, Download, Sparkles, CheckCircle2 } from 'lucide-react';

interface CertificateProps {
  isOpen: boolean;
  onClose: () => void;
  level: CEFRLevel;
  xp: number;
  language: 'en' | 'fr' | 'ar';
}

export const CertificateModal: React.FC<CertificateProps> = ({
  isOpen,
  onClose,
  level,
  xp,
  language,
}) => {
  const [studentName, setStudentName] = useState('Said Kolchi');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const levelTitles: Record<CEFRLevel, { ar: string; en: string; fr: string }> = {
    A1: { ar: 'المبتدئ الاستكشافي (A1)', en: 'Discovery Arabic (CEFR A1)', fr: 'Niveau Découverte (CEFR A1)' },
    A2: { ar: 'الأساسي التواصلي (A2)', en: 'Elementary Arabic (CEFR A2)', fr: 'Niveau Élémentaire (CEFR A2)' },
    B1: { ar: 'المستقل التطبيقي (B1)', en: 'Intermediate Arabic (CEFR B1)', fr: 'Niveau Intermédiaire (CEFR B1)' },
    B2: { ar: 'المتمكن الحواري (B2)', en: 'Upper-Intermediate Arabic (CEFR B2)', fr: 'Niveau Avancé B2' },
    C1: { ar: 'المتقدم الأكاديمي (C1)', en: 'Effective Proficiency (CEFR C1)', fr: 'Niveau Autonome C1' },
    C2: { ar: 'الإتقان والطلاقة الفصيحة (C2)', en: 'Arabic Mastery (CEFR C2)', fr: 'Niveau Maîtrise C2' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-amber-200/80 max-h-[95vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100 mb-4 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 border border-amber-300/80 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              {language === 'ar' ? 'شهادة إتمام المستوى والكفاءة' : language === 'fr' ? 'Certificat de Réussite CEFR' : 'CEFR Arabic Achievement Certificate'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-amber-100/50 rounded-2xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Name Control */}
        <div className="mb-4 flex items-center gap-2 print:hidden bg-amber-50/80 p-3 rounded-2xl border border-amber-200/80">
          <span className="text-xs font-bold text-amber-950">
            {language === 'fr' ? 'Nom sur le certificat :' : language === 'ar' ? 'اسم المتعلم على الشهادة:' : 'Name on Certificate:'}
          </span>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Certificate Decorative Canvas */}
        <div
          id="certificate-printable"
          className="relative bg-gradient-to-br from-amber-50/90 via-white to-amber-100/50 border-8 border-double border-amber-600/50 p-6 sm:p-10 rounded-3xl text-center shadow-inner"
        >
          {/* Corner Calligraphic Accents */}
          <div className="absolute top-3 left-3 text-amber-600 text-2xl select-none opacity-40 font-serif">✦</div>
          <div className="absolute top-3 right-3 text-amber-600 text-2xl select-none opacity-40 font-serif">✦</div>
          <div className="absolute bottom-3 left-3 text-amber-600 text-2xl select-none opacity-40 font-serif">✦</div>
          <div className="absolute bottom-3 right-3 text-amber-600 text-2xl select-none opacity-40 font-serif">✦</div>

          {/* Crest */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-emerald-600 to-teal-700 text-white flex items-center justify-center mx-auto shadow-md mb-3">
            <span className="font-serif text-3xl font-bold">ض</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-wide">
            شَهَادَةُ كَفَاءَةٍ لُغَوِيَّة
          </h2>
          <p className="text-xs tracking-widest uppercase font-extrabold text-amber-900 mt-1">
            Certificate of Arabic Language Competence
          </p>

          <div className="my-6">
            <p className="text-xs text-slate-600 italic font-medium">
              This is proudly presented to certify that
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-emerald-950 border-b-2 border-dashed border-amber-400 pb-1 max-w-sm mx-auto mt-1">
              {studentName || 'Learner'}
            </h1>
          </div>

          <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed font-medium">
            has demonstrated competence in Arabic Oral Interaction, Listening Comprehension, Reading, and Calligraphy at level:
          </p>

          <div className="my-4 inline-block bg-white px-6 py-2.5 rounded-2xl border border-amber-300 shadow-xs">
            <span className="font-serif text-xl sm:text-2xl font-extrabold text-amber-950">
              {levelTitles[level].ar}
            </span>
            <span className="text-[11px] text-slate-600 font-semibold block">
              {levelTitles[level].en}
            </span>
          </div>

          {/* Footer Seals & Date */}
          <div className="mt-6 pt-4 border-t border-amber-200/80 flex items-center justify-between text-xs text-slate-600 px-4">
            <div className="text-left">
              <span className="block font-bold text-slate-900">ELCO & CEFR Framework</span>
              <span className="text-[10px]">Academic Standard</span>
            </div>

            <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center text-amber-800 text-[10px] font-extrabold">
              SEAL
            </div>

            <div className="text-right">
              <span className="block font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
              <span className="text-[10px]">Total XP: {xp}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl border border-amber-200/80 bg-amber-50/50 hover:bg-amber-100/60 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'fr' ? 'Imprimer la certification' : language === 'ar' ? 'طباعة الشهادة' : 'Print Certificate'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
          >
            {language === 'fr' ? 'Fermer' : language === 'ar' ? 'إغلاق' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
