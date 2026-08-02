import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type Utilisateur = {
  id: number
  nom: string
  email: string
}

type Resultat = { succes: true } | { succes: false; erreur: string }

type AuthContextValue = {
  utilisateur: Utilisateur | null
  chargement: boolean
  connecter: (email: string, motDePasse: string) => Promise<Resultat>
  inscrire: (nom: string, email: string, motDePasse: string) => Promise<Resultat>
  deconnecter: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const CLE_TOKEN = 'fofana_token'

async function extraireErreur(reponse: Response) {
  try {
    const data = await reponse.json()
    return data.erreur ?? 'Une erreur est survenue.'
  } catch {
    return 'Une erreur est survenue.'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(CLE_TOKEN)
    if (!token) {
      setChargement(false)
      return
    }

    fetch('/api/moi', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUtilisateur(data.utilisateur))
      .catch(() => localStorage.removeItem(CLE_TOKEN))
      .finally(() => setChargement(false))
  }, [])

  const connecter = async (email: string, motDePasse: string): Promise<Resultat> => {
    const reponse = await fetch('/api/connexion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, motDePasse }),
    })
    if (!reponse.ok) {
      return { succes: false, erreur: await extraireErreur(reponse) }
    }
    const data = await reponse.json()
    localStorage.setItem(CLE_TOKEN, data.token)
    setUtilisateur(data.utilisateur)
    return { succes: true }
  }

  const inscrire = async (
    nom: string,
    email: string,
    motDePasse: string
  ): Promise<Resultat> => {
    const reponse = await fetch('/api/inscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, email, motDePasse }),
    })
    if (!reponse.ok) {
      return { succes: false, erreur: await extraireErreur(reponse) }
    }
    const data = await reponse.json()
    localStorage.setItem(CLE_TOKEN, data.token)
    setUtilisateur(data.utilisateur)
    return { succes: true }
  }

  const deconnecter = () => {
    const token = localStorage.getItem(CLE_TOKEN)
    localStorage.removeItem(CLE_TOKEN)
    setUtilisateur(null)
    if (token) {
      fetch('/api/deconnexion', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
  }

  return (
    <AuthContext.Provider
      value={{ utilisateur, chargement, connecter, inscrire, deconnecter }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return ctx
}
