import { Box, makeStyles } from '@material-ui/core'
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import { FC } from 'react'
import { authTokenVar, isLoggedInVar } from '~/apollo'
import { ACCESS_TOKEN } from '~/constants'

const useStyles = makeStyles({
  root: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: 'blue',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    fontSize: '1rem',
    maxWidth: '20rem',
    padding: '2rem',
  },
})

const DevLoginStatusViewer: FC = () => {
  const classes = useStyles()
  const [axiosResult, setAxiosResult] = useState(null)

  const axiosTest = useCallback(async () => {
    axios
      .get('/')
      .then((res) => {
        console.log('axios test', res)
        setAxiosResult(res)
      })
      .catch((err) => {
        console.log('axios test err', err)
        setAxiosResult(err)
      })
  }, [])

  return (
    <Box
      className={classes.root}
      zIndex="tooltip"
      position="fixed"
      bottom="20px"
      right="20px"
    >
      <div>{isLoggedInVar() ? 'login' : 'not login'}</div>
      <div>{authTokenVar()?.substring(0, 10) || 'not token'}</div>
      <div>
        {(process.browser && localStorage.getItem(ACCESS_TOKEN))
          ?.toString()
          .split('.')[2] || 'not local token'}
      </div>
      <button onClick={axiosTest}>axios 테스트</button>
      <div>{JSON.stringify(axiosResult)}</div>
    </Box>
  )
}

export default DevLoginStatusViewer
