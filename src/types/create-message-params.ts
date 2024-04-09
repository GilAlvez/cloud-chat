export type CreateMessageParams = {
  roomId: string;
  authorId: string;
  data: Record<string, any>;
  type: "text";
};
