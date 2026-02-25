import { useCart } from "@/contexts/CartContext";
import { useCheckout } from "@/hooks/useCheckout";
import { Loader2, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useState } from "react";

export default function CartDrawer() {
  const {
    items,
    count,
    total,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const { cartCheckout, loading } = useCheckout();
  const [checkingOut, setCheckingOut] = useState(false);

  function handleCheckout() {
    if (items.length === 0) return;
    setCheckingOut(true);
    cartCheckout(
      items.map((i) => ({
        productId: i.productId,
        variant: i.variant,
        quantity: i.quantity,
      }))
    );
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <h2 className="text-lg font-bold text-gray-900">
              Cart{count > 0 && <span className="text-gray-400 ml-1">({count})</span>}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-500 font-semibold mb-1">Your cart is empty</p>
              <p className="text-gray-400 text-sm">
                Browse the shop and add some items.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const key = item.variant
                  ? `${item.productId}::${item.variant}`
                  : item.productId;
                return (
                  <li
                    key={key}
                    className="flex gap-4 bg-gray-50 rounded-lg p-3"
                  >
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {item.name}
                      </h3>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.variant}
                        </p>
                      )}
                      <p className="text-sm font-black text-gray-900 mt-1">
                        ${(item.price / 100).toFixed(2)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variant
                            )
                          }
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.variant
                            )
                          }
                          disabled={item.quantity >= 10}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-30"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() =>
                            removeItem(item.productId, item.variant)
                          }
                          className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Subtotal</span>
              <span className="text-xl font-black text-gray-900">
                ${(total / 100).toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Shipping & taxes calculated at checkout.
            </p>
            <button
              onClick={handleCheckout}
              disabled={loading && checkingOut}
              className="w-full py-3 rounded-lg bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && checkingOut ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Redirecting to checkout…
                </>
              ) : (
                "Checkout"
              )}
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
