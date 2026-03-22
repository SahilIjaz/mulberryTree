'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getRecipeById, rateRecipe } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getImageUrl, formatDate } from '@/lib/utils';
import { Clock, Users, ChefHat, Timer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const data = await getRecipeById(id);
      setRecipe(data.recipe);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (score) => {
    if (!isAuthenticated) return toast.error('Please login to rate');
    try {
      const data = await rateRecipe(id, score);
      setRecipe(prev => ({ ...prev, averageRating: data.averageRating }));
      toast.success('Rating submitted!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;
  if (!recipe) return <div className="text-center py-20 text-gray-400">Recipe not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Image */}
      {recipe.image && (
        <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden mb-8">
          <img src={getImageUrl(recipe.image)} alt={recipe.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={recipe.difficulty === 'easy' ? 'forest' : recipe.difficulty === 'hard' ? 'red' : 'earth'}>
            {recipe.difficulty}
          </Badge>
          {recipe.cuisine && <Badge variant="gray">{recipe.cuisine}</Badge>}
          {recipe.tags?.map(tag => <Badge key={tag} variant="mulberry">{tag}</Badge>)}
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-4">{recipe.title}</h1>
        <p className="text-gray-300 text-lg mb-4">{recipe.description}</p>

        {/* Author & Meta */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={recipe.author?.name} src={recipe.author?.avatar} size="md" />
            <div>
              <div className="text-cream font-medium">{recipe.author?.name}</div>
              <div className="text-gray-500 text-sm">{formatDate(recipe.createdAt)}</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Timer size={16} />{recipe.prepTime}m prep</span>
            <span className="flex items-center gap-1.5"><Clock size={16} />{recipe.cookTime}m cook</span>
            <span className="flex items-center gap-1.5"><Users size={16} />{recipe.servings} servings</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-cream font-medium mb-1">Rate this recipe</h3>
            <StarRating rating={recipe.averageRating} readOnly />
          </div>
          {isAuthenticated && (
            <div>
              <p className="text-gray-500 text-sm mb-1">Your rating:</p>
              <StarRating onRate={handleRate} />
            </div>
          )}
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="font-heading text-xl font-semibold text-cream mb-4 flex items-center gap-2">
          <ChefHat size={20} className="text-mulberry-400" />
          Ingredients
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recipe.ingredients?.map((ing, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-300">
              <div className="w-2 h-2 rounded-full bg-mulberry-600 flex-shrink-0" />
              <span>{ing.quantity} {ing.unit} {ing.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6">
        <h2 className="font-heading text-xl font-semibold text-cream mb-4">Instructions</h2>
        <ol className="space-y-4">
          {recipe.instructions?.map((step, i) => (
            <li key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-mulberry-900/50 border border-mulberry-800 flex items-center justify-center text-mulberry-300 text-sm font-semibold flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-gray-300 pt-1">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
