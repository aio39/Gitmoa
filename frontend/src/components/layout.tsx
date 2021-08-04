import Link from 'next/link'
import { useState } from 'react'
import useModal from '~/hooks/useModal'
import Modal from './Modal'
import LoginModal from './modal/LoginModal'
export default function Layout({ children }) {
  const [toggle, setToggle] = useState(true)

  const navList = [
    ['/', '홈화면'],
    ['/room', 'Room'],
    ['/roomCreate', '방 만들기'],
    ['/hello', '첫화면'],
    ['/settings/profile', '프로필 설정'],
    ['/room/123', '방 설정'],
  ]

  const toggleHandler = () => {
    setToggle((prev) => !prev)
  }

  const { isShowing, modalToggle } = useModal()

  return (
    <>
      <div className="relative min-h-screen md:flex">
        <div className="bg-gray-800 text-gray-100 flex justify-between md:hidden">
          <a href="#" className="block p-4 text-white font-bold">
            GitMoa
          </a>

          <button
            onClick={toggleHandler}
            className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-700"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div
          className={`bg-gray-800 text-blue-100 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
            toggle && '-translate-x-full'
          } md:relative md:translate-x-0 transition duration-200 ease-in-out z-10`}
        >
          <Link href="/">
            <a className="text-white flex items-center space-x-2 px-4">
              <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span className="text-2xl font-extrabold">GitMoa</span>
            </a>
          </Link>
          <nav>
            {navList.map((item) => (
              <Link key={item[0]} href={item[0]}>
                <a className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-500 hover:text-white">
                  {item[1]}
                </a>
              </Link>
            ))}
          </nav>
          <button className="button-default" onClick={modalToggle}>
            Show Modal
          </button>
          <Modal isShowing={isShowing} hide={modalToggle}>
            <LoginModal />
          </Modal>
        </div>
        <main className="p-3 text-2xl font-bold w-full min-h-screen">
          {children}
        </main>
      </div>
    </>
  )
}
