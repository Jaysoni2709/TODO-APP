import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Container } from 'react-bootstrap';
import axios from '../../../utils/api'; 

const UpdateTask = () => {
  const router = useRouter();
  const { id } = router.query; 
  const [task, setTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const res = await axios.get(`/tasks/getTaskByID/${id}`);
          setTask(res.data);
        } catch (err) {
          setError('Failed to load task details');
        } finally {
          setLoading(false);
        }
      };

      fetchTask();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/tasks/updateTask/${id}`, task);
      router.push('/task/task');
    } catch (err) {
      setError('Failed to update task');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Update Task</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <Form.Group controlId="formBasicTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={task.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-3">
          Update Task
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateTask;
