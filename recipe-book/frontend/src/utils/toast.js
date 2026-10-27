let toastIdCounter = 0;
let listeners = [];
let toasts = [];

function notify() {
  listeners.forEach((fn) => fn([...toasts]));
}

export function subscribeToasts(fn) {
  listeners.push(fn);
  fn([...toasts]);
  return () => {
    listeners = listeners.filter((item) => item !== fn);
  };
}

export function showToast(message, type = 'info') {
  const id = ++toastIdCounter;
  toasts = [...toasts, { id, message, type }];
  notify();
  setTimeout(() => {
    dismissToast(id);
  }, 4000);
  return id;
}

export function dismissToast(id) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function useToast() {
  return { showToast, dismissToast };
}
