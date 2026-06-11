jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Navbar from './components/shared/Navbar';

// صفحات المصادقة
import Login from './components/auth/Login';

// صفحات العميل
import CustomerDashboard from './components/customer/CustomerDashboard';
import NewOrderForm from './components/customer/NewOrderForm';
import CustomerOrders from './components/customer/CustomerOrders';
import OrderTracking from './components/customer/OrderTracking';

// صفحات العامل
import WorkerDashboard from './components/worker/WorkerDashboard';
import WorkerMap from './components/worker/WorkerMap';
import OrderDetail from './components/worker/OrderDetail';

// صفحات الإدارة
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import OrderCreation from './components/admin/OrderCreation';
import OrderList from './components/admin/OrderList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* عام */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* العميل */}
          <Route path="/customer" element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/customer/new-order" element={
            <ProtectedRoute role="customer">
              <NewOrderForm />
            </ProtectedRoute>
          } />
          <Route path="/customer/orders" element={
            <ProtectedRoute role="customer">
              <CustomerOrders />
            </ProtectedRoute>
          } />
          <Route path="/customer/track/:orderId" element={
            <ProtectedRoute role="customer">
              <OrderTracking />
            </ProtectedRoute>
          } />

          {/* العامل */}
          <Route path="/worker" element={
            <ProtectedRoute role="worker">
              <WorkerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/worker/map" element={
            <ProtectedRoute role="worker">
              <WorkerMap />
            </ProtectedRoute>
          } />
          <Route path="/worker/order/:orderId" element={
            <ProtectedRoute role="worker">
              <OrderDetail />
            </ProtectedRoute>
          } />

          {/* الإدارة */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute role="admin">
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute role="admin">
              <OrderList />
            </ProtectedRoute>
          } />
          <Route path="/admin/create-order" element={
            <ProtectedRoute role="admin">
              <OrderCreation />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
