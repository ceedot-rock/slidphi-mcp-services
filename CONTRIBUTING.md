# Contributing to slidphi-services

Thanks for helping keep this server honest.

## Ground rules

- Read-only, secret-free, forever. This server never holds credentials,
  keys, or payment instruments. Every new tool must be explainable as
  "safe for a stranger" or it does not ship.
- Paid x402 endpoints are never called *with* payment. Terms lookups
  read the server's own 402 response; the actual charge always happens
  on the caller's side.
- A single health-check miss is a blip until rechecked — don't add
  retry storms. One fast attempt per service per call.
- `package.json` `version` and the `VERSION` constant in `server.js`
  are bumped together, always. CI fails if they disagree.

## Quick checks (no build step needed)

```sh
npm ci --omit=dev
node --check server.js
```

CI runs install, the syntax check, the version/license metadata sync
checks, and a mocked startup smoke test on every pull request.

## Smoke-testing locally

The server fails fast at startup when the x402 API
(`https://rider-x402.fly.dev/health`) is unreachable. Send a
`ListTools` request over stdio to verify tool registration:

```sh
printf '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}\n' | node server.js
```

Expect the four tools (`x402_service_info`, `x402_prices`,
`x402_payment_terms`, `lab_service_health`) in the response.

## Pull requests

Use the pull request template: what changed, why, the checks, and how
you verified. If you changed a tool's behavior, update its description
in `server.js` and the tool table in `README.md`.

## Licensing

slidphi-services is licensed AGPL-3.0-or-later (see LICENSE).
By contributing you agree your contribution is distributed under that
license.
