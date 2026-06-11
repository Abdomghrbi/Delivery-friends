import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/orderService';
import { getProfiles } from '../../services/userService';

const initialForm = {
  customer_id: '',
  item_name: '',
  pickup_address: '',
  pickup_lat: '',
  pickup_lng: '',
  delivery_address: '',
  delivery_lat: '',
  delivery_lng: '',
  notes: '',
};

export default function OrderCreation() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const profiles = await getProfiles();
        setCustomers(profiles.filter((profile) => profile.role === 'customer'));
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomers();
  }, []);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      await createOrder({
        customer_id: form.customer_id,
        item_name: form.item_name,
        pickup_address: form.pickup_address,
        pickup_lat: form.pickup_lat ? Number(form.pickup_lat) : null,
        pickup_lng: form.pickup_lng ? Number(form.pickup_lng) : null,
        delivery_address: form.delivery_address,
        delivery_lat: form.delivery_lat ? Number(form.delivery_lat) : null,
        delivery_lng: form.delivery_lng ? Number(form.delivery_lng) : null,
        status: 'pending',
        notes: form.notes,
      });

      navigate('/admin/orders');
    } catch (createError) {
      setMessage(createError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="container page">
        <div className="page-header">
          <div>
            <h1>إنشاء طلب يدوي</h1>
            <p className="text-muted">الأدمن يمكنه إدخال طلب نيابة عن العميل.</p>
          </div>
        </div>

        <form className="card form-grid" onSubmit={handleSubmit}>
          <div>
            <label>العميل</label>
            <select value={form.customer_id} onChange={updateField('customer_id')} required disabled={loadingCustomers}>
              <option value="">اختر العميل</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.full_name ?? customer.id}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-2">
            <div>
              <label>اسم الطلب / الصنف</label>
              <input value={form.item_name} onChange={updateField('item_name')} required />
            </div>
            <div>
              <label>عنوان الاستلام</label>
              <input value={form.pickup_address} onChange={updateField('pickup_address')} required />
            </div>
          </div>

          <div className="grid grid-2">
            <div>
              <label>خط العرض للاستلام</label>
              <input value={form.pickup_lat} onChange={updateField('pickup_lat')} />
            </div>
            <div>
              <label>خط الطول للاستلام</label>
              <input value={form.pickup_lng} onChange={updateField('pickup_lng')} />
            </div>
          </div>

          <div className="grid grid-2">
            <div>
              <label>عنوان التسليم</label>
              <input value={form.delivery_address} onChange={updateField('delivery_address')} required />
            </div>
            <div>
              <label>ملاحظات</label>
              <textarea rows="3" value={form.notes} onChange={updateField('notes')} />
            </div>
          </div>

          <div className="grid grid-2">
            <div>
              <label>خط العرض للتسليم</label>
              <input value={form.delivery_lat} onChange={updateField('delivery_lat')} />
            </div>
            <div>
              <label>خط الطول للتسليم</label>
              <input value={form.delivery_lng} onChange={updateField('delivery_lng')} />
            </div>
          </div>

          {message ? <div className="text-warning">{message}</div> : null}

          <div className="form-actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'جاري الإنشاء...' : 'إنشاء الطلب'}
            </button>
            <button type="button" className="btn secondary" onClick={() => setForm(initialForm)}>
              مسح النموذج
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
