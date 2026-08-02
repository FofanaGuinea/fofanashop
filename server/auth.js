import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'

export function hashPassword(motDePasse) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(motDePasse, salt, 64).toString('hex')
  return { salt, hash }
}

export function verifyPassword(motDePasse, salt, hash) {
  const attendu = Buffer.from(hash, 'hex')
  const obtenu = scryptSync(motDePasse, salt, 64)
  return attendu.length === obtenu.length && timingSafeEqual(attendu, obtenu)
}

export function creerToken() {
  return randomBytes(32).toString('hex')
}
