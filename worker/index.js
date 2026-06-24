import { recordAnalyticsEvents } from './analytics.js'
import { handlePolarCheckout, isPolarCheckoutConfigured } from './polar.js'
const CANONICAL_ORIGIN = 'https://certcore.space'
const CANONICAL_HOSTS = new Set(['certcore.space', 'www.certcore.space'])
const ANNUAL_DISCOUNT_MULTIPLIER = 0.5

const keywordPaths = [
  '/cyber-resilience-act-pdf',
  '/when-will-the-cyber-resilience-act-be-implemented',
  '/cyber-resilience-act-regulation',
  '/cyber-resilience-act-document',
  '/cyber-resilience-act-certification',
  '/cyber-resilience-act-wiki',
  '/cyber-resilience-act-logo',
  '/cyber-resilience-act-official-website',
]

const indexablePaths = ['/', '/pricing', ...keywordPaths, '/privacy', '/terms']
const staticAssetPaths = new Set([...indexablePaths, '/checkout/done'])
const polarProductCache = new Map()

const planCatalog = {
  starter: {
    id: 'starter',
    name: 'Starter',
    monthlyAmountCents: 14900,
    currency: 'EUR',
    summary: '1 product, CRA scope check, SBOM export, weekly CVE review, declaration draft, and compliance calendar',
  },
  studio: {
    id: 'studio',
    name: 'Studio',
    monthlyAmountCents: 39900,
    currency: 'EUR',
    summary: '5 products, SBOM API, daily CVE tracking, Article 14 workflow, audit log, and declaration generator',
  },
  publisher: {
    id: 'publisher',
    name: 'Publisher',
    monthlyAmountCents: 99900,
    currency: 'EUR',
    summary: 'unlimited products, white-label exports, enterprise support, reviewer seats, and portfolio reporting',
  },
}

export function securityHeaders(request) {
  const headers = new Headers({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  })

  const origin = request?.headers?.get?.('Origin')
  if (isAllowedCorsOrigin(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')
    headers.set('Vary', 'Origin')
  }

  return headers
}

function isAllowedCorsOrigin(origin) {
  if (!origin) return false
  try {
    const url = new URL(origin)
    if (CANONICAL_HOSTS.has(url.hostname)) return true
    if (url.hostname.endsWith('.pages.dev') || url.hostname.endsWith('.workers.dev')) return true
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return true
  } catch {}
  return false
}

function withSecurityHeaders(response, request) {
  const headers = new Headers(response.headers)
  for (const [key, value] of securityHeaders(request)) headers.set(key, value)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export function jsonResponse(data, status = 200, request = null) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  return new Response(JSON.stringify(data), { status, headers })
}

function xmlResponse(body, request) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'application/xml; charset=utf-8')
  headers.set('Cache-Control', 'public, max-age=3600')
  return new Response(body, { status: 200, headers })
}

function textResponse(body, request) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'text/plain; charset=utf-8')
  headers.set('Cache-Control', 'public, max-age=3600')
  return new Response(body, { status: 200, headers })
}

function isLocalDevRequest(request) {
  const host = request?.headers?.get?.('Host') || ''
  return !request?.cf || host.startsWith('127.0.0.1') || host.startsWith('localhost')
}

function maybeRedirectToHttps(requestUrl, request) {
  if (typeof isLocalDevRequest === 'function' && isLocalDevRequest(request)) return null
  const canonicalUrl = new URL(CANONICAL_ORIGIN)
  const isKnownHost = typeof CANONICAL_HOSTS !== 'undefined' && CANONICAL_HOSTS.has(requestUrl.hostname)
  if (isKnownHost && (requestUrl.protocol !== 'https:' || requestUrl.hostname !== canonicalUrl.hostname)) {
    const redirectUrl = new URL(requestUrl)
    redirectUrl.protocol = 'https:'
    redirectUrl.hostname = canonicalUrl.hostname
    return Response.redirect(redirectUrl.toString(), 301)
  }
  return null
}

