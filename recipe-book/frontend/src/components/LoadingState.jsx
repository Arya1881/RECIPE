import './LoadingState.css';

export default function LoadingState({ text = 'Loading recipes...' }) {
  return (
    <div className="loading-state">
      <div className="loading-state-spinner">
        <div className="loading-state-ring"></div>
      </div>
      <p className="loading-state-text">{text}</p>
    </div>
  );
}
