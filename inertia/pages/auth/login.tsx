import { Form } from '@adonisjs/inertia/react'

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--gray-12)]">Login</h1>
          <p className="text-[var(--gray-7)] mt-2">Enter your details below to login to your account</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-2xl dark:shadow-black/30 p-8 border border-[var(--gray-3)]">
          <Form route="session.store" className="space-y-6">
            {({ errors }) => (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--gray-10)] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="username"
                    data-invalid={errors.email ? 'true' : undefined}
                    className="w-full border border-[var(--gray-4)] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--gray-1)] text-[var(--gray-10)]"
                  />
                  {errors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[var(--gray-10)] mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    className="w-full border border-[var(--gray-4)] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--gray-1)] text-[var(--gray-10)]"
                  />
                  {errors.password && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <button type="submit" className="w-full bg-[var(--gray-12)] text-[var(--gray-1)] rounded-lg px-4 py-2.5 font-medium hover:opacity-90 transition-opacity">
                    Login
                  </button>
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  )
}
