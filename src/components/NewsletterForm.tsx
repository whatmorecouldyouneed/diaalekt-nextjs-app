"use client";

import { useState } from "react";
import { addNewsletterEmail } from "@/lib/firebase";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addNewsletterEmail(email);
      setMessage("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      setMessage("Error subscribing.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h3>Subscribe to Newsletter</h3>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="p-2 border"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 ml-2">
        Subscribe
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

