import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MailIcon from '@material-ui/icons/Mail'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from '@material-ui/core/styles'
import Link from 'next/link'
import HomeIcon from '@material-ui/icons/Home'
import AddIcon from '@material-ui/icons/Add'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import { Badge, Button, Container, Menu, MenuItem } from '@material-ui/core'
import { useMe } from '~/hooks/useMe'
import CustomModal from './CustomModal'
import GithubLoginDiv from './GihhubLoginDiv'
import { authTokenVar, isLoggedInVar } from '~/apollo'
import axios from 'axios'
import LogoutDiv from './LogoutDiv'
import { AccountCircle } from '@material-ui/icons'
import useAnchor from '~/hooks/useAnchor'
import DevLoginStatusViewer from './DevLoginStatusViewer'
import { useReactiveVar } from '@apollo/client'
const navList: [string, string, React.ReactElement?][] = [
  ['/', '홈화면', <HomeIcon key={1} />],
  ['/room', 'Room', <AddIcon key={2} />],
  ['/roomCreate', '방 만들기', <AddIcon key={3} />],
  ['/hello', '첫화면', <AccountBoxIcon key={4} />],
  ['/settings/profile', '프로필 설정'],
  ['/room/123', '방 설정'],
]

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        // width: `calc(100% - ${drawerWidth}px)`,
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        height: '4rem',
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      flexShrink: 1,
      padding: theme.spacing(3),
    },
    grow: {
      flexGrow: 1,
    },
  })
)

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  children: React.ReactNode
  window?: () => Window
  isSearch?: boolean
}

export default function Layout(props: Props) {
  const { window, children, isSearch } = props
  const classes = useStyles()
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, handleMenu, handleClose] = useAnchor()
  const { data } = useMe()
  const isLoggedIn = useReactiveVar(isLoggedInVar)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {navList.map((navItem) => {
          const [url, name, icon] = navItem
          return (
            <Link href={url} key={name}>
              <ListItem button>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            </Link>
          )
        })}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  )

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Gitmoa
          </Typography>
          <div className={classes.grow}></div>
          {!isLoggedIn && (
            <div>
              <IconButton aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
            </div>
          )}
          <CustomModal text={isLoggedIn ? 'Logout' : 'Login'}>
            {isLoggedIn ? (
              <LogoutDiv handleClose />
            ) : (
              <GithubLoginDiv handleClose />
            )}
          </CustomModal>
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        <CssBaseline />

        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <Container className={classes.content}>{children}</Container>
      </div>
      {process.env.NODE_ENV === 'development' && <DevLoginStatusViewer />}
    </>
  )
}
