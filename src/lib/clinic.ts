export type Price = {
  label: string;
  time?: string;
  price: string;
};

export type Clinic = {
  siteUrl: string;
  sitemapUrl: string;
  businessName: string;
  personName: string;
  jobTitle: string;
  locationName: string;
  streetAddress: string;
  addressLocality: string;
  addressCountry: string;
  days: string;
  hours: string;
  openingDays: string[];
  opens: string;
  closes: string;
  email: string;
  telephone: string;
  telephoneHref: string;
  bookingUrl: string;
  locationMapUrl: string;
  googleReviewUrl: string;
  instagramUrl: string;
  instagramHandle: string;
  imageUrl: string;
  description: string;
  prices: Price[];
};

export const clinic: Clinic = {
  siteUrl: 'https://lancingnaprapati.se',
  sitemapUrl: 'https://lancingnaprapati.se/sitemap-index.xml',
  businessName: 'Olof Lancing Naprapat',
  personName: 'Olof Lancing',
  jobTitle: 'Legitimerad naprapat',
  locationName: 'Österlen Naprapaterna',
  streetAddress: 'Hamngatan 7',
  addressLocality: 'Simrishamn',
  addressCountry: 'SE',
  days: 'Måndag och torsdag',
  hours: '08:00–15:00',
  openingDays: ['Monday', 'Thursday'],
  opens: '08:00',
  closes: '15:00',
  email: 'info@lancingnaprapati.se',
  telephone: '+46793256580',
  telephoneHref: 'tel:+46793256580',
  bookingUrl: 'https://lancingab.bestille.no/OnCust2/#!/',
  locationMapUrl:
    'https://www.google.com/maps/search/?api=1&query=%C3%96sterlen%20Naprapaterna%2C%20Hamngatan%207%2C%20Simrishamn',
  googleReviewUrl:
    'https://www.google.com/search?kgmid=/g/11zytk23xc&q=Lancingnaprapati+AB',
  instagramUrl: 'https://www.instagram.com/lancingnaprapati/',
  instagramHandle: '@lancingnaprapati',
  imageUrl: 'https://lancingnaprapati.se/olof-lancing.webp',
  description:
    'Jag är legitimerad naprapat och tar emot patienter på Österlen Naprapaterna, Hamngatan 7 i Simrishamn, på måndagar och torsdagar.',
  prices: [
    { label: 'Nybesök', time: '40 min', price: '750 kr' },
    { label: 'Återbesök', time: '30 min', price: '750 kr' },
    { label: 'Friskvårdbehandling', price: '938 kr' },
    { label: 'Helgbesök', time: 'Efter överenskommelse', price: '1 000 kr' },
    { label: '5-kort', price: '3 500 kr' },
    { label: '10-kort', price: '6 500 kr' },
  ],
};
