/**
 * TRUE CONCEPT — Firebase Functions Backend
 *
 * Each export becomes a separate Firebase HTTPS function.
 * All functions are deployed to asia-south1 (Mumbai, India).
 *
 * Firebase Hosting rewrites in firebase.json map /api/* paths
 * to these functions so the frontend needs no URL changes.
 */

export { auth } from "./routes/auth.js";
export { subjects } from "./routes/subjects.js";
export { chapters } from "./routes/chapters.js";
export { content } from "./routes/content.js";
export { experiments } from "./routes/experiments.js";
export { progress } from "./routes/progress.js";
export { dashboard } from "./routes/dashboard.js";
export { search } from "./routes/search.js";
export { students } from "./routes/students.js";
export { storage } from "./routes/storage.js";
export { health } from "./routes/health.js";

// Firestore triggers
export { rebuildKnowledgeProfile } from "./triggers/knowledge-profile.js";
export { broadcastNewContent }     from "./triggers/broadcast-recommendation.js";

// AI
export { aiMentor } from "./routes/ai-mentor.js";
