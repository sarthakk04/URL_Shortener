import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="dashboard-header">
      <h1 className="header-title">Shortly</h1>
      <div className="header-user-info">
        {user && <span className="welcome-message">Welcome, {user.firstname}!</span>}
        <button onClick={logout} className="logout-button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
