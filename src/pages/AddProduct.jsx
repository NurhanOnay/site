import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddProduct({ products, setProducts }) {
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    id: Date.now(),
    title: "",
    price: 0,
    category: "",
    description: "",
    thumbnail: "",
    rating: 0,
  });

  const handleSave = () => {
    setProducts([...products, newProduct]);
    Swal.fire("Eklendi!", "Yeni ürün başarıyla eklendi.", "success");
    navigate("/products"); // Kaydettikten sonra ürün listesine dön
  };

  return (
    <div className="add-product-page">
      <h2>Yeni Ürün Ekle</h2>
      <input
        type="text"
        placeholder="Ürün Adı"
        value={newProduct.title}
        onChange={(e) =>
          setNewProduct({ ...newProduct, title: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Fiyat"
        value={newProduct.price}
        onChange={(e) =>
          setNewProduct({ ...newProduct, price: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Kategori"
        value={newProduct.category}
        onChange={(e) =>
          setNewProduct({ ...newProduct, category: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Resim URL"
        value={newProduct.thumbnail}
        onChange={(e) =>
          setNewProduct({ ...newProduct, thumbnail: e.target.value })
        }
      />
      <textarea
        placeholder="Açıklama"
        value={newProduct.description}
        onChange={(e) =>
          setNewProduct({ ...newProduct, description: e.target.value })
        }
      />
      <div className="add-product-buttons">
        <button onClick={handleSave}>Ekle</button>
        <button onClick={() => navigate("/products")}>İptal</button>
      </div>
    </div>
  );
}
