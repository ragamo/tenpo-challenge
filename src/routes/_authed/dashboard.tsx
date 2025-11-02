import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard')({
  component: RouteComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

function RouteComponent() {
  return <div>Hello "/_authed/dashboard"!</div>
}
