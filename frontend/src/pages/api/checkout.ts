import type { APIRoute } from 'astro';

interface CheckoutItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface AddressData {
  alias?: string;
  street: string;
  city: string;
  state: string;
  countryState?: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface CheckoutBody {
  jwt: string;
  items: CheckoutItem[];
  address: AddressData;
  notes?: string;
  subtotal: number;
  shippingCost: number;
  total: number;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as CheckoutBody;
    const { jwt, items, address, notes, subtotal, shippingCost, total } = body;

    // Validate JWT
    if (!jwt) {
      return new Response(
        JSON.stringify({ error: 'No autenticado' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate items
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'El carrito está vacío' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate address
    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      return new Response(
        JSON.stringify({ error: 'La dirección de envío es incompleta' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const strapiUrl = import.meta.env.STRAPI_URL || 'http://localhost:1337';

    // Get user documentId from JWT
    const userResponse = await fetch(`${strapiUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!userResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Sesión expirada o inválida' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userData = await userResponse.json();
    const userDocumentId = userData.documentId;

    if (!userDocumentId) {
      return new Response(
        JSON.stringify({ error: 'No se pudo identificar al usuario' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create order
    const orderData = {
      data: {
        orderStatus: 'procesando',
        subtotal,
        shippingCost,
        total,
        notes: notes || '',
        placedAt: new Date().toISOString(),
        users_permissions_user: userDocumentId,
        Orders: items.map(item => ({
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
          product: item.productId,
        })),
        Address: [address],
      },
    };

    const orderResponse = await fetch(`${strapiUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('Error creating order:', errorData);
      return new Response(
        JSON.stringify({ error: 'Error al crear el pedido. Por favor, inténtalo de nuevo.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const orderResult = await orderResponse.json();
    const orderId = orderResult.data?.id || orderResult.data?.documentId;

    // Delete cart items from Strapi
    try {
      // Get all cart items for this user
      const cartItemsResponse = await fetch(
        `${strapiUrl}/api/cart-items?filters[users_permissions_user][documentId][$eq]=${userDocumentId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (cartItemsResponse.ok) {
        const cartItemsData = await cartItemsResponse.json();
        const cartItems = cartItemsData.data || [];

        // Delete each cart item
        await Promise.all(
          cartItems.map(async (cartItem: any) => {
            const cartItemId = cartItem.documentId;
            await fetch(`${strapiUrl}/api/cart-items/${cartItemId}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            });
          })
        );
      }
    } catch (deleteError) {
      console.error('Error deleting cart items:', deleteError);
      // Don't fail the checkout if cart deletion fails
    }

    return new Response(
      JSON.stringify({ success: true, orderId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
