# 🛡️ CyberShield Public Safety & Intelligence Platform (V2)

An enterprise-grade, AI-powered public safety intelligence platform designed for citizens and law enforcement agencies (LEAs) to detect, disrupt, and prevent digital arrest scams, counterfeit currency circulation, cyber extortion, and organized financial fraud networks.

---

## 🌟 Key Features & Capabilities

### 👮‍♂️ For Law Enforcement & Cyber Crime Units
* **Live GIS Incident Map & Heatmaps**: Real-time geospatial mapping of cyber fraud reports, digital arrest threats, and fake currency encounters across operational sectors.
* **Automated Court-Admissible Intelligence Package (CAIP)**: Generates legal-standard evidentiary dossiers detailing suspect node links, mule bank accounts, IMEI numbers, and financial money trail graph vectors.
* **Cyber Syndicate Network Graph**: Interactive canvas visualizing links between mule accounts, fake call centers, VoIP gateways, and suspected threat actors.
* **Emergency Citizen Dispatch**: Broadcast high-priority push notifications and emergency advisories directly to affected geographic sectors.

### 🛡️ For Citizens & Vulnerable Targets
* **CitizenShield AI Threat Adviser**: Interactive conversational assistant powered by Google Gemini to analyze suspicious legal threats, fake police calls, CBI/Customs impersonations, or job traps.
* **Digital Arrest & Audio Call Analyzer**: Speech and text forensic engine that detects psychological coercion, forced video calls, number spoofing indicators, and legal extortion scripts.
* **AI Counterfeit Currency Scanner**: Multi-part image inspection engine to detect counterfeit security threads, micro-lettering, watermarks, and serial number anomalies on banknotes.
* **Gamified Cyber Safety Simulator**: Interactive scenario-based quizzes and awareness modules to build resilience against cyber threats.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Dynamic Canvas Visualization
* **Backend**: Node.js & Express (`server.ts`) with Vite Development Middleware
* **AI & Multi-Modal Processing**: `@google/genai` TypeScript SDK with **Multi-Key Failover** and **Automatic Model Fallbacks**
* **Database & Realtime Persistence**: Firebase Firestore (`shield_assessments`, `incidents`, `alerts`)
* **Environment & Config**: Custom `.env` configuration supporting flexible `PORT` bindings for hosting platforms like Render, Railway, AWS, or Cloud Run.

---

## 🚀 Environment Variables

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

### Configuration Parameters

| Variable | Description | Default / Required |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Primary Gemini API Key for server-side AI endpoints | Required |
| `GEMINI_API_KEY_2` | Backup Gemini API Key for automatic failover | Optional (Recommended) |
| `GEMINI_API_KEY_3` | Tertiary Gemini API Key for high-concurrency load balancing | Optional |
| `PORT` | HTTP Server port (Auto-bound by Render / Cloud Run) | Defaults to `3000` |
| `VITE_FIREBASE_API_KEY` | Firebase Client API Key | Required for Live Firestore |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Project Auth Domain | Required for Live Firestore |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | Required for Live Firestore |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket URL | Required for Live Firestore |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging Sender ID | Required for Live Firestore |
| `VITE_FIREBASE_APP_ID` | Firebase Web App Identifier | Required for Live Firestore |

---

## 💻 Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/cybershield-public-safety.git
   cd cybershield-public-safety
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root folder based on `.env.example` and add your API keys.

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

## 📦 Production Build & Deployment

### Build Command
```bash
npm run build
```
This compiles the client SPA assets with Vite and bundles the Node.js server using `esbuild` into `dist/server.cjs`.

### Start Command
```bash
npm start
```
Runs the bundled production server (`node dist/server.cjs`), which serves both the API endpoints and static client assets.

---

## 🌐 Deploying to Render

1. **Create a New Web Service** on Render connected to your GitHub repository.
2. **Environment**: `Node`
3. **Build Command**: `npm run build`
4. **Start Command**: `npm start`
5. **Environment Variables**: Add your `GEMINI_API_KEY`, `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3`, and `VITE_FIREBASE_*` key pairs in the Render Environment tab.
6. **Port**: Render automatically provides `PORT` environment variable which `server.ts` will dynamically bind to.

---

## 📄 License

Distributed under the MIT License. Built for public safety and community cyber defense.
