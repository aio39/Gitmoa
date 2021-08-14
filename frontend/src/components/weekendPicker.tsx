import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import dayjs, { Dayjs } from 'dayjs'
import Grid from '@material-ui/core/Grid'
import DayjsUtils from '@date-io/dayjs'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { GetUserDayStatsInput } from '~/__generated__/globalTypes'
import { dateToDayjs, dayjsToDate } from '~/util'
import { useCallback } from 'react'
import {
  ApolloQueryResult,
  QueryLazyOptions,
  useLazyQuery,
} from '@apollo/client'
import {
  getUserDayStatsQueryVariables,
  getUserDayStatsQuery,
} from '~/__generated__/getUserDayStatsQuery'
import { USER_DAY_STATE_QUERY } from '~/pages/user/[userId]'

dayjs.extend(isSameOrBefore)

interface Props {
  input: GetUserDayStatsInput
  setInput: Dispatch<SetStateAction<GetUserDayStatsInput>>
  refetch: (options?: QueryLazyOptions<getUserDayStatsQueryVariables>) => void
}

const WeekendPicker: FC<Props> = ({ input, setInput, refetch }) => {
  const skipInitial = useRef<boolean>(false)
  const [fromDate, setFromDate] = useState(dayjs(input.from))
  const [toDate, setToDate] = useState(dayjs(input.to))

  // const [getUserStatsData, {}] = useLazyQuery<
  //   getUserDayStatsQuery,
  //   getUserDayStatsQueryVariables
  // >(USER_DAY_STATE_QUERY, {})

  useEffect(() => {
    if (skipInitial.current) {
      const setInputAndRefetch = () => {
        const from = fromDate.format('YYYY-MM-DD')
        const to = toDate.format('YYYY-MM-DD')
        setInput((prev) => {
          const newInput = { from, to, userId: prev.userId }
          refetch({ variables: { input: newInput } })
          return newInput
        })
      }

      setInputAndRefetch()
    } else {
      skipInitial.current = true
    }
  }, [fromDate, toDate])

  const handleFromDateChange = (fromDate: Dayjs | null) => {
    if (!fromDate) return

    setFromDate(fromDate)
  }

  const handleToDateChange = (newToDate: Dayjs | null) => {
    if (!newToDate) return
    if (newToDate.isSameOrBefore(fromDate, 'day')) {
      setFromDate(newToDate.subtract(14, 'day'))
    }

    setToDate(newToDate)
    console.log(newToDate)
  }
  console.log(input)

  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <Grid container justifyContent="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/DD/YYYY"
          margin="normal"
          id="date-picker-inline"
          label="Date picker inline"
          value={fromDate}
          onChange={handleFromDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Date picker dialog"
          format="MM/DD/YYYY"
          value={toDate}
          onChange={handleToDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  )
}

export default WeekendPicker
