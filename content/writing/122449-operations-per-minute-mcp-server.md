---
title: "122,449 Operations Per Minute: Benchmarking a Production MCP Server"
excerpt: "How a minimal n8n Railway deployment and a custom MCP server hit 122x the market leader's throughput, with 0% error rate at 1.16ms average latency."
date: "2025-11-14T01:34:00-06:00"
tags: ["MCP Server", "Performance", "Benchmarking"]
originalUrl: "https://www.linkedin.com/posts/tripl3tr3s_hace-un-par-de-d%C3%ADas-alcanc%C3%A9-un-hito-que-me-ugcPost-7395001162833387520-A22X"
originalLanguage: "es"
---

A couple of days ago I hit a milestone that has me genuinely excited: my system beat its own target by more than 1,000%. Here is the context.

## The n8n access problem

A few months back I put together a public repository with a minimal self-hosted n8n configuration on Railway. The goal was to democratize access to this powerful platform without the prohibitive cost of traditional setups.

The templates available in the marketplace are excellent, but they're overkill when you're just getting started. Running those instances the "recommended" way can cost 10-20x more than necessary, and enterprise licensing is unneeded at an early stage - you're not running clusters or multiple main instances to balance load across workers yet.

My solution: a repository with the leanest, cheapest configuration that still works on Railway. SQLite for persistence, minimal config, zero unnecessary complexity. Result: under $3 USD/month after two months of running it - exactly what you want when you're experimenting and validating a design.

## The actual project

In parallel, over several months, I built a specialized MCP server with:

- 20+ custom tools
- 12 preconfigured prompts
- 15+ resources and samplings
- Built to connect to a wide range of LLMs through n8n

The goal: transform operations for the 95% of Mexican SMEs (PyMEs) that run on legacy tooling or none at all.

## The moment of truth

After running 1,400+ tests (97.7% pass rate), I set a performance target: reach 10% of the throughput of the leading player in the Mexican market, who processes roughly 1,000 units/minute. So the bar was at least 100 units per minute.

The load, stress, and latency test results:

- **122,449 units per minute**
- **1,224x** faster than my initial target
- **122x** faster than the current market leader
- **0%** error rate
- **1.16ms** average latency

The sharper readers will already have guessed the sector from these benchmarks. For now, I can't overstate how satisfying it is to watch an idea turn into a system that is robust, scalable, and able to deliver value from day one.

What's next: keep building, keep validating against the real market, and keep sharing the process.

---

*Originally published in Spanish on [LinkedIn](https://www.linkedin.com/posts/tripl3tr3s_hace-un-par-de-d%C3%ADas-alcanc%C3%A9-un-hito-que-me-ugcPost-7395001162833387520-A22X). This is an English adaptation of that post.*
