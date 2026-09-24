#!/usr/bin/env node
/**
 * slidphi-services — public MCP stdio server for Slid Phi Labs services
 * that are NOT exposed through the hosted MCP catalog.
 *
 * Covers, all verified live 2026-09-24:
 *   - Agent Rider x402 HTTP API (https://rider-x402.fly.dev):
 *       service info, price table, per-call payment terms (402s)
 *   - Live health of the lab's public services:
 *       PCC (slidphilabs.com), Rider (agentrider.fly.dev),
 *       CuNi Studio (cuni-studio.fly.dev), x402 (rider-x402.fly.dev)
 *
 * Everything here is safe for a stranger: read-only, no credentials,
 * no keys, no secrets. Paid x402 endpoints are never called with payment;
 * the terms tool only reads the server's own 402 response.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const X402 = "https://rider-x402.fly.dev";
const VERSION = "1.0.0";

const PAID_PATHS = {
  ping: "/api/x402/ping/ping",
  pcc_compress: "/api/x402/pcc/compress",
  pcc_decompress: "/api/x402/pcc/decompress",
  pcc_info: "/api/x402/pcc/info",
  slidx_compress: "/api/x402/slidx/compress",
  slidx_decompress: "/api/x402/slidx/decompress",
  slidx_info: "/api/x402/slidx/info",
  cuni_check: "/api/x402/cuni/check",
  cuni_seats: "/api/x402/cuni/seats",
};

const HEALTH_TARGETS = [
  { service: "pcc", url: "https://slidphilabs.com/" },
  { service: "rider", url: "https://agentrider.fly.dev/" },
  { service: "cuni", url: "https://cuni-studio.fly.dev/bank" },
  { service: "x402", url: "https://rider-x402.fly.dev/health" },
];

async function getJson(url, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "SlidPhi-Services-MCP/1.0" },
      signal: ctrl.signal,
    });
    const text = await res.text();
    return { http: res.status, body: safeJson(text) };
  } finally {
    clearTimeout(t);
  }
}

async function probe(url, timeoutMs = 10000) {
  const t0 = Date.now();
  try {
    const { http } = await getJson(url, timeoutMs);
    return { ok: http === 200, http_code: http, ms: Date.now() - t0 };
  } catch (e) {
    return { ok: false, http_code: null, ms: Date.now() - t0, error: e.name || "fetch failed" };
  }
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text.slice(0, 2000);
  }
}

function textResult(obj) {
  return { content: [{ type: "text", text: typeof obj === "string" ? obj : JSON.stringify(obj, null, 2) }] };
}

const TOOLS = [
  {
    name: "x402_service_info",
    description:
      "About the Agent Rider x402 HTTP API: service name, x402 version, Base network, USDC contract, lab pay-to address, and the list of paid endpoints with prices. Free, no credentials.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "x402_prices",
    description:
      "Full per-call price table (USDC cents) for the x402 API: ping, pcc compress/decompress/info, slidx compress/decompress/info, cuni check/seats. Free, no credentials.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "x402_payment_terms",
    description:
      "How to pay for one paid x402 call. Asks the server for the endpoint WITHOUT payment and returns its own 402 PaymentRequirements: price, pay-to address, asset, and the X-PAYMENT header format. No payment is made and nothing is charged by this tool.",
    inputSchema: {
      type: "object",
      properties: {
        product: {
          type: "string",
          enum: Object.keys(PAID_PATHS),
          description: "Which paid x402 call to get payment terms for.",
        },
      },
      required: ["product"],
      additionalProperties: false,
    },
  },
  {
    name: "lab_service_health",
    description:
      "Quick live health check of the lab's public services: PCC (slidphilabs.com), Rider (agentrider.fly.dev), CuNi Studio (cuni-studio.fly.dev), and the x402 API. One fast attempt per service (10s timeout); ok means HTTP 200. This is a quick check, not the lab's full spaced-retry outage series — a single failure here is a blip until rechecked.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

const server = new Server({ name: "slidphi-services", version: VERSION }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "x402_service_info") {
    const { http, body } = await getJson(X402 + "/");
    if (http !== 200) throw new Error("x402 info returned HTTP " + http);
    return textResult(body);
  }

  if (name === "x402_prices") {
    const { http, body } = await getJson(X402 + "/api/x402/prices");
    if (http !== 200) throw new Error("x402 prices returned HTTP " + http);
    return textResult(body);
  }

  if (name === "x402_payment_terms") {
    const product = args?.product;
    const path = PAID_PATHS[product];
    if (!path) throw new Error("unknown product: " + product);
    // The 402 payment terms are only issued on POST; a GET 404s.
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    let res;
    try {
      res = await fetch(X402 + path, {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "SlidPhi-Services-MCP/1.0" },
        body: "{}",
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(t);
    }
    const http = res.status;
    const body = safeJson(await res.text());
    if (http === 402) return textResult({ note: "no payment made; these are the server's 402 payment requirements", terms: body });
    if (http === 200) throw new Error("unexpected: endpoint answered 200 without payment");
    throw new Error("terms lookup returned HTTP " + http);
  }

  if (name === "lab_service_health") {
    const results = [];
    for (const t of HEALTH_TARGETS) {
      const r = await probe(t.url);
      results.push({ service: t.service, url: t.url, ...r });
    }
    return textResult({ checked_at: new Date().toISOString(), services: results });
  }

  throw new Error("unknown tool: " + name);
});

async function main() {
  // Fail fast if the x402 API is unreachable.
  const { http } = await getJson(X402 + "/health");
  if (http !== 200) throw new Error("x402 health check failed at startup (HTTP " + http + ")");
  await server.connect(new StdioServerTransport());
}

main().catch((err) => {
  console.error("slidphi-services fatal:", err && err.message ? err.message : err);
  process.exit(1);
});
