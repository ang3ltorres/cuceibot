const DEFAULT_API_BASE_URL = "http://napydom.duckdns.org:56756";

type PagesFunctionContext = {
  request: Request;
  env?: Record<string, unknown>;
};

const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"]);

function normalizeBaseUrl(rawBaseUrl: string): string {
  return rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;
}

function getApiBaseUrl(context: PagesFunctionContext): string {
  const envBaseUrl =
    typeof context.env?.API_BASE_URL === "string"
      ? context.env.API_BASE_URL
      : undefined;

  return normalizeBaseUrl(envBaseUrl ?? DEFAULT_API_BASE_URL);
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
  const upstreamUrl = new URL(upstreamPath, getApiBaseUrl(context));
  const incomingUrl = new URL(context.request.url);

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
