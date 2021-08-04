import Layout from '../../components/layout'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'

const Room = () => {
  const router = useRouter()
  const { roomId } = router.query

  const [weekData, setWeekData] = useState([
    { date: '2021-07-01', success: true, failedList: ['1', '2', '3'] },
    { date: '2021-07-02', success: true, failedList: [] },
    { date: '2021-07-03', success: false, failedList: ['1', '2', '3', '4'] },
    { date: '2021-07-04', success: true, failedList: ['1'] },
    { date: '2021-07-05', success: true, failedList: ['1', '2', '3'] },
    { date: '2021-07-06', success: true, failedList: ['1', '2', '3'] },
    { date: '2021-07-07', success: true, failedList: ['1', '2', '3'] },
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

  return (
    <Layout>
      <div className="mb-4 flex">
        <h1 className="text-4xl">방 {roomId}</h1>
      </div>
      <div className="flex gap-2 bg-gray-700 w-max border-2 rounded-xl px-3">
        <span className="border-r-2 border-white p-2">Week</span>
        <span className="border-r-2 border-white p-2">Month</span>
        <span className="p-2">Day</span>
      </div>
      <div className="flex bg-gray-600 gap-x-1 p-1">
        {weekData.map((dayData) => (
          <div
            key={dayData.date}
            className="bg-white relative flex-grow h-64 mar h-"
          >
            <div
              className={`absolute bg-yellow-500 w-full bottom-0  h-${Math.floor(
                6 * (1 - dayData.failedList.length / roomData.userData.length)
              )}/6 ${dayData.failedList.length === 0 && 'h-full bg-green-600'}`}
            ></div>
            {dayjs(dayData.date).format('MM/DD')}
          </div>
        ))}
      </div>
      <div className="flex w-1/2">
        <div className="flex-grow">
          <h3 className="text-center">성공 리스트</h3>
        </div>
        <div className="flex-grow">
          <h3 className="text-center">실패리스트</h3>
        </div>
      </div>
    </Layout>
  )
}

export default Room
