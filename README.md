# NutriScan - Food Transparency & Allergen Radar

NutriScan is a clinical-grade Progressive Web App (PWA) and food ingredient decoding engine. It enables consumers to decode deceptive labels, spot hidden allergens instantaneously, and configure personalized bio-sensory dietary guardrails.

---

## Architecture & Technology Stack

- **Frontend & UI**: React 19, TypeScript, Tailwind CSS, Space Grotesk & Plus Jakarta Sans typography, Material Symbols.
- **PWA & Offline Capabilities**: Web App Manifest (`id: '/'`, `display: 'standalone'`), Service Worker precaching via `vite-plugin-pwa`, `usePWAInstall` hook with in-app install prompt, and offline indicator.
- **Database & Identity**: Google Cloud Firestore with owner-bound security rules (`firestore.rules`) and Firebase Authentication.
- **Sensory Alert Engine**: Web Audio API dual-beep piercing hazard siren and rhythmic vibration pulse sequence (`navigator.vibrate`) for crowded supermarket environments.

---

## Google Cloud & Firestore Security Configuration

### 1. Production Firestore Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default deny catch-all
    match /{document=**} {
      allow read, write: if false;
    }

    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isValidId(id) {
      return id is string && id.size() > 0 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    // Isolated user dietary profiles
    match /users/{userId} {
      allow get: if isOwner(userId);
      allow create: if isOwner(userId) && isValidId(userId);
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId);

      // User scan telemetry & history
      match /scans/{scanId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && isValidId(scanId);
        allow update: if isOwner(userId);
        allow delete: if isOwner(userId);
      }
    }

    // Public catalog reads & verified contributor updates
    match /products/{productId} {
      allow read: if true;
      allow create, update: if isSignedIn();
      allow delete: if isSignedIn();
    }

    // Global Additive Policy Engine
    match /additivePolicies/{eCode} {
      allow read: if true;
      allow create, update: if isSignedIn();
      allow delete: if isSignedIn();
    }
  }
}
```

---

## Secret Manager IAM Bindings

To securely supply credentials at runtime without storing secrets in code or `.env`:

```bash
# 1. Create and populate the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"
echo -n "YOUR_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# 2. Grant the default Cloud Run runtime service account access to read the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:714172464469-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Google Cloud Run Deployment & Campaign Verification

### 1. Deploy Container to Cloud Run

```bash
gcloud run deploy nutriscan-app \
  --source=. \
  --region=asia-east1 \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest"
```

### 2. Mandatory Challenge Verification Label

```bash
gcloud run services update nutriscan-app \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=asia-east1
```

---

## Local Development & Build

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Run TypeScript lint check
npm run lint

# Build production bundle
npm run build
```
