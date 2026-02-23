/**
 * cartService.ts
 *
 * Hybrid cart: guest uses localStorage, authenticated users use Strapi CartItem collection.
 * Targets Strapi v5 — all relations use documentId (string), responses are flat (no .attributes).
 *
 * Exports:
 *   cartStore, initCartService, syncCartAfterLogin, clearCartOnLogout,
 *   addToCart, removeFromCart, updateQuantity, createOrder
 */

import { persistentMap } from "@nanostores/persistent";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape stored inside the Nano Store (all values serialised as strings). */
export interface CartStoreMap {
    items: string;  // JSON CartItem[]
    count: string;  // JSON number
    total: string;  // JSON number
    [key: string]: string | undefined;
}

/**
 * A single cart item as kept in the store / localStorage.
 * In Strapi v5 both strapiId and productId are documentId strings.
 */
export interface CartItem {
    /** Strapi CartItem documentId (undefined for guest items). */
    strapiId?: string;
    /** Strapi Product documentId. */
    productId: string;
    name: string;
    image: string;
    unitPrice: number;
    quantity: number;
    slug?: string;
}

export interface OrderAddress {
    alias?: string;
    street: string;
    city: string;
    state?: string;
    countryState?: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const cartStore = persistentMap<CartStoreMap>("cart-store:", {
    items: "[]",
    count: "0",
    total: "0",
});

// ─── Internal helpers ─────────────────────────────────────────────────────────

const STRAPI_URL = (): string => import.meta.env.PUBLIC_STRAPI_URL as string;

function authHeaders(jwt: string): Record<string, string> {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
    };
}

function getJwt(): string | null {
    try { return localStorage.getItem("jwt"); } catch { return null; }
}

/** Returns the user's documentId (string), required for Strapi v5 relation fields. */
function getUserDocumentId(): string | null {
    try { return localStorage.getItem("userDocumentId"); } catch { return null; }
}

/** Read the current items array from the store. */
function readItems(): CartItem[] {
    try { return JSON.parse(cartStore.get().items) as CartItem[]; }
    catch { return []; }
}

/** Write a new items array to the store, recomputing count and total. */
function commit(items: CartItem[]): void {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const total = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    cartStore.set({
        items: JSON.stringify(items),
        count: String(count),
        total: total.toFixed(2),
    });
}

/**
 * Map a flat Strapi v5 CartItem (from /api/users/me) to our CartItem shape.
 * Strapi v5 response: { id, documentId, quantity, unitPrice, product: { id, documentId, name, ... } }
 */
function mapStrapiEntry(entry: any): CartItem | null {
    if (!entry?.documentId) return null;  // solo descartar si no hay entry

    const product = entry?.product;
    const imageUrl =
        product?.mainImage?.formats?.small?.url ??
        product?.mainImage?.url ??
        "";

    return {
        strapiId: entry.documentId as string,
        productId: product?.documentId ?? "",
        name: product?.name ?? product?.title ?? "Producto",
        image: imageUrl,
        unitPrice: entry.unitPrice ?? 0,
        quantity: entry.quantity ?? 1,
        slug: product?.slug ?? "",
    };
}

// ─── Public – read helpers ────────────────────────────────────────────────────

export function getCartItems(): CartItem[] { return readItems(); }
export function getCartCount(): number { return parseInt(cartStore.get().count, 10) || 0; }
export function getCartTotal(): number { return parseFloat(cartStore.get().total) || 0; }

// ─── Guest helpers ────────────────────────────────────────────────────────────
// Guest cart lives in the Nano Store (cart-store:items via persistentMap).
// There is no separate 'cart' localStorage key — readItems() / commit() cover both cases.

// ─── initCartService ─────────────────────────────────────────────────────────

/**
 * Call once on app boot.
 * - Authenticated: fetch CartItems from Strapi via /api/users/me.
 * - Guest: read from localStorage and populate the store.
 */
export async function initCartService(): Promise<void> {
    const jwt = getJwt();

    if (jwt) {
        await _loadFromStrapi(jwt);
    } else {
        // Guest: the persistentMap already hydrated from cart-store:* keys, nothing to do
        // (commit a no-op read to make sure count/total are in sync)
        commit(readItems());
    }
}

/**
 * Fetch CartItems for the authenticated user via /api/users/me.
 * Avoids Strapi permission issues with collection filters.
 * Strapi v5 returns flat objects — no data/attributes wrapper.
 */
