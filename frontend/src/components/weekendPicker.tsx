import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import dayjs, { Dayjs } from 'dayjs'
import Grid from '@material-ui/core/Grid'
import DayjsUtils from '@date-io/dayjs'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { GetUserDayStatsInput } from '~/__generated__/globalTypes'
import { QueryLazyOptions } from '@apollo/client'
import { getUserDayStatsQueryVariables } from '~/__generated__/getUserDayStatsQuery'
import useMediaQuery from '@material-ui/core/useMediaQuery'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

interface Props {
  input: GetUserDayStatsInput
  setInput: Dispatch<SetStateAction<GetUserDayStatsInput>>
  refetch: (options?: QueryLazyOptions<getUserDayStatsQueryVariables>) => void
}

const MAX_RANGE = 14

const WeekendPicker: FC<Props> = ({ input, setInput, refetch }) => {
  const matches = useMediaQuery('(min-width:600px)')
  const pickerType = matches ? 'inline' : 'dialog'
  const skipInitial = useRef<boolean>(false)
  const [fromDate, setFromDate] = useState(dayjs(input.from))
  const [toDate, setToDate] = useState(dayjs(input.to))

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

  const handleFromDateChange = (newFromDate: Dayjs | null) => {
    if (!newFromDate) return
    if (
      newFromDate.isSameOrAfter(toDate, 'day') ||
      newFromDate.isSameOrBefore(toDate.subtract(MAX_RANGE, 'day'))
    ) {
      setToDate(newFromDate.add(MAX_RANGE, 'day'))
    }

    setFromDate(newFromDate)
  }

  const handleToDateChange = (newToDate: Dayjs | null) => {
    if (!newToDate) return
    if (
      newToDate.isSameOrBefore(fromDate, 'day') ||
      newToDate.isSameOrAfter(fromDate.add(MAX_RANGE, 'day'))
    ) {
      setFromDate(newToDate.subtract(MAX_RANGE, 'day'))
    }

    setToDate(newToDate)
  }

  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <Grid container justifyContent="space-around">
        <KeyboardDatePicker
          format="YYYY/MM/DD"
          // autoOk
          variant={pickerType}
          margin="normal"
          value={fromDate}
          onChange={handleFromDateChange}
          onAccept={(date) => {
            console.log(date, 'onAccept')
          }}
          onClose={() => {
            console.log('onClose')
          }}
        />
        <KeyboardDatePicker
          format="YYYY/MM/DD"
          margin="normal"
          variant={pickerType}
          value={toDate}
          onChange={handleToDateChange}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  )
}

export default WeekendPicker
