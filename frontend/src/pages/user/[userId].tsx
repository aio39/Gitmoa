import Layout from '../../components/layout'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import RoomWeekendBar from '~/components/roomDetailPage/weekendsDataChart'
import { useMemo } from 'react'
import { Box, Grid, Typography } from '@material-ui/core'
import UserList from '~/components/roomDetailPage/UserList'
import { FC } from 'react'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import {
  getUserDayStatsQuery,
  getUserDayStatsQueryVariables,
} from '~/__generated__/getUserDayStatsQuery'
import { useMe } from '~/hooks/useMe'
import UserNivoBar from '~/components/user/UserNivoBar'
import WeekendPicker from '~/components/weekendPicker'
import { GetUserDayStatsInput } from '~/__generated__/globalTypes'

const TypoA: FC<{ text: string }> = ({ text }) => {
  return (
    <Typography variant="h4" component="div">
      <Box textAlign="center" fontWeight={600}>
        {text}
      </Box>
    </Typography>
  )
}

export const USER_DAY_STATE_QUERY = gql`
  query getUserDayStatsQuery($input: GetUserDayStatsInput!) {
    getUserDayStats(input: $input) {
      error
      ok
      dayStats {
        date
        total
        commit
        pullRequest
        issue
      }
    }
  }
`

const UserPage = () => {
  const router = useRouter()
  const { data: userData } = useMe()
  const { userId } = router.query
  const input: GetUserDayStatsInput = {
    userId: parseInt(userId as string),
    from: dayjs().format('YYYY-MM-DD'),
    to: dayjs().subtract(14, 'day').format('YYYY-MM-DD'),
  }

  const [getUserStatsData, { data: statsData, loading, refetch }] =
    useLazyQuery<getUserDayStatsQuery, getUserDayStatsQueryVariables>(
      USER_DAY_STATE_QUERY,
      {
        variables: {
          input,
        },
      }
    )

  useEffect(() => {
    router.isReady && getUserStatsData()
  }, [userId])

  return (
    <Layout>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h2"> User - {userId}</Typography>
        </Grid>
        <WeekendPicker input={input} />
        {!statsData || loading ? (
          <div>로딩중</div>
        ) : (
          <Grid item xs={12}>
            <Box height="500px">
              <UserNivoBar dayData={statsData.getUserDayStats.dayStats} />
            </Box>
          </Grid>
        )}
        {/* <Grid item xs={6}>
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
        </Grid> */}
      </Grid>
    </Layout>
  )
}

export default UserPage
