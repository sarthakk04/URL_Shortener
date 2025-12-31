import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="dashboard-header">
      <h1 className="header-title">Shortly</h1>
      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </header>
  );
};

export default Header;
