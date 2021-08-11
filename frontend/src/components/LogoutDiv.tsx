import { Box, Button, Link, makeStyles, Typography } from '@material-ui/core'
import { useRouter } from 'next/router'
import React from 'react'
import { GoMarkGithub } from 'react-icons/go'
import { resetLoginData } from '~/util'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
    '& > *:not(:last-child)': {
      marginBottom: '2rem',
    },
    '& h1': {
      fontFamily: 'fantasy',
      marginBottom: '2rem',
    },
    '& button': {
      padding: '0.5rem 1.2rem',
      fontSize: '1rem',
    },
    '& .github': {
      backgroundColor: 'black',
      color: 'white',
      marginRight: '1rem',
      '& svg': {
        height: '1.2rem',
        width: '1.2rem',
        marginRight: '0.5rem',
      },
    },
    '& .buttonWrapper': {
      width: '100%',
      justifyContent: 'center',
      display: 'flex',
      gap: '1rem',
    },
  },
})

const GithubLoginDiv = ({ handleClose }) => {
  const classes = useStyles()
  const router = useRouter()

  return (
    <div className={classes.root}>
      <Typography variant="h4">로그아웃 하시겠습니까?.</Typography>
      <div className="buttonWrapper">
        <Button
          color="primary"
          variant="contained"
          onClick={(e) => {
            resetLoginData()
            router.push('/')
          }}
        >
          Ok, Logout
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleClose}
        >
          close
        </Button>
      </div>
    </div>
  )
}

export default GithubLoginDiv
