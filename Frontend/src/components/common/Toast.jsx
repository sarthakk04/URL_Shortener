import { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-close after 4 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className={`toast-container ${type}`}>
      <div className="toast-icon">
        {type === 'success' ? '🎉' : '🔥'}
      </div>
      <p className="toast-message">{message}</p>
      <button onClick={onClose} className="toast-close-button">&times;</button>
    </div>
  );
};

export default Toast;
