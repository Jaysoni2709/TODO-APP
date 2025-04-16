
import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/Home.module.css";
import { AuthProvider } from "../context/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
