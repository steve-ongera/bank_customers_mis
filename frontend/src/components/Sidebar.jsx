import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <div className="sidebar bg-light border-end">
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active bg-primary text-white' : ''}`
            }
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/customers" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active bg-primary text-white' : ''}`
            }
          >
            <i className="bi bi-people me-2"></i>
            Customers
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/customers/create" 
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active bg-primary text-white' : ''}`
            }
          >
            <i className="bi bi-person-plus me-2"></i>
            Add Customer
          </NavLink>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar