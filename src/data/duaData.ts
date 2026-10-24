// Authentic Daily Duas & Supplications Library with Arabic, Urdu, Roman Urdu & English

export interface DuaItem {
  id: string;
  titleUrdu: string;
  titleRoman: string;
  titleEn: string;
  arabic: string;
  transliteration: string;
  urdu: string;
  romanUrdu: string;
  english: string;
  reference: string;
  benefitUrdu: string;
  benefitRoman: string;
  benefitEn: string;
  category: 'daily' | 'morning_evening' | 'health_strength' | 'anxiety_peace' | 'rizq_barakah' | 'parents_family' | 'sleep_waking' | 'nafs_protection';
  recommendedCount: number;
}

export const DUA_CATEGORIES = [
  { id: 'all', nameUrdu: 'تمام دعائیں', nameRoman: 'Tamam Duain', nameEn: 'All Duas' },
  { id: 'daily', nameUrdu: 'آج کی دعا', nameRoman: 'Dua of the Day', nameEn: 'Daily Dua' },
  { id: 'morning_evening', nameUrdu: 'صبح و شام', nameRoman: 'Subah Sham', nameEn: 'Morning & Evening' },
  { id: 'health_strength', nameUrdu: 'صحت و طاقت', nameRoman: 'Sehat o Taqat', nameEn: 'Health & Strength' },
  { id: 'anxiety_peace', nameUrdu: 'پریشانی و سکون', nameRoman: 'Pareshani o Sukoon', nameEn: 'Anxiety Relief' },
  { id: 'rizq_barakah', nameUrdu: 'رزق و برکت', nameRoman: 'Rizq o Barkat', nameEn: 'Rizq & Wealth' },
  { id: 'parents_family', nameUrdu: 'والدین و مغفرت', nameRoman: 'Walidain', nameEn: 'Parents & Forgiveness' },
  { id: 'nafs_protection', nameUrdu: 'نفس و وسوسے', nameRoman: 'Nafs Protection', nameEn: 'Protection from Evil' },
  { id: 'sleep_waking', nameUrdu: 'سونے جاگنے', nameRoman: 'Sone Jagne', nameEn: 'Sleep & Waking' },
] as const;

