import { Box, Button, Link, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { GoMarkGithub } from 'react-icons/go'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
    '& > *:not(:last-child)': {
      marginBottom: '1rem',
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
  },
})

const GithubLoginDiv = ({ handleClose }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h1">Gitmoa</Typography>
      <Typography variant="h4">Github Oauth로 로그인합니다.</Typography>
      <Box>
        <Link href="http://localhost:4000/auth/">
          <Button aria-label="Github Login Button" className="github">
            <GoMarkGithub />
            Login with GitHub
          </Button>
        </Link>
        <Button
          className="cancel"
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleClose}
        >
          close
        </Button>
      </Box>
    </div>
  )
}

export default GithubLoginDiv
