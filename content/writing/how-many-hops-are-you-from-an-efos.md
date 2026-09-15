---
title: "How Many Hops Are You From an EFOS?"
excerpt: "Traditional 69-B monitoring only asks 'is my supplier blacklisted?' But the risk that kills a deduction lives deeper in the network. efos-risk-graph models invoicing as a directed graph, propagates SAT blacklist risk with per-hop attenuation, explains the exact chain, and flags invoicing carousels. Open-core, verified by hand. Originally published in Spanish."
date: "2026-07-17T16:27:00-06:00"
tags: ["Fiscal Tech", "Open Source", "Graph Theory"]
originalUrl: "https://www.linkedin.com/posts/tripl3tr3s_fiscaltech-sat-opensource-activity-7483648510316138496-4nXl"
originalLanguage: "es"
---

Your client bought from a supplier. That supplier bought from an EFOS. The SAT can reject the deduction anyway, and by the time you find out, you're already in the problem.

Traditional 69-B blacklist monitoring only answers one question: "is my supplier on the list?" But the real risk doesn't live one hop away - it lives in the network. The question that actually protects a deduction is different: how many hops are you from an EFOS?

At DISAI we built `efos-risk-graph` to answer it, and today we're releasing it open-core.

It models invoicing relationships as a directed graph and propagates risk with distance-based attenuation. Instead of a binary red/green signal, you get:

- A risk score per taxpayer.
- The path that explains it ("Client -> Supplier A -> definitive EFOS, 2 hops away").
- Detection of invoicing carousels (cycles like A -> B -> C -> A).

And because the model is transparent, the numbers check themselves: a definitive EFOS at 1 hop weighs 50%; at 2 hops, 25%. No black boxes. The example table is calculated by hand in the repository, and every number is asserted in the tests.

## Open where it should be, private where it must be

The graph engine and the 69-B list parser are 100% open source (TypeScript, lightweight core, MIT license). The edges - your CFDIs - never leave your system, because the package doesn't even ask for them. Weights and relationships are injected in, and the engine has no idea where they came from. You bring your own data; the math is public.

This component already runs inside DISAI-Conta's fiscal risk engine, and now we're sharing it so firms and teams can integrate it into their own tooling. The repository includes full mathematical documentation, a synthetic example you can verify by hand, and tests that validate every design decision.

Have you ever had a deduction bounced because of a second-tier supplier you didn't even know about?

---

*Originally published in Spanish on [LinkedIn](https://www.linkedin.com/posts/tripl3tr3s_fiscaltech-sat-opensource-activity-7483648510316138496-4nXl). This is an English adaptation of that post.*
