import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LogOut, RefreshCw, Package, Phone, MapPin, Clock } from 'lucide-react';
import { supabase, type Order } from '../lib/supabase';

const STATUS_LABELS: Record<string, { text: string; color: string; bg: string }> = {
  new: { text: 'ახალი', color: '#C1331E', bg: '#FEE2E2' },
  confirmed: { text: 'დადასტურებული', color: '#D97706', bg: '#FEF3C7' },
  delivered: { text: 'მიწოდებული', color: '#059669', bg: '#D1FAE5' },
  cancelled: { text: 'გაუქმებული', color: '#6B7280', bg: '#F3F4F6' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      navigate('/admin');
      return;
    }

    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data } = await query;
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const updateStatus = async (id: number, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.price, 0);
  const newCount = orders.filter(o => o.status === 'new').length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF5F0' }}>
      {/* Admin Header */}
      <header className="py-4 px-4 md:px-8 shadow-lg" style={{ backgroundColor: '#5A0D23' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌶️</span>
            <h1 className="text-xl font-bold text-white">
              ajika.store <span className="text-sm opacity-70 font-normal">ადმინი</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500">სულ შეკვეთა</p>
            <p className="text-2xl font-bold" style={{ color: '#5A0D23' }}>{orders.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500">ახალი</p>
            <p className="text-2xl font-bold" style={{ color: '#C1331E' }}>{newCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500">შემოსავალი</p>
            <p className="text-2xl font-bold" style={{ color: '#059669' }}>{totalRevenue}₾</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500">დღეს</p>
            <p className="text-2xl font-bold" style={{ color: '#D97706' }}>
              {orders.filter(o => {
                const today = new Date().toISOString().split('T')[0];
                return o.created_at?.startsWith(today);
              }).length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: 'all', label: 'ყველა' },
            { key: 'new', label: 'ახალი' },
            { key: 'confirmed', label: 'დადასტურებული' },
            { key: 'delivered', label: 'მიწოდებული' },
            { key: 'cancelled', label: 'გაუქმებული' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === f.key ? 'text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              style={filter === f.key ? { backgroundColor: '#5A0D23' } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">იტვირთება...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">შეკვეთები არ არის</div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = STATUS_LABELS[order.status] || STATUS_LABELS.new;
              return (
                <div key={order.id} className="bg-white rounded-xl p-5 shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📦</span>
                      <div>
                        <h3 className="font-bold text-lg" style={{ color: '#5A0D23' }}>{order.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Phone size={12} /> {order.phone}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {order.created_at ? new Date(order.created_at).toLocaleString('ka-GE') : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: status.bg, color: status.color }}
                      >
                        {status.text}
                      </span>
                      <span className="font-bold text-lg" style={{ color: '#C1331E' }}>{order.price}₾</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center gap-2"><Package size={14} /> {order.volume} ლიტრი</p>
                      <p className="flex items-center gap-2"><MapPin size={14} /> {order.address}</p>
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'new' && (
                        <>
                          <button
                            onClick={() => updateStatus(order.id!, 'confirmed')}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                            style={{ backgroundColor: '#D97706' }}
                          >
                            დადასტურება
                          </button>
                          <button
                            onClick={() => updateStatus(order.id!, 'cancelled')}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
                          >
                            გაუქმება
                          </button>
                        </>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(order.id!, 'delivered')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                          style={{ backgroundColor: '#059669' }}
                        >
                          მიწოდებულია
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
