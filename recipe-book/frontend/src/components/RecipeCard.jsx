import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Edit2, Trash2, ArrowUpRight, ChefHat } from 'lucide-react';
import './RecipeCard.css';

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

export default function RecipeCard({ recipe, onDelete, onEdit }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const theme = CATEGORY_THEMES[recipe.category] || CATEGORY_THEMES.Other;
  const gradient = CATEGORY_GRADIENTS[recipe.category] || CATEGORY_GRADIENTS.Other;
  const showFallback = !recipe.imageUrl || imgError;

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(recipe);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(recipe);
  };

  // Extract first 2-3 ingredients for preview snippet
  const ingredientsPreview = recipe.ingredients
    ? recipe.ingredients
        .split('\n')
        .map((line) => line.replace(/^[-*•\d.]+\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 3)
        .join(' • ')
    : '';

  return (
    <article className="recipe-card">
      <Link to={`/recipes/${recipe._id}`} className="recipe-card-media-wrap">
        {!showFallback && (
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className={`recipe-card-img ${imgLoaded ? 'is-loaded' : 'is-loading'}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}

        {showFallback && (
          <div className="recipe-card-fallback" style={{ background: gradient }}>
            <span className="recipe-card-fallback-emoji">{theme.emoji}</span>
          </div>
        )}

        <div className="recipe-card-overlay-badges">
          <span
            className="recipe-card-badge"
            style={{
              backgroundColor: theme.bg,
              color: theme.text,
              borderColor: theme.border,
            }}
          >
            {theme.emoji} {recipe.category}
          </span>
          <span className="recipe-card-time-pill">
            <Clock size={13} />
            {recipe.cookingTime} min
          </span>
        </div>
      </Link>

      <div className="recipe-card-content">
        <Link to={`/recipes/${recipe._id}`} className="recipe-card-title-link">
          <h3 className="recipe-card-title" title={recipe.name}>
            {recipe.name}
          </h3>
        </Link>

        {ingredientsPreview && (
          <p className="recipe-card-ingredients-snippet">
            <ChefHat size={14} className="recipe-card-snippet-icon" />
            <span>{ingredientsPreview}</span>
          </p>
        )}

        <div className="recipe-card-footer">
          <Link to={`/recipes/${recipe._id}`} className="recipe-card-view-btn">
            <span>View Recipe</span>
            <ArrowUpRight size={16} />
          </Link>

          <div className="recipe-card-action-btns">
            <button
              type="button"
              className="recipe-card-icon-btn recipe-card-icon-btn--edit"
              onClick={handleEdit}
              title="Edit recipe"
              aria-label={`Edit ${recipe.name}`}
            >
              <Edit2 size={15} />
            </button>
            <button
              type="button"
              className="recipe-card-icon-btn recipe-card-icon-btn--delete"
              onClick={handleDelete}
              title="Delete recipe"
              aria-label={`Delete ${recipe.name}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
