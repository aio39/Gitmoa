import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  makeVar,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'

export const isLoggedInVar = makeVar(Boolean(false))
export const authTokenVar = makeVar(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6Imdob19KOEdnMHB3eUZOd1o3V2VpNXBwVG1UWG04U01lUXQxM2dEUW4iLCJpZCI6IjY4MzQ4MDcwIiwiaWF0IjoxNjI3OTg2Mjg3LCJleHAiOjE2Mjg1OTEwODd9.AumU4MA9mWswD3GVfbtK3rJtj8HJtVk6FjZHWbKSuPI'
)
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'x-jwt': authTokenVar() || '',
    },
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
      )
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

export const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar()
            },
          },
          token: {
            read() {
              return authTokenVar()
            },
          },
        },
      },
    },
  }),
})
