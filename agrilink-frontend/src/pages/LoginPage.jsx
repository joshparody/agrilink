import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [selectedRole, setSelectedRole] = useState('farmer');

  const themeConfig = {
    farmer: {
      accentClass: "bg-green-700 hover:bg-green-800 focus:ring-green-500",
      textClass: "text-green-700",
      bgClass: "bg-green-50",
      ringClass: "focus:ring-green-500",
      hint: "Access your crop listings, marketplace, and farming insights."
    },
    buyer: {
      accentClass: "bg-blue-700 hover:bg-blue-800 focus:ring-blue-500",
      textClass: "text-blue-700",
      bgClass: "bg-blue-50",
      ringClass: "focus:ring-blue-500",
      hint: "Browse fresh produce, manage purchase orders, and track deliveries."
    },
    supplier: {
      accentClass: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
      textClass: "text-amber-600",
      bgClass: "bg-amber-50",
      ringClass: "focus:ring-amber-500",
      hint: "Manage logistics, inputs, equipment inventories, and bulk requests."
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      const role = loggedInUser?.role; 

      if (!role) {
        throw new Error("No user role found linked to this account profile.");
      }

      console.log(`Authenticated successfully! Routing user to: /${role}-dashboard`);

      if (role === 'farmer') {
        navigate('/farmer-dashboard');
      } else if (role === 'supplier') {
        navigate('/supplier-dashboard');
      } else if (role === 'buyer') {
        navigate('/buyer-dashboard');
      } else {
        navigate('/dashboard'); 
      }

    } catch (err) {
      console.error("Login Interface Layer Exception:", err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${themeConfig[selectedRole].bgClass} flex items-center justify-center px-4 transition-colors duration-300`}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md transition-all duration-300">
        
        {/* Logo Area */}
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig[selectedRole].textClass} transition-colors duration-300`}>
            🌱 AgriLink
          </h1>
          <p className="text-gray-500 text-sm mt-2 min-h-[40px]">
            {themeConfig[selectedRole].hint}
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex border-b border-gray-200 mb-6 text-sm">
          {['farmer', 'buyer', 'supplier'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`flex-1 pb-3 font-semibold capitalize transition-all duration-200 ${
                selectedRole === role
                  ? `border-b-2 border-current ${themeConfig[role].textClass}`
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="username"
              required
              className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${themeConfig[selectedRole].ringClass} transition-all duration-300`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${themeConfig[selectedRole].ringClass} transition-all duration-300`}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2.5 rounded-lg transition dynamic-btn disabled:opacity-60 ${themeConfig[selectedRole].accentClass}`}
          >
            {loading ? 'Signing in...' : `Sign In as ${selectedRole}`}
          </button>
        </form>

        {/* Registration Redirection Links */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              state={{ role: selectedRole }} 
              className={`font-semibold hover:underline ${themeConfig[selectedRole].textClass}`}
            >
              Register as {selectedRole}
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}