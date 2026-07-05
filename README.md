# SuperAdri — web

Landing pública de **SuperAdri**: el asistente interno que responde al equipo de
una clínica dental por WhatsApp, con los protocolos, proveedores y rutinas de la
clínica. El conocimiento deja de vivir solo en la cabeza de los veteranos.

> En fase de estudio de mercado. La empresa aún no está constituida, pero SuperAdri
> ya es un MVP funcional en una clínica piloto.

## Estructura

- `index.html` — landing estática autocontenida (tema claro/oscuro, sin build).
- `privacidad/` — política de privacidad.
- `api/demo.js` — función serverless: recibe el formulario de demo, valida en
  servidor, descarta bots (honeypot) y envía un email vía [Resend](https://resend.com).
- `vercel.json`, `package.json` — configuración de despliegue.

## Despliegue (Vercel)

Auto-detectable (estático + `api/`), sin framework ni build. Variables de entorno:

| Variable | Descripción |
|---|---|
| `RESEND_API_KEY` | API key de Resend (obligatoria) |
| `LEAD_TO_EMAIL` | Email donde llegan las solicitudes de demo |
| `LEAD_FROM_EMAIL` | Remitente verificado, p. ej. `SuperAdri <demos@super-adri.com>` |

Prueba local: `npx vercel dev` (sirve el estático y la función juntos).

## Roadmap

Cuando se añada el acceso por clínica, se migrará a **Next.js**: estas páginas pasan
a ser las rutas de marketing y se suman login, panel privado por clínica y pagos.
