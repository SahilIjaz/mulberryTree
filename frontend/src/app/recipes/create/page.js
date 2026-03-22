'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createRecipe } from '@/lib/api';
import Input, { Textarea, Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { CUISINES, DIFFICULTIES } from '@/lib/constants';
import { Plus, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateRecipePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', cookTime: '', prepTime: '', servings: '',
    difficulty: 'medium', cuisine: '', tags: '',
  });
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [instructions, setInstructions] = useState(['']);
  const [image, setImage] = useState(null);

  if (user?.role !== 'chef' && user?.role !== 'admin') {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">Only chefs can create recipes</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addIngredient = () => setIngredients(prev => [...prev, { name: '', quantity: '', unit: '' }]);
  const removeIngredient = (i) => setIngredients(prev => prev.filter((_, idx) => idx !== i));
  const updateIngredient = (i, field, value) => {
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing));
  };

  const addInstruction = () => setInstructions(prev => [...prev, '']);
  const removeInstruction = (i) => setInstructions(prev => prev.filter((_, idx) => idx !== i));
  const updateInstruction = (i, value) => {
    setInstructions(prev => prev.map((s, idx) => idx === i ? value : s));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) fd.append(key, val);
      });
      fd.append('ingredients', JSON.stringify(ingredients.filter(i => i.name)));
      fd.append('instructions', JSON.stringify(instructions.filter(Boolean)));
      if (formData.tags) {
        fd.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim())));
      }
      if (image) fd.append('image', image);

      await createRecipe(fd);
      toast.success('Recipe created!');
      router.push('/recipes');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-3xl font-bold text-cream mb-8">Create Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6 space-y-4">
          <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="Recipe title" required />
          <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="Describe your recipe" required />

          <div className="grid grid-cols-3 gap-4">
            <Input label="Prep Time (min)" name="prepTime" type="number" value={formData.prepTime} onChange={handleChange} required />
            <Input label="Cook Time (min)" name="cookTime" type="number" value={formData.cookTime} onChange={handleChange} required />
            <Input label="Servings" name="servings" type="number" value={formData.servings} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}
              options={DIFFICULTIES.map(d => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) }))} />
            <Select label="Cuisine" name="cuisine" value={formData.cuisine} onChange={handleChange}
              options={[{ value: '', label: 'Select cuisine' }, ...CUISINES.map(c => ({ value: c, label: c }))]} />
          </div>

          <Input label="Tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="healthy, quick, vegan (comma separated)" />

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-cream-dark">Image</label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 rounded-lg p-6 cursor-pointer hover:border-mulberry-800 transition-colors">
              <Upload size={20} className="text-gray-500" />
              <span className="text-gray-400 text-sm">{image ? image.name : 'Click to upload image'}</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </label>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-cream mb-4">Ingredients</h2>
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input placeholder="Qty" value={ing.quantity} onChange={(e) => updateIngredient(i, 'quantity', e.target.value)} className="w-20" />
              <Input placeholder="Unit" value={ing.unit} onChange={(e) => updateIngredient(i, 'unit', e.target.value)} className="w-24" />
              <Input placeholder="Ingredient name" value={ing.name} onChange={(e) => updateIngredient(i, 'name', e.target.value)} className="flex-1" />
              {ingredients.length > 1 && (
                <button type="button" onClick={() => removeIngredient(i)} className="text-red-400 hover:text-red-300 p-2">
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={addIngredient}>
            <Plus size={16} /> Add Ingredient
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-charcoal-light border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-cream mb-4">Instructions</h2>
          {instructions.map((step, i) => (
            <div key={i} className="flex gap-2 mb-2 items-start">
              <span className="w-8 h-10 flex items-center justify-center text-mulberry-400 font-semibold text-sm">{i + 1}.</span>
              <Textarea value={step} onChange={(e) => updateInstruction(i, e.target.value)} placeholder={`Step ${i + 1}`} className="flex-1 min-h-[60px]" />
              {instructions.length > 1 && (
                <button type="button" onClick={() => removeInstruction(i)} className="text-red-400 hover:text-red-300 p-2 mt-2">
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={addInstruction}>
            <Plus size={16} /> Add Step
          </Button>
        </div>

        <Button type="submit" isLoading={loading} className="w-full" size="lg">
          Publish Recipe
        </Button>
      </form>
    </div>
  );
}
