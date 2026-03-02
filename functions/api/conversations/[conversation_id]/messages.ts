import { proxyToApi } from "../../../_lib/proxy";

type MessagesContext = {
  params: {
    conversation_id?: string;
  };
  request: Request;
  env?: Record<string, unknown>;
};

export async function onRequest(context: MessagesContext): Promise<Response> {
  const conversationId = context.params.conversation_id?.trim();

  if (!conversationId) {
    return new Response(
      JSON.stringify({ detail: "Missing conversation_id path parameter" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  return proxyToApi(
    context,
    `conversations/${encodeURIComponent(conversationId)}/messages`,
  );
}
