import "./ProductCard.css";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Heart, Pencil, Trash2 } from 'lucide-react';

function ProductCard({ product, onClick, showActions, onEdit, onDelete }) {
    const { currentUser, wishlist, setWishlist } = useAuth();
    
    // Handle the safe-check locally
    const isFavorite = wishlist && wishlist.includes(product.id);

    const toggleFavorite = async (e) => {
        e.stopPropagation(); // Evita abrir el modal
        if (!currentUser) {
            alert("⚠️ Inicia sesión para guardar productos en tu Lista de Deseos.");
            return;
        }

        let newWishlist = [...wishlist];
        if (isFavorite) {
            newWishlist = newWishlist.filter(id => id !== product.id);
        } else {
            newWishlist.push(product.id);
        }

        setWishlist(newWishlist);

        try {
            await setDoc(doc(db, "wishlists", currentUser.uid), {
                productIds: newWishlist
            });
        } catch (error) {
            console.error("Error al actualizar la lista de deseos", error);
        }
    };

    return (
        <div className="card" onClick={onClick}>
            {showActions ? (
                <div className="card-actions-admin">
                    <button className="action-btn edit" onClick={(e) => { e.stopPropagation(); onEdit(product); }}>
                        <Pencil size={16} /> Editar
                    </button>
                    <button className="action-btn delete" onClick={(e) => { e.stopPropagation(); onDelete(product); }}>
                        <Trash2 size={16} />
                    </button>
                </div>
            ) : (
                <button className={`fav-btn ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite}>
                    <Heart size={20} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
                </button>
            )}
            
            {/* Imagen */}
            <div className="card-image">
                {product.image ? (
                    <img src={product.image} alt={product.title} />
                ) : (
                    <div className="placeholder">📷</div>
                )}
            </div>

            {/* Info */}
            <div className="card-content">
                <h3>{product.title}</h3>
                
                <p className="description-preview">
                    {product.description || "Sin descripción adicional."}
                </p>

                <div className="tags">
                    <span className={`tag ${product.condition}`}>
                        {product.condition}
                    </span>
                    <span className="faculty">{product.faculty}</span>
                    <span className="delivery-tag">📍 {product.delivery || "A acordar"}</span>
                </div>

                <p className="price">${product.price}</p>
            </div>
        </div>
    );
}

export default ProductCard;