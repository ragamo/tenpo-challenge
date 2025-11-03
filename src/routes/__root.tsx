import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { AuthContext } from '../auth'

interface AuthedContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<AuthedContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
})
