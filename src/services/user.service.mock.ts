import { jwtVerify } from 'jose'
import { SECRET_KEY, fakeUser } from '../api/user/consts'

export const mockValidateToken = async (token: string) => {
  try {
    const secretKey = new TextEncoder().encode(SECRET_KEY)
    await jwtVerify(token, secretKey)
    return { valid: true, user: fakeUser }
  } catch (error) {
    return { valid: false, user: null }
  }
}
