## What changed

<!-- One or two sentences, plus which tools or files are affected. -->

## Why

<!-- The problem or reason, and why this change fixes it. -->

## Checks

- [ ] `node --check server.js` passes
- [ ] `npm ci --omit=dev` works from a clean checkout
- [ ] Version metadata in sync: `package.json` `version` matches the `VERSION` constant in `server.js` (bump both together)
- [ ] No credentials, keys, or secrets added (this server stays secret-free by design)
- [ ] Tool descriptions still match what the tool actually does (README too, if changed)

## Test notes

<!-- How you verified: e.g. piped a ListTools request over stdio, or why a
change needs no live run. Note the server needs https://rider-x402.fly.dev
reachable at startup. -->
