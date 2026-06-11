import { requireSupabase } from './supabase';

const orderSelect = `
  *,
  customer:profiles!orders_customer_id_fkey(id, full_name, phone, role, is_verified),
  worker:profiles!orders_worker_id_fkey(id, full_name, phone, role, is_verified)
`;

export async function createOrder(payload) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('orders')
    .insert(payload)
    .select(orderSelect)
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderById(orderId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('orders')
    .select(orderSelect)
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
}

export async function getAllOrders() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('orders')
    .select(orderSelect)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getCustomerOrders(customerId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('orders')
    .select(orderSelect)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getWorkerOrders(workerId) {
  const client = requireSupabase();
  let query = client.from('orders').select(orderSelect).order('created_at', { ascending: false });

  if (workerId) {
    query = query.or(`worker_id.eq.${workerId},status.eq.pending`);
  } else {
    query = query.eq('status', 'pending');
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function updateOrder(orderId, updates) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('orders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select(orderSelect)
    .single();

  if (error) throw error;
  return data;
}

export async function acceptOrder(orderId, workerId) {
  return updateOrder(orderId, {
    worker_id: workerId,
    status: 'accepted',
  });
}

export async function markInTransit(orderId) {
  return updateOrder(orderId, {
    status: 'in_transit',
  });
}

export async function markDelivered(orderId) {
  return updateOrder(orderId, {
    status: 'delivered',
  });
}

export async function cancelOrder(orderId) {
  return updateOrder(orderId, {
    status: 'cancelled',
  });
}
