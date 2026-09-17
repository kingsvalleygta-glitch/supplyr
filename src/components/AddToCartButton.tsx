"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";

export function AddToCartButton({
  productId,
  disabled,
  className = "",
  sticky = false,
}: {
  productId: string;
  disabled?: boolean;
  className?: string;
  sticky?: boolean;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(productId, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${
        sticky
          ? "rounded-xl border border-border bg-surface p-4 shadow-md lg:sticky lg:top-28"
          : ""
      } ${className}`}
    >
      <label className="flex items-center gap-2 text-sm font-medium text-ink-muted">
        Qty
        <input
          type="number"
          min={1}
          max={999}
          value={qty}
          disabled={disabled}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="input-field w-20 py-2.5"
        />
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={handleAdd}
        className="btn-primary min-w-[9.5rem] flex-1 py-2.5 sm:flex-none"
      >
        {added ? "Added to cart" : disabled ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
}
