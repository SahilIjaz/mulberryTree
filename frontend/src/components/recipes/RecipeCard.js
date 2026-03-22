import Link from 'next/link';
import Card, { CardImage, CardBody, CardFooter } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import StarRating from '@/components/ui/StarRating';
import { getImageUrl, truncateText } from '@/lib/utils';
import { Clock, Users } from 'lucide-react';

const difficultyVariant = { easy: 'forest', medium: 'earth', hard: 'red' };

export default function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe._id}`}>
      <Card>
        <CardImage src={getImageUrl(recipe.image)} alt={recipe.title} />
        <CardBody>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={difficultyVariant[recipe.difficulty]}>
              {recipe.difficulty}
            </Badge>
            {recipe.cuisine && <Badge variant="gray">{recipe.cuisine}</Badge>}
          </div>
          <h3 className="text-lg font-heading font-semibold text-cream mb-1">
            {recipe.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            {truncateText(recipe.description, 100)}
          </p>
          <StarRating rating={recipe.averageRating} readOnly size={16} />
        </CardBody>
        <CardFooter>
          <div className="flex items-center gap-2">
            <Avatar name={recipe.author?.name} src={recipe.author?.avatar} size="sm" />
            <span className="text-sm text-gray-400">{recipe.author?.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock size={14} />{recipe.cookTime}m</span>
            <span className="flex items-center gap-1"><Users size={14} />{recipe.servings}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
