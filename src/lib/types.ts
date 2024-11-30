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

export type ClientLogin = {
  email: string,
  password: string
}

export type ClientNewMessage = {
  token: string,
  chat_id: string
  content: string
}

export type ClientNewChat = {
  token: string
}

export type ClientDeleteChat = {
  token: string,
  chat_id: string
}

export type ClientGetAudio = {
  token: string,
  message_id: string
}

export type ClientValidateToken = {
  token: string
}

export type ClientGetChat = {
  token: string,
  chat_id: string
}

export type GetAudio = {
  token: string,
  message_id: string
}

export type ClientBody =
  | { login: ClientLogin; new_message?: undefined; new_chat?: undefined; delete_chat?: undefined; get_chat?: undefined; get_chats?: undefined; get_audio?: undefined }
  | { login?: undefined; new_message: ClientNewMessage; new_chat?: undefined; delete_chat?: undefined; get_chat?: undefined; get_chats?: undefined; get_audio?: undefined }
  | { login?: undefined; new_message?: undefined; new_chat: ClientNewChat; delete_chat?: undefined; get_chat?: undefined; get_chats?: undefined; get_audio?: undefined }
  | { login?: undefined; new_message?: undefined; new_chat?: undefined; delete_chat: ClientDeleteChat; get_chat?: undefined; get_chats?: undefined; get_audio?: undefined }
  | { login?: undefined; new_message?: undefined; new_chat?: undefined; delete_chat?: undefined; get_chat: ClientGetChat; get_chats?: undefined; get_audio?: undefined }
  | { login?: undefined; new_message?: undefined; new_chat?: undefined; delete_chat?: undefined; get_chat?: undefined; get_chats: string; get_audio?: undefined }
  | { login?: undefined; new_message?: undefined; new_chat?: undefined; delete_chat?: undefined; get_chat?: undefined; get_chats?: undefined; get_audio: GetAudio };

export type ClientMessage = {
  kind: string,
  body: ClientBody
}

export type AudioInfo = {
  content: string,
  message_id: string
}

export type ServerResponse = {
  token: string,
  user_info: UserInfo,
  chat_id: string,
  message: Message,
  chats: string[],
  messages: Message[],
  audio: AudioInfo,
  deleted: string
}