#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN in .env.local}"

PARTYKIT_DOMAIN="${PARTYKIT_DOMAIN:-bekind-party.parkert.workers.dev}"

echo "Deploying PartyServer to https://${PARTYKIT_DOMAIN} via Wrangler ..."

CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" \
npx wrangler deploy --name bekind-party

echo ""
echo "Set this in Vercel:"
echo "NEXT_PUBLIC_PARTYKIT_HOST=${PARTYKIT_DOMAIN}"
