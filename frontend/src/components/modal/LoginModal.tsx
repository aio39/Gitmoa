import Link from 'next/link'
import { GoMarkGithub } from 'react-icons/go'

export default function LoginModal() {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <h1 className="text-7xl font-mono antialiased font-bold tracking-tight mb-4">
        GitMoa
      </h1>
      <h3 className="text-2xl mb-4 break-words ">
        Github Oauth로 로그인합니다.
      </h3>

      <Link href="http://localhost:4000/auth/">
        <button
          aria-label="Github Login Button"
          type="button"
          className="bg-gray-900 rounded-md text-white text-3xl inline-flex justify-center items-center cursor-pointer whitespace-nowrap px-6 py-2 gap-x-4"
        >
          <GoMarkGithub className="text-white" />
          Login with GitHub
        </button>
      </Link>
    </div>
  )
}
