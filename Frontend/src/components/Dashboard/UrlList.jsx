import UrlItem from './UrlItem';

const UrlList = ({ urls, onUrlDeleted }) => {
  if (urls.length === 0) {
    return (
      <div className="url-list-placeholder">
        <p>You haven't shortened any URLs yet. <br/> Use the form above to get started!</p>
      </div>
    );
  }

  return (
    <div className="url-list-container">
      {urls.map((url) => (
        <UrlItem key={url.id} url={url} onUrlDeleted={onUrlDeleted} />
      ))}
    </div>
  );
};

export default UrlList;
