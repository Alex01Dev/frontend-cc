export const getLocalCart = () => {
  return JSON.parse(localStorage.getItem("local_cart")) || [];
};

export const saveLocalCart = (cart) => {
  localStorage.setItem("local_cart", JSON.stringify(cart));
};

export const addToLocalCart = (product) => {
  const cart = getLocalCart();
  const existing = cart.find((p) => p.product_id === product.product_id);

  if (existing) {
    existing.quantity = Number(existing.quantity || 0) + Number(product.quantity || 0);
  } else {
    cart.push({ ...product, quantity: Number(product.quantity || 1) });
  }
  saveLocalCart(cart);
};

export const removeFromLocalCart = (productId) => {
  const cart = getLocalCart();
  const updated = cart.filter((p) => p.product_id !== productId);
  saveLocalCart(updated);
  return updated;
};

export const updateLocalCartQuantity = (productId, quantity) => {
  const cart = getLocalCart();
  const updated = cart.map((p) =>
    p.product_id === productId ? { ...p, quantity: Number(quantity) } : p
  );
  saveLocalCart(updated);
  return updated;
};

export const clearLocalCart = () => {
  localStorage.removeItem("local_cart");
};
