import { proxyToApi } from "../../_lib/proxy";

type MeContext = {
  request: Request;
  env?: Record<string, unknown>;
};

export async function onRequest(context: MeContext): Promise<Response> {
  return proxyToApi(context, "users/me");
}
