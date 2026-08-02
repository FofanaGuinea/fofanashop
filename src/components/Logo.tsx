import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('size-9 shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id="fofanaMark" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#fofanaMark)" />
      <path d="M12 9 H29 V14 H17 V17 H25 V22 H17 V31 H12 Z" fill="var(--primary-foreground)" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight">FOFANA</span>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Shop
        </span>
      </span>
    </div>
  )
}
