'use server'

import prisma from '@/lib/db'
import { assertRole } from '@/lib/rbac'
import { revalidatePath } from 'next/cache'
import { sendNotificationEmail } from '@/lib/mail'

export async function markNotificationReadAction(id: string) {
  try {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message || 'Database error' }
  }
}

export async function markAllNotificationsReadAction() {
  const profile = await assertRole(['ADMIN', 'MANAGER', 'QA', 'AGENT'])
  
  try {
    await prisma.notification.updateMany({
      where: { userId: profile.id, isRead: false },
      data: { isRead: true },
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message || 'Database error' }
  }
}

export async function generateDemoNotificationsAction() {
  const profile = await assertRole(['ADMIN', 'MANAGER', 'QA', 'AGENT'])
  
  try {
    const list = [
      {
        title: 'Weekly Performance Report',
        message: 'Your Weekly QA summary is ready. Average audit score: 87.5% (+2.4%).',
        type: 'SYSTEM_ALERT',
      },
      {
        title: 'Subscription Expiring',
        message: 'Attention: Your organization subscription price plan expires in 3 days.',
        type: 'SYSTEM_ALERT',
      },
      {
        title: 'Invite Accepted',
        message: 'Team member Sarah Jenkins has accepted your invite and joined your workspace.',
        type: 'SYSTEM_ALERT',
      },
    ]

    const createdNotifications = []
    for (const item of list) {
      const created = await prisma.notification.create({
        data: {
          userId: profile.id,
          title: item.title,
          message: item.message,
          type: item.type as any,
        },
      })
      createdNotifications.push(created)
      sendNotificationEmail(profile.email, item.title, item.message)
    }

    revalidatePath('/dashboard')
    return { success: true, notifications: createdNotifications }
  } catch (err) {
    return { error: (err as Error).message || 'Database error' }
  }
}
