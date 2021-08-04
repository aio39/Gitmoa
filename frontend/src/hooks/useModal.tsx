import { useState } from 'react'

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false)

  function modalToggle(): void {
    setIsShowing((p) => !p)
  }

  return {
    isShowing,
    modalToggle,
  }
}

export default useModal
