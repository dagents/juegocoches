# Security Policy - JuegoCoches

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

### How to Report

1. **GitHub Security Advisories** (preferred): Go to the repository's [Security](../../security/advisories) tab and create a new private advisory.
2. **Private issue**: If you cannot use Security Advisories, open an issue titled "Security: [brief description]" and flag it as containing sensitive information.

### Do NOT

- Do not publish vulnerabilities in public issues.
- Do not exploit the vulnerability beyond what is necessary to demonstrate it.

## Scope

### In Scope
- Authentication or authorization bypass
- SQL injection, XSS, CSRF
- User data exposure
- Prompt injection in the AI moderation system
- API keys or secrets exposed in source code
- Vulnerabilities in critical dependencies

### Out of Scope
- Denial of service (DoS) attacks
- Social engineering
- Self-XSS (requires the victim to execute code in their own browser)
- Vulnerabilities in third-party services (Supabase, OpenRouter) — report those directly to them

## Known Limitations

These are by design and should not be reported as vulnerabilities:

- **In-memory rate limiter**: Rate limiting uses an in-memory `Map` that does not persist across serverless instances. Database constraints (unique indexes) act as an additional security layer.
- **AI moderation is not infallible**: The LLM-based moderation system may have false positives/negatives. AI-approved content can still be reported by the community.

## Response Times

- **Acknowledgment**: We will try to confirm receipt of the report within 48 hours.
- **Assessment**: We will evaluate severity within 7 days.
- **Fix**: Critical vulnerabilities will be prioritized for immediate resolution.

## Acknowledgment

We appreciate those who report vulnerabilities responsibly. If you wish, we will mention you in the project's acknowledgments (unless you prefer anonymity).
