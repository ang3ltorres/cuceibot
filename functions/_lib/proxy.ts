const DEFAULT_API_BASE_URL = "https://api.cuceibot.com";

type PagesFunctionContext = {
  request: Request;
  env?: Record<string, unknown>;
};

const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"]);

function normalizeBaseUrl(rawBaseUrl: string): URL {
  const baseUrl = new URL(rawBaseUrl.trim());

  if (baseUrl.protocol !== "https:" && baseUrl.protocol !== "http:") {
    throw new TypeError("API base URL must use http or https");
  }

  baseUrl.pathname = baseUrl.pathname.endsWith("/")
    ? baseUrl.pathname
    : `${baseUrl.pathname}/`;

  return baseUrl;
}

function getApiBaseUrl(context: PagesFunctionContext): URL {
  const envBaseUrl =
    typeof context.env?.API_BASE_URL === "string"
      ? context.env.API_BASE_URL
      : undefined;

  if (envBaseUrl?.trim()) {
    try {
      return normalizeBaseUrl(envBaseUrl);
    } catch {
      // Fallback to the production API domain when env var is malformed.
    }
  }

  return normalizeBaseUrl(DEFAULT_API_BASE_URL);
}

function normalizeUpstreamPath(upstreamPath: string): string {
  const path = upstreamPath.trim();

  if (!path) {
    throw new TypeError("Upstream path cannot be empty");
  }

  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path)) {
    throw new TypeError("Upstream path must be relative");
  }

  return path.startsWith("/") ? path.slice(1) : path;
}

function sanitizeRequestHeaders(headers: Headers): Headers {
  const forwardedHeaders = new Headers(headers);
  forwardedHeaders.delete("host");
  forwardedHeaders.delete("content-length");
  return forwardedHeaders;
}

export async function proxyToApi(
  context: PagesFunctionContext,
  upstreamPath: string,
): Promise<Response> {
  const apiBaseUrl = getApiBaseUrl(context);
  const upstreamUrl = new URL(normalizeUpstreamPath(upstreamPath), apiBaseUrl);
  const incomingUrl = new URL(context.request.url);

  if (upstreamUrl.origin !== apiBaseUrl.origin) {
    return new Response(
      JSON.stringify({ detail: "Invalid upstream path configuration" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (incomingUrl.search) {
    upstreamUrl.search = incomingUrl.search;
  }

  const method = context.request.method.toUpperCase();

  const response = await fetch(upstreamUrl.toString(), {
    method,
    headers: sanitizeRequestHeaders(context.request.headers),
    body: METHODS_WITHOUT_BODY.has(method) ? undefined : context.request.body,
    redirect: "follow",
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}
