import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem('user');
  const data = JSON.parse(name);

  const [users, setUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', address: '' });
  const [toggle, setToggle] = useState(true);
  const [isEdit, setEdit] = useState(null);

  const token = localStorage.getItem('token'); // Get the token from localStorage

  // Check if the token is available, otherwise, redirect to login
  if (!token) {
    navigate('/login');
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.phone || !newUser.address) {
        return alert("Fill all the fields");
      } else if (toggle) {
        await axios.post('http://localhost:1000/employee/add', newUser, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the request header
          },
        });
      } else {
        await axios.put(`http://localhost:1000/employee/update/${isEdit}`, newUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setNewUser({ name: '', email: '', phone: '', address: '' });
      setToggle(true);
      setEdit(null);
      setShowPopup(false);
      fetchData(); // Refresh the users list after add/update
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id) => {
    const item = users.find((item) => item._id === id); // Find the user by id
    setNewUser(item);
    setShowPopup(true);
    setToggle(false);
    setEdit(id);
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:1000/employee/getall', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add token to the request header
        },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && data.data && Array.isArray(data.data)) {
        setUsers(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:1000/employee/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData(); // Refresh users list after delete
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="mb-8">Welcome, {data}</p>

      <button
        onClick={() => setShowPopup(true)}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg mb-6"
      >
        + Add User
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-8 rounded-lg w-96">
            <h2 className="text-2xl mb-4">Add New User</h2>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <input
              type="number"
              placeholder="Phone Number"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              {toggle ? (
                <button
                  onClick={handleAddUser}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  Add
                </button>
              ) : (
                <button
                  onClick={handleAddUser}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                >
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <table className="w-full max-w-4xl text-left mt-8 border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Address</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.map((user, index) => (
            <tr key={index} className="hover:bg-gray-700">
              <td className="p-4">{user.name}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{user.phone}</td>
              <td className="p-4">{user.address}</td>
              <td className="p-4">
                <button
                  onClick={() => handleEdit(user._id)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleLogout}
        className="mt-12 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
