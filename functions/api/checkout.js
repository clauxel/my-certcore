import { handleCheckout } from '../../worker/index.js'

export async function onRequest(context) {
  return handleCheckout(context.request, context.env, new URL(context.request.url))
}
