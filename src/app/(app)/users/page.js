'use client'

import { useEffect, useState } from 'react'
import Header from '@/app/(app)/Header'
import axios from '@/lib/axios'
import Button from '@/components/Button'

const Users = () => {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users')
      setUsers(res.data)
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAddUser = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/users', { name, email })
      setName('')
      setEmail('')
      fetchUsers()
    } catch (err) {
      console.error('Error adding user:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/users/${id}`)
        fetchUsers()
      } catch (err) {
        console.error('Error deleting user:', err)
      }
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Header title="Users" />
      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <form onSubmit={handleAddUser} className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="border border-gray-300 p-2 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="border border-gray-300 p-2 rounded"
              />
            </div>
            <Button type="submit" className="mt-4" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </Button>
          </form>

          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-60 border border-gray-300 p-2 rounded mb-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className="p-4 border rounded-xl shadow-sm hover:shadow-md transition"
              >
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-gray-600">{user.email}</p>
                <Button
                  className="mt-2 bg-red-500 hover:bg-red-600"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Users
