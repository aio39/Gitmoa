import React from 'react'
import ReactDOM from 'react-dom'
import { GoX } from 'react-icons/go'
import { css, keyframes } from '@emotion/react'

type ModalProps = {
  isShowing: boolean
  hide: () => void
  children: React.ReactNode
}

const bounce = keyframes`
  from {
       opacity:0;
    transform: translate3d(0,5rem,0);
  }

  to {
       opacity:1;
    transform: translate3d(0,0,0);
  }
`

const Modal = ({ isShowing, hide, children }: ModalProps) =>
  isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div
            onClick={(e: any) => {
              if (!e.ModalMainClick) hide()
            }}
            className="bg-gray-900 bg-opacity-30 op flex justify-center items-center fixed w-screen h-screen  z-60 left-0 top-0 bottom-0 right-0 px-6"
          >
            <div
              onClick={(e: any) => {
                e.ModalMainClick = true
              }}
              css={css`
                animation: ${bounce} 0.5s ease;
              `}
              className="h-auto w-full rounded-md max-w-md bg-white relative px-8 py-16 text-gray-800"
              role="dialog"
            >
              <button
                aria-label="Close Modal"
                type="button"
                onClick={hide}
                className="absolute right-4 top-4 text-gray-800 hover:text-red-500"
              >
                <GoX size="2em" />
              </button>
              {children}
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null

export default Modal
