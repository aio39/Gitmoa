import Layout from '../components/layout'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  createRoomMutation,
  createRoomMutationVariables,
} from '~/__generated__/createRoomMutation'
import { yupResolver } from '@hookform/resolvers/yup'
import { CreateRoomInput } from '~/__generated__/globalTypes'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  Avatar,
  Backdrop,
  Button,
  Chip,
  createStyles,
  CircularProgress,
  Grid,
  Slider,
  TextField,
  Typography,
  RadioGroup,
  Radio,
  Divider,
  Box,
  Theme,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import RoomCreateResult from '~/components/RoomCreateResult'
import { CREATE_ROOM_MUTATION } from '~/gql/mutation'
import { tagsList } from '~/fakeData'

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

// interface CreateRoomInput {
//   isSecret?: boolean | null | string
// }

import { ITag } from '~/fakeData'
import HFEText from '~/components/text/HookFormErrorText'
import yupCreateRoom from '~/yup/yup_createRoom'
import SecretOption from '~/components/pageParts/roomCreate/SecretOption'

export default function RoomCreate() {
  const [isSubmit, setIsSubmit] = useState(false)
  const classes = useStyles()
  const {
    handleSubmit,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateRoomInput>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    resolver: yupResolver(yupCreateRoom),
    defaultValues: {
      isSecret: false,
      tagNames: [],
      maxNum: 100,
      isCanSearched: true,
    },
  })

  const onSubmit: SubmitHandler<CreateRoomInput> = async (data) => {
    const { errors } = await createRoomMutation({
      variables: {
        createRoomInput: { ...data },
      },
    })
    console.log('error', errors)

    setIsSubmit((_) => true)
  }

  const onCompleted = (data: createRoomMutation) => {
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
                <Controller
                  name="isSecret"
                  control={control}
                  //  @ts-ignore
                  defaultValue={'false'}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <Box display="flex" alignItems="center">
                        <div>
                          <Radio value="false" />
                        </div>
                        <svg
                          height="32"
                          viewBox="0 0 24 24"
                          width="32"
                          aria-hidden="true"
                        >
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
                  )}
                />
                <Divider />
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <Typography id="discrete-slider" gutterBottom>
                  인원 제한
                </Typography>

                <Controller
                  name="maxNum"
                  control={control}
                  defaultValue={100}
                  render={({ field }) => (
                    // @ts-ignore
                    <Slider
                      {...field}
                      component="div"
                      valueLabelDisplay="auto"
                      step={10}
                      marks
                      min={10}
                      max={100}
                      onChange={(e, v) => {
                        field.onChange(v)
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
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
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary">
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
