export interface IConversationWithNames {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  user: IUserValues;
  interlocutor: IUserValues;
}

export interface IUserValues {
  id: number | undefined;
  name: string | undefined;
}
