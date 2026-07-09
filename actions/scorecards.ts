'use server'

import prisma from '@/lib/db'
import { assertRole } from '@/lib/rbac'
import { revalidatePath } from 'next/cache'

interface ScorecardInput {
  name: string
  description?: string
  complianceItems: string[]
  softSkillItems: string[]
}

export async function createScorecardAction(input: ScorecardInput) {
  const profile = await assertRole(['ADMIN', 'QA_MANAGER', 'QA'])
  const organizationId = profile.organizationId
  if (!organizationId) {
    return { error: 'No organization context found.' }
  }

  try {
    const scorecard = await prisma.qAScorecard.create({
      data: {
        name: input.name,
        description: input.description,
        complianceItems: input.complianceItems,
        softSkillItems: input.softSkillItems,
        organizationId,
      },
    })
    revalidatePath('/dashboard/qa')
    return { success: true, scorecard }
  } catch (err) {
    console.error('Failed to create scorecard:', err)
    return { error: (err as Error).message || 'Database error' }
  }
}

export async function editScorecardAction(id: string, input: ScorecardInput) {
  await assertRole(['ADMIN', 'QA_MANAGER', 'QA'])

  try {
    const oldScorecard = await prisma.qAScorecard.findUnique({
      where: { id },
      include: { teams: true },
    })

    if (!oldScorecard) {
      return { error: 'Scorecard not found.' }
    }

    const parentId = oldScorecard.parentId || oldScorecard.id

    const newScorecard = await prisma.$transaction(async (tx) => {
      const created = await tx.qAScorecard.create({
        data: {
          name: input.name,
          description: input.description,
          complianceItems: input.complianceItems,
          softSkillItems: input.softSkillItems,
          organizationId: oldScorecard.organizationId,
          version: oldScorecard.version + 1,
          parentId: parentId,
        },
      })

      await tx.qAScorecard.update({
        where: { id: oldScorecard.id },
        data: { isArchived: true },
      })

      for (const team of oldScorecard.teams) {
        await tx.team.update({
          where: { id: team.id },
          data: { qaScorecardId: created.id },
        })
      }

      return created
    })

    revalidatePath('/dashboard/qa')
    return { success: true, scorecard: newScorecard }
  } catch (err) {
    console.error('Failed to edit scorecard:', err)
    return { error: (err as Error).message || 'Database error' }
  }
}

export async function duplicateScorecardAction(id: string) {
  await assertRole(['ADMIN', 'QA_MANAGER', 'QA'])

  try {
    const source = await prisma.qAScorecard.findUnique({
      where: { id },
    })

    if (!source) {
      return { error: 'Source scorecard not found.' }
    }

    const duplicated = await prisma.qAScorecard.create({
      data: {
        name: `${source.name} (Copy)`,
        description: source.description,
        complianceItems: source.complianceItems || [],
        softSkillItems: source.softSkillItems || [],
        organizationId: source.organizationId,
      },
    })

    revalidatePath('/dashboard/qa')
    return { success: true, scorecard: duplicated }
  } catch (err) {
    console.error('Failed to duplicate scorecard:', err)
    return { error: (err as Error).message || 'Database error' }
  }
}

export async function archiveScorecardAction(id: string) {
  await assertRole(['ADMIN', 'QA_MANAGER', 'QA'])

  try {
    await prisma.qAScorecard.update({
      where: { id },
      data: { isArchived: true },
    })
    revalidatePath('/dashboard/qa')
    return { success: true }
  } catch (err) {
    console.error('Failed to archive scorecard:', err)
    return { error: (err as Error).message || 'Database error' }
  }
}

export async function assignScorecardToTeamAction(scorecardId: string | null, teamId: string) {
  await assertRole(['ADMIN', 'QA_MANAGER', 'QA'])

  try {
    await prisma.team.update({
      where: { id: teamId },
      data: { qaScorecardId: scorecardId },
    })
    revalidatePath('/dashboard/qa')
    return { success: true }
  } catch (err) {
    console.error('Failed to assign scorecard to team:', err)
    return { error: (err as Error).message || 'Database error' }
  }
}
