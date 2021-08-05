import * as yup from 'yup'
import { object, SchemaOf } from 'yup'
import { CreateRoomInput } from '~/__generated__/globalTypes'

const yupCreateRoom: SchemaOf<CreateRoomInput> = object().shape({
  name: yup.string().required(),
  description: yup.string().max(5, '설명은 최대 5자입니다.'),
  isSecret: yup.boolean(),
  isCanSearched: yup.boolean(),
  password: yup.string().when('isSecret', {
    is: true,
    then: yup.string().required(),
  }),
  tagNames: yup.array(),
  maxNum: yup.number().min(10).max(100),
})

export default yupCreateRoom
