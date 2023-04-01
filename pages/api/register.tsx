import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req:any, res:any) {
  if (req.method === 'POST') {
    const { email, password, username, confirmHashPassword } = req.body


    const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    return res.status(400).json({ message: 'Email already exists' });
  }
    const hashedPassword = await bcrypt.hash(password, 10)
    const confirmHashedPassword = await bcrypt.hash(password, 10)
    try {
      const user = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          confirmHashPassword: confirmHashedPassword,
        },
      })
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly`)
      console.log(token)
    
      res.status(200).json({ success: true, user })


    } catch (err) {
      console.log(err)
      res.status(400).json({ success: false, message: 'Failed to create user.' })
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed.' })
  }
}


