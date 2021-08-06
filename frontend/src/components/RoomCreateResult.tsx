import React, { useRef } from 'react'
import QRCode from 'qrcode.react'

declare class ClipboardItem {
  constructor(data: { [mimeType: string]: Blob })
}

declare const navigator: any

const RoomCreateResult = () => {
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleQRCode = () => {
    const node: any = canvasRef.current.childNodes[0]

    node.toBlob((blob) => {
      const item = new ClipboardItem({ 'image/png': blob })
      navigator.clipboard.write([item])
    })
    const link = document.createElement('a')
    link.href = node.toDataURL('image/png')
    link.download = 'image/png'

    link.click()
  }

  return (
    <React.Fragment>
      <div className="flex flex-col items-center">
        <h2>제출</h2>
        <div ref={canvasRef}>
          <QRCode value="abcde" />
        </div>
        <button onClick={handleQRCode}>Click</button>
      </div>
    </React.Fragment>
  )
}

export default RoomCreateResult