export const DUA_LIBRARY: DuaItem[] = [
  {
    id: 'dua_huda_taqwa',
    titleUrdu: 'ہدایت، تقویٰ اور پاکدامنی کی دعا',
    titleRoman: 'Hidayat, Taqwa aur Paakdamani ki Dua',
    titleEn: 'Dua for Guidance, Piety & Chastity',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    transliteration: "Allahumma inni as'alukal-huda, wat-tuqa, wal-'afafa, wal-ghina",
    urdu: 'اے اللہ! میں تجھ سے ہدایت، تقویٰ، پاکدامنی اور بے نیازی (غنا) کا سوال کرتا ہوں۔',
    romanUrdu: 'Aye Allah! Main tujh se hidayat, taqwa, paakdamani aur be-niyazi (ghina) ka sawal karta hoon.',
    english: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.',
    reference: 'صحیح مسلم (Sahih Muslim: 2721)',
    benefitUrdu: 'نبی کریم ﷺ یہ دعا کثرت سے فرماتے تھے۔ یہ دین و دنیا کی تمام بھلائیوں کو سمیٹ لیتی ہے۔',
    benefitRoman: 'Nabi Kareem (SAW) ye dua kasrat se farmate thay. Deen aur dunya ki tamam bhalaiyan isme hain.',
    benefitEn: 'A comprehensive prophetic supplication for spiritual purity, moral protection, and contentment.',
    category: 'daily',
    recommendedCount: 3,
  },
  {
    id: 'sayyidul_istighfar',
    titleUrdu: 'سید الاستغفار (بخشش کی سب سے بڑی دعا)',
    titleRoman: 'Sayyidul Istighfar (Bakhshish ki Sabse Badi Dua)',
    titleEn: 'Master of Seeking Forgiveness',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ',
    transliteration: "Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi faghfir li, fa-innahu la yaghfirudh-dhunuba illa Anta.",
    urdu: 'اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے ہی مجھے پیدا کیا اور میں تیرا ہی بندہ ہوں، اور میں اپنی طاقت کے مطابق تیرے عہد اور وعدے پر قائم ہوں۔ میں اپنے کیے کے شر سے تیری پناہ مانگتا ہوں، اپنے اوپر تیری نعمتوں کا اقرار کرتا ہوں اور اپنے گناہوں کا اعتراف کرتا ہوں، پس مجھے بخش دے کیونکہ تیرے سوا کوئی گناہوں کو معاف نہیں کر سکتا۔',
    romanUrdu: 'Aye Allah! Tu hi mera Rab hai, tere siva koi mabood nahi. Tune mujhe banaya aur main tera banda hoon. Apne gunaho ki maafi mangta hoon.',
    english: 'O Allah, You are my Lord, there is no god but You. You created me and I am Your servant. I acknowledge Your favors and confess my sins; forgive me, for none forgives sins except You.',
    reference: 'صحیح بخاری (Sahih al-Bukhari: 6306)',
    benefitUrdu: 'جو شخص یقین کے ساتھ شام کو پڑھے اور اسی رات فوت ہو جائے تو وہ جنتی ہے، اور اگر صبح پڑھے اور اسی دن فوت ہو جائے تو جنتی ہے۔',
    benefitRoman: 'Jo shaks yaqeen ke sath subah ya sham parhe aur fout hojaye to Jannati hai.',
    benefitEn: 'Whoever recites it with conviction in the morning or evening and passes away will enter Paradise.',
    category: 'morning_evening',
    recommendedCount: 1,
  },
  {
    id: 'dua_anxiety_debts',
    titleUrdu: 'غم، پریشانی اور قرض سے نجات کی دعا',
    titleRoman: 'Gham, Pareshani aur Qarz se Nijat ki Dua',
    titleEn: 'Relief from Anxiety, Sorrow & Debt',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-jubni wal-bukhl, wa dala'id-dayni wa ghalabatir-rijal.",
    urdu: 'اے اللہ! میں فکر اور غم سے، کمزوری اور سستی سے، بزدلی اور بخل سے، قرض کے بوجھ اور لوگوں کے دباؤ سے تیری پناہ مانگتا ہوں۔',
    romanUrdu: 'Aye Allah! Main pareshani, gham, susti, kamzori, bukhl, qarz ke dabao aur dushmano ke ghalbe se teri panah chahta hoon.',
    english: 'O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, cowardice and stinginess, the burden of debt, and being overpowered by people.',
    reference: 'صحیح بخاری (Sahih al-Bukhari: 2893)',
    benefitUrdu: 'ذہنی تناؤ، سستی اور پریشانی دور کرنے کے لیے اکسیر نبوی نسخہ ہے۔ جم اور روزمرہ کاموں سے پہلے توانائی بخشتا ہے۔',
    benefitRoman: 'Dimaghi tension, susti aur qarz door karne ke liye behtareen Nabwi dua.',
    benefitEn: 'Dispels mental burnout, fatigue, lethargy, fear, and financial stress.',
    category: 'anxiety_peace',
    recommendedCount: 3,
  },
  {
    id: 'dua_health_body',
    titleUrdu: 'صحت، بدن اور سماعت و بصارت کی حفاظت',
    titleRoman: 'Sehat, Jism aur Aankhon Kaanon ki Hifazat',
    titleEn: 'Physical Health, Hearing & Eyesight',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ',
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa Anta.",
    urdu: 'اے اللہ! میرے بدن کو عافیت (صحت) بخش، اے اللہ! میرے کانوں کو عافیت بخش، اے اللہ! میری آنکھوں کو عافیت بخش، تیرے سوا کوئی معبود نہیں۔',
    romanUrdu: 'Aye Allah! Mere jism ko sehat ata farma, mere kano ko sehat ata farma, meri ankho ko sehat ata farma, tere siva koi mabood nahi.',
    english: 'O Allah, grant soundness to my body; O Allah, grant soundness to my hearing; O Allah, grant soundness to my sight. There is no god but You.',
    reference: 'سنن ابی داؤد (Sunan Abi Dawud: 5090)',
    benefitUrdu: 'صبح اور شام 3، 3 مرتبہ پڑھنے سے تمام اعضاء کی بیماریوں اور کمزوری سے حفاظت رہتی ہے۔',
    benefitRoman: 'Subah aur sham 3-3 bar parhne se jism, ankh aur kaan har bemari se mehfooz rehte hain.',
    benefitEn: 'Recite 3 times in morning and evening for divine vitality, stamina, and shielding against bodily illnesses.',
    category: 'health_strength',
    recommendedCount: 3,
  },
  {
    id: 'dua_rizq_ilm',
    titleUrdu: 'نفع بخش علم، پاکیزہ رزق اور مقبول عمل',
    titleRoman: 'Nafa Bakhsh Ilm, Halal Rizq aur Qabool Amal',
    titleEn: 'Beneficial Knowledge, Pure Rizq & Accepted Deeds',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً',
    transliteration: "Allahumma inni as'aluka 'ilman nafi'a, wa rizqan tayyiba, wa 'amalan mutaqabbala.",
    urdu: 'اے اللہ! میں تجھ سے نفع بخش علم، حلال اور پاکیزہ روزی، اور قبول ہونے والے عمل کا سوال کرتا ہوں۔',
    romanUrdu: 'Aye Allah! Main tujh se nafa dene wala ilm, halal pakiza rizq aur qubool hone wale amal ki dua karta hoon.',
    english: 'O Allah, I ask You for beneficial knowledge, wholesome sustenance, and deeds that are accepted.',
    reference: 'سنن ابن ماجہ (Sunan Ibn Majah: 925)',
    benefitUrdu: 'فجر کی نماز کے بعد پڑھنا سنت ہے۔ کاروبار، روزگار اور یادداشت میں برکت کے لیے تیر بہدف ہے۔',
    benefitRoman: 'Fajr ki namaz ke baad parhna Sunnat hai. Rozgar aur barkat ke liye behtareen.',
    benefitEn: 'Prophetic post-Fajr prayer for career barakah, purity in earnings, and intellect.',
    category: 'rizq_barakah',
    recommendedCount: 1,
  },
  {
    id: 'dua_parents',
    titleUrdu: 'والدین کے لیے رحمت و مغفرت کی دعا',
    titleRoman: 'Walidain ke liye Reham o Bakhshish ki Dua',
    titleEn: 'Supplication for Parents',
    arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: "Rabbir-hamhuma kama rabbayani sagheera.",
    urdu: 'اے میرے پروردگار! تو ان دونوں پر رحم فرما جیسا کہ انہوں نے مجھے بچپن میں پالا اور پرورش کی۔',
    romanUrdu: 'Aye mere Rab! Tu mere walidain par reham farma jese unho ne mujhe bachpan me paala.',
    english: 'My Lord, have mercy upon them as they brought me up when I was small.',
    reference: 'سورۃ الاسراء (Surah Al-Isra: 24)',
    benefitUrdu: 'والدین کی خدمت اور ان کے حق میں مغفرت کے لیے قرآن کریم کا عطا کردہ بہترین ہدیہ۔',
    benefitRoman: 'Walidain ki lambi umer, sehat aur agar marhoom hain to unki maghfirat ke liye Quran ki dua.',
    benefitEn: 'Quranic prayer invoking Allah’s boundless mercy for parents in this life and the hereafter.',
    category: 'parents_family',
    recommendedCount: 7,
  },
  {
    id: 'dua_nafs_evil',
    titleUrdu: 'برے خیالات، شہوت اور وسوسوں سے حفاظت',
    titleRoman: 'Bure Khayalat, Shehwat aur Waswaso se Hifazat',
    titleEn: 'Shielding Against Temptations & Evil Thoughts',
    arabic: 'رَّبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ',
    transliteration: "Rabbi a'udhu bika min hamazatish-shayateen, wa a'udhu bika Rabbi ay-yahduroon.",
    urdu: 'اے میرے رب! میں شیطانوں کے وسوسوں سے تیری پناہ مانگتا ہوں، اور اے میرے رب! میں تیری پناہ مانگتا ہوں اس سے کہ وہ میرے پاس آئیں۔',
    romanUrdu: 'Aye mere Rab! Main shaitan ke bure waswaso aur khayalo se teri panah mangta hoon.',
    english: 'My Lord, I seek refuge in You from the incitements of the devils, and I seek refuge in You lest they be present with me.',
    reference: 'سورۃ المؤمنون (Surah Al-Mu’minun: 97-98)',
    benefitUrdu: 'جب بھی دل میں برا خیال، گناہ کی طرف رغبت یا فحش وسوسہ آئے تو فوری 3 بار پڑھیں۔ دل کو پاک کرتا ہے۔',
    benefitRoman: 'Jab bhi koi bura khayal ya nafs ka hamla ho, foran 3 bar parhein. Nafs qaboo me ata hai.',
    benefitEn: 'Instant spiritual armor whenever intrusive thoughts, temptations, or impulses arise.',
    category: 'nafs_protection',
    recommendedCount: 3,
  },
  {
    id: 'dua_yunus_karb',
    titleUrdu: 'دعاۓ یونس (مشکلات و مصیبت سے نجات)',
    titleRoman: 'Dua-e-Yunus (Mushkilat o Museebat se Nijat)',
    titleEn: 'Ayah Kareema (Relief from Distresses)',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa Anta subhanaka inni kuntu minaz-zalimeen.',
    urdu: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ہی قصورواروں میں سے ہوں۔',
    romanUrdu: 'Tere siva koi mabood nahi, tu pak hai, beshak main hi qasoor-war hoon.',
    english: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
    reference: 'سورۃ الانبیاء (Surah Al-Anbiya: 87)',
    benefitUrdu: 'حضرت یونس علیہ السلام نے مچھلی کے پیٹ میں یہ دعا پڑھی۔ کوئی بھی مسلمان جب کسی مصیبت میں یہ پڑھے تو اللہ قبول فرماتا ہے۔',
    benefitRoman: 'Jo musalman kisi bhi mushkil waqt me ye parhta hai, Allah uski mushkil asan farmata hai.',
    benefitEn: 'Recited by Prophet Yunus inside the whale; the Prophet (SAW) confirmed every believer’s call with this is answered.',
    category: 'anxiety_peace',
    recommendedCount: 7,
  },
  {
    id: 'ayat_al_kursi',
    titleUrdu: 'آیت الکرسی (قرآن کی عظیم ترین آیت)',
    titleRoman: 'Ayat al-Kursi (Quran ki Azeem Tareen Ayat)',
    titleEn: 'The Throne Verse (Ultimate Protection)',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: "Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta'khudhuhu sinatuw-wala nawm. Lahu ma fis-samawati wa ma fil-ard...",
    urdu: 'اللہ، جس کے سوا کوئی معبود نہیں، وہ زندہ ہے سب کا تھامنے والا، نہ اسے اونگھ آتی ہے نہ نیند...',
    romanUrdu: 'Allah wo hai jiske siva koi mabood nahi, wo zinda hai aur sari kainaat ko qayam rakhne wala hai...',
    english: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence...',
    reference: 'سورۃ البقرۃ (Surah Al-Baqarah: 255)',
    benefitUrdu: 'ہر نماز کے بعد اور رات کو سونے سے پہلے پڑھنے والا اللہ تعالیٰ کی خصوصی حفاظت میں آ جاتا ہے۔',
    benefitRoman: 'Har farz namaz ke baad parhne se Jannat me dakhla aasan hota hai aur shaitan door rehta hai.',
    benefitEn: 'Recited after every obligatory prayer and before bed for supreme divine guardianship.',
    category: 'daily',
    recommendedCount: 1,
  },
  {
    id: 'dua_task_difficulty',
    titleUrdu: 'مشکل کام کو آسان کرنے کی دعا',
    titleRoman: 'Mushkil Kaam ko Asan Karne ki Dua',
    titleEn: 'Dua for Ease in Difficult Tasks',
    arabic: 'اللَّهُمَّ لاَ سَهْلَ إِلاَّ مَا جَعَلْتَهُ سَهْلاً، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلاً',
    transliteration: "Allahumma la sahla illa ma ja'altahu sahla, wa Anta taj'alul-hazna idha shi'ta sahla.",
    urdu: 'اے اللہ! کوئی کام آسان نہیں مگر جسے تو آسان بنا دے، اور تو جب چاہتا ہے مشکل اور غم کو آسان بنا دیتا ہے۔',
    romanUrdu: 'Aye Allah! Koi kaam asan nahi magar jise tu asan karde, aur tu chahe to mushkil ko asan bana deta hai.',
    english: 'O Allah, nothing is easy except what You make easy, and You make hardship easy if You will.',
    reference: 'صحیح ابن حبان (Sahih Ibn Hibban: 974)',
    benefitUrdu: 'جم میں بھاری وزن اٹھانے، امتحانات، انٹرویو یا کسی بھی مشکل منصوبے کا آغاز کرتے وقت پڑھیں۔',
    benefitRoman: 'Gym me heavy workout, mushkil kaam ya interview se pehle parhne se raste asan hote hain.',
    benefitEn: 'Recite before challenging tasks, exams, workouts, or high-stakes moments for divine ease.',
    category: 'health_strength',
    recommendedCount: 3,
  },
  {
    id: 'dua_sleep_bedtime',
    titleUrdu: 'سوتے وقت کی مسنون دعا',
    titleRoman: 'Sote Waqt ki Masnoon Dua',
    titleEn: 'Bedtime Protection Supplication',
    arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
    transliteration: "Bismika Rabbi wada'tu janbi wa bika arfa'uh. In amsakta nafsi farhamha, wa in arsaltaha fahfazha bima tahfazu bihi 'ibadakas-salihin.",
    urdu: 'تیرے نام کے ساتھ اے میرے رب! میں نے اپنا پہلو رکھا اور تیرے ہی نام کے ساتھ میں اسے اٹھاؤں گا۔ اگر تو میری روح روک لے تو اس پر رحم فرما، اور اگر تو اسے چھوڑ دے تو اس کی ویسے ہی حفاظت فرما جیسے تو اپنے نیک بندوں کی حفاظت فرماتا ہے۔',
    romanUrdu: 'Tere naam ke sath aye mere Rab! Maine karwat li aur tere sahare uthunga. Meri rooh ki hifazat farma.',
    english: 'In Your name my Lord, I put down my side and with Your help I will raise it up. If You take my soul, have mercy on it, and if You return it, protect it as You protect Your righteous slaves.',
    reference: 'صحیح بخاری (Sahih al-Bukhari: 6320)',
    benefitUrdu: 'رات کو برے خوابوں، خوف اور بے چینی سے محفوظ نیند عطا فرماتا ہے۔',
    benefitRoman: 'Pur-sukoon neend aur bure khwabo se hifazat ke liye sote waqt parhein.',
    benefitEn: 'Guarantees tranquil sleep free from nightmares and protects the soul through the night.',
    category: 'sleep_waking',
    recommendedCount: 1,
  },
];

// Computes deterministic Dua of the day based on date (Asia/Karachi UTC+5 day-of-year)
export function getDuaOfTheDay(dateKey?: string): DuaItem {
  let daySeed = 0;
  if (dateKey && dateKey.includes('-')) {
    const parts = dateKey.split('-').map(Number);
    daySeed = (parts[0] || 2026) * 365 + (parts[1] || 1) * 31 + (parts[2] || 1);
  } else {
    const now = new Date();
    daySeed = now.getFullYear() * 365 + (now.getMonth() + 1) * 31 + now.getDate();
  }
  const index = Math.abs(daySeed) % DUA_LIBRARY.length;
  return DUA_LIBRARY[index];
}
