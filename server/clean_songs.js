import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import Song from './src/models/Song.js';

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await Song.deleteMany({});
    console.log('Deleted songs count:', result.deletedCount);
    process.exit(0);
  } catch (err) {
    console.error('Error cleaning songs:', err);
    process.exit(1);
  }
})();
