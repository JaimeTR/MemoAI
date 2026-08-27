import { supabaseAdmin } from "@/lib/supabase/admin";

export interface Order {
  id: string;
  customerId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  dni?: string;
  mapsLink?: string;
  city: string;
  province?: string;
  department: string;
  productId?: string | null;
  product: string;
  quantity: number;
  couponCode?: string;
  amount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentProvider: string;
  paymentProofUrl?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  salePrice: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  stock?: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: string[];
  createdAt: string;
}

export interface ShopSettings {
  whatsappNumber: string;
  yapeNumber: string;
  plinNumber: string;
  yapeName: string;
  paymentLink: string;
  paymentLinkEnabled: boolean;
}

const defaultSettings: ShopSettings = {
  whatsappNumber: "+51975646074",
  yapeNumber: "999999999",
  plinNumber: "999999999",
  yapeName: "MemoAI Peru",
  paymentLink: "",
  paymentLinkEnabled: false,
};

// snake_case (Postgres) <-> camelCase (app) mapping — kept local to this file so the rest
// of the app never has to think about the underlying column names.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToOrder(row: any): Order {
  return {
    id: row.id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    address: row.address,
    dni: row.dni ?? undefined,
    mapsLink: row.maps_link ?? undefined,
    city: row.city,
    province: row.province ?? undefined,
    department: row.department,
    productId: row.product_id,
    product: row.product,
    quantity: row.quantity,
    couponCode: row.coupon_code ?? undefined,
    amount: Number(row.amount),
    status: row.status,
    paymentProvider: row.payment_provider,
    paymentProofUrl: row.payment_proof_url ?? undefined,
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCoupon(row: any): Coupon {
  return {
    code: row.code,
    type: row.type,
    value: Number(row.value),
    active: row.active,
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? undefined,
    description: row.description ?? undefined,
    salePrice: Number(row.sale_price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    currency: row.currency,
    images: row.images || [],
    stock: row.stock,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToSettings(row: any): ShopSettings {
  return {
    whatsappNumber: row.whatsapp_number,
    yapeNumber: row.yape_number,
    plinNumber: row.plin_number,
    yapeName: row.yape_name,
    paymentLink: row.payment_link,
    paymentLinkEnabled: row.payment_link_enabled,
  };
}

class Database {
  async getSettings(): Promise<ShopSettings> {
    const { data, error } = await supabaseAdmin.from("shop_settings").select("*").eq("id", 1).single();
    if (error || !data) return { ...defaultSettings };
    return rowToSettings(data);
  }

  async updateSettings(partial: Partial<ShopSettings>): Promise<ShopSettings> {
    const patch: Record<string, unknown> = {};
    if (partial.whatsappNumber !== undefined) patch.whatsapp_number = partial.whatsappNumber;
    if (partial.yapeNumber !== undefined) patch.yape_number = partial.yapeNumber;
    if (partial.plinNumber !== undefined) patch.plin_number = partial.plinNumber;
    if (partial.yapeName !== undefined) patch.yape_name = partial.yapeName;
    if (partial.paymentLink !== undefined) patch.payment_link = partial.paymentLink;
    if (partial.paymentLinkEnabled !== undefined) patch.payment_link_enabled = partial.paymentLinkEnabled;

    const { data, error } = await supabaseAdmin
      .from("shop_settings")
      .update(patch)
      .eq("id", 1)
      .select()
      .single();
    if (error || !data) return this.getSettings();
    return rowToSettings(data);
  }

  async addOrder(order: Omit<Order, "id" | "createdAt">): Promise<Order> {
    const id = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        id,
        customer_id: order.customerId ?? null,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        address: order.address,
        dni: order.dni ?? null,
        maps_link: order.mapsLink ?? null,
        city: order.city,
        province: order.province ?? null,
        department: order.department,
        product_id: order.productId ?? null,
        product: order.product,
        quantity: order.quantity,
        coupon_code: order.couponCode ?? null,
        amount: order.amount,
        status: order.status,
        payment_provider: order.paymentProvider,
        payment_proof_url: order.paymentProofUrl ?? null,
      })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || "Failed to create order");
    return rowToOrder(data);
  }

  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(rowToOrder);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const { data, error } = await supabaseAdmin.from("orders").select("*").eq("id", id).single();
    if (error || !data) return undefined;
    return rowToOrder(data);
  }

  async getOrdersByEmail(email: string): Promise<Order[]> {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("customer_email", email)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(rowToOrder);
  }

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined> {
    const { data, error } = await supabaseAdmin.from("orders").update({ status }).eq("id", id).select().single();
    if (error || !data) return undefined;
    return rowToOrder(data);
  }

  async updateOrderPaymentProof(id: string, url: string): Promise<Order | undefined> {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ payment_proof_url: url })
      .eq("id", id)
      .select()
      .single();
    if (error || !data) return undefined;
    return rowToOrder(data);
  }

  async linkOrdersToCustomer(email: string, customerId: string): Promise<void> {
    await supabaseAdmin.from("orders").update({ customer_id: customerId }).eq("customer_email", email);
  }

  async addCoupon(coupon: Omit<Coupon, "createdAt">): Promise<Coupon> {
    const code = coupon.code.trim().toUpperCase();
    const { data, error } = await supabaseAdmin
      .from("coupons")
      .upsert({ code, type: coupon.type, value: coupon.value, active: coupon.active }, { onConflict: "code" })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || "Failed to save coupon");
    return rowToCoupon(data);
  }

  async getCoupons(): Promise<Coupon[]> {
    const { data, error } = await supabaseAdmin.from("coupons").select("*").order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(rowToCoupon);
  }

  async getCoupon(code: string): Promise<Coupon | undefined> {
    const { data, error } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .single();
    if (error || !data) return undefined;
    return rowToCoupon(data);
  }

  async deleteCoupon(code: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from("coupons").delete().eq("code", code.trim().toUpperCase());
    return !error;
  }

  async addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        slug: product.slug,
        name: product.name,
        tagline: product.tagline ?? null,
        description: product.description ?? null,
        sale_price: product.salePrice,
        original_price: product.originalPrice ?? null,
        currency: product.currency,
        images: product.images,
        stock: product.stock ?? null,
        active: product.active,
      })
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || "Failed to create product");
    return rowToProduct(data);
  }

  async updateProduct(id: string, partial: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>): Promise<Product | undefined> {
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (partial.slug !== undefined) patch.slug = partial.slug;
    if (partial.name !== undefined) patch.name = partial.name;
    if (partial.tagline !== undefined) patch.tagline = partial.tagline;
    if (partial.description !== undefined) patch.description = partial.description;
    if (partial.salePrice !== undefined) patch.sale_price = partial.salePrice;
    if (partial.originalPrice !== undefined) patch.original_price = partial.originalPrice;
    if (partial.currency !== undefined) patch.currency = partial.currency;
    if (partial.images !== undefined) patch.images = partial.images;
    if (partial.stock !== undefined) patch.stock = partial.stock;
    if (partial.active !== undefined) patch.active = partial.active;

    const { data, error } = await supabaseAdmin.from("products").update(patch).eq("id", id).select().single();
    if (error || !data) return undefined;
    return rowToProduct(data);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    return !error;
  }

  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabaseAdmin.from("products").select("*").order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map(rowToProduct);
  }

  async getProduct(idOrSlug: string): Promise<Product | undefined> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const query = supabaseAdmin.from("products").select("*");
    const { data, error } = isUuid
      ? await query.or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`).maybeSingle()
      : await query.eq("slug", idOrSlug).maybeSingle();
    if (error || !data) return undefined;
    return rowToProduct(data);
  }

  async getStats() {
    const orders = await this.getOrders();
    const totalOrders = orders.length;
    const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.amount, 0);
    const pendingOrders = orders.filter((o) => o.status === "pending").length;

    const { count } = await supabaseAdmin.from("profiles").select("*", { count: "exact", head: true });

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalCustomers: count ?? 0,
    };
  }
}

export const db = new Database();
