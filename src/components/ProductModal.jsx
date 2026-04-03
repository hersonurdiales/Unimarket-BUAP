import React from 'react';
import './ProductModal.css';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

function ProductModal({ product, onClose }) {
  const { currentUser } = useAuth();
  if (!product) return null;

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="product-modal-close" onClick={onClose}>×</button>
        
        <div className="product-modal-body">
          <div className="product-modal-image">
            {product.image ? (
                <img src={product.image} alt={product.title} />
            ) : (
                <div className="product-modal-placeholder">📷</div>
            )}
          </div>
          
          <div className="product-modal-info">
            <h2>{product.title}</h2>
            <p className="product-modal-price">${product.price}</p>
            
            <div className="product-modal-tags">
                <span className={`tag ${product.condition}`}>
                    {product.condition}
                </span>
                <span className="faculty">{product.faculty}</span>
                <span className="delivery-tag" style={{ background: '#fef08a', color: '#854d0e', padding: '3px 6px', borderRadius: '6px', fontSize: '10px' }}>
                    📍 {product.delivery || "A acordar con el vendedor"}
                </span>
            </div>

            <div className="product-modal-section">
              <h3>Descripción</h3>
              <p className="product-modal-desc">{product.description || "Sin descripción adicional."}</p>
            </div>
            
            <div className="product-modal-section">
              <h3>Datos del Vendedor</h3>
              <p><strong>Contacto:</strong> {product.whatsapp || "No especificado"}</p>
            </div>
            
            {currentUser ? (
              product.whatsapp ? (
                <a 
                  href={`https://wa.me/${product.whatsapp}?text=Hola,%20me%20interesa%20tu%20producto:%20${encodeURIComponent(product.title)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-btn"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <MessageCircle size={20} /> Contactar por WhatsApp
                </a>
              ) : (
                <button className="whatsapp-btn disabled" disabled>
                  Sin contacto
                </button>
              )
            ) : (
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Inicia sesión para contactar al vendedor.</p>
                <Link to="/login" className="whatsapp-btn" style={{ background: '#2563eb', display: 'block', marginTop: '10px' }}>
                  Ir a Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
