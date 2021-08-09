// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { BasicTooltip } from '@nivo/tooltip'
import { ResponsiveBar } from '@nivo/bar'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const ToolTip = ({ data }) => {
  return (
    <div>
      {/* {data.date} */}
      {data.failedList?.map((fail) => (
        <div key={fail}>{fail}</div>
      ))}
    </div>
  )
  //   return <BasicTooltip value={props.value} color={props.color} enableChip />
}

const MyResponsiveBar = ({ data, total /* see data tab */ }) => (
  <ResponsiveBar
    data={data}
    keys={['success', 'fail']}
    indexBy="date"
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    padding={0.05}
    minValue={0}
    maxValue={total}
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
    // legends={[
    //   {
    //     dataFrom: 'keys',
    //     anchor: 'bottom-right',
    //     direction: 'column',
    //     justify: false,
    //     translateX: 120,
    //     translateY: 0,
    //     itemsSpacing: 2,
    //     itemWidth: 100,
    //     itemHeight: 20,
    //     itemDirection: 'left-to-right',
    //     itemOpacity: 0.85,
    //     symbolSize: 20,
    //     effects: [
    //       {
    //         on: 'hover',
    //         style: {
    //           itemOpacity: 1,
    //         },
    //       },
    //     ],
    //   },
    // ]}
    tooltip={ToolTip}
  />
)

export default MyResponsiveBar
