import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Facebook, Instagram, Youtube, Github, Info, Twitter, Linkedin, MapPin, MessageCircle, Video } from 'lucide-react';
import { aboutApi } from '../api/about.api';
import Skeleton from '../components/ui/Skeleton';

const About = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await aboutApi.getAppInfo();
        setInfo(data);
      } catch (error) {
        console.error('Failed to load about info');
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>About Us - आत्मा को भजन</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-primary-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden text-white shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-900 opacity-50" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold font-devanagari mb-4">हाम्रो बारेमा</h1>
            <p className="text-xl text-primary-100 font-medium">About आत्मा को भजन</p>
          </div>
        </div>

        {/* Content Blocks */}
        {/* Profiles Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold font-devanagari text-center text-gray-900 dark:text-white">Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Developer Profile */}
            <div className="bg-white dark:bg-dark-800 p-8 rounded-3xl border border-gray-100 dark:border-dark-700 shadow-sm flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary-100 dark:border-primary-900 bg-gray-200 dark:bg-dark-700">
                {/* Developer Picture Placeholder */}
                <img src="https://res.cloudinary.com/dlf3ixlw6/image/upload/v1779773323/679097832_122215941944301625_4588781793237900020_n_ujcndb.jpg" alt="Developer" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Daniel Lepcha</h3>
              <p className="text-primary-500 font-medium mb-4">Lead Developer</p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow whitespace-pre-wrap">
                {info?.developerDescription || 'Built with passion for Nepali music.'}
              </p>
              <div className="flex justify-center gap-4 mt-auto">
                {/* Facebook */}
                <a href="https://www.facebook.com/daniellepcha123" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
                  <Facebook size={20} />
                </a>
                {/* X (Twitter) */}
                <a href="https://x.com/DanielLepc19013" target="_blank" rel="noreferrer" className="text-gray-900 dark:text-white hover:text-gray-700 transition-colors">
                  <Twitter size={20} />
                </a>
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/in/daniel-lepcha-4455a7337/" target="_blank" rel="noreferrer" className="text-blue-700 hover:text-blue-800 transition-colors">
                  <Linkedin size={20} />
                </a>
                {/* GitHub */}
                <a href="https://github.com/neovicon" target="_blank" rel="noreferrer" className="text-gray-800 dark:text-gray-200 hover:text-black transition-colors">
                  <Github size={20} />
                </a>
              </div>
            </div>

            {/* Content Writer Profile */}
            <div className="bg-white dark:bg-dark-800 p-8 rounded-3xl border border-gray-100 dark:border-dark-700 shadow-sm flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary-100 dark:border-primary-900 bg-gray-200 dark:bg-dark-700">
                {/* Content Writer Picture Placeholder */}
                <img src="https://res.cloudinary.com/dlf3ixlw6/image/upload/v1779773579/519070531_1790024805723604_1260567920847134899_n_dp9inh.jpg" alt="Content Writer" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Gyan B Lama</h3>
              <p className="text-primary-500 font-medium mb-2">Content Writer</p>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-4">
                <MapPin size={14} /> Banepa, Kavre
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow whitespace-pre-wrap">
                {info?.writerDescription || 'Dedicated to preserving cultural lyrics.'}
              </p>
              <div className="flex justify-center gap-4 mt-auto">
                {/* Facebook */}
                <a href="https://www.facebook.com/gyanb.lama.73" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
                  <Facebook size={20} />
                </a>
                {/* TikTok (using Video as placeholder icon since Lucide doesn't have TikTok) */}
                <a href="https://www.tiktok.com/@gyan.b.lama48" target="_blank" rel="noreferrer" className="text-pink-600 hover:text-pink-700 transition-colors">
                  <Video size={20} />
                </a>
                {/* Messenger */}
                <a href="" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {info?.socialLinks && Object.values(info.socialLinks).some(link => link) && (
          <div className="bg-gray-100 dark:bg-dark-800 p-8 rounded-3xl text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Connect With Us</h3>
            <div className="flex justify-center gap-6">
              {info.socialLinks.facebook && (
                <a href={info.socialLinks.facebook} target="_blank" rel="noreferrer" className="p-3 bg-white dark:bg-dark-700 rounded-full text-blue-600 hover:scale-110 transition-transform shadow-sm">
                  <Facebook size={24} />
                </a>
              )}
              {info.socialLinks.instagram && (
                <a href={info.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-3 bg-white dark:bg-dark-700 rounded-full text-pink-600 hover:scale-110 transition-transform shadow-sm">
                  <Instagram size={24} />
                </a>
              )}
              {info.socialLinks.youtube && (
                <a href={info.socialLinks.youtube} target="_blank" rel="noreferrer" className="p-3 bg-white dark:bg-dark-700 rounded-full text-red-600 hover:scale-110 transition-transform shadow-sm">
                  <Youtube size={24} />
                </a>
              )}
              {info.socialLinks.github && (
                <a href={info.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 bg-white dark:bg-dark-700 rounded-full text-gray-900 dark:text-white hover:scale-110 transition-transform shadow-sm">
                  <Github size={24} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default About;
