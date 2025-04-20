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

export type MsgSendRequestPayload = {
  message: {
    to: string,
    text: string,
  }
}

export type MsgSentResponsePayload = {
  message: UserMessage;
}

export type MsgDeleteRequestPayload = {
  message: {
    id: string,
  }
}

export type MsgDeleteResponsePayload = {
  message: {
    id: string,
    status: {
      isDeleted: boolean,
    }
  }
}

export type MsgReadRequestPayload = {
  message: {
    id: string,
  }
}

export type MsgReadResponsePayload = {
  message: {
    id: string,
    status: {
      isReaded: boolean,
    }
  }
}

export type MsgEditRequestPayload = {
  message: {
    id: string,
    text: string
  }
}
export type MsgEditResponsePayload = {
  message: {
    id: string,
    text: string,
    status: {
      isEdited: boolean,
    }
  }
}


