# ConnectHub

ConnectHub is a small social feed web app built with React, Vite, and shadcn/ui. It provides authentication, a social feed, posts (likes/saved), follows, notifications, real-time messaging, and profile management. This repository contains the client-side implementation and integration points for an API and WebSocket server.

**Status:** Development

**Tech stack:** React, Vite, JavaScript, shadcn/ui, Zustand (or Redux-like store), WebSockets (sockets/socket.js)

**Key folders:**

- **src/app/**: app bootstrap and routing
- **src/layouts/**: application layouts (`AuthLayout`, `MainLayout`)
- **src/features/**: feature modules (auth, feed, follows, notifications, posts, profile)
- **src/services/**: API client and endpoint definitions
- **src/sockets/**: WebSocket client (`socket.js`)
- **src/state/**: global state store and slices

## Features

- Email/password sign up & login flows
- Feed with posts, likes, and saved posts
- Follow/unfollow other users
- Notifications and messages views
- Profile pages with tabs
- Real-time updates via WebSockets

## Project structure (high level)

- `src/features/auth/` — auth components, hooks, and services
- `src/features/feed/` — feed components and hooks
- `src/features/posts/` — create, list, like, and save posts
- `src/features/notifications/` — notifications and messages UI
- `src/features/profile/` — profile UI and tabs
- `src/services/apiClient.js` — configured Axios/fetch client
- `src/services/endpoints.js` — central API endpoint constants
- `src/sockets/socket.js` — WebSocket connection helper

## Getting started (local)

1. Install dependencies

```bash
npm install
```

2. Start the dev server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview production build

```bash
npm run preview
```

Other useful scripts (if available):

```bash
npm run format    # run project formatter
```

## Environment variables

Create a `.env` file at the project root (copy from `.env.example` if present) and provide values used by `src/services/apiClient.js` and socket initialization. Common variables:

- `VITE_API_BASE_URL` — base URL for the REST API
- `VITE_WS_URL` — WebSocket server URL for real-time updates

The client expects authentication tokens (JWT) to be returned by the API and stored/used by the auth service/hooks.

## API & Sockets

- API endpoints are centralized in [src/services/endpoints.js](src/services/endpoints.js)
- The HTTP client is in [src/services/apiClient.js](src/services/apiClient.js)
- WebSocket helper lives in [src/sockets/socket.js](src/sockets/socket.js) and is used by notification and feed features to receive live updates.

When integrating with a backend, ensure the API follows the routes expected in `endpoints.js` (auth, posts, follows, notifications, profile).

## Development notes

- Components follow the shadcn/ui patterns and live under `src/layout` and `src/components/ui`.
- Feature code is grouped under `src/features/<feature>` to keep concerns isolated.
- Use the provided hooks (e.g., `useAuth.js`, `usePosts.js`, `useFeed.js`) to interact with services and state.

## Contributing

- Fork the repo and create feature branches.
- Follow existing code style and run `npm run format` before submitting PRs.
- Add tests for new behavior where appropriate.

## Troubleshooting

- If API requests fail, verify `VITE_API_BASE_URL` and CORS settings on the backend.
- For socket issues, confirm `VITE_WS_URL` and that the backend accepts socket connections from your origin.
