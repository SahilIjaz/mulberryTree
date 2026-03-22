'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createCourse } from '@/lib/api';
import Input, { Textarea, Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '@/lib/constants';
import { Plus, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateCoursePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '0', category: 'General',
    level: 'beginner', maxEnrollment: '', status: 'published',
  });
  const [lessons, setLessons] = useState([{ title: '', content: '', videoUrl: '', duration: '' }]);
  const [image, setImage] = useState(null);

  if (user?.role !== 'chef' && user?.role !== 'admin') {
    return <div className="text-center py-20 text-gray-400">Only chefs can create courses</div>;
  }

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const addLesson = () => setLessons(prev => [...prev, { title: '', content: '', videoUrl: '', duration: '' }]);
  const removeLesson = (i) => setLessons(prev => prev.filter((_, idx) => idx !== i));
  const updateLesson = (i, field, value) => {
    setLessons(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => { if (val) fd.append(key, val); });
      fd.append('lessons', JSON.stringify(lessons.filter(l => l.title)));
      if (image) fd.append('image', image);

      await createCourse(fd);
      toast.success('Course created!');
      router.push('/courses');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-3xl font-bold text-cream mb-8">Create Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6 space-y-4">
          <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Course title" required />
          <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Course description" required />

          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" name="category" value={formData.category} onChange={handleChange}
              options={COURSE_CATEGORIES.map(c => ({ value: c, label: c }))} />
            <Select label="Level" name="level" value={formData.level} onChange={handleChange}
              options={COURSE_LEVELS.map(l => ({ value: l, label: l.charAt(0).toUpperCase() + l.slice(1) }))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Price ($)" name="price" type="number" value={formData.price} onChange={handleChange} />
            <Input label="Max Enrollment (0 = unlimited)" name="maxEnrollment" type="number" value={formData.maxEnrollment} onChange={handleChange} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-cream-dark">Image</label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 rounded-lg p-6 cursor-pointer hover:border-mulberry-800 transition-colors">
              <Upload size={20} className="text-gray-500" />
              <span className="text-gray-400 text-sm">{image ? image.name : 'Click to upload'}</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </label>
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-cream mb-4">Lessons</h2>
          {lessons.map((lesson, i) => (
            <div key={i} className="border border-gray-700 rounded-lg p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-mulberry-400 font-semibold">Lesson {i + 1}</span>
                {lessons.length > 1 && (
                  <button type="button" onClick={() => removeLesson(i)} className="text-red-400 hover:text-red-300">
                    <X size={18} />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <Input placeholder="Lesson title" value={lesson.title} onChange={(e) => updateLesson(i, 'title', e.target.value)} />
                <Textarea placeholder="Lesson content" value={lesson.content} onChange={(e) => updateLesson(i, 'content', e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Video URL (optional)" value={lesson.videoUrl} onChange={(e) => updateLesson(i, 'videoUrl', e.target.value)} />
                  <Input placeholder="Duration (min)" type="number" value={lesson.duration} onChange={(e) => updateLesson(i, 'duration', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={addLesson}>
            <Plus size={16} /> Add Lesson
          </Button>
        </div>

        <Button type="submit" isLoading={loading} className="w-full" size="lg">
          Publish Course
        </Button>
      </form>
    </div>
  );
}
