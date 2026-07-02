import fs from "node:fs";
import path from "node:path";

const CACHE_DIR = path.join(process.cwd(), "data");

/**
 * On Vercel, the filesystem is read-only (except /tmp, which is ephemeral and not shared
 * across serverless invocations) -- a local JSON file written by one function invocation
 * (e.g. the daily cron) would never be visible to the invocation serving a page request.
 * Vercel Blob is real persistent storage reachable from any invocation, so it's used
 * whenever running on Vercel (gated on the platform, not merely on the token's presence,
 * since `vercel env pull` also copies BLOB_READ_WRITE_TOKEN into local .env.local for
 * preview/testing purposes -- local dev should still default to the filesystem cache
 * so it never needs cloud credentials and never accidentally writes to production Blob
 * storage from a laptop).
 */
function shouldUseBlobStorage(): boolean {
  return Boolean(process.env.VERCEL) && Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export async function readJsonCache<T>(fileName: string): Promise<T | null> {
  if (shouldUseBlobStorage()) {
    try {
      const { get } = await import("@vercel/blob");
      const result = await get(fileName, { access: "private" });
      if (!result || result.statusCode !== 200) return null;
      const text = await new Response(result.stream).text();
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  }

  try {
    const filePath = path.join(CACHE_DIR, fileName);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

/**
 * Writes the cache, never throwing -- a cache write is always a best-effort optimization,
 * never something a request should fail over. On Vercel this persists to Blob storage
 * (survives across invocations); locally it's an atomic write-then-rename to /data.
 */
export async function writeJsonCache<T>(fileName: string, data: T): Promise<void> {
  if (shouldUseBlobStorage()) {
    try {
      const { put } = await import("@vercel/blob");
      await put(fileName, JSON.stringify(data, null, 2), {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
    } catch (error) {
      console.warn(`[json-cache] تعذّرت كتابة ${fileName} إلى Vercel Blob:`, error);
    }
    return;
  }

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

export async function cacheFileAgeMs(fileName: string): Promise<number | null> {
  if (shouldUseBlobStorage()) {
    try {
      const { head } = await import("@vercel/blob");
      const result = await head(fileName);
      return Date.now() - new Date(result.uploadedAt).getTime();
    } catch {
      return null;
    }
  }

  try {
    const filePath = path.join(CACHE_DIR, fileName);
    if (!fs.existsSync(filePath)) return null;
    return Date.now() - fs.statSync(filePath).mtimeMs;
  } catch {
    return null;
  }
}
