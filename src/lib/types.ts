export type UserInfo = {
  token: string;
  name: string;
  email: string;
};

export type Message = {
  id: string;
  message: CMessage;
  created_at: number;
};

export type CMessage = {
  role: string;
  content: string;
};
