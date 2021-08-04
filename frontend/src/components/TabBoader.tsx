import Link from 'next/link'
import { tabObject } from '~/pages/settings/[tab]'

type TabBoarderProps = {
  tabList: tabObject[]
  nowTab: string | string[]
}

export default function TabBoarder({ tabList, nowTab }: TabBoarderProps) {
  return (
    <div className="flex relative">
      {tabList.map((tab) => (
        <Link key={tab.name} href={tab.link}>
          <div className="relative mr-6 py-2">
            <a className="text-3xl ">{tab.name}</a>

            {typeof nowTab === 'string' &&
              nowTab.toLowerCase() === tab.name.toLowerCase() && (
                <div className="absolute w-full bottom-0 h-1 bg-green-600 z-10"></div>
              )}
          </div>
        </Link>
      ))}
      <div className="absolute w-full bottom-0 h-1 bg-gray-100"></div>
    </div>
  )
}
