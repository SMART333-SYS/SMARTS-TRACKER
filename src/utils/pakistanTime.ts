// Pakistan Standard Time (PKT - UTC+5) Utilities & Prayer Alarm Defaults
import { PrayerAlarmConfig } from '../types/index.ts';

/**
 * Get current time and date in Pakistan Standard Time (Asia/Karachi, UTC+5)
 */
export function getPakistanTimeInfo(): {
  time12: string; // "05:30:15 PM"
  time24: string; // "17:30"
  time24Seconds: string; // "17:30:15"
  hours: number;
  minutes: number;
  seconds: number;
  dateFormattedEn: string; // "Thursday, 22 Oct"
  dateFormattedUrdu: string; // "جمعرات، 22 اکتوبر"
  dateKey: string; // "YYYY-MM-DD"
} {
  const now = new Date();

  // Create date formatter with Asia/Karachi timezone
  const timeFormatter12 = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const timeFormatter24 = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const timeFormatter24Sec = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const yearFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const time12 = timeFormatter12.format(now);
  const time24 = timeFormatter24.format(now);
  const time24Seconds = timeFormatter24Sec.format(now);
  const [hStr, mStr, sStr] = time24Seconds.split(':');

  return {
    time12,
    time24,
    time24Seconds,
    hours: parseInt(hStr || '0', 10),
    minutes: parseInt(mStr || '0', 10),
    seconds: parseInt(sStr || '0', 10),
    dateFormattedEn: dateFormatter.format(now),
    dateFormattedUrdu: `پاکستان وقت`,
    dateKey: yearFormatter.format(now), // "YYYY-MM-DD"
  };
}

/**
 * Standard Pakistan Prayer Alarm Timings
 */
export const DEFAULT_PRAYER_ALARMS: PrayerAlarmConfig[] = [
  {
    prayerId: 'tahajjud',
    nameRoman: 'Tahajjud (Qiyam)',
    nameUrdu: 'تہجد (قیام اللیل)',
    nameEn: 'Tahajjud',
    arabicName: 'التَّهَجُّد',
    alarmTime: '04:00',
    enabled: true,
    category: 'nafl',
  },
  {
    prayerId: 'fajr',
    nameRoman: 'Fajr',
    nameUrdu: 'فجر',
    nameEn: 'Fajr (Dawn)',
    arabicName: 'الفَجْر',
    alarmTime: '05:15',
    enabled: true,
    category: 'fard',
  },
  {
    prayerId: 'ishraq',
    nameRoman: 'Ishraq',
    nameUrdu: 'اشراق',
    nameEn: 'Ishraq',
    arabicName: 'الإشْرَاق',
    alarmTime: '06:40',
    enabled: false,
    category: 'nafl',
  },
  {
    prayerId: 'chasht',
    nameRoman: 'Chasht (Duha)',
    nameUrdu: 'چاشت',
    nameEn: 'Duha',
    arabicName: 'الضُّحَى',
    alarmTime: '09:30',
    enabled: false,
    category: 'nafl',
  },
  {
    prayerId: 'dhuhr',
    nameRoman: 'Dhuhr (Zohar)',
    nameUrdu: 'ظہر',
    nameEn: 'Dhuhr (Noon)',
    arabicName: 'الظُّهْر',
    alarmTime: '13:15',
    enabled: true,
    category: 'fard',
  },
  {
    prayerId: 'asr',
    nameRoman: 'Asr',
    nameUrdu: 'عصر',
    nameEn: 'Asr',
    arabicName: 'العَصْر',
    alarmTime: '16:45',
    enabled: true,
    category: 'fard',
  },
  {
    prayerId: 'maghrib',
    nameRoman: 'Maghrib',
    nameUrdu: 'مغرب',
    nameEn: 'Maghrib',
    arabicName: 'المَغْرِب',
    alarmTime: '18:30',
    enabled: true,
    category: 'fard',
  },
  {
    prayerId: 'isha',
    nameRoman: 'Isha',
    nameUrdu: 'عشاء',
    nameEn: 'Isha',
    arabicName: 'العِشَاء',
    alarmTime: '20:00',
    enabled: true,
    category: 'fard',
  },
];

/**
 * Format 24h time ("13:15") to friendly 12h string ("01:15 PM")
 */
export function formatTime12h(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr.padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, '0')}:${m} ${period}`;
}
