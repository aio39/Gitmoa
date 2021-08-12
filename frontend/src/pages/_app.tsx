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
import checkJWT from '~/checkJWTExpire'

axios.defaults.baseURL = BACKEND_URL
axios.defaults.withCredentials = true

// get new Access Token
axios.interceptors.request.use(
  async (config) => {
    if (!isLoggedInVar()) return config

    const headers = {
      Authorization: `Bearer ${authTokenVar()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    const { isValid, isLeft } = checkJWT
      .create({ time: '10m' })
      .check(authTokenVar())

    if (!isValid) {
      isLoggedInVar(false)
      authTokenVar(null)
      localStorage.removeItem(ACCESS_TOKEN)
      alert('로그인 토큰 갱신에 실패하였습니다.')
    }

    if (!isLeft) {
      const { data } = await axios
        .create()
        .get('/auth/refresh', {
          headers,
        })
        .catch((err) => {
          isLoggedInVar(false)
          authTokenVar(null)
          localStorage.removeItem(ACCESS_TOKEN)
          alert('로그인 토큰 갱신에 실패하였습니다.')
          console.error(err)
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
