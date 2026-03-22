'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/lib/api';
import Input, { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProfilePage() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', bio: '', location: '', specialties: '', farmName: '',
  });
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        specialties: user.specialties?.join(', ') || '',
        farmName: user.farmName || '',
      });
    }
  }, [user, isLoading, isAuthenticated, router]);

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!user) return null;

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('bio', formData.bio);
      fd.append('location', formData.location);
      fd.append('farmName', formData.farmName);
      if (formData.specialties) {
        fd.append('specialties', JSON.stringify(formData.specialties.split(',').map(s => s.trim())));
      }
      if (avatar) fd.append('image', avatar);

      const data = await updateUserProfile(fd);
      updateUser(data.user);
      toast.success('Profile updated!');
      router.push('/profile');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-3xl font-bold text-cream mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6 space-y-4">
          <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
          <Textarea label="Bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself" />
          <Input label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="City, State" />

          {user.role === 'chef' && (
            <Input label="Specialties" name="specialties" value={formData.specialties} onChange={handleChange} placeholder="Italian, Pastry (comma separated)" />
          )}

          {user.role === 'farmer' && (
            <Input label="Farm Name" name="farmName" value={formData.farmName} onChange={handleChange} />
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-cream-dark">Avatar</label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 rounded-lg p-6 cursor-pointer hover:border-mulberry-800 transition-colors">
              <Upload size={20} className="text-gray-500" />
              <span className="text-gray-400 text-sm">{avatar ? avatar.name : 'Upload new avatar'}</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} />
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" isLoading={loading} className="flex-1">Save Changes</Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
