import { proxyToApi } from "../_lib/proxy";

type TokenContext = {
  request: Request;
  env?: Record<string, unknown>;
};

export async function onRequest(context: TokenContext): Promise<Response> {
  return proxyToApi(context, "token");
}
