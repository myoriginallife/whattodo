export function getSiteUrl(): string {
  if (typeof window === "undefined") return "";

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${window.location.origin}${basePath}`;
}
