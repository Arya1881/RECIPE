import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, X, Sparkles, Clock, Utensils, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { getAllRecipes, deleteRecipe, seedRecipes } from '../services/api';
import { showToast } from '../utils/toast';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [onlyQuickMeals, setOnlyQuickMeals] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllRecipes();
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.recipes)
        ? res.data.recipes
        : [];
      setRecipes(list);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      setError(
        err.message ||
          'Could not connect to MongoDB Atlas backend. Please verify your backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Handle seeding sample recipes
  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await seedRecipes();
      const count = res.data?.count || 8;
      showToast(`Successfully loaded ${count} chef-crafted sample recipes!`, 'success');
      await fetchRecipes();
    } catch (err) {
      console.error('Seeding error:', err);
      showToast(err.message || 'Failed to seed sample recipes.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: recipes.length };
    recipes.forEach((r) => {
      if (r.category) {
        counts[r.category] = (counts[r.category] || 0) + 1;
      }
    });
    return counts;
  }, [recipes]);

  // Quick meals count (< 30 min)
  const quickMealsCount = useMemo(() => {
    return recipes.filter((r) => r.cookingTime <= 30).length;
  }, [recipes]);

  // Filtered recipes
  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (!r) return false;
      const name = (r.name || '').toLowerCase();
      const ingredients = (r.ingredients || '').toLowerCase();
      const query = search.trim().toLowerCase();

      const matchesSearch = !query || name.includes(query) || ingredients.includes(query);
      const matchesCategory = category === 'All' || r.category === category;
      const matchesQuick = !onlyQuickMeals || r.cookingTime <= 30;

      return matchesSearch && matchesCategory && matchesQuick;
    });
  }, [recipes, search, category, onlyQuickMeals]);

  const hasFilters = search !== '' || category !== 'All' || onlyQuickMeals;

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setOnlyQuickMeals(false);
  };

  const handleDelete = (recipe) => {
    setSelectedRecipe(recipe);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRecipe) return;
    setDeleting(true);
    try {
      await deleteRecipe(selectedRecipe._id);
      setRecipes((prev) => prev.filter((r) => r._id !== selectedRecipe._id));
      showToast(`"${selectedRecipe.name}" deleted successfully.`, 'success');
      setConfirmOpen(false);
      setSelectedRecipe(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete recipe.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSelectedRecipe(null);
  };

  const handleEdit = (recipe) => {
    navigate(`/recipes/${recipe._id}/edit`);
  };

  const handleAddRecipe = () => navigate('/recipes/new');

  return (
    <main className="home">
      {/* Hero Header */}
      <section className="home-hero">
        <div className="home-hero-glow" aria-hidden="true" />
        <div className="home-hero-inner">
          <div className="home-hero-badge">
            <Sparkles size={14} className="home-hero-badge-icon" />
            <span>Curated Culinary Collection</span>
          </div>

          <h1 className="home-hero-title">
            Your Personal <span className="home-hero-highlight">Recipe Book</span>
          </h1>

          <p className="home-hero-subtitle">
            Organize, cook, and cherish handcrafted recipes with real-time MongoDB Atlas persistence.
          </p>

          <div className="home-hero-cta-group">
            <button className="home-hero-btn home-hero-btn--primary" onClick={handleAddRecipe} type="button">
              <Plus size={19} />
              <span>Add New Recipe</span>
            </button>

            {recipes.length < 8 && (
              <button
                className="home-hero-btn home-hero-btn--seed"
                onClick={handleSeed}
                type="button"
                disabled={isSeeding}
              >
                {isSeeding ? (
                  <>
                    <Loader2 size={17} className="home-hero-spinner" />
                    <span>Loading Recipes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={17} />
                    <span>Load Chef Samples</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Stat metrics */}
          <div className="home-hero-stats">
            <div className="home-hero-stat-card">
              <BookOpen size={18} className="home-hero-stat-icon" />
              <div className="home-hero-stat-info">
                <span className="home-hero-stat-value">{recipes.length}</span>
                <span className="home-hero-stat-label">Total Recipes</span>
              </div>
            </div>

            <div className="home-hero-stat-card">
              <Clock size={18} className="home-hero-stat-icon" />
              <div className="home-hero-stat-info">
                <span className="home-hero-stat-value">{quickMealsCount}</span>
                <span className="home-hero-stat-label">Under 30 Mins</span>
              </div>
            </div>

            <div className="home-hero-stat-card">
              <Utensils size={18} className="home-hero-stat-icon" />
              <div className="home-hero-stat-info">
                <span className="home-hero-stat-value">6</span>
                <span className="home-hero-stat-label">Categories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="home-content">
        {/* Controls Container */}
        <div className="home-controls-card">
          <div className="home-search-row">
            <SearchBar value={search} onChange={setSearch} onClear={() => setSearch('')} />

            <button
              type="button"
              className={`home-quick-toggle ${onlyQuickMeals ? 'is-active' : ''}`}
              onClick={() => setOnlyQuickMeals(!onlyQuickMeals)}
              title="Show meals ready in 30 minutes or less"
            >
              <Clock size={15} />
              <span>Under 30 Mins</span>
              {onlyQuickMeals && <span className="home-quick-dot" />}
            </button>
          </div>

          <div className="home-category-row">
            <CategoryFilter
              selected={category}
              onChange={setCategory}
              counts={categoryCounts}
            />
          </div>
        </div>

        {/* Filter Feedback Status Bar */}
        {hasFilters && (
          <div className="home-filter-feedback">
            <span className="home-recipe-count">
              Showing <strong>{filtered.length}</strong> of {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
              {category !== 'All' && ` in ${category}`}
              {onlyQuickMeals && ` (≤ 30 min)`}
            </span>

            <button className="home-clear-btn" onClick={clearFilters} type="button">
              <X size={14} />
              <span>Reset all filters</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingState text="Loading culinary recipes from MongoDB Atlas..." />}

        {/* Error State */}
        {!loading && error && (
          <div className="home-error-card">
            <div className="home-error-icon-box">
              <AlertCircle size={28} />
            </div>
            <h3 className="home-error-title">
              {error.toLowerCase().includes('network') || error.toLowerCase().includes('connect')
                ? 'Backend Server Not Running'
                : 'Connection Issue'}
            </h3>
            <div className="home-error-desc">
              {error.toLowerCase().includes('network') || error.toLowerCase().includes('connect') ? (
                <div>
                  <p>The frontend cannot connect to the API at <code>http://localhost:5000</code>.</p>
                  <p style={{ marginTop: '0.5rem' }}>
                    Make sure your backend server is running in a terminal:
                  </p>
                  <pre
                    style={{
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      marginTop: '0.4rem',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                    }}
                  >
                    cd backend && npm run dev
                  </pre>
                </div>
              ) : (
                <p>{error}</p>
              )}
            </div>
            <div className="home-error-actions">
              <button className="home-retry-btn" onClick={fetchRecipes} type="button">
                <RefreshCw size={16} />
                <span>Retry Connection</span>
              </button>
              <button
                className="home-retry-btn home-retry-btn--seed"
                onClick={handleSeed}
                type="button"
                disabled={isSeeding}
              >
                <Sparkles size={16} />
                <span>Seed Sample Data</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recipes.length === 0 && (
          <EmptyState
            onAddRecipe={handleAddRecipe}
            onSeed={handleSeed}
            isSeeding={isSeeding}
          />
        )}

        {/* No Filter Results State */}
        {!loading && !error && recipes.length > 0 && filtered.length === 0 && (
          <div className="home-no-results-card">
            <span className="home-no-results-emoji">🔍</span>
            <h3>No matching recipes found</h3>
            <p>We couldn&apos;t find any recipes matching your current search or category filters.</p>
            <button className="home-clear-btn-pill" onClick={clearFilters} type="button">
              Clear All Filters
            </button>
          </div>
        )}

        {/* Recipe Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="home-grid">
            {filtered.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Recipe"
        message={`Are you sure you want to permanently delete "${selectedRecipe?.name}"? This recipe will be removed from MongoDB Atlas.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleting}
      />
    </main>
  );
}
