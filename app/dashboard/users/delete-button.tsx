'use client'

import { deleteUser } from '../../actions/users'

export default function DeleteButton({ id }: { id: number }) {
  return (
    <form
      action={deleteUser.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm('Supprimer cet utilisateur ?')) {
          e.preventDefault()
        }
      }}
    >
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Supprimer
      </button>
    </form>
  )
}