import { useRouter } from 'next/dist/client/router'
import { useEffect, useState } from 'react'
import { ClapSpinner } from 'react-spinners-kit'
import { authTokenVar } from '~/apollo'

export default function redirect() {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { code } = router.query
  console.log(router.isReady)
  useEffect(() => {
    console.log(code)
    if (!code) {
      // router.push('/login')
      return
    }

    ;(async () => {
      await fetch(`http://localhost:4000/auth/redirect?code=${code}`, {
        mode: 'cors',
      })
        .then((res) => {
          if (res.status === 500) {
            setError(true)
            throw new Error('status 500')
          }
          return res.json()
        })
        .then((json) => {
          authTokenVar(json.jwt)
          return json.jwt
        })
        .catch((err) => {
          setError(true)
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    })()
  }, [code])

  useEffect(() => {
    console.log('loading', loading, 'error', error)
    if (!loading) {
      setTimeout(() => {
        router.push(`/${error ? 'login' : ''}`)
      }, 300000)
    }
  }, [loading])

  useEffect(() => {
    router.prefetch('/')
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
