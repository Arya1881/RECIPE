import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, ArrowLeft, Edit2, Trash2, CheckCircle2, Circle, ChefHat, ListOrdered, Share2 } from 'lucide-react';
import { getRecipeById, deleteRecipe } from '../services/api';
import { showToast } from '../utils/toast';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingState from '../components/LoadingState';
import './RecipeDetails.css';

const CATEGORY_THEMES = {
  Breakfast: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', emoji: '🥞' },
  Lunch: { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0', emoji: '🥗' },
  Dinner: { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE', emoji: '🍽️' },
  Snack: { bg: '#FCE7F3', text: '#9D174D', border: '#FBCFE8', emoji: '🍿' },
  Dessert: { bg: '#EDE9FE', text: '#5B21B6', border: '#DDD6FE', emoji: '🍰' },
  Other: { bg: '#F1F5F9', text: '#334155', border: '#E2E8F0', emoji: '🍴' },
};

const CATEGORY_GRADIENTS = {
  Breakfast: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
  Lunch: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
  Dinner: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
  Snack: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)',
  Dessert: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
  Other: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
};

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const res = await getRecipeById(id);
        const data = res.data?.data || res.data;
        if (!cancelled) {
          setRecipe(data);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.message?.includes('404') || err.message?.toLowerCase().includes('not found')) {
            setNotFound(true);
          } else {
            setError(err.message || 'Failed to load recipe details.');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteRecipe(id);
      showToast(`"${recipe.name}" was permanently removed.`, 'success');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Failed to delete recipe.', 'error');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Recipe link copied to clipboard!', 'info');
    }
  };

  if (loading) return <LoadingState text="Loading culinary details..." />;

  if (notFound) {
    return (
      <div className="recipe-details-state">
        <span className="recipe-details-state-emoji">🔍</span>
        <h2>Recipe Not Found</h2>
        <p>This recipe does not exist or may have been deleted from MongoDB Atlas.</p>
        <Link to="/" className="recipe-details-back-btn">
          ← Back to All Recipes
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-details-state">
        <span className="recipe-details-state-emoji">⚠️</span>
        <h2>Connection Error</h2>
        <p>{error}</p>
        <Link to="/" className="recipe-details-back-btn">
          ← Back to All Recipes
        </Link>
      </div>
    );
  }

  if (!recipe) return null;

  const theme = CATEGORY_THEMES[recipe.category] || CATEGORY_THEMES.Other;
  const gradient = CATEGORY_GRADIENTS[recipe.category] || CATEGORY_GRADIENTS.Other;
  const showFallback = !recipe.imageUrl || imgError;

  // Split ingredients by newline
  const ingredientLines = recipe.ingredients
    ? recipe.ingredients.split('\n').filter((line) => line.trim().length > 0)
    : [];

  // Split preparation steps by newline
  const stepLines = recipe.steps
    ? recipe.steps.split('\n').filter((line) => line.trim().length > 0)
    : [];

  return (
    <main className="recipe-details">
      <div className="recipe-details-inner">
        {/* Navigation Bar */}
        <div className="recipe-details-nav-row">
          <Link to="/" className="recipe-details-back">
            <ArrowLeft size={18} />
            <span>Back to Collection</span>
          </Link>

          <button type="button" className="recipe-details-share-btn" onClick={handleShare}>
            <Share2 size={16} />
            <span>Share Link</span>
          </button>
        </div>

        {/* Hero Card */}
        <div className="recipe-details-hero-card">
          <div className="recipe-details-image-wrap">
            {!showFallback && (
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="recipe-details-image"
                onError={() => setImgError(true)}
              />
            )}
            {showFallback && (
              <div className="recipe-details-fallback" style={{ background: gradient }}>
                <span className="recipe-details-fallback-emoji">{theme.emoji}</span>
              </div>
            )}
          </div>

          <div className="recipe-details-hero-info">
            <div className="recipe-details-meta">
              <span
                className="recipe-details-badge"
                style={{
                  backgroundColor: theme.bg,
                  color: theme.text,
                  borderColor: theme.border,
                }}
              >
                {theme.emoji} {recipe.category}
              </span>
              <span className="recipe-details-time">
                <Clock size={16} />
                <span>{recipe.cookingTime} Minutes</span>
              </span>
            </div>

            <h1 className="recipe-details-name">{recipe.name}</h1>

            <div className="recipe-details-actions">
              <Link
                to={`/recipes/${recipe._id}/edit`}
                className="recipe-details-btn recipe-details-btn--edit"
              >
                <Edit2 size={16} />
                <span>Edit Recipe</span>
              </Link>
              <button
                className="recipe-details-btn recipe-details-btn--delete"
                onClick={() => setConfirmOpen(true)}
                type="button"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Culinary Sections */}
        <div className="recipe-details-grid">
          {/* Ingredients Section */}
          <section className="recipe-details-card">
            <div className="recipe-details-card-header">
              <div className="recipe-details-card-icon-box">
                <ChefHat size={20} />
              </div>
              <div>
                <h2 className="recipe-details-card-title">Ingredients</h2>
                <p className="recipe-details-card-sub">
                  Tap any item to check it off as you prep
                </p>
              </div>
            </div>

            <ul className="recipe-details-ingredients-list">
              {ingredientLines.map((item, idx) => {
                const isChecked = checkedIngredients[idx];
                return (
                  <li
                    key={idx}
                    className={`recipe-details-ingredient-item ${isChecked ? 'is-checked' : ''}`}
                    onClick={() => toggleIngredient(idx)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleIngredient(idx);
                      }
                    }}
                  >
                    <span className="recipe-details-check-icon">
                      {isChecked ? (
                        <CheckCircle2 size={18} className="check-done" />
                      ) : (
                        <Circle size={18} className="check-pending" />
                      )}
                    </span>
                    <span className="recipe-details-item-text">{item}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Preparation Steps Section */}
          <section className="recipe-details-card">
            <div className="recipe-details-card-header">
              <div className="recipe-details-card-icon-box recipe-details-card-icon-box--steps">
                <ListOrdered size={20} />
              </div>
              <div>
                <h2 className="recipe-details-card-title">Preparation Steps</h2>
                <p className="recipe-details-card-sub">Follow step-by-step instructions</p>
              </div>
            </div>

            <div className="recipe-details-steps-list">
              {stepLines.map((step, idx) => {
                // If line already starts with "1.", clean it or keep cleanly
                const cleanStep = step.replace(/^\d+[.)]\s*/, '');
                return (
                  <div key={idx} className="recipe-details-step-card">
                    <span className="recipe-details-step-number">{idx + 1}</span>
                    <p className="recipe-details-step-text">{cleanStep}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipe.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        isLoading={deleting}
      />
    </main>
  );
}
