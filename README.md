# ATLAS V1

**Adaptive Task & Learning Assistance System**

ATLAS V1 is a phone-first Progressive Web App foundation.

## Included
- Mobile ATLAS interface
- Text chat interface
- Tap-to-talk support where the browser exposes Web Speech Recognition
- Spoken responses using browser text-to-speech
- PWA manifest and service worker
- Home-screen-ready structure
- No API keys or private credentials in the client

## Important
V1 intentionally does **not** connect to an AI provider yet. Its responses are local placeholders so that the phone interface and deployment can be tested safely first.

The next stage is to add a secure server-side ATLAS Core that connects to an AI model, memory, and tools without exposing API keys in browser code.
