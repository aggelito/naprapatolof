import type { Clinic } from './clinic';

const AI_SEARCH_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'PerplexityBot',
] as const;

function sekAmount(price: string): number {
  return Number(price.replace(/[^\d]/g, ''));
}

export function generateRobotsTxt(clinic: Clinic): string {
  const botRules = AI_SEARCH_BOTS.map((bot) => `User-agent: ${bot}\nAllow: /`).join('\n\n');

  return `User-agent: *
Allow: /

${botRules}

Sitemap: ${clinic.sitemapUrl}
`;
}

export function clinicMarkdownUrl(clinic: Clinic): string {
  return `${clinic.siteUrl}/index.md`;
}

function priceLines(clinic: Clinic): string {
  return clinic.prices
    .map((item) => {
      const time = item.time ? ` (${item.time})` : '';
      return `- ${item.label}${time}: ${item.price}`;
    })
    .join('\n');
}

export function generateClinicMarkdown(clinic: Clinic): string {
  return `# ${clinic.businessName}

> ${clinic.jobTitle} i ${clinic.addressLocality}.

${clinic.description}

- Mottagning: ${clinic.locationName}, ${clinic.streetAddress}, ${clinic.addressLocality}
- Dagar: ${clinic.days}
- Öppettider: ${clinic.hours}

## Priser

${priceLines(clinic)}

## Kontakt

- [Bokning](${clinic.bookingUrl}): Boka tid
- [E-post](mailto:${clinic.email}): ${clinic.email}
- [Telefon](${clinic.telephoneHref}): ${clinic.telephone}
- [Instagram](${clinic.instagramUrl}): ${clinic.instagramHandle}
- [Karta](${clinic.locationMapUrl}): ${clinic.locationName}, ${clinic.streetAddress}, ${clinic.addressLocality}
`;
}

export function generateLlmsTxt(clinic: Clinic): string {
  return `# ${clinic.businessName}

> ${clinic.jobTitle} i ${clinic.addressLocality}.

${clinic.description}

- Mottagning: ${clinic.locationName}, ${clinic.streetAddress}, ${clinic.addressLocality}
- Dagar: ${clinic.days}
- Öppettider: ${clinic.hours}

${priceLines(clinic)}

## Sidor

- [Klinikfakta](${clinicMarkdownUrl(clinic)}): Markdownversion av startsidan
- [Bokning](${clinic.bookingUrl}): Boka tid
- [Instagram](${clinic.instagramUrl}): ${clinic.instagramHandle}

## Optional

- [E-post](mailto:${clinic.email}): ${clinic.email}
- [Telefon](${clinic.telephoneHref}): ${clinic.telephone}
- [Karta](${clinic.locationMapUrl}): ${clinic.locationName}, ${clinic.streetAddress}, ${clinic.addressLocality}
- [Google](${clinic.googleReviewUrl}): Hitta kliniken på Google
- [Webbplatskarta](${clinic.sitemapUrl}): Sidor för sökmotorer
`;
}

export function generateJsonLd(clinic: Clinic) {
  const clinicId = `${clinic.siteUrl}/#clinic`;
  const personId = `${clinic.siteUrl}/#person`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'MedicalBusiness'],
        '@id': clinicId,
        name: clinic.businessName,
        url: clinic.siteUrl,
        email: clinic.email,
        telephone: clinic.telephone,
        image: clinic.imageUrl,
        description: clinic.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: clinic.streetAddress,
          addressLocality: clinic.addressLocality,
          addressCountry: clinic.addressCountry,
        },
        openingHoursSpecification: clinic.openingDays.map((dayOfWeek) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek,
          opens: clinic.opens,
          closes: clinic.closes,
        })),
        employee: { '@id': personId },
        makesOffer: clinic.prices.map((item) => ({
          '@type': 'Offer',
          name: item.label,
          priceCurrency: 'SEK',
          price: sekAmount(item.price),
          ...(item.time ? { description: item.time } : {}),
        })),
        sameAs: [clinic.instagramUrl, clinic.googleReviewUrl],
        potentialAction: {
          '@type': 'ReserveAction',
          target: clinic.bookingUrl,
        },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: clinic.personName,
        jobTitle: clinic.jobTitle,
        url: clinic.siteUrl,
        image: clinic.imageUrl,
        worksFor: { '@id': clinicId },
      },
    ],
  };
}
