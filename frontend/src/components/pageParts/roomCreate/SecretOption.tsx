import { Box, Checkbox, FormControlLabel } from '@material-ui/core'
import { FC } from 'react'
import { Control, Controller, useWatch } from 'react-hook-form'
import { CreateRoomInput } from '~/__generated__/globalTypes'

type SecretOptionProps = {
  control: Control<CreateRoomInput>
}

const SecretOption: FC<SecretOptionProps> = ({ control }) => {
  const isSecret = useWatch({
    control,
    name: 'isSecret',
  })

  return (
    <Box
      // @ts-ignore
      display={isSecret === 'true' ? 'block' : 'none'}
    >
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
