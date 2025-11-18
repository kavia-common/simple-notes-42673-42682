Ocean Notes - Remotion Frontend

How to run:
- npm i
- npm run dev
- In Remotion Studio, open the "OceanNotes" composition.

Features:
- Left sidebar with search and notes list
- Right editor for title, tags, and body
- Add note via header button or Cmd/Ctrl+N
- Delete selected note via Delete key or the trash icon
- Local persistence via localStorage
- Ocean Professional theme: primary blue, amber accents, subtle gradients & shadows

Environment:
The following environment variables are optionally read if present:
- REMOTION_API_BASE
- REMOTION_FRONTEND_URL
- REMOTION_NODE_ENV
They are not required for running the UI.

Studio Stability:
- Persistence is fully disabled in Studio to prevent preview loops.
- No cross-tab storage listeners are registered.
- Global listeners (like keydown) are attached once and suspended during unstable mount/unmount loops.
- Composition width/height/fps/duration are constants to avoid runtime changes.
- Critical initializations are wrapped in try/catch to avoid sync throws causing remounts.
