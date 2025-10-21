import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQuantity, decreaseQuantity, clearCart } from "../store/cartSlice";

function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <div className="w-4/5 mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">🛒 Sepetim</h2>
      {items.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between mb-4 border-b pb-2">
              <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1 mx-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-indigo-600 font-bold">{item.price} ₺</p>
                <div className="flex items-center mt-2">
                  <button onClick={() => dispatch(decreaseQuantity(item.id))} className="px-2 bg-gray-200 rounded">-</button>
                  <span className="mx-2">{item.quantity}</span>
                  <button onClick={() => dispatch(increaseQuantity(item.id))} className="px-2 bg-gray-200 rounded">+</button>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            </div>
          ))}
          <h3 className="text-xl font-bold mt-4">Toplam: {totalPrice.toFixed(2)} ₺</h3>
          <button
            onClick={() => dispatch(clearCart())}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
          >
            Sepeti Temizle
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
