import { EmergencyDua, HabitItem, NaflPrayer, PrayerItem } from '../types/index.ts';

export const DEFAULT_HABITS: HabitItem[] = [
  {
    id: 'habit_early_rise',
    titleRoman: 'Subah Jald Uthna & Tahajjud / Fajr',
    titleUrdu: 'صبح جلد اٹھنا، تہجد اور فجر',
    titleEn: 'Early Wakeup, Tahajjud & Fajr',
    category: 'spiritual'
  },
  {
    id: 'habit_quran',
    titleRoman: "Tilawat-e-Qur'an (1 Ruku / Daily Portion)",
    titleUrdu: "تلاوتِ قرآن مجید (کم از کم ایک رکوع)",
    titleEn: "Quran Recitation (At least 1 Ruku)",
    category: 'spiritual'
  },
  {
    id: 'habit_work_skills',
    titleRoman: 'Study / Work / Skills Kaam (Deep Focus)',
    titleUrdu: 'پڑھائی / کام / ہنر مندی (بھرپور توجہ)',
    titleEn: 'Focused Study / Work / Skill Practice',
    category: 'work'
  },
  {
    id: 'habit_sleep_early',
    titleRoman: 'Raat ko Waqt par Sona (Sunnah Sleep)',
    titleUrdu: 'رات کو وقت پر سونا (سنت کے مطابق)',
    titleEn: 'Sleeping Early on Time (Sunnah Routine)',
    category: 'health'
  },
  {
    id: 'habit_morning_azkar',
    titleRoman: 'Subah o Shaam ke Masnoon Azkar',
    titleUrdu: 'صبح و شام کے مسنون اذکار',
    titleEn: 'Morning & Evening Sunnah Adhkar',
    category: 'spiritual'
  },
  {
    id: 'habit_daily_dua',
    titleRoman: 'Dua of the Day / Masnoon Dua Parhna',
    titleUrdu: 'آج کی مسنون دعا پڑھنا و سننا',
    titleEn: 'Dua of the Day Recitation',
    category: 'spiritual'
  },
  {
    id: 'habit_walk_workout',
    titleRoman: 'Jismani Harkat / 30 Min Walk ya Exercise',
    titleUrdu: 'جسمانی ورزش یا 30 منٹ چہل قدمی',
    titleEn: 'Physical Movement or 30 Min Exercise',
    category: 'health'
  }
];

export const PRAYERS_LIST: PrayerItem[] = [
  {
    id: 'fajr',
    nameRoman: 'Fajr',
    nameUrdu: 'فجر',
    nameEn: 'Fajr (Dawn)',
    arabicName: 'الفَجْر',
    defaultTime: '05:15 AM',
    fardRakat: 2,
    sunnahRakat: 2
  },
  {
    id: 'dhuhr',
    nameRoman: 'Dhuhr (Zohar)',
    nameUrdu: 'ظہر',
    nameEn: 'Dhuhr (Noon)',
    arabicName: 'الظُّهْر',
    defaultTime: '01:15 PM',
    fardRakat: 4,
    sunnahRakat: 6
  },
  {
    id: 'asr',
    nameRoman: 'Asr',
    nameUrdu: 'عصر',
    nameEn: 'Asr (Afternoon)',
    arabicName: 'العَصْر',
    defaultTime: '04:45 PM',
    fardRakat: 4,
    sunnahRakat: 4
  },
  {
    id: 'maghrib',
    nameRoman: 'Maghrib',
    nameUrdu: 'مغرب',
    nameEn: 'Maghrib (Sunset)',
    arabicName: 'المَغْرِب',
    defaultTime: '06:30 PM',
    fardRakat: 3,
    sunnahRakat: 2
  },
  {
    id: 'isha',
    nameRoman: 'Isha',
    nameUrdu: 'عشاء',
    nameEn: 'Isha (Night)',
    arabicName: 'العِشَاء',
    defaultTime: '08:00 PM',
    fardRakat: 4,
    sunnahRakat: 4
  }
];

export const NAWAFIL_LIST: NaflPrayer[] = [
  { id: 'tahajjud', nameRoman: 'Tahajjud (Qiyam al-Layl)', nameUrdu: 'تہجد (قیام اللیل)', nameEn: 'Tahajjud (Night Prayer)' },
  { id: 'ishraq', nameRoman: 'Ishraq (Post-Sunrise)', nameUrdu: 'اشراق', nameEn: 'Ishraq' },
  { id: 'chasht', nameRoman: 'Chasht (Duha)', nameUrdu: 'چاشت (الضحیٰ)', nameEn: 'Duha (Forenoon)' },
  { id: 'awwabin', nameRoman: 'Awwabin (Post-Maghrib)', nameUrdu: 'اوّابین', nameEn: 'Awwabin' },
  { id: 'witr', nameRoman: 'Witr Wajib', nameUrdu: 'وتر واجب', nameEn: 'Witr' }
];

