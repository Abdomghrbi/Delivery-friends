import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useLocation from '../../hooks/useLocation';
import { createCustomerOrder } from '../../services/customerService';

const initialForm = {
  item_name: '',
  pickup_address: '',
  pickup_lat: '',
  pickup_lng: '',
  delivery_address: '',
  delivery_lat: '',
  delivery_lng: '',
  notes: '',
};

export default function NewOrderForm() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { location, loading: locationLoading, error: locationError, requestLocation } = useLocation();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const useCurrentLocation = () => {
    requestLocation();
    if (location) {
      setForm((current) => ({
        ...current,
        pickup_lat: String(location.lat),
        pickup_lng: String(location.lng),
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!profile?.is_verified) {
      setMessage('حسابك يحتاج توثيق من الأدمن قبل إنشاء طلب جديد.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      await createCustomerOrder(profile.id, {
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

      navigate('/customer/orders');
    } catch (submitError) {
      setMessage(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="container page">
        <div className="page-header">
          <div>
            <h1>طلب توصيل جديد</h1>
            <p className="text-muted">أدخل تفاصيل الاستلام والتسليم ثم أرسل الطلب.</p>
          </div>
          <button type="button" className="btn secondary" onClick={useCurrentLocation} disabled={locationLoading}>
            {locationLoading ? 'جاري تحديد الموقع...' : 'استخدام موقعي الحالي'}
          </button>
        </div>

        <form className="card form-grid" onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div>
              <label>اسم الطلب / الصنف</label>
              <input value={form.item_name} onChange={updateField('item_name')} placeholder="مثال: وجبة سريعة" required />
            </div>
            <div>
              <label>عنوان الاستلام</label>
              <input value={form.pickup_address} onChange={updateField('pickup_address')} placeholder="عنوان الاستلام" required />
            </div>
          </div>

          <div className="grid grid-2">
            <div>
              <label>خط العرض للاستلام</label>
              <input value={form.pickup_lat} onChange={updateField('pickup_lat')} placeholder="31.95" />
            </div>
            <div>
              <label>خط الطول للاستلام</label>
              <input value={form.pickup_lng} onChange={updateField('pickup_lng')} placeholder="35.93" />
            </div>
          </div>

          <div className="grid grid-2">
            <div>
              <label>عنوان التسليم</label>
              <input value={form.delivery_address} onChange={updateField('delivery_address')} placeholder="عنوان التسليم" required />
            </div>
            <div>
              <label>ملاحظات</label>
              <textarea rows="3" value={form.notes} onChange={updateField('notes')} placeholder="أي ملاحظات إضافية"></textarea>
            </div>
          </div>

          <div className="grid grid-2">
            <div>
              <label>خط العرض للتسليم</label>
              <input value={form.delivery_lat} onChange={updateField('delivery_lat')} placeholder="31.95" />
            </div>
            <div>
              <label>خط الطول للتسليم</label>
              <input value={form.delivery_lng} onChange={updateField('delivery_lng')} placeholder="35.93" />
            </div>
          </div>

          {locationError ? <div className="text-warning">{locationError.message}</div> : null}
          {message ? <div className="text-warning">{message}</div> : null}

          <div className="form-actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
            <button type="button" className="btn secondary" onClick={() => setForm(initialForm)}>
              مسح الحقول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
