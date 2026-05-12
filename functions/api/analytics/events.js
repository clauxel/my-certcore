import { handleAnalytics } from '../../../worker/index.js'

export async function onRequest(context) {
  return handleAnalytics(context.request, context.env)
}
