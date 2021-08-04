import Layout from '../components/layout'

export default function Rooms() {
  const roomList = Array(20)
    .fill(0)
    .map((_) => ({
      roomNum: 101,
      name: '방이름.',
      creatorId: 'aio',
      creatorAvatar: 'https://avatars.githubusercontent.com/u/68348070?v=4',
      description: '설명설명',
      isSecret: true,
      max: 40,
      count: 20,
      tags: [
        { name: 'tech', icon: '/icon/tech.svg' },
        { name: 'javascript', icon: '/icon/javascript.png' },
        { name: 'rust', icon: '/icon/rust.png' },
        { name: 'python', icon: '/icon/python.png' },
        { name: 'typescript', icon: '/icon/typescript.png' },
        // { name: 'rust', icon: '/icon/rust.png' },
        // { name: 'python', icon: '/icon/python.png' },
        // { name: 'typescript', icon: '/icon/typescript.png' },
        // { name: 'rust', icon: '/icon/rust.png' },
        // { name: 'python', icon: '/icon/python.png' },
        // { name: 'typescript', icon: '/icon/typescript.png' },
      ],
    }))
  return (
    <Layout>
      <h1 className="text-4xl mb-8">Room</h1>
      <div className="flex flex-wrap justify-center  gap-x-4  gap-y-4 min-w-full">
        {roomList.map((room, inx) => (
          <div
            key={`${inx}`}
            className="relative group w-60 h-60  border-2  flex-grow shadow-md p-4 rounded-lg hover:border-green-600"
          >
            {/* <div className="absolute z-10 -bottom-20 bg-gray-600 min-w-full h-0 group-hover:h-20 hidden group-hover:block group-hover: group-hover:bg-indigo-400 "></div> */}
            <div className="inline-flex relative h-full flex-col ">
              {room.isSecret && (
                <div className="absolute -right-1 -top-1">🔒</div>
              )}
              <h2 className="truncate">{room.name}</h2>
              <h3 className="truncate">{room.creatorId}</h3>
              <div className="mt-auto  flex flex-wrap justify-start content-start  gap-x-1 gap-y-1  overflow-hidden ">
                {room.tags.map((tag) => (
                  <div
                    className="inline-flex items-center rounded-full border-2 h-8 text-base min-w-max  pr-2"
                    key={tag.name}
                  >
                    <img
                      src={tag.icon}
                      className="w-8 h-8 inline-block border-2 rounded-full mr-1"
                    ></img>
                    {tag.name}
                  </div>
                ))}
              </div>
              <div
                className={`absolute right-2 bottom-2 ${
                  room.count / room.max >= 1 && 'text-red-500'
                }`}
              >
                {room.count}/{room.max}
              </div>
            </div>
          </div>
        ))}
        {Array(6)
          .fill(0)
          .map((_, id) => (
            <div
              key={`${id}`}
              className="w-60 h-0  inline-block flex-grow"
            ></div>
          ))}
      </div>
    </Layout>
  )
}
