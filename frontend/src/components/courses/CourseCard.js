import Link from 'next/link';
import Card, { CardImage, CardBody, CardFooter } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { getImageUrl, truncateText } from '@/lib/utils';
import { BookOpen, Users } from 'lucide-react';

const levelVariant = { beginner: 'forest', intermediate: 'earth', advanced: 'mulberry' };

export default function CourseCard({ course }) {
  return (
    <Link href={`/courses/${course._id}`}>
      <Card>
        <CardImage src={getImageUrl(course.image)} alt={course.title} />
        <CardBody>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={levelVariant[course.level]}>{course.level}</Badge>
            <Badge variant="gray">{course.category}</Badge>
          </div>
          <h3 className="text-lg font-heading font-semibold text-cream mb-1">
            {course.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            {truncateText(course.description, 100)}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen size={14} />{course.lessons?.length || 0} lessons
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} />{course.enrolledUsers?.length || 0} enrolled
            </span>
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex items-center gap-2">
            <Avatar name={course.instructor?.name} src={course.instructor?.avatar} size="sm" />
            <span className="text-sm text-gray-400">{course.instructor?.name}</span>
          </div>
          <span className="text-mulberry-400 font-semibold">
            {course.price > 0 ? `$${course.price}` : 'Free'}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
