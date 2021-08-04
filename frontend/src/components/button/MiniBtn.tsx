type MiniBtnProps = {
  text: string
  icon?: React.FC | null
  hook?: () => void
}
import tw from 'twin.macro'
import styled from '@emotion/styled/macro'
import { jsx } from '@emotion/react'

const Button = styled.button([
  tw`px-2 bg-red-200 text-white`,
  ({ hasDarkHover }) =>
    hasDarkHover
      ? tw`hover:border-black`
      : jsx`
          &:hover {
            ${tw`border-white`}
          }
        `,
])

export default function MiniBtn({ text, icon = null, hook }: MiniBtnProps) {
  return (
    <Button onClick={hook} hasDarkHover>
      {icon != null && icon}
      {text}
    </Button>
  )
}