async function _loadFromStrapi(jwt: string): Promise<void> {
    try {
        const res = await fetch(
            `${STRAPI_URL()}/api/cart-items?populate[product][populate]=mainImage`,
            { headers: { Authorization: `Bearer ${jwt}` } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // data.data is a flat array in Strapi v5 collection endpoints
        const items: CartItem[] = (data.data ?? [])
            .map(mapStrapiEntry)
            .filter(Boolean) as CartItem[];
        commit(items);
    } catch (err) {
        console.error("[cartService] _loadFromStrapi error:", err);
    }
}

// ─── addToCart ────────────────────────────────────────────────────────────────

/**
 * Add (or increment) a product in the cart.
 * - Auth: POST /api/cart-items using documentId strings for relations.
 * - Guest: update localStorage.
 */
export async function addToCart(
    item: Omit<CartItem, "strapiId" | "quantity"> & { quantity?: number }
): Promise<void> {
    const qty = item.quantity ?? 1;
    const jwt = getJwt();
    const userDocumentId = getUserDocumentId();

    if (jwt && userDocumentId) {
        // Check if a CartItem for this product already exists
        const existing = readItems().find((i) => i.productId === item.productId);

        if (existing?.strapiId) {
            // Increment quantity on the existing Strapi entry
            await updateQuantity(item.productId, existing.quantity + qty);
            return;
        }

        // Create a new CartItem in Strapi
        try {
            const res = await fetch(`${STRAPI_URL()}/api/cart-items`, {
                method: "POST",
                headers: authHeaders(jwt),
                body: JSON.stringify({
                    data: {
                        quantity: qty,
                        unitPrice: item.unitPrice,
                        product: item.productId,               // documentId string
                        users_permissions_user: userDocumentId, // documentId string
                    },
                }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            // Reload from Strapi so strapiId (documentId) is set correctly
            await _loadFromStrapi(jwt);
        } catch (err) {
            console.error("[cartService] addToCart error:", err);
        }
    } else {
        // Guest — store is the source of truth
        const items = readItems();
        const existing = items.find((i) => i.productId === item.productId);
        if (existing) {
            existing.quantity += qty;
        } else {
            items.push({ ...item, quantity: qty });
        }
        commit(items);
    }
}

// ─── removeFromCart ───────────────────────────────────────────────────────────

/**
 * Remove a product entirely from the cart.
 * - Auth: DELETE /api/cart-items/:documentId.
 * - Guest: update localStorage.
 */
export async function removeFromCart(productId: string): Promise<void> {
    const jwt = getJwt();

    if (jwt) {
        const item = readItems().find((i) => i.productId === productId);
        if (item?.strapiId) {
            try {
                await fetch(`${STRAPI_URL()}/api/cart-items/${item.strapiId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${jwt}` },
                });
            } catch (err) {
                console.error("[cartService] removeFromCart error:", err);
            }
        }
        // Optimistically update store
        commit(readItems().filter((i) => i.productId !== productId));
    } else {
        commit(readItems().filter((i) => i.productId !== productId));
    }
}

// ─── updateQuantity ───────────────────────────────────────────────────────────

/**
 * Update the quantity of an existing cart item.
 * Pass quantity ≤ 0 to remove it entirely.
 * - Auth: PUT /api/cart-items/:documentId.
 * - Guest: update localStorage.
 */
export async function updateQuantity(productId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
        await removeFromCart(productId);
        return;
    }

    const jwt = getJwt();

    if (jwt) {
        const item = readItems().find((i) => i.productId === productId);
        if (!item?.strapiId) return;

        try {
            await fetch(`${STRAPI_URL()}/api/cart-items/${item.strapiId}`, {
                method: "PUT",
                headers: authHeaders(jwt),
                body: JSON.stringify({ data: { quantity } }),
            });
            // Optimistically update store
            commit(
                readItems().map((i) =>
                    i.productId === productId ? { ...i, quantity } : i
                )
            );
        } catch (err) {
            console.error("[cartService] updateQuantity error:", err);
        }
    } else {
        commit(
            readItems().map((i) =>
                i.productId === productId ? { ...i, quantity } : i
            )
        );
    }
}

// ─── syncCartAfterLogin ───────────────────────────────────────────────────────

/**
 * Call immediately after a successful login.
 * Migrates guest localStorage items to Strapi CartItems, then loads the
 * full cart from Strapi into the store.
 *
 * @param jwt            JWT token from login response
 * @param userDocumentId User documentId (string) from login response — store in localStorage('userDocumentId')
 */
export async function syncCartAfterLogin(jwt: string, userDocumentId: string): Promise<void> {
    // Read guest items from the Nano Store BEFORE it gets cleared by _loadFromStrapi.
    // The store (cart-store:items) is the source of truth for guest carts.
    console.log("[sync] INICIO - jwt recibido:", jwt?.slice(0, 20));
    console.log("[sync] raw localStorage cart-store:items:", localStorage.getItem("cart-store:items"));
    const raw = localStorage.getItem("cart-store:items");
    const guestItems: CartItem[] = raw ? JSON.parse(raw) : [];

    console.log("[sync] guestItems.length:", guestItems.length);
    console.log("[sync] guestItems:", JSON.stringify(guestItems));

    if (guestItems.length > 0) {
        // Push each guest item as a new CartItem in Strapi
        console.log("[sync] enviando", guestItems.length, "items a Strapi");
        for (const item of guestItems) {
            try {
                console.log("[sync] POST cart-item para producto:", item.productId);
                const res = await fetch(`${STRAPI_URL()}/api/cart-items`, {
                    method: "POST",
                    headers: authHeaders(jwt),
                    body: JSON.stringify({
                        data: {
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            product: item.productId,                // documentId string
                            users_permissions_user: userDocumentId, // documentId string
                        },
                    }),
                });
                console.log("[sync] respuesta Strapi:", res.status);
            } catch (err) {
                console.error("[cartService] syncCartAfterLogin — push item error:", err);
            }
        }
    }

    // Reload the definitive cart from Strapi (overwrites the store)
    await _loadFromStrapi(jwt);
    console.log("[sync] FIN");
}

// ─── clearCartOnLogout ────────────────────────────────────────────────────────

/**
 * Clears the local store and guest localStorage.
 * Does NOT call any Strapi endpoint — CartItems remain saved for the next session.
 */
export function clearCartOnLogout(): void {
    commit([]);
    try { localStorage.removeItem("cart-store:items"); } catch { /* ignore */ }
    try { localStorage.removeItem("cart-store:count"); } catch { /* ignore */ }
    try { localStorage.removeItem("cart-store:total"); } catch { /* ignore */ }
}

// ─── createOrder ─────────────────────────────────────────────────────────────

/**
 * Submit the cart as a confirmed Order in Strapi.
 * On success, deletes all CartItems from Strapi and clears the store.
 *
 * @param jwt            JWT token
 * @param userDocumentId User documentId (string) — used as relation value in Strapi v5
 */
export async function createOrder(
    jwt: string,
    userDocumentId: string,
    address: OrderAddress,
    shippingCost = 0
): Promise<{ success: boolean; orderId?: number; orderNumber?: string; error?: string }> {
    const items = readItems();
    if (items.length === 0) {
        return { success: false, error: "El carrito está vacío" };
    }

    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const total = subtotal + shippingCost;

    const body = {
        data: {
            orderStatus: "procesando",
            subtotal: parseFloat(subtotal.toFixed(2)),
            shippingCost,
            total: parseFloat(total.toFixed(2)),
            placedAt: new Date().toISOString(),
            users_permissions_user: userDocumentId, // documentId string
            Orders: items.map((item) => ({
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: parseFloat((item.unitPrice * item.quantity).toFixed(2)),
                product: item.productId, // documentId string
            })),
            Address: [{ ...address, isDefault: address.isDefault ?? false }],
        },
    };

    try {
        const res = await fetch(`${STRAPI_URL()}/api/orders`, {
            method: "POST",
            headers: authHeaders(jwt),
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody?.error?.message ?? `HTTP ${res.status}`);
        }

        const created = await res.json();
        // Strapi v5: fields are directly on data, no .attributes
        const orderId: number = created?.data?.id;
        const orderNumber: string = created?.data?.orderNumber ?? String(orderId);

        // Delete all CartItems from Strapi in parallel (by documentId)
        const deletePromises = items
            .filter((i) => i.strapiId)
            .map((i) =>
                fetch(`${STRAPI_URL()}/api/cart-items/${i.strapiId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${jwt}` },
                }).catch((err) => console.error("[cartService] delete CartItem error:", err))
            );
        await Promise.all(deletePromises);

        // Clear the store
        commit([]);

        return { success: true, orderId, orderNumber };
    } catch (err: any) {
        console.error("[cartService] createOrder error:", err);
        return { success: false, error: err?.message ?? "Error desconocido" };
    }
}
