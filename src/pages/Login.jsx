import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        // Register flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save extra data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name,
          email: email,
          whatsapp: whatsapp // Used to populate contacts
        });
      } else {
        // Login flow
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/"); // Redirect to home after success

    } catch (err) {
      console.error(err);
      setError("Error en la autenticación: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          {isRegistering ? "Crear una cuenta" : "Iniciar Sesión"}
        </h2>
        
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegistering && (
            <>
              <div className="form-group">
                <label>Nombre Completo:</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div className="form-group">
                <label>Número de WhatsApp:</label>
                <input 
                  type="tel" 
                  required 
                  value={whatsapp} 
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="10 dígitos"
                  pattern="[0-9]{10}"
                  title="Número de 10 dígitos sin espacios ni guiones"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              minLength="6"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading 
              ? "Procesando..." 
              : (isRegistering ? "Registrarse" : "Entrar")}
          </button>
        </form>

        <div className="login-toggle">
          {isRegistering ? (
            <p>¿Ya tienes cuenta? <span onClick={() => setIsRegistering(false)}>Inicia sesión aquí</span></p>
          ) : (
            <p>¿No tienes cuenta? <span onClick={() => setIsRegistering(true)}>Regístrate aquí</span></p>
          )}
        </div>
        
        <div style={{textAlign: 'center', marginTop: '20px'}}>
            <Link to="/" className="back-link">Volver al catálogo</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
