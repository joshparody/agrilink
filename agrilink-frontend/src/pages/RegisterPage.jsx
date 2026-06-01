import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  // Pick up the role context passed from the Login tab redirection
  const initialRole = location.state?.role || 'farmer';

  // Form Field States
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Synced UI Theme Map to match LoginPage
  const themeConfig = {
    farmer: {
      accentClass: "bg-green-700 hover:bg-green-800 focus:ring-green-500",
      textClass: "text-green-700",
      bgClass: "bg-green-50",
      hint: "Create an account to list crops, access the marketplace, and track buyers."
    },
    buyer: {
      accentClass: "bg-blue-700 hover:bg-blue-800 focus:ring-blue-500",
      textClass: "text-blue-700",
      bgClass: "bg-blue-50",
      hint: "Create an account to buy fresh produce, open contracts, and manage logistics."
    },
    supplier: {
      accentClass: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
      textClass: "text-amber-600",
      bgClass: "bg-amber-50",
      hint: "Create an account to supply seeds, fertilizers, farming equipment, and tools."
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Build the data payload matching your backend's User schema expectations
    const userData = {
      fullName: name,
      email,
      password,
      role: selectedRole // 💡 Crucial: Injects the active category tab value
    };

    try {
      // Execute registration action through AuthProvider context
      const registeredUser = await register(userData);
      const role = registeredUser?.role;

      if (!role) {
        throw new Error("Registration succeeded but no authorization role was issued.");
      }

      console.log(`Registration successful! Automatically routing new ${role} to dashboard.`);
      
      // Auto-route straight into their specific home zone
      if (role === 'farmer') navigate('/farmer-dashboard');
      else if (role === 'supplier') navigate('/supplier-dashboard');
      else if (role === 'buyer') navigate('/buyer-dashboard');
      else navigate('/dashboard');

    } catch (err) {
      console.error("Registration UI layer catch:", err);
      setError(err.response?.data?.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${themeConfig[selectedRole].bgClass} flex items-center justify-center px-4 transition-colors duration-300`}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md transition-all duration-300">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig[selectedRole].textClass} transition-colors duration-300`}>
            🌱 AgriLink
          </h1>
          <p className="text-gray-500 text-sm mt-2 min-h-[40px]">
            {themeConfig[selectedRole].hint}
          </p>
        </div>

        {/* Dynamic Category Tabs */}
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

        {/* Signup Form Data Collection */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

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
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
            {loading ? 'Creating account...' : `Register as ${selectedRole}`}
          </button>
        </form>

        {/* Back Link to Login */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link 
              to="/login" 
              state={{ role: selectedRole }} // Gracefully passes the choice back if they toggle their mind
              className={`font-semibold hover:underline ${themeConfig[selectedRole].textClass}`}
            >
              Sign In here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}