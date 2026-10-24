import { Language } from '../types/index.ts';

/**
 * Get current date key (YYYY-MM-DD) automatically in Pakistan Standard Time (PKT - UTC+5)
 */
export const getTodayKey = (): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date()); // Returns "YYYY-MM-DD"
  } catch {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};

/**
 * Shift date by offsetDays (e.g. -1 for yesterday, +1 for tomorrow)
 */
export const shiftDateKey = (dateKey: string, offsetDays: number): string => {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Islamic month transliterations
const ISLAMIC_MONTHS_ROMAN = [
  'Muharram',
  'Safar',
  'Rabi-ul-Awwal',
  'Rabi-us-Sani',
  'Jamadi-ul-Awwal',
  'Jamadi-us-Sani',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Zul-Qa'dah",
  'Zul-Hijjah',
];

const ISLAMIC_MONTHS_URDU = [
  'محرم الحرام',
  'صفر المظفر',
  'ربیع الاول',
  'ربیع الثانی',
  'جمادی الاول',
  'جمادی الثانی',
  'رجب المرجب',
  'شعبان المعظم',
  'رمضان المبارک',
  'شوال المکرم',
  'ذوالقعدۃ',
  'ذوالحجۃ',
];

/**
 * Get accurate Islamic (Hijri) date string based on today's Pakistan date
 */
export const getHijriDateString = (
  dateKey: string,
  lang: Language,
  dayOffset: number = 0
): string => {
  try {
    const [y, m, d] = dateKey.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (dayOffset !== 0) {
      date.setDate(date.getDate() + dayOffset);
    }

    // Try standard Umm al-Qura Intl format with Pakistan timezone
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      timeZone: 'Asia/Karachi',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });

    const parts = formatter.formatToParts(date);
    const hDay = parts.find((p) => p.type === 'day')?.value || '1';
    const hMonth = parseInt(parts.find((p) => p.type === 'month')?.value || '1', 10);
    const hYear = parts.find((p) => p.type === 'year')?.value || '1448';

    const monthIndex = Math.max(0, Math.min(11, hMonth - 1));

    if (lang === 'urdu') {
      const monthUrdu = ISLAMIC_MONTHS_URDU[monthIndex];
      return `${hDay} ${monthUrdu} ${hYear} ھ`;
    }

    if (lang === 'roman-urdu') {
      const monthRoman = ISLAMIC_MONTHS_ROMAN[monthIndex];
      return `${hDay} ${monthRoman} ${hYear} AH`;
    }

    // English
    const monthEnglish = ISLAMIC_MONTHS_ROMAN[monthIndex];
    return `${hDay} ${monthEnglish} ${hYear} AH`;
  } catch {
    // Fallback Islamic date format
    return lang === 'urdu' ? '1448 ھ' : '1448 AH';
  }
};

/**
 * Format Gregorian date with day of the week and relative tag (Aaj / Kal)
 */
export const formatDisplayDate = (
  dateKey: string,
  lang: Language
): { main: string; relative: string; fullDate: string } => {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const todayKey = getTodayKey();
  const yesterdayKey = shiftDateKey(todayKey, -1);
  const tomorrowKey = shiftDateKey(todayKey, 1);

  let relative = '';
  if (dateKey === todayKey) {
    relative = lang === 'urdu' ? 'آج' : lang === 'roman-urdu' ? 'Aaj' : 'Today';
  } else if (dateKey === yesterdayKey) {
    relative = lang === 'urdu' ? 'گزشتہ کل' : lang === 'roman-urdu' ? 'Kal' : 'Yesterday';
  } else if (dateKey === tomorrowKey) {
    relative = lang === 'urdu' ? 'کل' : lang === 'roman-urdu' ? 'Kal (Aane wala)' : 'Tomorrow';
  }

  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysUrdu = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
  const daysRoman = ['Itwar', 'Peer', 'Mangal', 'Budh', 'Jumeraat', 'Juma', 'Hafta'];

  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsUrdu = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];

  const dayIndex = date.getDay();
  const monthIndex = date.getMonth();
  const dayNum = date.getDate();

  let main = '';
  let fullDate = '';

  if (lang === 'urdu') {
    main = `${daysUrdu[dayIndex]}، ${dayNum} ${monthsUrdu[monthIndex]}`;
    fullDate = `${daysUrdu[dayIndex]}، ${dayNum} ${monthsUrdu[monthIndex]} ${y}`;
  } else if (lang === 'roman-urdu') {
    main = `${daysRoman[dayIndex]}, ${dayNum} ${monthsEn[monthIndex]}`;
    fullDate = `${daysRoman[dayIndex]}, ${dayNum} ${monthsEn[monthIndex]} ${y}`;
  } else {
    main = `${daysEn[dayIndex]}, ${monthsEn[monthIndex]} ${dayNum}`;
    fullDate = `${daysEn[dayIndex]}, ${dayNum} ${monthsEn[monthIndex]} ${y}`;
  }

  return { main, relative, fullDate };
};
