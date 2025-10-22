import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "./cartSlice"; // <-- YOL DÜZELTİLDİ

function CartPage() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    // Sayfanın geri kalanıyla uyumlu olması için Layout'un içine yerleştirdik
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">🛒 Sepetim</h2>
        
        {items.length === 0 ? (
          <p className="text-center text-gray-500">Sepetiniz şu anda boş.</p>
        ) : (
          <>
            <div className="flow-root">
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.title}</h3>
                          <p className="ml-4">{item.price} ₺</p>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center rounded border border-gray-300">
                          <button
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                            className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 text-base font-medium">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(increaseQuantity(item.id))}
                            className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            Kaldır
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Toplam ve Butonlar */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <p>Toplam</p>
                <p>{totalPrice.toFixed(2)} ₺</p>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Sepeti Temizle
                </button>
                <button
                  // onClick={...} // Ödeme sayfasına yönlendirme
                  className="rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Ödemeye Git
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;