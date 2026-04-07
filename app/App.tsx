import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminOrders from './pages/AdminOrders';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>
    </BrowserRouter>
  );
}
