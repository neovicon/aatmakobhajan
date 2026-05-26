import mongoose from 'mongoose';

const lyricsHistorySchema = new mongoose.Schema({
  nepaliLyrics: {
    type: String,
    required: true
  },
  romanizedLyrics: {
    type: String,
    required: true
  },
  editedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a song title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  artist: {
    type: String,
    required: [true, 'Please provide the artist name'],
    trim: true
  },
  writer: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  album: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['bhajan', 'chorus', 'others'],
    default: 'bhajan'
  },
  tags: [{
    type: String,
    trim: true
  }],
  nepaliLyrics: {
    type: String,
    required: [true, 'Please provide Nepali lyrics']
  },
  romanizedLyrics: {
    type: String,
    required: [true, 'Romanized lyrics are required']
  },
  history: [lyricsHistorySchema],
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  audioUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL for audio']
  },
  videoUrl: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL for video']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Text index for full-text search
songSchema.index({
  title: 'text',
  artist: 'text',
  writer: 'text',
  nepaliLyrics: 'text',
  romanizedLyrics: 'text',
  tags: 'text'
}, {
  weights: {
    title: 10,
    artist: 5,
    nepaliLyrics: 3,
    romanizedLyrics: 3,
    tags: 2,
    writer: 1
  },
  name: "SongTextIndex"
});

// Pre-find middleware to exclude deleted songs by default
songSchema.pre(/^find/, function(next) {
  // If we are explicitly querying for deleted, allow it (e.g., admin restore list)
  if (this.getQuery().isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

const Song = mongoose.model('Song', songSchema);
export default Song;
