import { mkdir, copyFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outDir = path.join(root, 'out')
const assetsDir = path.join(outDir, 'assets')
const site = {
  name: 'CertCore',
  domain: 'certcore.space',
  origin: 'https://certcore.space',
  supportEmail: 'support@aigeamy.com',
  description:
    'CertCore helps software and firmware teams prepare for the Cyber Resilience Act with scope classification, SBOM generation, CVE monitoring, Article 14 reporting, EU Declaration of Conformity drafts, and compliance calendars.',
}

const keywordPages = [
  {
    slug: 'cyber-resilience-act-pdf',
    title: 'Cyber Resilience Act PDF: Official Text and Working Checklist',
    description:
      'Find the official Cyber Resilience Act PDF, then convert the regulation into a practical SBOM, vulnerability, declaration, and reporting checklist.',
    h1: 'Cyber Resilience Act PDF',
    kicker: 'Official text, practical workflow',
    intro:
      'Teams usually search for a Cyber Resilience Act PDF when they need the legally reliable source, not another summary. The official regulation text is the starting point; the real work is turning it into product evidence, SBOM records, vulnerability handling steps, and release gates.',
    useful: [
      'Use the PDF to confirm definitions, product categories, essential cybersecurity requirements, conformity routes, and reporting obligations.',
      'Create a traceable checklist from the official articles and annexes before you assign engineering work.',
      'Keep the PDF linked from your product compliance file so auditors can see which regulation version your evidence maps to.',
    ],
    action:
      'CertCore turns the PDF into a product checklist: scope, risk category, SBOM format, CVE queue, Article 14 timeline, declaration draft, and re-assessment calendar.',
    faq: [
      ['Where is the official Cyber Resilience Act PDF?', 'Use EUR-Lex for the regulation text and PDF. The official document is Regulation (EU) 2024/2847.'],
      ['Is the PDF enough for compliance?', 'No. The PDF explains obligations, but teams still need product evidence, vulnerability processes, SBOM records, and declaration files.'],
      ['Can CertCore replace legal advice?', 'No. CertCore organizes technical compliance evidence and workflow artifacts for review; legal interpretation remains your responsibility.'],
    ],
    links: [
      ['EUR-Lex official regulation', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202402847'],
      ['European Commission CRA overview', 'https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act'],
    ],
  },
  {
    slug: 'when-will-the-cyber-resilience-act-be-implemented',
    title: 'When Will the Cyber Resilience Act Be Implemented?',
    description:
      'A practical Cyber Resilience Act implementation timeline for software and firmware teams selling digital products into the EU.',
    h1: 'When will the Cyber Resilience Act be implemented?',
    kicker: 'Dates that affect release planning',
    intro:
      'The Cyber Resilience Act is already law. The important question for product teams is when each operational obligation becomes real in release planning, vulnerability handling, and market access.',
    useful: [
      'The regulation entered into force in December 2024.',
      'The vulnerability reporting duties are expected to apply from 11 September 2026.',
      'The main obligations for products with digital elements are expected to apply from 11 December 2027.',
      'If you sell software, firmware, connected devices, or managed digital products into the EU, the practical preparation window is shorter than it looks because SBOM, CVE response, secure update, and declaration evidence must be built into normal release operations.',
    ],
    action:
      'CertCore creates a live calendar for version updates, SBOM refreshes, CVE triage, Article 14 reporting milestones, declaration review, and audit evidence checkpoints.',
    faq: [
      ['What is the practical deadline?', 'For most product obligations, plan around 11 December 2027. Reporting processes should be ready earlier, around 11 September 2026.'],
      ['Should US companies care?', 'Yes, if they place covered software or connected products on the EU market, directly or through customers, distributors, or partners.'],
      ['What should we do first?', 'Classify products, generate SBOMs, map dependencies to CVEs, and define the reporting workflow before the deadlines become release blockers.'],
    ],
    links: [
      ['European Commission CRA overview', 'https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act'],
      ['EUR-Lex official regulation', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202402847'],
    ],
  },
  {
    slug: 'cyber-resilience-act-regulation',
    title: 'Cyber Resilience Act Regulation: What Product Teams Need',
    description:
      'Understand the Cyber Resilience Act regulation through product scope, risk categories, SBOM duties, vulnerability handling, and declaration evidence.',
    h1: 'Cyber Resilience Act regulation',
    kicker: 'From legal text to product controls',
    intro:
      'The Cyber Resilience Act regulation sets cybersecurity requirements for products with digital elements sold in the EU. For software teams, the regulation becomes a repeatable operating model: classify the product, document secure development, maintain SBOM evidence, monitor vulnerabilities, and prepare conformity documentation.',
    useful: [
      'Scope: software, firmware, connected hardware, and digital components may be covered when placed on the EU market.',
      'Risk category: many products fall into a default category, while important and critical products require closer assessment and sometimes third-party involvement.',
      'Evidence: SBOM, vulnerability handling, secure update policies, technical documentation, and declaration records need to be versioned.',
      'Operations: vulnerability reporting and corrective actions must be tracked with time windows, accountable owners, and proof of follow-through.',
    ],
    action:
      'CertCore gives product, security, and compliance teams a shared regulation workspace instead of scattered spreadsheets and last-minute PDF drafts.',
    faq: [
      ['What is Regulation (EU) 2024/2847?', 'It is the EU Cyber Resilience Act, a horizontal cybersecurity regulation for products with digital elements.'],
      ['Does it apply only to hardware?', 'No. Software and firmware can be products with digital elements, depending on how they are placed on the market.'],
      ['What is the fastest first check?', 'Decide whether the product is placed on the EU market, whether it is a product with digital elements, and whether it matches an important or critical category.'],
    ],
    links: [
      ['EUR-Lex regulation text', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202402847'],
      ['European Commission CRA Q&A and policy page', 'https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act'],
    ],
  },
  {
    slug: 'cyber-resilience-act-document',
    title: 'Cyber Resilience Act Document Pack for Software Products',
    description:
      'Build a useful Cyber Resilience Act document pack: scope memo, SBOM, CVE review, vulnerability notification template, technical file, and EU Declaration of Conformity.',
    h1: 'Cyber Resilience Act document',
    kicker: 'What to keep in the product file',
    intro:
      'A useful Cyber Resilience Act document is not one file. It is a living product pack that connects product classification, engineering evidence, vulnerability handling, and conformity statements.',
    useful: [
      'Scope memo: why the product is in or out of scope, target market, deployment model, and product category.',
      'SBOM: SPDX or CycloneDX output with component names, versions, suppliers, licenses, and dependency relationships.',
      'Vulnerability record: CVE matches, severity, exploitability notes, remediation decision, and release reference.',
      'Article 14 templates: notification records with timestamps, impact summary, mitigation state, and follow-up owner.',
      'Declaration draft: EU Declaration of Conformity fields, product identification, manufacturer details, standards references, and sign-off trail.',
    ],
    action:
      'CertCore generates these documents as connected artifacts so a version update can trigger re-checks instead of creating a fresh compliance scramble.',
    faq: [
      ['Is one CRA document enough?', 'Usually no. Treat the document as a product evidence pack that changes when the product or dependency graph changes.'],
      ['Which SBOM formats should we keep?', 'SPDX and CycloneDX are the most common machine-readable formats for software dependency evidence.'],
      ['When should documents be refreshed?', 'At release, after dependency changes, after material vulnerabilities, and before conformity review.'],
    ],
    links: [
      ['CycloneDX standard', 'https://cyclonedx.org/'],
      ['SPDX specification', 'https://spdx.dev/'],
    ],
  },
  {
    slug: 'cyber-resilience-act-certification',
    title: 'Cyber Resilience Act Certification: What It Really Means',
    description:
      'Cyber Resilience Act certification is not a single badge. Learn the practical routes for conformity evidence, CE marking, third-party assessment, and declaration drafting.',
    h1: 'Cyber Resilience Act certification',
    kicker: 'Conformity, evidence, and review routes',
    intro:
      'Many teams ask for Cyber Resilience Act certification, but the practical path depends on product category and risk. For some products, internal control and self-assessment may be possible. For important or critical categories, additional conformity assessment steps may apply.',
    useful: [
      'Start with product classification. Certification language is not useful until you know the product category.',
      'Build technical documentation early: security requirements, architecture, SBOM, vulnerability handling, update policy, and test evidence.',
      'Map the conformity route before launch. Important and critical products may need more formal assessment steps.',
      'Prepare an EU Declaration of Conformity draft, but keep it tied to current product version and evidence.',
    ],
    action:
      'CertCore helps teams decide what route they appear to be on, collect evidence, and export a review-ready conformity pack for legal, audit, or notified-body conversations.',
    faq: [
      ['Is there a single CRA certificate?', 'Not generally. The obligation is about conformity with the regulation, supported by the right assessment route and evidence.'],
      ['Can CertCore issue certification?', 'No. CertCore is software for readiness evidence and workflow management; it does not act as a notified body or legal authority.'],
      ['What plan should a publisher choose?', 'The Studio plan fits most teams managing several software products and needing SBOM API access.'],
    ],
    links: [
      ['European Commission CRA overview', 'https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act'],
      ['EUR-Lex regulation text', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202402847'],
    ],
  },
  {
    slug: 'cyber-resilience-act-wiki',
    title: 'Cyber Resilience Act Wiki for Product and Security Teams',
    description:
      'A practical Cyber Resilience Act wiki-style overview covering scope, dates, SBOM, vulnerability reporting, conformity, and product evidence.',
    h1: 'Cyber Resilience Act wiki',
    kicker: 'Plain-English operating reference',
    intro:
      'This wiki-style page gives product, security, and engineering teams a practical operating reference for the Cyber Resilience Act. It is not a substitute for the official regulation, but it helps teams decide what to read and what evidence to prepare.',
    useful: [
      'Product with digital elements: software or hardware product with digital functionality, including components that can affect cybersecurity.',
      'Manufacturer: the party placing the product on the EU market under its name or trademark.',
      'SBOM: a machine-readable software bill of materials that helps track dependencies and vulnerabilities.',
      'CVE tracking: continuous monitoring of known vulnerabilities affecting components in the SBOM.',
      'Article 14: vulnerability reporting workflow with strict notification timing and evidence requirements.',
      'EU Declaration of Conformity: a formal declaration that the product meets applicable requirements.',
    ],
    action:
      'CertCore turns these wiki terms into live workflow states: in scope, category, SBOM complete, CVEs triaged, report clock open, declaration ready, and calendar clean.',
    faq: [
      ['Is this the official wiki?', 'No. It is a practical reference page. Use the official EUR-Lex text and Commission pages for authoritative material.'],
      ['Who should own CRA readiness?', 'Usually product security, engineering, product management, and legal need a shared process.'],
      ['What is the easiest evidence win?', 'Generate an SBOM and connect it to vulnerability tracking for each releasable product version.'],
    ],
    links: [
      ['EUR-Lex official regulation', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202402847'],
      ['European Commission CRA overview', 'https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act'],
    ],
  },
  {
    slug: 'cyber-resilience-act-logo',
    title: 'Cyber Resilience Act Logo: What You Can Safely Use',
    description:
      'Guidance for teams looking for a Cyber Resilience Act logo, including safe use of official marks, CE marking context, and product compliance branding.',
    h1: 'Cyber Resilience Act logo',
    kicker: 'Avoid risky compliance branding',
    intro:
      'Teams often search for a Cyber Resilience Act logo when preparing decks, product pages, or compliance packs. Be careful: official EU marks, CE marking, and certification-style graphics should not be used in a way that implies approval you do not have.',
    useful: [
      'Do not invent a CRA certification badge for public marketing unless your legal team has approved exactly what it means.',
      'Use neutral labels such as CRA readiness, CRA evidence pack, or Cyber Resilience Act workflow when describing internal preparation.',
      'Keep official source links in your documentation instead of copying government marks into product UI.',
      'Use CE marking only when the product and conformity route support it; do not treat it as a decorative logo.',
    ],
    action:
      'CertCore uses neutral compliance language and exports evidence files. It does not encourage unofficial badges or misleading public claims.',
    faq: [
      ['Is there an official Cyber Resilience Act logo?', 'The regulation itself is not a marketing logo. Use official EU sources for references and avoid implying endorsement.'],
      ['Can I put CRA compliant on my homepage?', 'Only after a careful legal and conformity review. Readiness tooling should not become an unsupported market claim.'],
      ['What should I put in documents instead?', 'Use product version, evidence date, regulation reference, conformity route, and responsible sign-off fields.'],
    ],
    links: [
      ['European Commission CRA overview', 'https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act'],
      ['EUR-Lex regulation text', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202402847'],
    ],
  },
  {
    slug: 'cyber-resilience-act-official-website',
    title: 'Cyber Resilience Act Official Website and Source Links',
    description:
      'Use the Cyber Resilience Act official website and EUR-Lex source links, then map the official material into product compliance work.',
    h1: 'Cyber Resilience Act Official website',
    kicker: 'Official sources, then practical execution',
    intro:
      'For authoritative Cyber Resilience Act information, use official European Commission and EUR-Lex sources. For product delivery, translate those sources into evidence that engineering and security teams can keep current.',
    useful: [
      'Use the European Commission page for policy context, summaries, and implementation updates.',
      'Use EUR-Lex for the official regulation text and versioned legal reference.',
      'Record the source links and access date in your compliance pack.',
      'Convert official obligations into product-specific controls rather than relying on generic checklists.',
    ],
    action:
      'CertCore keeps official-source references next to scope decisions, SBOM output, CVE findings, Article 14 templates, and declaration drafts.',
    faq: [
      ['What is the official website?', 'The European Commission digital strategy page is the practical policy entry point, while EUR-Lex is the official legal text source.'],
      ['Should I cite blogs?', 'Blogs can help interpretation, but compliance evidence should point back to official sources and product records.'],
      ['How many site records should I create in webmaster tools?', 'One canonical property is enough for most new domains. CertCore uses the apex domain as canonical.'],
    ],
    links: [
      ['European Commission Cyber Resilience Act page', 'https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act'],
      ['EUR-Lex Regulation (EU) 2024/2847', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202402847'],
    ],
  },
]

const allPaths = [
  '/',
  '/pricing',
  ...keywordPages.map((page) => `/${page.slug}`),
  '/privacy',
  '/terms',
  '/checkout/done',
]

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function canonical(pathname) {
  const clean = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`
  return `${site.origin}${clean}`
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`
}

function header() {
  return `<header class="site-header" data-analytics-section="header">
    <a class="brand" href="/" aria-label="CertCore home">
      <span class="brand-mark">C</span>
      <span>${site.name}</span>
    </a>
    <nav aria-label="Primary navigation">
      <a href="/#scope">Scope</a>
      <a href="/#sbom">SBOM</a>
      <a href="/#article-14">Article 14</a>
      <a href="/pricing/">Pricing</a>
    </nav>
    <button class="icon-button" type="button" data-open-plan="studio" data-billing="annual" data-source="header" aria-label="Open pricing checkout">
      <span>Checkout</span>
    </button>
  </header>`
}

function footer() {
  const pageLinks = keywordPages
    .map((page) => `<a href="/${page.slug}/">${escapeHtml(page.h1)}</a>`)
    .join('')

  return `<footer class="site-footer" data-analytics-section="footer">
    <div class="footer-grid">
      <div>
        <a class="brand footer-brand" href="/">
          <span class="brand-mark">C</span>
          <span>${site.name}</span>
        </a>
        <p>Cyber Resilience Act readiness for software and firmware teams selling into the EU.</p>
        <p class="muted">Service regions: Europe and United States teams that sell or supply software to the EU market.</p>
        <p class="muted">Support: <a href="mailto:${site.supportEmail}">${site.supportEmail}</a></p>
      </div>
      <div>
        <h2>Product</h2>
        <a href="/#scope">Scope checker</a>
        <a href="/#sbom">SBOM generator</a>
        <a href="/#article-14">72-hour reporting</a>
        <a href="/pricing/">Pricing</a>
      </div>
      <div>
        <h2>CRA resources</h2>
        <div class="footer-link-stack">${pageLinks}</div>
      </div>
      <div>
        <h2>Legal</h2>
        <a href="/privacy/">Privacy</a>
        <a href="/terms/">Terms</a>
        <a href="/sitemap.xml">Sitemap</a>
        <button class="footer-checkout" type="button" data-open-plan="studio" data-billing="annual" data-source="footer">Choose Studio annual</button>
      </div>
    </div>
  </footer>`
}

function checkoutModal() {
  return `<div class="checkout-overlay" data-checkout-overlay hidden>
    <div class="plan-dialog" role="dialog" aria-modal="true" aria-labelledby="plan-dialog-title">
      <button class="dialog-close" type="button" data-close-checkout aria-label="Close checkout dialog">x</button>
      <div class="dialog-grid">
        <section class="dialog-panel" data-plan-step="plans">
          <p class="eyebrow">Recommended setup</p>
          <h2 id="plan-dialog-title">Choose your CRA workspace</h2>
          <p class="dialog-copy">Studio annual is selected because most teams have several products, need SBOM API access, and want the 50% annual discount before procurement asks.</p>
          <div class="billing-toggle" role="group" aria-label="Billing cycle">
            <button type="button" data-billing-option="annual" class="is-active">Annual - 50% off</button>
            <button type="button" data-billing-option="monthly">Monthly</button>
          </div>
          <div class="modal-plans">
            <button type="button" data-modal-plan="starter">
              <strong>Starter</strong>
              <span>1 product</span>
              <em data-plan-price="starter"></em>
            </button>
            <button type="button" data-modal-plan="studio" class="is-selected">
              <strong>Studio</strong>
              <span>5 products + SBOM API</span>
              <em data-plan-price="studio"></em>
            </button>
            <button type="button" data-modal-plan="publisher">
              <strong>Publisher</strong>
              <span>Unlimited + white label</span>
              <em data-plan-price="publisher"></em>
            </button>
          </div>
          <div class="selected-summary">
            <span data-selected-plan>Studio annual</span>
            <strong data-selected-price></strong>
            <small data-selected-note></small>
          </div>
          <button class="primary-action full" type="button" data-start-checkout>Checkout with Creem</button>
        </section>
        <section class="dialog-panel payment-panel" data-plan-step="payment" hidden>
          <p class="eyebrow">Secure payment</p>
          <h2>Creem checkout opens in a centered window</h2>
          <p data-payment-status>Preparing checkout.</p>
          <div class="payment-facts">
            <span data-payment-plan>Studio annual</span>
            <span data-payment-billing>Annual - 50% off</span>
            <span>Original page stays open</span>
          </div>
          <a class="primary-action full" href="#" target="certcore_creem_checkout" rel="noopener" data-reopen-checkout hidden>Reopen checkout</a>
          <button class="secondary-action full" type="button" data-back-to-plans>Back to plans</button>
        </section>
        <aside class="dialog-aside">
          <span class="status-chip">CRA readiness pack</span>
          <ul>
            <li>Scope and risk category memo</li>
            <li>SPDX and CycloneDX SBOM export</li>
            <li>CVE queue sorted by severity</li>
            <li>Article 14 notification template</li>
            <li>EU Declaration of Conformity draft</li>
          </ul>
        </aside>
      </div>
    </div>
  </div>`
}

function layout({ title, description, pathname = '/', body, schema = [] }) {
  const pageUrl = canonical(pathname)
  const schemaTags = schema.map(jsonLd).join('\n')
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${pageUrl}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:image" content="${site.origin}/assets/certcore-hero-cra-command-center.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preload" as="image" href="/assets/certcore-hero-cra-command-center.png" fetchpriority="high">
  <link rel="stylesheet" href="/assets/main.css">
  ${schemaTags}
</head>
<body>
  ${header()}
  ${body}
  ${footer()}
  ${checkoutModal()}
  <script src="/assets/app.js" defer></script>
  <script src="/assets/analytics.js" defer></script>
</body>
</html>`
}

function pricingCards() {
  const plans = [
    ['starter', 'Starter', '1 product', 'Scope check, one SBOM, weekly CVE refresh, declaration draft, basic calendar.'],
    ['studio', 'Studio', '5 products + SBOM API', 'Multi-product CRA workspace, SBOM API, daily CVE monitor, Article 14 workflow, audit log.'],
    ['publisher', 'Publisher', 'Unlimited + white label', 'Unlimited products, white-label exports, enterprise support, reviewer seats, portfolio reporting.'],
  ]
  return `<section class="section pricing-section" id="pricing" data-analytics-section="pricing">
    <div class="section-heading">
      <p class="eyebrow">Pricing</p>
      <h2>Choose the CRA workflow before the deadline chooses your roadmap.</h2>
      <p>Annual billing is selected by default and is 50% cheaper than monthly. Studio is recommended for teams managing several products or needing SBOM API access.</p>
    </div>
    <div class="billing-toggle pricing-toggle" role="group" aria-label="Billing cycle">
      <button type="button" data-billing-option="annual" class="is-active">Annual - 50% off</button>
      <button type="button" data-billing-option="monthly">Monthly</button>
    </div>
    <div class="pricing-grid">
      ${plans
        .map(
          ([id, name, subtitle, copy]) => `<article class="price-card ${id === 'studio' ? 'is-featured' : ''}" data-pricing-card="${id}">
        ${id === 'studio' ? '<span class="recommended">Default choice</span>' : ''}
        <h3>${name}</h3>
        <p>${subtitle}</p>
        <div class="price-line">
          <span data-plan-price="${id}"></span>
          <small data-plan-period="${id}"></small>
        </div>
        <p class="price-note" data-plan-note="${id}"></p>
        <p>${copy}</p>
        <button class="${id === 'studio' ? 'primary-action' : 'secondary-action'}" type="button" data-open-plan="${id}" data-billing="annual" data-source="pricing_${id}">Checkout ${name} annual</button>
      </article>`,
        )
        .join('')}
    </div>
  </section>`
}

function homeBody() {
  const resourceLinks = keywordPages
    .map((page) => `<a href="/${page.slug}/">${escapeHtml(page.h1)}<span>${escapeHtml(page.description)}</span></a>`)
    .join('')

  return `<main>
    <section class="hero" data-analytics-section="hero">
      <div class="hero-bg" role="img" aria-label="Cyber Resilience Act compliance command center"></div>
      <div class="hero-shade"></div>
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">Cyber Resilience Act compliance SaaS</p>
          <h1>CertCore</h1>
          <p class="hero-lede">EU CRA makes every shipped dependency part of your compliance file. Run product scope, SBOM, CVE triage, Article 14 reporting, and EU Declaration of Conformity drafts in one focused workflow.</p>
          <div class="hero-actions">
            <button class="primary-action" type="button" data-open-plan="studio" data-billing="annual" data-source="hero_primary">Choose Studio annual</button>
            <a class="secondary-action" href="#scope" data-analytics-cta="true">Run scope check</a>
          </div>
          <div class="proof-row">
            <span>Regulation (EU) 2024/2847</span>
            <span>Reporting readiness: 11 Sep 2026</span>
            <span>Main obligations: 11 Dec 2027</span>
          </div>
        </div>
        <form class="hero-tool" id="scope-tool" aria-label="Cyber Resilience Act scope checker">
          <div class="tool-header">
            <p class="eyebrow">30-minute readiness pass</p>
            <strong data-scope-result>Likely in scope</strong>
          </div>
          <label>Product type
            <select name="productType">
              <option value="saas">Hosted software sold to EU customers</option>
              <option value="desktop">Desktop or mobile application</option>
              <option value="firmware">Firmware or connected device software</option>
              <option value="opensource">Open-source component</option>
            </select>
          </label>
          <label>EU market exposure
            <select name="market">
              <option value="eu">Sold, licensed, or supplied into the EU</option>
              <option value="partner">Used by partners or distributors in the EU</option>
              <option value="none">No EU placement planned</option>
            </select>
          </label>
          <label>Connectivity
            <select name="connectivity">
              <option value="networked">Networked, cloud-connected, or updateable</option>
              <option value="local">Local only, no remote update channel</option>
            </select>
          </label>
          <label>Category signal
            <select name="category">
              <option value="default">General software product</option>
              <option value="important">Identity, security, backup, browser, password, or critical management function</option>
              <option value="critical">Critical dependency or high-impact infrastructure component</option>
            </select>
          </label>
          <div class="tool-output">
            <span data-scope-class>Default product with digital elements</span>
            <small data-scope-next>Generate SBOM, map CVEs, and keep the declaration file tied to release version.</small>
          </div>
        </form>
      </div>
    </section>

    <section class="section workbench" id="scope" data-analytics-section="scope">
      <div class="section-heading">
        <p class="eyebrow">Product compliance scope</p>
        <h2>Know whether the CRA hits this release before it hits the roadmap.</h2>
        <p>The first mistake is treating CRA as a legal memo. CertCore starts with product facts: what you ship, where it is sold, how it updates, and whether it matches a risk category.</p>
      </div>
      <div class="feature-grid">
        <article><strong>Scope classifier</strong><span>Product with digital elements, EU market placement, open-source status, and category signal.</span></article>
        <article><strong>Risk routing</strong><span>Default, important, or critical workflow hints with evidence requirements.</span></article>
        <article><strong>Version trigger</strong><span>Release updates reopen SBOM, CVE, declaration, and calendar checks automatically.</span></article>
      </div>
    </section>

    <section class="section sbom-lab" id="sbom" data-analytics-section="sbom">
      <div class="lab-layout">
        <div>
          <p class="eyebrow">SBOM + CVE panel</p>
          <h2>Paste dependencies. Get a usable SBOM preview and a ranked vulnerability queue.</h2>
          <p>Use this sample to see the workflow shape. In production, CertCore accepts repository scans and uploaded dependency manifests, then exports SPDX or CycloneDX.</p>
          <textarea id="dependency-input" spellcheck="false">openssl 1.1.1
log4j-core 2.14.1
zlib 1.2.11
react 19.2.4
supabase-js 2.48.1</textarea>
          <div class="inline-actions">
            <button class="primary-action" type="button" id="generate-sbom">Generate SBOM preview</button>
            <button class="secondary-action" type="button" data-open-plan="studio" data-billing="annual" data-source="sbom_lab">Use SBOM API</button>
          </div>
        </div>
        <div class="result-stack">
          <pre id="sbom-output" aria-live="polite"></pre>
          <div class="vuln-panel">
            <div class="panel-title"><strong>CVE queue</strong><span>Sorted by severity</span></div>
            <div id="vuln-output"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section timeline" id="article-14" data-analytics-section="article_14">
      <div class="section-heading">
        <p class="eyebrow">Article 14 workflow</p>
        <h2>Do not improvise a vulnerability report with the clock running.</h2>
        <p>CertCore keeps incident timing, impact, mitigation, and follow-up state visible so the 24-hour and 72-hour steps do not live in chat threads.</p>
      </div>
      <div class="timeline-grid">
        <article><span>0-24h</span><strong>Early warning</strong><p>Open issue, affected product, exploitability signal, mitigation owner, and first notification draft.</p></article>
        <article><span>72h</span><strong>Vulnerability notification</strong><p>Structured Article 14 template with component, CVE, impact, status, and customer-facing action.</p></article>
        <article><span>After fix</span><strong>Final evidence</strong><p>Patch version, SBOM refresh, release note, declaration impact check, and audit log closure.</p></article>
      </div>
    </section>

    <section class="section doc-generator" data-analytics-section="declaration">
      <div>
        <p class="eyebrow">EU Declaration of Conformity</p>
        <h2>Draft the declaration from product facts, not a blank document.</h2>
        <p>Enter a product name and category to preview the declaration fields your team should keep current.</p>
      </div>
      <form id="doc-form" class="doc-form">
        <label>Product name <input name="product" value="CertCore Agent SDK"></label>
        <label>Category <input name="category" value="Networked software product"></label>
        <label>Manufacturer <input name="manufacturer" value="Example Software Ltd."></label>
        <button class="secondary-action" type="button" id="generate-doc">Generate draft fields</button>
      </form>
      <pre id="doc-output"></pre>
    </section>

    <section class="section calendar-section" data-analytics-section="calendar">
      <div class="section-heading">
        <p class="eyebrow">Continuous calendar</p>
        <h2>Release work, ENISA reporting readiness, and audit evidence in one calendar.</h2>
      </div>
      <div class="calendar-grid">
        <article><span data-days-reporting>--</span><strong>days to reporting readiness date</strong><p>Prepare vulnerability intake, triage owners, and notification templates before 11 Sep 2026.</p></article>
        <article><span data-days-main>--</span><strong>days to main obligations date</strong><p>Keep product evidence clean before 11 Dec 2027, not after a launch freeze.</p></article>
        <article><span>Every release</span><strong>Reassess automatically</strong><p>SBOM, CVE, risk category, declaration draft, and audit log refresh when a version changes.</p></article>
      </div>
    </section>

    ${pricingCards()}

    <section class="section resources" data-analytics-section="resources">
      <div class="section-heading">
        <p class="eyebrow">Useful CRA pages</p>
        <h2>Research pages that answer the question before asking for the click.</h2>
        <p>Each page maps a common Cyber Resilience Act search to a practical product-team workflow.</p>
      </div>
      <div class="resource-grid">${resourceLinks}</div>
    </section>
  </main>`
}

function pricingBody() {
  return `<main>
    <section class="page-hero compact">
      <p class="eyebrow">CertCore pricing</p>
      <h1>Cyber Resilience Act compliance plans</h1>
      <p>Studio annual is selected by default because it covers five products, SBOM API access, vulnerability workflow, and the 50% annual discount.</p>
      <button class="primary-action" type="button" data-open-plan="studio" data-billing="annual" data-source="pricing_page_hero">Choose Studio annual</button>
    </section>
    ${pricingCards()}
  </main>`
}

function keywordBody(page) {
  const useful = page.useful.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
  const faq = page.faq
    .map(([question, answer]) => `<details><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`)
    .join('')
  const links = page.links
    .map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`)
    .join('')

  return `<main>
    <article class="article-page" data-analytics-section="article_${page.slug}">
      <a class="back-link" href="/">Back to CertCore</a>
      <p class="eyebrow">${escapeHtml(page.kicker)}</p>
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="article-intro">${escapeHtml(page.intro)}</p>
      <div class="article-cta">
        <span>Need the operational version?</span>
        <button class="primary-action" type="button" data-open-plan="studio" data-billing="annual" data-source="${page.slug}_cta">Build the CRA workspace</button>
      </div>
      <section>
        <h2>What to do with this information</h2>
        <ul class="article-list">${useful}</ul>
      </section>
      <section class="article-callout">
        <h2>How CertCore uses it</h2>
        <p>${escapeHtml(page.action)}</p>
      </section>
      <section>
        <h2>Official and technical references</h2>
        <div class="reference-links">${links}</div>
      </section>
      <section>
        <h2>Questions teams ask</h2>
        <div class="faq-list">${faq}</div>
      </section>
    </article>
  </main>`
}

function privacyBody() {
  return `<main>
    <article class="article-page legal" data-analytics-section="privacy">
      <h1>Privacy Policy</h1>
      <p>Last updated: 12 May 2026</p>
      <p>CertCore collects only the information needed to operate the site, process checkout, provide CRA readiness workflows, maintain security, and support customers.</p>
      <h2>Information we process</h2>
      <p>We may process account details, business contact information, product metadata you submit, dependency or SBOM data, checkout metadata, analytics events, device information, and support messages. Payment card details are handled by Creem or another payment processor and are not stored by CertCore.</p>
      <h2>How we use information</h2>
      <p>We use information to deliver the service, create checkout sessions, operate analytics, improve conversion and product reliability, detect abuse, maintain audit logs, answer support requests, and comply with applicable legal obligations.</p>
      <h2>Security and retention</h2>
      <p>We use reasonable technical and organizational measures. No internet service can be guaranteed perfectly secure. We retain information only as long as needed for service delivery, security, billing, dispute handling, legal compliance, backups, and legitimate business records.</p>
      <h2>International use</h2>
      <p>CertCore is intended for Europe and United States teams selling or supplying software to the EU market. Information may be processed in jurisdictions where our providers operate, subject to applicable safeguards.</p>
      <h2>Your choices</h2>
      <p>Contact ${site.supportEmail} for access, correction, deletion, or support requests. Some records may be retained where required for security, billing, dispute, fraud prevention, or legal reasons.</p>
    </article>
  </main>`
}

function termsBody() {
  return `<main>
    <article class="article-page legal" data-analytics-section="terms">
      <h1>Terms of Service</h1>
      <p>Last updated: 12 May 2026</p>
      <h2>Service role</h2>
      <p>CertCore provides software workflow tools for Cyber Resilience Act readiness, SBOM handling, vulnerability tracking, templates, analytics, and document drafting. CertCore does not provide legal advice, certification, notified-body services, government approval, or a guarantee of regulatory compliance.</p>
      <h2>Customer responsibility</h2>
      <p>You are responsible for product facts, legal interpretation, conformity decisions, security review, vulnerability disclosure decisions, submissions to authorities, and final document approval. Outputs must be reviewed by qualified personnel before use.</p>
      <h2>Payments</h2>
      <p>Paid plans are processed through Creem or another payment provider. Annual billing may be discounted compared with monthly billing. Fees are non-refundable except where required by law or expressly agreed in writing.</p>
      <h2>No warranties</h2>
      <p>The service is provided as is and as available. To the fullest extent permitted by law, CertCore disclaims warranties of merchantability, fitness for a particular purpose, non-infringement, uninterrupted operation, error-free output, legal sufficiency, and regulatory outcome.</p>
      <h2>Liability limits</h2>
      <p>To the fullest extent permitted by law, CertCore and its operators will not be liable for indirect, incidental, special, consequential, exemplary, punitive, lost-profit, lost-revenue, business interruption, loss-of-data, procurement, regulatory, or third-party damages. Total liability is limited to the amount you paid for the service in the one month before the event giving rise to the claim, or EUR 100, whichever is greater.</p>
      <h2>Indemnity</h2>
      <p>You agree to defend and indemnify CertCore against claims arising from your product data, compliance decisions, public claims, customer communications, misuse of the service, breach of these terms, or violation of law.</p>
      <h2>Changes and termination</h2>
      <p>We may modify, suspend, or discontinue the service, features, pricing, or these terms where reasonably necessary. We may suspend access for abuse, security risk, non-payment, or legal risk.</p>
      <h2>Contact</h2>
      <p>Questions: ${site.supportEmail}</p>
    </article>
  </main>`
}

function checkoutDoneBody() {
  return `<main>
    <section class="page-hero compact checkout-done" data-analytics-section="checkout_done">
      <p class="eyebrow">Payment complete</p>
      <h1>Returning to CertCore</h1>
      <p>This payment window can close automatically. Your original CertCore page will return to the homepage.</p>
      <a class="primary-action" href="/">Back to homepage</a>
    </section>
    <script>
      (function () {
        try {
          if (window.opener && window.opener !== window) {
            window.opener.postMessage({ type: 'certcore-checkout-complete' }, window.location.origin);
            window.setTimeout(function () { window.close(); }, 300);
          }
        } catch {}
      })();
    </script>
  </main>`
}

function faqSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map(([name, text]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text },
    })),
  }
}

function softwareSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: site.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: site.origin,
    description: site.description,
    offers: [
      { '@type': 'Offer', name: 'Starter', price: '149', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Studio', price: '399', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Publisher', price: '999', priceCurrency: 'EUR' },
    ],
  }
}

const css = String.raw`
:root {
  --bg: #061116;
  --panel: rgba(7, 25, 31, 0.88);
  --panel-strong: #0a2028;
  --ink: #f5fbfd;
  --muted: #b7c8ce;
  --line: rgba(255, 255, 255, 0.14);
  --cyan: #67e8f9;
  --teal: #2dd4bf;
  --green: #86efac;
  --amber: #fbbf24;
  --red: #fb7185;
  --navy: #081827;
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--ink);
  letter-spacing: 0;
}
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
button { cursor: pointer; }
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px clamp(18px, 4vw, 56px);
  border-bottom: 1px solid rgba(255,255,255,.1);
  background: rgba(3, 15, 20, 0.72);
  backdrop-filter: blur(18px);
}
.brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 900; }
.brand-mark {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--cyan), var(--teal));
  color: #041216;
  box-shadow: 0 12px 30px rgba(45, 212, 191, 0.24);
}
.site-header nav { display: flex; gap: clamp(14px, 2vw, 26px); color: var(--muted); font-size: 14px; }
.site-header nav a:hover { color: var(--cyan); }
.icon-button, .primary-action, .secondary-action, .footer-checkout {
  min-height: 42px;
  border: 0;
  border-radius: 8px;
  padding: 11px 16px;
  font-weight: 850;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
}
.primary-action {
  color: #041216;
  background: linear-gradient(135deg, var(--cyan), var(--green));
  box-shadow: 0 18px 44px rgba(103, 232, 249, 0.22);
}
.secondary-action, .icon-button, .footer-checkout {
  border: 1px solid var(--line);
  background: rgba(255,255,255,.06);
  color: var(--ink);
}
.primary-action:hover, .secondary-action:hover, .icon-button:hover, .footer-checkout:hover { transform: translateY(-1px); }
.full { width: 100%; }
.hero {
  position: relative;
  min-height: 92vh;
  display: grid;
  align-items: center;
  overflow: hidden;
  padding: 92px clamp(18px, 4vw, 56px) 42px;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url("/assets/certcore-hero-cra-command-center.png");
  background-size: cover;
  background-position: center;
  filter: saturate(1.06);
  transform: scale(1.02);
}
.hero-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(2, 8, 12, .94), rgba(4, 17, 22, .78) 46%, rgba(4, 17, 22, .38)),
    linear-gradient(0deg, rgba(6, 17, 22, .98), rgba(6, 17, 22, .1) 42%);
}
.hero-inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(340px, .72fr);
  gap: clamp(26px, 4vw, 64px);
  align-items: end;
  max-width: 1220px;
  width: 100%;
  margin: 0 auto;
}
.eyebrow {
  margin: 0 0 12px;
  color: var(--cyan);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .12em;
  font-weight: 900;
}
h1, h2, h3, p { margin-top: 0; }
h1 {
  font-size: clamp(62px, 11vw, 138px);
  line-height: .86;
  margin-bottom: 20px;
  letter-spacing: 0;
}
.hero-lede {
  max-width: 760px;
  color: #d8e9ef;
  font-size: clamp(18px, 2vw, 24px);
  line-height: 1.5;
}
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 28px 0 24px; }
.proof-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: #d6e7ec;
  font-size: 13px;
}
.proof-row span, .status-chip, .recommended {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(255,255,255,.07);
}
.hero-tool, .dialog-panel, .dialog-aside, .price-card, .feature-grid article, .timeline-grid article, .calendar-grid article, .article-cta, .article-callout, .vuln-panel, .doc-form, #doc-output, #sbom-output {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(5, 22, 28, .82);
  box-shadow: var(--shadow);
}
.hero-tool {
  padding: 18px;
  backdrop-filter: blur(16px);
}
.tool-header, .panel-title, .selected-summary, .price-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.tool-header strong {
  color: #041216;
  background: var(--green);
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 13px;
}
label { display: grid; gap: 8px; color: #d9e8ed; font-weight: 750; font-size: 13px; margin-bottom: 12px; }
select, input, textarea {
  width: 100%;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 8px;
  background: rgba(0,0,0,.28);
  color: var(--ink);
  padding: 11px 12px;
  outline: none;
}
select:focus, input:focus, textarea:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(103,232,249,.12); }
.tool-output {
  margin-top: 14px;
  display: grid;
  gap: 6px;
  border-top: 1px solid var(--line);
  padding-top: 14px;
}
.tool-output span { font-weight: 900; }
.tool-output small, .muted, .price-note { color: var(--muted); line-height: 1.55; }
.section {
  padding: clamp(72px, 9vw, 116px) clamp(18px, 4vw, 56px);
  max-width: 1240px;
  margin: 0 auto;
}
.section-heading { max-width: 780px; margin-bottom: 30px; }
.section-heading h2, .page-hero h1, .article-page h1 { font-size: clamp(36px, 5vw, 68px); line-height: .98; margin-bottom: 16px; }
.section-heading p, .page-hero p, .article-intro { color: var(--muted); font-size: 18px; line-height: 1.65; }
.feature-grid, .timeline-grid, .calendar-grid, .pricing-grid, .resource-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.feature-grid article, .timeline-grid article, .calendar-grid article, .price-card {
  padding: 22px;
  box-shadow: none;
}
.feature-grid strong, .timeline-grid strong, .calendar-grid strong { display: block; font-size: 20px; margin-bottom: 8px; }
.feature-grid span, .timeline-grid p, .calendar-grid p, .price-card p { color: var(--muted); line-height: 1.6; }
.lab-layout {
  display: grid;
  grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
  gap: 18px;
  align-items: start;
}
textarea { min-height: 176px; resize: vertical; }
.inline-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
.result-stack { display: grid; gap: 14px; }
pre {
  margin: 0;
  overflow: auto;
  white-space: pre-wrap;
  color: #d9fbff;
  line-height: 1.45;
}
#sbom-output, #doc-output { min-height: 208px; padding: 18px; background: #061014; }
.vuln-panel { padding: 18px; box-shadow: none; }
.vuln-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid var(--line);
}
.severity { width: 10px; height: 10px; border-radius: 999px; }
.critical { background: var(--red); }
.high { background: var(--amber); }
.medium { background: var(--cyan); }
.timeline-grid article span, .calendar-grid article span {
  display: inline-block;
  color: var(--cyan);
  font-weight: 950;
  margin-bottom: 12px;
}
.calendar-grid article span { font-size: 34px; }
.doc-generator {
  display: grid;
  grid-template-columns: minmax(0, .74fr) minmax(320px, .62fr) minmax(0, .9fr);
  gap: 18px;
  align-items: start;
}
.doc-form { padding: 18px; box-shadow: none; }
.pricing-section { max-width: 1320px; }
.pricing-toggle { margin: -8px 0 22px; }
.billing-toggle {
  display: inline-flex;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255,255,255,.05);
  padding: 4px;
  gap: 4px;
}
.billing-toggle button {
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--muted);
  padding: 9px 12px;
  font-weight: 850;
}
.billing-toggle button.is-active { background: var(--cyan); color: #031217; }
.price-card { position: relative; display: grid; gap: 12px; }
.price-card.is-featured { border-color: rgba(103,232,249,.54); background: rgba(9, 40, 49, .9); }
.recommended { position: absolute; top: 14px; right: 14px; color: var(--green); font-size: 12px; }
.price-card h3 { font-size: 26px; margin: 0; }
.price-line span { font-size: 42px; font-weight: 950; }
.price-line small { color: var(--muted); }
.resources { padding-top: 40px; }
.resource-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.resource-grid a {
  display: grid;
  gap: 8px;
  min-height: 132px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 18px;
  background: rgba(255,255,255,.04);
  font-weight: 900;
}
.resource-grid span { color: var(--muted); font-weight: 500; line-height: 1.5; }
.page-hero {
  padding: 138px clamp(18px, 4vw, 56px) 64px;
  max-width: 980px;
  margin: 0 auto;
}
.page-hero.compact { min-height: 54vh; display: grid; align-content: center; }
.article-page {
  width: min(900px, calc(100% - 36px));
  margin: 0 auto;
  padding: 132px 0 80px;
}
.article-page h1 { margin-bottom: 22px; }
.article-page h2 { font-size: 28px; margin: 40px 0 14px; }
.article-page p, .article-page li { color: var(--muted); line-height: 1.7; font-size: 17px; }
.back-link { display: inline-block; margin-bottom: 28px; color: var(--cyan); font-weight: 850; }
.article-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px;
  margin: 28px 0;
  box-shadow: none;
}
.article-cta span { font-weight: 900; }
.article-list { padding-left: 20px; }
.article-callout { padding: 20px; box-shadow: none; }
.reference-links { display: flex; flex-wrap: wrap; gap: 10px; }
.reference-links a {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--cyan);
  background: rgba(103,232,249,.08);
}
.faq-list details {
  border-top: 1px solid var(--line);
  padding: 14px 0;
}
.faq-list summary { cursor: pointer; font-weight: 900; }
.checkout-done { text-align: center; }
.site-footer {
  border-top: 1px solid var(--line);
  padding: 42px clamp(18px, 4vw, 56px);
  background: #030b0f;
}
.footer-grid {
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(280px, 1.2fr) repeat(3, minmax(0, .7fr));
  gap: 28px;
}
.footer-grid h2 { font-size: 14px; margin-bottom: 12px; color: var(--cyan); text-transform: uppercase; letter-spacing: .08em; }
.footer-grid a, .footer-grid button { display: flex; margin: 8px 0; color: var(--muted); }
.footer-link-stack { max-height: 230px; overflow: auto; padding-right: 6px; }
.checkout-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(1, 7, 10, .72);
  backdrop-filter: blur(12px);
}
.checkout-overlay[hidden] { display: none; }
body.checkout-open main, body.checkout-open .site-header, body.checkout-open .site-footer { filter: blur(3px); }
.plan-dialog {
  position: relative;
  width: min(960px, 100%);
  max-height: min(760px, calc(100vh - 36px));
  overflow: auto;
  border: 1px solid rgba(103,232,249,.26);
  border-radius: 8px;
  background: #061116;
  box-shadow: 0 30px 90px rgba(0,0,0,.58);
}
.dialog-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,.08);
  color: var(--ink);
}
.dialog-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 0;
}
.dialog-panel { padding: 28px; border: 0; border-radius: 0; box-shadow: none; }
.dialog-aside {
  border-width: 0 0 0 1px;
  border-radius: 0;
  padding: 28px;
  box-shadow: none;
  background: linear-gradient(180deg, rgba(103,232,249,.08), rgba(134,239,172,.06));
}
.dialog-aside ul { padding-left: 18px; color: var(--muted); line-height: 1.75; }
.modal-plans { display: grid; gap: 10px; margin: 18px 0; }
.modal-plans button {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 14px;
  text-align: left;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 14px;
  background: rgba(255,255,255,.05);
  color: var(--ink);
}
.modal-plans button.is-selected { border-color: var(--cyan); background: rgba(103,232,249,.1); }
.modal-plans span { color: var(--muted); }
.modal-plans em { grid-row: span 2; align-self: center; color: var(--cyan); font-style: normal; font-weight: 950; }
.selected-summary {
  margin: 16px 0;
  padding: 14px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.payment-facts { display: grid; gap: 10px; margin: 18px 0; }
.payment-facts span { border: 1px solid var(--line); border-radius: 8px; padding: 10px; color: var(--muted); }
@media (max-width: 980px) {
  .site-header nav { display: none; }
  .hero-inner, .lab-layout, .doc-generator, .dialog-grid { grid-template-columns: 1fr; }
  .hero { min-height: auto; }
  .hero-tool { max-width: 620px; }
  .feature-grid, .timeline-grid, .calendar-grid, .pricing-grid, .resource-grid, .footer-grid { grid-template-columns: 1fr; }
  .dialog-aside { border-width: 1px 0 0; }
}
@media (max-width: 620px) {
  .site-header { padding: 12px 14px; }
  .brand span:last-child { display: none; }
  .hero { padding-inline: 14px; }
  h1 { font-size: 60px; }
  .hero-actions, .inline-actions, .article-cta { align-items: stretch; flex-direction: column; }
  .primary-action, .secondary-action, .icon-button { width: 100%; white-space: normal; text-align: center; }
  .tool-header, .selected-summary, .price-line { align-items: flex-start; flex-direction: column; }
  .article-page { width: calc(100% - 28px); }
}
`

const appJs = String.raw`
(function () {
  var plans = {
    starter: { id: 'starter', name: 'Starter', monthly: 14900, products: '1 product' },
    studio: { id: 'studio', name: 'Studio', monthly: 39900, products: '5 products + SBOM API' },
    publisher: { id: 'publisher', name: 'Publisher', monthly: 99900, products: 'unlimited products + white label' }
  };
  var annualDiscount = 0.5;
  var state = { plan: 'studio', billing: 'annual', source: 'default', popup: null, checkoutUrl: '', paymentOpen: false };
  var overlay = document.querySelector('[data-checkout-overlay]');
  function money(cents) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: cents % 100 === 0 ? 0 : 2 }).format(cents / 100);
  }
  function price(planId, billing) {
    var plan = plans[planId] || plans.studio;
    if (billing === 'annual') {
      var annual = Math.round(plan.monthly * 12 * annualDiscount);
      return { display: money(Math.round(annual / 12)), period: '/ mo billed yearly', note: money(annual) + ' charged yearly. 50% cheaper than monthly.', checkoutAmount: annual };
    }
    return { display: money(plan.monthly), period: '/ month', note: money(plan.monthly) + ' charged monthly. Switch to annual for 50% savings.', checkoutAmount: plan.monthly };
  }
  function track(name, metadata) {
    if (window.CertCoreAnalytics && window.CertCoreAnalytics.track) window.CertCoreAnalytics.track(name, metadata || {});
  }
  function renderPrices() {
    Object.keys(plans).forEach(function (planId) {
      var p = price(planId, state.billing);
      document.querySelectorAll('[data-plan-price="' + planId + '"]').forEach(function (node) { node.textContent = p.display; });
      document.querySelectorAll('[data-plan-period="' + planId + '"]').forEach(function (node) { node.textContent = p.period; });
      document.querySelectorAll('[data-plan-note="' + planId + '"]').forEach(function (node) { node.textContent = p.note; });
    });
    document.querySelectorAll('[data-billing-option]').forEach(function (button) {
      var active = button.getAttribute('data-billing-option') === state.billing;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-modal-plan]').forEach(function (button) {
      button.classList.toggle('is-selected', button.getAttribute('data-modal-plan') === state.plan);
    });
    var selectedPlan = plans[state.plan] || plans.studio;
    var selectedPrice = price(selectedPlan.id, state.billing);
    var title = document.querySelector('[data-selected-plan]');
    var amount = document.querySelector('[data-selected-price]');
    var note = document.querySelector('[data-selected-note]');
    var paymentPlan = document.querySelector('[data-payment-plan]');
    var paymentBilling = document.querySelector('[data-payment-billing]');
    if (title) title.textContent = selectedPlan.name + ' ' + (state.billing === 'annual' ? 'annual' : 'monthly');
    if (amount) amount.textContent = selectedPrice.display + ' ' + selectedPrice.period;
    if (note) note.textContent = selectedPrice.note + ' Covers ' + selectedPlan.products + '.';
    if (paymentPlan) paymentPlan.textContent = selectedPlan.name + ' ' + (state.billing === 'annual' ? 'annual' : 'monthly');
    if (paymentBilling) paymentBilling.textContent = state.billing === 'annual' ? 'Annual - 50% off' : 'Monthly';
  }
  function setStep(step) {
    document.querySelectorAll('[data-plan-step]').forEach(function (node) {
      node.hidden = node.getAttribute('data-plan-step') !== step;
    });
  }
  function openPlan(planId, billing, source) {
    state.plan = planId || 'studio';
    state.billing = billing || 'annual';
    state.source = source || 'cta';
    state.checkoutUrl = '';
    if (overlay) overlay.hidden = false;
    document.body.classList.add('checkout-open');
    setStep('plans');
    renderPrices();
    track('plan_modal_opened', { plan: state.plan, billing: state.billing, source: state.source });
  }
  function closePlan() {
    if (overlay) overlay.hidden = true;
    document.body.classList.remove('checkout-open');
    state.checkoutUrl = '';
    if (state.paymentOpen && state.popup && !state.popup.closed) state.popup.focus();
    state.paymentOpen = false;
  }
  function popupFeatures() {
    var width = Math.min(560, Math.max(420, window.screen.width - 40));
    var height = Math.min(780, Math.max(620, window.screen.height - 80));
    var left = Math.max(0, Math.round((window.screen.width - width) / 2));
    var top = Math.max(0, Math.round((window.screen.height - height) / 2));
    return ['popup=yes', 'resizable=yes', 'scrollbars=yes', 'width=' + width, 'height=' + height, 'left=' + left, 'top=' + top].join(',');
  }
  function writeLoading(popup) {
    if (!popup || popup.closed) return;
    try {
      popup.document.open();
      popup.document.write('<!doctype html><html><head><title>CertCore checkout</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#061116;color:#f5fbfd;font-family:Inter,Arial,sans-serif}main{text-align:center;max-width:360px;padding:24px}.dot{width:38px;height:38px;border:4px solid rgba(103,232,249,.25);border-top-color:#67e8f9;border-radius:50%;animation:s 1s linear infinite;margin:0 auto 18px}@keyframes s{to{transform:rotate(360deg)}}p{color:#b7c8ce;line-height:1.6}</style></head><body><main><div class="dot"></div><h1>Opening Creem checkout</h1><p>Your CertCore payment window is being prepared securely.</p></main></body></html>');
      popup.document.close();
    } catch {}
  }
  function openShell() {
    var popup = window.open('', 'certcore_creem_checkout', popupFeatures());
    if (popup) { popup.focus(); writeLoading(popup); }
    return popup;
  }
  async function startCheckout() {
    var popup = openShell();
    state.popup = popup;
    state.paymentOpen = true;
    setStep('payment');
    var status = document.querySelector('[data-payment-status]');
    var reopen = document.querySelector('[data-reopen-checkout]');
    if (status) status.textContent = 'Creating the secure Creem checkout. Keep this page open.';
    if (reopen) reopen.hidden = true;
    renderPrices();
    track('checkout_requested', { plan: state.plan, billing: state.billing, source: state.source });
    try {
      var response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: state.plan, billing: state.billing, source: state.source }),
        credentials: 'same-origin'
      });
      var payload = await response.json();
      if (!response.ok || !payload.checkoutUrl) throw new Error(payload.error || 'Checkout could not be created.');
      state.checkoutUrl = payload.checkoutUrl;
      if (popup && !popup.closed) popup.location.assign(payload.checkoutUrl);
      if (reopen) { reopen.href = payload.checkoutUrl; reopen.hidden = false; }
      if (status) status.textContent = 'The centered Creem payment window is open. Finish payment there; this page will stay ready behind it.';
      track('checkout_opened', { plan: state.plan, billing: state.billing, provider: 'creem' });
    } catch (error) {
      if (popup && !popup.closed) popup.close();
      if (status) status.textContent = 'Checkout could not be created yet. Please try again in a moment.';
      track('checkout_error', { plan: state.plan, billing: state.billing, message: String(error && error.message || error) });
    }
  }
  function updateScopeTool() {
    var form = document.getElementById('scope-tool');
    if (!form) return;
    var type = form.productType.value;
    var market = form.market.value;
    var category = form.category.value;
    var connectivity = form.connectivity.value;
    var inScope = market !== 'none' && type !== 'opensource';
    var result = document.querySelector('[data-scope-result]');
    var cls = document.querySelector('[data-scope-class]');
    var next = document.querySelector('[data-scope-next]');
    if (!inScope) {
      if (result) result.textContent = 'Needs review';
      if (cls) cls.textContent = 'Potentially out of direct manufacturer scope';
      if (next) next.textContent = 'Document the reason, keep supplier evidence, and re-check if EU placement changes.';
      return;
    }
    var categoryLabel = category === 'critical' ? 'Critical category signal' : category === 'important' ? 'Important product signal' : 'Default product with digital elements';
    if (result) result.textContent = category === 'default' ? 'Likely in scope' : 'Likely higher scrutiny';
    if (cls) cls.textContent = categoryLabel;
    if (next) next.textContent = connectivity === 'networked' ? 'Generate SBOM, open CVE monitoring, and prepare Article 14 reporting workflow.' : 'Generate SBOM, document update policy, and validate category with counsel.';
  }
  function parseDependencies() {
    var input = document.getElementById('dependency-input');
    if (!input) return [];
    return input.value.split(/\n+/).map(function (line) {
      var parts = line.trim().split(/\s+/);
      if (!parts[0]) return null;
      return { name: parts[0], version: parts[1] || 'unknown', type: 'library' };
    }).filter(Boolean);
  }
  function generateSbom() {
    var deps = parseDependencies();
    var bom = {
      bomFormat: 'CycloneDX',
      specVersion: '1.6',
      serialNumber: 'urn:uuid:' + (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      metadata: { component: { name: 'sample-product', type: 'application' } },
      components: deps
    };
    var out = document.getElementById('sbom-output');
    if (out) out.textContent = JSON.stringify(bom, null, 2);
    var catalog = {
      'openssl': ['critical', 'CVE watch required for legacy OpenSSL releases'],
      'log4j-core': ['critical', 'Known exploited versions require immediate triage'],
      'zlib': ['high', 'Compression library should be reviewed against current advisories'],
      'react': ['medium', 'Track framework advisories and transitive dependencies']
    };
    var vulns = deps.map(function (dep) {
      var finding = catalog[dep.name.toLowerCase()];
      return finding ? { dep: dep.name + ' ' + dep.version, severity: finding[0], note: finding[1] } : null;
    }).filter(Boolean);
    var order = { critical: 0, high: 1, medium: 2 };
    vulns.sort(function (a, b) { return order[a.severity] - order[b.severity]; });
    var panel = document.getElementById('vuln-output');
    if (panel) {
      panel.innerHTML = vulns.length ? vulns.map(function (v) {
        return '<div class="vuln-item"><span class="severity ' + v.severity + '"></span><strong>' + v.dep + '</strong><small>' + v.note + '</small></div>';
      }).join('') : '<p class="muted">No sample CVE matches in this dependency list.</p>';
    }
    track('sbom_generated', { dependencyCount: deps.length, vulnerabilityCount: vulns.length });
  }
  function generateDoc() {
    var form = document.getElementById('doc-form');
    var out = document.getElementById('doc-output');
    if (!form || !out) return;
    var product = form.product.value || 'Product name';
    var category = form.category.value || 'Product category';
    var manufacturer = form.manufacturer.value || 'Manufacturer';
    out.textContent = [
      'EU Declaration of Conformity draft fields',
      '',
      'Product: ' + product,
      'Category: ' + category,
      'Manufacturer: ' + manufacturer,
      'Regulation reference: Regulation (EU) 2024/2847',
      'Evidence bundle: scope memo, SBOM, vulnerability handling record, security update policy, technical documentation',
      'Review status: draft for qualified legal and conformity review'
    ].join('\n');
    track('declaration_draft_generated', { product: product.slice(0, 80) });
  }
  function updateCountdowns() {
    function daysUntil(dateText) {
      var target = new Date(dateText + 'T00:00:00Z').getTime();
      var diff = Math.ceil((target - Date.now()) / 86400000);
      return diff > 0 ? String(diff) : '0';
    }
    document.querySelectorAll('[data-days-reporting]').forEach(function (node) { node.textContent = daysUntil('2026-09-11'); });
    document.querySelectorAll('[data-days-main]').forEach(function (node) { node.textContent = daysUntil('2027-12-11'); });
  }
  document.querySelectorAll('[data-open-plan]').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      openPlan(button.getAttribute('data-open-plan') || 'studio', button.getAttribute('data-billing') || 'annual', button.getAttribute('data-source') || 'cta');
    });
  });
  document.querySelectorAll('[data-close-checkout]').forEach(function (button) { button.addEventListener('click', closePlan); });
  if (overlay) overlay.addEventListener('click', function (event) { if (event.target === overlay) closePlan(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && overlay && !overlay.hidden) closePlan(); });
  document.querySelectorAll('[data-billing-option]').forEach(function (button) {
    button.addEventListener('click', function () { state.billing = button.getAttribute('data-billing-option') === 'monthly' ? 'monthly' : 'annual'; renderPrices(); track('billing_selected', { billing: state.billing }); });
  });
  document.querySelectorAll('[data-modal-plan]').forEach(function (button) {
    button.addEventListener('click', function () { state.plan = button.getAttribute('data-modal-plan') || 'studio'; renderPrices(); track('plan_selected', { plan: state.plan, billing: state.billing }); });
  });
  var start = document.querySelector('[data-start-checkout]');
  if (start) start.addEventListener('click', startCheckout);
  var back = document.querySelector('[data-back-to-plans]');
  if (back) back.addEventListener('click', function () { setStep('plans'); renderPrices(); });
  var scopeForm = document.getElementById('scope-tool');
  if (scopeForm) scopeForm.addEventListener('input', updateScopeTool);
  var sbomButton = document.getElementById('generate-sbom');
  if (sbomButton) sbomButton.addEventListener('click', generateSbom);
  var docButton = document.getElementById('generate-doc');
  if (docButton) docButton.addEventListener('click', generateDoc);
  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) return;
    if (!event.data || event.data.type !== 'certcore-checkout-complete') return;
    track('checkout_success_return', { plan: state.plan, billing: state.billing });
    window.location.href = '/';
  });
  renderPrices();
  updateScopeTool();
  generateSbom();
  generateDoc();
  updateCountdowns();
})();
`

const analyticsJs = String.raw`
(function () {
  var visitorKey = 'certcore:visitor';
  var sessionKey = 'certcore:session';
  var queue = [];
  function uuid() { return crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2); }
  function storageGet(key) { try { return localStorage.getItem(key); } catch { return ''; } }
  function storageSet(key, value) { try { localStorage.setItem(key, value); } catch {} }
  function visitorId() {
    var value = storageGet(visitorKey);
    if (!value) { value = uuid(); storageSet(visitorKey, value); }
    return value;
  }
  function sessionId() {
    var now = Date.now();
    var existing = null;
    try { existing = JSON.parse(sessionStorage.getItem(sessionKey) || 'null'); } catch {}
    if (existing && existing.id && now - existing.t < 1800000) return existing.id;
    var next = { id: uuid(), t: now };
    try { sessionStorage.setItem(sessionKey, JSON.stringify(next)); } catch {}
    return next.id;
  }
  function utm(name) { try { return new URLSearchParams(location.search).get(name) || ''; } catch { return ''; } }
  function eventPayload(name, metadata) {
    return {
      id: uuid(),
      name: String(name || 'event').slice(0, 80),
      path: location.pathname + location.search,
      visitorId: visitorId(),
      sessionId: sessionId(),
      occurredAt: new Date().toISOString(),
      referrerHost: document.referrer ? new URL(document.referrer).hostname : '',
      utmSource: utm('utm_source'),
      utmMedium: utm('utm_medium'),
      utmCampaign: utm('utm_campaign'),
      metadata: metadata || {}
    };
  }
  function flush(beacon) {
    if (!queue.length) return;
    var events = queue.splice(0, 30);
    var body = JSON.stringify({ events: events });
    if (beacon && navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/events', new Blob([body], { type: 'application/json' }));
      return;
    }
    fetch('/api/analytics/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: beacon }).catch(function () {});
  }
  function track(name, metadata) {
    queue.push(eventPayload(name, metadata));
    window.setTimeout(function () { flush(false); }, 80);
  }
  document.addEventListener('click', function (event) {
    var target = event.target && event.target.closest ? event.target.closest('a,button') : null;
    if (!target) return;
    track('ui_click', { text: (target.textContent || '').trim().slice(0, 120), href: target.getAttribute('href') || '', action: target.getAttribute('data-source') || target.getAttribute('data-open-plan') || '' });
  }, true);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(true); });
  window.addEventListener('pagehide', function () { flush(true); });
  window.CertCoreAnalytics = { track: track, flush: flush };
  track('page_view', { title: document.title });
})();
`

function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#061116"/>
  <path d="M32 8l18 7v14c0 13-7 22-18 27C21 51 14 42 14 29V15l18-7z" fill="#67e8f9"/>
  <path d="M39 24a10 10 0 10.3 15.7l-5.1-5.1A3 3 0 1134 29l5-5z" fill="#061116"/>
</svg>`
}

function sitemapXml() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = allPaths
    .filter((pathname) => pathname !== '/checkout/done')
    .map((pathname) => {
      const priority = pathname === '/' ? '1.0' : pathname === '/pricing' ? '0.9' : pathname === '/privacy' || pathname === '/terms' ? '0.35' : '0.78'
      const freq = pathname === '/' || pathname === '/pricing' ? 'weekly' : 'monthly'
      return `  <url>
    <loc>${canonical(pathname)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

function robotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /checkout/done/
Sitemap: ${site.origin}/sitemap.xml
`
}

async function writePage(pathname, html) {
  const clean = pathname === '/' ? '' : pathname.replace(/^\/+|\/+$/g, '')
  const dir = path.join(outDir, clean)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, 'index.html'), html)
}

async function main() {
  await rm(outDir, { recursive: true, force: true })
  await mkdir(assetsDir, { recursive: true })

  const imageSource = path.join(root, 'assets', 'certcore-hero-cra-command-center.png')
  if (existsSync(imageSource)) {
    await copyFile(imageSource, path.join(assetsDir, 'certcore-hero-cra-command-center.png'))
  }

  await writeFile(path.join(outDir, 'favicon.svg'), faviconSvg())
  await writeFile(path.join(assetsDir, 'main.css'), css)
  await writeFile(path.join(assetsDir, 'app.js'), appJs)
  await writeFile(path.join(assetsDir, 'analytics.js'), analyticsJs)
  await writeFile(path.join(outDir, 'sitemap.xml'), sitemapXml())
  await writeFile(path.join(outDir, 'robots.txt'), robotsTxt())
  await writeFile(path.join(outDir, 'BingSiteAuth.xml'), '<?xml version="1.0"?><users><user>94D388E2CA0B71EC5A04D17A6A46E444</user></users>\n')

  await writePage(
    '/',
    layout({
      title: 'Cyber Resilience Act Compliance Platform | CertCore',
      description:
        'Prepare for the Cyber Resilience Act with a 30-minute CRA scope checker, SBOM generator, CVE dashboard, 72-hour vulnerability reporting workflow, EU Declaration of Conformity drafts, and compliance calendar.',
      pathname: '/',
      body: homeBody(),
      schema: [softwareSchema()],
    }),
  )

  await writePage(
    '/pricing',
    layout({
      title: 'CertCore Pricing | Cyber Resilience Act Compliance Plans',
      description:
        'CertCore pricing for Cyber Resilience Act compliance workflows. Studio annual is selected by default with 50% annual savings.',
      pathname: '/pricing',
      body: pricingBody(),
      schema: [softwareSchema()],
    }),
  )

  for (const page of keywordPages) {
    await writePage(
      `/${page.slug}`,
      layout({
        title: `${page.title} | CertCore`,
        description: page.description,
        pathname: `/${page.slug}`,
        body: keywordBody(page),
        schema: [faqSchema(page)],
      }),
    )
  }

  await writePage(
    '/privacy',
    layout({
      title: 'Privacy Policy | CertCore',
      description: 'Privacy Policy for CertCore Cyber Resilience Act compliance software.',
      pathname: '/privacy',
      body: privacyBody(),
    }),
  )
  await writePage(
    '/terms',
    layout({
      title: 'Terms of Service | CertCore',
      description: 'Terms of Service for CertCore Cyber Resilience Act compliance software.',
      pathname: '/terms',
      body: termsBody(),
    }),
  )
  await writePage(
    '/checkout/done',
    layout({
      title: 'Payment Complete | CertCore',
      description: 'CertCore checkout completed.',
      pathname: '/checkout/done',
      body: checkoutDoneBody(),
    }),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
