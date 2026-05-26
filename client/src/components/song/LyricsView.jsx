import React from 'react';
import { useFontStore } from '../../store/fontStore';

const LyricsView = ({ lyrics, title }) => {
  const { font } = useFontStore();
  
  // Convert lines to paragraphs
  const formattedLyrics = lyrics?.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className={`prose dark:prose-invert max-w-none font-${font} text-lg leading-relaxed`}>
      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
        {formattedLyrics}
      </p>
    </div>
  );
};

export default LyricsView;
