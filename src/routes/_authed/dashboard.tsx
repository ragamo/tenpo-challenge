import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { searchStations } from '../../services/radios.service'

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
  const { data } = useQuery({
    queryKey: ['stations'],
    queryFn: () => searchStations(),
  })
  return <div>Hello "/_authed/dashboard"!</div>
}
