import { Outlet, NavLink, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="flex flex-col" style={{ minHeight: '100dvh' }}>
      {/* ── Nav ── */}
      <nav
        className="flex items-center justify-between px-6 py-4 border-b shrink-0"
        style={{ borderColor: '#252538', background: '#0d0d12' }}
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold" style={{ color: '#e8a020' }}>
            ENEM
          </span>
          <span className="font-display text-xl font-light" style={{ color: '#ece9e0' }}>
            ·Study
          </span>
        </Link>

        <div className="flex items-center gap-7 text-sm font-body">
          {[
            { to: '/semanas',  label: 'Semanas'       },
            { to: '/materias', label: 'Matérias'      },
            { to: '/planner',  label: 'Planner'       },
            { to: '/stats',    label: 'Estatísticas'  },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link transition-colors ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                color: isActive ? '#e8a020' : '#7a7590',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── Page content ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
