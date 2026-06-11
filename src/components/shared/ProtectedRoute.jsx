import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, loading, profile, homePath } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="app-shell">
        <div className="container page">
          <div className="card">جاري التحقق من الجلسة...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && profile?.role && profile.role !== role) {
    return <Navigate to={homePath} replace />;
  }

  if (role && !profile?.role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
