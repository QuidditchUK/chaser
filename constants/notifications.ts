export const TRANSFERS_OPEN = 'TRANSFERS_OPEN';
export const TRANSFERS_CLOSED = 'TRANSFERS_CLOSED';
export const TRANSFER_APPROVED = 'TRANSFER_APPROVED';
export const TRANSFER_DECLINED = 'TRANSFER_DECLINED';
export const SCOUTING_WINDOW_OPEN = 'SCOUTING_WINDOW_OPEN';
export const SCOUTING_WINDOW_CLOSING_24 = 'SCOUTING_WINDOW_CLOSING_24';
export const SCOUTING_WINDOW_CLOSED = 'SCOUTING_WINDOW_CLOSED';
export const EVENT_REGISTRATION_OPEN = 'EVENT_REGISTRATION_OPEN';
export const EVENT_REGISTRATION_CLOSING_24 = 'EVENT_REGISTRATION_CLOSING_24';
export const EVENT_REGISTRATION_CLOSED = 'EVENT_REGISTRATION_CLOSED';
export const CLUB_MANAGEMENT = 'CLUB_MANAGEMENT';
export const CLUB_MEMBER_REMOVED = 'CLUB_MEMBER_REMOVED';
export const CLUB_MEMBER_ADDED = 'CLUB_MEMBER_ADDED';
export const STUDENT_SUMMER_PASS_PURCHASED = 'STUDENT_SUMMER_PASS_PURCHASED';
export const PUSH_NOTIFICATION_ENABLED = 'PUSH_NOTIFICATION_ENABLED';
export const NEWS = 'NEWS';

export type NotificationType =
  | typeof TRANSFERS_OPEN
  | typeof TRANSFERS_CLOSED
  | typeof TRANSFER_APPROVED
  | typeof TRANSFER_DECLINED
  | typeof SCOUTING_WINDOW_OPEN
  | typeof SCOUTING_WINDOW_CLOSING_24
  | typeof SCOUTING_WINDOW_CLOSED
  | typeof EVENT_REGISTRATION_OPEN
  | typeof EVENT_REGISTRATION_CLOSING_24
  | typeof EVENT_REGISTRATION_CLOSED
  | typeof CLUB_MANAGEMENT
  | typeof CLUB_MEMBER_ADDED
  | typeof CLUB_MEMBER_REMOVED
  | typeof STUDENT_SUMMER_PASS_PURCHASED
  | typeof PUSH_NOTIFICATION_ENABLED
  | typeof NEWS;

export type NotificationDataType<T extends NotificationType> =
  T extends typeof TRANSFERS_OPEN
    ? never
    : T extends typeof TRANSFERS_CLOSED
    ? never
    : T extends typeof TRANSFER_APPROVED
    ? ClubNameData
    : T extends typeof TRANSFER_DECLINED
    ? ClubNameData
    : T extends typeof CLUB_MANAGEMENT
    ? ClubNameData
    : T extends typeof CLUB_MEMBER_ADDED
    ? ClubAndUserData
    : T extends typeof CLUB_MEMBER_REMOVED
    ? ClubNameData
    : T extends typeof STUDENT_SUMMER_PASS_PURCHASED
    ? ClubNameData
    : T extends typeof PUSH_NOTIFICATION_ENABLED
    ? never
    : T extends typeof NEWS
    ? NewsData
    : never;

type ClubNameData = {
  club_name: string;
};

type ClubAndUserData = {
  club_name: string;
  user_name: string;
};

type NewsData = {
  title: string;
  body: string;
  data?: any;
  image?: any;
};

type NotificationPayloadOptions = {
  [key in NotificationType]: (props?: NotificationDataType<key>) => string;
};

type PartialNotificationPayloadOptions = Partial<NotificationPayloadOptions>;

export const NotificationLink = {
  [TRANSFERS_OPEN]: {
    url: '/dashboard/membership/club',
  },
  [TRANSFERS_CLOSED]: {
    url: '/dashboard/membership/club',
  },
  [TRANSFER_APPROVED]: {
    url: '/dashboard/membership/club',
  },
  [TRANSFER_DECLINED]: {
    url: '/dashboard/membership/club',
  },
  [CLUB_MANAGEMENT]: {
    url: '/dashboard/club-management',
  },
  [CLUB_MEMBER_ADDED]: {
    url: '/dashboard/club-management',
  },
  [CLUB_MEMBER_REMOVED]: {
    url: '/dashboard/membership/club',
  },
  [STUDENT_SUMMER_PASS_PURCHASED]: {
    url: '/dashboard/membership/student-summer-pass',
  },
};

export const NOTIFICATION_PAYLOADS: PartialNotificationPayloadOptions = {
  [CLUB_MANAGEMENT]: ({ club_name }) =>
    `You are now the manager of ${club_name}`,
  [TRANSFER_APPROVED]: ({ club_name }) =>
    `Your transfer to ${club_name} has been approved`,
  [TRANSFER_DECLINED]: ({ club_name }) =>
    `Your transfer to ${club_name} has been declined`,
  [CLUB_MEMBER_REMOVED]: ({ club_name }) =>
    `You have been removed as a member of ${club_name}`,
  [CLUB_MEMBER_ADDED]: ({ club_name, user_name }) =>
    `${user_name} has joined ${club_name}`,
  [STUDENT_SUMMER_PASS_PURCHASED]: ({ club_name }) =>
    `Your Student Summer Pass with ${club_name} has been activated`,
};

type PushNotificationPayloadOptions = {
  [key in NotificationType]: (props?: NotificationDataType<key>) => {
    title: string;
    body: string;
    actions?: { action: NotificationType; title: string }[];
    image?: string;
    data?: any;
  };
};

type PartialPushNotification = Partial<PushNotificationPayloadOptions>;

export const PUSH_PAYLOADS: PartialPushNotification = {
  [TRANSFER_APPROVED]: ({ club_name }) => ({
    title: 'Your transfer has been approved',
    body: `Transfer to ${club_name} has been approved`,
  }),
  [TRANSFER_DECLINED]: ({ club_name }) => ({
    title: 'Your transfer has been declined',
    body: `Transfer to ${club_name} has been declined`,
  }),
  [TRANSFERS_OPEN]: () => ({
    title: 'Transfers Open',
    body: 'The transfer window has opened, click to transfer clubs',
    actions: [{ action: TRANSFERS_OPEN, title: 'Transfer' }],
  }),
  [TRANSFERS_CLOSED]: () => ({
    title: 'Transfers Closed',
    body: 'The transfer window has now closed.',
  }),
  PUSH_NOTIFICATION_ENABLED: () => ({
    title: 'Push Notifications enabled',
    body: 'You will now recieve push notifications from QuidditchUK on this device',
  }),
  [CLUB_MANAGEMENT]: ({ club_name }) => ({
    title: 'You are now the club manager',
    body: `${club_name} is now managed by you on QuidditchUK`,
    actions: [{ action: CLUB_MANAGEMENT, title: 'Manage Club' }],
  }),
  [CLUB_MEMBER_ADDED]: ({ club_name, user_name }) => ({
    title: 'New Member',
    body: `${user_name} has joined ${club_name}`,
    actions: [{ action: CLUB_MANAGEMENT, title: 'Manage Club' }],
  }),
  [STUDENT_SUMMER_PASS_PURCHASED]: ({ club_name }) => ({
    title: 'Student Summer Pass',
    body: `Your Student Summer Pass with ${club_name} has been activated`,
  }),
  NEWS: ({ title, body, image, data }) => ({
    title,
    body,
    image,
    data,
  }),
};
