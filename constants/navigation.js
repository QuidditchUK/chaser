export const MAIN_NAVIGATION = [
  {
    label: 'About',
    list: [
      {
        label: 'What is Quidditch',
        as: '/about/what-is-quidditch',
        href: '/about/[id]',
      },
      {
        label: 'History',
        as: '/about/history',
        href: '/about/[id]',
      },
      {
        label: 'Leadership',
        as: '/about/leadership',
        href: '/about/[id]',
      },
      {
        label: 'Documents & Policies',
        as: '/about/documents-and-policies',
        href: '/about/[id]',
      },
      {
        label: 'Minutes',
        as: '/about/minutes',
        href: '/about/[id]',
      },
    ],
  },
  {
    label: 'Play',
    list: [
      {
        label: 'Find Quidditch',
        as: '/find-quidditch',
        href: '/find-quidditch',
      },
      {
        label: 'Getting Started',
        as: '/play/getting-started',
        href: '/play/[id]',
      },
      {
        label: 'Rulebook',
        as: '/play/rulebook',
        href: '/play/[id]',
      },
      {
        label: 'Official Events',
        as: '/play/official-events',
        href: '/play/[id]',
      },
    ],
  },
  {
    label: 'Volunteer',
    list: [
      {
        label: 'Staff',
        as: '/volunteer/staff',
        href: '/volunteer/[id]',
      },
      {
        label: 'Coaches',
        as: '/volunteer/coaches',
        href: '/volunteer/[id]',
      },
      {
        label: 'Referees',
        as: '/volunteer/referees',
        href: '/volunteer/[id]',
      },
      {
        label: 'Snitches',
        as: '/volunteer/snitches',
        href: '/volunteer/[id]',
      },
      {
        label: 'Tournaments',
        as: '/volunteer/tournaments',
        href: '/volunteer/[id]',
      },
    ],
  },
  {
    label: 'Youth',
    as: '/youth',
    href: '/[id]',
  },
  {
    label: 'Merch',
    as: '/merch',
    href: '/[id]',
  },
  {
    label: 'News',
    as: '/news',
    href: '/news',
  },
];

export const DASHBOARD_NAVIGATION = [
  {
    label: 'Events',
    list: [
      {
        label: 'Register',
        as: '/events/register',
        href: '/events/register',
      },
    ],
  },
  {
    label: 'My Membership',
    list: [
      {
        label: 'Manage QUK Membership',
        as: '/membership/manage',
        href: '/membership/[id]',
      },
      {
        label: 'Club',
        as: '/membership/club',
        href: '/membership/[id]',
      },
      {
        label: 'Transfer',
        as: '/membership/transfer',
        href: '/membership/[id]',
      },
    ],
  },
  {
    label: 'Tournament Volunteer',
    list: [
      {
        label: 'Staff',
        as: '/tournaments/volunteer/staff',
        href: '/tournaments/volunteer/[id]',
      },
      {
        label: 'Referees',
        as: '/tournaments/volunteer/referees',
        href: '/tournaments/volunteer/[id]',
      },
      {
        label: 'Snitches',
        as: '/tournaments/volunteer/snitches',
        href: '/tournaments/volunteer/[id]',
      },
      {
        label: 'Claim Expenses',
        as: '/tournaments/volunteer/claim-expenses',
        href: '/tournaments/volunteer/[id]',
      },
    ],
  },
  {
    label: 'Merch',
    as: '/merch',
    href: '/merch',
  },
  {
    label: 'News',
    as: '/news',
    href: '/news',
  },
];
