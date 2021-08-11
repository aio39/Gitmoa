import { useRouter } from 'next/router'
import React from 'react'
import { authTokenVar, isLoggedInVar } from './apollo'
import { ACCESS_TOKEN } from './constants'

export function addPropsToReactElement(element, props) {
  if (React.isValidElement(element)) {
    return React.cloneElement(element, props)
  }
  return element
}

export function addPropsToChildren(children, props) {
  if (!Array.isArray(children)) {
    return addPropsToReactElement(children, props)
  }
  return children.map((childElement) =>
    addPropsToReactElement(childElement, props)
  )
}

export function resetLoginData(): void {
  localStorage.removeItem(ACCESS_TOKEN)
  isLoggedInVar(false)
  authTokenVar(null)

  return null
}
