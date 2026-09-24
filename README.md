# slidphi-services

Public MCP stdio server for the Slid Phi Labs services that are **not**
covered by the hosted MCP catalog (`slid-phi-labs` on www.slidphilabs.com/mcp).

AGPL-3.0-or-later. No credentials, no secrets — every tool is safe for a stranger.

## Tools

| Tool | What it does |
|---|---|
| `x402_service_info` | About the Agent Rider x402 HTTP API: version, Base network, USDC contract, lab pay-to address, paid endpoints + prices. |
| `x402_prices` | Full per-call price table in USDC cents (ping, pcc/slidx compress+decompress+info, cuni check+seats). |
| `x402_payment_terms` | For one paid x402 call (`product` enum): returns the server's own 402 PaymentRequirements — price, pay-to address, X-PAYMENT format. Never pays. |
| `lab_service_health` | Quick live check of PCC, Rider, CuNi Studio, and the x402 API (one 10s attempt each; ok = HTTP 200). A single miss is a blip until rechecked. |

## Run

```sh
npm ci --omit=dev
node server.js        # MCP over stdio
```

Docker: `docker build -t slidphi-services .` then run it; it speaks stdio.
