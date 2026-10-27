import { useState, useEffect } from 'react';
import { Loader2, Image, Sparkles, X, Check, Clock, Tag } from 'lucide-react';
import './RecipeForm.css';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Other'];

// Curated high-resolution food photography presets
const PRESET_IMAGES = [
  {
    title: 'Blueberry Pancakes',
    category: 'Breakfast',
    url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Avocado Toast & Egg',
    category: 'Breakfast',
    url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'French Toast & Berries',
    category: 'Breakfast',
    url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Mediterranean Salad Bowl',
    category: 'Lunch',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Gourmet Smash Burger',
    category: 'Lunch',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Fresh Burrito Bowl',
    category: 'Lunch',
    url: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Pan-Seared Salmon',
    category: 'Dinner',
    url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Creamy Tuscan Pasta',
    category: 'Dinner',
    url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Stone-Baked Pizza',
    category: 'Dinner',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Rustic Guacamole & Chips',
    category: 'Snack',
    url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Crispy Street Tacos',
    category: 'Snack',
    url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Triple Berry Cheesecake',
    category: 'Dessert',
    url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Warm Chocolate Lava Cake',
    category: 'Dessert',
    url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Tokyo Tonkotsu Ramen',
    category: 'Other',
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
  },
];

const EMPTY_FORM = {
  name: '',
  category: 'Breakfast',
  ingredients: '',
  steps: '',
  cookingTime: '',
  imageUrl: '',
};

function validate(fields) {
  const errors = {};

  if (!fields.name.trim()) {
    errors.name = 'Recipe name is required.';
  }

  if (!fields.category) {
    errors.category = 'Category is required.';
  }

  if (!fields.ingredients.trim()) {
    errors.ingredients = 'Ingredients are required.';
  }

  if (!fields.steps.trim()) {
    errors.steps = 'Preparation steps are required.';
  }

  const ct = Number(fields.cookingTime);
  if (!fields.cookingTime && fields.cookingTime !== 0) {
    errors.cookingTime = 'Cooking time is required.';
  } else if (!Number.isInteger(ct) || ct < 1) {
    errors.cookingTime = 'Cooking time must be a positive whole number (e.g. 25).';
  }

  if (fields.imageUrl && !/^https?:\/\/.+/.test(fields.imageUrl.trim())) {
    errors.imageUrl = 'Image URL must start with http:// or https://';
  }

  return errors;
}

