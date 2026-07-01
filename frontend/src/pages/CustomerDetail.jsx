import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { customerAPI } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

function CustomerDetail() {
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomer()
  }, [id])

  const fetchCustomer = async () => {
    try {
      const response = await customerAPI.getOne(id)
      setCustomer(response.data)
    } catch (error) {
      toast.error('Failed to fetch customer details')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!customer) return <div>Customer not found</div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Customer Details</h1>
        <div>
          <Link to="/customers" className="btn btn-secondary me-2">
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </Link>
          <Link to={`/customers/${id}/edit`} className="btn btn-warning me-2">
            <i className="bi bi-pencil me-2"></i>
            Edit
          </Link>
          <Link to={`/customers/${id}/delete`} className="btn btn-danger">
            <i className="bi bi-trash me-2"></i>
            Delete
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-muted">Personal Information</h5>
              <hr />
              <p><strong>First Name:</strong> {customer.first_name}</p>
              <p><strong>Last Name:</strong> {customer.last_name}</p>
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Date of Birth:</strong> {format(new Date(customer.dob), 'PPP')}</p>
              <p><strong>ID Number:</strong> {customer.id_number}</p>
            </div>
            <div className="col-md-6">
              <h5 className="text-muted">Account Information</h5>
              <hr />
              <p><strong>Account Number:</strong> 
                <span className="badge bg-secondary ms-2">{customer.account_number}</span>
              </p>
              <p><strong>Account Balance:</strong> 
                <span className="fw-bold text-success">${parseFloat(customer.account_balance).toFixed(2)}</span>
              </p>
              <p><strong>Created:</strong> {format(new Date(customer.created_at), 'PPP p')}</p>
              <p><strong>Last Updated:</strong> {format(new Date(customer.updated_at), 'PPP p')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetail