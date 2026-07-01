import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { customerAPI } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll()
      setCustomers(response.data)
    } catch (error) {
      toast.error('Failed to fetch customers')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id)
        setCustomers(customers.filter(c => c.id !== id))
        toast.success('Customer deleted successfully')
      } catch (error) {
        toast.error('Failed to delete customer')
        console.error('Error:', error)
      }
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.account_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Customers</h1>
        <Link to="/customers/create" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add Customer
        </Link>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Account #</th>
              <th>Name</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <span className="badge bg-secondary">{customer.account_number}</span>
                  </td>
                  <td>{customer.first_name} {customer.last_name}</td>
                  <td>{customer.email}</td>
                  <td>${parseFloat(customer.account_balance).toFixed(2)}</td>
                  <td>
                    <Link 
                      to={`/customers/${customer.id}`} 
                      className="btn btn-sm btn-info me-1"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
                    <Link 
                      to={`/customers/${customer.id}/edit`} 
                      className="btn btn-sm btn-warning me-1"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <Link 
                      to={`/customers/${customer.id}/delete`} 
                      className="btn btn-sm btn-danger"
                    >
                      <i className="bi bi-trash"></i>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomerList