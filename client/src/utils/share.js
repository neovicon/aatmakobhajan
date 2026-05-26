import toast from 'react-hot-toast';

export const shareContent = async (title, text, url) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url
      });
      toast.success('Shared successfully!');
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Error sharing content');
      }
    }
  } else {
    // Fallback to copying URL
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  }
};
