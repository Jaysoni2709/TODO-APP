import { useState } from 'react';
import { useRouter } from 'next/router';  // To handle page navigation in Next.js
import { Button, Container, Row, Col } from 'react-bootstrap';  // For Bootstrap UI components

const HomePage = () => {
  const router = useRouter();

  const handleLogin = () => {
    // Navigate to the login page
    router.push('/login');
  };

  const handleSignup = () => {
    // Navigate to the signup page
    router.push('/signup');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Row>
        <Col className="text-center">
          <h1>Welcome to Our App</h1>
          <p>Choose an option to continue</p>

          {/* Login Button */}
          <Button variant="primary" onClick={handleLogin} className="m-2">
            Login
          </Button>

          {/* Sign Up Button */}
          <Button variant="success" onClick={handleSignup} className="m-2">
            Sign Up
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
