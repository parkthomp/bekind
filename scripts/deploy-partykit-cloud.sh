#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

: "${CLOUDFLARE_ACCOUNT_ID:?Set CLOUDFLARE_ACCOUNT_ID in .env.local}"
: "${CLOUDFLARE_API_TOKEN:?Set CLOUDFLARE_API_TOKEN in .env.local}"
: "${PARTYKIT_DOMAIN:?Set PARTYKIT_DOMAIN in .env.local (e.g. bekind-party.yourname.workers.dev)}"

echo "Deploying PartyKit to https://${PARTYKIT_DOMAIN} ..."

CLOUDFLARE_ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID" \
CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" \
npx partykit deploy --domain "$PARTYKIT_DOMAIN"

echo ""
echo "Set this in Vercel:"
echo "NEXT_PUBLIC_PARTYKIT_HOST=${PARTYKIT_DOMAIN}"
