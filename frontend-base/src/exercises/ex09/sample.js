export const SAMPLE_MENU = [
  { id: 1, name: "Lomo saltado", category: "Platos de fondo", price: 28, available: true },
  { id: 2, name: "Ají de gallina", category: "Platos de fondo", price: 24, available: true },
  { id: 3, name: "Ceviche", category: "Entradas", price: 32, available: false },
  { id: 4, name: "Chicha morada", category: "Bebidas", price: 8, available: true },
];
export const SAMPLE_DISTRICTS = ["Surco", "Miraflores", "San Isidro"];
export const SAMPLE_QUOTE = {
  currency: "PEN",
  lines: [{ productId: 1, name: "Lomo saltado", unitPrice: 28, quantity: 2, lineTotal: 56 }],
  subtotal: 56,
  couponDiscount: 5.6,
  volumeDiscount: 0,
  delivery: 8,
  total: 58.4,
  warnings: [],
};
export const SAMPLE_ORDER = { code: "PED-0001", status: "RECEIVED", total: 58.4, currency: "PEN" };
