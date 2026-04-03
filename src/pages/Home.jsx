import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import Sidebar from "../components/Sidebar";
import ProductGrid from "../components/ProductGrid";
import ProductModal from "../components/ProductModal";

function Home() {
  const { searchQuery, refreshTrigger } = useOutletContext() || { searchQuery: "", refreshTrigger: 0 };
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [selectedDeliveries, setSelectedDeliveries] = useState([]);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      // Pedimos todos los productos sin Firebase orderBy para no excluir mágicamente 
      // los productos "viejos" que no tengan el campo 'createdAt'.
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Ordenamiento manual: los más nuevos primero, y los viejos hasta abajo.
      data.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setProducts(data);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  const normalize = (str) =>
    str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

  const filteredProducts = products.filter((product) => {
    const cats = selectedCategories || [];
    const prodCategory = product.category || product.categoria;
    const matchCategory = cats.length === 0
      ? true
      : cats.some(cat => normalize(prodCategory) === normalize(cat));

    const facs = selectedFaculties || [];
    const prodFaculty = product.faculty || product.facultad;
    const matchFaculty = facs.length === 0
      ? true
      : facs.some(fac => normalize(prodFaculty) === normalize(fac));

    const matchSearch = product.title
      ? normalize(product.title).includes(normalize(searchQuery))
      : true;

    const matchPrice = Number(product.price) <= maxPrice;

    const matchDelivery = selectedDeliveries.length === 0
      ? true
      : selectedDeliveries.includes(product.delivery || "A acordar con el vendedor");

    return matchCategory && matchFaculty && matchSearch && matchPrice && matchDelivery;
  });

  return (
    <>
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        <Sidebar
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedFaculties={selectedFaculties}
          setSelectedFaculties={setSelectedFaculties}
          selectedDeliveries={selectedDeliveries}
          setSelectedDeliveries={setSelectedDeliveries}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />

        <div style={{ flex: 1 }}>
          <h1 style={{ color: "#1e3a8a", margin: "20px 0 30px 0", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <ShoppingBag size={32} /> Catálogo de Productos
          </h1>
          <ProductGrid products={filteredProducts} onProductClick={setSelectedProduct} />
        </div>
      </div>
    </>
  );
}

export default Home;
