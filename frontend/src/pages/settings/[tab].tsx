import { useRouter } from 'next/router'
import Layout from '~/components/layout'
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
    </Layout>
  )
}
