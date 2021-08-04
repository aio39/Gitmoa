import { useState } from 'react'

const useOnOff = () => {
  const [isOn, setIsShowing] = useState(false)

  function turnOnOff(): void {
    setIsShowing((p) => !p)
  }

  function turnOn(): void {
    setIsShowing(() => true)
  }

  function turnOff(): void {
    setIsShowing(() => false)
  }

  return [isOn, turnOnOff, turnOn, turnOff]
}

export default useOnOff
