import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { customerAPI } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

function CustomerDelete() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

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

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await customerAPI.delete(id)
      toast.success('Customer deleted successfully!')
      navigate('/customers')
    } catch (error) {
      toast.error('Failed to delete customer')
      console.error('Error:', error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!customer) return <div>Customer not found</div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Delete Customer</h1>
        <Link to={`/customers/${id}`} className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </Link>
      </div>

      <div className="card border-danger">
        <div className="card-body">
          <div className="text-center py-4">
            <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
            <h3 className="mt-3">Are you sure?</h3>
            <p className="text-muted">
              You are about to delete the following customer account. This action cannot be undone.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="bg-light p-3 rounded">
                <p><strong>Account Number:</strong> {customer.account_number}</p>
                <p><strong>Name:</strong> {customer.first_name} {customer.last_name}</p>
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Balance:</strong> ${parseFloat(customer.account_balance).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="d-grid gap-2 d-md-flex justify-content-center mt-4">
            <button
              className="btn btn-danger btn-lg"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="bi bi-trash me-2"></i>
                  Confirm Delete
                </>
              )}
            </button>
            <Link to={`/customers/${id}`} className="btn btn-secondary btn-lg">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDelete