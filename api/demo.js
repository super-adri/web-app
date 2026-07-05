import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const esc = (s) =>
  String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  if (body.website) {
    return res.status(200).json({ ok: true });
  }

  const nombre = String(body.nombre || '').trim();
  const clinica = String(body.clinica || '').trim();
  const email = String(body.email || '').trim();
  const telefono = String(body.telefono || '').trim();
  const mensaje = String(body.mensaje || '').trim();

  if (!nombre || !clinica || !/.+@.+\..+/.test(email)) {
    return res.status(400).json({ error: 'Faltan datos obligatorios o el email no es válido.' });
  }
  if (nombre.length > 120 || clinica.length > 160 || email.length > 160 ||
      telefono.length > 40 || mensaje.length > 4000) {
    return res.status(400).json({ error: 'Algún campo es demasiado largo.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('[api/demo] RESEND_API_KEY no configurada');
    return res.status(500).json({ error: 'El envío de correo no está configurado todavía.' });
  }

  const to = process.env.LEAD_TO_EMAIL || 'oscar.lcg93@gmail.com';
  const from = process.env.LEAD_FROM_EMAIL || 'SuperAdri <onboarding@resend.dev>';

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Nueva solicitud de demo · ${clinica}`,
      html: `
        <h2>Nueva solicitud de demo — SuperAdri</h2>
        <p><b>Nombre:</b> ${esc(nombre)}</p>
        <p><b>Clínica:</b> ${esc(clinica)}</p>
        <p><b>Email:</b> ${esc(email)}</p>
        <p><b>Teléfono / WhatsApp:</b> ${esc(telefono) || '—'}</p>
        <p><b>Mensaje:</b><br>${esc(mensaje).replace(/\n/g, '<br>') || '—'}</p>
        <hr>
        <p style="color:#888;font-size:12px">Enviado desde el formulario de super-adri.com</p>
      `,
    });

    if (error) {
      console.error('[api/demo] Resend error', error);
      return res.status(502).json({ error: 'No se pudo enviar la solicitud. Inténtalo más tarde.' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/demo] excepción', err);
    return res.status(502).json({ error: 'No se pudo enviar la solicitud. Inténtalo más tarde.' });
  }
}
