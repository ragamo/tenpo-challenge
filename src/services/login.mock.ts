import { SignJWT, jwtVerify } from 'jose'
import type { User } from '../auth'

// Para efectos de la prueba, se usa una clave secreta fija
const SECRET_KEY = new TextEncoder().encode('supersecretkey')
let userData: User | null = null

/**
 * Simula una autenticación exitosa y devuelve un JWT
 * @param username - El nombre de usuario
 * @param password - La contraseña
 * @returns El usuario y el JWT
 */
export const mockLogin = async (username: string, password: string) => {
  const response = await fetch('/user.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (response.ok) {
    // Crea un fake JWT para simular autenticación exitosa
    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(SECRET_KEY)

    const user = await response.json()
    userData = { ...user, token }
    return userData
  } else {
    throw new Error('Invalid username or password')
  }
}

/**
 * Valida un token JWT
 * @param token - El token JWT
 * @returns El usuario si el token es válido
 */
export const mockValidateToken = async (token: string) => {
  try {
    await jwtVerify(token, SECRET_KEY)
    return { valid: true, user: userData }
  } catch (error) {
    return { valid: false, user: null }
  }
}
