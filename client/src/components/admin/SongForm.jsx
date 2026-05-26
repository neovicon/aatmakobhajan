import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Upload } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { uploadApi } from '../../api/upload.api';
import { songsApi } from '../../api/songs.api';
import { transliterate } from '../../utils/transliterator';

const SongForm = ({ initialData, isEdit = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isTypingNepali, setIsTypingNepali] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    writer: 'Unknown',
    category: 'bhajan',
    tags: '',
    nepaliLyrics: '',
    romanizedLyrics: '',
    description: '',
    audioUrl: '',
    videoUrl: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tags: initialData.tags ? initialData.tags.join(', ') : ''
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (!isTypingNepali) return;
    
    const delayDebounceFn = setTimeout(() => {
      if (formData.nepaliLyrics) {
        const romanized = transliterate(formData.nepaliLyrics);
        setFormData(prev => ({ ...prev, romanizedLyrics: romanized }));
      }
      setIsTypingNepali(false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.nepaliLyrics, isTypingNepali]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nepaliLyrics') setIsTypingNepali(true);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading(`Uploading ${type}...`);
    try {
      let result;
      if (type === 'audio') result = await uploadApi.uploadAudio(file);
      
      setFormData(prev => ({ 
        ...prev, 
        audioUrl: result.url 
      }));
      toast.success(`${type} uploaded successfully`, { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed', { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (isEdit) {
        await songsApi.updateSong(initialData._id, payload);
        toast.success('Song updated successfully');
      } else {
        await songsApi.createSong(payload);
        toast.success('Song created successfully');
      }
      navigate('/admin/songs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Title *" name="title" value={formData.title} onChange={handleChange} required />
        <Input label="Artist *" name="artist" value={formData.artist} onChange={handleChange} required />
        <Input label="Writer" name="writer" value={formData.writer} onChange={handleChange} />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="bhajan">Bhajan</option>
            <option value="chorus">Chorus</option>
            <option value="others">Others</option>
          </select>
        </div>
        
        <Input label="Tags (comma separated)" name="tags" value={formData.tags} onChange={handleChange} placeholder="worship, morning, sunday" />
        <Input label="Video URL (YouTube/MP4)" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://youtube.com/..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Audio URL or Upload</label>
          <div className="flex gap-2">
            <Input name="audioUrl" value={formData.audioUrl} onChange={handleChange} className="flex-1" placeholder="https://..." />
            <div className="relative overflow-hidden shrink-0">
              <Button type="button" variant="outline" className="w-10 px-0 relative">
                <Upload size={16} />
                <input type="file" accept="audio/mpeg, audio/wav, audio/mp3" onChange={(e) => handleFileUpload(e, 'audio')} className="absolute inset-0 opacity-0 cursor-pointer" />
              </Button>
            </div>
          </div>
          {formData.audioUrl && <audio src={formData.audioUrl} controls className="mt-2 w-full h-10" />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nepali Lyrics *</label>
          <textarea
            name="nepaliLyrics"
            value={formData.nepaliLyrics}
            onChange={handleChange}
            required
            rows={15}
            className="w-full rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 font-devanagari text-lg"
            placeholder="म राम्रो छु..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Romanized Lyrics *</label>
          <textarea
            name="romanizedLyrics"
            value={formData.romanizedLyrics}
            onChange={handleChange}
            required
            rows={15}
            className="w-full rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            placeholder="ma ramro chu..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Note: Automatic transliteration is enabled. You can still manually edit the romanized version.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" isLoading={loading} className="w-32">
          {isEdit ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/admin/songs')}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default SongForm;
