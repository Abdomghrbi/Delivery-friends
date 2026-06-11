import { useCallback, useEffect, useState } from 'react';
import {
  acceptOrder,
  cancelOrder,
  createOrder,
  getAllOrders,
  getCustomerOrders,
  getOrderById,
  getWorkerOrders,
  markDelivered,
  markInTransit,
  updateOrder,
} from '../services/orderService';

export default function useOrders({ mode = 'all', customerId = null, workerId = null, orderId = null } = {}) {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (mode === 'single') {
        const singleOrder = await getOrderById(orderId);
        setOrder(singleOrder);
        setOrders([]);
      } else if (mode === 'customer') {
        const customerOrders = await getCustomerOrders(customerId);
        setOrders(customerOrders);
        setOrder(null);
      } else if (mode === 'worker') {
        const workerOrders = await getWorkerOrders(workerId);
        setOrders(workerOrders);
        setOrder(null);
      } else {
        const allOrders = await getAllOrders();
        setOrders(allOrders);
        setOrder(null);
      }
    } catch (requestError) {
      setError(requestError);
    } finally {
      setLoading(false);
    }
  }, [customerId, mode, orderId, workerId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    orders,
    order,
    loading,
    error,
    refresh,
    createOrder,
    acceptOrder,
    markInTransit,
    markDelivered,
    cancelOrder,
    updateOrder,
  };
}
