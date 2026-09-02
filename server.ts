import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// 1. AI Interactive Arabic Tutor & Roleplay Endpoint
app.post('/api/tutor-chat', async (req: Request, res: Response) => {
  const { message, level = 'A1', topic = 'general', userLanguage = 'en', history = [] } = req.body;

  const ai = getAI();
  if (!ai) {
    // Elegant pedagogical fallback when API key is configuring
    const fallbacks: Record<string, string> = {
      A1: `مَرْحَبًا بِكَ! (Marhaban bika! - Welcome!)
أَنَا أُسْتَاذُكَ فَصِيح. أَنَا هُنَا لِمُسَاعَدَتِكَ فِي تَعَلُّمِ العَرَبِيَّةِ خُطْوَةً بِخُطْوَة.
👉 Translation: Welcome! I am your tutor Faseeh. I am here to help you learn Arabic step by step!
💡 Try saying: "كَيْفَ حَالُكَ؟" (Kayfa haluka? - How are you?)`,
      A2: `أَهْلًا وَسَهْلًا! أَنَا سَعِيدٌ بِلِقَائِكَ.
هَلْ تُرِيدُ أَنْ نَتَدَرَّبَ عَلَى طَلَبِ الطَّعَامِ فِي المَطْعَمِ أَمِ التَّسَوُّقِ فِي السُّوقِ؟
👉 Translation: Welcome! I am happy to meet you. Would you like to practice ordering in a restaurant or shopping in the traditional market?`,
      B1: `مَسَاءُ الخَيْرِ يَا صَدِيقِي. فِي مُسْتَوَى B1، سَنَتَحَدَّثُ عَنْ خُطَطِ العُطْلَةِ، وَتَجَارِبِ السَّفَرِ، وَالعَادَاتِ التَّقْلِيدِيَّةِ. مَا هُوَ مَوْضُوعُكَ المُفَضَّلُ اليَوْم؟`,
      B2: `أَهْلًا بِكَ. فِي هَذَا المُسْتَوَى المُمَيَّزِ نُنَاقِشُ مَقَالَاتٍ ثَقَافِيَّةً وَنَقَارِنُ بَيْنَ اللَّهَجَاتِ العَرَبِيَّةِ وَالفُصْحَى. هَلْ جَرَّبْتَ سَمَاعَ أَيِّ لَهْجَةٍ عَرَبِيَّةٍ مِنْ قَبْل؟`,
      C1: `أَهْلًا بِرَائِدِ الفَصَاحَةِ! فِي المُسْتَوَى الأَكَادِيمِيِّ C1 نُحَلِّلُ النُّصُوصَ الأَدَبِيَّةَ وَنَسْتَعْرِضُ أَسَالِيبَ البَلَاغَةِ وَالخِطَابَة. مَا هُوَ النَّصُّ الَّذِي تَرْغَبُ فِي سَبْرِ أَغْوَارِهِ؟`,
      C2: `طَابَ مَقَامُكَ فِي رِحَابِ لُغَةِ الضَّاد! هُنَا فِي ذُرْوَةِ البَلَاغَةِ وَالبَيَان، نَخُوضُ فِي أَعْمَاقِ الشِّعْرِ الجَاهِلِيِّ وَالحَدِيث، وَفُنُونِ الإِعْرَابِ وَالتَّرَاكِيبِ النَّادِرَة.`,
    };

    return res.json({
      reply: fallbacks[level] || fallbacks.A1,
      pronunciationTips: 'Try practicing with short vowels (Fatha, Kasra, Damma) to build accurate pronunciation.',
      vocabularyUsed: [
        { arabic: 'مَرْحَبًا', transliteration: 'Marhaban', meaning: 'Hello / Welcome' },
        { arabic: 'أَهْلًا وَسَهْلًا', transliteration: 'Ahlan wa Sahlan', meaning: 'Welcome' },
        { arabic: 'كَيْفَ حَالُك؟', transliteration: 'Kayfa haluk?', meaning: 'How are you?' }
      ]
    });
  }

  try {
    const systemPrompt = `You are "فصيح (Faseeh)", an exceptionally friendly, encouraging, and pedagogical Arabic teacher specialized in teaching Arabic to foreign non-native speakers according to the CEFR standard (A1 to C2).
Current Target Learner Level: ${level} (CEFR).
Current Context / Topic: ${topic}.
Learner's native explanation language: ${userLanguage} (e.g. English, French, etc.).

Pedagogical Guidelines:
1. Always write Arabic text with FULL Tashkeel (diacritics: Fatha, Damma, Kasra, Sukun, Shaddah) so foreign students can read and pronounce properly.
2. For levels A1 and A2, always provide Latin transliteration (Romanization e.g., "Kayfa haluka?") and the translation in ${userLanguage}.
3. For B1-B2, mix Arabic immersion with concise explanations of idioms and grammar in ${userLanguage}.
4. For C1-C2, use rich, authentic, expressive classical Arabic (Fusha) with rhetorical insights (Balagha/I'rab).
5. If the user made a grammar or spelling mistake in their message, gently praise their effort first, then explain the correction clearly.
6. Provide your final response in valid JSON matching this schema:
{
  "reply": "Your main conversational reply with full vocalization/tashkeel, transliteration (if A1-B1) and translation",
  "feedback": "Friendly correction or encouragement regarding learner's Arabic, if applicable",
  "vocabulary": [
    {"arabic": "الكلمة", "transliteration": "alkalima", "meaning": "English/French meaning"}
  ],
  "suggestedReplies": ["Next phrase 1 in Arabic with tashkeel", "Next phrase 2 in Arabic with tashkeel"]
}`;

    const promptText = `Student's message: "${message}". Context: User is practicing Arabic at level ${level}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/tutor-chat:', error);
    return res.status(500).json({ error: error.message || 'Failed to process AI tutor request' });
  }
});

// 2. AI Sentence Analyzer & Grammar / Tashkeel Helper
app.post('/api/analyze-arabic', async (req: Request, res: Response) => {
  const { sentence, targetLevel = 'A1' } = req.body;

  if (!sentence || typeof sentence !== 'string') {
    return res.status(400).json({ error: 'Sentence is required' });
  }

  const ai = getAI();
  if (!ai) {
    return res.json({
      original: sentence,
      tashkeel: sentence,
      transliteration: 'Sentence transliteration',
      translation: 'English translation of the input phrase',
      grammarBreakdown: [
        { word: sentence.split(' ')[0] || 'كَلِمَة', pos: 'Noun / Verb', meaning: 'Meaning', explanation: 'Grammar role' }
      ],
      tips: 'Ensure correct vowel endings based on sentence structure (Marfoo, Mansoob, Majroor).'
    });
  }

  try {
    const systemPrompt = `You are an expert Arabic linguist and teacher for non-native learners.
Analyze the given Arabic phrase or word provided by the user.
Provide full accurate vocalization (تشكيل كامل), phonetic transliteration, grammatical role breakdown (مبتدأ، خبر، فاعل، مفعول به، اسم مجرور...), root extraction (الجذر اللغوي), and helpful non-native learner tips.
Output MUST be strictly valid JSON in this schema:
{
  "original": "original text",
  "tashkeel": "vocalized Arabic text with complete harakat",
  "transliteration": "phonetic romanization",
  "translation": "clear English translation",
  "root": "3-letter root (e.g., ك-ت-ب)",
  "cefrLevel": "Estimated CEFR level (A1, A2, B1, B2, C1, C2)",
  "breakdown": [
    {"token": "Arabic word", "vocalized": "vocalized", "type": "Noun/Verb/Particle", "irab": "Grammar role simplified for students", "meaning": "English meaning"}
  ],
  "commonMistakes": "Tips to avoid common non-native mistakes with this phrase",
  "culturalNote": "Any relevant cultural or dialect context"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Analyze this Arabic text for a learner: "${sentence}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-arabic:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze Arabic' });
  }
});

// 3. AI Custom Practice & Story Generator for any CEFR level
app.post('/api/generate-practice', async (req: Request, res: Response) => {
  const { level = 'A1', theme = 'culture', type = 'story' } = req.body;

  const ai = getAI();
  if (!ai) {
    return res.json({
      title: 'رِحْلَةٌ إِلَى المَدِينَةِ المُنَوَّرَة (A Journey to the Illuminated City)',
      arabicText: 'سَافَرَ سَامِي مَعَ عَائِلَتِهِ إِلَى المَدِينَةِ. زَارَ المَسْجِدَ النَّبَوِيَّ وَتَنَاوَلَ التَّمْرَ اللَّذِيذ. كَانَ الجَوُّ لَطِيفًا وَالنَّاسُ كُرَمَاء.',
      translation: 'Sami traveled with his family to Medina. He visited the Prophet\'s Mosque and tasted delicious dates. The weather was pleasant and the people were generous.',
      vocabulary: [
        { arabic: 'سَافَرَ', meaning: 'Traveled', transliteration: 'Safara' },
        { arabic: 'عَائِلَة', meaning: 'Family', transliteration: 'A\'ilah' },
        { arabic: 'تَمْر', meaning: 'Dates (fruit)', transliteration: 'Tamr' },
        { arabic: 'كُرَمَاء', meaning: 'Generous (plural)', transliteration: 'Kurama\'' }
      ],
      questions: [
        {
          question: 'مَعَ مَنْ سَافَرَ سَامِي؟ (With whom did Sami travel?)',
          options: ['مَعَ أَصْدِقَائِهِ (With his friends)', 'مَعَ عَائِلَتِهِ (With his family)', 'بِمُفْرَدِهِ (Alone)'],
          correctAnswerIndex: 1,
          explanation: 'النص يذكر: "سَافَرَ سَامِي مَعَ عَائِلَتِهِ"'
        }
      ]
    });
  }

  try {
    const prompt = `Generate an engaging interactive Arabic learning unit suited for CEFR level ${level} on the theme "${theme}".
If level is A1: Focus on short sentences, high-frequency daily vocabulary, self/family/places, complete Tashkeel, phonetics.
If level is A2: Daily routines, travel, directions, shopping, simple past/present verbs.
If level is B1: Personal anecdotes, hobbies, cultural customs, compound sentences.
If level is B2: Opinions, news summary, social traditions, media analysis.
If level is C1: Literary prose, historical excerpts, nuanced rhetoric, debates.
If level is C2: Classical literature, poetic metaphors, complex philosophical/linguistic mastery.

Output MUST be strictly JSON format matching this schema:
{
  "title": "Arabic Title with Tashkeel (English translation)",
  "arabicText": "Engaging reading passage fully vocalized with tashkeel appropriate for the selected CEFR level",
  "translation": "Full English translation",
  "transliteration": "Transliteration for A1-A2",
  "vocabulary": [
    {"arabic": "الكلمة مع التشكيل", "transliteration": "phonetic", "meaning": "English meaning"}
  ],
  "grammarFocus": {
    "ruleName": "Name of the grammar concept (e.g. النعت والمنعوت / الجملة الاسمية)",
    "explanation": "Clear explanation for foreign students",
    "example": "Example from the passage"
  },
  "questions": [
    {
      "question": "Arabic question with tashkeel and English subtitle",
      "options": ["Option 1 in Arabic", "Option 2 in Arabic", "Option 3 in Arabic"],
      "correctAnswerIndex": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/generate-practice:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate practice' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Faseeh Arabic Learning Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
