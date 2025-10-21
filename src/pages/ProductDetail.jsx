import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p>Yükleniyor...</p>;

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    Swal.fire({
      icon: "success",
      title: "Sepete Eklendi!",
      text: `${product.title} sepete eklendi.`,
      timer: 1200,
      showConfirmButton: false
    });
  };

  return (
    <div className="product-detail-container">
      <h1 className="detail-title">{product.title}</h1>

      <div className="product-detail-main">
        {/* Görseller */}
        <div className="product-images">
          <img src={product.thumbnail} alt={product.title} className="main-img" />
          <div className="other-images">
            {product.images?.map((img, idx) => (
              <img key={idx} src={img} alt={`${product.title}-${idx}`} />
            ))}
          </div>
        </div>

        {/* Ürün Bilgileri */}
        <div className="product-info">
          <p className="desc">{product.description}</p>
          <p><strong>Fiyat:</strong> {product.price} $</p>
          <p><strong>Kategori:</strong> {product.category}</p>
          <p><strong>Marka:</strong> {product.brand}</p>
          <p><strong>Stok:</strong> {product.stock}</p>
          <p><strong>Rating:</strong> {product.rating} ★</p>

          {/* Sepete ekle butonu */}
          <button className="add-cart-btn" onClick={handleAddToCart}>
            🛒 Sepete Ekle
          </button>
        </div>
      </div>

      {/* Satış & Lojistik Bilgileri */}
      <div className="sales-info">
        <h2>Satış & Lojistik Bilgileri</h2>
        <table>
          <tbody>
            <tr>
              <td><strong>warrantyInformation</strong></td>
              <td>Garanti süresi veya şartı</td>
            </tr>
            <tr>
              <td><strong>shippingInformation</strong></td>
              <td>Kargo süresi / koşulları</td>
            </tr>
            <tr>
              <td><strong>availabilityStatus</strong></td>
              <td>{product.stock > 0 ? "In Stock" : "Out of Stock"}</td>
            </tr>
            <tr>
              <td><strong>returnPolicy</strong></td>
              <td>14 gün içerisinde iade mümkündür</td>
            </tr>
            <tr>
              <td><strong>minimumOrderQuantity</strong></td>
              <td>1 adet</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Kullanıcı Yorumları */}
      <div className="reviews-section">
        <h2>Kullanıcı Yorumları</h2>
        {product.reviews?.length > 0 ? (
          product.reviews.map((r, i) => (
            <div key={i} className="review">
              <p><strong>{r.reviewerName}</strong> ({r.rating}★)</p>
              <p>{r.comment}</p>
              <small>{new Date(r.date).toLocaleDateString()}</small>
            </div>
          ))
        ) : (
          <p>Henüz yorum yok.</p>
        )}
      </div>
    </div>
  );
}
