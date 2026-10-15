'use client'

import { useActionState } from 'react'
import { createUser } from '../../actions/users'

export default function CreateUserForm({
  canChooseRole,
}: {
  canChooseRole: boolean
}) {
  const [state, formAction, pending] = useActionState(createUser, undefined)

  return (
    <form action={formAction} className="space-y-3">
      <h2 className="text-lg font-semibold">Créer un utilisateur</h2>

      <input
        name="name"
        placeholder="Nom"
        required
        className="w-full rounded border border-zinc-300 px-3 py-2"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full rounded border border-zinc-300 px-3 py-2"
      />
      <input
        name="password"
        type="password"
        placeholder="Mot de passe (8 caractères minimum)"
        required
        className="w-full rounded border border-zinc-300 px-3 py-2"
      />

      {canChooseRole ? (
        <select
          name="role"
          defaultValue="user"
          className="w-full rounded border border-zinc-300 px-3 py-2"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="super_admin">super_admin</option>
        </select>
      ) : (
        <input type="hidden" name="role" value="user" />
      )}

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-green-600">{state.success}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? 'Création...' : 'Créer'}
      </button>
    </form>
  )
}