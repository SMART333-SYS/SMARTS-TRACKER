// Catalog of verified YouTube video IDs and audio presets for instant playback

export interface SongCatalogItem {
  id: string;
  title: string;
  artist: string;
  category: 'Nusrat Fateh Ali Khan' | 'Emraan Hashmi' | 'Bollywood Hits' | 'Gym Mashup' | 'Nasheed' | 'Punjabi & Pop' | 'Sad & Soulful' | 'Song Bajao (Bajao.pk)';
  youtubeId: string;
  youtubeUrl: string;
  keywords: string[];
  bpm: number;
  durationText: string;
  audioNotes?: string;
  externalUrl?: string;
}

export const POPULAR_SONG_CATALOG: SongCatalogItem[] = [
  // 1. Nusrat Fateh Ali Khan - The Legendary Qawwalis (User Request: "nusrat fateh ali khan ki qauwali")
  {
    id: 'nusk_ye_jo_halka',
    title: 'Ye Jo Halka Halka Suroor Hai (یہ جو ہلکا ہلکا سرور ہے)',
    artist: 'Ustad Nusrat Fateh Ali Khan - Classical Qawwali',
    category: 'Nusrat Fateh Ali Khan',
    youtubeId: 'UIPXHsUXVH0',
    youtubeUrl: 'https://youtu.be/UIPXHsUXVH0',
    keywords: ['nusrat', 'nusrat fateh ali khan', 'qawwali', 'halka halka', 'ye jo halka', 'suroor', 'ustad nusrat'],
    bpm: 116,
    durationText: '16:25',
    audioNotes: 'Mystical Sufi Tabla & Harmonium Groove with ecstatic vocal improvisation.',
  },
  {
    id: 'nusk_rashke_qamar',
    title: 'Mere Rashke Qamar (میرے رشک قمر - اصل قوالی)',
    artist: 'Ustad Nusrat Fateh Ali Khan - Original Qawwali',
    category: 'Nusrat Fateh Ali Khan',
    youtubeId: 'gY01irEl8Eo',
    youtubeUrl: 'https://youtu.be/gY01irEl8Eo',
    keywords: ['rashke qamar', 'mere rashke qamar', 'nusrat rashke qamar', 'qawali', 'fateh ali khan'],
    bpm: 124,
    durationText: '17:37',
    audioNotes: 'High-tempo clapping, dholak rhythm, and soaring harmonium scale.',
  },
  {
    id: 'nusk_dam_mast_qalandar',
    title: 'Dam Mast Qalandar (دم مست قلندر مست مست)',
    artist: 'Ustad Nusrat Fateh Ali Khan - Sufi Dhikr Qawwali',
    category: 'Nusrat Fateh Ali Khan',
    youtubeId: 'SKZAiWSquA0',
    youtubeUrl: 'https://youtu.be/SKZAiWSquA0',
    keywords: ['dam mast qalandar', 'mast mast', 'lal meri pat', 'nusrat qalandar', 'jhulelal'],
    bpm: 132,
    durationText: '14:21',
    audioNotes: 'Energetic trance tempo, dynamic percussive beats, and devotional call-and-response.',
  },
  {
    id: 'nusk_dillagi',
    title: 'Tumhe Dillagi Bhool Jani Paregi (تمہیں دل لگی بھول جانی پڑے گی)',
    artist: 'Ustad Nusrat Fateh Ali Khan - Soulful Qawwali',
    category: 'Nusrat Fateh Ali Khan',
    youtubeId: 'q4NVp-aFZSw',
    youtubeUrl: 'https://youtu.be/q4NVp-aFZSw',
    keywords: ['tumhe dillagi', 'dillagi', 'bhool jani paregi', 'nusrat dillagi', 'muhabbat ki rahon'],
    bpm: 114,
    durationText: '16:12',
    audioNotes: 'Soulful melodic harmonium lines with deep emotional vocal resonance.',
  },
  {
    id: 'nusk_sanson_ki_mala',
    title: 'Sanson Ki Mala Pe (سانسوں کی مالا پہ سمروں میں)',
    artist: 'Ustad Nusrat Fateh Ali Khan - Devotional Masterpiece',
    category: 'Nusrat Fateh Ali Khan',
    youtubeId: 'eYSaHXXFIBU',
    youtubeUrl: 'https://youtu.be/eYSaHXXFIBU',
    keywords: ['sanson ki mala', 'simroon main', 'nusrat sanson', 'pi ka naam', 'classic qawwali'],
    bpm: 118,
    durationText: '13:32',
    audioNotes: 'Meditative rhythmic cadence blending harmonium and spiritual beats.',
  },
  {
    id: 'nusk_allah_hoo',
    title: 'Allah Hoo Allah Hoo (اللہ ہو اللہ ہو - روح پرور حمد)',
    artist: 'Ustad Nusrat Fateh Ali Khan - Hamd-o-Sana',
    category: 'Nusrat Fateh Ali Khan',
    youtubeId: 'Nqwmh4WXMmo',
    youtubeUrl: 'https://youtu.be/Nqwmh4WXMmo',
    keywords: ['allah hoo', 'allah hu', 'nusrat hamd', 'zikr', 'sufi hamd', 'choti screen'],
    bpm: 120,
    durationText: '14:24',
    audioNotes: 'Serene spiritual dhikr progression in Maqam Rast and Hijaz.',
  },
  {
    id: 'nusk_kali_kali_zulfon',
    title: 'Kali Kali Zulfon Ke Phande Na Dalo (کالی کالی زلفوں کے)',
    artist: 'Ustad Nusrat Fateh Ali Khan',
    category: 'Nusrat Fateh Ali Khan',
    youtubeId: 'lsqsggtTZfs',
    youtubeUrl: 'https://youtu.be/lsqsggtTZfs',
    keywords: ['kali kali zulfon', 'zulfon ke phande', 'nusrat romantic qawwali'],
    bpm: 122,
    durationText: '14:27',
    audioNotes: 'Classic rhythmic swing with vocal sargam and harmonium countermelodies.',
  },
  {
    id: 'nusk_kinna_sohna',
    title: 'Kinna Sohna Tenu Rab Ne Banaya (کنا سوہنا تینوں رب نے بنایا)',
    artist: 'Ustad Nusrat Fateh Ali Khan',
    category: 'Nusrat Fateh Ali Khan',
    youtubeId: 'L5bD5pGhk6E',
    youtubeUrl: 'https://youtu.be/L5bD5pGhk6E',
    keywords: ['kinna sohna', 'rab ne banaya', 'nusrat punjabi', 'dil karda'],
    bpm: 126,
    durationText: '6:53',
    audioNotes: 'Uplifting Punjabi romantic sufi groove.',
  },

  // 2. Emraan Hashmi Superhit Hits & Mashups (User Request: "imran hasmi ky songs audio")
  {
    id: 'emraan_vol_1',
    title: 'Emraan Hashmi Hits - Superhit Mashup Vol 1',
    artist: 'Zara Sa, Woh Lamhe, Toh Phir Aao, Jannat, Zeher',
    category: 'Emraan Hashmi',
    youtubeId: 'UbuhuRVoieA',
    youtubeUrl: 'https://youtu.be/UbuhuRVoieA',
    keywords: ['emraan', 'imran', 'hashmi', 'hasmi', 'mashup', 'vol 1', 'jannat', 'zeher', 'awarapan'],
    bpm: 126,
    durationText: '24:37',
    audioNotes: 'Power rock chords with driving cardio bass and Pritam melodies.',
  },
  {
    id: 'emraan_vol_2',
    title: 'Emraan Hashmi Mega Mashup Vol 2',
    artist: 'Dil Sambhal Ja Zara, Tu Hi Haqeeqat, Phir Mohabbat',
    category: 'Emraan Hashmi',
    youtubeId: 'xDn-3GYbRQQ',
    youtubeUrl: 'https://youtu.be/xDn-3GYbRQQ',
    keywords: ['emraan 2', 'mega mashup', 'dil sambhal ja zara', 'tu hi haqeeqat', 'phir mohabbat', 'vol 2'],
    bpm: 128,
    durationText: '7:09',
    audioNotes: 'Modern synth bass and romantic guitar arpeggios.',
  },
  {
    id: 'emraan_zara_sa',
    title: 'Zara Sa (Jannat) - KK',
    artist: 'KK, Pritam, Emraan Hashmi',
    category: 'Emraan Hashmi',
    youtubeId: '-8C_2BBVWk8',
    youtubeUrl: 'https://youtu.be/-8C_2BBVWk8',
    keywords: ['zara sa', 'zara sa dil me de jagah tu', 'jannat', 'kk', 'pritam', 'zara'],
    bpm: 122,
    durationText: '5:08',
    audioNotes: 'Legendary melodic rock anthem with soaring vocals and electric guitar riffs.',
  },
  {
    id: 'emraan_woh_lamhe',
    title: 'Woh Lamhe Woh Baatein (Zeher)',
    artist: 'Atif Aslam, Emraan Hashmi',
    category: 'Emraan Hashmi',
    youtubeId: 'isLyWDUYfTg',
    youtubeUrl: 'https://youtu.be/isLyWDUYfTg',
    keywords: ['woh lamhe', 'wo lamhe', 'zeher', 'na jaane koi', 'kaisi hai yeh rut', 'atif aslam'],
    bpm: 124,
    durationText: '5:21',
    audioNotes: 'Atif Aslam vocal magic backed by acoustic rock instrumentation.',
  },
  {
    id: 'emraan_pee_loon',
    title: 'Pee Loon (Once Upon A Time In Mumbaai)',
    artist: 'Mohit Chauhan, Pritam, Emraan Hashmi',
    category: 'Emraan Hashmi',
    youtubeId: 'D8XFTglfSMg',
    youtubeUrl: 'https://youtu.be/D8XFTglfSMg',
    keywords: ['pee loon', 'tere nill nile nainon', 'once upon a time in mumbaai', 'mohit chauhan', 'emraan'],
    bpm: 112,
    durationText: '4:16',
    audioNotes: 'Soothing romantic Sufi-rock ballad with warm acoustics.',
  },
  {
    id: 'emraan_dil_ibaadat',
    title: 'Dil Ibaadat Kar Raha Hai (Tum Mile)',
    artist: 'KK, Pritam, Emraan Hashmi',
    category: 'Emraan Hashmi',
    youtubeId: 'U2QNhsAgIIE',
    youtubeUrl: 'https://youtu.be/U2QNhsAgIIE',
    keywords: ['dil ibaadat', 'dil ibadat', 'tum mile', 'kk', 'dhadkane meri sun'],
    bpm: 120,
    durationText: '5:28',
    audioNotes: 'Passionate melodic phrasing with driving drums.',
  },
  {
    id: 'emraan_toh_phir_aao',
    title: 'Toh Phir Aao (Awarapan)',
    artist: 'Mustafa Zahid, Emraan Hashmi',
    category: 'Emraan Hashmi',
    youtubeId: 'h5-Kq9k3zeo',
    youtubeUrl: 'https://youtu.be/h5-Kq9k3zeo',
    keywords: ['toh phir aao', 'to phir ao', 'awarapan', 'mustafa zahid', 'phir aao'],
    bpm: 120,
    durationText: '5:47',
    audioNotes: 'Intense rock progression with Pakistani rock signature sound.',
  },
  {
    id: 'emraan_tu_hi_meri_shab',
    title: 'Tu Hi Meri Shab Hai (Gangster)',
    artist: 'KK, Pritam, Emraan Hashmi',
    category: 'Emraan Hashmi',
    youtubeId: '4aonHAp21aA',
    youtubeUrl: 'https://youtu.be/4aonHAp21aA',
    keywords: ['tu hi meri shab hai', 'gangster', 'tu hi din hai mera', 'shab hai', 'kk'],
    bpm: 118,
    durationText: '6:28',
    audioNotes: 'Guitar picking and timeless romantic chorus.',
  },
  {
    id: 'emraan_hale_dil',
    title: 'Hale Dil Tujhko Sunata (Murder 2)',
    artist: 'Harshit Saxena, Emraan Hashmi',
    category: 'Emraan Hashmi',
    youtubeId: 'uSibwB2TQC4',
    youtubeUrl: 'https://youtu.be/uSibwB2TQC4',
    keywords: ['hale dil', 'haal e dil', 'murder 2', 'harshit saxena', 'tujhko sunata'],
    bpm: 126,
    durationText: '5:48',
    audioNotes: 'Mid-tempo groove with memorable melody.',
  },
  {
    id: 'emraan_beete_lamhein',
    title: 'Beete Lamhein (The Train)',
    artist: 'KK, Mithoon, Emraan Hashmi',
    category: 'Emraan Hashmi',
    youtubeId: 'UlacMvx_VYk',
    youtubeUrl: 'https://youtu.be/UlacMvx_VYk',
    keywords: ['beete lamhein', 'the train', 'dard dilon ke kam ho jaate', 'kk', 'mithoon'],
    bpm: 120,
    durationText: '5:33',
    audioNotes: 'Deep emotional KK vocals and melancholic strings.',
  },
  {
    id: 'emraan_bheegey_hont',
    title: 'Bheegey Hont Tere (Murder)',
    artist: 'Kunal Ganjawala, Anu Malik, Emraan Hashmi',
    category: 'Emraan Hashmi',
    youtubeId: 'XkDSrnDB6Tc',
    youtubeUrl: 'https://youtu.be/XkDSrnDB6Tc',
    keywords: ['bheegey hont', 'murder', 'kunal ganjawala', 'emraan classic'],
    bpm: 116,
    durationText: '4:38',
    audioNotes: 'Lush atmospheric pads and syncopated beat.',
  },
  {
    id: 'emraan_judai',
    title: 'Judai - Jannat',
    artist: 'Kamran Ahmed, Pritam, Emraan Hashmi',
    category: 'Emraan Hashmi',
    youtubeId: 'sSFM_hCFgko',
    youtubeUrl: 'https://youtu.be/sSFM_hCFgko',
    keywords: ['judai', 'jannat judai', 'kamran ahmed', 'jannat song', 'emraan'],
    bpm: 114,
    durationText: '5:02',
    audioNotes: 'Acoustic lament with heavy emotive chorus.',
  },

  // 3. Sufi, Halal Nasheeds & Spiritual Tracks
  {
    id: 'tajdar_e_haram',
    title: 'Tajdar-e-Haram - Coke Studio 8',
    artist: 'Atif Aslam, Sabri Brothers Heritage',
    category: 'Nasheed',
    youtubeId: 'a18py61Ec38',
    youtubeUrl: 'https://youtu.be/a18py61Ec38',
    keywords: ['tajdar', 'tajdare haram', 'atif aslam', 'coke studio', 'sufi', 'sabri'],
    bpm: 108,
    durationText: '10:28',
    audioNotes: 'Spiritual Sufi prayer with rich tabla and harmonium.',
  },
  {
    id: 'hasbi_rabbi',
    title: 'Hasbi Rabbi Jallallah (Vocal Duff Workout)',
    artist: 'Halal Motivational Nasheed Beat',
    category: 'Nasheed',
    youtubeId: '9j3oW4qU1-A',
    youtubeUrl: 'https://youtu.be/9j3oW4qU1-A',
    keywords: ['hasbi rabbi', 'nasheed', 'halal beat', 'sami yusuf', 'duff', 'islamic song'],
    bpm: 120,
    durationText: '4:15',
    audioNotes: 'Pure acoustic duff percussion rhythm.',
  },
  {
    id: 'kun_faya_kun',
    title: 'Kun Faya Kun (Rockstar)',
    artist: 'A.R. Rahman, Mohit Chauhan, Javed Ali',
    category: 'Nasheed',
    youtubeId: 'T94PHkuydcw',
    youtubeUrl: 'https://youtu.be/T94PHkuydcw',
    keywords: ['kun faya kun', 'rockstar', 'ar rahman', 'sufi', 'mohit chauhan'],
    bpm: 112,
    durationText: '7:52',
    audioNotes: 'A.R. Rahman spiritual masterpiece with harmonium and choir.',
  },

  // 4. Pakistani Superhits & Coke Studio Classics
  {
    id: 'pasoori_coke_studio',
    title: 'Pasoori - Coke Studio 14',
    artist: 'Ali Sethi x Shae Gill',
    category: 'Bollywood Hits',
    youtubeId: '5Eqb_-j3FDA',
    youtubeUrl: 'https://youtu.be/5Eqb_-j3FDA',
    keywords: ['pasoori', 'ali sethi', 'shae gill', 'coke studio 14', 'agrawan'],
    bpm: 122,
    durationText: '3:44',
  },
  {
    id: 'kahani_suno_kaifi',
    title: 'Kahani Suno 2.0',
    artist: 'Kaifi Khalil',
    category: 'Sad & Soulful',
    youtubeId: '_XbvHgP_jXk',
    youtubeUrl: 'https://youtu.be/_XbvHgP_jXk',
    keywords: ['kahani suno', 'kaifi khalil', 'kahani suno 2.0', 'mujhe pyar hua tha', 'kaifi'],
    bpm: 110,
    durationText: '3:20',
  },
  {
    id: 'afreen_coke_studio',
    title: 'Afreen Afreen - Coke Studio 9',
    artist: 'Rahat Fateh Ali Khan & Momina Mustehsan',
    category: 'Bollywood Hits',
    youtubeId: 'kw4tT7SCmaY',
    youtubeUrl: 'https://youtu.be/kw4tT7SCmaY',
    keywords: ['afreen afreen', 'afreen', 'rahat fateh ali khan', 'momina mustehsan', 'coke studio'],
    bpm: 112,
    durationText: '6:45',
  },

  // 5. High Energy Gym Workout Mashups
  {
    id: 'gym_epic_mashup',
    title: 'Iron Faith - High Energy Gym Workout Mashup',
    artist: 'Motivational Heavy Bass & Electronic Rhythms',
    category: 'Gym Mashup',
    youtubeId: 'UbuhuRVoieA',
    youtubeUrl: 'https://youtu.be/UbuhuRVoieA',
    keywords: ['gym mashup', 'iron faith', 'workout mashup', 'cardio beat', 'heavy lift', 'gym song'],
    bpm: 135,
    durationText: '6:20',
  },
];

