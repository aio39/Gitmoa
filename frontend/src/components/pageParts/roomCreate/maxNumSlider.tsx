import { Slider, Typography } from '@material-ui/core'
import React from 'react'
import { FC } from 'react'
import { Control, useController } from 'react-hook-form'
import { CreateRoomInput } from '~/__generated__/globalTypes'

type IsSecretRadioProps = {
  control: Control<CreateRoomInput>
}

const MaxNumSlider: FC<IsSecretRadioProps> = ({ control }) => {
  const {
    field: { value, onChange },
  } = useController({
    control,
    name: 'maxNum',
  })

  const handleChange: void = (event: any, newValue: number | number[]) => {
    const value = newValue as number
    onChange(value)
  }

  return (
    <React.Fragment>
      <Typography id="discrete-slider" gutterBottom>
        인원 제한 | {value}
      </Typography>

      <Slider
        value={value}
        component="div"
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={100}
        onChange={handleChange}
      />
    </React.Fragment>
  )
}

export default MaxNumSlider
