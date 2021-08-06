import { RadioGroup, Box, Radio, Typography } from '@material-ui/core'
import React, { FC } from 'react'
import { Control, useController } from 'react-hook-form'
import { CreateRoomInput } from '~/__generated__/globalTypes'
import SecretOption from './SecretOption'

type IsSecretRadioProps = {
  control: Control<CreateRoomInput>
}

type component = {
  value: 'true' | 'false'
  data: {
    path: string
    name: string
    description: string
    extra?: typeof SecretOption
  }
}

const radios: component[] = [
  {
    value: 'false',
    data: {
      path: 'M3 2.75A2.75 2.75 0 015.75 0h14.5a.75.75 0 01.75.75v20.5a.75.75 0 01-.75.75h-6a.75.75 0 010-1.5h5.25v-4H6A1.5 1.5 0 004.5 18v.75c0 .716.43 1.334 1.05 1.605a.75.75 0 01-.6 1.374A3.25 3.25 0 013 18.75v-16zM19.5 1.5V15H6c-.546 0-1.059.146-1.5.401V2.75c0-.69.56-1.25 1.25-1.25H19.5z',
      name: 'Public',
      description: '공개로  설정합니다.',
    },
  },
  {
    value: 'true',
    data: {
      path: 'M6 9V7.25C6 3.845 8.503 1 12 1s6 2.845 6 6.25V9h.5a2.5 2.5 0 012.5 2.5v8a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5v-8A2.5 2.5 0 015.5 9H6zm1.5-1.75C7.5 4.58 9.422 2.5 12 2.5c2.578 0 4.5 2.08 4.5 4.75V9h-9V7.25zm-3 4.25a1 1 0 011-1h13a1 1 0 011 1v8a1 1 0 01-1 1h-13a1 1 0 01-1-1v-8z',
      name: 'Secret',
      description: '비공개로 설정합니다.',
      extra: SecretOption,
    },
  },
]

const IsSecretRadio: FC<IsSecretRadioProps> = ({ control }) => {
  const { field } = useController({
    control,
    name: 'isSecret',
  })

  return (
    <React.Fragment>
      <RadioGroup {...field}>
        {radios.map(({ value, data }) => (
          <Box
            key={value}
            display="flex"
            flexDirection="row"
            flexWrap="nowrap"
            alignItems="flex-start"
          >
            <Box>
              <Radio value={value} />
            </Box>
            <Box mr={2}>
              <svg height="32" viewBox="0 0 24 24" width="32">
                <path d={data.path}></path>
              </svg>
            </Box>
            <Box flexGrow={1}>
              <Typography>{data.name}</Typography>
              <Typography>{data.description}</Typography>
              {data.extra?.({ control })}
            </Box>
          </Box>
        ))}
      </RadioGroup>
    </React.Fragment>
  )
}

export default IsSecretRadio
