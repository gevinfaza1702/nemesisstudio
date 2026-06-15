/**
 * Storage Utilities for Server
 * File-based storage helpers for JSON data persistence
 */

import fs from "node:fs";
import path from "node:path";

// Directory paths
const uploadsDir = path.resolve(process.cwd(), "uploads");
const licenseDir = path.resolve(process.cwd(), "license");

// File paths
const uploadsMetaPath = path.join(uploadsDir, "uploads-meta.json");
const usageStatsPath = path.join(uploadsDir, "usage-stats.json");
const sessionsPath = path.join(uploadsDir, "sessions.json");
const creditsPath = path.join(uploadsDir, "credits.json");
const userCreditsPath = path.join(uploadsDir, "user-credits.json");
const soraJobsPath = path.join(uploadsDir, "sora-jobs.json");
const activationStatePath = path.join(licenseDir, "activation-state.json");

// Ensure directories exist
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (_) { }

// ===== Uploads Meta =====
export const readUploadsMeta = () => {
  try {
    if (!fs.existsSync(uploadsMetaPath)) return {};
    const raw = fs.readFileSync(uploadsMetaPath, "utf8");
    const json = JSON.parse(raw);
    return json && typeof json === "object" ? json : {};
  } catch (_) {
    return {};
  }
};

export const writeUploadsMeta = (meta) => {
  try {
    const content = JSON.stringify(meta || {}, null, 2);
    fs.writeFileSync(uploadsMetaPath, content, "utf8");
  } catch (_) { }
};

// ===== Admin Credits (local fallback) =====
export const readCredits = () => {
  try {
    if (!fs.existsSync(creditsPath)) return { sora2: 0 };
    const raw = fs.readFileSync(creditsPath, "utf8");
    const json = JSON.parse(raw);
    const v = json && typeof json === "object" ? json : {};
    const n = Number(v.sora2 || 0);
    return { sora2: Number.isFinite(n) ? n : 0 };
  } catch (_) {
    return { sora2: 0 };
  }
};

export const writeCredits = (credits) => {
  try {
    const payload = { sora2: Number(credits?.sora2 || 0) || 0 };
    const content = JSON.stringify(payload, null, 2);
    fs.writeFileSync(creditsPath, content, "utf8");
  } catch (_) { }
};

// ===== User Credits (local fallback) =====
export const readUserCredits = () => {
  try {
    if (!fs.existsSync(userCreditsPath)) return {};
    const raw = fs.readFileSync(userCreditsPath, "utf8");
    const json = JSON.parse(raw);
    return json && typeof json === "object" ? json : {};
  } catch (_) {
    return {};
  }
};

export const writeUserCredits = (map) => {
  try {
    const content = JSON.stringify(map || {}, null, 2);
    fs.writeFileSync(userCreditsPath, content, "utf8");
  } catch (_) { }
};

// ===== Usage Stats =====
export const readUsageStats = () => {
  try {
    if (!fs.existsSync(usageStatsPath)) return {};
    const raw = fs.readFileSync(usageStatsPath, "utf8");
    const json = JSON.parse(raw);
    return json && typeof json === "object" ? json : {};
  } catch (_) {
    return {};
  }
};

export const writeUsageStats = (stats) => {
  try {
    const content = JSON.stringify(stats || {}, null, 2);
    fs.writeFileSync(usageStatsPath, content, "utf8");
  } catch (_) { }
};

// ===== Sessions (local fallback) =====
export const readSessions = () => {
  try {
    if (!fs.existsSync(sessionsPath)) return {};
    const raw = fs.readFileSync(sessionsPath, "utf8");
    const json = JSON.parse(raw);
    return json && typeof json === "object" ? json : {};
  } catch (_) {
    return {};
  }
};

export const writeSessions = (sessions) => {
  try {
    const content = JSON.stringify(sessions || {}, null, 2);
    fs.writeFileSync(sessionsPath, content, "utf8");
  } catch (_) { }
};

// ===== Sora Jobs =====
export const readSoraJobs = () => {
  try {
    if (!fs.existsSync(soraJobsPath)) return {};
    const raw = fs.readFileSync(soraJobsPath, "utf8");
    return JSON.parse(raw);
  } catch (_) {
    return {};
  }
};

export const writeSoraJobs = (jobs) => {
  try {
    fs.writeFileSync(soraJobsPath, JSON.stringify(jobs, null, 2), "utf8");
  } catch (_) { }
};

// ===== Activation State =====
export const readActivationState = () => {
  try {
    const s = fs.readFileSync(activationStatePath, "utf8");
    return JSON.parse(s);
  } catch (_) {
    return { licenses: {} };
  }
};

export const writeActivationState = (state) => {
  try {
    fs.mkdirSync(path.dirname(activationStatePath), { recursive: true });
    fs.writeFileSync(
      activationStatePath,
      JSON.stringify(state, null, 2),
      "utf8"
    );
  } catch (e) {
    console.warn("[license] Failed to persist activation-state:", e);
  }
};

// ===== Persist ENV Value =====
export const persistEnvValue = (key, value, envFilePath) => {
  const sanitized =
    typeof value === "string" ? value.replace(/\r?\n/g, "").trim() : "";
  let lines = [];
  if (fs.existsSync(envFilePath)) {
    try {
      const raw = fs.readFileSync(envFilePath, "utf8");
      lines = raw.split(/\r?\n/);
    } catch (err) {
      console.warn("[settings] Failed to read existing env file:", err);
      lines = [];
    }
  }
  const keyPattern = new RegExp(`^\\s*${key}\\s*=`);
  let replaced = false;
  const nextLines = [];
  for (const line of lines) {
    if (keyPattern.test(line)) {
      if (!replaced) {
        nextLines.push(`${key}=${sanitized}`);
        replaced = true;
      }
      continue;
    }
    if (line !== undefined) {
      nextLines.push(line);
    }
  }
  if (!replaced) {
    if (nextLines.length && nextLines[nextLines.length - 1] !== "") {
      nextLines.push("");
    }
    nextLines.push(`${key}=${sanitized}`);
  }
  const finalContent = nextLines.join("\n");
  fs.writeFileSync(
    envFilePath,
    finalContent.endsWith("\n") ? finalContent : `${finalContent}\n`,
    "utf8"
  );
  return sanitized;
};

// Export paths for use elsewhere
export const paths = {
  uploadsDir,
  uploadsMetaPath,
  usageStatsPath,
  sessionsPath,
  creditsPath,
  userCreditsPath,
  soraJobsPath,
  activationStatePath,
};
