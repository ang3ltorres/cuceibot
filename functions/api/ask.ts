import { proxyToApi } from "../_lib/proxy";

type AskContext = {
  request: Request;
  env?: Record<string, unknown>;
};

export async function onRequest(context: AskContext): Promise<Response> {
  return proxyToApi(context, "ask");
}