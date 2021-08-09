import axios from 'axios'
import { useRouter } from 'next/dist/client/router'
import { useEffect, useState } from 'react'
import { ClapSpinner } from 'react-spinners-kit'
import { authTokenVar, isLoggedInVar } from '~/apollo'
import { ACCESS_TOKEN } from '~/constants'

type redirectRes = {
  message: string
  success: boolean
  user?: object
  jwt?: string
}

export default function redirect() {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { code } = router.query

  useEffect(() => {
    if (!router.isReady || !code) {
      // router.push('/login')
      return
    }
    console.log('code', code)
    axios
      .get<redirectRes>(`/auth/redirect?code=${code}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        console.log('axios data', data)
        if (data.jwt) {
          authTokenVar(data.jwt)
          localStorage.setItem(ACCESS_TOKEN, data.jwt)
          isLoggedInVar(true)
        }
      })
      .catch((err) => {
        console.log('axios 실패', err)
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [code])

  useEffect(() => {
    console.log('loading', loading, 'error', error)
    if (!loading) {
      setTimeout(() => {
        router.push(`/${error ? 'login' : 'room'}`)
      }, 3000)
    }
  }, [loading])

  useEffect(() => {
    router.prefetch('/room')
  }, [])

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-2xl">
      <div className="flex items-center justify-center max-w-2xl w-full h-56">
        <ClapSpinner size={100} loading={loading} />
      </div>
      <div>
        {loading && (
          <div>
            <span>로그인 중입니다 .잠시만 기달려 주세요.</span>
          </div>
        )}
      </div>
      {loading || error ? (
        <>
          <h3>로그인에 실패했습니다.</h3>
          <h3>로그인 페이지로 이동합니다</h3>
        </>
      ) : (
        <>
          <h3>로그인에 성공했습니다.</h3>
          <h3> 잠시 후 홈 화면으로 이동</h3>
        </>
      )}
    </div>
  )
}
