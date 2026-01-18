// Shared constants used across all pages

export const CONTACT_INFO = {
  email: 'greengoldseeds@rediffmail.com',
  phone: '+91 88888 66031',
  phoneDisplay: '+91 88888 66031',
  phoneHref: 'tel:+918888866031',
  whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  emailHref: 'mailto:greengoldseeds@rediffmail.com',
} as const;

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/GreenGoldSeedsAurangabad',
  youtube: 'https://www.youtube.com/channel/UCuKrb0ndVNn2LeV5Mawb0OQ/featured',
  instagram: 'https://www.instagram.com/greegoldseeds/',
} as const;

export const INSTAGRAM_ACCOUNT = {
  url: 'https://www.instagram.com/greengoldseedsaurangabad/',
  username: 'greengoldseedsaurangabad',
} as const;

export const FORM_CONFIG = {
  chatFormAction: 'https://dreamlayout.mnsithub.com/html/farmology/main-html/assets/inc/sendemail.php',
} as const;

// State-wise contact information
export interface StateContact {
  state: string;
  phone: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  email?: string;
  location?: string;
}

export const STATE_CONTACTS: StateContact[] = [
  {
    state: 'Maharashtra',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
    email: 'greengoldseeds@rediffmail.com',
    location: 'Chh. Sambhajinagar (Aurangabad)'
  },
  {
    state: 'Madhya Pradesh',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  },
  {
    state: 'Gujarat',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  },
  {
    state: 'Rajasthan',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  },
  {
    state: 'Karnataka',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  },
  {
    state: 'Telangana',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  },
  {
    state: 'Andhra Pradesh',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  },
  {
    state: 'Odisha',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  },
  {
    state: 'West Bengal',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  },
  {
    state: 'Assam',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  },
  {
    state: 'Chhattisgarh',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  },
];

