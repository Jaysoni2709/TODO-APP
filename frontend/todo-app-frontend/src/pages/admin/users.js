import { useEffect, useState } from "react";
import axios from "../../../utils/api";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
    const router = useRouter();
  

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout'); 
      Cookies.remove('refreshToken'); 
      router.push('/login'); 
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users", err);
    }
  };

  const toggleBlock = async (id) => {
    try {
      await axios.put(`/admin/block/${id}`);
      loadUsers(); // reload list
    } catch (err) {
      console.error("Block toggle failed", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Registered Users</h2>
      <button variant="danger" onClick={handleLogout}>
            Logout
          </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Blocked</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.isBlocked ? "Yes" : "No"}</td>
              <td>
                <button
                  className={`btn btn-${u.isBlocked ? "success" : "danger"} btn-sm`}
                  onClick={() => toggleBlock(u._id)}
                >
                  {u.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
    
  );
};

export default AdminUsers;
