import { useState, useEffect, useCallback } from 'react';
import * as api from '../../services/api';
import Header from './Header';
import ShortenForm from './ShortenForm';
import UrlList from './UrlList';
import Loader from '../common/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
  };

  const handleUrlDeleted = (deletedId) => {
    setUrls((prevUrls) => prevUrls.filter((url) => url.id !== deletedId));
  };

  return (
    <div className="dashboard-container">
      <Header />
      <ShortenForm onUrlShortened={handleUrlShortened} />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="url-list-placeholder">{error}</p>
      ) : (
        <UrlList urls={urls} onUrlDeleted={handleUrlDeleted} />
      )}
    </div>
  );
};

export default Dashboard;
