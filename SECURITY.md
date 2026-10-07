# Security Policy

slidphi-services is a read-only, secret-free MCP server. It holds no
credentials, keys, or payment instruments, and its x402 tools report
payment terms without ever making a payment. A security issue here
would be a bug that breaks one of those guarantees.

## Reporting a vulnerability

Please do not open a public issue for security problems.

- Use GitHub's private vulnerability reporting on this repository
  (Security tab, "Report a vulnerability")
- Or email: corey@slidphilabs.com with the subject line
  `slidphi-mcp-services security`

Include the affected tool or file, steps or inputs to reproduce, and
what you expected versus what happened.

You can expect an acknowledgement within 3 business days. We will keep
you updated while we investigate and credit you in the changelog
unless you prefer to stay anonymous.

## In scope

- A tool that mutates, transmits, or stores anything that should stay
  read-only (a payment being made, data being written somewhere)
- A tool returning fabricated prices or payment terms instead of the
  x402 server's own responses
- Credential or secret exposure in the codebase, docs, or CI logs
- Supply-chain issues in the dependency tree (`@modelcontextprotocol/sdk`)

## Out of scope

- Operator deployments we do not run
- Outages or wrong data from the upstream services this server reports
  on (slidphilabs.com, agentrider.fly.dev, cuni-studio.fly.dev,
  rider-x402.fly.dev) — report those to their operators
- Social engineering, spam, or denial-of-service against hosted demos
