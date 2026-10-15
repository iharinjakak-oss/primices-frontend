'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type FormState = { error?: string; success?: string } | undefined

async function getToken(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) {
    redirect('/login')
  }
  return token
}

export async function createUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const token = await getToken()

  let res: Response
  try {
    res = await fetch(`${process.env.API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
        role: String(formData.get('role') ?? 'user'),
      }),
      cache: 'no-store',
    })
  } catch {
    return { error: 'Impossible de joindre le serveur.' }
  }

  if (res.status === 401) {
    redirect('/login')
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    const firstError = data?.errors
      ? (Object.values(data.errors)[0] as string[])[0]
      : null
    return { error: firstError ?? data?.message ?? 'Création impossible.' }
  }

  revalidatePath('/dashboard/users')
  return { success: 'Utilisateur créé.' }
}

export async function deleteUser(id: number) {
  const token = await getToken()

  const res = await fetch(`${process.env.API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (res.status === 401) {
    redirect('/login')
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    const message = data?.message ?? 'Suppression impossible.'
    redirect(`/dashboard/users?error=${encodeURIComponent(message)}`)
  }

  revalidatePath('/dashboard/users')
  redirect('/dashboard/users')
}