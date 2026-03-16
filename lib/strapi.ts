/**
 * Strapi REST API client for the school website.
 * Uses server-side fetch with optional API token auth.
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export function getStrapiURL(path = ""): string {
  return `${STRAPI_URL}${path}`;
}

export function getStrapiMedia(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return getStrapiURL(url);
}

export async function fetchStrapi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getStrapiURL(`/api${path}`);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const isDev = process.env.NODE_ENV === "development"

  const response = await fetch(url, {
    ...options,
    headers,
    next: { revalidate: isDev ? 0 : 60 }, // No cache in dev, 60s ISR in prod
  })


  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `Strapi API error [${response.status}] at ${path}: ${error}`
    );
  }

  return response.json() as Promise<T>;
}
