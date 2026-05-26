import mongoose from 'mongoose';

const appInfoSchema = new mongoose.Schema({
  developerDescription: {
    type: String,
    default: 'Information about the developer goes here.'
  },
  writerDescription: {
    type: String,
    default: 'Information about the original lyric writers goes here.'
  },
  appDescription: {
    type: String,
    default: 'आत्मा को भजन is a platform for Nepali song lyrics and transliteration.'
  },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    github: { type: String, default: '' }
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const AppInfo = mongoose.model('AppInfo', appInfoSchema);
export default AppInfo;
