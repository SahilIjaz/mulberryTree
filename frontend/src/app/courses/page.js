'use client';

import { useState, useEffect } from 'react';
import { getCourses } from '@/lib/api';
import CourseCard from '@/components/courses/CourseCard';
import Pagination from '@/components/ui/Pagination';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Search } from 'lucide-react';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '@/lib/constants';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  useEffect(() => { fetchCourses(); }, [page, category, level]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (level) params.set('level', level);

      const data = await getCourses(params.toString());
      setCourses(data.courses);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-cream mb-2">Courses</h1>
        <p className="text-gray-400">Learn from expert chefs and expand your culinary skills</p>
      </div>

      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-4 mb-8">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchCourses(); }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size={18} />} />
          </div>
          <Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            options={[{ value: '', label: 'All Categories' }, ...COURSE_CATEGORIES.map(c => ({ value: c, label: c }))]} />
          <Select value={level} onChange={(e) => { setLevel(e.target.value); setPage(1); }}
            options={[{ value: '', label: 'All Levels' }, ...COURSE_LEVELS.map(l => ({ value: l, label: l.charAt(0).toUpperCase() + l.slice(1) }))]} />
        </form>
      </div>

      {loading ? <LoadingSpinner /> : courses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No courses found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => <CourseCard key={course._id} course={course} />)}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
