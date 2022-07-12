import createService from './index';

const contactService = {
  contactForm: ({ data, ...params }) => ({
    method: 'post',
    url: '/contact/form',
    data,
    ...params,
  }),

  volunteerForm: ({ data, ...params }) => ({
    method: 'post',
    url: '/contact/volunteer',
    data,
    ...params,
  }),

  ediForm: ({ data, ...params }) => ({
    method: 'post',
    url: '/contact/edi',
    data,
    ...params,
  }),
};

export default createService(contactService);
