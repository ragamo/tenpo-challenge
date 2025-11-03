import { SignJWT } from 'jose'
import { SECRET_KEY, fakeUser } from './consts'
import type { NextFunction, Request, Response } from 'express'

export default async (req: Request, res: Response, _: NextFunction) => {
  const { username, password } = req.body

  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(SECRET_KEY)

  res.json({
    ...fakeUser,
    token,
  })
}
