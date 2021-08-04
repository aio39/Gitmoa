import Layout from '../components/layout'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useRef, useState } from 'react'
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
import { Grid, Typography } from '@material-ui/core'

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
  console.log(watch())

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

  return (
    <Layout>
      <div className="flex flex-col pt-12 px-44 " onClick={LayoutClickHandler}>
        <Typography variant="h2" gutterBottom>
          Create Room
        </Typography>
        {isSubmit ? (
          <div className="flex flex-col items-center">
            <h2>제출</h2>
            <div ref={canvasRef}>
              <QRCode value={submitResult.link} />
            </div>
            <button onClick={handleQRCode}>Click</button>
          </div>
        ) : (
          <Grid container spacing={3}>
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-lg font-bold mb-2"
                >
                  RoomName
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Room Name"
                  {...register('name', { required: true })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {errors.name && (
                <span className="text-2xl">This field is required</span>
              )}

              <div>
                isSecret
                <Controller
                  name="isSecret"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      name="checkedA"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  )}
                />
                <Controller
                  name="isSecret"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox name="checkedB" color="primary" />}
                      label="Primary"
                    />
                  )}
                />
              </div>
              <div>
                password
                <input type="password" name="password" />
              </div>
              <div className="flex  mb-3">
                <h3>인원 제한</h3>
                <input
                  type="number"
                  name="maxPeople"
                  id="maxPeople"
                  className="appearance-none "
                />
              </div>
              <div>
                <label htmlFor="isCanSearched">검색 가능 여부</label>
                <input
                  defaultChecked={true}
                  type="checkbox"
                  name="isCanSearched"
                  id="isCanSearched"
                  {...register('isCanSearched')}
                />
              </div>

              <div>icons</div>
              <div className="flex flex-col">
                description
                <textarea
                  name="description"
                  id="description"
                  placeholder="방 소개"
                  {...register('description')}
                  className="border-2 rounded-lg border-gray-400 focus:border-green-600 py-4 px-4"
                />
              </div>
              <div>
                tags
                <div onClick={ShowModalHandler} className="w-64">
                  <div className="flex  p-4 bg-indigo-100 rounded-xl">
                    {tagList.map((tag) => (
                      <div
                        key={tag}
                        className="flex  rounded-lg bg-white px-2 py-1 "
                      >
                        {tag}
                        <div data-tag-name={tag} onClick={TagCancelHandler}>
                          ❌
                        </div>
                      </div>
                    ))}
                  </div>
                  {isShowTagModal && (
                    <TagModal setTagList={setTagList} tagList={tagList} />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="mb-2 bg-green-400 px-5 py-2 text-xl tracking-wider rounded-2xl mx-24"
              >
                Create
              </button>
            </form>
          </Grid>
        )}
      </div>
    </Layout>
  )
}
