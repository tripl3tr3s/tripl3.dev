---
title: "80% of Requests Never Hit the Expensive Model"
excerpt: "How 3-tier routing cuts cost without degrading quality: a Haiku classifier (~100ms, 60 tokens) -> domain specialists -> Sonnet for full orchestration. Routing as architecture, not afterthought."
date: "2026-05-07T20:45:00-06:00"
tags: ["LLM Orchestration", "Cost Optimization", "MCP"]
originalUrl: "https://www.linkedin.com/posts/tripl3tr3s_mcp-aiengineering-buildinpublic-ugcPost-7457998591287054336-JkT-"
originalLanguage: "en"
---

I built an AI-native Mexican Fiscal Compliance-as-a-Service platform where 80% of requests never touch the expensive model, without degrading quality. How?

Every message in DISAI_Conta's chat interface passes through a three-tier router before hitting any fiscal logic.

## Tier 1: classify

Haiku runs a classification pass: domain, query type, confidence score. Max 60 tokens. ~100ms. That's it. Ten fiscal domains: facturacion, nomina, carta porte, pagos, compliance, and more. One fast model call. Done.

## Tier 2: the domain expert

A domain expert takes over. But not a generic prompt - a scoped module with its own allowed MCP tools, preloaded resources, and a system prompt tuned for that specific domain. Ten experts. Each one knows its lane.

## Tier 3: full orchestration

Only action-type queries spin up the full agent: Sonnet doing real tool orchestration against the SAT-MCP server. Informational queries get answered at Tier 2 and never go further.

The result: a platform that costs a fraction of "Sonnet-for-everything," without degrading the experience on the queries that actually matter.

## The tradeoffs, explicit and deliberate

- +100ms on action paths from the Tier 1 hop. Accepted.
- Added complexity from maintaining 10 expert modules. Accepted - even that is easier to maintain than a ~2k-line single orchestrator.

Because the alternative is paying Sonnet-level costs for someone asking "Cuales son las formas de pago aceptadas por el SAT?" and burning reasoning tokens on a query that has a known, scoped answer.

Most teams building AI products default to one model for everything. It's simpler. But it's also expensive and lazy.

So if your queries have structure (and fiscal/accounting queries absolutely do), you can route by intent, then by domain expertise, before you burn tokens on reasoning.

Prompts are architecture decisions. Routing is product design. Expertise is a layer, not an afterthought.

---

*Originally published on [LinkedIn](https://www.linkedin.com/posts/tripl3tr3s_mcp-aiengineering-buildinpublic-ugcPost-7457998591287054336-JkT-).*