export const EMERGENCY_DUAS: EmergencyDua[] = [
  {
    id: 'astaghfar_1',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    romanUrdu: "Astaghfirullahal 'Azeem alladhi la ilaha illa huwal-Hayyul-Qayyum wa atoobu ilayh.",
    urdu: "میں اللہ عظیم سے بخشش مانگتا ہوں جس کے سوا کوئی معبود نہیں، وہ زندہ اور سب کو سنبھالنے والا ہے، اور میں اسی کی طرف رجوع کرتا ہوں۔",
    english: "I seek forgiveness of Allah the Almighty, there is no deity worthy of worship except Him, the Ever-Living, the Sustainer, and I turn to Him in repentance.",
    contextRoman: "Gunah, susti aur bure waswasay door karne ka azeem tareen kalma.",
    contextEn: "Erases sins, brings peace, and repels evil whispers instantly.",
    reference: "Sunan Abi Dawud"
  },
  {
    id: 'hawqala',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    romanUrdu: "La hawla wa la quwwata illa billahil 'Aliyyil 'Azeem.",
    urdu: "گناہ سے بچنے اور نیکی کرنے کی طاقت صرف اور صرف بلند و برتر اللہ کی توفیق سے ہے۔",
    english: "There is no power and no strength except through Allah, the Most High, the Supreme.",
    contextRoman: "Jannat ke khazano me se ek khazana; susti aur nafs ki khwahishat par qabu pane ke liye.",
    contextEn: "A treasure from Paradise; demolishes helplessness and demonic whispers.",
    reference: "Sahih al-Bukhari & Muslim"
  },
  {
    id: 'yunus',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    romanUrdu: "La ilaha illa anta subhanaka inni kuntu minaz-zalimeen.",
    urdu: "تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ہی قصوروار اور زیادتی کرنے والوں میں سے تھا۔",
    english: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    contextRoman: "Gham, bechaini aur nafsiyati dabao ko foran khatam karne wali Ayat-e-Kareema.",
    contextEn: "Dua of Prophet Yunus (AS); Allah relieves distress for any believer who recites it.",
    reference: "Surah Al-Anbiya (21:87)"
  },
  {
    id: 'nafs_refuge',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    romanUrdu: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-jubni wal-bukhl, wa dala'id-dayni wa ghalabatir-rijal.",
    urdu: "اے اللہ! میں غم، پریشانی، بے بسی، سستی، بزدلی، کنجوسی، قرض کے بوجھ اور لوگوں کے دباؤ سے تیری پناہ مانگتا ہوں۔",
    english: "O Allah, I seek refuge in You from grief and sorrow, helplessness and laziness, cowardice and miserliness, and the burden of debt and oppression.",
    contextRoman: "Susti (laziness) aur depression se nijat ki Nabawi dua.",
    contextEn: "The comprehensive shield taught by the Prophet (PBUH) against procrastination and despair.",
    reference: "Sahih al-Bukhari"
  },
  {
    id: 'taqwa_dua',
    arabic: 'اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا، وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا، أَنْتَ وَلِيُّهَا وَمَوْلَاهَا',
    romanUrdu: "Allahumma aati nafsi taqwaha, wa zakkiha anta khayru man zakkaha, anta waliyyuha wa mawlaha.",
    urdu: "اے اللہ! میرے نفس کو تقویٰ اور پاکیزگی عطا فرما، تو ہی بہترین پاک کرنے والا ہے، تو ہی اس کا مالک و مددگار ہے۔",
    english: "O Allah, grant my soul its piety and purify it; You are the best to purify it. You are its Guardian and Master.",
    contextRoman: "Nafs-e-Ammarah (buraai par uksane wale dil) ko pak karne ki dua.",
    contextEn: "Purification of the soul from impure thoughts and compulsive urges.",
    reference: "Sahih Muslim"
  },
  {
    id: 'waswasa_dua',
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ ، آمَنْتُ بِاللَّهِ وَرُسُلِهِ',
    romanUrdu: "A'udhu billahi minash-shaytanir-rajeem, Amantu billahi wa rusulihi.",
    urdu: "میں مردود شیطان سے اللہ کی پناہ چاہتا ہوں، میں اللہ اور اس کے تمام رسولوں پر ایمان لایا۔",
    english: "I seek refuge in Allah from Satan the outcast. I believe in Allah and His Messengers.",
    contextRoman: "Jab achanak zehan me shukook ya gande khayalat aane lagein toh baayein taraf 3 bar thukkar ye parhein.",
    contextEn: "Prescribed Sunnah remedy when intrusive thoughts or negative urges strike.",
    reference: "Sahih Muslim"
  }
];

