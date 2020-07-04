export const MAIN_NAVIGATION = [
  {
    label: 'About',
    path: '/about',
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
    path: '/play',
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
    path: '/volunteer',
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
    path: '/dashboard/events',
    list: [
      {
        label: 'Register',
        as: '/dashboard/events/register',
        href: '/dashboard/events/register',
      },
    ],
  },
  {
    label: 'My Membership',
    path: '/dashboard/membership',
    list: [
      {
        label: 'Manage QUK Membership',
        as: '/dashboard/membership/manage',
        href: '/dashboard/membership/[id]',
      },
      {
        label: 'Club',
        as: '/dashboard/membership/club',
        href: '/dashboard/membership/[id]',
      },
      {
        label: 'Transfer',
        as: '/dashboard/membership/transfer',
        href: '/dashboard/membership/[id]',
      },
    ],
  },
  {
    label: 'Tournament Volunteer',
    path: '/dashboard/tournaments',
    list: [
      {
        label: 'Staff',
        as: '/dashboard/tournaments/volunteer/staff',
        href: '/dashboard/tournaments/volunteer/[id]',
      },
      {
        label: 'Referees',
        as: '/dashboard/tournaments/volunteer/referees',
        href: '/dashboard/tournaments/volunteer/[id]',
      },
      {
        label: 'Snitches',
        as: '/dashboard/tournaments/volunteer/snitches',
        href: '/dashboard/tournaments/volunteer/[id]',
      },
      {
        label: 'Claim Expenses',
        as: '/dashboard/tournaments/volunteer/claim-expenses',
        href: '/dashboard/tournaments/volunteer/[id]',
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
