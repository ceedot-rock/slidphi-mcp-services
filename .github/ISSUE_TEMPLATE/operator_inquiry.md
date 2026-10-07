---
name: Operator inquiry
about: Running this server yourself (Glama, Docker, Claude Desktop) — setup or deployment questions
title: "[ops] "
labels: ops
---

## What are you trying to do?

<!-- e.g. deploy on Glama, run in Claude Desktop, build the Docker image -->

## Your setup

- Host / client:
- How you installed it:

## Question

<!-- Be specific: what did you run, what did you expect, what happened instead? -->

## Checks you already did

- [ ] `npm ci --omit=dev` completed
- [ ] `node --check server.js` passes
- [ ] https://rider-x402.fly.dev/health reachable from your machine
      (this server fails fast at startup when the x402 API is unreachable)

No credentials are needed — this server is read-only and secret-free by design.
