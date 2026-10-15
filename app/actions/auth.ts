'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(
  prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string } | undefined> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email et mot de passe obligatoires.' }
  }

  let res: Response
  try {
    res = await fetch(`${process.env.API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    })
  } catch {
    return { error: 'Impossible de joindre le serveur.' }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    return { error: data?.message ?? 'Connexion impossible.' }
  }

  const data = await res.json()

  const cookieStore = await cookies()
  cookieStore.set('token', data.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  })

  redirect('/dashboard')
}
export async function logout() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (token) {
    try {
      await fetch(`${process.env.API_URL}/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      })
    } catch {
      // Si Laravel ne répond pas, on supprime quand même le cookie.
    }
  }

  cookieStore.delete('token')
  redirect('/login')
}