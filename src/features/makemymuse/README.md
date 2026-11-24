# MakeMyMuse frontend module

MakeMyMuse is an independently extractable product module. The current UI prototype remains under `src/pages/makemymuse` during the transition; new product logic should be placed in this module.

## Boundaries
- Product pages and wizard state: `pages/`, `flows/create-muse/`
- Reusable product UI: `components/`
- API calls: `services/`
- State: `state/`
- Product types: `types/`
- Styling/assets: `styles/`, `assets/`

Shared authentication, app shell, and infrastructure may be imported only through explicitly shared interfaces. Do not import MagicReel product workflows or business logic.

## Approved creation flow
1. Upload reference image.
2. Generate open-pose key-frame / Identity Blueprint preview.
3. Set creative direction: gender presentation (Female, Male, Androgynous), age appearance 18–60, skin direction.
4. Generate one 8-face collage; store collage and individual candidates in Cloudinary.
5. Select a face.
6. Refine face and use Preview Changes.
7. Approve face.
8. Select body type.
9. Generate and reveal final model.

This module is currently a UI prototype. Real generation and persistence must be connected through the separate backend module before calling it production-ready.
