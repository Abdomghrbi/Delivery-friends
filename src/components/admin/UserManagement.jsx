import { useEffect, useState } from 'react';
import { getProfiles, updateUserRole, verifyCustomer } from '../../services/userService';
import { formatDateTime, formatRole } from '../../utils/helpers';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProfiles();
      setUsers(data);
    } catch (loadError) {
      setError(loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (userId, role) => {
    setSavingId(userId);
    try {
      await updateUserRole(userId, role);
      await loadUsers();
    } catch (updateError) {
      setError(updateError);
    } finally {
      setSavingId(null);
    }
  };

  const toggleVerification = async (userId, isVerified) => {
    setSavingId(userId);
    try {
      await verifyCustomer(userId, !isVerified);
      await loadUsers();
    } catch (updateError) {
      setError(updateError);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="app-shell">
      <div className="container page">
        <div className="page-header">
          <div>
            <h1>إدارة المستخدمين</h1>
            <p className="text-muted">تغيير الدور وتوثيق العملاء.</p>
          </div>
          <button type="button" className="btn secondary" onClick={loadUsers}>تحديث</button>
        </div>

        {error ? <div className="card text-warning">{error.message}</div> : null}

        <div className="card">
          {loading ? (
            <div>جاري تحميل المستخدمين...</div>
          ) : users.length === 0 ? (
            <div className="empty-state">لا يوجد مستخدمون بعد.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>الدور</th>
                  <th>الهاتف</th>
                  <th>التوثيق</th>
                  <th>تاريخ الإنشاء</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.full_name ?? user.id}</td>
                    <td>
                      <select value={user.role} onChange={(event) => changeRole(user.id, event.target.value)} disabled={savingId === user.id}>
                        <option value="customer">{formatRole('customer')}</option>
                        <option value="worker">{formatRole('worker')}</option>
                        <option value="admin">{formatRole('admin')}</option>
                      </select>
                    </td>
                    <td>{user.phone ?? '—'}</td>
                    <td>{user.role === 'customer' ? (user.is_verified ? 'موثّق' : 'غير موثّق') : '—'}</td>
                    <td>{formatDateTime(user.created_at)}</td>
                    <td>
                      {user.role === 'customer' ? (
                        <button type="button" className="btn secondary" onClick={() => toggleVerification(user.id, user.is_verified)} disabled={savingId === user.id}>
                          {user.is_verified ? 'إلغاء التوثيق' : 'توثيق العميل'}
                        </button>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
