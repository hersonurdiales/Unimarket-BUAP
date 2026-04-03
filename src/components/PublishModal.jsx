import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "./PublishModal.css";

function PublishModal({ onClose, onSuccess, initialData }) {
    const { currentUser, userData } = useAuth();
    const [title, setTitle] = useState(initialData?.title || "");
    const [price, setPrice] = useState(initialData?.price || "");
    const [category, setCategory] = useState(initialData?.category || "Libros");
    const [faculty, setFaculty] = useState(initialData?.faculty || "Computación");
    const [condition, setCondition] = useState(initialData?.condition || "Nuevo");
    const [delivery, setDelivery] = useState(initialData?.delivery || "A acordar con el vendedor");
    const [image, setImage] = useState(initialData?.image || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const productData = {
                title,
                price: Number(price),
                category,
                faculty,
                condition: category === "Comida" ? "N/A" : condition,
                delivery,
                description,
                image: image || "",
                userId: currentUser.uid,
                sellerName: userData?.name || currentUser.displayName || "Usuario Anónimo",
                whatsapp: userData?.whatsapp || ""
            };

            if (initialData?.id) {
                // Update existing product
                await updateDoc(doc(db, "products", initialData.id), {
                    ...productData,
                    updatedAt: serverTimestamp()
                });
            } else {
                // Create new product
                await addDoc(collection(db, "products"), {
                    ...productData,
                    createdAt: serverTimestamp()
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error al publicar:", error);
            alert("Error al intentar publicar el producto. Inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{initialData ? "Editar Producto" : "Publicar Nuevo Producto"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Título:</label>
                        <input 
                            required 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="Ej. Libro de Cálculo diferencial" 
                        />
                    </div>
                    <div className="form-group">
                        <label>Precio ($):</label>
                        <input 
                            required 
                            type="number" 
                            min="0" 
                            value={price} 
                            onChange={e => setPrice(e.target.value)} 
                            placeholder="Ej. 500" 
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción / Detalles:</label>
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            placeholder="Agrega más detalles, zona de entrega, etc." 
                            rows="3"
                        />
                    </div>
                    <div className="form-group row">
                        <div className="half">
                            <label>Categoría:</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="Libros">Libros</option>
                                <option value="Electrónica">Electrónica</option>
                                <option value="Comida">Comida</option>
                                <option value="Ropa">Ropa</option>
                                <option value="Tutorías">Tutorías</option>
                                <option value="Materiales de Estudio">Materiales de Estudio</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>
                        <div className="half">
                            <label>Facultad:</label>
                            <select value={faculty} onChange={e => setFaculty(e.target.value)}>
                                <option value="Computación">Computación</option>
                                <option value="Ingeniería">Ingeniería</option>
                                <option value="Medicina">Medicina</option>
                                <option value="Derecho">Derecho</option>
                                <option value="Administración">Administración</option>
                                <option value="Artes">Artes</option>
                                <option value="Arquitectura">Arquitectura</option>
                            </select>
                        </div>
                    </div>
                    {category !== "Comida" && (
                        <div className="form-group row">
                            <div className="half">
                                <label>Condición:</label>
                                <select value={condition} onChange={e => setCondition(e.target.value)}>
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Usado">Usado</option>
                                </select>
                            </div>
                        </div>
                    )}
                    <div className="form-group">
                        <label>Lugar de Entrega:</label>
                        <select value={delivery} onChange={e => setDelivery(e.target.value)}>
                            <option value="A acordar con el vendedor">A acordar con el vendedor</option>
                            <option value="En la facultad">En la facultad</option>
                            <option value="Pabellón universitario">Pabellón universitario</option>
                            <option value="A domicilio">A domicilio / Donde estés</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>URL de Imagen (Opcional):</label>
                        <input 
                            type="url" 
                            value={image} 
                            onChange={e => setImage(e.target.value)} 
                            placeholder="https://ejemplo.com/imagen.jpg" 
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
                            Cancelar
                        </button>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : (initialData ? "Guardar cambios" : "Publicar producto")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PublishModal;
