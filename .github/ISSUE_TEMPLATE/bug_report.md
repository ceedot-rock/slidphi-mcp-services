---
name: Bug report
about: Something broken in slidphi-services (wrong data, crashed tool, startup failure)
title: "[bug] "
labels: bug
---

## What happened

<!-- What you did, what the tool did, and how they differed. -->

## Tool involved

<!-- One of: x402_service_info, x402_prices, x402_payment_terms, lab_service_health -->

- Tool:
- Arguments used:

## Environment

- OS:
- Node version (`node --version`):
- slidphi-services version (`node -p "require('./package.json').version"` or tag):

## Reproduction

<!-- Steps to reproduce, or the exact stdio request/response if available. -->

## Notes

<!-- For lab_service_health: one miss is a blip until rechecked — did it
reproduce? If it started fine, is https://rider-x402.fly.dev/health itself
reachable from your machine? This server fails fast at startup when the
x402 API is unreachable. -->
