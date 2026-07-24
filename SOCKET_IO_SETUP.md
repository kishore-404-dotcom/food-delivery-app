# Socket.IO deployment notes

## Render backend

- Deploy the backend as a persistent **Web Service** using the existing `npm start`
  command. Do not deploy it as a static site, cron job, or serverless function.
- Render terminates TLS and supports WebSocket upgrades for Web Services. The Node
  process listens on Render's `PORT` through the shared HTTP server.
- Set `FRONTEND_URL` to the canonical HTTPS Vercel frontend URL. Other Vercel
  preview origins are rejected unless explicitly configured as the canonical URL.
- Keep the service at one instance unless a Socket.IO adapter (for example Redis)
  is configured. Room membership is in process memory.

## Frontend

The client derives the socket origin from `VITE_API_URL` by removing the trailing
`/api`. For example:

```env
VITE_API_URL=https://food-delivery-app-u4lb.onrender.com/api
```

connects Socket.IO to:

```text
https://food-delivery-app-u4lb.onrender.com
```

`VITE_SOCKET_URL` can override the derived origin when the real-time endpoint is
hosted separately.

## Security model

- The existing JWT is sent in the Socket.IO handshake, never in a room name.
- The backend verifies the JWT, loads the current database user, and derives the
  role server-side.
- Customers join only `user:<authenticatedUserId>`.
- Admins join their private user room and `admin`.
- There is no client-accessible event for joining arbitrary rooms.
- REST remains the source of initial and refreshed state; socket events only merge
  successful changes into the current UI.
