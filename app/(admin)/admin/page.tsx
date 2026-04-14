export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AdminDashboardClient from './AdminDashboardClient'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  const user    = session?.user as { role?: string } | undefined

  if (!session || user?.role !== 'admin') redirect('/login?error=unauthorized')

  return <AdminDashboardClient />
}