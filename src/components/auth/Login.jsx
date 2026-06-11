import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const initialForm = {
  email: '',
  password: '',
  full_name: '',
  phone: '',
  role: 'customer',
};

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, profile, homePath, signIn, signUp, error } = useAuth();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && profile?.role) {
      navigate(homePath, { replace: true });
    }
  }, [homePath, isAuthenticated, navigate, profile?.role]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      if (mode === 'signin') {
        await signIn({ email: form.email, password: form.password });
      } else {
        await signUp({
          email: form.email,
          password: form.password,
          full_name: form.full_name,
          phone: form.phone,
          role: form.role,
        });
        setMessage('تم إنشاء الحساب. إذا كان البريد يتطلب تأكيداً، أكمل الخطوة من البريد الوارد ثم سجّل دخولك.');
        setMode('signin');
      }
    } catch (submitError) {
      setMessage(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="container page">
        <div className="grid grid-2">
          <section className="hero">
            <h1>Delivery Friends</h1>
            <p className="text-muted">
              منصة توصيل ثلاثية الأدوار: عميل يرسل الطلب، كابتن يستلمه، وأدمن يدير العملية كاملة.
            </p>
            <div className="stack" style={{ marginTop: 18 }}>
              <div className="card" style={{ background: 'rgba(15, 23, 42, 0.55)' }}>
                <strong>Customer</strong>
                <div className="small text-muted">إرسال الطلبات ومتابعتها.</div>
              </div>
              <div className="card" style={{ background: 'rgba(15, 23, 42, 0.55)' }}>
                <strong>Worker</strong>
                <div className="small text-muted">استلام الطلبات وتحديث حالتها.</div>
              </div>
              <div className="card" style={{ background: 'rgba(15, 23, 42, 0.55)' }}>
                <strong>Admin</strong>
                <div className="small text-muted">إدارة المستخدمين والطلبات.</div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="page-header" style={{ marginBottom: 16 }}>
              <div>
                <h2>{mode === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب'}</h2>
                <p className="text-muted">
                  {mode === 'signin' ? 'ادخل إلى حسابك للوصول إلى لوحة التحكم.' : 'أنشئ حساباً جديداً كعميل أو كابتن.'}
                </p>
              </div>
              <button
                type="button"
                className="btn secondary"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              >
                {mode === 'signin' ? 'إنشاء حساب' : 'لدي حساب بالفعل'}
              </button>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
              {mode === 'signup' ? (
                <>
                  <div>
                    <label>الاسم الكامل</label>
                    <input value={form.full_name} onChange={updateField('full_name')} placeholder="اسمك الكامل" required />
                  </div>
                  <div>
                    <label>رقم الهاتف</label>
                    <input value={form.phone} onChange={updateField('phone')} placeholder="05xxxxxxxx" />
                  </div>
                  <div>
                    <label>الدور</label>
                    <select value={form.role} onChange={updateField('role')}>
                      <option value="customer">عميل</option>
                      <option value="worker">كابتن</option>
                    </select>
                  </div>
                </>
              ) : null}

              <div>
                <label>البريد الإلكتروني</label>
                <input type="email" value={form.email} onChange={updateField('email')} placeholder="name@example.com" required />
              </div>

              <div>
                <label>كلمة المرور</label>
                <input type="password" value={form.password} onChange={updateField('password')} placeholder="••••••••" required />
              </div>

              {(message || error?.message) ? <div className="text-warning">{message || error.message}</div> : null}

              <div className="form-actions">
                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? 'جاري المعالجة...' : mode === 'signin' ? 'دخول' : 'تسجيل'}
                </button>
              </div>
            </form>

            <p className="small text-muted" style={{ marginTop: 16 }}>
              ملاحظة: حسابات العملاء يمكن أن تحتاج تفعيل من الأدمن قبل استخدامها.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
