export interface CreateSupportRequestDto {
  user: string; // id
  text: string;
}

export interface SendMessageDto {
  author: string; //id
  supportRequest: string; //id
  text: string;
}
export interface MarkMessagesAsReadDto {
  user: string; //id
  supportRequest: string; //id
  createdBefore: Date;
}

export interface GetChatListParams {
  user: string | null; //id | null
  isActive: boolean;
  limit: number;
  offset: number;
}
