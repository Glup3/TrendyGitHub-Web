'use client'

import { AppProgressBar } from 'next-nprogress-bar'
import { type PropsWithChildren } from 'react'

export const ProgressBarProvider = (props: PropsWithChildren) => {
  // https://github.com/Skyleen77/next-nprogress-bar/issues/54#issuecomment-2112282385
  const applySearchParamsWorkaround = (url: URL): URL => {
    const { location } = window
    const isSamePage = url.pathname === location.pathname
    const paramsChanged = url.search !== location.search
    if (isSamePage && paramsChanged) {
      url.pathname = `force_reload_${Math.random()}`
    }

    return url
  }

  return (
    <>
      <AppProgressBar
        height="4px"
        color="#2563EB"
        options={{ showSpinner: true }}
        targetPreprocessor={applySearchParamsWorkaround}
      />
      {props.children}
    </>
  )
}
