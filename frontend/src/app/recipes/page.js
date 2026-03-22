'use client';

import { useState, useEffect } from 'react';
import { getRecipes } from '@/lib/api';
import RecipeCard from '@/components/recipes/RecipeCard';
import Pagination from '@/components/ui/Pagination';
import Input from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Search } from 'lucide-react';
import { CUISINES, DIFFICULTIES } from '@/lib/constants';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchRecipes();
  }, [page, cuisine, difficulty, sort]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, sort });
      if (search) params.set('search', search);
      if (cuisine) params.set('cuisine', cuisine);
      if (difficulty) params.set('difficulty', difficulty);

      const data = await getRecipes(params.toString());
      setRecipes(data.recipes);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchRecipes();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-cream mb-2">Recipes</h1>
        <p className="text-gray-400">Discover delicious recipes from our community of chefs</p>
      </div>

      {/* Filters */}
      <div className="bg-charcoal-light border border-gray-800 rounded-xl p-4 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={18} />}
            />
          </div>
          <Select
            value={cuisine}
            onChange={(e) => { setCuisine(e.target.value); setPage(1); }}
            options={[{ value: '', label: 'All Cuisines' }, ...CUISINES.map(c => ({ value: c, label: c }))]}
          />
          <Select
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
            options={[
              { value: '', label: 'All Levels' },
              ...DIFFICULTIES.map(d => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) })),
            ]}
          />
          <Select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'rating', label: 'Highest Rated' },
            ]}
          />
        </form>
      </div>

      {/* Recipe Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No recipes found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
