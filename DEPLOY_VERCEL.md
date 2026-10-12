# Deploy to Vercel

## 1. Create MongoDB Atlas

1. Open https://www.mongodb.com/cloud/atlas and create an Atlas project.
2. Create a **Free / M0** cluster for the demonstration.
3. Under Database Access, create a dedicated database user with read/write access to your demo database.
4. Under Network Access, permit the addresses that will connect. Standard Vercel functions use dynamic egress addresses; for this synthetic-data demo, Atlas's `0.0.0.0/0` allow-list entry permits those connections. Use a strong database password and a dedicated demo database/user. Do not copy this broad-access demo setup into a real patient-data deployment.
5. Click Connect → Drivers → Node.js and copy the connection string. Replace its username/password placeholders; URL-encode special characters in the password. Never commit that string.

The application creates its collections/indexes, demo users, GridFS bucket and TTL indexes on first API use. Do not manually create collections.

## 2. Upload the source to GitHub

Extract the ZIP. Upload the **contents of the `OPD` folder** to a new repository, including `api`, `public`, `server.mjs`, `storage.mjs`, `ai.mjs`, `package.json`, `package-lock.json`, `build.mjs` and `vercel.json`.

Do not upload only the ZIP. Do not include `.env`, `node_modules`, `.git`, `.qa` or old local patient data.

If your repository contains an outer `OPD` directory, the Vercel Root Directory must be `OPD`. If `package.json` is already at repository root, leave Root Directory at its default.

## 3. Import into Vercel

Open https://vercel.com/new and import the repository.

Use:

| Setting | Value |
|---|---|
| Framework Preset | Other |
| Root Directory | Folder containing `package.json` and `vercel.json` |
| Node.js Version | 24.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `public` |

The included `vercel.json` defines static output, API rewrites, security headers and a 300-second function duration. Keep Fluid compute enabled. No custom `HOST`, `PORT`, `DATA_DIR`, Blob token or session secret is required on Vercel.

## 4. Add environment variables

Set these before the first deployment:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=opd_brief
OPENAI_API_KEY=YOUR_API_KEY
OPENAI_MODEL=gpt-4.1
OPENAI_TRANSCRIBE_MODEL=gpt-4o-mini-transcribe
DEMO_MODE=true
DEMO_OTP=123456
```

Optional account-seeding variables:

```env
STAFF_DEMO_PASSWORD=Staff@123
DOCTOR_DEMO_PASSWORD=Doctor@123
```

The client displays the standard demo credentials. If you change the optional passwords before account creation, use those values at login. Password variables only seed newly created accounts; existing database accounts keep their saved hashes.

Choose the Vercel environment(s) you intend to use. For Production and Preview, preferably use separate demo database names so preview tests do not alter production demo records. Changes to environment variables require redeployment.

## 5. Deploy and check

1. Click Deploy.
2. Open `https://YOUR_PROJECT.vercel.app/api/health`.
3. Expect a JSON response containing `ok: true` and `storage: mongodb`. `aiReady` only checks whether a key is configured; it does not verify API billing or access.
4. Open the homepage and register a fictional patient.
5. Log in with demo OTP `123456`.
6. Save a typed complaint, record voice, and upload `demo-documents/synthetic-records.pdf`.
7. Use staff login in a separate browser profile, record/check vitals, resolve gaps and mark ready.
8. Use doctor login, open source excerpts, assign a correction note to staff if needed, and save review.
9. Toggle Hindi/English. Test a phone camera capture using the HTTPS URL.
10. Redeploy once and verify that the patient's login, visit and original files still work.

Do not call the deployment verified until those live checks pass. OpenAI requests are separately billed. Vercel/Atlas free tiers have usage limits; this project is intended for a modest synthetic-data demonstration.

## Upload behaviour

The client uploads files and recordings as 768 KiB chunks and then sends only a ticket reference for processing. No request includes a whole 10 MB base64 file. Tickets are scoped to their owner/visit; originals are retrieved only through authenticated APIs. Maximum original file/recording size is 10 MiB. Each recording stops after two minutes.

Do not replace the client with the old base64 upload version or revert the API wrapper to `x-matched-path` routing.

## Documentation

- https://vercel.com/docs/functions/runtimes/node-js
- https://vercel.com/docs/functions/limitations
- https://www.mongodb.com/docs/drivers/node/current/crud/gridfs/
- https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/
