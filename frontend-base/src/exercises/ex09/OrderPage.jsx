import { useReducer, useState } from "react";
import MenuList from "./MenuList.jsx";
import Cart from "./Cart.jsx";
import CheckoutOptions from "./CheckoutOptions.jsx";
import QuoteSummary from "./QuoteSummary.jsx";
import ConfirmOrder from "./ConfirmOrder.jsx";
import OrderLookup from "./OrderLookup.jsx";
import MyOrders from "./MyOrders.jsx";
import { cartReducer, initialCart } from "./cartReducer.js";
import { SAMPLE_DISTRICTS, SAMPLE_MENU, SAMPLE_ORDER, SAMPLE_QUOTE } from "./sample.js";

// EJERCICIO 9 — Cotizador de pedidos
// Los componentes visuales ya están hechos: implemente el reducer y conéctelos con el backend.
export default function OrderPage() {
  // TODO 1: GET /menu y GET /districts (useEffect) en lugar de los datos de ejemplo.
  const [menu, setMenu] = useState(SAMPLE_MENU);
  const [districts, setDistricts] = useState(SAMPLE_DISTRICTS);

  // TODO 2: implementar cartReducer.js (ADD_ITEM, REMOVE_ITEM, SET_QUANTITY, CLEAR).
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  const [district, setDistrict] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [currency, setCurrency] = useState("PEN");

  // TODO 3: useEffect → cuando cambie cart, couponCode, district o currency,
  //         POST /quotes?currency=... con { items, couponCode, district } y guardar la respuesta en `quote`.
  //         Si el backend responde error, muestre el mensaje SIN vaciar el carrito.
  const [quote, setQuote] = useState(cart.length ? SAMPLE_QUOTE : null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // TODO 4: POST /orders con items, couponCode, district y customer → guardar en `createdOrder`.
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null); // { message, status } | null
  const [createdOrder, setCreatedOrder] = useState(null);
  async function handleConfirm() {}

  // TODO 5: GET /orders/:code  y  GET /customers/:phone/orders
  const [lookupCode, setLookupCode] = useState("");
  const [foundOrder, setFoundOrder] = useState(null);
  const [lookupError, setLookupError] = useState(null);
  const [phone, setPhone] = useState("");
  const [myOrders, setMyOrders] = useState([]);
  const [myOrdersError, setMyOrdersError] = useState(null);
  async function handleLookup() {
    setFoundOrder(SAMPLE_ORDER);
  }
  async function handleMyOrders() {}

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_24rem]">
      <MenuList items={menu} onAdd={(item) => dispatch({ type: "ADD_ITEM", item: { productId: item.id, name: item.name } })} />

      <div className="space-y-4">
        <Cart
          items={cart}
          onSetQuantity={(productId, quantity) => dispatch({ type: "SET_QUANTITY", productId, quantity })}
          onRemove={(productId) => dispatch({ type: "REMOVE_ITEM", productId })}
          onClear={() => dispatch({ type: "CLEAR" })}
        />
        <CheckoutOptions
          districts={districts}
          district={district}
          onDistrictChange={setDistrict}
          couponCode={couponCode}
          onCouponChange={setCouponCode}
          currency={currency}
          onCurrencyChange={setCurrency}
          warnings={quote?.warnings}
        />
        <QuoteSummary quote={quote} loading={quoteLoading} />
        <ConfirmOrder
          customer={customer}
          onCustomerChange={(field, value) => setCustomer((c) => ({ ...c, [field]: value }))}
          onConfirm={handleConfirm}
          submitting={submitting}
          disabled={cart.length === 0}
          error={orderError}
          createdOrder={createdOrder}
        />
      </div>

      <div className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
        <OrderLookup code={lookupCode} onCodeChange={setLookupCode} onSearch={handleLookup} order={foundOrder} error={lookupError} />
        <MyOrders phone={phone} onPhoneChange={setPhone} onSearch={handleMyOrders} orders={myOrders} error={myOrdersError} />
      </div>
    </div>
  );
}
