import { useState } from 'react';
import * as api from '../../services/api';

const ShortenForm = ({ onUrlShortened }) => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a URL.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const newShortenedUrl = await api.shortenUrl(url, customCode);
      onUrlShortened(newShortenedUrl);
      setUrl('');
      setCustomCode('');
    } catch (err) {
      setError(err.message || 'Failed to shorten URL. Please enter a valid URL or try a different custom alias.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCustom = () => {
    if (showCustomInput) {
        setCustomCode('');
    }
    setShowCustomInput(!showCustomInput);
  }

  return (
    <div className="shorten-form-container">
      <form onSubmit={handleSubmit} className="shorten-form">
        <div className="main-form">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter a long URL to shorten..."
              className="shorten-input"
              disabled={isLoading}
            />
            <button type="submit" className="shorten-button" disabled={isLoading}>
              {isLoading ? 'Shortening...' : 'Shorten'}
            </button>
        </div>
        
        <button type="button" onClick={handleToggleCustom} className="options-toggle-button">
          {showCustomInput ? '− Fewer options' : '+ Custom Alias'}
        </button>

        {showCustomInput && (
            <div className="custom-alias-container">
                <span className="alias-prefix">{`${window.location.origin.replace('5173', '8000')}/`}</span>
                <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="my-cool-link"
                    className="shorten-input custom-alias-input"
                    disabled={isLoading}
                />
            </div>
        )}

      </form>
      {error && <p style={{ color: '#ff8a80', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</p>}
    </div>
  );
};

export default ShortenForm;
