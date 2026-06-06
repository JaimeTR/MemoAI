export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  department: string;
  product: string;
  amount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentProvider: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: string[];
  createdAt: string;
}

class Database {
  private orders: Order[] = [];
  private customers: Customer[] = [];

  addOrder(order: Omit<Order, "id" | "createdAt">): Order {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  getOrders(): Order[] {
    return this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrder(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  updateOrderStatus(id: string, status: Order["status"]): Order | undefined {
    const order = this.orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
    }
    return order;
  }

  addCustomer(customer: Omit<Customer, "id" | "createdAt" | "orders">): Customer {
    const existing = this.customers.find((c) => c.email === customer.email);
    if (existing) return existing;

    const newCustomer: Customer = {
      ...customer,
      id: `CUS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orders: [],
      createdAt: new Date().toISOString(),
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  getCustomers(): Customer[] {
    return this.customers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getCustomer(id: string): Customer | undefined {
    return this.customers.find((c) => c.id === id);
  }

  linkOrderToCustomer(customerEmail: string, orderId: string) {
    const customer = this.customers.find((c) => c.email === customerEmail);
    if (customer && !customer.orders.includes(orderId)) {
      customer.orders.push(orderId);
    }
  }

  getStats() {
    const totalOrders = this.orders.length;
    const totalRevenue = this.orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.amount, 0);
    const pendingOrders = this.orders.filter((o) => o.status === "pending").length;
    const totalCustomers = this.customers.length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalCustomers,
    };
  }
}

export const db = new Database();
