import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { customerAPI } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

function CustomerUpdate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    dob: '',
    id_number: '',
    account_balance: 0
  })

  useEffect(() => {
    fetchCustomer()
  }, [id])

  const fetchCustomer = async () => {
    try {
      const response = await customerAPI.getOne(id)
      const customer = response.data
      setFormData({
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        dob: format(new Date(customer.dob), 'yyyy-MM-dd'),
        id_number: customer.id_number,
        account_balance: parseFloat(customer.account_balance)
      })
    } catch (error) {
      toast.error('Failed to fetch customer details')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await customerAPI.update(id, formData)
      toast.success('Customer updated successfully!')
      navigate(`/customers/${id}`)
    } catch (error) {
      const errorMessage = error.response?.data || 'Failed to update customer'
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Validation error occurred')
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Update Customer</h1>
        <Link to={`/customers/${id}`} className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="first_name" className="form-label">
                  First Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="last_name" className="form-label">
                  Last Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="dob" className="form-label">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="id_number" className="form-label">
                  ID Number *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="id_number"
                  name="id_number"
                  value={formData.id_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="account_balance" className="form-label">
                  Account Balance
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="account_balance"
                  name="account_balance"
                  value={formData.account_balance}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button 
                type="submit" 
                className="btn btn-warning"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-pencil me-2"></i>
                    Update Customer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CustomerUpdate