import { Box, Checkbox, FormControlLabel } from '@material-ui/core'
import { FC } from 'react'
import { Control, Controller, useWatch } from 'react-hook-form'
import { FormCreateRoomInput } from '~/pages/roomCreate'
import { CreateRoomInput } from '~/__generated__/globalTypes'

type SecretOptionProps = {
  control: Control<FormCreateRoomInput>
}

const SecretOption: FC<SecretOptionProps> = ({ control }) => {
  const isSecret = useWatch({
    control,
    name: 'isSecret',
  })

  return (
    <Box display={isSecret === 'true' ? 'block' : 'none'}>
      <div>
        <Controller
          name="isCanSearched"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} color="primary" />}
              label="검색 가능"
            />
          )}
        />
      </div>
    </Box>
  )
}

export default SecretOption
