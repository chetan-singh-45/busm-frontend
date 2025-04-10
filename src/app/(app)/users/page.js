'use client'

import { useEffect, useState, Fragment, use } from 'react'
import Header from '@/app/(app)/Header'
import { useAllUser } from '@/hooks/users'
import axios from '@/lib/axios'
import { Dialog, Transition } from '@headlessui/react'
import Modal from '@/components/Modal'
import { updateUser } from '@/hooks/users'

const Users = () => {
  const { users, isLoading, isError, mutate } = useAllUser()

  const [userId, setUserId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  
  const openModal = () => setIsOpen(true)
  const closeModal = () => {
      setIsOpen(false)
      setName('')
      setEmail('')
      setPassword('')
      setError('')
    }
    
    //for edit
    const [showEditModal, setShowEditModal] = useState(false)

    const openEditModal = (user)=>{
        setEmail(user.email)
        setName(user.name)
        setUserId(user.id)
        setShowEditModal(true)
    }

    const closeEditModal = ()=>{
        setShowEditModal(false)
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
          const user = { email, name }
          await updateUser(user, userId)
      
          // Refresh the list
          mutate()
      
          closeEditModal()
          setName('')
          setEmail('')
          setPassword('')
          setError('')
          setUserId('')
        } catch (err) {
          setError(err.response?.data?.message || 'Something went wrong')
        } finally {
          setLoading(false)
        }
      }
      
    
  
  const handleCreateUser = async () => {
    setLoading(true)
    try {
      await axios.post('/api/users', { name, email, password })
      mutate()
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  

  const confirmAndDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await handleDeleteUser(id);
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`) // Make sure this hits your Laravel backend
      mutate() // Revalidate user list from SWR
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }  

  return (
    <>
      <Header title="Users" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-2xl text-gray-800">User List</h2>
                <button
                  onClick={openModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  + Add User
                </button>
              </div>

              {isLoading && <div>Loading...</div>}
              {isError && <div className="text-red-500">Error fetching users</div>}

              {users?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Id</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user ,index) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td>
                            <div className="flex gap-x-3">
                                <button
                                onClick={()=>{openEditModal(user)}}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                                >
                                Edit
                                </button>
                                <button
                                onClick={() => confirmAndDelete(user.id)}
                                className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition text-sm"
                                >
                                Delete
                                </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-4">No users found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    {/* Create User */}
        <Modal isOpen={isOpen} onClose={closeModal} title='Create User' >
        <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={closeModal}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateUser}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {loading ? 'Creating...' : 'Create'}
                    </button>
                  </div>
        </Modal>


        {/* Edit Modal */}
        <Modal isOpen={showEditModal} onClose={closeEditModal} title='Edit User' >
        <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                     onClick={closeEditModal}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                    onClick={()=>handleUpdate()}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {loading ? 'Updating...' : 'Update'}
                    </button>
                  </div>
        </Modal>
      
    </>
  )
}

export default Users
