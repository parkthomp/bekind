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

Managed `*.partykit.dev` hosting is currently unavailable (Cloudflare custom domain limit on the shared zone). Deploy to **your own Cloudflare account** instead.

### 1. Cloudflare setup

1. Create a free [Cloudflare account](https://dash.cloudflare.com/sign-up)
2. Go to **Workers & Pages** and note your **workers.dev subdomain** (e.g. `parkthomp.workers.dev`)
3. Create an API token at [API Tokens](https://dash.cloudflare.com/profile/api-tokens) using the **Edit Cloudflare Workers** template
4. Copy your **Account ID** from the Cloudflare dashboard overview

### 2. Configure environment

Add these to `.env.local`:

```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
PARTYKIT_DOMAIN=bekind-party.yourname.workers.dev
```

### 3. Deploy PartyKit (cloud-prem)

```bash
./scripts/deploy-partykit-cloud.sh
```

Or manually:

```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id \
CLOUDFLARE_API_TOKEN=your_api_token \
npx partykit deploy --domain bekind-party.yourname.workers.dev
```

### 4. Configure Next.js (Vercel)

Set this environment variable in Vercel:

```bash
NEXT_PUBLIC_PARTYKIT_HOST=bekind-party.yourname.workers.dev
```

PartyKit stores only the hashed host token per room. Game scores are not persisted on the server.

### Cursor + Cloudflare MCP

This repo includes `.cursor/mcp.json` with Cloudflare MCP servers for deploying and managing Workers from Cursor. Restart Cursor after pulling, then authenticate when prompted on first use.

Official setup guide: https://developers.cloudflare.com/agent-setup/prompt.md
