import type { Importance } from '../types'

const cfg = {
  alta:   { label: 'Alta',  bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
  'média':{ label: 'Média', bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24' },
  baixa:  { label: 'Baixa', bg: 'rgba(34,197,94,0.12)',   color: '#4ade80' },
} satisfies Record<Importance, { label: string; bg: string; color: string }>

interface Props {
  importance: Importance
  small?: boolean
}

export default function ImportanceBadge({ importance, small = false }: Props) {
  const c = cfg[importance] ?? cfg.baixa
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-body font-medium ${small ? 'text-[10px] px-1.5 py-px' : 'text-xs px-2 py-0.5'}`}
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      <span
        className="rounded-full shrink-0"
        style={{ width: small ? 4 : 6, height: small ? 4 : 6, backgroundColor: c.color }}
      />
      {c.label}
    </span>
  )
}
