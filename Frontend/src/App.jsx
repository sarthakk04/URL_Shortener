import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import Loader from './components/common/Loader';
import './App.css';

function App() {
  const { authToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="app-container">
        <Loader />
      </div>
    );
  }

  return (
    <main className="app-container">
      {authToken ? <Dashboard /> : <Auth />}
    </main>
  );
}

export default App;
