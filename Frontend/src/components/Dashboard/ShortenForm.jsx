import { useState } from 'react';
import * as api from '../../services/api';

const ShortenForm = ({ onUrlShortened }) => {
  const [url, setUrl] = useState('');
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
      const newShortenedUrl = await api.shortenUrl(url);
      onUrlShortened(newShortenedUrl);
      setUrl('');
    } catch (err) {
      setError('Failed to shorten URL. Please enter a valid URL.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shorten-form-container">
      <form onSubmit={handleSubmit} className="shorten-form">
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
      </form>
      {error && <p style={{ color: '#ff8a80', marginTop: '0.5rem', fontSize: '0.9rem' }}>{error}</p>}
    </div>
  );
};

export default ShortenForm;
