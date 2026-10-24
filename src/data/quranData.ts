import { QuranReciter, QuranSurahMeta, QuranAyah } from '../types/index.ts';

export const FAMOUS_QURA: QuranReciter[] = [
  {
    id: 'alafasy',
    name: 'Sheikh Mishary Rashid Alafasy',
    arabicName: 'مشاري بن راشد العفاسي',
    country: 'Kuwait 🇰🇼',
    serverUrl: 'https://server8.mp3quran.net/afs/',
    fallbackServerUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/',
    ayahReciterId: 'ar.alafasy',
    styleDescription: 'Clear, melodious & universally loved worldwide',
  },
  {
    id: 'abdulbasit',
    name: 'Sheikh Abdul Basit Abdul Samad',
    arabicName: 'عبد الباسط عبد الصمد (مرتل)',
    country: 'Egypt 🇪🇬',
    serverUrl: 'https://server7.mp3quran.net/basit/',
    fallbackServerUrl: 'https://download.quranicaudio.com/quran/abdul_baasit_murattal/',
    ayahReciterId: 'ar.abdulbasitmurattal',
    styleDescription: 'Legendary, traditional Egyptian Murattal',
  },
  {
    id: 'maher',
    name: 'Sheikh Maher Al-Muaiqly',
    arabicName: 'ماهر بن حمد المعيقلي (إمام الحرم)',
    country: 'Makkah 🇸🇦',
    serverUrl: 'https://server12.mp3quran.net/maher/',
    fallbackServerUrl: 'https://download.quranicaudio.com/quran/maher_almu3aiqly/year1440/',
    ayahReciterId: 'ar.mahermuaiqly',
    styleDescription: 'Imam of Masjid al-Haram, deeply resonant and soothing',
  },
  {
    id: 'sudais',
    name: 'Sheikh Abdur-Rahman As-Sudais',
    arabicName: 'عبد الرحمن السديس (إمام الحرم)',
    country: 'Makkah 🇸🇦',
    serverUrl: 'https://server11.mp3quran.net/sds/',
    fallbackServerUrl: 'https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays/',
    ayahReciterId: 'ar.abdurrahmaansudais',
    styleDescription: 'Chief Imam of Kaaba, fast-paced and iconic emotional tone',
  },
  {
    id: 'shuraim',
    name: 'Sheikh Saud Al-Shuraim',
    arabicName: 'سعود بن إبراهيم الشريم',
    country: 'Makkah 🇸🇦',
    serverUrl: 'https://server7.mp3quran.net/shur/',
    fallbackServerUrl: 'https://download.quranicaudio.com/quran/sa3ood_al-shuraym/',
    ayahReciterId: 'ar.shuraym',
    styleDescription: 'Former Imam of Kaaba, rhythmic and commanding',
  },
  {
    id: 'minshawi',
    name: 'Sheikh Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي (مرتل)',
    country: 'Egypt 🇪🇬',
    serverUrl: 'https://server10.mp3quran.net/minsh/',
    fallbackServerUrl: 'https://download.quranicaudio.com/quran/muhammad_siddeeq_al-minshaawee/',
    ayahReciterId: 'ar.minshawi',
    styleDescription: 'Deeply sorrowful, profound spiritual impact',
  },
  {
    id: 'husary',
    name: 'Sheikh Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري (مرتل)',
    country: 'Egypt 🇪🇬',
    serverUrl: 'https://server13.mp3quran.net/husary/',
    fallbackServerUrl: 'https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree_iza3ah/',
    ayahReciterId: 'ar.husary',
    styleDescription: 'Gold standard master of Tajweed and precision',
  },
  {
    id: 'ghamdi',
    name: 'Sheikh Saad Al-Ghamdi',
    arabicName: 'سعد بن سعيد الغامدي',
    country: 'Saudi Arabia 🇸🇦',
    serverUrl: 'https://server7.mp3quran.net/ghamdi/',
    fallbackServerUrl: 'https://download.quranicaudio.com/quran/sa3d_al-ghaamidi/complete/',
    ayahReciterId: 'ar.saadghamidi',
    styleDescription: 'Gentle, heartwarming and easily memorable',
  },
  {
    id: 'yasser',
    name: 'Sheikh Yasser Al-Dosari',
    arabicName: 'ياسر بن راشد الدوسري (إمام الحرم)',
    country: 'Makkah 🇸🇦',
    serverUrl: 'https://server11.mp3quran.net/yasser/',
    fallbackServerUrl: 'https://download.quranicaudio.com/quran/yasser_ad-dussary/',
    ayahReciterId: 'ar.yasserdossari',
    styleDescription: 'Imam of Kaaba, vibrant, powerful and inspiring',
  },
  {
    id: 'shatri',
    name: 'Sheikh Abu Bakr Al-Shatri',
    arabicName: 'أبو بكر الشاطري',
    country: 'Saudi Arabia 🇸🇦',
    serverUrl: 'https://server11.mp3quran.net/shatri/',
    fallbackServerUrl: 'https://download.quranicaudio.com/quran/abu_bakr_ash-shaatree/',
    ayahReciterId: 'ar.shaatree',
    styleDescription: 'Smooth, beautiful cadence loved by youth',
  },
];

export function getSurahAudioUrl(surahNumber: number, reciter: QuranReciter): string {
  const pad = String(surahNumber).padStart(3, '0');
  return `${reciter.serverUrl}${pad}.mp3`;
}

export function formatSurahDurationEstimate(numberOfAyahs: number): string {
  const estMinutes = Math.max(1, Math.round(numberOfAyahs * 0.35));
  if (estMinutes >= 60) {
    const hours = Math.floor(estMinutes / 60);
    const mins = estMinutes % 60;
    return `${hours}h ${mins}m`;
  }
  return `~${estMinutes} min`;
}

/**
 * All 114 Surahs of the Holy Quran with metadata
 */
