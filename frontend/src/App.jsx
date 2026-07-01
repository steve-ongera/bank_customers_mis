import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import CustomerList from './pages/CustomerList'
import CustomerDetail from './pages/CustomerDetail'
import CustomerCreate from './pages/CustomerCreate'
import CustomerUpdate from './pages/CustomerUpdate'
import CustomerDelete from './pages/CustomerDelete'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content-wrapper">
        <Sidebar />
        <div className="main-content">
          <div className="container-fluid">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/create" element={<CustomerCreate />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/customers/:id/edit" element={<CustomerUpdate />} />
              <Route path="/customers/:id/delete" element={<CustomerDelete />} />
            </Routes>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App