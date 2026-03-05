import { useState } from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/semanas', label: 'Semanas' },
  { to: '/materias', label: 'Matérias' },
  { to: '/planner', label: 'Planner' },
  { to: '/stats', label: 'Estatísticas' },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex flex-col" style={{ minHeight: '100dvh' }}>
      <nav
        className="flex items-center justify-between px-4 sm:px-6 py-4 border-b shrink-0 relative z-50"
        style={{ borderColor: '#252538', background: '#0d0d12' }}
      >
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <span className="font-display text-xl font-semibold" style={{ color: '#e8a020' }}>ENEM</span>
          <span className="font-display text-xl font-light" style={{ color: '#ece9e0' }}>·&ensp;Study</span>
        </Link>

        <div className="hidden sm:flex items-center gap-7 text-sm font-body">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) => `nav-link transition-colors ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({ color: isActive ? '#e8a020' : '#7a7590' })}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <button
          className="sm:hidden flex flex-col justify-center items-center gap-1.5 w-9 h-9 rounded-lg transition-colors"
          style={{ background: menuOpen ? '#1c1c28' : 'transparent' }}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span className="block h-px w-5 transition-all duration-200 origin-center" style={{ background: '#ece9e0', transform: menuOpen ? 'rotate(45deg) translateY(4px)' : 'none' }} />
          <span className="block h-px w-5 transition-all duration-200" style={{ background: '#ece9e0', opacity: menuOpen ? 0 : 1 }} />
          <span className="block h-px w-5 transition-all duration-200 origin-center" style={{ background: '#ece9e0', transform: menuOpen ? 'rotate(-45deg) translateY(-4px)' : 'none' }} />
        </button>
      </nav>

      {menuOpen && (
        <div className="sm:hidden flex flex-col border-b z-40 shrink-0" style={{ background: '#13131c', borderColor: '#252538' }}>
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to} to={to}
              onClick={() => setMenuOpen(false)}
              className="px-5 py-3.5 text-sm font-body border-b transition-colors"
              style={({ isActive }) => ({ color: isActive ? '#e8a020' : '#ece9e0', borderColor: '#252538', background: isActive ? '#e8a02008' : 'transparent' })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
