import { useEffect, useState } from 'react'
import { customerAPI } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'

function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalBalance: 0,
    averageBalance: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await customerAPI.getAll()
      const customers = response.data
      const totalBalance = customers.reduce((sum, c) => sum + parseFloat(c.account_balance), 0)
      
      setStats({
        totalCustomers: customers.length,
        totalBalance: totalBalance,
        averageBalance: customers.length > 0 ? totalBalance / customers.length : 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-people me-2"></i>
                Total Customers
              </h5>
              <h2>{stats.totalCustomers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-wallet2 me-2"></i>
                Total Balance
              </h5>
              <h2>${stats.totalBalance.toFixed(2)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-calculator me-2"></i>
                Average Balance
              </h5>
              <h2>${stats.averageBalance.toFixed(2)}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard