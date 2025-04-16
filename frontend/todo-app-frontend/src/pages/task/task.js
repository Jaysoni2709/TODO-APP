import { useState, useEffect } from "react";
import axios from "../../../utils/api";
import { Button, Table, Container, Row, Col, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/tasks/getTask");
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleEdit = (id) => {
    router.push(`/task/edit/?id=${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/tasks/deleteTask/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h2 className="text-center">My Tasks</h2>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col className="text-end">
          <Button variant="success" onClick={() => router.push("/task/create")}>
            + Create Task
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading tasks...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Image</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  {task.imageUrl ? (
                    <img
                      src={`http://localhost:5000/uploads/${task.imageUrl}`}
                      alt={task.title}
                      style={{ width: "100px", height: "auto", objectFit: "cover" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(task._id)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Tasks;
