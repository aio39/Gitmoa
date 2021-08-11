// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { List, ListItem, makeStyles, Paper } from '@material-ui/core'
import { ResponsiveBar } from '@nivo/bar'
import React from 'react'
import useIdDebounce from '~/hooks/useDebounce'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const useStyles = makeStyles({
  toolTip: {
    backgroundColor: '#333333',
    color: (props) => props.color,
  },
})

const ToolTip = (
  { id, data, color },
  userData: Map<number, { userId: number; userName: string }>
) => {
  const list = id === 'success' ? data.successList : data.failedList
  const props = { color }
  const classes = useStyles(props)
  return (
    <Paper className={classes.toolTip}>
      <List>
        {list?.map((userId) => (
          <ListItem key={userId}>{userData.get(userId)?.userName}</ListItem>
        ))}
      </List>
    </Paper>
  )
}

const RoomWeekendBar = ({ weekData, userData }) => {
  const getToolTip = useIdDebounce(ToolTip)

  return (
    <ResponsiveBar
      data={weekData}
      keys={['success', 'fail']}
      indexBy="date"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.05}
      minValue={0}
      maxValue={'auto'}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      valueFormat={{ format: ' >-', enabled: false }}
      // colors={{ scheme: 'nivo' }}
      colors={['#39c5bb', '#FF3399']}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: '#38bcb2',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: '#eed312',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: 'fries',
          },
          id: 'dots',
        },
        {
          match: {
            id: 'sandwich',
          },
          id: 'lines',
        },
      ]}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'date',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'food',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      tooltip={({ id, data, color }) =>
        getToolTip(id, { id, data, color }, userData)
      }
    />
  )
}

export default RoomWeekendBar
