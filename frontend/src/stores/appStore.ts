import { atom } from "nanostores";
import { persistentAtom, persistentMap } from "@nanostores/persistent";
import type { User } from "../types/user";
import type { CartItem } from "../types/cart";
import { type Product } from "../types/product";

// --- AUTH STORE ---

/**
 * Stores the authenticated user's data and JWT.
 * Persists to localStorage to keep the user logged in across sessions.
 */
export const $user = persistentAtom<User | null>("user:", null, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

/**
 * Indicates if the app is currently validating the user's session (e.g., checking JWT with the backend).
 * Useful for showing loading states or preventing flash of unauthenticated content.
 */
export const $isAuthLoading = atom<boolean>(true);


// --- CART STORE ---

/**
 * Stores the user's shopping cart items.
 * Keys are generated IDs (e.g., product props) or simple product IDs.
 * Values are CartItem objects.
 * Persists to localStorage.
 */
export const $cart = persistentMap<Record<string, CartItem>>("cart:", {}, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

/**
 * Helper to add an item to the cart.
 * If the item already exists, it increments the quantity.
 */
export function addToCart(product: Product, quantity: number = 1) {
    const existingCart = $cart.get();
    const itemId = product.documentId || product.id.toString(); // Fallback to id if documentId is missing

    if (existingCart[itemId]) {
        $cart.setKey(itemId, {
            ...existingCart[itemId],
            quantity: existingCart[itemId].quantity + quantity,
        });
    } else {
        $cart.setKey(itemId, {
            id: Number(product.id), // Or generate a unique ID
            product,
            quantity,
        });
    }
}

export function removeFromCart(itemId: string) {
    $cart.setKey(itemId, undefined);
}

/**
 * Helper to update the quantity of an item in the cart.
 */
export function updateQuantity(itemId: string, quantity: number) {
    const existingCart = $cart.get();
    if (existingCart[itemId]) {
        $cart.setKey(itemId, {
            ...existingCart[itemId],
            quantity: Math.max(1, quantity), // Ensure minimum quantity is 1
        });
    }
}

/**
 * Helper to clear the cart.
 */
export function clearCart() {
    $cart.set({});
}

// --- COMPUTED HELPERS (Optional but useful) ---

/**
 * Get total items count in cart
 */
export function getCartTotalItems(): number {
    const cart = $cart.get();
    return Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
}
