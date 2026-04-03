import ProductCard from "./ProductCard";
import "./ProductGrid.css";

function ProductGrid({ products, onProductClick, showActions, onEdit, onDelete }) {
    return (
        <div className="grid">
            {products.map((product) => (
                <ProductCard 
                   key={product.id} 
                   product={product} 
                   onClick={() => onProductClick(product)} 
                   showActions={showActions}
                   onEdit={onEdit}
                   onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default ProductGrid;