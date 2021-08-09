import { FC } from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { authTokenVar, client, isLoggedInVar } from '~/apollo'
import { ApolloProvider } from '@apollo/client'
import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '~/material/theme'
import axios from 'axios'
import { ACCESS_TOKEN, BACKEND_URL } from '~/constants'
import jwt_decode from 'jwt-decode'

axios.defaults.baseURL = BACKEND_URL
axios.defaults.withCredentials = true

axios.interceptors.request.use(
  async (config) => {
    console.log('axios interceipor!')
    console.log(authTokenVar())
    console.log(isLoggedInVar())
    if (!isLoggedInVar()) return config

    const headers = {
      Authorization: `Bearer ${authTokenVar()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    const { exp }: { exp: string } = jwt_decode(authTokenVar())
    const isRemain5m = parseInt(exp) - Date.now() / 1000 > 60 * 5
    console.log(isRemain5m, exp)

    if (!isRemain5m) {
      const { data } = await axios
        .create()
        .get('/auth/refresh', {
          headers,
        })
        .catch((err) => {
          console.log(err)
          throw new Error('is Remain request Error')
        })
      authTokenVar(data.jwt)

      localStorage.setItem(ACCESS_TOKEN, data.jwt)
    }

    config.headers = headers
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

const App: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  React.useEffect(() => {
    authTokenVar(localStorage.getItem(ACCESS_TOKEN))
    isLoggedInVar(localStorage.getItem(ACCESS_TOKEN) ? true : false)
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <ApolloProvider client={client}>
        <Head>
          <title>GitMoa</title>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </>
  )
}

export default App
