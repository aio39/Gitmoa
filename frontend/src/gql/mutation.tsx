import { gql } from '@apollo/client'

export const CREATE_ROOM_MUTATION = gql`
  mutation createRoomMutation($createRoomInput: CreateRoomInput!) {
    createRoom(input: $createRoomInput) {
      ok
      error
      roomId
      secretLink
    }
  }
`