function resolvePublicAppOrigin(requestUrl, request = null) {
  const host = request?.headers?.get?.('Host') || ''
  if (host.startsWith('127.0.0.1') || host.startsWith('localhost')) return `http://${host}`
  if (CANONICAL_HOSTS.has(requestUrl.hostname)) return `https://${requestUrl.hostname}`
  if (requestUrl.hostname.endsWith('.workers.dev') || requestUrl.hostname.endsWith('.pages.dev')) return requestUrl.origin
  return CANONICAL_ORIGIN
}

function resolvePolarBase(env) {
  const raw = String(env?.POLAR_API_BASE || '').trim()
  if (raw) return raw.replace(/\/+$/, '')
  return String(env?.POLAR_ENV || '').toLowerCase() === 'test' ? 'https://test-api.polar.sh' : 'https://api.polar.sh'
}

async function getSecretValue(value) {
  if (typeof value === 'string') return value.trim()
  if (value && typeof value.get === 'function') {
    const resolved = await value.get()
    return typeof resolved === 'string' ? resolved.trim() : ''
  }
  return ''
}

async function firstSecretEnv(env, ...keys) {
  for (const key of keys) {
    const value = await getSecretValue(env?.[key])
    if (value) return value
  }
  return ''
}

function normalizeEnvKey(value) {
  return String(value)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function formatMoney(amountCents, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
  }).format(amountCents / 100)
}

