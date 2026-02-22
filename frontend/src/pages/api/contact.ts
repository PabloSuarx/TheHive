import type { APIRoute } from 'astro';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as ContactFormData;

    const { name, email, phone, subject, message } = body;

    if (!name || name.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: 'El nombre es requerido y debe tener al menos 2 caracteres' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!email || !email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
      return new Response(
        JSON.stringify({ error: 'Email requerido y debe ser válido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!subject || subject.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'El asunto es requerido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!message || message.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'El mensaje es requerido y debe tener al menos 10 caracteres' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const strapiUrl = import.meta.env.STRAPI_URL || 'http://localhost:1337';

    const strapiResponse = await fetch(`${strapiUrl}/api/contact-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone?.trim() || null,
          subject: subject.trim(),
          message: message.trim(),
        },
      }),
    });

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json();
      console.error('Error de Strapi:', errorData);
      return new Response(
        JSON.stringify({ error: 'Error al enviar el mensaje. Por favor, intenta de nuevo.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await strapiResponse.json();

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error procesando el formulario de contacto:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
