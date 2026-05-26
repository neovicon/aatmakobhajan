import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { aboutApi } from '../../api/about.api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

const AboutEditor = () => {
  const [formData, setFormData] = useState({
    appDescription: '',
    developerDescription: '',
    writerDescription: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      youtube: '',
      github: ''
    },
    members: [] // Array of team members with details
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await aboutApi.getAppInfo();
        if (data) {
          setFormData({
            appDescription: data.appDescription || '',
            developerDescription: data.developerDescription || '',
            writerDescription: data.writerDescription || '',
            socialLinks: {
              facebook: data.socialLinks?.facebook || '',
              instagram: data.socialLinks?.instagram || '',
              youtube: data.socialLinks?.youtube || '',
              github: data.socialLinks?.github || ''
            },
            members: (data.members || []).map(m => ({
              name: m.name || '',
              role: m.role || '',
              imageUrl: m.imageUrl || '',
              location: m.location || '',
              socialLinks: {
                facebook: m.socialLinks?.facebook || '',
                x: m.socialLinks?.x || '',
                linkedin: m.socialLinks?.linkedin || '',
                github: m.socialLinks?.github || ''
              }
            }))
          });
        }
      } catch (error) {
        toast.error('Failed to fetch about information');
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  // Member field handlers
  const handleMemberChange = (index, field, value) => {
    setFormData(prev => {
      const updatedMembers = [...prev.members];
      updatedMembers[index] = { ...updatedMembers[index], [field]: value };
      return { ...prev, members: updatedMembers };
    });
  };

  const handleMemberSocialChange = (index, name, value) => {
    setFormData(prev => {
      const updatedMembers = [...prev.members];
      const member = updatedMembers[index];
      const updatedSocial = { ...member.socialLinks, [name]: value };
      updatedMembers[index] = { ...member, socialLinks: updatedSocial };
      return { ...prev, members: updatedMembers };
    });
  };

  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { name: '', role: '', imageUrl: '', location: '', socialLinks: { facebook: '', x: '', linkedin: '', github: '' } }]
    }));
  };

  const removeMember = (index) => {
    setFormData(prev => {
      const updated = prev.members.filter((_, i) => i !== index);
      return { ...prev, members: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await aboutApi.updateAppInfo(formData);
      toast.success('About page updated successfully');
    } catch (error) {
      toast.error('Failed to update about page');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  return (
    <>
      <Helmet>
        <title>Edit About Page - Admin Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit About Page</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Update platform information and social links.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-800 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-700 p-6 md:p-8 space-y-8 max-w-4xl">
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-dark-700 pb-2">Main Content</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">App Description</label>
              <textarea
                name="appDescription"
                value={formData.appDescription}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Developer Description</label>
              <textarea
                name="developerDescription"
                value={formData.developerDescription}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Writer Description</label>
              <textarea
                name="writerDescription"
                value={formData.writerDescription}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-dark-700 pb-2">Team Members</h3>
            {formData.members.map((member, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">Member {idx + 1}</h4>
                  <button type="button" onClick={() => removeMember(idx)} className="text-sm text-red-600 hover:underline">Remove</button>
                </div>
                <Input label="Name" name="name" value={member.name} onChange={e => handleMemberChange(idx, 'name', e.target.value)} placeholder="John Doe" />
                <Input label="Role" name="role" value={member.role} onChange={e => handleMemberChange(idx, 'role', e.target.value)} placeholder="Lead Developer" />
                <Input label="Image URL" name="imageUrl" value={member.imageUrl} onChange={e => handleMemberChange(idx, 'imageUrl', e.target.value)} placeholder="https://example.com/photo.jpg" />
                <Input label="Location" name="location" value={member.location} onChange={e => handleMemberChange(idx, 'location', e.target.value)} placeholder="City, Country" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Facebook" name="facebook" value={member.socialLinks.facebook} onChange={e => handleMemberSocialChange(idx, 'facebook', e.target.value)} placeholder="https://facebook.com/..." />
                  <Input label="X (Twitter)" name="x" value={member.socialLinks.x} onChange={e => handleMemberSocialChange(idx, 'x', e.target.value)} placeholder="https://x.com/..." />
                  <Input label="LinkedIn" name="linkedin" value={member.socialLinks.linkedin} onChange={e => handleMemberSocialChange(idx, 'linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
                  <Input label="GitHub" name="github" value={member.socialLinks.github} onChange={e => handleMemberSocialChange(idx, 'github', e.target.value)} placeholder="https://github.com/..." />
                </div>
              </div>
            ))}
            <Button type="button" onClick={addMember} className="mt-2" variant="outline">
              Add Member
            </Button>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" isLoading={saving} className="px-8">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AboutEditor;
