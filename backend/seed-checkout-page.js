#!/usr/bin/env node

/**
 * Script to seed checkout-page content in Strapi
 */

const content = {
  pageTitle: "Finalizar Pedido",
  addressSectionTitle: "Dirección de envío",
  orderSummaryTitle: "Resumen del pedido",
  shippingCost: 4.99,
  freeShippingThreshold: 50,
  freeShippingText: "Gratis",
  confirmButtonText: "Confirmar Pedido",
  successMessage: "Tu pedido ha sido confirmado con éxito. Recibirás un correo electrónico con los detalles.",
  aliasLabel: "Alias",
  streetLabel: "Calle",
  cityLabel: "Ciudad",
  stateLabel: "Provincia",
  countryStateLabel: "Comunidad Autónoma",
  zipCodeLabel: "Código Postal",
  countryLabel: "País",
  notesLabel: "Notas adicionales",
  aliasPlaceholder: "Casa, Trabajo, etc.",
  streetPlaceholder: "Calle Principal, 123",
  cityPlaceholder: "Madrid",
  statePlaceholder: "Madrid",
  countryStatePlaceholder: "Comunidad de Madrid",
  zipCodePlaceholder: "28001",
  countryPlaceholder: "España",
  notesPlaceholder: "Instrucciones de entrega, portero automático, etc.",
  addressIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-geo-alt text-primary" viewBox="0 0 16 16">
    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
  </svg>`,
  summaryIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-receipt text-primary" viewBox="0 0 16 16">
    <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z"/>
    <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/>
  </svg>`,
  confirmIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-check mr-2" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
  </svg>`,
  shippingIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
  </svg>`,
  subtotalLabel: "Subtotal",
  shippingLabel: "Envío",
  totalLabel: "Total",
  emptyCartMessage: "Tu carrito está vacío. Añade productos antes de continuar con el pago.",
  loadingText: "Procesando pedido...",
  errorMessage: "Ha ocurrido un error al procesar tu pedido. Por favor, inténtalo de nuevo o contacta con soporte.",
  seo: {
    metaTitle: "Finalizar Pedido - The Hive",
    metaDescription: "Completa tu compra en The Hive. Miel artesanal de la Sierra de Madrid con envío gratuito en pedidos superiores a 50€.",
    keywords: "checkout, pago, comprar miel, finalizar pedido, envío gratis"
  }
};

async function seed() {
  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
  const ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN || '70743f21c4406f17b7b52d9e84bc95821c80ee1dc7d4b20ccf1c88304d6f9258e3e80746dd07208391bc990af304c69f12cde0707e76409a34afe94a0eb54fe5a122aaf8031cc63660d86dee32c80c91fc4de1e2c2a6a4521d13fbc6fa961f47f912d0180b3793b942966a675c65def2c7be969f7bd0061f60d8c528e41484bf';

  try {
    console.log('Creating checkout-page content...');

    // For single types, we always use PUT
    const response = await fetch(`${STRAPI_URL}/api/checkout-page`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify({ data: content })
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Error response:', responseText);
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log('✓ checkout-page content created successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Error seeding checkout-page:', error);
    process.exit(1);
  }
}

seed();
