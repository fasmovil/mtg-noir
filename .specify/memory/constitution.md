<!--
Sync Impact Report
- Version change: template → 1.0.0
- Modified principles: none; initial project constitution.
- Added sections: Contract and Scope Boundaries; Development Workflow and Quality Gates.
- Removed sections: template guidance and unresolved placeholders.
- Follow-up TODOs: none.
-->

# MTG Noir Constitution

## Core Principles

### I. Functional Correctness Before All Other Concerns

Every change MUST preserve correct, observable behavior before optimizing simplicity,
contract stability, accessibility, or visual identity. A change that alters user-visible behavior
or API behavior MUST be defined by an approved specification before implementation. This protects
the V1 baseline from accidental behavioral changes.

### II. Stable Application Contract and Service Boundaries

The frontend MUST consume the application's own backend contract and MUST NOT depend on Scryfall's
full response shape. The Express backend remains the adapter between the React/Vite frontend and
Scryfall. Contract changes, including response fields, error semantics, and search behavior, MUST
be specified explicitly and assessed for frontend and backend impact.

### III. Prefer the Simplest Verified Solution

Implementations MUST use the smallest design that satisfies the approved specification. New
dependencies, state layers, service boundaries, persistence, or abstractions require a stated
need in the technical plan. Every feature specification MUST define verification appropriate to
the affected behavior, and implementation MUST run the applicable checks before completion.

### IV. Basic Accessibility and Product Identity

User flows MUST retain semantic controls, visible keyboard focus, readable status and error
messages, and responsive behavior. MTG Noir's dark noir, neon, and retrofuturistic identity is a
product requirement, but visual choices MUST NOT reduce functional correctness, simplicity,
contract stability, or basic accessibility.

### V. Spec-Driven, Feature-Scoped Change Management

Material changes MUST proceed through the project's Spec Kit workflow and be implemented on a
feature branch. Specifications, plans, tasks, and conformance evidence MUST remain traceable to
the approved change. Task-to-GitHub-Issue conversion is not part of the default workflow unless a
future governance amendment adopts it.

## Contract and Scope Boundaries

The V1 contract is governed by its approved baseline specification. Until baseline alignment is
verified, known implementation gaps MUST be recorded as conformity gaps rather than treated as
contractual behavior.

Production hosting, reverse proxies, HTTPS and deployment, advanced observability, CI/CD, formal
dependency policy, public API versioning, external consumers, and production infrastructure are
not defined by this constitution. A future feature that depends on any of these areas MUST specify
the required decision before implementation.

## Development Workflow and Quality Gates

Each feature MUST begin with an approved specification. When ambiguity remains, the feature MUST
be clarified before planning. Plans MUST state affected contracts, architecture choices,
verification, and any deviation from these principles. Tasks MUST be traceable to specification
requirements, and consistency analysis MUST complete before implementation for changes that alter
the application contract or behavior.

The repository uses Git, GitHub, and feature branches. Reviews MUST verify constitution compliance,
the approved specification, and the evidence for applicable validation. The V1 baseline becomes
frozen only after its alignment work verifies conformance to the approved contract.

## Governance

This constitution supersedes undocumented project conventions when they conflict. Amendments MUST
be proposed through a documented decision, reviewed in Git, and include any required updates to
affected specifications, plans, tasks, and validation evidence.

Constitution versions use semantic versioning: MAJOR for incompatible removals or redefinitions of
principles, MINOR for new principles or materially expanded governance, and PATCH for clarifying
wording that does not change governance. Every review MUST verify compliance with the current
constitution; unjustified deviations block completion until the specification or plan resolves
them.

**Version**: 1.0.0 | **Ratified**: 2026-09-20 | **Last Amended**: 2026-09-20
