'use client'

import { useState } from 'react'
import Header from '@/app/(app)/Header'
import { useAllUser } from '@/hooks/users'
import Modal from '@/components/Modal'

const Users = () => {
  const {
    users,
    isLoading,
    isError,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleLoginAs
  } = useAllUser()

  const [form, setForm] = useState({ id: '', name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [modalType, setModalType] = useState(null)

  const { id, name, email, password } = form

  const openModal = (type, user = {}) => {
    setForm({
      id: user.id || '',
      name: user.name || '',
      email: user.email || '',
      password: ''
    })
    setModalType(type)
    setError('')
  }

  const closeModal = () => {
    setForm({ id: '', name: '', email: '', password: '' })
    setModalType(null)
    setError('')
  }

  const handleInputChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }))

  const submitUser = async () => {
    setLoading(true)
    try {
      if (modalType === 'create') {
        await handleCreateUser({ name, email, password })
      } else {
        await handleUpdateUser({ name, email }, id)
      }
      closeModal()
    } catch (errMsg) {
      setError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  const confirmAndDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await handleDeleteUser(id)
      } catch (err) {
        console.error('Delete failed:', err)
      }
    }
  }

  return (
    <>
      <Header title="Users" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">User List</h2>
                <button
                  onClick={() => openModal('create')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
                >
                  + Add User
                </button>
              </div>
  
              {isLoading && <div className="text-gray-600">Loading...</div>}
              {isError && <div className="text-red-500">Error fetching users</div>}
  
              {users?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Login As</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {users.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => openModal('edit', user)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => confirmAndDelete(user.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm transition"
                              >
                                Delete
                              </button>
                            </div>
                              <button
                                onClick={() => handleLoginAs(user.id)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm transition"
                              >
                                Login As
                              </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-8">No users found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
  
      <Modal
        isOpen={modalType !== null}
        onClose={closeModal}
        title={modalType === 'edit' ? 'Edit User' : 'Create User'}
      >
        <div className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {modalType === 'create' && (
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
  
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
  
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={closeModal} className="text-sm text-gray-600 hover:underline">
            Cancel
          </button>
          <button
            onClick={submitUser}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded-md text-white ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading
              ? modalType === 'edit'
                ? 'Updating...'
                : 'Creating...'
              : modalType === 'edit'
              ? 'Update'
              : 'Create'}
          </button>
        </div>
      </Modal>
    </>
  )
  
}

export default Users
