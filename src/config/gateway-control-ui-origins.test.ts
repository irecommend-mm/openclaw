import { describe, expect, it } from "vitest";
import { ensureControlUiAllowedOriginsForNonLoopbackBind } from "./gateway-control-ui-origins.js";

describe("ensureControlUiAllowedOriginsForNonLoopbackBind", () => {
  it("seeds origins when effectiveBind is lan but on-disk gateway.bind is unset", () => {
    const res = ensureControlUiAllowedOriginsForNonLoopbackBind(
      {
        gateway: {
          auth: { mode: "token", token: "tok" },
        },
      },
      { effectiveBind: "lan", defaultPort: 8080 },
    );
    expect(res.bind).toBe("lan");
    expect(res.seededOrigins).toEqual(["http://localhost:8080", "http://127.0.0.1:8080"]);
    expect(res.config.gateway?.controlUi?.allowedOrigins).toEqual(res.seededOrigins);
  });

  it("does not seed when effectiveBind is loopback", () => {
    const res = ensureControlUiAllowedOriginsForNonLoopbackBind(
      {
        gateway: {
          bind: "loopback",
          auth: { mode: "token", token: "tok" },
        },
      },
      { effectiveBind: "loopback", defaultPort: 8080 },
    );
    expect(res.seededOrigins).toBeNull();
  });

  it("seeds from on-disk gateway.bind=lan without effectiveBind", () => {
    const res = ensureControlUiAllowedOriginsForNonLoopbackBind({
      gateway: {
        bind: "lan",
        port: 9000,
        auth: { mode: "token", token: "tok" },
      },
    });
    expect(res.seededOrigins).toEqual(["http://localhost:9000", "http://127.0.0.1:9000"]);
  });
});
