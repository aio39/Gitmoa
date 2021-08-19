import { Avatar, Chip, Slider, TextField, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import React from 'react'
import { FC } from 'react'
import { Control, useController } from 'react-hook-form'
import { ITag, tagsList } from '~/fakeData'
import { FormCreateRoomInput } from '~/pages/roomCreate'

type TagSelect = {
  control: Control<FormCreateRoomInput>
}

const TagSelect: FC<TagSelect> = ({ control }) => {
  const { field } = useController({
    control,
    name: 'tagNames',
  })

  return (
    <React.Fragment>
      <Autocomplete
        multiple
        freeSolo
        disableClearable
        disabled={field.value?.length > 3}
        fullWidth
        onChange={(e, v) => {
          const v2 = v as ITag[]
          field.onChange(v2.map((i) => i.name))
        }}
        selectOnFocus
        options={tagsList}
        classes={{}}
        getOptionLabel={(option) => option.name}
        noOptionsText={'No saved Tag'}
        renderOption={(option) => {
          return (
            <React.Fragment>
              <Avatar alt={option.name} sizes="small" src={option.icon} />
              {option.name}
            </React.Fragment>
          )
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              // variant="outlined"
              fullWidth
              label="Tag"
              placeholder="Input Tag"
            />
          )
        }}
        renderTags={(value, getTagProps) =>
          value.map((tag, index: number) => {
            return (
              <Chip
                {...getTagProps({ index })}
                key={index}
                variant="outlined"
                disabled={false}
                label={tag.name || tag}
                avatar={tag.icon && <Avatar alt={tag.name} src={tag.icon} />}
              />
            )
          })
        }
      />
    </React.Fragment>
  )
}

export default TagSelect
