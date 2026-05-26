import React from 'react';

const VideoPlayer = ({ url }) => {
  if (!url) return null;

  // Check if it's a YouTube URL
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (isYouTube) {
    const videoId = getYouTubeId(url);
    if (!videoId) return <p className="text-red-500">Invalid YouTube URL</p>;
    
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>
    );
  }

  // Fallback to HTML5 video for direct mp4 links
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
      <video 
        controls 
        className="w-full h-full"
        preload="metadata"
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
