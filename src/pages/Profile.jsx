import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import ProductModal from "../components/ProductModal";
import PublishModal from "../components/PublishModal";
import "./Profile.css";

function Profile() {
    const { currentUser, userData, wishlist } = useAuth();
    const { refreshTrigger, setRefreshTrigger } = useOutletContext() || { refreshTrigger: 0, setRefreshTrigger: () => {} };
    const [activeTab, setActiveTab] = useState("publicaciones"); // "publicaciones" o "deseos"
    const [misPublicaciones, setMisPublicaciones] = useState([]);
    const [misDeseos, setMisDeseos] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Mis Publicaciones
                const pubQuery = query(collection(db, "products"), where("userId", "==", currentUser.uid));
                const pubSnapshot = await getDocs(pubQuery);
                let pubs = pubSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Local sort to avoid requiring composite indexes for 'where userId +'orderBy'
                pubs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setMisPublicaciones(pubs);

                // 2. Fetch Wishlist Products
                if (wishlist.length > 0) {
                    // Firebase 'in' query supports max 10 elements. To avoid bugs, we chunk or fetch them separately if it's too large.
                    // For simplicity in this demo, we'll fetch all products and filter locally (or chunk to 10).
                    const allProductsSnapshot = await getDocs(collection(db, "products"));
                    const allProducts = allProductsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    
                    const wished = allProducts.filter(p => wishlist.includes(p.id));
                    wished.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                    setMisDeseos(wished);
                } else {
                    setMisDeseos([]);
                }
            } catch (err) {
                console.error("Error fetching profile data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser, wishlist, refreshTrigger]);

    const handleDelete = async (product) => {
        if (window.confirm(`¿Estás seguro que deseas eliminar "${product.title}"?`)) {
            try {
                await deleteDoc(doc(db, "products", product.id));
                setMisPublicaciones(misPublicaciones.filter(p => p.id !== product.id));
            } catch (error) {
                console.error("Error al eliminar", error);
            }
        }
    };

    const handleEditSuccess = () => {
        setProductToEdit(null);
        setRefreshTrigger(n => n + 1); // Trigger global layout refresh
    };

    return (
        <div className="profile-page" style={{ margin: '0', background: 'transparent' }}>
            {selectedProduct && (
                <ProductModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                />
            )}

            {productToEdit && (
                <PublishModal 
                    initialData={productToEdit}
                    onClose={() => setProductToEdit(null)}
                    onSuccess={handleEditSuccess}
                />
            )}

            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {userData?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                        <h2>{userData?.name || "Usuario"}</h2>
                        <p>{currentUser.email}</p>
                        {userData?.whatsapp && <p>📞 {userData.whatsapp}</p>}
                    </div>
                </div>

                <div className="profile-tabs">
                    <button 
                        className={`tab-btn ${activeTab === "publicaciones" ? "active" : ""}`}
                        onClick={() => setActiveTab("publicaciones")}
                    >
                        📝 Mis Publicaciones
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === "deseos" ? "active" : ""}`}
                        onClick={() => setActiveTab("deseos")}
                    >
                        ❤️ Lista de Deseos
                    </button>
                </div>

                <div className="profile-content">
                    {loading ? (
                        <p className="loading-msg">Cargando...</p>
                    ) : (
                        <>
                            {activeTab === "publicaciones" && (
                                misPublicaciones.length > 0 ? (
                                    <ProductGrid 
                                        products={misPublicaciones} 
                                        onProductClick={setSelectedProduct} 
                                        showActions={true}
                                        onEdit={(p) => setProductToEdit(p)}
                                        onDelete={handleDelete}
                                    />
                                ) : (
                                    <p className="empty-msg">No has publicado ningún producto aún.</p>
                                )
                            )}

                            {activeTab === "deseos" && (
                                misDeseos.length > 0 ? (
                                    <ProductGrid products={misDeseos} onProductClick={setSelectedProduct} />
                                ) : (
                                    <p className="empty-msg">Tu lista de deseos está vacía.</p>
                                )
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
