import express from 'express'
import cors from 'cors'
import { db } from './db.js'
import { hashPassword, verifyPassword, creerToken } from './auth.js'

const app = express()
app.use(cors())
app.use(express.json())

function utilisateurPublic(row) {
  return { id: row.id, nom: row.nom, email: row.email }
}

function recupererUtilisateurDepuisToken(token) {
  if (!token) return null
  const session = db
    .prepare('SELECT user_id FROM sessions WHERE token = ?')
    .get(token)
  if (!session) return null
  return db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id)
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  const user = recupererUtilisateurDepuisToken(token)
  if (!user) {
    return res.status(401).json({ erreur: 'Non authentifié.' })
  }
  req.user = user
  next()
}

app.post('/api/inscription', (req, res) => {
  const { nom, email, motDePasse } = req.body ?? {}

  if (!nom?.trim() || !email?.trim() || !motDePasse) {
    return res.status(400).json({ erreur: 'Nom, email et mot de passe sont requis.' })
  }
  if (motDePasse.length < 6) {
    return res
      .status(400)
      .json({ erreur: 'Le mot de passe doit contenir au moins 6 caractères.' })
  }

  const emailNormalise = email.trim().toLowerCase()
  const existant = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(emailNormalise)
  if (existant) {
    return res.status(409).json({ erreur: 'Un compte existe déjà avec cet email.' })
  }

  const { salt, hash } = hashPassword(motDePasse)
  const info = db
    .prepare('INSERT INTO users (nom, email, password_hash, salt) VALUES (?, ?, ?, ?)')
    .run(nom.trim(), emailNormalise, hash, salt)

  const user = db
    .prepare('SELECT * FROM users WHERE id = ?')
    .get(info.lastInsertRowid)

  const token = creerToken()
  db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, user.id)

  res.status(201).json({ token, utilisateur: utilisateurPublic(user) })
})

app.post('/api/connexion', (req, res) => {
  const { email, motDePasse } = req.body ?? {}

  if (!email?.trim() || !motDePasse) {
    return res.status(400).json({ erreur: 'Email et mot de passe sont requis.' })
  }

  const emailNormalise = email.trim().toLowerCase()
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(emailNormalise)

  if (!user || !verifyPassword(motDePasse, user.salt, user.password_hash)) {
    return res.status(401).json({ erreur: 'Email ou mot de passe incorrect.' })
  }

  const token = creerToken()
  db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, user.id)

  res.json({ token, utilisateur: utilisateurPublic(user) })
})

app.get('/api/moi', requireAuth, (req, res) => {
  res.json({ utilisateur: utilisateurPublic(req.user) })
})

app.post('/api/deconnexion', requireAuth, (req, res) => {
  const header = req.headers.authorization ?? ''
  const token = header.slice(7)
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
  res.status(204).end()
})

const PORT = 4000
app.listen(PORT, () => {
  console.log(`API FOFANA Shop prête sur http://localhost:${PORT}`)
})
