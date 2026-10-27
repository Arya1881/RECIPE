import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import LoadingState from '../components/LoadingState';
import { getRecipeById, createRecipe, updateRecipe } from '../services/api';
import { showToast } from '../utils/toast';
import './RecipeFormPage.css';

export default function RecipeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [initialData, setInitialData] = useState(null);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [notFound, setNotFound] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    const fetch = async () => {
      setLoadingData(true);
      setFetchError(null);
      setNotFound(false);
      try {
        const res = await getRecipeById(id);
        if (!cancelled) setInitialData(res.data.data || res.data);
      } catch (err) {
        if (!cancelled) {
          if (err.message?.includes('404') || err.message?.toLowerCase().includes('not found')) {
            setNotFound(true);
          } else {
            setFetchError(err.message || 'Failed to load recipe.');
          }
        }
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      if (isEdit) {
        await updateRecipe(id, data);
        showToast('Recipe updated successfully!', 'success');
        navigate(`/recipes/${id}`);
      } else {
        await createRecipe(data);
        showToast('Recipe created successfully!', 'success');
        navigate('/');
      }
    } catch (err) {
      setServerError(err.message || 'Failed to save recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) return <LoadingState text="Loading recipe..." />;

  if (notFound) {
    return (
      <div className="form-page-state">
        <span className="form-page-state-emoji">🔍</span>
        <h2>Recipe Not Found</h2>
        <p>This recipe does not exist or has been deleted.</p>
        <Link to="/" className="form-page-back-btn">← Back to Recipes</Link>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="form-page-state">
        <span className="form-page-state-emoji">⚠️</span>
        <h2>Something went wrong</h2>
        <p>{fetchError}</p>
        <Link to="/" className="form-page-back-btn">← Back to Recipes</Link>
      </div>
    );
  }

  return (
    <main className="form-page">
      <div className="form-page-inner">
        <Link to={isEdit ? `/recipes/${id}` : '/'} className="form-page-back">
          ← {isEdit ? 'Back to Recipe' : 'Back to Recipes'}
        </Link>

        <div className="form-page-header">
          <h1 className="form-page-title">
            {isEdit ? 'Edit Recipe' : 'Add New Recipe'}
          </h1>
          <p className="form-page-subtitle">
            {isEdit
              ? 'Update the details of your recipe below.'
              : 'Fill in the details to add a new recipe to your collection.'}
          </p>
        </div>

        <div className="form-page-card">
          <RecipeForm
            initialData={isEdit ? initialData : undefined}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            serverError={serverError}
          />
        </div>
      </div>
    </main>
  );
}
