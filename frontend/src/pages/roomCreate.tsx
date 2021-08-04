import Layout from '../components/layout'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import React, { useRef, useState } from 'react'
import TagModal from '~/components/tagModal'
import QRCode from 'qrcode.react'
import { gql, useMutation } from '@apollo/client'
import {
  createRoomMutation,
  createRoomMutationVariables,
} from '~/__generated__/createRoomMutation'
import { CreateRoomInput } from '~/__generated__/globalTypes'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Switch from '@material-ui/core/Switch'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  Avatar,
  Button,
  Chip,
  ClickAwayListener,
  createStyles,
  Grid,
  Paper,
  Slider,
  TextField,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

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
  })
)

interface ITag {
  name: string
  icon?: string
}

const tagsList: ITag[] = [
  { name: 'tech', icon: '/icon/tech.svg' },
  { name: 'javascript', icon: '/icon/javascript.png' },
  { name: 'rust', icon: '/icon/rust.png' },
  { name: 'python', icon: '/icon/python.png' },
  { name: 'typescript', icon: '/icon/typescript.png' },
]

export const CREATE_ROOM_MUTATION = gql`
  mutation createRoomMutation($createRoomInput: CreateRoomInput!) {
    createRoom(input: $createRoomInput) {
      ok
      error
      roomId
      secretLink
    }
  }
`

export default function RoomCreate() {
  const [tagList, setTagList] = useState<string[]>(['JavaScript', 'typescirpt'])
  const [isShowTagModal, setIsShowTagModal] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [submitResult, setSubmitResult] = useState({
    link: 'http://localhost:3000/',
  })

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateRoomInput>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const TagCancelHandler = (event) => {
    console.log(event.target.dataset.tagName)
    setTagList((prev) =>
      prev.filter((tag) => tag !== event.target.dataset.tagName)
    )
  }

  const ShowModalHandler = (event) => {
    event.isClickTagsArea = true
    setIsShowTagModal((p) => true)
  }

  const LayoutClickHandler = (event) => {
    event.isClickTagsArea || setIsShowTagModal((_) => false)
  }

  const onSubmit: SubmitHandler<CreateRoomInput> = async (data) => {
    const { errors } = await createRoomMutation({
      variables: {
        createRoomInput: { ...data },
      },
    })
    console.log('erros', errors)

    setIsSubmit((_) => true)
  }

  const handleQRCode = () => {
    const node: any = canvasRef.current.childNodes[0]
    console.log(node)
    node.toBlob((blob) => {
      const item = new ClipboardItem({ 'image/png': blob })
      navigator.clipboard.write([item])
    })
    const link = document.createElement('a')
    link.href = node.toDataURL('image/png')
    link.download = 'image/png'

    link.click()
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

  const [createRoomMutation, { loading, data: createRoomMutationResult }] =
    useMutation<createRoomMutation, createRoomMutationVariables>(
      CREATE_ROOM_MUTATION,
      {
        onCompleted,
        onError: (error) => {
          console.log(error)
        },
      }
    )

  interface ChipData {
    key: number
    label: string
  }

  const classes = useStyles()
  const [tagsData, setTagsData] = useState<ChipData[]>([
    { key: 0, label: 'Angular' },
    { key: 1, label: 'jQuery' },
    { key: 2, label: 'Polymer' },
    { key: 3, label: 'React' },
    { key: 4, label: 'Vue.js' },
  ])

  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen((prev) => !prev)
  }

  const handleClickAway = () => {
    setOpen(false)
  }

  return (
    <Layout>
      <Typography variant="h3" component="h3">
        Create Room
      </Typography>
      <form>
        <Grid
          container
          spacing={3}
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={12}>
            <TextField id="standard-basic" label="방이름" />
          </Grid>
          <Grid item xs={12}>
            <TextField id="standard-basic" label="설명" />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="시크릿 방으로 설정하시겠습니까 ?"
                  color="primary"
                />
              }
              label="시크릿 방으로 설정하시겠습니까 ?"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox name="검색 가능" color="primary" />}
              label="검색 가능"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography id="discrete-slider" gutterBottom>
              인원 제한한
            </Typography>
            <Slider
              defaultValue={100}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={10}
              marks
              min={10}
              max={100}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="tags"
              style={{ width: 500 }}
              options={tagsList}
              classes={{}}
              limitTags={5}
              getOptionLabel={(option) => option.name}
              freeSolo
              renderOption={(option) => (
                <React.Fragment>
                  <Avatar alt={option.name} sizes="small" src={option.icon} />
                  {option.name}
                </React.Fragment>
              )}
              renderTags={(value, getTagProps) =>
                value.map((tag, index: number) => {
                  console.log(getTagProps({ index }))
                  return (
                    <Chip
                      key={tag.name}
                      variant="outlined"
                      label={tag.name}
                      avatar={<Avatar alt={tag.name} src={tag.icon} />}
                      {...getTagProps({ index })}
                    />
                  )
                })
              }
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Tag"
                    placeholder="Input Tag"
                  />
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </Layout>
  )
}
