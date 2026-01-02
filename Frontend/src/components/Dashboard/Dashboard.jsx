import { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from '../../services/api';
import Header from './Header';
import ShortenForm from './ShortenForm';
import UrlList from './UrlList';
import Loader from '../common/Loader';
import Toast from '../common/Toast';
import './Dashboard.css';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  const fetchUrls = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getUrls();
      setUrls(data.codes || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch URLs. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleUrlShortened = (newUrl) => {
    setUrls((prevUrls) => [newUrl, ...prevUrls]);
    setToast({ show: true, message: 'Link shortened successfully!' });
  };

  const handleUrlDeleted = (deletedId) => {
    setUrls((prevUrls) => prevUrls.filter((url) => url.id !== deletedId));
  };

  const filteredUrls = useMemo(() => {
    if (!searchQuery) return urls;
    return urls.filter(
      (url) =>
        url.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.shortCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [urls, searchQuery]);

  return (
    <div className="dashboard-container">
      <Header />
      <ShortenForm onUrlShortened={handleUrlShortened} />

      <div className="url-list-header">
        <h2 className="url-list-title">My Links</h2>
        <input
          type="text"
          placeholder="Search links..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="url-list-placeholder">{error}</p>
      ) : (
        <UrlList urls={filteredUrls} onUrlDeleted={handleUrlDeleted} />
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          onClose={() => setToast({ show: false, message: '' })}
        />
      )}
    </div>
  );
};

export default Dashboard;
