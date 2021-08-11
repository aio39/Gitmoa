import { useState } from 'react'

const useAnchor = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return [anchorEl, handleMenu, handleClose]
}

export default useAnchor
