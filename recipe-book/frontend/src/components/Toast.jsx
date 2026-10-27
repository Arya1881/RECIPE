import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { subscribeToasts, dismissToast } from '../utils/toast';
import './Toast.css';

const ICONS = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
};

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`toast toast--${toast.type}${visible ? ' toast--visible' : ''}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="toast-icon">{ICONS[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        type="button"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToasts(setItems);
    return unsubscribe;
  }, []);

  return (
    <div className="toast-container" aria-label="Notifications">
      {items.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}
