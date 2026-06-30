'use server'

import { createClient } from '@/lib/supabase/server'
import { loginSchema, signupSchema, LoginInput, SignupInput } from '@/lib/validations/auth'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function loginAction(data: LoginInput) {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Invalid form inputs.' }
  }

  const { email, password } = parsed.data
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Sync user fallback in case the database trigger did not run
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id }
      })
      if (!dbUser) {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email!,
            supabaseId: user.id,
            role: 'AGENT'
          }
        })
      }
    }
  } catch (dbErr) {
    console.error('Failed database sync on login:', dbErr)
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signupAction(data: SignupInput) {
  const parsed = signupSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Invalid form inputs.' }
  }

  const { email, password, firstName, lastName, organizationName } = parsed.data
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (authData.user) {
    try {
      await prisma.$transaction(async (tx) => {
        // Generate unique slug
        const slugBase = organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        const orgSlug = `${slugBase}-${Math.floor(1000 + Math.random() * 9000)}`
        
        // Create organization
        const org = await tx.organization.create({
          data: {
            name: organizationName,
            slug: orgSlug,
          }
        })

        // Initialize default organization settings
        await tx.setting.create({
          data: {
            organizationId: org.id,
            qaRubric: {
              compliance: ['Greeting check', 'Recording disclosure', 'Verified identity'],
              softSkills: ['Clarity', 'Active listening', 'Polite manner']
            },
            notificationsConfig: {
              email: true,
              inApp: true
            }
          }
        })

        // Upsert user profile
        await tx.user.upsert({
          where: { id: authData.user!.id },
          create: {
            id: authData.user!.id,
            email: email,
            supabaseId: authData.user!.id,
            firstName,
            lastName,
            role: 'ADMIN',
            organizationId: org.id
          },
          update: {
            firstName,
            lastName,
            role: 'ADMIN',
            organizationId: org.id
          }
        })
      })
    } catch (dbErr) {
      console.error('Failed profile sync on signup transaction:', dbErr)
    }
  }

  return { success: true }
}

export async function signoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}

export async function forgotPasswordAction(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function resetPasswordAction(password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
