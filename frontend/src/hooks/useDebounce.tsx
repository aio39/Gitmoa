import { useRef } from 'react'

const useIdDebounce = (callback) => {
  const refId = useRef()
  const refNode = useRef()

  const getResult = (id, ...rest) => {
    if (id === refId.current) return refNode.current
    refId.current = id
    refNode.current = callback(...rest)
    return refNode.current
  }

  return getResult
}

export default useIdDebounce
