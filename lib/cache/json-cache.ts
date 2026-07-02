import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Vercel's serverless filesystem is read-only except for os.tmpdir() (/tmp), and even that
 * is ephemeral/per-instance (wiped between cold starts, not shared across instances) --
 * acceptable for a regenerable cache, unacceptable to crash requests over. Locally, we keep
 * using a project-relative /data folder so the cache survives dev server restarts.
 */
const CACHE_DIR = process.env.VERCEL ? path.join(os.tmpdir(), "astrogate-cache") : path.join(process.cwd(), "data");

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function readJsonCache<T>(fileName: string): T | null {
  try {
    const filePath = path.join(CACHE_DIR, fileName);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

/**
 * Atomic write: write to a temp file then rename, so readers never see a half-written file.
 * Never throws -- a cache write is always a best-effort optimization, never something a
 * request should fail over (especially on Vercel, where the filesystem can be uncooperative).
 */
export function writeJsonCache<T>(fileName: string, data: T): void {
  try {
    ensureCacheDir();
    const filePath = path.join(CACHE_DIR, fileName);
    const tempPath = `${filePath}.${process.pid}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    console.warn(`[json-cache] تعذّرت كتابة ${fileName}:`, error);
  }
}

export function cacheFileAgeMs(fileName: string): number | null {
  try {
    const filePath = path.join(CACHE_DIR, fileName);
    if (!fs.existsSync(filePath)) return null;
    return Date.now() - fs.statSync(filePath).mtimeMs;
  } catch {
    return null;
  }
}
