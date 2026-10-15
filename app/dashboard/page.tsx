import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '../actions/auth'

type User = {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'user'
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  const res = await fetch(`${process.env.API_URL}/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    redirect('/login')
  }

  const user: User = await res.json()

  return (
    <main className="min-h-screen bg-zinc-100 p-8 text-black">
      <div className="mx-auto max-w-2xl space-y-4 rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Tableau de bord</h1>
        <p>
          Connecté en tant que <strong>{user.name}</strong> ({user.email})
        </p>
        <p>
          Rôle : <strong>{user.role}</strong>
        </p>
                {user.role !== 'user' && (
          <Link href="/dashboard/users" className="inline-block underline">
            Gérer les utilisateurs
          </Link>
        )}

        <form action={logout}>
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </main>
  )
}