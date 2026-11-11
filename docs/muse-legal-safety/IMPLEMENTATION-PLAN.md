# MagicReel Muse Legal-Safety Foundation
## Engineering implementation plan — draft for internal use and IPR-lawyer review

Status: Internal product/engineering specification. Not approved legal terms or legal advice.
Scope: Strengthen the existing Muse Generation and Avatar Engine. Do not create a second Muse engine or alter Hero, Lookbook, Campaign, Editorial, or Reel generation workflows.

## Product objective

Give customers a clear, documented basis to use their saved Muse and generated fashion content commercially, protect private Muse assets from other customers, record the origin and consent basis for each Muse, and provide an evidence-led response process for reported misuse.

Do not promise that a customer owns an exclusive right in an abstract AI-generated face, that no similar face can be independently generated, or that a MagicReel record is a copyright certificate or government registration.

## Existing implementation observations (verified during code review)

- Muse reference uploads use authenticated Cloudinary storage and attach an owner_id context value.
- The generate-faces endpoint verifies the uploaded reference asset belongs to the authenticated user.
- Candidate assets are authenticated and carry owner_id, reference_public_id, collage_public_id, and candidate_number context.
- The create-from-candidate endpoint verifies candidate ownership before creating the four saved assets.
- The Muse database model records owner, candidate, generated asset identifiers, prompt version, status, and timestamps.
- The current browser consent control is one broad checkbox. Both generation endpoints receive only consent: true; no durable consent event, wording/version, or consent timestamp is recorded.
- The Muse row does not retain the original reference asset ID or a structured provenance/consent record.
- Existing Terms and Privacy pages are high-level and do not yet explain Muse-specific commercial-use permission, face/likeness consent, provider processing, or the limits of exclusivity.

## Workstream A — Consent at the point of upload/generation

1. Replace the broad checkbox with clear, plain-language confirmation.
2. The customer must confirm they own or are authorised to use the uploaded photograph and that the adult depicted has consented to AI transformation and commercial fashion-content use.
3. Explain that the photo is used as a visual reference to create a new AI-generated fashion identity; do not imply guaranteed uniqueness or guaranteed absence of resemblance to others.
4. Do not allow generation until the confirmation is accepted.
5. Use a versioned consent statement. Record the exact version and timestamp server-side; do not rely on a browser-only flag.
6. The backend must independently enforce the consent requirement. Never trust a client-supplied timestamp or consent version as proof of server acceptance.
7. The final wording and any separate consent choices must be approved by Indian privacy/IP counsel before public launch.

Proposed interim UI wording for counsel review:
"I confirm that I own this photograph or have permission to use it, and that the adult person shown has given permission for it to be used to create an AI-generated fashion identity and related commercial fashion content. I understand that the generated identity may resemble other people or independently generated images."

If the product later supports photographs of third parties at scale, consider separate declarations for (a) uploader's authority and (b) the depicted person's consent, with a clear process for documenting consent.

## Workstream B — Muse provenance and consent evidence

Create a durable server-side audit record linked to the authenticated user and, when available, the saved Muse. Minimum fields to assess with the backend engineer:

- immutable event ID
- authenticated user ID
- Muse ID (nullable until Muse is saved)
- reference image Cloudinary public ID (never a public URL)
- selected candidate public ID and candidate number, when applicable
- event type (reference uploaded, consent accepted, candidates generated, Muse saved, deletion requested/completed)
- consent statement version and exact text or immutable content hash
- server-generated UTC timestamp
- generation model/provider identifier and prompt version
- generated asset public IDs and asset roles
- relevant application release/version

Do not store more personal data than necessary. Do not put raw photographs, signed URLs, access tokens, or unnecessary face/biometric templates in audit logs. Restrict audit access to authorised support/admin roles. Define retention and deletion behaviour with counsel.

A customer-facing "Muse Identity Record" may show Muse ID, creation date, owner account, selected Muse name, and generated asset history. It must say that it is a MagicReel provenance record, not a statutory IP registration or guarantee of exclusive rights.

## Workstream C — Privacy and access controls

- Keep all private Muse assets in authenticated Cloudinary storage.
- Continue server-side owner checks for reference images, candidates, and saved Muse operations.
- Review every Muse read/list/delete endpoint for user scoping; never rely on UI filtering alone.
- Ensure private assets are not added to Explore Muses, public galleries, shared templates, or training datasets without a separate valid permission.
- Document AI-provider processing and any onward transfer needed to generate the requested output.
- Define source-photo retention, generated-asset retention, deletion, backups, and legal-hold exceptions. Do not promise immediate deletion from backups or third-party systems unless verified.
- Test cross-account access attempts for every Muse endpoint and asset retrieval path.

## Workstream D — Customer rights and prohibited conduct

The lawyer-reviewed terms should explain, in plain language:
- the customer's permitted commercial use of their saved Muse and generated outputs, subject to applicable law and the terms;
- that the customer's Muse is private to their account and is not offered to other customers without permission;
- that MagicReel retains rights in its platform, software, models, and brand;
- that users must not copy another user's private Muse assets, impersonate a real person, or use outputs unlawfully;
- that AI outputs may not be unique and similar-looking outputs may be independently generated;
- that copyright or other IP ownership in purely AI-generated material is not guaranteed and depends on applicable law and facts.

Avoid wording that transfers rights the company does not own or guarantees exclusive ownership of a face.

## Workstream E — Misuse reporting and response

Provide a report form that collects:
- reporter's account and contact details;
- affected Muse ID and, if available, its provenance record;
- URLs/screenshots or other evidence of the suspected misuse;
- a short description of whether the complaint concerns copied assets, impersonation, privacy/likeness, trademark/branding, or another issue;
- confirmation that the report is made in good faith.

Create an internal case record with received date, reviewer, status, evidence, actions, and customer communications. Provide acknowledgement and escalation paths. Do not automatically promise removal from third-party websites; MagicReel can assess the report, preserve evidence, and assist with appropriate notices.

## Workstream F — Legal-review pack

Prepare drafts for an Indian IPR/privacy lawyer:
1. Muse-specific Terms of Service clauses and customer commercial-use licence.
2. Muse upload and depicted-person consent wording.
3. Privacy Policy addendum covering source photos, AI processing providers, retention, deletion, and user rights.
4. Acceptable Use / impersonation / private-asset copying rules.
5. Misuse complaint and takedown workflow.
6. Customer-facing Muse Identity Record disclaimer.
7. Review of whether any human creative contribution, branding, character design, trademark, copyright, or other IP strategy is available for specific Muse assets.

## Engineering acceptance criteria

- No Muse generation can proceed without the current server-validated consent version.
- Consent evidence is persisted with a server timestamp and linked to the user and reference asset.
- A saved Muse can be traced to its reference asset, selected candidate, generation version, and generated assets.
- Every private Muse endpoint enforces owner-level authorisation server-side.
- A customer can see and retrieve their own Muse provenance record.
- Private Muse assets are not exposed in Explore Muses or another customer's account.
- Deletion and retention behaviour is documented and tested.
- Existing Hero/Lookbook/Campaign/Editorial/Reel workflows remain unchanged.
- No production migration or deployment occurs until schema changes, migration SQL, backup/rollback plan, and tests have been reviewed.

## Release gate

This foundation is not a substitute for legal review. Before public launch of the revised Muse consent and rights claims, obtain written review from an Indian IPR/privacy lawyer. Until then, use conservative product language and do not claim exclusive legal ownership of an AI-generated face.
