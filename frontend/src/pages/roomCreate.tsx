import Layout from '../components/layout'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  createRoomMutation,
  createRoomMutationVariables,
} from '~/__generated__/createRoomMutation'
import { yupResolver } from '@hookform/resolvers/yup'
import { CreateRoomInput, TagInput } from '~/__generated__/globalTypes'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  Avatar,
  Backdrop,
  Button,
  Chip,
  createStyles,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  Divider,
  Box,
  Theme,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import RoomCreateResult from '~/components/RoomCreateResult'
import { CREATE_ROOM_MUTATION } from '~/gql/mutation'
import { tagsList } from '~/fakeData'

export type FormCreateRoomInput = Omit<CreateRoomInput, 'tags' | 'isSecret'> & {
  tagNames: [string]
  isSecret: 'true' | 'false'
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tagWrapper: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 0,
    },
    tag: {
      margin: theme.spacing(0.5),
    },
    gridWrapper: {
      '& .MuiGrid-item': {
        width: '100%',
      },
    },
    label: {
      '& label::after': {
        content: '"*"',
        paddingLeft: '5px',
        color: 'red',
      },
    },
  })
)

import HFEText from '~/components/text/HookFormErrorText'
import yupCreateRoom from '~/yup/yup_createRoom'
import IsSecretRadio from '~/components/pageParts/roomCreate/IsSecretRadio'
import MaxNumSlider from '~/components/pageParts/roomCreate/maxNumSlider'
import TagSelect from '~/components/pageParts/roomCreate/TagSelect'

export default function RoomCreate() {
  const [isSubmit, setIsSubmit] = useState(false)
  const classes = useStyles()
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormCreateRoomInput>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    resolver: yupResolver(yupCreateRoom),
    defaultValues: {
      isSecret: 'false',
      tagNames: [],
      maxNum: 100,
      isCanSearched: true,
    },
  })

  const onSubmit: SubmitHandler<FormCreateRoomInput> = async ({
    tagNames,
    isSecret,
    ...rest
  }) => {
    const tags: TagInput[] = tagNames.map((name) => ({ name }))
    const { errors, data: result } = await createRoomMutation({
      variables: {
        createRoomInput: { ...rest, tags, isSecret: isSecret === 'true' },
      },
    })
    console.log('error', errors)
    console.log('onSubmit', result)
    setIsSubmit((_) => true)
  }

  const onCompleted = (data: createRoomMutation) => {
    console.log('onCompleted', data)
    const {
      createRoom: { ok, roomId, secretLink },
    } = data
    console.log(roomId)
    if (ok) {
      alert('Account Created! Log in now!')
    }
  }

  const [
    createRoomMutation,
    {
      data: createRoomMutationResult,
      loading: createRequestLoading,
      error: createRequestError,
    },
  ] = useMutation<createRoomMutation, createRoomMutationVariables>(
    CREATE_ROOM_MUTATION,
    {
      onCompleted,
      onError: (error) => {
        console.log(error)
      },
    }
  )
  console.log(createRoomMutationResult)
  console.log('watch', watch())
  return (
    <Layout>
      {createRequestLoading && !createRequestLoading && !createRequestError ? (
        <RoomCreateResult />
      ) : (
        <Box>
          <Backdrop open={createRequestLoading}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Typography variant="h3" component="h3">
            Create Room
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              classes={{ root: classes.gridWrapper }}
              container
              spacing={3}
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      classes={{ root: classes.label }}
                      id="name"
                      label="방이름"
                    />
                  )}
                />
                <HFEText text={errors.name?.message} />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id="description"
                      label="설명"
                    />
                  )}
                />
                <HFEText text={errors.description?.message} />
              </Grid>
              <Grid item xs={12}>
                <Divider />
                <IsSecretRadio control={control} />
                <Divider />
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <MaxNumSlider control={control} />
              </Grid>

              <Grid item xs={12}>
                {/* <Controller
                  name="tagNames"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      freeSolo
                      disableClearable
                      disabled={getValues('tagNames')?.length > 3}
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
                            <Avatar
                              alt={option.name}
                              sizes="small"
                              src={option.icon}
                            />
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
                              avatar={
                                tag.icon && (
                                  <Avatar alt={tag.name} src={tag.icon} />
                                )
                              }
                            />
                          )
                        })
                      }
                    />
                  )}
                /> */}
                <TagSelect control={control} />
              </Grid>
              <Grid item xs={12}>
                <Button type={'submit'} variant="contained" color="primary">
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      )}
    </Layout>
  )
}
