import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core'
import Layout from '../components/layout'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client'
import { findRoomsQuery } from '~/__generated__/findRoomsQuery'
import LoadingDiv from '~/components/LoadingDiv'
const useStyles = makeStyles({
  roomCard: {
    width: '100%',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})

const ROOMS_QUERY = gql`
  query findRoomsQuery {
    findRooms {
      rooms {
        id
        name
        description
        maxNum
        creator {
          username
        }
        tags {
          name
          icon
        }
      }
    }
  }
`

// const roomList = Array(20)
//   .fill(0)
//   .map((_, idx) => ({
//     roomNum: 101,
//     name: '방이름.' + idx,
//     creatorId: 'aio',
//     creatorAvatar: 'https://avatars.githubusercontent.com/u/68348070?v=4',
//     description: '설명설명',
//     isSecret: true,
//     max: 40,
//     count: 20,
//     tags: [
//       { name: 'tech', icon: '/icon/tech.svg' },
//       { name: 'javascript', icon: '/icon/javascript.png' },
//       { name: 'rust', icon: '/icon/rust.png' },
//       { name: 'python', icon: '/icon/python.png' },
//       { name: 'typescript', icon: '/icon/typescript.png' },
//       // { name: 'rust', icon: '/icon/rust.png' },
//       // { name: 'python', icon: '/icon/python.png' },
//       // { name: 'typescript', icon: '/icon/typescript.png' },
//       // { name: 'rust', icon: '/icon/rust.png' },
//       // { name: 'python', icon: '/icon/python.png' },
//       // { name: 'typescript', icon: '/icon/typescript.png' },
//     ],
//   }))

export default function Rooms() {
  const classes = useStyles()
  const { data, loading } = useQuery<findRoomsQuery>(ROOMS_QUERY, {
    fetchPolicy: 'no-cache',
  })

  const roomList = data?.findRooms?.rooms

  if (!data && loading) {
    return (
      <Layout>
        <LoadingDiv />
      </Layout>
    )
  }

  return (
    <Layout>
      <Typography variant="h4" component="h4">
        방 리스트
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Typography</Typography>
        </AccordionDetails>
      </Accordion>
      <Grid
        container
        spacing={3}
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        {roomList.map((room) => (
          <Grid item xs={6} md={3} key={room.id}>
            <Card className={classes.roomCard}>
              <CardActionArea>
                <Link href={`/room/${room.id}`}>
                  <CardContent>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      {room.creator.username}
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {room.name}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      adjective
                    </Typography>
                    <Typography variant="body2" component="p">
                      well meaning and kindly.
                      <br />
                      {'"a benevolent smile"'}
                    </Typography>
                    <div>
                      {room.tags.map((data) => {
                        return (
                          <Chip
                            clickable={false}
                            key={data.name}
                            variant="outlined"
                            avatar={<Avatar alt={data.name} src={data.icon} />}
                            label={data.name}
                          />
                        )
                      })}
                    </div>
                  </CardContent>
                </Link>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  참가하기
                </Button>
                <Button size="small" color="primary">
                  정보
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  )
}
