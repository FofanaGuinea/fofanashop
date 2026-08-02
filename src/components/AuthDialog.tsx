import { useState, type FormEvent, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export function AuthDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { connecter, inscrire } = useAuth()

  const [emailConnexion, setEmailConnexion] = useState('')
  const [motDePasseConnexion, setMotDePasseConnexion] = useState('')
  const [erreurConnexion, setErreurConnexion] = useState<string | null>(null)
  const [chargementConnexion, setChargementConnexion] = useState(false)

  const [nomInscription, setNomInscription] = useState('')
  const [emailInscription, setEmailInscription] = useState('')
  const [motDePasseInscription, setMotDePasseInscription] = useState('')
  const [erreurInscription, setErreurInscription] = useState<string | null>(null)
  const [chargementInscription, setChargementInscription] = useState(false)

  const soumettreConnexion = async (e: FormEvent) => {
    e.preventDefault()
    setErreurConnexion(null)
    setChargementConnexion(true)
    const resultat = await connecter(emailConnexion, motDePasseConnexion)
    setChargementConnexion(false)
    if (resultat.succes) {
      setOpen(false)
      setEmailConnexion('')
      setMotDePasseConnexion('')
    } else {
      setErreurConnexion(resultat.erreur)
    }
  }

  const soumettreInscription = async (e: FormEvent) => {
    e.preventDefault()
    setErreurInscription(null)
    setChargementInscription(true)
    const resultat = await inscrire(
      nomInscription,
      emailInscription,
      motDePasseInscription
    )
    setChargementInscription(false)
    if (resultat.succes) {
      setOpen(false)
      setNomInscription('')
      setEmailInscription('')
      setMotDePasseInscription('')
    } else {
      setErreurInscription(resultat.erreur)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bienvenue chez FOFANA Shop</DialogTitle>
          <DialogDescription>
            Connectez-vous ou créez un compte pour retrouver vos informations à chaque
            visite.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="connexion">
          <TabsList className="w-full">
            <TabsTrigger value="connexion" className="flex-1">
              Connexion
            </TabsTrigger>
            <TabsTrigger value="inscription" className="flex-1">
              Inscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connexion">
            <form onSubmit={soumettreConnexion} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="email-connexion">Email</Label>
                <Input
                  id="email-connexion"
                  type="email"
                  required
                  autoComplete="email"
                  value={emailConnexion}
                  onChange={(e) => setEmailConnexion(e.target.value)}
                  placeholder="vous@exemple.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mdp-connexion">Mot de passe</Label>
                <Input
                  id="mdp-connexion"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={motDePasseConnexion}
                  onChange={(e) => setMotDePasseConnexion(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {erreurConnexion && (
                <p className="text-sm text-destructive">{erreurConnexion}</p>
              )}
              <Button type="submit" className="w-full" disabled={chargementConnexion}>
                {chargementConnexion && <Loader2 className="size-4 animate-spin" />}
                Se connecter
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="inscription">
            <form onSubmit={soumettreInscription} className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="nom-inscription">Nom</Label>
                <Input
                  id="nom-inscription"
                  required
                  autoComplete="name"
                  value={nomInscription}
                  onChange={(e) => setNomInscription(e.target.value)}
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email-inscription">Email</Label>
                <Input
                  id="email-inscription"
                  type="email"
                  required
                  autoComplete="email"
                  value={emailInscription}
                  onChange={(e) => setEmailInscription(e.target.value)}
                  placeholder="vous@exemple.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mdp-inscription">Mot de passe</Label>
                <Input
                  id="mdp-inscription"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={motDePasseInscription}
                  onChange={(e) => setMotDePasseInscription(e.target.value)}
                  placeholder="6 caractères minimum"
                />
              </div>
              {erreurInscription && (
                <p className="text-sm text-destructive">{erreurInscription}</p>
              )}
              <Button type="submit" className="w-full" disabled={chargementInscription}>
                {chargementInscription && <Loader2 className="size-4 animate-spin" />}
                Créer mon compte
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
