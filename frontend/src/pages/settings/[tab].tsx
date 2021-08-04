import { useRouter } from 'next/router'
import MiniBtn from '~/components/button/MiniBtn'
import Layout from '~/components/layout'
import TabBoarder from '~/components/TabBoader'
import { useMe } from '~/hooks/useMe'

export type tabObject = {
  name: string
  link: string
}

export default function Settings() {
  const router = useRouter()
  const { data: userData } = useMe()
  const { tab } = router.query

  const tabList: tabObject[] = [
    { name: 'Profile', link: '/settings/profile' },
    { name: 'Account', link: '/settings/account' },
  ]

  return (
    <Layout>
      <div>Hello</div>
      <TabBoarder tabList={tabList} nowTab={tab} />
      {userData?.findUserMe?.user?.id}
      <MiniBtn text="안녕" />
    </Layout>
  )
}
