import React from 'react';
import { Download, Smartphone, ShieldCheck, Settings } from 'lucide-react';
import Button from '../components/ui/Button';

const DownloadApp = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Download Our Android App
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Experience our content on the go! Download the official app for a faster, smoother, and richer mobile experience.
        </p>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-dark-700">
        <div className="p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full">
              <Smartphone size={48} className="text-primary-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
            Ready to get started?
          </h2>
          
          <a href="/app-release.apk" download>
            <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8">
              <Download size={24} />
              Download APK
            </Button>
          </a>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Version 1.0.0 • For Android 5.0 and up
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          How to Install
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div className="mb-4 text-primary-500">
              <Download size={32} />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Download</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Click the download button above to get the latest APK file directly to your device.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div className="mb-4 text-primary-500">
              <Settings size={32} />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Allow Unknown Sources</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Go to Settings &gt; Security on your phone and enable "Install from Unknown Sources".
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div className="mb-4 text-primary-500">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Install</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Open the downloaded file from your notifications or file manager and tap "Install".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp;
