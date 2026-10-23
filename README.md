# DevmarkPE Store

La tienda de tecnología con IA de DEVMARK (`devmarkpe.store`). Next.js 16, Tailwind 4 y Supabase.

## Cómo está armada

| Ruta | Qué es |
|---|---|
| `/` | Inicio de la tienda: portada, catálogo con filtro por categoría, "muy pronto", cómo comprar y preguntas. Identidad de DEVMARK (tinta, índigo, Schibsted Grotesk + Instrument Serif, botones "vidrio con destello"). |
| `/producto/[slug]` | Landing de cada producto. Si el producto tiene `landing = "memoai"` se muestra la landing hecha a mano de MemoAI (`src/components/memoai`); si no, la plantilla general (`src/components/store/ProductoLanding.tsx`): galería, compra, beneficios, video, ficha técnica y preguntas. |
| `/cuenta`, `/pedido/[id]`, `/gracias` | Cuenta del comprador (magic link), estado del pedido y agradecimiento. |
| `/admin` | Pedidos, clientes, cupones y ajustes de pago (Yape, Plin, WhatsApp). |

## De dónde sale el catálogo

El **ERP Devmark es la fuente del catálogo**: productos, precios, precio anterior, stock, fotos y el contenido de cada landing se gestionan en el ERP (Tienda → Productos de tienda). La tienda los lee de `GET /api/v1/integraciones/tienda/catalogo` con la firma `x-tienda-signature` (`src/lib/catalogo.ts`):

- Las páginas usan el catálogo cacheado 5 minutos.
- Cada pedido vuelve a pedir el producto al ERP en ese momento: el precio y el stock nunca salen del navegador. Agotado o sin unidades suficientes → el pedido se rechaza.
- Si el ERP no está configurado o no responde, se usa la tabla `products` de Supabase y, si tampoco hay, MemoAI con los datos de `src/lib/constants.ts`. La tienda nunca queda vacía.

Cada pedido se guarda en Supabase y se refleja en el ERP (`src/lib/erp.ts`, `POST /api/v1/integraciones/tienda/pedidos`). El ERP aparta el stock al recibirlo y lo devuelve si se cancela. `orders.product_ref` guarda el id del producto en el catálogo (el del ERP): correr `supabase/schema.sql` para agregar esa columna.

## Variables

Ver `.env.example`. Para conectar el ERP hacen falta `ERP_API_URL`, `ERP_TIENDA_SECRET` (igual a `TIENDA_SIGNING_SECRET` del ERP) y `ERP_EMPRESA_ID`.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```
