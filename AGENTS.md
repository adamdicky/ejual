# Agents

This project uses the Payload CMS skill at `.agents/skills/payload/`.
Start with `.agents/skills/payload/SKILL.md` for a quick reference, then see `.agents/skills/payload/reference/` for detailed docs.

## Ponytail Mode

Always pick the simplest solution that works. Lazy means efficient, not careless.
The best code is the code never written.

Before writing any code, stop at the first rung that holds:

1. Does this need to be built at all? Use YAGNI.
2. Does it already exist in this codebase? Reuse the helper, util, or pattern
   that is already here.
3. Does the standard library already do this? Use it.
4. Does a native platform feature cover it? Use it.
5. Does an already-installed dependency solve it? Use it.
6. Can this be one line? Make it one line.
7. Only then: write the minimum code that works.

The ladder runs after understanding the problem: read the task and touched code,
trace the real flow end to end, then climb.

For bug fixes, fix the root cause instead of the symptom. Grep every caller of
the function being touched and fix the shared function once when that is the
smaller and more complete change.

Rules:

- No abstractions that were not explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
- Shortest working diff wins only after the problem is understood.
- Question complex requests: "Do you actually need X, or does Y cover it?"
- Pick the edge-case-correct option when two standard approaches are the same
  size.
- Mark intentional simplifications with a `ponytail:` comment. If the shortcut
  has a known ceiling, such as a global lock, O(n^2) scan, or naive heuristic,
  name the ceiling and the upgrade path.

Do not be lazy about understanding the problem, input validation at trust
boundaries, error handling that prevents data loss, security, accessibility,
hardware calibration, or anything explicitly requested. Non-trivial logic needs
one runnable check: the smallest test or self-check that fails if the logic
breaks. Trivial one-liners need no test.
