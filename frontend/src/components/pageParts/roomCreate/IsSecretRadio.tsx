import { RadioGroup, Box, Radio, Typography } from '@material-ui/core'
import React, { FC } from 'react'
import { Control, useController } from 'react-hook-form'
import { CreateRoomInput } from '~/__generated__/globalTypes'
import SecretOption from './SecretOption'

type IsSecretRadioProps = {
  control: Control<CreateRoomInput>
}

const IsSecretRadio: FC<IsSecretRadioProps> = ({ control }) => {
  const {
    field,
    // fieldState: { invalid, isTouched, isDirty },
    // formState: { touchedFields, dirtyFields },
  } = useController({
    control,
    name: 'isSecret',
  })

  return (
    <React.Fragment>
      <RadioGroup {...field}>
        <Box display="flex" alignItems="center">
          <div>
            <Radio value="false" />
          </div>
          <svg height="32" viewBox="0 0 24 24" width="32" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M3 2.75A2.75 2.75 0 015.75 0h14.5a.75.75 0 01.75.75v20.5a.75.75 0 01-.75.75h-6a.75.75 0 010-1.5h5.25v-4H6A1.5 1.5 0 004.5 18v.75c0 .716.43 1.334 1.05 1.605a.75.75 0 01-.6 1.374A3.25 3.25 0 013 18.75v-16zM19.5 1.5V15H6c-.546 0-1.059.146-1.5.401V2.75c0-.69.56-1.25 1.25-1.25H19.5z"
            ></path>
            <path d="M7 18.25a.25.25 0 01.25-.25h5a.25.25 0 01.25.25v5.01a.25.25 0 01-.397.201l-2.206-1.604a.25.25 0 00-.294 0L7.397 23.46a.25.25 0 01-.397-.2v-5.01z"></path>
          </svg>
          <div>
            <Typography>Public</Typography>
            <Typography>공개로 설정합니다.</Typography>
          </div>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="nowrap"
          alignItems="flex-start"
        >
          <Box>
            <Radio value="true" />
          </Box>
          <Box mr={2}>
            <svg height="32" viewBox="0 0 24 24" width="32">
              <path d="M6 9V7.25C6 3.845 8.503 1 12 1s6 2.845 6 6.25V9h.5a2.5 2.5 0 012.5 2.5v8a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 19.5v-8A2.5 2.5 0 015.5 9H6zm1.5-1.75C7.5 4.58 9.422 2.5 12 2.5c2.578 0 4.5 2.08 4.5 4.75V9h-9V7.25zm-3 4.25a1 1 0 011-1h13a1 1 0 011 1v8a1 1 0 01-1 1h-13a1 1 0 01-1-1v-8z"></path>
            </svg>
          </Box>
          <Box flexGrow={1}>
            <Typography>Secret</Typography>
            <Typography>비공개로 설정합니다 .</Typography>
            <SecretOption control={control} />
          </Box>
        </Box>
      </RadioGroup>
    </React.Fragment>
  )
}

export default IsSecretRadio
