import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req:any, res:any) {
  if (req.method === 'POST') {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly`)
    res.status(200).json({ success: true, user })
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed.' })
  }
}
