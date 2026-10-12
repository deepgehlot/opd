# Verification

Completed on Node.js 24.19.0:

- Build and syntax checks pass.
- Eleven integration/routing tests pass: portal handover, distributed sessions/challenges, 10 MiB chunked upload, private original streaming, ownership checks, retries, malformed uploads, concurrency, review locking, single active visit and Vercel rewrite behaviour.
- The real MongoDB adapter passed a separate integration test against a local MongoDB 7.0.14 replica set: transactions, session persistence across handlers, GridFS storage/retrieval, chunk assembly, leases and stale-update rejection.
- Headless Chromium browser walkthrough passed patient registration/OTP, original-source viewing, microphone transcription, camera preview/capture/chunk upload, staff verification/handover, doctor review and Hindi/English switching.
- Desktop/Hindi/mobile screens were visually inspected. Hindi font assets are bundled. Test camera/microphone devices were simulated; database and OpenAI responses in the browser walkthrough used explicit test stubs.

Not completed:

- Deployment into your Vercel account: account/project credentials were not supplied.
- Connection to your Atlas cluster: your connection string was not supplied.
- Live OpenAI OCR/transcription quality, billing and model-access checks: no API key was supplied.

Run the live rehearsal in DEPLOY_VERCEL.md using your own environment variables. Passing code tests does not guarantee zero errors on every document/device or guarantee clinical extraction accuracy.
