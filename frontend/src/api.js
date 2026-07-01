import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API endpoints
export const customerAPI = {
  // Get all customers
  getAll: () => api.get('/customers/'),
  
  // Get a single customer
  getOne: (id) => api.get(`/customers/${id}/`),
  
  // Create a new customer
  create: (data) => api.post('/customers/', data),
  
  // Update a customer
  update: (id, data) => api.put(`/customers/${id}/`, data),
  
  // Partial update (for balance)
  updateBalance: (id, data) => api.patch(`/customers/${id}/balance/`, data),
  
  // Delete a customer
  delete: (id) => api.delete(`/customers/${id}/`),
}

export default api