import { proxyToApi } from "../_lib/proxy";

type ConversationsContext = {
  request: Request;
  env?: Record<string, unknown>;
};

export async function onRequest(context: ConversationsContext): Promise<Response> {
  return proxyToApi(context, "conversations");
}
