// A simplified phonetic mapping for Devanagari to Roman
// This is not standard IAST, but tailored for easy readability by Nepali speakers.

const devanagariMap = {
  // Vowels
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am', 'अः': 'ah',
  
  // Consonants
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'wa', 'श': 'sha',
  'ष': 'sha', 'स': 'sa', 'ह': 'ha', 'क्ष': 'ksha', 'त्र': 'tra', 'ज्ञ': 'gya',
  
  // Dependent Vowels (Matras)
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u', 'ृ': 'ri',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', 'ः': 'h',
  '्': '' // Halant (removes the inherent 'a' sound)
};

// Exception dictionary for specific words that don't map perfectly
const specialWords = {
  'म': 'ma',
  'छु': 'chu',
  'छ': 'cha',
  'राम्रो': 'ramro'
};

class Transliterator {
  static romanize(text) {
    if (!text) return '';
    
    // Check if the whole text is in exception list
    if (specialWords[text]) return specialWords[text];

    let result = '';
    let skipNextA = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      // Replace special words if they are part of the text (separated by spaces)
      // For now, doing character-by-character replacement
      
      let mapped = devanagariMap[char];

      if (mapped) {
        // If it's a consonant and has a dependent vowel or halant next, remove inherent 'a'
        if (mapped.endsWith('a') && nextChar) {
          if (
            ['ा', 'ि', 'ी', 'ु', 'ू', 'ृ', 'े', 'ै', 'ो', 'ौ', '्'].includes(nextChar)
          ) {
            mapped = mapped.slice(0, -1);
          }
        }
        
        // Handling compound words and schwa deletion roughly
        // If the character is at the end of a word (followed by space or end of string), 
        // and it's a consonant ending in 'a', often in Nepali the 'a' is not pronounced.
        // But doing this automatically is complex. We'll stick to a basic mapping.
        
        result += mapped;
      } else {
        result += char; // Keep non-Devanagari characters as is (spaces, punctuation)
      }
    }

    // Apply specific word replacements to the final result
    // This is a basic approach; a robust one would tokenize by words first.
    let words = result.split(/(\s+)/);
    for (let j = 0; j < words.length; j++) {
       // We can map specific common romanized mistakes here if needed
    }

    return result;
  }
}

export const transliterate = (nepaliText) => {
  // First, we can split by words to handle exceptions better
  const words = nepaliText.split(/(\s+)/);
  const mappedWords = words.map(word => {
    // If it's whitespace, return as is
    if (/\s+/.test(word)) return word;
    
    // Check exception dictionary first for the Devanagari word
    if (specialWords[word]) return specialWords[word];
    
    return Transliterator.romanize(word);
  });
  
  return mappedWords.join('');
};
