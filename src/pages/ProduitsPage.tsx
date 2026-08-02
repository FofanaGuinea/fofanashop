import { useMemo, useState } from 'react'
import {
  ShoppingCart,
  ShoppingBag,
  Search,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Moon,
  Sun,
  User,
  LogOut,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/use-theme'
import { useAuth } from '@/context/AuthContext'
import { AuthDialog } from '@/components/AuthDialog'
import { Logo } from '@/components/Logo'

type Categorie = 'Audio' | 'Informatique' | 'Maison' | 'Accessoires'

type Produit = {
  id: number
  nom: string
  description: string
  prix: number
  ancienPrix?: number
  emoji: string
  badge?: string
  categorie: Categorie
  note: number
  avis: number
  degrade: string
}

const categories: Categorie[] = ['Audio', 'Informatique', 'Maison', 'Accessoires']

const produits: Produit[] = [
  {
    id: 1,
    nom: 'Casque sans fil',
    description: "Réduction de bruit active, 30h d'autonomie.",
    prix: 89.99,
    ancienPrix: 119.99,
    emoji: '🎧',
    badge: 'Populaire',
    categorie: 'Audio',
    note: 4.8,
    avis: 312,
    degrade: 'from-violet-500/15 to-fuchsia-500/15',
  },
  {
    id: 2,
    nom: 'Montre connectée',
    description: 'Suivi santé, GPS intégré, étanche.',
    prix: 149.0,
    emoji: '⌚',
    badge: 'Nouveau',
    categorie: 'Accessoires',
    note: 4.6,
    avis: 128,
    degrade: 'from-sky-500/15 to-cyan-500/15',
  },
  {
    id: 3,
    nom: 'Clavier mécanique',
    description: 'Switches rétroéclairés, format compact.',
    prix: 74.5,
    emoji: '⌨️',
    categorie: 'Informatique',
    note: 4.7,
    avis: 204,
    degrade: 'from-amber-500/15 to-orange-500/15',
  },
  {
    id: 4,
    nom: 'Enceinte portable',
    description: "Son 360°, résistante à l'eau.",
    prix: 59.9,
    ancienPrix: 79.9,
    emoji: '🔊',
    badge: 'Promo',
    categorie: 'Audio',
    note: 4.5,
    avis: 96,
    degrade: 'from-rose-500/15 to-red-500/15',
  },
  {
    id: 5,
    nom: 'Souris ergonomique',
    description: 'Précision élevée, prise en main confortable.',
    prix: 39.99,
    emoji: '🖱️',
    categorie: 'Informatique',
    note: 4.4,
    avis: 87,
    degrade: 'from-emerald-500/15 to-teal-500/15',
  },
  {
    id: 6,
    nom: 'Webcam HD',
    description: 'Full HD 1080p, micro intégré.',
    prix: 45.0,
    emoji: '📷',
    categorie: 'Informatique',
    note: 4.3,
    avis: 65,
    degrade: 'from-indigo-500/15 to-blue-500/15',
  },
  {
    id: 7,
    nom: 'Lampe connectée',
    description: 'Contrôle vocal, 16 millions de couleurs.',
    prix: 34.9,
    emoji: '💡',
    categorie: 'Maison',
    note: 4.6,
    avis: 152,
    degrade: 'from-yellow-500/15 to-amber-500/15',
  },
  {
    id: 8,
    nom: 'Aspirateur robot',
    description: 'Navigation laser, vidage automatique.',
    prix: 299.0,
    ancienPrix: 349.0,
    emoji: '🤖',
    badge: 'Promo',
    categorie: 'Maison',
    note: 4.7,
    avis: 219,
    degrade: 'from-slate-500/15 to-gray-500/15',
  },
  {
    id: 9,
    nom: 'Chargeur sans fil',
    description: 'Charge rapide 15W, design compact.',
    prix: 24.9,
    emoji: '🔌',
    categorie: 'Accessoires',
    note: 4.2,
    avis: 54,
    degrade: 'from-lime-500/15 to-green-500/15',
  },
  {
    id: 10,
    nom: 'Sac à dos urbain',
    description: 'Compartiment laptop 15", résistant à la pluie.',
    prix: 54.0,
    emoji: '🎒',
    categorie: 'Accessoires',
    note: 4.5,
    avis: 73,
    degrade: 'from-orange-500/15 to-amber-500/15',
  },
  {
    id: 11,
    nom: 'Écran 27" 4K',
    description: 'Dalle IPS, 99% sRGB, réglable en hauteur.',
    prix: 329.0,
    emoji: '🖥️',
    badge: 'Nouveau',
    categorie: 'Informatique',
    note: 4.9,
    avis: 141,
    degrade: 'from-blue-500/15 to-indigo-500/15',
  },
  {
    id: 12,
    nom: 'Prise connectée',
    description: 'Pilotage à distance, mesure de consommation.',
    prix: 19.9,
    emoji: '🔋',
    categorie: 'Maison',
    note: 4.1,
    avis: 39,
    degrade: 'from-teal-500/15 to-cyan-500/15',
  },
]

type LigneCommande = {
  produit: Produit
  quantite: number
}

function PanierSheet({
  lignes,
  total,
  onAugmenter,
  onDiminuer,
  onSupprimer,
  onVider,
}: {
  lignes: LigneCommande[]
  total: number
  onAugmenter: (id: number) => void
  onDiminuer: (id: number) => void
  onSupprimer: (id: number) => void
  onVider: () => void
}) {
  return (
    <SheetContent className="flex w-full flex-col sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Votre panier</SheetTitle>
        <SheetDescription>
          {lignes.length === 0
            ? 'Votre panier est vide.'
            : `${lignes.reduce((n, l) => n + l.quantite, 0)} article(s) sélectionné(s)`}
        </SheetDescription>
      </SheetHeader>

      {lignes.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center text-muted-foreground">
          <ShoppingBag className="size-10" />
          <p className="text-sm">Ajoutez des produits pour les retrouver ici.</p>
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto px-4">
          {lignes.map(({ produit, quantite }) => (
            <div
              key={produit.id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div
                className={cn(
                  'flex size-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-2xl',
                  produit.degrade
                )}
              >
                {produit.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{produit.nom}</p>
                <p className="text-sm text-muted-foreground">
                  {produit.prix.toFixed(2)} € × {quantite}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Retirer un exemplaire"
                  onClick={() => onDiminuer(produit.id)}
                >
                  <Minus className="size-3.5" />
                </Button>
                <span className="w-5 text-center text-sm tabular-nums">{quantite}</span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Ajouter un exemplaire"
                  onClick={() => onAugmenter(produit.id)}
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Retirer ${produit.nom} du panier`}
                onClick={() => onSupprimer(produit.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {lignes.length > 0 && (
        <SheetFooter className="border-t">
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <Button className="w-full">Passer la commande</Button>
          <Button variant="ghost" className="w-full" onClick={onVider}>
            Vider le panier
          </Button>
        </SheetFooter>
      )}
    </SheetContent>
  )
}

function Etoiles({ note }: { note: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'size-3.5',
              i < Math.round(note)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-muted text-muted'
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{note.toFixed(1)}</span>
    </div>
  )
}

export default function ProduitsPage() {
  const [recherche, setRecherche] = useState('')
  const [categorie, setCategorie] = useState<Categorie | 'Tout'>('Tout')
  const [panier, setPanier] = useState<Record<number, number>>({})
  const { theme, toggleTheme } = useTheme()
  const { utilisateur, deconnecter } = useAuth()

  const nombreArticlesPanier = Object.values(panier).reduce((total, q) => total + q, 0)

  const ajouterAuPanier = (id: number) => {
    setPanier((p) => ({ ...p, [id]: (p[id] ?? 0) + 1 }))
  }

  const diminuerAuPanier = (id: number) => {
    setPanier((p) => {
      const quantite = (p[id] ?? 0) - 1
      if (quantite <= 0) {
        const { [id]: _retire, ...reste } = p
        return reste
      }
      return { ...p, [id]: quantite }
    })
  }

  const supprimerDuPanier = (id: number) => {
    setPanier((p) => {
      const { [id]: _retire, ...reste } = p
      return reste
    })
  }

  const viderPanier = () => setPanier({})

  const lignesPanier: LigneCommande[] = Object.entries(panier)
    .map(([id, quantite]) => ({
      produit: produits.find((p) => p.id === Number(id))!,
      quantite,
    }))
    .filter((ligne) => ligne.produit)

  const totalPanier = lignesPanier.reduce(
    (total, l) => total + l.produit.prix * l.quantite,
    0
  )

  const produitsFiltres = useMemo(() => {
    return produits.filter((p) => {
      const matchCategorie = categorie === 'Tout' || p.categorie === categorie
      const matchRecherche = p.nom
        .toLowerCase()
        .includes(recherche.trim().toLowerCase())
      return matchCategorie && matchRecherche
    })
  }, [recherche, categorie])

  return (
    <div className="min-h-svh bg-background">
      {/* En-tête */}
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="size-4" />
                  Panier
                  {nombreArticlesPanier > 0 && (
                    <Badge className="absolute -right-2 -top-2 size-5 justify-center rounded-full p-0 tabular-nums">
                      {nombreArticlesPanier}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <PanierSheet
                lignes={lignesPanier}
                total={totalPanier}
                onAugmenter={ajouterAuPanier}
                onDiminuer={diminuerAuPanier}
                onSupprimer={supprimerDuPanier}
                onVider={viderPanier}
              />
            </Sheet>
            {utilisateur ? (
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 text-sm font-medium sm:flex">
                  <User className="size-4 text-primary" />
                  {utilisateur.nom}
                </span>
                <Button variant="outline" size="sm" onClick={deconnecter}>
                  <LogOut className="size-4" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <AuthDialog>
                <Button size="sm">
                  <User className="size-4" />
                  Se connecter
                </Button>
              </AuthDialog>
            )}
          </div>
        </div>
      </header>

      {/* Bandeau héro */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-6 py-14">
          <Badge variant="secondary" className="mb-4">
            ✨ Nouvelle collection été
          </Badge>
          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Le meilleur de la tech, choisi pour vous
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Des accessoires soigneusement sélectionnés, testés et garantis 2 ans.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1.5 rounded-full border bg-background/70 px-3 py-1.5">
              <Truck className="size-4 text-primary" />
              Livraison gratuite
            </div>
            <div className="flex items-center gap-1.5 rounded-full border bg-background/70 px-3 py-1.5">
              <ShieldCheck className="size-4 text-primary" />
              Garantie 2 ans
            </div>
            <div className="flex items-center gap-1.5 rounded-full border bg-background/70 px-3 py-1.5">
              <RotateCcw className="size-4 text-primary" />
              Retour sous 30 jours
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Nos produits</h2>
            <p className="text-sm text-muted-foreground">
              {produitsFiltres.length} article{produitsFiltres.length > 1 ? 's' : ''}{' '}
              disponible{produitsFiltres.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Recherche */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              className="pl-9"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="mb-8 flex flex-wrap gap-2">
          {(['Tout', ...categories] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategorie(c)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                categorie === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grille de produits */}
        {produitsFiltres.length === 0 ? (
          <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
            Aucun produit ne correspond à votre recherche.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {produitsFiltres.map((produit) => (
              <Card
                key={produit.id}
                className="group overflow-hidden py-0 gap-0 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader
                  className={cn(
                    'relative flex items-center justify-center bg-gradient-to-br p-8',
                    produit.degrade
                  )}
                >
                  {produit.badge && (
                    <Badge className="absolute left-3 top-3" variant="default">
                      {produit.badge}
                    </Badge>
                  )}
                  <span
                    className="text-6xl transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    {produit.emoji}
                  </span>
                </CardHeader>
                <CardContent className="space-y-1.5 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{produit.nom}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{produit.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <Etoiles note={produit.note} />
                    <span className="text-xs text-muted-foreground">
                      {produit.avis} avis
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-5 pt-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-semibold">
                      {produit.prix.toFixed(2)} €
                    </span>
                    {produit.ancienPrix && (
                      <span className="text-sm text-muted-foreground line-through">
                        {produit.ancienPrix.toFixed(2)} €
                      </span>
                    )}
                  </div>
                  <Button size="sm" onClick={() => ajouterAuPanier(produit.id)}>
                    <ShoppingCart className="size-4" />
                    {panier[produit.id] ? `Ajouté (${panier[produit.id]})` : 'Ajouter'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2026 FOFANA Shop — Interface de démonstration React + Vite + shadcn/ui
      </footer>
    </div>
  )
}
