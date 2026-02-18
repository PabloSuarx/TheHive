import type { Product } from "../types/product";

export interface CartItem {
    product: Product;
    quantity: number;
}

const CART_KEY = "thehive_cart";
const EVENT_NAME = "cart:updated";

// Helper to get cart from localStorage
const getCart = (): CartItem[] => {
    if (typeof localStorage === "undefined") return [];
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
};

// Helper to save cart to localStorage and dispatch event
const saveCart = (cart: CartItem[]) => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(EVENT_NAME));
};

export const cartStore = {
    get: (): CartItem[] => getCart(),

    add: (product: Product, quantity = 1) => {
        const cart = getCart();
        const existing = cart.find((item) => item.product.slug === product.slug);

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ product, quantity });
        }

        saveCart(cart);
    },

    remove: (slug: string) => {
        const cart = getCart();
        const newCart = cart.filter((item) => item.product.slug !== slug);
        saveCart(newCart);
    },

    updateQuantity: (slug: string, quantity: number) => {
        const cart = getCart();
        const item = cart.find((item) => item.product.slug === slug);
        if (item) {
            item.quantity = Math.max(1, quantity);
            saveCart(cart);
        }
    },

    clear: () => {
        saveCart([]);
    },

    count: (): number => {
        const cart = getCart();
        return cart.reduce((acc, item) => acc + item.quantity, 0);
    },

    total: (): number => {
        const cart = getCart();
        return cart.reduce(
            (acc, item) => acc + item.quantity * item.product.price,
            0
        );
    },

    subscribe: (callback: (cart: CartItem[]) => void) => {
        if (typeof window === "undefined") return () => { };

        const handler = () => callback(getCart());
        window.addEventListener(EVENT_NAME, handler);
        // Initial call
        callback(getCart());

        return () => window.removeEventListener(EVENT_NAME, handler);
    },
};
