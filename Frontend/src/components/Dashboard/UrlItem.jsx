import { useState } from 'react';
import * as api from '../../services/api';

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125H18.75m-1.5-6.375h.625a3.375 3.375 0 013.375 3.375v1.875m0 0a3.375 3.375 0 01-3.375 3.375h-.625m0 0a3.375 3.375 0 01-3.375-3.375v-1.875" />
    </svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.718c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const RedirectIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);


const UrlItem = ({ url, onUrlDeleted }) => {
  const [isCopied, setIsCopied] = useState(false);
  const shortUrl = `${window.location.origin.replace('5173', '8000')}/${url.shortCode}`;

  const handleCopy = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(shortUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this link?')) {
        try {
            await api.deleteUrl(url.id);
            onUrlDeleted(url.id);
        } catch (error) {
            console.error('Failed to delete URL', error);
            alert('Could not delete the link. Please try again.');
        }
    }
  };


  return (
    <div className="url-item">
      <div className="url-info">
        <p className="short-url">{shortUrl}</p>
        <p className="original-url">{url.target}</p>
      </div>
      <div className="url-actions">
        <button className={`action-button ${isCopied ? 'copied' : ''}`} onClick={handleCopy} title="Copy to clipboard">
          {isCopied ? <CheckIcon /> : <CopyIcon />}
        </button>
        <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="action-button" title="Visit link">
            <RedirectIcon />
        </a>
        <button className="action-button delete" onClick={handleDelete} title="Delete link">
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default UrlItem;
