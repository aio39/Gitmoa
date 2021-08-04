import { useRouter } from 'next/router'
import Layout from '~/components/layout'

export default function RoomSettings() {
  const router = useRouter()
  const { ...rest } = router.query
  console.log(rest)

  return (
    <Layout>
      <h3>셋팅</h3>
    </Layout>
  )
}
