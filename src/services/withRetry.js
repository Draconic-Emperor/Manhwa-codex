// Wraps an async Supabase call with a small retry policy for transient
// network failures. Does NOT retry on data errors coming back from
// Postgrest (e.g. constraint violations) — only on thrown/network errors.
export async function withRetry(fn, { retries = 2, delayMs = 400 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delayMs * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

// Normalizes a Supabase {data, error} response into a plain result,
// throwing a JS Error so callers can use a single try/catch shape.
export function unwrap({ data, error }) {
  if (error) throw new Error(error.message || 'Something went wrong talking to the database.');
  return data;
}
