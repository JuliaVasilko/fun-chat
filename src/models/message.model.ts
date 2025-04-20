export type UserMessage = {
  id: string,
  from: string,
  to: string,
  text: string,
  datetime: number,
  status: {
    isDelivered: boolean,
    isReaded: boolean,
    isEdited: boolean,
  }
}

export type MsgFromUserRequestPayload = {
  user: {
    login: string
  }
}

export type MsgFromUserResponsePayload = {
  messages: UserMessage[];
}


