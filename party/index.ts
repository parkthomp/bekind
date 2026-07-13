import { Server, routePartykitRequest } from "partyserver";
import type { Connection, ConnectionContext } from "partyserver";
import type { GameState } from "../app/lib/types";
import { parseClientMessage } from "../app/lib/protocol";

const HOST_TOKEN_HASH_KEY = "hostTokenHash";

type ConnectionRole = "host" | "guest";

type ConnectionState = {
  role: ConnectionRole;
};

async function hashToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function send(connection: Connection, message: Record<string, unknown>) {
  connection.send(JSON.stringify(message));
}

function getConnectionRole(connection: Connection): ConnectionRole {
  const state = connection.state as ConnectionState | null;
  return state?.role === "host" ? "host" : "guest";
}

export class GameServer extends Server {
  private latestState: GameState | null = null;
  private hostOnline = false;

  getConnectionTags(_connection: Connection, ctx: ConnectionContext): string[] {
    const role = this.getRoleFromRequest(ctx);
    _connection.setState({ role });
    return [role];
  }

  async onConnect(connection: Connection) {
    const role = getConnectionRole(connection);

    if (role === "guest") {
      send(connection, { type: "host-status", online: this.hostOnline });

      if (this.latestState) {
        send(connection, { type: "state", state: this.latestState });
      } else if (this.hostOnline) {
        this.requestStateFromHost();
      }

      return;
    }

    send(connection, { type: "host-status", online: this.hostOnline });
  }

  async onMessage(connection: Connection, message: string | ArrayBuffer) {
    if (typeof message !== "string") {
      return;
    }

    const parsed = parseClientMessage(message);
    if (!parsed) {
      send(connection, { type: "error", message: "Invalid message format" });
      return;
    }

    const role = getConnectionRole(connection);

    switch (parsed.type) {
      case "register-host": {
        if (role !== "host") {
          send(connection, { type: "error", message: "Only hosts can register" });
          return;
        }

        const tokenHash = await hashToken(parsed.hostToken);
        const storedHash = await this.ctx.storage.get<string>(HOST_TOKEN_HASH_KEY);

        if (!storedHash) {
          await this.ctx.storage.put(HOST_TOKEN_HASH_KEY, tokenHash);
        } else if (storedHash !== tokenHash) {
          send(connection, { type: "error", message: "Invalid host token" });
          return;
        }

        this.hostOnline = true;
        this.broadcast(JSON.stringify({ type: "host-status", online: true }));
        send(connection, { type: "register-host-ok" });

        if (this.latestState) {
          send(connection, { type: "state", state: this.latestState });
        }

        return;
      }

      case "state-update": {
        if (role !== "host") {
          send(connection, { type: "error", message: "Guests cannot update state" });
          return;
        }

        const tokenHash = await hashToken(parsed.hostToken);
        const storedHash = await this.ctx.storage.get<string>(HOST_TOKEN_HASH_KEY);

        if (!storedHash || storedHash !== tokenHash) {
          send(connection, { type: "error", message: "Invalid host token" });
          return;
        }

        this.latestState = parsed.state;
        this.hostOnline = true;
        this.broadcast(
          JSON.stringify({ type: "state", state: parsed.state }),
          [connection.id]
        );
        return;
      }

      case "state-request": {
        if (role !== "guest") {
          send(connection, {
            type: "error",
            message: "Only guests can request state",
          });
          return;
        }

        if (this.latestState) {
          send(connection, { type: "state", state: this.latestState });
        } else if (this.hostOnline) {
          this.requestStateFromHost();
        }

        return;
      }
    }
  }

  async onClose(connection: Connection) {
    if (getConnectionRole(connection) !== "host") {
      return;
    }

    const hostStillConnected = [...this.getConnections("host")].length > 0;
    if (!hostStillConnected) {
      this.hostOnline = false;
      this.latestState = null;
      this.broadcast(JSON.stringify({ type: "host-status", online: false }));
    }
  }

  private getRoleFromRequest(ctx: ConnectionContext): ConnectionRole {
    const role = new URL(ctx.request.url).searchParams.get("role") ?? "guest";
    return role === "host" ? "host" : "guest";
  }

  private requestStateFromHost() {
    for (const host of this.getConnections("host")) {
      send(host, { type: "state-request" });
    }
  }
}

export interface Env {
  Main: DurableObjectNamespace<GameServer>;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ??
      new Response("Not Found", { status: 404 })
    );
  },
};
