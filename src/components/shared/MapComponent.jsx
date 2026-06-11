export default function MapComponent({ title = 'الخريطة', location, orders = [] }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {location ? (
        <p className="text-muted">
          الموقع الحالي: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
        </p>
      ) : (
        <p className="text-muted">الموقع غير مفعل بعد. يمكن استخدام GPS على الهاتف لعرض موقعك الحالي.</p>
      )}

      <div className="empty-state" style={{ marginBottom: 12 }}>
        هنا سنربط لاحقاً خريطة فعلية مثل Google Maps أو Mapbox.
      </div>

      <div className="stack">
        {orders.length === 0 ? (
          <p className="text-muted">لا توجد طلبات للعرض حالياً.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="card" style={{ background: 'rgba(15, 23, 42, 0.65)' }}>
              <strong>{order.item_name}</strong>
              <div className="small text-muted">{order.pickup_address} → {order.delivery_address}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
