import { NavLink } from 'react-router-dom'

const baseLink =
  'rounded-full px-4 py-2 text-xs font-semibold transition border border-transparent'
const activeLink = 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200'
const idleLink = 'text-slate-400 hover:text-cyan-200 border-white/10'

export function ProfileSubNav({
  showWorkload,
  showTraineeTrainers,
  showTrainerAssignedStudents,
}: {
  showWorkload: boolean
  showTraineeTrainers: boolean
  showTrainerAssignedStudents: boolean
}) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-white/10 pb-4">
      <NavLink
        to="/profil"
        end
        className={({ isActive }) =>
          `${baseLink} ${isActive ? activeLink : idleLink}`
        }
      >
        Bilgilerim
      </NavLink>
      {showTraineeTrainers && (
        <NavLink
          to="/profil/antrenorler"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : idleLink}`
          }
        >
          Antrenörler
        </NavLink>
      )}
      <NavLink
        to="/profil/antrenmanlar"
        className={({ isActive }) =>
          `${baseLink} ${isActive ? activeLink : idleLink}`
        }
      >
        Antrenmanlarım
      </NavLink>
      {showTrainerAssignedStudents && (
        <NavLink
          to="/profil/ogrencilerim"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : idleLink}`
          }
        >
          Öğrencilerim
        </NavLink>
      )}
      {showWorkload && (
        <NavLink
          to="/profil/is-yuku"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : idleLink}`
          }
        >
          İş Yüküm
        </NavLink>
      )}
    </nav>
  )
}
