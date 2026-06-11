import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const navItemsByRole = {
  customer: [
    { to: '/customer', label: 'الرئيسية' },
    { to: '/customer/new-order', label: 'طلب جديد' },
    { to: '/customer/orders', label: 'طلباتي' },
  ],
  worker: [
    { to: '/worker', label: 'الرئيسية' },
    { to: '/worker/map', label: 'الخريطة' },
  ],
  admin: [
    { to: '/admin', label: 'الرئيسية' },
    { to: '/admin/orders', label: 'الطلبات' },
    { to: '/admin/users', label: 'المستخدمون' },
    { to: '/admin/create-order', label: 'إنشاء طلب' },
  ],
};

export default function Navbar() {
  const { isAuthenticated, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const role = profile?.role;
  const navItems = role ? navItemsByRole[role] ?? [] : [];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div>
          <strong>Delivery Friends</strong>
          {role ? <div className="small text-muted">{profile?.full_name ?? 'مستخدم'} · {role}</div> : null}
        </div>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  {item.label}
                </NavLink>
              ))}
              <button type="button" className="btn secondary" onClick={handleSignOut}>
                تسجيل الخروج
              </button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              تسجيل الدخول
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
