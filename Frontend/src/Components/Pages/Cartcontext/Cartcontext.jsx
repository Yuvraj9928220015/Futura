import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = useCallback((product, selectedVariant) => {
        setCartItems((prev) => {
            const variantId = selectedVariant !== null ? `variant-${selectedVariant}` : "default";
            const existingIndex = prev.findIndex(
                (item) => item.productId === product._id && item.variantId === variantId
            );

            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + 1,
                };
                return updated;
            }

            const variantData =
                selectedVariant !== null && product.variants?.[selectedVariant]
                    ? product.variants[selectedVariant]
                    : null;

            const imageArr = variantData?.images || product.image || [];
            const thumbImage = imageArr.length > 1 ? imageArr[1] : imageArr[0] || null;

            return [
                ...prev,
                {
                    id: `${product._id}-${variantId}-${Date.now()}`,
                    productId: product._id,
                    variantId,
                    title: product.title,
                    variantName: variantData?.name || null,
                    image: thumbImage,
                    quantity: 1,
                    fullProduct: product,
                    selectedVariantIndex: selectedVariant,
                },
            ];
        });
        setIsCartOpen(true);
    }, []);

    const removeFromCart = useCallback((id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id, delta) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity + delta } : item
                )
                .filter((item) => item.quantity > 0)
        );
    }, []);

    const clearCart = useCallback(() => setCartItems([]), []);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isCartOpen,
                setIsCartOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
    return ctx;
};

export default CartContext;