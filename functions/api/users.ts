import { proxyToApi } from "../_lib/proxy";

type UsersContext = {
  request: Request;
  env?: Record<string, unknown>;
};

export async function onRequest(context: UsersContext): Promise<Response> {
  return proxyToApi(context, "users");
}
