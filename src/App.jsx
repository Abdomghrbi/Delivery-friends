import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Navbar from './components/shared/Navbar';

import Login from './components/auth/Login';

import CustomerDashboard from './components/customer/CustomerDashboard';
import NewOrderForm from './components/customer/NewOrderForm';
import CustomerOrders from './components/customer/CustomerOrders';
import OrderTracking from './components/customer/OrderTracking';

import WorkerDashboard from './components/worker/WorkerDashboard';
import WorkerMap from './components/worker/WorkerMap';
import OrderDetail from './components/worker/OrderDetail';

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
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/customer"
            element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/new-order"
            element={
              <ProtectedRoute role="customer">
                <NewOrderForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute role="customer">
                <CustomerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/track/:orderId"
            element={
              <ProtectedRoute role="customer">
                <OrderTracking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/worker"
            element={
              <ProtectedRoute role="worker">
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/map"
            element={
              <ProtectedRoute role="worker">
                <WorkerMap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/worker/order/:orderId"
            element={
              <ProtectedRoute role="worker">
                <OrderDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="admin">
                <OrderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-order"
            element={
              <ProtectedRoute role="admin">
                <OrderCreation />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
