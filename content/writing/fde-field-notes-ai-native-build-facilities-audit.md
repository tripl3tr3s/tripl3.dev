---
title: "FDE Field Notes: Starting an AI-Native Build With a Facilities Audit"
excerpt: "New engagement: designing a custom AI-native operating system for a Mexican waste management company with zero digital infrastructure today. Before any architecture gets decided, it starts with a levantamiento - a real facilities walkthrough."
tags: ["Build in Public", "Forward Deployed Engineering", "DISAI"]
draft: false
---

This week I'm starting a new exiting project: I'm designing a custom AI-native operating system, from zero, for a Mexican waste management company with no digital infrastructure today. No existing internal software, no cloud footprint, nothing, a genuine green-field build 🤩.

## Why this starts with a walkthrough, not a whiteboard

As Engineers/Architects it's really tempting to jump straight to architecture (sometimes the mental muscle memory kicks in): pick a stack, sketch a diagram, start writing code. I don't do that on a green-field engagement, and this one is no exception.

Before any technical decision gets made, there's a levantamiento which is a full on-site facilities audit. Site zones, network and connectivity, power infrastructure, existing equipment, candidate camera mounting points, environmental conditions, physical security. The kind of ground truth that only exists by actually walking the site, not by assuming it from a slide deck.

#### Here's my custom project's general checklist that I prepared for this purpose:

### 1. Site & Zone Map

- [ ] Walk the full site and mark distinct zones: entrance/gate, weigh station, sorting/warehouse floor, storage yard, office
- [ ] Note approximate distances between zones - this drives cabling vs. wireless decisions later
- [ ] Identify any zone that's outdoors or semi-covered vs. fully enclosed (affects what hardware can survive there)

### 2. Network & Connectivity

- [ ] Identify the current ISP, contracted speed, and actual measured speed (up/down) at the office and at the weigh station
- [ ] Is there more than one connection (backup line, mobile hotspot) or a single point of failure?
- [ ] Map current Wi-Fi coverage zone by zone - where does signal drop or disappear?
- [ ] Photograph and note brand/model/age of the existing router, modem, and any switches
- [ ] Check for existing Ethernet drops or conduit runs, and where they lead
- [ ] Test mobile signal strength at the weigh station and warehouse as a fallback option
- [ ] Ask how often the internet actually goes down, and for how long - this is the real number that decides whether you need any local buffering at all

### 3. Power Infrastructure

- [ ] Locate the electrical panel and note remaining capacity/open breakers
- [ ] Identify available outlets at each candidate equipment location (weigh station, camera mount points, network closet)
- [ ] Ask about voltage stability; any history of surges, brownouts, or damaged equipment from power issues (common on industrial sites)
- [ ] Check for any existing UPS or surge protection, and whether the router/modem is protected
- [ ] Note if a backup generator exists or is planned

### 4. Existing Compute & IT Equipment

- [ ] Inventory any PCs, laptops, tablets currently used on-site; brand, age, OS, what they're used for
- [ ] Confirm whether the "server" being pitched already has a quote/spec sheet (get the exact model and price)
- [ ] Check for any existing local server, NAS, or backup device already in use
- [ ] List phones assigned to staff and whether they're personal or company-owned (relevant for any mobile-based intake tool)
- [ ] Note printers, scanners, or POS-like devices already in place

### 5. Weighing/Scale Equipment

- [ ] Get the exact brand and model of the scale(s) in use
- [ ] Confirm whether it's digital or analog, and if digital, what output it supports (RS232, RS485, USB, Bluetooth, none)
- [ ] Ask if any software currently reads from the scale automatically, or if readings are transcribed by hand (my guess is that they're already paying for licensed scale software)
- [ ] Check calibration status and who's responsible for it (important)

### 6. Camera & Vision Infrastructure

- [ ] Document any existing CCTV/security cameras: count, coverage, brand, NVR/DVR system, and whether footage is stored locally or in the cloud
- [ ] Identify candidate mounting points for a material-classification camera at the weigh/sorting station: height, angle, distance to material, unobstructed view
- [ ] Check lighting at each candidate point at different times of day - natural light changes matter for computer vision
- [ ] Assess dust and weather exposure at each point - recycling sites are hard on electronics, so note what would need an IP-rated (dust/weatherproof) enclosure
- [ ] Confirm power and network availability (or distance to nearest drop) at each candidate mounting point

### 7. Environmental Conditions

- [ ] Note general dust levels in the sorting/warehouse area
- [ ] Note temperature extremes and humidity if the site is not climate-controlled
- [ ] Flag any location prone to water exposure (roof leaks, open-air zones) - disqualifies standard indoor hardware

### 8. Security & Physical Access

- [ ] Note who has physical access to any area where equipment would be installed
- [ ] Check whether a locked closet or cabinet exists (or would be needed) for networking gear or any local device
- [ ] Assess theft/tamper risk for cameras mounted in accessible areas

### 9. Gap Summary (fill this in after the walk)

- [ ] List what already exists and is reusable as-is
- [ ] List what's missing and required regardless of the cloud-vs-server decision (e.g., a camera mount, an extra outlet, a Wi-Fi access point)
- [ ] List anything that specifically justifies a small local device (buffering during outages, a camera's local pre-processing) vs. what was in the original server pitch
- [ ] Sketch or annotate a simple site diagram marking existing equipment and proposed new positions

This matters because the alternative (designing infrastructure on assumptions) is how consultants end up recommending hardware nobody needs, or missing constraints (spotty connectivity, no available power, no secure mounting point) that quietly sink a system after it's already been built.

## From audit to ADRs

The walkthrough isn't just note-taking. Every finding turns into a formal Architecture Decision Record: a documented, evidence-backed call on things like cloud vs. any on-site hardware, network topology, where and how sensor/camera infrastructure gets deployed, and what a realistic Phase 1 scope actually looks like given what's really there. The point of an ADR is that the decision is traceable back to a reason, not a preference.

## The general shape of the work

Between the walkthrough and the requirements gathering, a handful of operational opportunity areas have come into focus, the kind you'd expect in an operation still running on paper and spreadsheets: digitizing the core operational record as a single source of truth, real-time visibility into inventory, smarter quoting workflows with a human still in the approval loop, pricing intelligence, compliance and traceability reporting, and financial automation downstream of all of it.

That's the general shape. The specifics (what gets built first, what's cloud vs. local, what the AI actually does versus what stays human-approved) all get decided from what the audit and the requirements sessions actually turn up, not from a template.

More to come once the ADRs are written.
