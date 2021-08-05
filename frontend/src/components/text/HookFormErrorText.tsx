import { Box, Typography } from '@material-ui/core'
import React from 'react'

type HFETextProps = {
  text: string | undefined
}

const HFEText: React.FC<HFETextProps> = ({ text }) => {
  return (
    <Box
      component="span"
      display="block"
      visibility={text ? 'visible' : 'hidden'}
    >
      <Typography variant="subtitle2" component="label" color="error">
        {text ? text : ''}
      </Typography>
    </Box>
  )
}

export default HFEText
