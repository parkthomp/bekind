import type * as Party from "partykit/server";
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

function send(connection: Party.Connection, message: Record<string, unknown>) {
  connection.send(JSON.stringify(message));
}

function broadcastHostStatus(room: Party.Room, online: boolean) {
  room.broadcast(JSON.stringify({ type: "host-status", online }));
}

function getConnectionRole(connection: Party.Connection): ConnectionRole {
  const state = connection.state as ConnectionState | null;
  return state?.role === "host" ? "host" : "guest";
}

export default class Server implements Party.Server {
  private latestState: GameState | null = null;
  private hostOnline = false;

  constructor(readonly room: Party.Room) {}

  getConnectionTags(
    connection: Party.Connection,
    ctx: Party.ConnectionContext
  ): string[] {
    const role = this.getRoleFromRequest(ctx);
    connection.setState({ role });
    return [role];
  }

  async onConnect(connection: Party.Connection) {
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

  async onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
    if (typeof message !== "string") {
      return;
    }

    const parsed = parseClientMessage(message);
    if (!parsed) {
      send(sender, { type: "error", message: "Invalid message format" });
      return;
    }

    const role = getConnectionRole(sender);

    switch (parsed.type) {
      case "register-host": {
        if (role !== "host") {
          send(sender, { type: "error", message: "Only hosts can register" });
          return;
        }

        const tokenHash = await hashToken(parsed.hostToken);
        const storedHash = await this.room.storage.get<string>(
          HOST_TOKEN_HASH_KEY
        );

        if (!storedHash) {
          await this.room.storage.put(HOST_TOKEN_HASH_KEY, tokenHash);
        } else if (storedHash !== tokenHash) {
          send(sender, { type: "error", message: "Invalid host token" });
          return;
        }

        this.hostOnline = true;
        broadcastHostStatus(this.room, true);
        send(sender, { type: "register-host-ok" });

        if (this.latestState) {
          send(sender, { type: "state", state: this.latestState });
        }

        return;
      }

      case "state-update": {
        if (role !== "host") {
          send(sender, { type: "error", message: "Guests cannot update state" });
          return;
        }

        const tokenHash = await hashToken(parsed.hostToken);
        const storedHash = await this.room.storage.get<string>(
          HOST_TOKEN_HASH_KEY
        );

        if (!storedHash || storedHash !== tokenHash) {
          send(sender, { type: "error", message: "Invalid host token" });
          return;
        }

        this.latestState = parsed.state;
        this.hostOnline = true;
        this.room.broadcast(
          JSON.stringify({ type: "state", state: parsed.state }),
          [sender.id]
        );
        return;
      }

      case "state-request": {
        if (role !== "guest") {
          send(sender, {
            type: "error",
            message: "Only guests can request state",
          });
          return;
        }

        if (this.latestState) {
          send(sender, { type: "state", state: this.latestState });
        } else if (this.hostOnline) {
          this.requestStateFromHost();
        }

        return;
      }
    }
  }

  async onClose(connection: Party.Connection) {
    if (getConnectionRole(connection) !== "host") {
      return;
    }

    const hostStillConnected = [...this.room.getConnections("host")].length > 0;
    if (!hostStillConnected) {
      this.hostOnline = false;
      this.latestState = null;
      broadcastHostStatus(this.room, false);
    }
  }

  private getRoleFromRequest(ctx: Party.ConnectionContext): ConnectionRole {
    const role = new URL(ctx.request.url).searchParams.get("role") ?? "guest";
    return role === "host" ? "host" : "guest";
  }

  private requestStateFromHost() {
    for (const host of this.room.getConnections("host")) {
      send(host, { type: "state-request" });
    }
  }
}