export const ALL_114_SURAHS: QuranSurahMeta[] = [
  { number: 1, nameArabic: 'الفاتحة', nameEnglish: 'Al-Fatihah', englishTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan', urduName: 'الفاتحہ', juzStart: 1 },
  { number: 2, nameArabic: 'البقرة', nameEnglish: 'Al-Baqarah', englishTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan', urduName: 'البقرہ', juzStart: 1 },
  { number: 3, nameArabic: 'آل عمران', nameEnglish: 'Ali \'Imran', englishTranslation: 'Family of Imran', numberOfAyahs: 200, revelationType: 'Medinan', urduName: 'آل عمران', juzStart: 3 },
  { number: 4, nameArabic: 'النساء', nameEnglish: 'An-Nisa', englishTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'Medinan', urduName: 'النساء', juzStart: 4 },
  { number: 5, nameArabic: 'المائدة', nameEnglish: 'Al-Ma\'idah', englishTranslation: 'The Table Spread', numberOfAyahs: 120, revelationType: 'Medinan', urduName: 'المائدہ', juzStart: 6 },
  { number: 6, nameArabic: 'الأنعام', nameEnglish: 'Al-An\'am', englishTranslation: 'The Cattle', numberOfAyahs: 165, revelationType: 'Meccan', urduName: 'الانعام', juzStart: 7 },
  { number: 7, nameArabic: 'الأعراف', nameEnglish: 'Al-A\'raf', englishTranslation: 'The Heights', numberOfAyahs: 206, revelationType: 'Meccan', urduName: 'الاعراف', juzStart: 8 },
  { number: 8, nameArabic: 'الأنفال', nameEnglish: 'Al-Anfal', englishTranslation: 'The Spoils of War', numberOfAyahs: 75, revelationType: 'Medinan', urduName: 'الانفال', juzStart: 9 },
  { number: 9, nameArabic: 'التوبة', nameEnglish: 'At-Tawbah', englishTranslation: 'The Repentance', numberOfAyahs: 129, revelationType: 'Medinan', urduName: 'التوبہ', juzStart: 10 },
  { number: 10, nameArabic: 'يونس', nameEnglish: 'Yunus', englishTranslation: 'Jonah', numberOfAyahs: 109, revelationType: 'Meccan', urduName: 'یونس', juzStart: 11 },
  { number: 11, nameArabic: 'هود', nameEnglish: 'Hud', englishTranslation: 'Hud', numberOfAyahs: 123, revelationType: 'Meccan', urduName: 'ہود', juzStart: 11 },
  { number: 12, nameArabic: 'يوسف', nameEnglish: 'Yusuf', englishTranslation: 'Joseph', numberOfAyahs: 111, revelationType: 'Meccan', urduName: 'یوسف', juzStart: 12 },
  { number: 13, nameArabic: 'الرعد', nameEnglish: 'Ar-Ra\'d', englishTranslation: 'The Thunder', numberOfAyahs: 43, revelationType: 'Medinan', urduName: 'الرعد', juzStart: 13 },
  { number: 14, nameArabic: 'إبراهيم', nameEnglish: 'Ibrahim', englishTranslation: 'Abraham', numberOfAyahs: 52, revelationType: 'Meccan', urduName: 'ابراہیم', juzStart: 13 },
  { number: 15, nameArabic: 'الحجر', nameEnglish: 'Al-Hijr', englishTranslation: 'The Rocky Tract', numberOfAyahs: 99, revelationType: 'Meccan', urduName: 'الحجر', juzStart: 14 },
  { number: 16, nameArabic: 'النحل', nameEnglish: 'An-Nahl', englishTranslation: 'The Bee', numberOfAyahs: 128, revelationType: 'Meccan', urduName: 'النحل', juzStart: 14 },
  { number: 17, nameArabic: 'الإسراء', nameEnglish: 'Al-Isra', englishTranslation: 'The Night Journey', numberOfAyahs: 111, revelationType: 'Meccan', urduName: 'بنی اسرائیل', juzStart: 15 },
  { number: 18, nameArabic: 'الكهف', nameEnglish: 'Al-Kahf', englishTranslation: 'The Cave', numberOfAyahs: 110, revelationType: 'Meccan', urduName: 'الکہف', juzStart: 15 },
  { number: 19, nameArabic: 'مريم', nameEnglish: 'Maryam', englishTranslation: 'Mary', numberOfAyahs: 98, revelationType: 'Meccan', urduName: 'مریم', juzStart: 16 },
  { number: 20, nameArabic: 'طه', nameEnglish: 'Taha', englishTranslation: 'Ta-Ha', numberOfAyahs: 135, revelationType: 'Meccan', urduName: 'طٰہٰ', juzStart: 16 },
  { number: 21, nameArabic: 'الأنبياء', nameEnglish: 'Al-Anbiya', englishTranslation: 'The Prophets', numberOfAyahs: 112, revelationType: 'Meccan', urduName: 'الانبیاء', juzStart: 17 },
  { number: 22, nameArabic: 'الحج', nameEnglish: 'Al-Hajj', englishTranslation: 'The Pilgrimage', numberOfAyahs: 78, revelationType: 'Medinan', urduName: 'الحج', juzStart: 17 },
  { number: 23, nameArabic: 'المؤمنون', nameEnglish: 'Al-Mu\'minun', englishTranslation: 'The Believers', numberOfAyahs: 118, revelationType: 'Meccan', urduName: 'المؤمنون', juzStart: 18 },
  { number: 24, nameArabic: 'النور', nameEnglish: 'An-Nur', englishTranslation: 'The Light', numberOfAyahs: 64, revelationType: 'Medinan', urduName: 'النور', juzStart: 18 },
  { number: 25, nameArabic: 'الفرقان', nameEnglish: 'Al-Furqan', englishTranslation: 'The Criterion', numberOfAyahs: 77, revelationType: 'Meccan', urduName: 'الفرقان', juzStart: 18 },
  { number: 26, nameArabic: 'الشعراء', nameEnglish: 'Ash-Shu\'ara', englishTranslation: 'The Poets', numberOfAyahs: 227, revelationType: 'Meccan', urduName: 'الشعراء', juzStart: 19 },
  { number: 27, nameArabic: 'النمل', nameEnglish: 'An-Naml', englishTranslation: 'The Ant', numberOfAyahs: 93, revelationType: 'Meccan', urduName: 'النمل', juzStart: 19 },
  { number: 28, nameArabic: 'القصص', nameEnglish: 'Al-Qasas', englishTranslation: 'The Stories', numberOfAyahs: 88, revelationType: 'Meccan', urduName: 'القصص', juzStart: 20 },
  { number: 29, nameArabic: 'العنكبوت', nameEnglish: 'Al-\'Ankabut', englishTranslation: 'The Spider', numberOfAyahs: 69, revelationType: 'Meccan', urduName: 'العنکبوت', juzStart: 20 },
  { number: 30, nameArabic: 'الروم', nameEnglish: 'Ar-Rum', englishTranslation: 'The Romans', numberOfAyahs: 60, revelationType: 'Meccan', urduName: 'الروم', juzStart: 21 },
  { number: 31, nameArabic: 'لقمان', nameEnglish: 'Luqman', englishTranslation: 'Luqman', numberOfAyahs: 34, revelationType: 'Meccan', urduName: 'لقمان', juzStart: 21 },
  { number: 32, nameArabic: 'السجدة', nameEnglish: 'As-Sajdah', englishTranslation: 'The Prostration', numberOfAyahs: 30, revelationType: 'Meccan', urduName: 'السجدہ', juzStart: 21 },
  { number: 33, nameArabic: 'الأحزاب', nameEnglish: 'Al-Ahzab', englishTranslation: 'The Combined Forces', numberOfAyahs: 73, revelationType: 'Medinan', urduName: 'الاحزاب', juzStart: 21 },
  { number: 34, nameArabic: 'سبإ', nameEnglish: 'Saba', englishTranslation: 'Sheba', numberOfAyahs: 54, revelationType: 'Meccan', urduName: 'سبا', juzStart: 22 },
  { number: 35, nameArabic: 'فاطر', nameEnglish: 'Fatir', englishTranslation: 'Originator', numberOfAyahs: 45, revelationType: 'Meccan', urduName: 'فاطر', juzStart: 22 },
  { number: 36, nameArabic: 'يس', nameEnglish: 'Ya-Sin', englishTranslation: 'Ya Sin (Heart of Quran)', numberOfAyahs: 83, revelationType: 'Meccan', urduName: 'یٰسین', juzStart: 22 },
  { number: 37, nameArabic: 'الصافات', nameEnglish: 'As-Saffat', englishTranslation: 'Those who set the Ranks', numberOfAyahs: 182, revelationType: 'Meccan', urduName: 'الصافات', juzStart: 23 },
  { number: 38, nameArabic: 'ص', nameEnglish: 'Sad', englishTranslation: 'The Letter "Saad"', numberOfAyahs: 88, revelationType: 'Meccan', urduName: 'ص', juzStart: 23 },
  { number: 39, nameArabic: 'الزمر', nameEnglish: 'Az-Zumar', englishTranslation: 'The Troops', numberOfAyahs: 75, revelationType: 'Meccan', urduName: 'الزمر', juzStart: 23 },
  { number: 40, nameArabic: 'غافر', nameEnglish: 'Ghafir', englishTranslation: 'The Forgiver', numberOfAyahs: 85, revelationType: 'Meccan', urduName: 'المؤمن / غافر', juzStart: 24 },
  { number: 41, nameArabic: 'فصلت', nameEnglish: 'Fussilat', englishTranslation: 'Explained in Detail', numberOfAyahs: 54, revelationType: 'Meccan', urduName: 'حم السجدہ', juzStart: 24 },
  { number: 42, nameArabic: 'الشورى', nameEnglish: 'Ash-Shuraa', englishTranslation: 'The Consultation', numberOfAyahs: 53, revelationType: 'Meccan', urduName: 'الشورٰی', juzStart: 25 },
  { number: 43, nameArabic: 'الزخرف', nameEnglish: 'Az-Zukhruf', englishTranslation: 'The Ornaments of Gold', numberOfAyahs: 89, revelationType: 'Meccan', urduName: 'الزخرف', juzStart: 25 },
  { number: 44, nameArabic: 'الدخان', nameEnglish: 'Ad-Dukhan', englishTranslation: 'The Smoke', numberOfAyahs: 59, revelationType: 'Meccan', urduName: 'الدخان', juzStart: 25 },
  { number: 45, nameArabic: 'الجاثية', nameEnglish: 'Al-Jathiyah', englishTranslation: 'The Crouching', numberOfAyahs: 37, revelationType: 'Meccan', urduName: 'الجاثیہ', juzStart: 25 },
  { number: 46, nameArabic: 'الأحقاف', nameEnglish: 'Al-Ahqaf', englishTranslation: 'The Wind-Curved Sandhills', numberOfAyahs: 35, revelationType: 'Meccan', urduName: 'الاحقاف', juzStart: 26 },
  { number: 47, nameArabic: 'محمد', nameEnglish: 'Muhammad', englishTranslation: 'Muhammad (PBUH)', numberOfAyahs: 38, revelationType: 'Medinan', urduName: 'محمد ﷺ', juzStart: 26 },
  { number: 48, nameArabic: 'الفتح', nameEnglish: 'Al-Fath', englishTranslation: 'The Victory', numberOfAyahs: 29, revelationType: 'Medinan', urduName: 'الفتح', juzStart: 26 },
  { number: 49, nameArabic: 'الحجرات', nameEnglish: 'Al-Hujurat', englishTranslation: 'The Rooms', numberOfAyahs: 18, revelationType: 'Medinan', urduName: 'الحجرات', juzStart: 26 },
  { number: 50, nameArabic: 'ق', nameEnglish: 'Qaf', englishTranslation: 'The Letter "Qaf"', numberOfAyahs: 45, revelationType: 'Meccan', urduName: 'ق', juzStart: 26 },
  { number: 51, nameArabic: 'الذاريات', nameEnglish: 'Adh-Dhariyat', englishTranslation: 'The Winnowing Winds', numberOfAyahs: 60, revelationType: 'Meccan', urduName: 'الذاریات', juzStart: 26 },
  { number: 52, nameArabic: 'الطور', nameEnglish: 'At-Tur', englishTranslation: 'The Mount', numberOfAyahs: 49, revelationType: 'Meccan', urduName: 'الطور', juzStart: 27 },
  { number: 53, nameArabic: 'النجم', nameEnglish: 'An-Najm', englishTranslation: 'The Star', numberOfAyahs: 62, revelationType: 'Meccan', urduName: 'النجم', juzStart: 27 },
  { number: 54, nameArabic: 'القمر', nameEnglish: 'Al-Qamar', englishTranslation: 'The Moon', numberOfAyahs: 55, revelationType: 'Meccan', urduName: 'القمر', juzStart: 27 },
  { number: 55, nameArabic: 'الرحمن', nameEnglish: 'Ar-Rahman', englishTranslation: 'The Beneficent', numberOfAyahs: 78, revelationType: 'Medinan', urduName: 'الرحمٰن', juzStart: 27 },
  { number: 56, nameArabic: 'الواقعة', nameEnglish: 'Al-Waqi\'ah', englishTranslation: 'The Inevitable', numberOfAyahs: 96, revelationType: 'Meccan', urduName: 'الواقعہ', juzStart: 27 },
  { number: 57, nameArabic: 'الحديد', nameEnglish: 'Al-Hadid', englishTranslation: 'The Iron', numberOfAyahs: 29, revelationType: 'Medinan', urduName: 'الحدید', juzStart: 27 },
  { number: 58, nameArabic: 'المجادلة', nameEnglish: 'Al-Mujadila', englishTranslation: 'The Pleading Woman', numberOfAyahs: 22, revelationType: 'Medinan', urduName: 'المجادلہ', juzStart: 28 },
  { number: 59, nameArabic: 'الحشر', nameEnglish: 'Al-Hashr', englishTranslation: 'The Exile', numberOfAyahs: 24, revelationType: 'Medinan', urduName: 'الحشر', juzStart: 28 },
  { number: 60, nameArabic: 'الممتحنة', nameEnglish: 'Al-Mumtahanah', englishTranslation: 'She that is to be examined', numberOfAyahs: 13, revelationType: 'Medinan', urduName: 'الممتحنہ', juzStart: 28 },
  { number: 61, nameArabic: 'الصف', nameEnglish: 'As-Saf', englishTranslation: 'The Ranks', numberOfAyahs: 14, revelationType: 'Medinan', urduName: 'الصف', juzStart: 28 },
  { number: 62, nameArabic: 'الجمعة', nameEnglish: 'Al-Jumu\'ah', englishTranslation: 'The Congregation (Friday)', numberOfAyahs: 11, revelationType: 'Medinan', urduName: 'الجمعہ', juzStart: 28 },
  { number: 63, nameArabic: 'المنافقون', nameEnglish: 'Al-Munafiqun', englishTranslation: 'The Hypocrites', numberOfAyahs: 11, revelationType: 'Medinan', urduName: 'المنافقون', juzStart: 28 },
  { number: 64, nameArabic: 'التغابن', nameEnglish: 'At-Taghabun', englishTranslation: 'Mutual Disillusion', numberOfAyahs: 18, revelationType: 'Medinan', urduName: 'التغابن', juzStart: 28 },
  { number: 65, nameArabic: 'الطلاق', nameEnglish: 'At-Talaq', englishTranslation: 'The Divorce', numberOfAyahs: 12, revelationType: 'Medinan', urduName: 'الطلاق', juzStart: 28 },
  { number: 66, nameArabic: 'التحريم', nameEnglish: 'At-Tahrim', englishTranslation: 'The Prohibition', numberOfAyahs: 12, revelationType: 'Medinan', urduName: 'التحریم', juzStart: 28 },
  { number: 67, nameArabic: 'الملك', nameEnglish: 'Al-Mulk', englishTranslation: 'The Sovereignty (Protector from Grave)', numberOfAyahs: 30, revelationType: 'Meccan', urduName: 'الملک', juzStart: 29 },
  { number: 68, nameArabic: 'القلم', nameEnglish: 'Al-Qalam', englishTranslation: 'The Pen', numberOfAyahs: 52, revelationType: 'Meccan', urduName: 'القلم', juzStart: 29 },
  { number: 69, nameArabic: 'الحاقة', nameEnglish: 'Al-Haqqah', englishTranslation: 'The Reality', numberOfAyahs: 52, revelationType: 'Meccan', urduName: 'الحاقہ', juzStart: 29 },
  { number: 70, nameArabic: 'المعارج', nameEnglish: 'Al-Ma\'arij', englishTranslation: 'The Ascending Stairways', numberOfAyahs: 44, revelationType: 'Meccan', urduName: 'المعارج', juzStart: 29 },
  { number: 71, nameArabic: 'نوح', nameEnglish: 'Nuh', englishTranslation: 'Noah', numberOfAyahs: 28, revelationType: 'Meccan', urduName: 'نوح', juzStart: 29 },
  { number: 72, nameArabic: 'الجن', nameEnglish: 'Al-Jinn', englishTranslation: 'The Jinn', numberOfAyahs: 28, revelationType: 'Meccan', urduName: 'الجن', juzStart: 29 },
  { number: 73, nameArabic: 'المزمل', nameEnglish: 'Al-Muzzammil', englishTranslation: 'The Enshrouded One', numberOfAyahs: 20, revelationType: 'Meccan', urduName: 'المزمل', juzStart: 29 },
  { number: 74, nameArabic: 'المدثر', nameEnglish: 'Al-Muddaththir', englishTranslation: 'The Cloaked One', numberOfAyahs: 56, revelationType: 'Meccan', urduName: 'المدثر', juzStart: 29 },
  { number: 75, nameArabic: 'القيامة', nameEnglish: 'Al-Qiyamah', englishTranslation: 'The Resurrection', numberOfAyahs: 40, revelationType: 'Meccan', urduName: 'القیامہ', juzStart: 29 },
  { number: 76, nameArabic: 'الإنسان', nameEnglish: 'Al-Insan', englishTranslation: 'The Man', numberOfAyahs: 31, revelationType: 'Medinan', urduName: 'الدہر / الانسان', juzStart: 29 },
  { number: 77, nameArabic: 'المرسلات', nameEnglish: 'Al-Mursalat', englishTranslation: 'The Emissaries', numberOfAyahs: 50, revelationType: 'Meccan', urduName: 'المرسلات', juzStart: 29 },
  { number: 78, nameArabic: 'النبإ', nameEnglish: 'An-Naba', englishTranslation: 'The Tidings', numberOfAyahs: 40, revelationType: 'Meccan', urduName: 'النباء (عمّ)', juzStart: 30 },
  { number: 79, nameArabic: 'النازعات', nameEnglish: 'An-Nazi\'at', englishTranslation: 'Those who drag forth', numberOfAyahs: 46, revelationType: 'Meccan', urduName: 'النازعات', juzStart: 30 },
  { number: 80, nameArabic: 'عبس', nameEnglish: '\'Abasa', englishTranslation: 'He Frowned', numberOfAyahs: 42, revelationType: 'Meccan', urduName: 'عبس', juzStart: 30 },
  { number: 81, nameArabic: 'التكوير', nameEnglish: 'At-Takwir', englishTranslation: 'The Overthrowing', numberOfAyahs: 29, revelationType: 'Meccan', urduName: 'التکویر', juzStart: 30 },
  { number: 82, nameArabic: 'الانفطار', nameEnglish: 'Al-Infitar', englishTranslation: 'The Cleaving', numberOfAyahs: 19, revelationType: 'Meccan', urduName: 'الانفطار', juzStart: 30 },
  { number: 83, nameArabic: 'المطففين', nameEnglish: 'Al-Mutaffifin', englishTranslation: 'Defrauding', numberOfAyahs: 36, revelationType: 'Meccan', urduName: 'المطففین', juzStart: 30 },
  { number: 84, nameArabic: 'الانشقاق', nameEnglish: 'Al-Inshiqaq', englishTranslation: 'The Splitting Asunder', numberOfAyahs: 25, revelationType: 'Meccan', urduName: 'الانشقاق', juzStart: 30 },
  { number: 85, nameArabic: 'البروج', nameEnglish: 'Al-Buruj', englishTranslation: 'The Mansions of the Stars', numberOfAyahs: 22, revelationType: 'Meccan', urduName: 'البروج', juzStart: 30 },
  { number: 86, nameArabic: 'الطارق', nameEnglish: 'At-Tariq', englishTranslation: 'The Morning Star', numberOfAyahs: 17, revelationType: 'Meccan', urduName: 'الطارق', juzStart: 30 },
  { number: 87, nameArabic: 'الأعلى', nameEnglish: 'Al-A\'la', englishTranslation: 'The Most High', numberOfAyahs: 19, revelationType: 'Meccan', urduName: 'الاعلیٰ', juzStart: 30 },
  { number: 88, nameArabic: 'الغاشية', nameEnglish: 'Al-Ghashiyah', englishTranslation: 'The Overwhelming', numberOfAyahs: 26, revelationType: 'Meccan', urduName: 'الغاشیہ', juzStart: 30 },
  { number: 89, nameArabic: 'الفجر', nameEnglish: 'Al-Fajr', englishTranslation: 'The Dawn', numberOfAyahs: 30, revelationType: 'Meccan', urduName: 'الفجر', juzStart: 30 },
  { number: 90, nameArabic: 'البلد', nameEnglish: 'Al-Balad', englishTranslation: 'The City', numberOfAyahs: 20, revelationType: 'Meccan', urduName: 'البلد', juzStart: 30 },
  { number: 91, nameArabic: 'الشمس', nameEnglish: 'Ash-Shams', englishTranslation: 'The Sun', numberOfAyahs: 15, revelationType: 'Meccan', urduName: 'الشمس', juzStart: 30 },
  { number: 92, nameArabic: 'الليل', nameEnglish: 'Al-Layl', englishTranslation: 'The Night', numberOfAyahs: 21, revelationType: 'Meccan', urduName: 'اللیل', juzStart: 30 },
  { number: 93, nameArabic: 'الضحى', nameEnglish: 'Ad-Duhaa', englishTranslation: 'The Morning Hours', numberOfAyahs: 11, revelationType: 'Meccan', urduName: 'الضحیٰ', juzStart: 30 },
  { number: 94, nameArabic: 'الشرح', nameEnglish: 'Ash-Sharh', englishTranslation: 'The Relief', numberOfAyahs: 8, revelationType: 'Meccan', urduName: 'الم نشرح', juzStart: 30 },
  { number: 95, nameArabic: 'التين', nameEnglish: 'At-Tin', englishTranslation: 'The Fig', numberOfAyahs: 8, revelationType: 'Meccan', urduName: 'التین', juzStart: 30 },
  { number: 96, nameArabic: 'العلق', nameEnglish: 'Al-\'Alaq', englishTranslation: 'The Clot', numberOfAyahs: 19, revelationType: 'Meccan', urduName: 'العلق', juzStart: 30 },
  { number: 97, nameArabic: 'القدر', nameEnglish: 'Al-Qadr', englishTranslation: 'The Power', numberOfAyahs: 5, revelationType: 'Meccan', urduName: 'القدر', juzStart: 30 },
  { number: 98, nameArabic: 'البينة', nameEnglish: 'Al-Bayyinah', englishTranslation: 'The Clear Proof', numberOfAyahs: 8, revelationType: 'Medinan', urduName: 'البینہ', juzStart: 30 },
  { number: 99, nameArabic: 'الزلزلة', nameEnglish: 'Az-Zalzalah', englishTranslation: 'The Earthquake', numberOfAyahs: 8, revelationType: 'Medinan', urduName: 'الزلزال', juzStart: 30 },
  { number: 100, nameArabic: 'العاديات', nameEnglish: 'Al-\'Adiyat', englishTranslation: 'The Courser', numberOfAyahs: 11, revelationType: 'Meccan', urduName: 'العادیات', juzStart: 30 },
  { number: 101, nameArabic: 'القارعة', nameEnglish: 'Al-Qari\'ah', englishTranslation: 'The Calamity', numberOfAyahs: 11, revelationType: 'Meccan', urduName: 'القارعہ', juzStart: 30 },
  { number: 102, nameArabic: 'التكاثر', nameEnglish: 'At-Takathur', englishTranslation: 'The Rivalry in World Increase', numberOfAyahs: 8, revelationType: 'Meccan', urduName: 'التکاثر', juzStart: 30 },
  { number: 103, nameArabic: 'العصر', nameEnglish: 'Al-\'Asr', englishTranslation: 'The Declining Day', numberOfAyahs: 3, revelationType: 'Meccan', urduName: 'العصر', juzStart: 30 },
  { number: 104, nameArabic: 'الهمزة', nameEnglish: 'Al-Humazah', englishTranslation: 'The Traducer', numberOfAyahs: 9, revelationType: 'Meccan', urduName: 'الہمزہ', juzStart: 30 },
  { number: 105, nameArabic: 'الفيل', nameEnglish: 'Al-Fil', englishTranslation: 'The Elephant', numberOfAyahs: 5, revelationType: 'Meccan', urduName: 'الفیل', juzStart: 30 },
  { number: 106, nameArabic: 'قريش', nameEnglish: 'Quraysh', englishTranslation: 'Quraysh', numberOfAyahs: 4, revelationType: 'Meccan', urduName: 'قریش', juzStart: 30 },
  { number: 107, nameArabic: 'الماعون', nameEnglish: 'Al-Ma\'un', englishTranslation: 'Small Kindnesses', numberOfAyahs: 7, revelationType: 'Meccan', urduName: 'الماعون', juzStart: 30 },
  { number: 108, nameArabic: 'الكوثر', nameEnglish: 'Al-Kawthar', englishTranslation: 'The Abundance', numberOfAyahs: 3, revelationType: 'Meccan', urduName: 'الکوثر', juzStart: 30 },
  { number: 109, nameArabic: 'الكافرون', nameEnglish: 'Al-Kafirun', englishTranslation: 'The Disbelievers', numberOfAyahs: 6, revelationType: 'Meccan', urduName: 'الکافرون', juzStart: 30 },
  { number: 110, nameArabic: 'النصر', nameEnglish: 'An-Nasr', englishTranslation: 'The Divine Support', numberOfAyahs: 3, revelationType: 'Medinan', urduName: 'النصر', juzStart: 30 },
  { number: 111, nameArabic: 'المسد', nameEnglish: 'Al-Masad', englishTranslation: 'The Palm Fiber', numberOfAyahs: 5, revelationType: 'Meccan', urduName: 'لہب / المسد', juzStart: 30 },
  { number: 112, nameArabic: 'الإخلاص', nameEnglish: 'Al-Ikhlas', englishTranslation: 'The Sincerity (Tawheed)', numberOfAyahs: 4, revelationType: 'Meccan', urduName: 'الاخلاص (قل ہو اللہ)', juzStart: 30 },
  { number: 113, nameArabic: 'الفلق', nameEnglish: 'Al-Falaq', englishTranslation: 'The Daybreak', numberOfAyahs: 5, revelationType: 'Meccan', urduName: 'الفلق', juzStart: 30 },
  { number: 114, nameArabic: 'الناس', nameEnglish: 'An-Nas', englishTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan', urduName: 'الناس', juzStart: 30 },
];

/**
 * Pre-bundled offline texts for popular Surahs (available 100% offline without initial download)
 */
export const BUNDLED_OFFLINE_SURAHS: Record<number, QuranAyah[]> = {
  // Surah Al-Fatihah (1)
  1: [
    {
      numberInSurah: 1,
      textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translationUrdu: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے',
      translationEnglish: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    },
    {
      numberInSurah: 2,
      textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      translationUrdu: 'سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے',
      translationEnglish: '[All] praise is [due] to Allah, Lord of the worlds -',
    },
    {
      numberInSurah: 3,
      textArabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      translationUrdu: 'بڑا مہربان نہایت رحم والا',
      translationEnglish: 'The Entirely Merciful, the Especially Merciful,',
    },
    {
      numberInSurah: 4,
      textArabic: 'مَالِكِ يَوْمِ الدِّينِ',
      translationUrdu: 'روزِ جزا کا مالک',
      translationEnglish: 'Sovereign of the Day of Recompense.',
    },
    {
      numberInSurah: 5,
      textArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      translationUrdu: 'ہم صرف تیری ہی عبادت کرتے ہیں اور صرف تجھ ہی سے مدد مانگتے ہیں',
      translationEnglish: 'It is You we worship and You we ask for help.',
    },
    {
      numberInSurah: 6,
      textArabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      translationUrdu: 'ہمیں سیدھے راستے پر چلا',
      translationEnglish: 'Guide us to the straight path -',
    },
    {
      numberInSurah: 7,
      textArabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      translationUrdu: 'ان لوگوں کے راستے پر جن پر تو نے انعام فرمایا، جن پر نہ غضب ہوا اور نہ وہ گمراہ ہوئے',
      translationEnglish: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
    },
  ],

  // Surah Al-Mulk (67)
  67: [
    {
      numberInSurah: 1,
      textArabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
      translationUrdu: 'بڑی برکت والا ہے وہ جس کے ہاتھ میں سلطنت ہے، اور وہ ہر چیز پر قادر ہے',
      translationEnglish: 'Blessed is He in whose hand is dominion, and He is over all things competent -',
    },
    {
      numberInSurah: 2,
      textArabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
      translationUrdu: 'جس نے موت اور زندگی کو پیدا کیا تاکہ تمہیں آزمائے کہ تم میں سے عمل میں کون زیادہ اچھا ہے، اور وہ زبردست بخشنے والا ہے',
      translationEnglish: '[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -',
    },
    {
      numberInSurah: 3,
      textArabic: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ',
      translationUrdu: 'جس نے تہ بہ تہ سات آسمان پیدا کیے۔ تم رحمان کی تخلیق میں کوئی خلل نہ پاؤ گے۔ پھر نگاہ گھما کر دیکھو، کیا تمہیں کوئی شگاف نظر آتا ہے؟',
      translationEnglish: '[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision to the sky; do you see any breaks?',
    },
    {
      numberInSurah: 4,
      textArabic: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ',
      translationUrdu: 'پھر بار بار نگاہ دہراؤ، نگاہ تھک ہار کر ناکام واپس پلٹ آئے گی',
      translationEnglish: 'Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued.',
    },
    {
      numberInSurah: 5,
      textArabic: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ',
      translationUrdu: 'اور یقیناً ہم نے دنیا کے آسمان کو چراغوں سے آراستہ کیا اور انہیں شیطانوں کو مار بھگانے کا ذریعہ بنایا اور ان کے لیے دہکتی آگ کا عذاب تیار کیا',
      translationEnglish: 'And We have certainly beautified the nearest heaven with stars and have made [from] them what is thrown at the devils and have prepared for them the punishment of the Blaze.',
    },
  ],

  // Surah Al-Ikhlas (112)
  112: [
    {
      numberInSurah: 1,
      textArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      translationUrdu: 'کہہ دیجیے کہ وہ اللہ ایک ہے',
      translationEnglish: 'Say, "He is Allah, [who is] One,',
    },
    {
      numberInSurah: 2,
      textArabic: 'اللَّهُ الصَّمَدُ',
      translationUrdu: 'اللہ بے نیاز اور سب کا سہارا ہے',
      translationEnglish: 'Allah, the Eternal Refuge.',
    },
    {
      numberInSurah: 3,
      textArabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      translationUrdu: 'نہ اس کی کوئی اولاد ہے اور نہ وہ کسی سے پیدا ہوا ہے',
      translationEnglish: 'He neither begets nor is born,',
    },
    {
      numberInSurah: 4,
      textArabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      translationUrdu: 'اور کوئی اس کے برابر کا نہیں ہے',
      translationEnglish: 'Nor is there to Him any equivalent."',
    },
  ],

  // Surah Al-Falaq (113)
  113: [
    {
      numberInSurah: 1,
      textArabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      translationUrdu: 'کہہ دیجیے کہ میں صبح کے رب کی پناہ مانگتا ہوں',
      translationEnglish: 'Say, "I seek refuge in the Lord of daybreak',
    },
    {
      numberInSurah: 2,
      textArabic: 'مِن شَرِّ مَا خَلَقَ',
      translationUrdu: 'ہر اس چیز کی برائی سے جو اس نے پیدا کی',
      translationEnglish: 'From the evil of that which He created',
    },
    {
      numberInSurah: 3,
      textArabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      translationUrdu: 'اور اندھیری رات کی برائی سے جب وہ چھا جائے',
      translationEnglish: 'And from the evil of darkness when it settles',
    },
    {
      numberInSurah: 4,
      textArabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      translationUrdu: 'اور گرہوں میں پھونکنے والیوں کے شر سے',
      translationEnglish: 'And from the evil of the blowers in knots',
    },
    {
      numberInSurah: 5,
      textArabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      translationUrdu: 'اور حسد کرنے والے کے شر سے جب وہ حسد کرے',
      translationEnglish: 'And from the evil of an envier when he envies."',
    },
  ],

  // Surah An-Nas (114)
  114: [
    {
      numberInSurah: 1,
      textArabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
      translationUrdu: 'کہہ دیجیے کہ میں انسانوں کے پروردگار کی پناہ مانگتا ہوں',
      translationEnglish: 'Say, "I seek refuge in the Lord of mankind,',
    },
    {
      numberInSurah: 2,
      textArabic: 'مَلِكِ النَّاسِ',
      translationUrdu: 'انسانوں کے بادشاہ کی',
      translationEnglish: 'The Sovereign of mankind,',
    },
    {
      numberInSurah: 3,
      textArabic: 'إِلَٰهِ النَّاسِ',
      translationUrdu: 'انسانوں کے معبودِ برحق کی',
      translationEnglish: 'The God of mankind,',
    },
    {
      numberInSurah: 4,
      textArabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
      translationUrdu: 'وسوسہ ڈالنے والے چھپ جانے والے کے شر سے',
      translationEnglish: 'From the evil of the retreating whisperer -',
    },
    {
      numberInSurah: 5,
      textArabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
      translationUrdu: 'جو لوگوں کے دلوں میں وسوسے ڈالتا ہے',
      translationEnglish: 'Who whispers [evil] into the breasts of mankind -',
    },
    {
      numberInSurah: 6,
      textArabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
      translationUrdu: 'خواہ وہ جنوں میں سے ہو یا انسانوں میں سے',
      translationEnglish: 'From among the jinn and mankind."',
    },
  ],

  // Surah Al-Kafirun (109)
  109: [
    {
      numberInSurah: 1,
      textArabic: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ',
      translationUrdu: 'کہہ دیجیے کہ اے کافرو!',
      translationEnglish: 'Say, "O disbelievers,',
    },
    {
      numberInSurah: 2,
      textArabic: 'لَا أَعْبُدُ مَا تَعْبُدُونَ',
      translationUrdu: 'میں ان کی عبادت نہیں کرتا جن کی تم عبادت کرتے ہو',
      translationEnglish: 'I do not worship what you worship.',
    },
    {
      numberInSurah: 3,
      textArabic: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ',
      translationUrdu: 'اور نہ تم اس کی عبادت کرنے والے ہو جس کی میں عبادت کرتا ہوں',
      translationEnglish: 'Nor are you worshippers of what I worship.',
    },
    {
      numberInSurah: 4,
      textArabic: 'وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ',
      translationUrdu: 'اور نہ میں ان کی عبادت کرنے والا ہوں جن کی تم نے عبادت کی ہے',
      translationEnglish: 'Nor will I be a worshipper of what you worship.',
    },
    {
      numberInSurah: 5,
      textArabic: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ',
      translationUrdu: 'اور نہ تم اس کی عبادت کرنے والے ہو جس کی میں عبادت کرتا ہوں',
      translationEnglish: 'Nor will you be worshippers of what I worship.',
    },
    {
      numberInSurah: 6,
      textArabic: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ',
      translationUrdu: 'تمہارے لیے تمہارا دین اور میرے لیے میرا دین',
      translationEnglish: 'For you is your religion, and for me is my religion."',
    },
  ],

  // Surah Al-Kawthar (108)
  108: [
    {
      numberInSurah: 1,
      textArabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
      translationUrdu: 'بے شک ہم نے آپ کو کوثر (بے پناہ خیر و بھلائی) عطا فرمائی',
      translationEnglish: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
    },
    {
      numberInSurah: 2,
      textArabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
      translationUrdu: 'پس آپ اپنے رب کے لیے نماز پڑھیں اور قربانی کریں',
      translationEnglish: 'So pray to your Lord and sacrifice [to Him alone].',
    },
    {
      numberInSurah: 3,
      textArabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
      translationUrdu: 'یقیناً آپ کا دشمن ہی بے نام و نشان رہے گا',
      translationEnglish: 'Indeed, your enemy is the one cut off.',
    },
  ],

  // Surah Al-Asr (103)
  103: [
    {
      numberInSurah: 1,
      textArabic: 'وَالْعَصْرِ',
      translationUrdu: 'زمانے کی قسم!',
      translationEnglish: 'By time,',
    },
    {
      numberInSurah: 2,
      textArabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
      translationUrdu: 'بے شک انسان بڑے خسارے میں ہے',
      translationEnglish: 'Indeed, mankind is in loss,',
    },
    {
      numberInSurah: 3,
      textArabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
      translationUrdu: 'سوائے ان کے جو ایمان لائے اور نیک عمل کیے اور ایک دوسرے کو حق کی وصیت کی اور صبر کی تاکید کی',
      translationEnglish: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.',
    },
  ],

  // Surah Ya-Sin (36) - Core verses
  36: [
    {
      numberInSurah: 1,
      textArabic: 'يس',
      translationUrdu: 'یا سِین',
      translationEnglish: 'Ya, Seen.',
    },
    {
      numberInSurah: 2,
      textArabic: 'وَالْقُرْآنِ الْحَكِيمِ',
      translationUrdu: 'حکمت سے بھرپور قرآن کی قسم!',
      translationEnglish: 'By the wise Qur\'an.',
    },
    {
      numberInSurah: 3,
      textArabic: 'إِنَّكَ لَمِنَ الْمُرْسَلِينَ',
      translationUrdu: 'بے شک آپ پیغمبروں میں سے ہیں',
      translationEnglish: 'Indeed you, [O Muhammad], are from among the messengers,',
    },
    {
      numberInSurah: 4,
      textArabic: 'عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ',
      translationUrdu: 'سیدھے راستے پر ہیں',
      translationEnglish: 'On a straight path.',
    },
    {
      numberInSurah: 5,
      textArabic: 'تَنزِيلَ الْعَزِيزِ الرَّحِيمِ',
      translationUrdu: 'یہ زبردست اور نہایت رحم فرمانے والے کا اتارا ہوا ہے',
      translationEnglish: '[This is] a revelation of the Exalted in Might, the Merciful,',
    },
    {
      numberInSurah: 6,
      textArabic: 'لِتُنذِرَ قَوْمًا مَّا أُنذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ',
      translationUrdu: 'تاکہ آپ اس قوم کو خبردار کریں جن کے باپ دادا کو نہیں ڈرایا گیا تھا تو وہ غافل ہیں',
      translationEnglish: 'That you may warn a people whose forefathers were not warned, so they are unaware.',
    },
    {
      numberInSurah: 7,
      textArabic: 'إِنَّا جَعَلْنَا فِي أَعْنَاقِهِمْ أَغْلَالًا فَهِيَ إِلَى الْأَذْقَانِ فَهُم مُّقْمَحُونَ',
      translationUrdu: 'ہم نے ان کی گردنوں میں طوق ڈال دیے ہیں جو ان کی ٹھوڑیوں تک ہیں، سو ان کے سر اوپر اٹھے ہوئے ہیں',
      translationEnglish: 'Indeed, We have put shackles on their necks, and they are to their chins, so they are with heads [kept] aloft.',
    },
    {
      numberInSurah: 8,
      textArabic: 'وَجَعَلْنَا مِن بَيْنِ أَيْدِيهِمْ سَدًّا وَمِنْ خَلْفِهِمْ سَدًّا فَأَغْشَيْنَاهُمْ فَهُمْ لَا يُبْصِرُونَ',
      translationUrdu: 'اور ہم نے ایک دیوار ان کے آگے اور ایک دیوار ان کے پیچھے بنا دی، پھر ہم نے انہیں ڈھانپ دیا سو وہ کچھ نہیں دیکھتے',
      translationEnglish: 'And We have put before them a barrier and behind them a barrier and covered them, so they do not see.',
    },
  ],

  // Surah Ar-Rahman (55)
  55: [
    {
      numberInSurah: 1,
      textArabic: 'الرَّحْمَٰنُ',
      translationUrdu: 'نہایت مہربان اللہ',
      translationEnglish: 'The Entirely Merciful',
    },
    {
      numberInSurah: 2,
      textArabic: 'عَلَّمَ الْقُرْآنَ',
      translationUrdu: 'اس نے قرآن سکھایا',
      translationEnglish: 'Taught the Qur\'an,',
    },
    {
      numberInSurah: 3,
      textArabic: 'خَلَقَ الْإِنسَانَ',
      translationUrdu: 'اسی نے انسان کو پیدا کیا',
      translationEnglish: 'Created man,',
    },
    {
      numberInSurah: 4,
      textArabic: 'عَلَّمَهُ الْبَيَانَ',
      translationUrdu: 'اسے بولنا سکھایا',
      translationEnglish: '[And] taught him eloquence.',
    },
    {
      numberInSurah: 5,
      textArabic: 'الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ',
      translationUrdu: 'سورج اور چاند ایک حساب کے پابند ہیں',
      translationEnglish: 'The sun and the moon [move] by precise calculation,',
    },
    {
      numberInSurah: 6,
      textArabic: 'وَالنَّجْمُ وَالشَّجَرُ يَسْجُدَانِ',
      translationUrdu: 'اور بوٹیاں اور درخت سجدہ کر رہے ہیں',
      translationEnglish: 'And the stars and trees prostrate.',
    },
    {
      numberInSurah: 7,
      textArabic: 'وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ',
      translationUrdu: 'اور اسی نے آسمان کو بلند کیا اور ترازو قائم کی',
      translationEnglish: 'And the heaven He raised and imposed the balance',
    },
    {
      numberInSurah: 8,
      textArabic: 'أَلَّا تَطْغَوْا فِي الْمِيزَانِ',
      translationUrdu: 'تاکہ تم تولنے میں حد سے تجاوز نہ کرو',
      translationEnglish: 'That you not transgress within the balance.',
    },
    {
      numberInSurah: 9,
      textArabic: 'وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ',
      translationUrdu: 'اور انصاف کے ساتھ تول کو قائم رکھو اور ترازو کو کم نہ کرو',
      translationEnglish: 'And establish weight in justice and do not make deficient the balance.',
    },
    {
      numberInSurah: 10,
      textArabic: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
      translationUrdu: 'پس تم اپنے رب کی کون کون سی نعمتوں کو جھٹلاؤ گے؟',
      translationEnglish: 'So which of the favors of your Lord would you deny?',
    },
  ],

  // Surah Al-Qadr (97)
  97: [
    {
      numberInSurah: 1,
      textArabic: 'إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
      translationUrdu: 'بے شک ہم نے اس (قرآن) کو شبِ قدر میں نازل فرمایا',
      translationEnglish: 'Indeed, We sent the Qur\'an down during the Night of Decree.',
    },
    {
      numberInSurah: 2,
      textArabic: 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ',
      translationUrdu: 'اور آپ کو کیا معلوم کہ شبِ قدر کیا ہے؟',
      translationEnglish: 'And what can make you know what is the Night of Decree?',
    },
    {
      numberInSurah: 3,
      textArabic: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ',
      translationUrdu: 'شبِ قدر ہزار مہینوں سے بہتر ہے',
      translationEnglish: 'The Night of Decree is better than a thousand months.',
    },
    {
      numberInSurah: 4,
      textArabic: 'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ',
      translationUrdu: 'اس میں فرشتے اور روح القدس (جبرائیلؑ) اپنے رب کے حکم سے ہر کام کی تدبیر لے کر اترتے ہیں',
      translationEnglish: 'The angels and the Spirit descend therein by permission of their Lord for every matter.',
    },
    {
      numberInSurah: 5,
      textArabic: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ',
      translationUrdu: 'وہ رات سلامتی ہی سلامتی ہے، طلوعِ فجر تک',
      translationEnglish: 'Peace it is until the emergence of dawn.',
    },
  ],

  // Surah Ash-Sharh (94)
  94: [
    {
      numberInSurah: 1,
      textArabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ',
      translationUrdu: 'کیا ہم نے آپ کا سینہ کشادہ نہیں فرما دیا؟',
      translationEnglish: 'Did We not expand for you, [O Muhammad], your breast?',
    },
    {
      numberInSurah: 2,
      textArabic: 'وَوَضَعْنَا عَنكَ وِزْرَكَ',
      translationUrdu: 'اور ہم نے آپ سے آپ کا بوجھ اتار دیا',
      translationEnglish: 'And We removed from you your burden',
    },
    {
      numberInSurah: 3,
      textArabic: 'الَّذِي أَنقَضَ ظَهْرَكَ',
      translationUrdu: 'جس نے آپ کی پیٹھ توڑ رکھی تھی',
      translationEnglish: 'Which had weighed upon your back',
    },
    {
      numberInSurah: 4,
      textArabic: 'وَرَفَعْنَا لَكَ ذِكْرَكَ',
      translationUrdu: 'اور ہم نے آپ کے ذکر کو بلند کر دیا',
      translationEnglish: 'And raised high for you your repute.',
    },
    {
      numberInSurah: 5,
      textArabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
      translationUrdu: 'پس یقیناً تنگی کے ساتھ آسانی ہے',
      translationEnglish: 'For indeed, with hardship [will be] ease.',
    },
    {
      numberInSurah: 6,
      textArabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      translationUrdu: 'بے شک تنگی کے ساتھ ہی آسانی ہے',
      translationEnglish: 'Indeed, with hardship [will be] ease.',
    },
    {
      numberInSurah: 7,
      textArabic: 'فَإِذَا فَرَغْتَ فَانصَبْ',
      translationUrdu: 'پس جب آپ فارغ ہوں تو عبادت میں محنت کیجیے',
      translationEnglish: 'So when you have finished [your duties], then stand up [for worship].',
    },
    {
      numberInSurah: 8,
      textArabic: 'وَإِلَىٰ رَبِّكَ فَارْغَب',
      translationUrdu: 'اور اپنے رب ہی کی طرف لو لگائیے',
      translationEnglish: 'And to your Lord direct [your] longing.',
    },
  ],

  // Surah Al-Fil (105)
  105: [
    {
      numberInSurah: 1,
      textArabic: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ',
      translationUrdu: 'کیا آپ نے نہیں دیکھا کہ آپ کے رب نے ہاتھی والوں کے ساتھ کیا کیا؟',
      translationEnglish: 'Have you not considered, [O Muhammad], how your Lord dealt with the companions of the elephant?',
    },
    {
      numberInSurah: 2,
      textArabic: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ',
      translationUrdu: 'کیا اس نے ان کے مکر کو برباد نہیں کر دیا؟',
      translationEnglish: 'Did He not make their plan into misguidance?',
    },
    {
      numberInSurah: 3,
      textArabic: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ',
      translationUrdu: 'اور ان پر جھنڈ کے جھنڈ پرندے (ابابیل) بھیج دیے',
      translationEnglish: 'And He sent against them birds in flocks,',
    },
    {
      numberInSurah: 4,
      textArabic: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ',
      translationUrdu: 'جو ان پر پکی ہوئی مٹی کے پتھر پھینکتے تھے',
      translationEnglish: 'Striking them with stones of hard clay,',
    },
    {
      numberInSurah: 5,
      textArabic: 'فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ',
      translationUrdu: 'پھر ان کو کھائے ہوئے بھوسے کی طرح کر دیا',
      translationEnglish: 'And He made them like eaten straw.',
    },
  ],

  // Surah Quraysh (106)
  106: [
    {
      numberInSurah: 1,
      textArabic: 'لِإِيلَافِ قُرَيْشٍ',
      translationUrdu: 'قریش کو مانوس کرنے کی خاطر',
      translationEnglish: 'For the accustomed security of the Quraysh -',
    },
    {
      numberInSurah: 2,
      textArabic: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ',
      translationUrdu: 'ان کو سردی اور گرمی کے سفر سے مانوس کرنے کی خاطر',
      translationEnglish: 'Their accustomed security [in] the caravan of winter and summer -',
    },
    {
      numberInSurah: 3,
      textArabic: 'فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ',
      translationUrdu: 'پس چاہیے کہ وہ اس گھر (کعبہ) کے رب کی عبادت کریں',
      translationEnglish: 'Let them worship the Lord of this House,',
    },
    {
      numberInSurah: 4,
      textArabic: 'الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ',
      translationUrdu: 'جس نے ان کو بھوک میں کھانا کھلایا اور خوف سے امن عطا فرمایا',
      translationEnglish: 'Who has fed them, [saving them] from hunger and made them safe, [saving them] from fear.',
    },
  ],

  // Surah Al-Ma'un (107)
  107: [
    {
      numberInSurah: 1,
      textArabic: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ',
      translationUrdu: 'کیا آپ نے دیکھا اس کو جو روزِ جزا کو جھٹلاتا ہے؟',
      translationEnglish: 'Have you seen the one who denies the Recompense?',
    },
    {
      numberInSurah: 2,
      textArabic: 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ',
      translationUrdu: 'یہ وہی ہے جو یتیم کو دھکے دیتا ہے',
      translationEnglish: 'For that is the one who drives away the orphan',
    },
    {
      numberInSurah: 3,
      textArabic: 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ',
      translationUrdu: 'اور مسکین کو کھانا کھلانے کی ترغیب نہیں دیتا',
      translationEnglish: 'And does not encourage the feeding of the poor.',
    },
    {
      numberInSurah: 4,
      textArabic: 'فَوَيْلٌ لِّلْمُصَلِّينَ',
      translationUrdu: 'پس ہلاکت ہے ان نمازیوں کے لیے',
      translationEnglish: 'So woe to those who pray',
    },
    {
      numberInSurah: 5,
      textArabic: 'الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ',
      translationUrdu: 'جو اپنی نماز سے غافل ہیں',
      translationEnglish: '[But] who are heedless of their prayer -',
    },
    {
      numberInSurah: 6,
      textArabic: 'الَّذِينَ هُمْ يُرَاءُونَ',
      translationUrdu: 'جو صرف دکھاوا کرتے ہیں',
      translationEnglish: 'Those who make a show [of their deeds]',
    },
    {
      numberInSurah: 7,
      textArabic: 'وَيَمْنَعُونَ الْمَاعُونَ',
      translationUrdu: 'اور برتنے کی چھوٹی چیزیں بھی مانگے نہیں دیتے',
      translationEnglish: 'And withhold [simple] assistance.',
    },
  ],

  // Surah An-Nasr (110)
  110: [
    {
      numberInSurah: 1,
      textArabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ',
      translationUrdu: 'جب اللہ کی مدد اور فتح آ جائے',
      translationEnglish: 'When the victory of Allah has come and the conquest,',
    },
    {
      numberInSurah: 2,
      textArabic: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا',
      translationUrdu: 'اور آپ لوگوں کو اللہ کے دین میں فوج در فوج داخل ہوتے دیکھ لیں',
      translationEnglish: 'And you see the people entering into the religion of Allah in multitudes,',
    },
    {
      numberInSurah: 3,
      textArabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا',
      translationUrdu: 'تو اپنے رب کی تسبیح کیجیے اس کی حمد کے ساتھ اور اس سے بخشش مانگیے، بے شک وہ بڑا معاف فرمانے والا ہے',
      translationEnglish: 'Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.',
    },
  ],

  // Surah Al-Masad (111)
  111: [
    {
      numberInSurah: 1,
      textArabic: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ',
      translationUrdu: 'ابولہب کے دونوں ہاتھ ٹوٹ گئے اور وہ ہلاک ہو گیا',
      translationEnglish: 'May the hands of Abu Lahab be ruined, and ruined is he.',
    },
    {
      numberInSurah: 2,
      textArabic: 'مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ',
      translationUrdu: 'نہ اس کا مال اس کے کچھ کام آیا اور نہ وہ جو اس نے کمایا',
      translationEnglish: 'His wealth will not avail him or that which he gained.',
    },
    {
      numberInSurah: 3,
      textArabic: 'سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ',
      translationUrdu: 'وہ عنقریب شعلہ زن آگ میں داخل ہو گا',
      translationEnglish: 'He will [enter to] burn in a Fire of [blazing] flame',
    },
    {
      numberInSurah: 4,
      textArabic: 'وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ',
      translationUrdu: 'اور اس کی عورت بھی جو لکڑیاں اٹھائے پھرتی ہے',
      translationEnglish: 'And his wife [as well] - the carrier of firewood.',
    },
    {
      numberInSurah: 5,
      textArabic: 'فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ',
      translationUrdu: 'اس کی گردن میں بٹی ہوئی رسی ہو گی',
      translationEnglish: 'Around her neck is a rope of [twisted] fiber.',
    },
  ],
};

