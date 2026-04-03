import "./Sidebar.css";

function Sidebar({ 
    selectedCategories, setSelectedCategories, 
    selectedFaculties, setSelectedFaculties, 
    selectedDeliveries, setSelectedDeliveries,
    maxPrice, setMaxPrice 
}) {
    const handleCategoryCheck = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleFacultyCheck = (faculty) => {
        if (selectedFaculties.includes(faculty)) {
            setSelectedFaculties(selectedFaculties.filter(f => f !== faculty));
        } else {
            setSelectedFaculties([...selectedFaculties, faculty]);
        }
    };

    const handleDeliveryCheck = (delivery) => {
        if (selectedDeliveries.includes(delivery)) {
            setSelectedDeliveries(selectedDeliveries.filter(d => d !== delivery));
        } else {
            setSelectedDeliveries([...selectedDeliveries, delivery]);
        }
    };

    const categories = ["Libros", "Electrónica", "Comida", "Ropa", "Tutorías", "Materiales de Estudio", "Otros"];
    const faculties = ["Computación", "Ingeniería", "Medicina", "Derecho", "Administración", "Artes", "Arquitectura"];
    const deliveries = ["En la facultad", "Pabellón universitario", "A domicilio", "A acordar con el vendedor"];

    return (
        <div className="sidebar">
            <h2>Filtros</h2>

            <div className="filter-section">
                <h4>Precio Máximo: ${maxPrice}</h4>
                <input 
                    type="range" 
                    min="0" 
                    max="20000" 
                    step="100"
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(Number(e.target.value))} 
                    className="price-slider"
                />
            </div>

            <div className="filter-section">
                <h4>Categorías</h4>
                <div className="checkbox-list">
                    {categories.map(cat => (
                        <label key={cat} className="checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedCategories.includes(cat)}
                                onChange={() => handleCategoryCheck(cat)}
                            />
                            {cat}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <h4>Facultades</h4>
                <div className="checkbox-list">
                    {faculties.map(fac => (
                        <label key={fac} className="checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedFaculties.includes(fac)}
                                onChange={() => handleFacultyCheck(fac)}
                            />
                            {fac}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <h4>Lugares de Entrega</h4>
                <div className="checkbox-list">
                    {deliveries.map(del => (
                        <label key={del} className="checkbox-label">
                            <input 
                                type="checkbox" 
                                checked={selectedDeliveries.includes(del)}
                                onChange={() => handleDeliveryCheck(del)}
                            />
                            {del}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;