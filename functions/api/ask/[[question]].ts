export async function onRequest(context) {
  const { params, request } = context

  const question = params.question
  const apiUrl = `http://napydom.duckdns.org:56756/ask/question=${question}`

  return fetch(apiUrl, {
    method: request.method,
    headers: request.headers,
  })
}

