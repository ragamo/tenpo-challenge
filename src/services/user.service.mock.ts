import { jwtVerify } from 'jose'
import { SECRET_KEY, fakeUser } from '../api/user/consts'

export const mockValidateToken = async (token: string) => {
  try {
    await jwtVerify(token, SECRET_KEY)
    return { valid: true, user: fakeUser }
  } catch (error) {
    return { valid: false, user: null }
  }
}
