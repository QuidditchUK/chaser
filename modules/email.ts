import sendgrid, { MailService } from '@sendgrid/mail';

let sendgridClient: MailService | null;

const getSendgridClient = () => {
  if (!sendgridClient) {
    sendgrid.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);
    sendgridClient = sendgrid;
  }

  return sendgridClient;
};

export default async function sendEmail<T extends Templates>({
  template,
  data,
  to,
  from = 'admin@quidditchuk.org',
  cc,
}: {
  template: T;
  data: DataType<T>;
  to: string;
  from?: string;
  cc?: string;
}) {
  // no-op while developing
  if (process.env.NODE_ENV !== 'production') {
    console.log({ to, template, data, from, cc });
    return {};
  }

  const client = getSendgridClient();

  try {
    await client.send({
      templateId: templateIds[template],
      dynamicTemplateData: data,
      from,
      to,
      cc,
    });
  } catch (err) {
    console.log(err);
  }

  return;
}

type Templates =
  | 'welcome'
  | 'forgotPassword'
  | 'contactForm'
  | 'volunteerForm'
  | 'newMember'
  | 'ediCommitteeForm'
  | 'nationalTeamInterest'
  | 'scoutingApplication'
  | 'scoutingResponse'
  | 'registerClubForm'
  | 'transferClubNewMember'
  | 'transferRequestForm'
  | 'transferDeclined'
  | 'transferApproved';

type TemplateOptions = {
  [key in Templates]: string;
};

const templateIds: TemplateOptions = {
  welcome: 'd-0b4360295d454c6ca334be2aaec50770',
  forgotPassword: 'd-d1c2c93d98c14ad7aa098ea138132ae2',
  contactForm: 'd-df84ce69bcef4c4786aa90fddfe6180f',
  volunteerForm: 'd-b58d8c9d99c34d4fa38fbb3e8b4998e8',
  newMember: 'd-87974a7e6f9744d7bc1b253562c86761',
  ediCommitteeForm: 'd-79027f2dd974486a93f738380b40796c',
  nationalTeamInterest: 'd-4948efce11dd4d89b4f836541dbb54f3',
  scoutingApplication: 'd-12c80f42861b4483a3e16605e6079e17',
  scoutingResponse: 'd-9013b700912c41e5bec306aa1f3c581d',
  registerClubForm: 'd-80bc196e28bc4bcaa4cf8acda3e2e99f',
  transferClubNewMember: 'd-43193539dcc4491b852743c8b64a7193',
  transferRequestForm: 'd-293537fd38c64b1197d13db3263732da',
  transferDeclined: 'd-cfd0e15d732e4d309f51315187b41572',
  transferApproved: 'd-eee3725c92b842a4af0463d3dbf9dc57',
};

type DataType<T extends Templates> = T extends 'welcome'
  ? WelcomeData
  : T extends 'contactForm'
  ? ContactFormData
  : T extends 'forgotPassword'
  ? ForgotPasswordData
  : T extends 'volunteerForm'
  ? VolunteerFormData
  : T extends 'ediCommitteeForm'
  ? EdiCommitteeFormData
  : T extends 'newMember'
  ? NewClubMemberData
  : T extends 'nationalTeamInterest'
  ? NationalTeamInterestFormData
  : T extends 'scoutingApplication'
  ? ScoutingApplicationFormData
  : T extends 'scoutingResponse'
  ? ScoutingResponseData
  : T extends 'registerClubForm'
  ? RegisterClubFormData
  : T extends 'transferClubNewMember'
  ? TransferClubNewMemberData
  : T extends 'transferRequestForm'
  ? TransferRequestFormData
  : T extends 'transferDeclined'
  ? TransferDeclinedData
  : T extends 'transferApproved'
  ? TransferApprovedData
  : null;

// DATA MODELS
type WelcomeData = {
  first_name: string;
};

export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ForgotPasswordData = {
  reset_url: string;
};

export type VolunteerFormData = {
  name: string;
  email: string;
  role: string;
  message: string;
};

export type EdiCommitteeFormData = {
  name: string;
  email: string;
  club: string;
  chair?: boolean;
  message: string;
};

type NewClubMemberData = {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
};

type NationalTeamInterestFormData = {
  email: string;
  first_name: string;
  last_name: string;
  club_name: string;
  first_team: string;
  second_team: string;
  third_team: string;
  position: string;
  playstyle: string;
  years: number;
  experience: string;
};

type ScoutingApplicationFormData = {
  email: string;
  pronouns: string;
  first_name: string;
  last_name: string;
  club_name: string;
  team: string;
  event: string;
  number: number;
  first_team: string;
  second_team: string;
  third_team: string;
  position: string;
  years: number;
  playstyle: string;
  experience: string;
};

type ScoutingResponseData = {
  first_name: string;
  event: string;
};

export type RegisterClubFormData = {
  name: string;
  email: string;
  clubName: string;
  location: string;
  league: string;
  message: string;
};

type TransferClubNewMemberData = {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
};

type TransferRequestFormData = {
  first_name: string;
  last_name: string;
  new_club_name: string;
  prev_club_name: string;
};

type TransferDeclinedData = {
  first_name: string;
  new_club_name: string;
};

type TransferApprovedData = {
  first_name: string;
  new_club_name: string;
};
