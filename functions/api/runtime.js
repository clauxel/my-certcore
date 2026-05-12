import { handleRuntime } from '../../worker/index.js'

export async function onRequest(context) {
  return handleRuntime(context.request, new URL(context.request.url))
}
