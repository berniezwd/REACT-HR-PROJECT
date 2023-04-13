import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

export default function layoutContent() {
  return (
    <>
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  )
}
