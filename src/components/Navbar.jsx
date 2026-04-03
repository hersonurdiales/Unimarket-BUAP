import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, User, LogOut } from 'lucide-react';
import "./Navbar.css";

function Navbar({ searchQuery, setSearchQuery, onPublishClick }) {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    return (
        <div className="navbar">
            <Link to="/" className="title-link">
                <h2 className="title">UniMarket BUAP</h2>
            </Link>

            {/* Buscador */}
            <input
                className="search"
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Botones */}
            <div className="navbar-actions">
                {currentUser && (
                    <button className="publish-btn nav-btn" onClick={onPublishClick}>
                        <PlusCircle size={18} /> Publicar
                    </button>
                )}
                
                {currentUser ? (
                    <div className="user-menu">
                        <Link to="/profile" className="profile-btn nav-btn">
                            <User size={18} /> Mi Perfil
                        </Link>
                        <button className="logout-btn nav-btn" onClick={handleLogout}>
                            <LogOut size={18} /> Salir
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="login-btn nav-btn">
                        <User size={18} /> Iniciar Sesión
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Navbar;