export const RESCUE_ADVICES = [
  {
    titleRoman: "Ghar se bahar niklein ya Kamra badlein",
    titleUrdu: "کمرہ تبدیل کریں یا کھلی فضا میں جائیں",
    titleEn: "Change your location immediately",
    descRoman: "Akelepan (Isolation) aur band kamre se foran bahar niklein. Shaitaan akele shakhs par asaan hamla karta hai.",
    descUrdu: "تنہائی گناہ کی سب سے بڑی دعوت ہے۔ فوری طور پر لوگوں میں بیٹھ جائیں یا کھلی ہوا میں نکلیں۔",
    descEn: "Isolation feeds negative urges. Immediately step out into fresh air or be around family/people."
  },
  {
    titleRoman: "Taza Wuzu karein (Hydro-Therapy)",
    titleUrdu: "ٹھنڈے پانی سے تازہ وضو کریں",
    titleEn: "Make fresh ablution (Wudu)",
    descRoman: "Gussa aur shahwat aag ki tarah hai, aur aag ko sirf paani bujha sakta hai. Wuzu dil ko foran thanda karta hai.",
    descUrdu: "حدیث کے مطابق غصہ اور نفسانی آگ کو پانی ٹھنڈا کرتا ہے۔ وضو آپ کا روحانی حفاظتی زرہ ہے۔",
    descEn: "Anger and lust are like fire; water extinguishes fire. Cold water resets your nervous system."
  },
  {
    titleRoman: "2 Rakat Salatut-Taubah",
    titleUrdu: "دو رکعت صلوٰۃ التوبہ ادا کریں",
    titleEn: "Pray 2 Rak'ahs of Repentance",
    descRoman: "Nafs ko saza dein: 'Agar tune buraai ki taraf khaincha toh main 2 rakat nafl parh kar Allah ke qareeb ho jaunga.'",
    descUrdu: "نفس کو سیدھا کرنے کا بہترین طریقہ یہ ہے کہ گناہ کے ارادے کے بدلے نیکی کا اضافہ کریں۔",
    descEn: "Turn the urge upside down: reward your soul with 2 units of prayer whenever temptation knocks."
  },
  {
    titleRoman: "5 Minute Urge Surfing Rule",
    titleUrdu: "پانچ منٹ کا اصول (خواہش جلد ٹوٹ جاتی ہے)",
    titleEn: "5-Minute Urge Surfing Protocol",
    descRoman: "Duniya ki koi bhi fizool talab 5 se 10 minute se zyada apne urooj par nahi rehti. Sirf aglay 5 minute sabr karein.",
    descUrdu: "سائنسی اور روحانی حقیقت: نفس کی شدید طلب صرف چند منٹ کی ہوتی ہے، ذرا سا رخ موڑیں تو غائب ہو جاتی ہے۔",
    descEn: "Neurological & spiritual fact: intense compulsive urges fade within 5 to 10 minutes if you do not feed them."
  }
];

export const ISLAMIC_FITNESS_WISDOM = [
  {
    arabic: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ، وَفِي كُلٍّ خَيْرٌ",
    reference: "Sahih Muslim 2664",
    romanUrdu: "Taaqatwar momin, kamzor momin se behtar aur Allah ko zyada mehboob hai, halanke khair dono mein hai.",
    urdu: "طاقتور مومن، کمزور مومن کے مقابلے میں اللہ کے ہاں زیادہ بہتر اور زیادہ محبوب ہے، حالانکہ دونوں میں خیر ہے۔",
    english: "The strong believer is better and more beloved to Allah than the weak believer, while there is good in both."
  },
  {
    arabic: "وَإِنَّ لِجَسَدِكَ عَلَيْكَ حَقًّا",
    reference: "Sahih al-Bukhari 5199",
    romanUrdu: "Aur beshak tumhare jism ka bhi tum par haq hai.",
    urdu: "اور یقیناً تمہارے جسم کا بھی تم پر حق ہے۔",
    english: "And indeed, your body has a right over you."
  },
  {
    arabic: "عَلِّمُوا أَوْلَادَكُمُ السِّبَاحَةَ وَالرِّمَايَةَ وَرُكُوبَ الْخَيْلِ",
    reference: "Saying of Umar ibn al-Khattab (RA)",
    romanUrdu: "Apni aulaad ko tayraaki (swimming), teer-andazi (archery) aur ghur-sawari (horse riding) sikhao.",
    urdu: "اپنی اولاد کو تیراکی، تیر اندازی اور گھڑ سواری سکھاؤ۔",
    english: "Teach your children swimming, archery, and horse riding."
  }
];
