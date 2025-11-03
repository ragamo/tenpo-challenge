import {
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'

import { InfoIcon } from 'lucide-react'
import { useAuth } from '../auth'
import type { FormEvent } from 'react'

const fallback = '/dashboard' as const

export const Route = createFileRoute('/login')({
  component: LoginComponent,
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
})

function LoginComponent() {
  const auth = useAuth()
  const router = useRouter()
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
    try {
      evt.preventDefault()
      const data = new FormData(evt.currentTarget)
      const username = data.get('username')?.toString()
      const password = data.get('password')?.toString()

      if (!username || !password) return

      await auth.login(username, password)
      await router.invalidate()
      await navigate({ to: search.redirect || fallback })
    } catch (error) {
      console.error('Error logging in: ', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoggingIn = isLoading || isSubmitting

  return (
    <div className="p-2 grid gap-2 place-items-center">
      <h3 className="text-xl">Login page</h3>
      {search.redirect && (
        <p className="text-red-500">You need to login to access this page.</p>
      )}
      <form className="mt-4 w-full sm:max-w-sm" onSubmit={onFormSubmit}>
        <div className="text-sm text-amber-800 border border-amber-500 rounded-md p-2 mb-4 bg-amber-100 flex items-center gap-2">
          <InfoIcon className="w-4 h-4 " />
          Any username and password will work.
        </div>
        <fieldset disabled={isLoggingIn} className="w-full grid gap-2">
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="username-input" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username-input"
              name="username"
              placeholder="Enter your username"
              type="text"
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
          <div className="grid gap-2 items-center w-full">
            <label htmlFor="password-input" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password-input"
              name="password"
              placeholder="Enter your password"
              type="password"
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md w-full disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isLoggingIn ? 'Loading...' : 'Login'}
          </button>
        </fieldset>
      </form>
    </div>
  )
}
