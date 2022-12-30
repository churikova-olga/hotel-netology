import { Message, SupportRequest } from '../support/mongoose/support.schema';

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

export interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: string): Promise<Message[]>;
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: string, user: string): Promise<Message[]>;
}

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: string, user: string): Promise<Message[]>;
  closeRequest(supportRequest: string): Promise<void>;
}
