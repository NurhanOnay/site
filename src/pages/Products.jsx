import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false); // Yeni ürün ekleme modu
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = localStorage.getItem("role") || "user";

  const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

  const requireLogin = () => {
    if (!isLoggedIn()) {
      Swal.fire({
        icon: "warning",
        title: "Giriş Yapmalısınız",
        text: "Bu işlemi gerçekleştirmek için giriş yapın.",
        confirmButtonText: "Giriş Yap",
        showCancelButton: true,
        cancelButtonText: "İptal",
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.error(err));
  }, []);

  const handleAddToCart = (product) => {
    if (!requireLogin()) return;
    dispatch(addToCart({ ...product, quantity: 1 }));
    Swal.fire({
      icon: "success",
      title: "Sepete Eklendi!",
      text: `${product.title} sepete eklendi.`,
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Emin misiniz?",
      text: "Bu ürünü silmek üzeresiniz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Evet, Sil",
      cancelButtonText: "İptal",
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts(products.filter((p) => p.id !== id));
        Swal.fire("Silindi!", "Ürün başarıyla silindi.", "success");
      }
    });
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setIsAddMode(false); // Güncelleme modu
    setShowModal(true);
  };

  const handleModalSave = () => {
    if (isAddMode) {
      setProducts([...products, selectedProduct]); // Yeni ürün ekleme
      Swal.fire("Eklendi!", "Yeni ürün başarıyla eklendi.", "success");
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? selectedProduct : p))
      );
      Swal.fire("Güncellendi!", "Ürün bilgileri başarıyla değiştirildi.", "success");
    }
    setShowModal(false);
  };

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="products-container">
      <h1 className="page-title">Ürün Listesi</h1>

      {/* Kategori Filtreleri */}
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}

        {/* Admin Yeni Ürün Ekle Butonu */}
        {role === "admin" && (
          <button
            className="add-new-btn-small"
            onClick={() => {
              setSelectedProduct({
                id: Date.now(),
                title: "",
                price: 0,
                category: "",
                description: "",
                thumbnail: "",
                rating: 0,
              });
              setIsAddMode(true);
              setShowModal(true);
            }}
          >
            ➕ Yeni Ürün Ekle
          </button>
        )}
      </div>

      {/* Ürün Kartları */}
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="product-img"
            />
            <div className="product-info">
              <h3>{product.title}</h3>
              <p className="product-price">{product.price} $</p>
              <p className="product-category">{product.category}</p>
              <p className="product-rating">
                <span>⭐</span> {product.rating}/5
              </p>

              {role === "admin" ? (
                <div className="admin-actions">
                  <button
                    className="update-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(product);
                    }}
                  >
                    ✏️ Güncelle
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                  >
                    🗑️ Sil
                  </button>
                </div>
              ) : (
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  🛒 Sepete Ekle
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content modern-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{isAddMode ? "Yeni Ürün Ekle" : "Ürünü Güncelle"}</h2>
            <input
              type="text"
              value={selectedProduct.title}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, title: e.target.value })
              }
              placeholder="Ürün Adı"
            />
            <input
              type="number"
              value={selectedProduct.price}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, price: e.target.value })
              }
              placeholder="Fiyat"
            />
            <input
              type="text"
              value={selectedProduct.category}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  category: e.target.value,
                })
              }
              placeholder="Kategori"
            />
            <input
              type="text"
              value={selectedProduct.thumbnail}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  thumbnail: e.target.value,
                })
              }
              placeholder="Resim URL"
            />
            <textarea
              value={selectedProduct.description}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  description: e.target.value,
                })
              }
              placeholder="Açıklama"
            />
            <div className="modal-buttons">
              <button onClick={handleModalSave}>{isAddMode ? "Ekle" : "Kaydet"}</button>
              <button onClick={() => setShowModal(false)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
