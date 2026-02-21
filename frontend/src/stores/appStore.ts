import { atom } from "nanostores";
import { persistentAtom, persistentMap } from "@nanostores/persistent";
import type { User } from "../types/user";
import type { CartItem } from "../types/cart";

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
 * Indicates if the app is currently validating the user's session.
 */
export const $isAuthLoading = atom<boolean>(true);


// --- CART STORE ---
// Cart actions (addToCart, removeFromCart, updateQuantity, createOrder, etc.)
// live in src/utils/cartService.ts — import from there.

/**
 * Stores the user's shopping cart items.
 * Persists to localStorage. Subscribed to by UI components (header badge, etc.).
 */
export const $cart = persistentMap<Record<string, CartItem>>("cart:", {}, {
    encode: JSON.stringify,
    decode: JSON.parse,
});
