import './CategoryFilter.css';

const CATEGORIES = [
  { name: 'All', emoji: '✨' },
  { name: 'Breakfast', emoji: '🥞' },
  { name: 'Lunch', emoji: '🥗' },
  { name: 'Dinner', emoji: '🍽️' },
  { name: 'Snack', emoji: '🍿' },
  { name: 'Dessert', emoji: '🍰' },
  { name: 'Other', emoji: '🍴' },
];

export default function CategoryFilter({ selected, onChange, counts = {} }) {
  return (
    <div className="category-filter" role="group" aria-label="Filter by category">
      {CATEGORIES.map((cat) => {
        const count = counts[cat.name];
        const isSelected = selected === cat.name;

        return (
          <button
            key={cat.name}
            className={`category-filter-pill${isSelected ? ' category-filter-pill--active' : ''}`}
            onClick={() => onChange(cat.name)}
            type="button"
            aria-pressed={isSelected}
          >
            <span className="category-filter-emoji">{cat.emoji}</span>
            <span className="category-filter-name">{cat.name}</span>
            {count != null && (
              <span className={`category-filter-count ${isSelected ? 'count-active' : ''}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
