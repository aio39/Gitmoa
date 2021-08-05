import Head from 'next/head'
import styled from '@emotion/styled/macro'
import { css } from '@emotion/react'

const Input = styled.input([
  tw`p-20`,
  ({ hasDarkHover }) =>
    hasDarkHover
      ? tw`hover:border-black`
      : css`
          &:hover {
            ${tw`border-white`}
          }
        `,
])

const Til = styled.h1([tw`text-9xl`])

export const Home = (): JSX.Element => (
  <div className="container text-9xl caret-red-600">
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Til>fdsfsfd</Til>
    <h1 className="text-9xl  ">
      Welcome to <a href="https://nextjs.org">Next.js!</a>
    </h1>
    <Input hasDarkHover />
  </div>
)

export default Home
