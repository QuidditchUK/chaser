import * as postmark from 'postmark';

let postmarkClient: postmark.ServerClient | null;

const getPostmarkClient = () => {
  if (!postmarkClient) {
    postmarkClient = new postmark.ServerClient(
      process.env.NEXT_PUBLIC_POSTMARK_TOKEN
    );
  }

  return postmarkClient;
};

export default function sendEmail<T extends Templates>({
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

  const client = getPostmarkClient();

  return client.sendEmailWithTemplate({
    TemplateId: templateIds[template],
    TemplateModel: data,
    From: from,
    To: to,
    Cc: cc,
  });
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
  [key in Templates]: number;
};

const templateIds: TemplateOptions = {
  welcome: 19455866,
  forgotPassword: 19133707,
  contactForm: 19443708,
  volunteerForm: 19447684,
  newMember: 19486834,
  ediCommitteeForm: 20291343,
  nationalTeamInterest: 24631798,
  scoutingApplication: 24628586,
  scoutingResponse: 24632999,
  registerClubForm: 27851237,
  transferClubNewMember: 28284441,
  transferRequestForm: 28284444,
  transferDeclined: 28283993,
  transferApproved: 28284451,
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
