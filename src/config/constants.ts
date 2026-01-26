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
export interface EmployeeContact {
  name: string;
  phone?: string; // Optional phone number for this specific employee
  phoneDisplay?: string;
}

export interface StateContact {
  state: string;
  phone: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  email?: string;
  location?: string;
  employees?: EmployeeContact[]; // Optional list of employee contacts with names and phone numbers
}

export const STATE_CONTACTS: StateContact[] = [
  {
    state: 'Maharashtra',
    phone: '+919822913371',
    phoneDisplay: '+91 98229 13371',
    phoneHref: 'tel:+919822913371',
    whatsappHref: 'https://wa.me/919822913371?text=Hello%20from%20GGS%20website',
    email: 'greengoldseeds@rediffmail.com',
    employees: [
      { name: 'Bhausaheb Tupe Sir', phone: '+919822913371', phoneDisplay: '+91 98229 13371' },
      { name: 'Abhijeet Changole Sir', phone: '+917774026381', phoneDisplay: '+91 77740 26381' },
      { name: 'Sanjay Mahajan Sir', phone: '+919850826217', phoneDisplay: '+91 98508 26217' },
      { name: 'Sandip Baviskar Sir', phone: '+919822913372', phoneDisplay: '+91 98229 13372' }
    ]
  },
  {
    state: 'Andhra Pradesh',
    phone: '+918956643173',
    phoneDisplay: '+91 89566 43173',
    phoneHref: 'tel:+918956643173',
    whatsappHref: 'https://wa.me/918956643173?text=Hello%20from%20GGS%20website',
    email: 'customercare@greengoldseeds.co.in',
    employees: [
      { name: 'Balaji Rao Sir', phone: '+918956643173', phoneDisplay: '+91 89566 43173' },
      { name: 'Trinetra Kumar Sir' } // Uses state default phone
    ]
  },
  {
    state: 'Bihar',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  },
  {
    state: 'Chhattisgarh',
    phone: '+919856643167',
    phoneDisplay: '+91 98566 43167',
    phoneHref: 'tel:+919856643167',
    whatsappHref: 'https://wa.me/919856643167?text=Hello%20from%20GGS%20website',
    employees: [
      { name: 'Rameah Pal Sir', phone: '+919856643167', phoneDisplay: '+91 98566 43167' },
      { name: 'Vikas Jaiswal Sir' } // Uses state default phone
    ]
  },
  {
    state: 'Gujarat',
    phone: '+919822913372',
    phoneDisplay: '+91 98229 13372',
    phoneHref: 'tel:+919822913372',
    whatsappHref: 'https://wa.me/919822913372?text=Hello%20from%20GGS%20website',
    employees: [
      { name: 'Sandip Baviskar Sir', phone: '+919822913372', phoneDisplay: '+91 98229 13372' }
    ]
  },
  {
    state: 'Jharkhand',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
    employees: [
      { name: 'Mohan kumar Pandy' } // Uses state default phone
    ]
  },
  {
    state: 'Karnataka',
    phone: '+919657003673',
    phoneDisplay: '+91 96570 03673',
    phoneHref: 'tel:+919657003673',
    whatsappHref: 'https://wa.me/919657003673?text=Hello%20from%20GGS%20website',
    employees: [
      { name: 'Parkash sajjanar Sir', phone: '+919657003673', phoneDisplay: '+91 96570 03673' }
    ]
  },
  {
    state: 'Madhya Pradesh',
    phone: '+917774026378',
    phoneDisplay: '+91 77740 26378',
    phoneHref: 'tel:+917774026378',
    whatsappHref: 'https://wa.me/917774026378?text=Hello%20from%20GGS%20website',
    employees: [
      { name: 'Raj mishra Sir', phone: '+917774026378', phoneDisplay: '+91 77740 26378' }
    ]
  },
  {
    state: 'Odisha',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
    employees: [
      { name: 'Narayan Jana Sir' }, // Uses state default phone
      { name: 'Arpitkumar Mishra Sir' } // Uses state default phone
    ]
  },
  {
    state: 'Rajasthan',
    phone: '+918956643147',
    phoneDisplay: '+91 89566 43147',
    phoneHref: 'tel:+918956643147',
    whatsappHref: 'https://wa.me/918956643147?text=Hello%20from%20GGS%20website',
    employees: [
      { name: 'Sudhakar chavhan Sir', phone: '+918956643147', phoneDisplay: '+91 89566 43147' }
    ]
  },
  {
    state: 'Telangana',
    phone: '+918956643173',
    phoneDisplay: '+91 89566 43173',
    phoneHref: 'tel:+918956643173',
    whatsappHref: 'https://wa.me/918956643173?text=Hello%20from%20GGS%20website',
    employees: [
      { name: 'Balaji Rao Sir', phone: '+918956643173', phoneDisplay: '+91 89566 43173' },
      { name: 'Trinetra Kumar Sir' } // Uses state default phone
    ]
  },
  {
    state: 'Uttar Pradesh',
    phone: '+918956479062',
    phoneDisplay: '+91 89564 79062',
    phoneHref: 'tel:+918956479062',
    whatsappHref: 'https://wa.me/918956479062?text=Hello%20from%20GGS%20website',
    employees: [
      { name: 'Rakesh Mishra', phone: '+918956479062', phoneDisplay: '+91 89564 79062' },
      { name: 'Nikhilkumar Singh Sir', phone: '+918956479029', phoneDisplay: '+91 89564 79029' }
    ]
  },
  {
    state: 'West Bengal',
    phone: '+918888866031',
    phoneDisplay: '+91 88888 66031',
    phoneHref: 'tel:+918888866031',
    whatsappHref: 'https://wa.me/918888866031?text=Hello%20from%20GGS%20website',
  },
];

