import React from 'react'

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
