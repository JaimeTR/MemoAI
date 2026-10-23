# DevmarkPE Store

La tienda de tecnología con IA de DEVMARK (`devmarkpe.store`). Next.js 16, Tailwind 4 y Supabase.

## Cómo está armada

| Ruta | Qué es |
|---|---|
| `/` | Inicio de la tienda: portada, catálogo con filtro por categoría, "muy pronto", cómo comprar y preguntas. Identidad de DEVMARK (tinta, índigo, Schibsted Grotesk + Instrument Serif, botones "vidrio con destello"). |
| `/producto/[slug]` | Landing de cada producto. Si el producto tiene `landing = "memoai"` se muestra la landing hecha a mano de MemoAI (`src/components/memoai`); si no, la plantilla general (`src/components/store/ProductoLanding.tsx`): galería, compra, beneficios, video, ficha técnica y preguntas. |
| `/cuenta`, `/pedido/[id]`, `/gracias` | Cuenta del comprador (magic link), estado del pedido y agradecimiento. |
| `/admin` | Pedidos, clientes, cupones y ajustes de pago (Yape, Plin, WhatsApp). |

## El panel es el ERP

La tienda **no tiene panel propio**. Todo se gestiona en el ERP Devmark:

| En el ERP | Qué controla en la tienda |
|---|---|
| Tienda → Productos de tienda | Catálogo: precio, precio anterior, stock, fotos, landing de cada producto. |
| Tienda → Cupones de tienda | Cupones: porcentaje o monto, vencimiento, límite de usos. |
| Tienda → Ajustes de tienda | WhatsApp, Yape, Plin, enlace de pago y la dirección de la tienda. |
| Tienda → Pedidos de tienda | Estado de cada pedido. Al cambiarlo, el ERP avisa a `POST /api/erp/pedidos` y la tienda le escribe al cliente. |

Firmas: todas las llamadas entre la tienda y el ERP llevan la cabecera `x-tienda-signature` con el mismo secreto (`ERP_TIENDA_SECRET` aquí, `TIENDA_SIGNING_SECRET` en el ERP). En Ajustes de tienda del ERP hay que poner la dirección pública de la tienda para que le lleguen los avisos.

## De dónde sale el catálogo

El **ERP Devmark es la fuente del catálogo**: productos, precios, precio anterior, stock, fotos y el contenido de cada landing se gestionan en el ERP (Tienda → Productos de tienda). La tienda los lee de `GET /api/v1/integraciones/tienda/catalogo` con la firma `x-tienda-signature` (`src/lib/catalogo.ts`):

- Las páginas usan el catálogo cacheado 5 minutos.
- Cada pedido vuelve a pedir el producto al ERP en ese momento: el precio y el stock nunca salen del navegador. Agotado o sin unidades suficientes → el pedido se rechaza.
- Si el ERP no está configurado o no responde, se usa la tabla `products` de Supabase y, si tampoco hay, MemoAI con los datos de `src/lib/constants.ts`. La tienda nunca queda vacía.

Cada pedido se guarda en Supabase y se refleja en el ERP (`src/lib/erp.ts`, `POST /api/v1/integraciones/tienda/pedidos`). El ERP aparta el stock al recibirlo y lo devuelve si se cancela. `orders.product_ref` guarda el id del producto en el catálogo (el del ERP): correr `supabase/schema.sql` para agregar esa columna.

## Desplegar en Hostinger

Aplicación web Node.js en hPanel, conectada a este repositorio:

1. hPanel → Sitios web → Agregar sitio → Aplicación web Node.js → importar desde GitHub (este repo, rama `main`).
2. Node 20 o superior. Comando de compilación `npm run build`, de inicio `npm start` (Next usa el puerto que da Hostinger por `PORT`).
3. Variables de entorno (las de `.env.example`) en la configuración de la aplicación, nunca en el repo.
4. Dominio `devmarkpe.store` apuntado a la aplicación; SSL desde hPanel.
5. En el ERP, Ajustes de tienda → dirección `https://devmarkpe.store`.

El disco del hosting no persiste entre despliegues: nada se guarda en el servidor. Las fotos de productos vienen del almacenamiento del ERP y los comprobantes de pago se suben a Supabase Storage.

## Variables

Ver `.env.example`. Para conectar el ERP hacen falta `ERP_API_URL`, `ERP_TIENDA_SECRET` (igual a `TIENDA_SIGNING_SECRET` del ERP) y `ERP_EMPRESA_ID`.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```
