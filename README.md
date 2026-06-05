# PUNARVA: Athlete Recovery System

An elite sports medicine platform that combines biometric data, clinical protocols, and AI to provide deterministic safety checks and evidence-based recovery plans.

## Architecture

This project implements an enterprise-grade backend architecture:

1. **Deterministic Red Flag Gateway (Middleware):**
   - Intercepts daily check-ins before they reach the LLM.
   - If an athlete reports a critical pain level (>=8) or uses specific medical keywords ("pop", "snap", "numbness"), the system instantly triggers a hardcoded medical referral protocol.
   - This ensures zero latency for emergencies, protects athlete safety deterministically, and saves API costs.

2. **Retrieval-Augmented Generation (RAG) Pipeline:**
   - **Symptom Parsing:** Uses Google Gemini to extract structured JSON (location, pain type) from raw voice transcripts.
   - **Vector Search:** Converts symptoms into embeddings using `text-embedding-004` and fetches the most relevant Clinical Rehab Protocols from Firebase Firestore.
   - **Master Inference:** Injects the retrieved protocols into the final Gemini context window with strict instructions to *only* suggest exercises from the provided clinical texts, eliminating AI hallucination.

## Setup

1. **Environment Variables:**
   Create a `.env` file and add your `GEMINI_API_KEY` and Firebase credentials.

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Seed Firestore (RAG Database):**
   ```bash
   npx tsx server/seedFirestore.ts
   ```

4. **Run Server:**
   ```bash
   npm run dev:all
   ```
