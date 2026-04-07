import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getSupabase } from '../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await getSupabase().auth.signInWithPassword({ email, password });

    if (error) {
      setError('არასწორი ელ-ფოსტა ან პაროლი');
      setLoading(false);
      return;
    }

    navigate('/admin/orders');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#5A0D23' }}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌶️</div>
          <h1 className="text-2xl font-bold" style={{ color: '#5A0D23' }}>ადმინ პანელი</h1>
          <p className="text-sm text-gray-500 mt-1">ajika.store</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">{error}</div>
          )}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">ელ-ფოსტა</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
              placeholder="admin@ajika.store"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">პაროლი</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#C1331E' }}
          >
            {loading ? 'შესვლა...' : 'შესვლა'}
          </button>
        </form>
      </div>
    </div>
  );
}
