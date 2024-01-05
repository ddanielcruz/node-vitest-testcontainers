import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()
const users = await client.user.findMany()
console.log(`Found ${users.length} user(s)`)