function resolveConfiguredProductId(env, planId, billing) {
  const cycle = billing === 'monthly' ? 'MONTHLY' : 'YEARLY'
  const normalizedSelection = normalizeEnvKey(`${planId}_${billing}`)
  const keys = [
    `POLAR_PRODUCT_CERTCORE_${normalizeEnvKey(planId)}_${cycle}`,
    `POLAR_PRODUCT_ID_CERTCORE_${normalizedSelection}`,
    `POLAR_PRODUCT_ID_${normalizedSelection}`,
    `POLAR_PRODUCT_ID_${normalizeEnvKey(planId)}`,
    'POLAR_PRODUCT_ID',
  ]

  for (const key of keys) {
    const value = env?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

async function requestPolarJson(apiKey, url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  const rawText = await response.text()
  let payload = null
  if (rawText) {
    try {
      payload = JSON.parse(rawText)
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    throw new Error(
      payload && typeof payload === 'object'
        ? payload.message || payload.error || payload.error_description || 'Polar request failed.'
        : 'Polar request failed.',
    )
  }

  return payload || {}
}

async function getOrCreatePolarProduct(env, apiKey, plan, billing, successUrl) {
  const configuredProductId = resolveConfiguredProductId(env, plan.id, billing)
  if (configuredProductId) return configuredProductId

  const cacheKey = `${plan.id}:${billing}`
  if (polarProductCache.has(cacheKey)) return polarProductCache.get(cacheKey)

  const effectiveMonthlyCents =
    billing === 'annual' ? Math.round(plan.monthlyAmountCents * ANNUAL_DISCOUNT_MULTIPLIER) : plan.monthlyAmountCents
  const productAmountCents = billing === 'annual' ? effectiveMonthlyCents * 12 : effectiveMonthlyCents
  const billingLabel = billing === 'annual' ? 'annual' : 'monthly'
  const billingPeriod = billing === 'annual' ? 'every-year' : 'every-month'

  const product = await requestPolarJson(apiKey, `${resolvePolarBase(env)}/v1/products`, {
    name: `CertCore ${plan.name} (${billingLabel})`,
    description: `${formatMoney(effectiveMonthlyCents, plan.currency)}/mo effective - ${plan.summary}`,
    price: productAmountCents,
    currency: plan.currency,
    billing_type: 'recurring',
    billing_period: billingPeriod,
    tax_mode: 'inclusive',
    tax_category: 'saas',
    default_success_url: successUrl,
  })

  const productId = product.id || product.product_id
  if (!productId) throw new Error('Polar did not return a product id.')

  polarProductCache.set(cacheKey, productId)
  return productId
}

function extractCheckoutUrl(payload) {
  const candidates = [payload?.checkout_url, payload?.checkoutUrl, payload?.url, payload?.checkout?.url]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim()
  }
  return ''
}

export async function handleCheckout(request, env, requestUrl = new URL(request.url)) {
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, request)

  const apiKey = await firstSecretEnv(env, 'API_PROD_KEY', 'CREAM_PAY_KEY', 'POLAR_API_KEY', 'POLAR_KEY')
  if (!apiKey) return jsonResponse({ ok: false, error: 'Payment is not configured yet.' }, 503, request)

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, request)
  }

  const planId = typeof body?.planId === 'string' ? body.planId : 'studio'
  const billing = body?.billing === 'monthly' ? 'monthly' : 'annual'
  const plan = planCatalog[planId] || planCatalog.studio
  const successUrl = `${resolvePublicAppOrigin(requestUrl, request)}/checkout/done/`

  try {
    const productId = await getOrCreatePolarProduct(env, apiKey, plan, billing, successUrl)
    const checkout = await requestPolarJson(apiKey, `${resolvePolarBase(env)}/v1/checkouts`, {
      product_id: productId,
      units: 1,
      success_url: successUrl,
      request_id: `certcore_${plan.id}_${billing}_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      metadata: {
        site: 'certcore.space',
        product: 'certcore',
        planId: plan.id,
        billing,
        annualDiscount: billing === 'annual' ? '50%' : '0%',
      },
    })
    const checkoutUrl = extractCheckoutUrl(checkout)
    if (!checkoutUrl) throw new Error('Polar did not return a checkout URL.')
    return jsonResponse({ ok: true, checkoutUrl, provider: 'polar', planId: plan.id, billing, returnUrl: successUrl }, 200, request)
  } catch (error) {
    console.log(JSON.stringify({ type: 'checkout_error', site: 'certcore.space', message: String(error?.message || error) }))
    return jsonResponse({ ok: false, error: 'Secure checkout could not be created yet.' }, 502, request)
  }
}

export async function handleRuntime(request, env, requestUrl = new URL(request.url)) {
  return jsonResponse(
    {
      ok: true,
      publicAppOrigin: resolvePublicAppOrigin(requestUrl, request),
      deployment: 'cloudflare-workers-assets',
      paymentProvider: 'polar',
      defaultPlan: 'studio',
      defaultBilling: 'annual',
      annualDiscount: '50%',
      analytics: 'cloudflare-d1',
      ts: Date.now(),
    },
    200,
    request,
  )
}

function sanitizeAnalyticsEvent(event) {
  if (!event || typeof event !== 'object') return null
  const name = String(event.name || '').replace(/[^\w .:/?=&@+-]/g, '').slice(0, 80)
  const id = String(event.id || '').replace(/[^\w-]/g, '').slice(0, 100)
  if (!name || !id) return null
  return {
    id,
    name,
    path: String(event.path || '/').replace(/[^\w .:/?=&@%+-]/g, '').slice(0, 240),
    occurredAt: String(event.occurredAt || new Date().toISOString()).slice(0, 40),
    visitorId: String(event.visitorId || '').replace(/[^\w-]/g, '').slice(0, 100),
    sessionId: String(event.sessionId || '').replace(/[^\w-]/g, '').slice(0, 100),
    referrerHost: event.referrerHost ? String(event.referrerHost).slice(0, 120) : null,
    utmSource: event.utmSource ? String(event.utmSource).slice(0, 120) : null,
    utmMedium: event.utmMedium ? String(event.utmMedium).slice(0, 120) : null,
    utmCampaign: event.utmCampaign ? String(event.utmCampaign).slice(0, 120) : null,
    metadata: event.metadata && typeof event.metadata === 'object' ? event.metadata : {},
  }
}

export async function handleAnalytics(request, env) {
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405, request)

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body.' }, 400, request)
  }

  const events = Array.isArray(body?.events) ? body.events.slice(0, 40).map(sanitizeAnalyticsEvent).filter(Boolean) : []
  const receivedAt = new Date().toISOString()
  let persisted = false

  try {
    const result = await recordAnalyticsEvents(env, events, {
      siteKey: 'certcore',
      requestUrl: new URL(request.url),
    })
    persisted = result.persisted
  } catch (error) {
    console.log(JSON.stringify({ type: 'analytics_store_error', site: 'certcore.space', message: String(error?.message || error) }))
  }

  console.log(JSON.stringify({ type: 'analytics', site: 'certcore.space', accepted: events.length, persisted }))
  return jsonResponse({ ok: true, accepted: events.length, persisted, store: persisted ? 'd1' : 'console' }, 202, request)
}

export function buildSitemapXml() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = indexablePaths
    .map((path) => {
      const priority = path === '/' ? '1.0' : path === '/pricing' ? '0.9' : path === '/privacy' || path === '/terms' ? '0.35' : '0.78'
      const changefreq = path === '/' || path === '/pricing' ? 'weekly' : 'monthly'
      const locPath = path === '/' ? '/' : `${path}/`
      return `  <url>
    <loc>${CANONICAL_ORIGIN}${locPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export function handleSitemap(request) {
  return xmlResponse(buildSitemapXml(), request)
}

export function buildRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /checkout/done/
Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml
`
}

export function handleRobots(request) {
  return textResponse(buildRobotsTxt(), request)
}

function noIndexNotFoundResponse(request) {
  const headers = securityHeaders(request)
  headers.set('Content-Type', 'text/html; charset=utf-8')
  headers.set('Cache-Control', 'no-store')
  headers.set('X-Robots-Tag', 'noindex, nofollow')
  return new Response('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Page not found</title></head><body><main><h1>Page not found</h1><p>This URL is not a public page for this product.</p></main></body></html>', { status: 404, headers })
}

async function fetchAsset(request, env) {
  if (!env?.SITE_ASSETS?.fetch) {
    return new Response('Cloudflare asset binding is unavailable.', {
      status: 500,
      headers: securityHeaders(request),
    })
  }

  const requestUrl = new URL(request.url)
  const normalizedPath = requestUrl.pathname.replace(/\/+$/, '') || '/'

  if (!staticAssetPaths.has(normalizedPath) && !/\.[a-z0-9]+$/i.test(normalizedPath)) return noIndexNotFoundResponse(request)

  if (staticAssetPaths.has(normalizedPath)) {
    const assetUrl = new URL(request.url)
    assetUrl.pathname = normalizedPath === '/' ? '/' : `${normalizedPath}/`
    const assetResponse = await env.SITE_ASSETS.fetch(new Request(assetUrl.toString(), request))
    if (assetResponse.status !== 404) return withSecurityHeaders(assetResponse, request)
  }

  const response = await env.SITE_ASSETS.fetch(request)
  return withSecurityHeaders(response, request)
}

function handleOptions(request) {
  return new Response(null, { status: 204, headers: securityHeaders(request) })
}

export async function handleRequest(request, env) {
  const requestUrl = new URL(request.url)

  if (request.method === 'OPTIONS') return handleOptions(request)
  if (requestUrl.pathname === '/api/polar-checkout') {
    return handlePolarCheckout(request, env, {
      plans: planCatalog,
      defaultPlanId: 'studio',
      siteName: 'certcore',
      siteKey: 'certcore',
      annualDiscountMultiplier: typeof ANNUAL_DISCOUNT_MULTIPLIER !== 'undefined'
        ? ANNUAL_DISCOUNT_MULTIPLIER
        : (typeof annualBillingMultiplier !== 'undefined' ? annualBillingMultiplier : 0.5),
    })
  }

  if (requestUrl.pathname === '/api/runtime') return handleRuntime(request, env, requestUrl)
  if (requestUrl.pathname === '/api/checkout') return handleCheckout(request, env, requestUrl)
  if (requestUrl.pathname === '/api/analytics/events') return handleAnalytics(request, env)

  const httpsRedirect = maybeRedirectToHttps(requestUrl, request)
  if (httpsRedirect) return httpsRedirect

  if (requestUrl.pathname === '/sitemap.xml') return handleSitemap(request)
  if (requestUrl.pathname === '/robots.txt') return handleRobots(request)

  return fetchAsset(request, env)
}

const worker = {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env)
    } catch (error) {
      console.log(JSON.stringify({ type: 'worker_error', site: 'certcore.space', message: String(error?.message || error) }))
      return jsonResponse({ ok: false, error: 'Internal server error.' }, 500, request)
    }
  },
}

export default worker
