/** Simple fetcher for SWR-based admin forms. */
export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export async function apiRequest<T = unknown>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE',
  body?: unknown
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}
