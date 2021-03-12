export const MAIN_NAVIGATION = [
  {
    label: 'COVID',
    href: '/covid',
  },
  {
    label: 'About',
    path: '/about',
    children: [
      {
        label: 'What is Quidditch',
        href: '/about/what-is-quidditch',
      },
      {
        label: 'Leadership',
        href: '/about/leadership',
      },
      {
        label: 'Meet the Team',
        href: '/about/meet-the-team',
      },
      {
        label: 'Documents & Policies',
        href: '/about/documents-and-policies',
      },
      {
        label: 'Minutes',
        href: '/about/minutes',
      },
    ],
  },
  {
    label: 'Play',
    path: '/play',
    children: [
      {
        label: 'Find Quidditch',
        href: '/find-quidditch',
      },
      {
        label: 'Getting Started',
        href: '/play/getting-started',
      },
      {
        label: 'Rulebook',
        href: '/play/rulebook',
      },
      {
        label: 'Official Events',
        href: '/play/official-events',
      },
    ],
  },
  {
    label: 'Volunteer',
    path: '/volunteer',
    children: [
      {
        label: 'Roles',
        href: '/volunteer/roles',
      },
      // {
      //   label: 'Coaches',
      //   as: '/volunteer/coaches',
      //   href: '/volunteer/[id]',
      // },
      {
        label: 'Referees',
        href: '/volunteer/referees',
      },
      {
        label: 'Snitches',
        href: '/volunteer/snitches',
      },
      {
        label: 'Tournaments',
        href: '/volunteer/tournaments',
      },
    ],
  },
  {
    label: 'Youth',
    href: '/youth',
  },
  {
    label: 'National Teams',
    path: '/programmes/national-teams',
    paths: [
      '/programmes/team-england',
      '/programmes/team-wales',
      '/programmes/team-scotland',
      '/programmes/national-teams',
    ],
    children: [
      {
        label: 'Team UK',
        href: '/programmes/team-england',
      },
      {
        label: 'Team Scotland',
        href: '/programmes/team-scotland',
      },
      {
        label: 'Team Wales / Cymru',
        href: '/programmes/team-wales',
      },
    ],
  },
  {
    label: 'News',
    href: '/news',
  },
  {
    label: 'Merch',
    href: '/merch',
  },
];

export const DASHBOARD_NAVIGATION = [
  {
    label: 'My Membership',
    path: '/dashboard/membership',
    children: [
      {
        label: 'QUK Membership',
        href: '/dashboard/membership/manage',
      },
      {
        label: 'Club',
        href: '/dashboard/membership/club',
      },
      // {
      //   label: 'Transfer',
      //   as: '/dashboard/membership/transfer',
      //   href: '/dashboard/membership/[id]',
      // },
    ],
  },
  {
    label: 'News',
    href: '/news',
  },
  {
    label: 'Merch',
    href: '/merch',
  },
];

export const ACCOUNT_NAVIGATION = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'My info',
    href: '/dashboard/account/info',
  },
];
