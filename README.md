# Be Kind

Card game scoring available at https://bk2yn.vercel.app

## Tech

1. Coded in Next.js
2. Hosted on Vercel
3. Host scores persist in browser localStorage
4. Real-time guest viewing via PartyKit WebSockets

## Real-time sharing

- The host page (`/`) is the only page that can edit scores.
- The host browser keeps the authoritative game state in localStorage.
- Guests open `/game/<roomId>` and receive live read-only updates while the host is online.
- If the host disconnects, guests keep the last received snapshot and wait for the host to reconnect.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Start PartyKit and Next.js in separate terminals:

```bash
npm run party
```

```bash
npm run dev
```

4. Open `http://localhost:3000` as the host, copy the guest link, and open it in another tab or device.

## Deployment

### Next.js (Vercel)

Set `NEXT_PUBLIC_PARTYKIT_HOST` to your deployed PartyKit host, for example:

```bash
NEXT_PUBLIC_PARTYKIT_HOST=bekind-party.<your-account>.partykit.dev
```

### PartyKit

Deploy the PartyKit server from this repo:

```bash
npx partykit deploy
```

PartyKit stores only the hashed host token per room. Game scores are not persisted on the server.
