'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, User, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'user', bio: '', location: '', specialties: '', farmName: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      const data = { ...formData };
      if (data.specialties) {
        data.specialties = data.specialties.split(',').map(s => s.trim());
      }
      delete data.confirmPassword;
      await register(data);
      toast.success('Welcome to MulberryTree!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'user', label: 'Food Enthusiast' },
    { value: 'chef', label: 'Chef' },
    { value: 'farmer', label: 'Farmer' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        name="name"
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
        icon={<User size={18} />}
        required
      />
      <Input
        label="Email"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        icon={<Mail size={18} />}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Min 6 characters"
          value={formData.password}
          onChange={handleChange}
          icon={<Lock size={18} />}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Repeat password"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<Lock size={18} />}
          required
        />
      </div>

      <Select
        label="I am a..."
        name="role"
        value={formData.role}
        onChange={handleChange}
        options={roleOptions}
      />

      {formData.role === 'chef' && (
        <Input
          label="Specialties"
          name="specialties"
          placeholder="Italian, Pastry, Grilling (comma separated)"
          value={formData.specialties}
          onChange={handleChange}
        />
      )}

      {formData.role === 'farmer' && (
        <>
          <Input
            label="Farm Name"
            name="farmName"
            placeholder="Your farm name"
            value={formData.farmName}
            onChange={handleChange}
          />
          <Input
            label="Location"
            name="location"
            placeholder="City, State"
            value={formData.location}
            onChange={handleChange}
            icon={<MapPin size={18} />}
          />
        </>
      )}

      <Button type="submit" isLoading={loading} className="w-full">
        Create Account
      </Button>
    </form>
  );
}
