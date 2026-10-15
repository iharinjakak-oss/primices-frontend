'use client'

import { useActionState } from 'react'
import { login } from '../actions/auth'

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined)

  return (
    <form
      action={formAction}
      className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 text-black shadow"
    >
      <h1 className="text-2xl font-semibold">Connexion</h1>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded border border-zinc-300 px-3 py-2"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}