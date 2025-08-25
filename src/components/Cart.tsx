"use client";

import { useCart } from "@/contexts/CartContext"; // Assume you add this context

export default function Cart() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div className="mt-8">
      <h2 className="text-2xl">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.title} - ${item.price}
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button className="bg-green-500 text-white px-4 py-2">Checkout</button>
    </div>
  );
}

