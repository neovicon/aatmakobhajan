import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Load models
import Song from './src/models/Song.js';
import User from './src/models/User.js';

const devanagariMap = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'i', 'उ': 'u', 'ऊ': 'u', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'wa', 'श': 'sha', 'ष': 'sha', 'स': 'sa', 'ह': 'ha',
  'क्ष': 'ksha', 'त्र': 'tra', 'ज्ञ': 'gya',
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ः': 'h', '्': '', 'ृ': 'ri',
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  '।': '.', '—': '-', '–': '-'
};

function romanize(text) {
  if (!text) return '';
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    result += devanagariMap[char] !== undefined ? devanagariMap[char] : char;
  }
  return result;
}

const generateSlug = (title, num) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + num;
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected');

    // Clean existing songs to ensure fresh chronological order
    await Song.deleteMany({});
    console.log('Existing songs cleared');

    const user = await User.findOne();
    if (!user) {
      console.log('No user found to set createdBy');
      process.exit(1);
    }

    const text = fs.readFileSync('output.txt', 'utf-8');
    const pages = text.split('\f');
    let songs = [];
    let currentSong = null;

    for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
      const pageNum = pageIdx + 1;
      const lines = pages[pageIdx].split('\n');

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        // Match "भजन <number> <title>" or "(भजन <number> <title>)"
        // Match lines that start with the bhajan marker and capture the song number and title
        const match = line.match(/^\s*\(?भजन\s*([०-९0-9]+)\s+(.*?)\)?\s*$/);
        if (match) {
          // If we were building a previous song, push it to the list
          if (currentSong) {
            songs.push(currentSong);
          }

          // Separate the numeric part (could be Nepali or Arabic digits) and the title text
          const rawNumber = match[1];
          const titleText = match[2].replace(/\)/g, '').trim();
          const englishNumber = romanize(rawNumber).replace(/[^0-9]/g, ''); // Convert Nepali digits to English

            currentSong = {
              title: titleText, // title without the number
              artist: 'Gyan Bahadur Lama',
              writer: 'Gyan Bahadur Lama',
              tags: [`page${pageNum}`, `bhajan${englishNumber}`], // song number stored as a tag
              pageNum: pageNum,
              bhajanNumber: parseInt(englishNumber, 10) || 0,
              nepaliLyrics: '',
              romanizedLyrics: '',
              createdBy: user._id,
              slug: generateSlug(romanize(titleText), englishNumber || Date.now())
            };
        } else if (currentSong) {
          // Accumulate lyric lines for the current song
          currentSong.nepaliLyrics += line + '\n';
        }
      }
    }

    if (currentSong) {
      songs.push(currentSong);
    }
    // Sort songs by page number then bhajan number for chronological order
    songs.sort((a, b) => {
      if (a.pageNum !== b.pageNum) return a.pageNum - b.pageNum;
      return a.bhajanNumber - b.bhajanNumber;
    });
    console.log(`Found ${songs.length} songs. Proceeding to insert...`);

    let inserted = 0;
    for (let s of songs) {
      s.nepaliLyrics = s.nepaliLyrics.trim();
      s.romanizedLyrics = romanize(s.nepaliLyrics);
      
      try {
        // Try creating song
        await Song.create({
          title: s.title,
          slug: s.slug,
          artist: s.artist,
          writer: s.writer,
          category: 'bhajan',
          tags: s.tags,
          nepaliLyrics: s.nepaliLyrics,
          romanizedLyrics: s.romanizedLyrics || s.title,
          createdBy: s.createdBy
        });
        inserted++;
      } catch (err) {
        // If duplicate slug, append random string
        if (err.code === 11000) {
           try {
             await Song.create({
                ...s,
                slug: s.slug + '-' + Math.floor(Math.random()*10000)
             });
             inserted++;
           } catch (e2) {
             console.log(`Failed duplicate for: ${s.title}`);
           }
        } else {
           console.log(`Error inserting ${s.title}: ${err.message}`);
        }
      }
    }

    console.log(`Successfully inserted ${inserted} songs.`);
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