export default function RecipeForm({ initialData, onSubmit, isLoading, serverError }) {
  const [fields, setFields] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPresets, setShowPresets] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFields({
        name: initialData.name || '',
        category: initialData.category || 'Breakfast',
        ingredients: initialData.ingredients || '',
        steps: initialData.steps || '',
        cookingTime: initialData.cookingTime != null ? String(initialData.cookingTime) : '',
        imageUrl: initialData.imageUrl || '',
      });
      setPreviewError(false);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (name === 'imageUrl') {
      setPreviewError(false);
    }
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate({ ...fields, [name]: value })[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(fields)[name] }));
  };

  const handleSelectPreset = (url) => {
    setFields((prev) => ({ ...prev, imageUrl: url }));
    setPreviewError(false);
    if (errors.imageUrl) {
      setErrors((prev) => ({ ...prev, imageUrl: undefined }));
    }
  };

  const handleClearImage = () => {
    setFields((prev) => ({ ...prev, imageUrl: '' }));
    setPreviewError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(fields).map((k) => [k, true]));
    setTouched(allTouched);
    const newErrors = validate(fields);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      name: fields.name.trim(),
      category: fields.category,
      ingredients: fields.ingredients.trim(),
      steps: fields.steps.trim(),
      cookingTime: Number(fields.cookingTime),
    };
    if (fields.imageUrl.trim()) {
      payload.imageUrl = fields.imageUrl.trim();
    }
    onSubmit(payload);
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="recipe-form-server-error" role="alert">
          {serverError}
        </div>
      )}

      {/* Recipe Name */}
      <div className="recipe-form-group">
        <label className="recipe-form-label" htmlFor="name">
          Recipe Title <span className="required">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className={`recipe-form-input${errors.name && touched.name ? ' recipe-form-input--error' : ''}`}
          value={fields.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g. Grandma's Classic Lasagna"
          disabled={isLoading}
        />
        {errors.name && touched.name && (
          <span className="recipe-form-error">{errors.name}</span>
        )}
      </div>

      {/* Category & Cooking Time Row */}
      <div className="recipe-form-row">
        <div className="recipe-form-group">
          <label className="recipe-form-label" htmlFor="category">
            <Tag size={14} className="recipe-form-label-icon" />
            <span>Category</span> <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            className={`recipe-form-select${errors.category && touched.category ? ' recipe-form-input--error' : ''}`}
            value={fields.category}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && touched.category && (
            <span className="recipe-form-error">{errors.category}</span>
          )}
        </div>

        <div className="recipe-form-group">
          <label className="recipe-form-label" htmlFor="cookingTime">
            <Clock size={14} className="recipe-form-label-icon" />
            <span>Cooking Time (mins)</span> <span className="required">*</span>
          </label>
          <input
            id="cookingTime"
            name="cookingTime"
            type="number"
            min="1"
            step="1"
            className={`recipe-form-input${errors.cookingTime && touched.cookingTime ? ' recipe-form-input--error' : ''}`}
            value={fields.cookingTime}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. 25"
            disabled={isLoading}
          />
          {errors.cookingTime && touched.cookingTime && (
            <span className="recipe-form-error">{errors.cookingTime}</span>
          )}
        </div>
      </div>

      {/* Image URL & Preset Picker */}
      <div className="recipe-form-group">
        <div className="recipe-form-image-header">
          <label className="recipe-form-label" htmlFor="imageUrl">
            <Image size={14} className="recipe-form-label-icon" />
            <span>Recipe Photo</span> <span className="optional">(optional)</span>
          </label>
          <button
            type="button"
            className="recipe-form-preset-toggle"
            onClick={() => setShowPresets(!showPresets)}
          >
            <Sparkles size={14} />
            <span>{showPresets ? 'Hide Photo Gallery' : 'Choose from Curated Photos'}</span>
          </button>
        </div>

        <div className="recipe-form-image-input-wrap">
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            className={`recipe-form-input${errors.imageUrl && touched.imageUrl ? ' recipe-form-input--error' : ''}`}
            value={fields.imageUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Paste an image URL or choose a preset photo below..."
            disabled={isLoading}
          />
          {fields.imageUrl && (
            <button
              type="button"
              className="recipe-form-image-clear-btn"
              onClick={handleClearImage}
              title="Clear image URL"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {errors.imageUrl && touched.imageUrl && (
          <span className="recipe-form-error">{errors.imageUrl}</span>
        )}

        {/* Live Preview Box */}
        {fields.imageUrl && !previewError && (
          <div className="recipe-form-preview-box">
            <span className="recipe-form-preview-label">Live Preview:</span>
            <div className="recipe-form-preview-img-wrap">
              <img
                src={fields.imageUrl}
                alt="Recipe preview"
                className="recipe-form-preview-img"
                onError={() => setPreviewError(true)}
              />
            </div>
          </div>
        )}

        {/* Preset Photos Gallery */}
        {showPresets && (
          <div className="recipe-form-presets-gallery">
            <p className="recipe-form-presets-title">
              Click any photo to instantly apply it to your recipe:
            </p>
            <div className="recipe-form-presets-grid">
              {PRESET_IMAGES.map((preset) => {
                const isSelected = fields.imageUrl === preset.url;
                return (
                  <button
                    key={preset.title}
                    type="button"
                    className={`recipe-form-preset-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelectPreset(preset.url)}
                  >
                    <img src={preset.url} alt={preset.title} loading="lazy" />
                    <span className="recipe-form-preset-name">{preset.title}</span>
                    {isSelected && (
                      <span className="recipe-form-preset-check">
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Ingredients */}
      <div className="recipe-form-group">
        <label className="recipe-form-label" htmlFor="ingredients">
          Ingredients <span className="required">*</span>
        </label>
        <span className="recipe-form-hint">
          List each ingredient on a new line (e.g. quantity + ingredient name)
        </span>
        <textarea
          id="ingredients"
          name="ingredients"
          className={`recipe-form-textarea${errors.ingredients && touched.ingredients ? ' recipe-form-input--error' : ''}`}
          value={fields.ingredients}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="2 cups all-purpose flour&#10;2 large organic eggs&#10;1 cup whole milk&#10;2 tbsp melted butter"
          rows={6}
          disabled={isLoading}
        />
        {errors.ingredients && touched.ingredients && (
          <span className="recipe-form-error">{errors.ingredients}</span>
        )}
      </div>

      {/* Preparation Steps */}
      <div className="recipe-form-group">
        <label className="recipe-form-label" htmlFor="steps">
          Preparation Steps <span className="required">*</span>
        </label>
        <span className="recipe-form-hint">
          Describe each step on a new line with clear instructions
        </span>
        <textarea
          id="steps"
          name="steps"
          className={`recipe-form-textarea${errors.steps && touched.steps ? ' recipe-form-input--error' : ''}`}
          value={fields.steps}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="1. Whisk the dry ingredients together in a large bowl.&#10;2. Whisk wet ingredients in a separate bowl.&#10;3. Combine mixtures gently and cook on a griddle until golden."
          rows={7}
          disabled={isLoading}
        />
        {errors.steps && touched.steps && (
          <span className="recipe-form-error">{errors.steps}</span>
        )}
      </div>

      <button type="submit" className="recipe-form-submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 size={18} className="recipe-form-spinner" />
            <span>Saving Recipe to Atlas...</span>
          </>
        ) : (
          <span>Save Recipe</span>
        )}
      </button>
    </form>
  );
}
