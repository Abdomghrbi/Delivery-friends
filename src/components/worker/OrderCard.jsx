import { formatDateTime } from '../../utils/helpers';
import StatusBadge from '../shared/StatusBadge';

export default function OrderCard({ order, actions = null }) {
  return (
    <div className="card">
      <div className="page-header" style={{ marginBottom: 10 }}>
        <div>
          <h3>{order.item_name}</h3>
          <div className="small text-muted">{order.id}</div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="stack">
        <div>
          <div className="small text-muted">الاستلام</div>
          <strong>{order.pickup_address}</strong>
        </div>
        <div>
          <div className="small text-muted">التسليم</div>
          <strong>{order.delivery_address}</strong>
        </div>
        <div className="small text-muted">تاريخ الإنشاء: {formatDateTime(order.created_at)}</div>
      </div>

      {actions ? <div className="form-actions">{actions}</div> : null}
    </div>
  );
}
