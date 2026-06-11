import { createOrder, getCustomerOrders, getOrderById } from './orderService';

export async function createCustomerOrder(customerId, order) {
  return createOrder({
    customer_id: customerId,
    ...order,
  });
}

export async function fetchCustomerOrders(customerId) {
  return getCustomerOrders(customerId);
}

export async function fetchTrackingOrder(orderId) {
  return getOrderById(orderId);
}
