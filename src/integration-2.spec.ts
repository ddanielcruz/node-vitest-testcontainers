import { execSync } from 'node:child_process'

import { describe, beforeAll, afterAll, it, expect } from 'vitest'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { PrismaClient } from '@prisma/client'

const TIMEOUT = 60 * 1000 // 60 seconds

describe('[2] Integration Test', () => {
  let pgContainer: StartedPostgreSqlContainer

  beforeAll(async () => {
    // Creates the container
    const container = new PostgreSqlContainer()
    pgContainer = await container.start()

    // Run Prisma migrations
    process.env.DATABASE_URL = pgContainer.getConnectionUri()
    execSync('pnpm prisma migrate deploy')
  }, TIMEOUT)

  afterAll(async () => {
    await pgContainer?.stop()
  }, TIMEOUT)

  it('queries users on Postgres', async () => {
    const client = new PrismaClient()
    const promise = client.user.findMany()
    await expect(promise).resolves.toHaveLength(0)
  })
})
