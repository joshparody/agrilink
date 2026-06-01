import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-green-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tight">AgriLink</span>
          <span className="text-green-300 text-sm hidden sm:block">|</span>
          <span className="text-green-200 text-sm hidden sm:block capitalize">{user?.role} Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-green-100 hidden sm:block">
            👤 {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-white text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-green-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Page Header */}
      <header className="bg-white border-b px-6 py-4 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        {children}
      </main>
    </div>
  );
}