import { useState } from "react";
import { Card, CardContent } from "@/components/card";
import { Button } from "@/components/button";
import { ShoppingCart } from "lucide-react";

const products = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Smartphone", price: 499 },
  { id: 3, name: "Headphones", price: 199 },
];

export default function EcommerceApp() {
  const [cart, setCart] = useState<{ id: number; name: string; price: number }[]>([]);

  const addToCart = async (product: { id: number; name: string; price: number }) => {
    setCart((prev: { id: number; name: string; price: number }[]) => [...prev, product]);
    const payload = {
      "userId": "user123",
      "event": "add_to_cart",
      "productId": product.id
    }
    await fetch("/api/track", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">E-Commerce Store</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="p-4 border rounded-lg">
            <CardContent>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
              <Button onClick={() => addToCart(product)} className="mt-2">
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 p-4 border rounded-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShoppingCart /> Cart
        </h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="mt-2">
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between py-1">
                {item.name} - ${item.price}
                <Button variant="outline" onClick={() => removeFromCart(index)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}