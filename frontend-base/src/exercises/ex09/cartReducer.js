// Estado del carrito: arreglo de líneas { productId, name, quantity }.
// (No guarde precios ni totales: los calcula el backend con POST /quotes.)
export const initialCart = [];

// TODO: implementar el reducer (función PURA, sin mutar `state`) para estas acciones:
//   { type: "ADD_ITEM",     item: { productId, name } }        → agrega o suma 1 a la cantidad
//   { type: "REMOVE_ITEM",  productId }                        → quita la línea
//   { type: "SET_QUANTITY", productId, quantity }              → cambia la cantidad
//   { type: "CLEAR" }                                          → vacía el carrito
export function cartReducer(state, action) {
  switch (action.type) {
    default:
      return state;
  }
}
