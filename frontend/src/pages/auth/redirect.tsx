import { CircularProgress, makeStyles } from '@material-ui/core'
import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useState } from 'react'
import { ClapSpinner } from 'react-spinners-kit'
import { authTokenVar, isLoggedInVar } from '~/apollo'
import { ACCESS_TOKEN } from '~/constants'
import { removeLoginData, setLoggedIn } from '~/util'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#22272d',
    '& .MuiCircularProgress-root': {
      margin: '2rem',
    },
    '& .MuiCircularProgress-svg': {
      color: '#39c5bb',
    },
    '& h3': {
      fontSize: '1.5rem',
      margin: '0.5rem 0',
    },
    '& h1': {
      fontSize: '5rem',
      margin: '0.5rem 0',
    },
  },
  green: {
    color: '#38d353',
  },
  red: {
    color: '#e5534b',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '10rem',
  },
})

type redirectRes = {
  message: string
  success: boolean
  user?: object
  jwt?: string
}

export default function redirect() {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { code } = router.query

  const classes = useStyles()

  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (router.isReady && code === undefined) {
      setLoading(false)
      setError(true)
    }

    axios
      .create()
      .get<redirectRes>(`/auth/redirect?code=${code}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        if (data.jwt) {
          setLoggedIn(data.jwt)
        }
      })
      .catch((err) => {
        console.error('axios 실패', err)
        setError(true)
        removeLoginData()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [code])

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        router.push(`/${error ? 'login' : 'room'}`)
      }, 2000)
    }
  }, [loading])

  useEffect(() => {
    router.prefetch('/room')
  }, [])

  return (
    <div className={classes.root}>
      {loading && (
        <>
          {router.isReady && code === undefined ? (
            <>
              <div className={classes.container}>
                <h1>✋</h1>
              </div>
              <h3>잘못된 접근입니다.</h3>
              <h3> 홈으로 이동합니다.</h3>
            </>
          ) : (
            <>
              <div className={classes.container}>
                <CircularProgress size="5rem" />
              </div>
              <h3>로그인 중입니다 </h3>
              <h3>잠시만 기달려 주세요.</h3>
            </>
          )}
        </>
      )}
      {!loading && error && (
        <>
          <div className={classes.container}>
            <h1 className={classes.red}>⁉️</h1>
          </div>
          <h3>로그인에 실패했습니다.</h3>
          <h3>로그인 페이지로 이동합니다</h3>
        </>
      )}
      {!loading && !error && (
        <>
          <div className={classes.container}>
            <h1 className={classes.green}>✔️</h1>
          </div>
          <h3>로그인에 성공했습니다.</h3>
          <h3> 잠시 후 홈 화면으로 이동</h3>
        </>
      )}
    </div>
  )
}
