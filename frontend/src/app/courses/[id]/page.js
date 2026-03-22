'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCourseById, enrollInCourse, unenrollFromCourse } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getImageUrl, formatDate } from '@/lib/utils';
import { BookOpen, Users, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [openLesson, setOpenLesson] = useState(null);

  useEffect(() => { fetchCourse(); }, [id]);

  const fetchCourse = async () => {
    try {
      const data = await getCourseById(id);
      setCourse(data.course);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = course?.enrolledUsers?.some(u => u === user?.id || u?._id === user?.id);

  const handleEnroll = async () => {
    if (!isAuthenticated) return toast.error('Please login first');
    setEnrolling(true);
    try {
      if (isEnrolled) {
        await unenrollFromCourse(id);
        setCourse(prev => ({
          ...prev,
          enrolledUsers: prev.enrolledUsers.filter(u => u !== user.id && u?._id !== user.id),
        }));
        toast.success('Unenrolled');
      } else {
        await enrollInCourse(id);
        setCourse(prev => ({
          ...prev,
          enrolledUsers: [...(prev.enrolledUsers || []), user.id],
        }));
        toast.success('Enrolled!');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!course) return <div className="text-center py-20 text-gray-400">Course not found</div>;

  const levelVariant = { beginner: 'forest', intermediate: 'earth', advanced: 'mulberry' };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {course.image && (
        <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden mb-8">
          <img src={getImageUrl(course.image)} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        </div>
      )}

      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={levelVariant[course.level]}>{course.level}</Badge>
            <Badge variant="gray">{course.category}</Badge>
          </div>
          <h1 className="font-heading text-3xl font-bold text-cream mb-2">{course.title}</h1>
          <div className="flex items-center gap-3">
            <Avatar name={course.instructor?.name} src={course.instructor?.avatar} size="sm" />
            <span className="text-gray-400">by {course.instructor?.name}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-mulberry-400 mb-2">
            {course.price > 0 ? `$${course.price}` : 'Free'}
          </div>
          <Button onClick={handleEnroll} isLoading={enrolling} variant={isEnrolled ? 'secondary' : 'primary'}>
            {isEnrolled ? 'Unenroll' : 'Enroll Now'}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
        <span className="flex items-center gap-1.5"><BookOpen size={16} />{course.lessons?.length || 0} lessons</span>
        <span className="flex items-center gap-1.5"><Users size={16} />{course.enrolledUsers?.length || 0} enrolled</span>
        {course.startDate && <span className="flex items-center gap-1.5"><Clock size={16} />Starts {formatDate(course.startDate)}</span>}
      </div>

      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="font-heading text-xl font-semibold text-cream mb-3">About this course</h2>
        <p className="text-gray-300">{course.description}</p>
      </div>

      {/* Lessons */}
      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6">
        <h2 className="font-heading text-xl font-semibold text-cream mb-4">Lessons</h2>
        {course.lessons?.length === 0 ? (
          <p className="text-gray-400">No lessons yet</p>
        ) : (
          <div className="space-y-2">
            {course.lessons?.map((lesson, i) => (
              <div key={i} className="border border-gray-700 rounded-lg">
                <button
                  onClick={() => setOpenLesson(openLesson === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-cream font-medium">
                    <span className="text-mulberry-400 mr-2">{i + 1}.</span>
                    {lesson.title}
                  </span>
                  <div className="flex items-center gap-3">
                    {lesson.duration > 0 && (
                      <span className="text-xs text-gray-500">{lesson.duration} min</span>
                    )}
                    {openLesson === i ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>
                {openLesson === i && (
                  <div className="px-4 pb-4 text-gray-400 text-sm border-t border-gray-700 pt-3">
                    {isEnrolled ? (
                      <p>{lesson.content || 'No content available'}</p>
                    ) : (
                      <p className="italic">Enroll to access lesson content</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
