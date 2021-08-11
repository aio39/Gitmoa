import Layout from '../../components/layout'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'
import RoomWeekendBar from '~/components/roomDetailPage/weekendsDataChart'
import { useMemo } from 'react'
import { Box, Grid, Typography } from '@material-ui/core'
import UserList from '~/components/roomDetailPage/UserList'
import { FC } from 'react'

const TypoA: FC<{ text: string }> = ({ text }) => {
  return (
    <Typography variant="h4" component="div">
      <Box textAlign="center" fontWeight={600}>
        {text}
      </Box>
    </Typography>
  )
}

const Room = () => {
  const router = useRouter()
  const { roomId } = router.query

  const [weekData, setWeekData] = useState([
    {
      date: '2021-07-01',
      success: true,
      failedList: [1, 2, 3],
      successList: [4],
    },
    {
      date: '2021-07-02',
      success: true,
      failedList: [1, 3],
      successList: [4, 2],
    },
    {
      date: '2021-07-03',
      success: false,
      failedList: [1, 2, 3, 4],
      successList: [],
    },
    {
      date: '2021-07-04',
      success: true,
      failedList: [1, 2, 3],
      successList: [4],
    },
    {
      date: '2021-07-05',
      success: true,
      failedList: [1, 2, 3],
      successList: [4],
    },
    {
      date: '2021-07-06',
      success: true,
      failedList: [1, 2, 3],
      successList: [4],
    },
    {
      date: '2021-07-07',
      success: true,
      failedList: [1, 2, 3],
      successList: [4],
    },
  ])

  const [roomData, setRoomData] = useState({
    roomName: '가즈아아방',
    userData: [
      { userId: 1, userName: '1번' },
      { userId: 2, userName: '2번' },
      { userId: 3, userName: '3번' },
      { userId: 4, userName: '4번' },
    ],
  })

  const totalUserNumber = useMemo(() => roomData.userData.length, [roomData])

  const memoWeekData = useMemo(() => {
    return weekData.map((day) => ({
      date: day.date,
      success: day.successList?.length,
      successColor: 'hsl(77, 70%, 50%)',
      fail: day.failedList?.length,
      failedList: day.failedList,
      successList: day.successList,
    }))
  }, [weekData, roomData])

  const memoUserData = useMemo(() => {
    const userMap = new Map()
    for (const user of roomData.userData) {
      userMap.set(user.userId, user)
    }
    return userMap
  }, [roomData])

  return (
    <Layout>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h2"> 방 - {roomId}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box height="500px">
            <RoomWeekendBar weekData={memoWeekData} userData={memoUserData} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <TypoA text="성공!" />
          <UserList
            data={memoWeekData[1].successList}
            userData={memoUserData}
          />
        </Grid>
        <Grid item xs={6}>
          <TypoA text="실패" />
          <UserList
            data={memoWeekData[1].successList}
            userData={memoUserData}
          />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Room
