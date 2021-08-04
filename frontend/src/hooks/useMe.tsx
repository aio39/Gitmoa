import { gql, useQuery } from '@apollo/client'
import { findMeQuery } from '~/__generated__/findMeQuery'

export const FIND_ME_QUERY = gql`
  query findMeQuery {
    findUserMe {
      user {
        id
        displayName
        profileUrl
      }
    }
  }
`

export const useMe = () => {
  return useQuery<findMeQuery>(FIND_ME_QUERY)
}