// Helper function to resolve any typed song name to the closest matched video ID
export function resolveSongSearch(query: string): SongCatalogItem | null {
  if (!query) return null;
  const q = query.toLowerCase().trim();

  // 1. Direct title match or artist match
  const directMatch = POPULAR_SONG_CATALOG.find(
    (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
  );
  if (directMatch) return directMatch;

  // 2. Keyword match (includes words inside query)
  const queryTokens = q.split(/[\s,+-]+/).filter((t) => t.length > 2);
  const keywordMatch = POPULAR_SONG_CATALOG.find((s) => {
    if (s.keywords.some((k) => q.includes(k) || k.includes(q))) return true;
    return queryTokens.some((token) => s.keywords.some((k) => k.includes(token)));
  });
  if (keywordMatch) return keywordMatch;

  // 3. Fallbacks based on artist or mood words
  if (q.includes('nusrat') || q.includes('fateh') || q.includes('qawali') || q.includes('qawwali') || q.includes('qauwali')) {
    if (q.includes('rashk') || q.includes('qamar')) return POPULAR_SONG_CATALOG.find((s) => s.id === 'nusk_rashke_qamar') || POPULAR_SONG_CATALOG[1];
    if (q.includes('dam') || q.includes('mast') || q.includes('qalandar')) return POPULAR_SONG_CATALOG.find((s) => s.id === 'nusk_dam_mast_qalandar') || POPULAR_SONG_CATALOG[2];
    if (q.includes('dillagi')) return POPULAR_SONG_CATALOG.find((s) => s.id === 'nusk_dillagi') || POPULAR_SONG_CATALOG[3];
    if (q.includes('sanson')) return POPULAR_SONG_CATALOG.find((s) => s.id === 'nusk_sanson_ki_mala') || POPULAR_SONG_CATALOG[4];
    if (q.includes('allah') || q.includes('hamd')) return POPULAR_SONG_CATALOG.find((s) => s.id === 'nusk_allah_hoo') || POPULAR_SONG_CATALOG[5];
    return POPULAR_SONG_CATALOG[0]; // Ye jo halka halka
  }

  if (q.includes('emraan') || q.includes('imran') || q.includes('hasmi') || q.includes('hashmi')) {
    if (q.includes('zara')) return POPULAR_SONG_CATALOG.find((s) => s.id === 'emraan_zara_sa') || POPULAR_SONG_CATALOG[10];
    if (q.includes('woh') || q.includes('lamhe')) return POPULAR_SONG_CATALOG.find((s) => s.id === 'emraan_woh_lamhe') || POPULAR_SONG_CATALOG[11];
    if (q.includes('pee loon') || q.includes('pi loon')) return POPULAR_SONG_CATALOG.find((s) => s.id === 'emraan_pee_loon') || POPULAR_SONG_CATALOG[12];
    if (q.includes('dil ibadat') || q.includes('dil ibaadat')) return POPULAR_SONG_CATALOG.find((s) => s.id === 'emraan_dil_ibaadat') || POPULAR_SONG_CATALOG[13];
    if (q.includes('2') || q.includes('two') || q.includes('mega')) return POPULAR_SONG_CATALOG.find((s) => s.id === 'emraan_vol_2') || POPULAR_SONG_CATALOG[9];
    return POPULAR_SONG_CATALOG.find((s) => s.id === 'emraan_vol_1') || POPULAR_SONG_CATALOG[8];
  }

  if (q.includes('tajdar') || q.includes('atif')) {
    return POPULAR_SONG_CATALOG.find((s) => s.id === 'tajdar_e_haram') || POPULAR_SONG_CATALOG[18];
  }

  // Default to Nusrat or Emraan Hashmi Vol 1
  return POPULAR_SONG_CATALOG[0];
}

// Search suggestions filter
export function searchSongCatalog(query: string, limit = 8): SongCatalogItem[] {
  if (!query) return POPULAR_SONG_CATALOG.slice(0, limit);
  const q = query.toLowerCase().trim();
  const results = POPULAR_SONG_CATALOG.filter((s) => {
    return (
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.keywords.some((k) => k.includes(q))
    );
  });
  return results.slice(0, limit);
}
