const PRODUCTION_PARTYKIT_HOST = "bekind-party.parkert.workers.dev";

function isLocalBrowserHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost")
  );
}

export function getPartykitHost(): string {
  if (typeof window !== "undefined" && isLocalBrowserHost(window.location.hostname)) {
    return "localhost:1999";
  }

  if (process.env.NEXT_PUBLIC_PARTYKIT_HOST) {
    return process.env.NEXT_PUBLIC_PARTYKIT_HOST;
  }

  return PRODUCTION_PARTYKIT_HOST;
}
