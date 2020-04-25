export const TOP_NAVIGATION = [
  {
    label: 'About',
    href: '/about',
    as: '/[id]',
    list: [
      {
        label: 'What is Quidditch',
        href: '/about/what-is-quidditch',
        as: '/about/[id]',
      },
      {
        label: 'History',
        href: '/about/history',
        as: '/about/[id]',
      },
      {
        label: 'Team UK',
        href: '/team-uk',
        as: '/[id]',
      },
      {
        label: 'Executive',
        href: '/about/meet-the-executive',
        as: '/about/[id]',
      },
    ],
  },
  {
    label: 'Get Involved',
    href: '/get-involved',
    as: '/[id]',
    list: [
      {
        label: 'Refereeing',
        href: '/get-involved/refereeing',
        as: '/get-involved/[id]',
      },
      {
        label: 'Coaching',
        href: '/get-involved/coaching',
        as: '/get-involved/[id]',
      },
      {
        label: 'Volunteering',
        href: '/get-involved/volunteering',
        as: '/get-involved/[id]',
      },
    ],
  },
  {
    label: 'News',
    href: '/news',
    as: '/news',
  },
];
