import { Plus, Sparkles, Loader2 } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({ onAddRecipe, onSeed, isSeeding }) {
  return (
    <div className="empty-state">
      <div className="empty-state-illustration" aria-hidden="true">
        <div className="empty-state-book">
          <span className="empty-state-emoji">🍽️</span>
        </div>
      </div>
      <h2 className="empty-state-heading">Your Cookbook is Waiting</h2>
      <p className="empty-state-subtext">
        Start building your personal recipe collection with your favorite home-cooked meals, or load our handpicked culinary samples.
      </p>
      <div className="empty-state-actions">
        <button className="empty-state-btn empty-state-btn--primary" onClick={onAddRecipe} type="button">
          <Plus size={18} />
          <span>Create New Recipe</span>
        </button>
        {onSeed && (
          <button
            className="empty-state-btn empty-state-btn--secondary"
            onClick={onSeed}
            type="button"
            disabled={isSeeding}
          >
            {isSeeding ? (
              <>
                <Loader2 size={18} className="empty-state-spinner" />
                <span>Loading Chef Samples...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Load 8 Sample Recipes</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
