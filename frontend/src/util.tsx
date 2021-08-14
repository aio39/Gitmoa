import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React from 'react'
import { authTokenVar, isLoggedInVar } from './apollo'
import checkJWT from './checkJWTExpire'
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

export function removeLoginData(): void {
  localStorage.removeItem(ACCESS_TOKEN)
  isLoggedInVar(false)
  authTokenVar(null)

  return null
}

export function setLoggedIn(token: string): void {
  authTokenVar(token)
  localStorage.setItem(ACCESS_TOKEN, token)
  isLoggedInVar(true)
}

export function updateLoginStatus(): void {
  const token = authTokenVar()
  const [isNotExpired] = checkJWT.create({ remainTime: '30s' }).check(token)
  if (!isNotExpired) removeLoginData()
}

export function dayjsToDate(day: string): Date {
  return dayjs(day, 'YYYY-MM-DD').toDate()
}

export function dateToDayjs(day: Date): string {
  return dayjs(day).format('YYYY-MM-DD')
}
