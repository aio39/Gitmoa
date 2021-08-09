import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core'
import React from 'react'

const UserList = ({
  data,
  userData,
}: {
  data: any
  userData: Map<number, any>
}) => {
  console.log(userData.get(1))
  return (
    <List>
      {data.map((data, idx) => (
        <ListItem key={idx}>
          <ListItemAvatar>
            <Avatar>
              <img
                src="https://lh3.googleusercontent.com/a/AATXAJwkY_CnavMts6abt1Ahg_b3TM5TXP55SyCahSzD=s96-c"
                alt=""
              />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Single-line item" />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete">
              <div>{data}</div> {userData.get(parseInt(data))?.userName}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}

export default UserList
