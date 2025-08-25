export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c2?w=500&h=500&fit=crop",
    description: "A classic vintage denim jacket with authentic distressing and perfect fit. Made from premium denim with a comfortable, relaxed silhouette.",
    category: "Jackets"
  },
  {
    id: "2",
    title: "Handcrafted Leather Bag",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1548032908-8b0b1f4b0b0b?w=500&h=500&fit=crop",
    description: "Beautifully crafted leather bag with brass hardware and adjustable straps. Perfect for everyday use with plenty of storage space.",
    category: "Bags"
  },
  {
    id: "3",
    title: "Artisan Ceramic Vase",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
    description: "Hand-thrown ceramic vase with a unique glaze finish. Each piece is one-of-a-kind and perfect for displaying fresh flowers or as a standalone decorative piece.",
    category: "Home & Garden"
  },
  {
    id: "4",
    title: "Handmade Wool Scarf",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&h=500&fit=crop",
    description: "Soft, warm wool scarf hand-knitted using traditional techniques. Available in various colors and patterns, perfect for cold weather.",
    category: "Accessories"
  },
  {
    id: "5",
    title: "Vintage Record Player",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
    description: "Classic vintage record player with modern upgrades. Features a built-in speaker and USB output for digitizing your vinyl collection.",
    category: "Electronics"
  }
];
