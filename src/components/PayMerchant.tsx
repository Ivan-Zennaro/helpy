import styles, { layout } from "../style.js";
import SimpleButton from "./Button.js";
import { useState, useEffect } from "react";
import { useContract } from "../utils/useContract.js";
import CircularProgress from "@mui/material/CircularProgress";
import Notification, { showToast } from "./Notification.js"; // Adjust the import path
import { useWallet } from "@txnlab/use-wallet";
import { CRI_ASA_ID, merchants } from "../constants/index.js";

interface ProductInCart {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const PayMerchant = () => {
  const { activeAddress } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const { pay_merchant, get_asa_balance } = useContract();
  const [cri_balance, set_cri_balance] = useState(0);
  const [merchant_to_pay, set_merchant_to_pay] = useState(merchants[0].address);

  const [productId_selected, set_productId_selected] = useState(
    merchants[0].products[0].id
  );
  const [qty, set_qty] = useState(1);
  const [cart, setCart] = useState<ProductInCart[]>([]); // list of items in cart
  const [amount_to_pay, set_amount_to_pay] = useState(0); // total amount to pay

  const addToCart = () => {
    const selectedProduct: any = merchants
      .flatMap((m) => m.products)
      .find((p: any) => p.id === productId_selected);

    if (selectedProduct) {
      const itemPrice = selectedProduct.price * qty;
      setCart([
        ...cart,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          quantity: qty,
          price: itemPrice,
        },
      ]);
      set_amount_to_pay(amount_to_pay + itemPrice);
    }
  };

  const clearCart = () => {
    setCart([]);
    set_amount_to_pay(0);
  };

  const handleSelectMerchant = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const merchant: string = event.target.value;
    set_merchant_to_pay(merchant);
  };

  const handleSelectProduct = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id: string = event.target.value;
    set_productId_selected(id);
  };

  const handleSelectQty = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const qty: number = +event.target.value;
    set_qty(qty);
  };

  useEffect(() => {
    const interval = setInterval(() => fetchData(), 3000);
    return () => {
      clearInterval(interval);
    };
  }, [activeAddress]);

  async function fetchData() {
    try {
      const criBalance = await get_asa_balance(CRI_ASA_ID);
      set_cri_balance(criBalance / 1_000_000);
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  }

  const handleConfirmButton = () => {
    if (!activeAddress) {
      showToast("Not logged !", false);
      return;
    }

    if (!merchant_to_pay) {
      showToast("No merchant has been selected !", false);
      return;
    }

    if (!amount_to_pay) {
      showToast("No item has been selected !", false);
      return;
    }

    if (amount_to_pay > cri_balance) {
      showToast("Insufficient funds !", false);
      return;
    }

    setLoading(true);
    pay_merchant(+amount_to_pay.toFixed(2) * 1_000_000, merchant_to_pay)
      .then((s) => {
        if (s == -1) {
          showToast("Error !", false);
        } else {
          showToast("Transaction executed successfully !", true);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        showToast("An error occurred: " + e, false);
        console.log(e);
      });
  };

  return (
    <section className={`${layout.sectionRow}`}>
      <div className={`${layout.sectionCenter}`}>
        <div
          className={`${layout.sectionCenter} ${styles.paragraph} bg-box-2 rounded-[20px] box-shadow py-8 px-12`}
        >
          <p className={`${styles.heading3}`}>Buy from merchants</p>

          <p className={`${styles.paragraph} mt-6  w-full`}>
            {"CRI Amount: " + cri_balance}
          </p>

          <div className={`mt-6 w-full relative flex flex-col`}>
            <label className="">Merchants:</label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={merchant_to_pay}
              onChange={handleSelectMerchant}
            >
              {merchants.map((option, index) => (
                <option key={index} value={option.address}>
                  {option.name} - {option.address.substring(0, 10)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-row w-full relative mt-6">
            <div className="w-2/3 pr-1">
              <label className="">Products:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark: dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={productId_selected}
                onChange={handleSelectProduct}
              >
                {merchants
                  .find((m) => m.address === merchant_to_pay)
                  ?.products.map((option, index) => (
                    <option key={index} value={option.id.toString()}>
                      {option.id} - {option.name} - {option.price} CRI
                    </option>
                  ))}
              </select>
            </div>

            <div className="w-1/3 pl-1 relative">
              <label className="">Quantity:</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark: dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={handleSelectQty}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
              </select>
            </div>
          </div>

          <div className="mt-8 w-full ">
            <h2 className="text-lg font-semibold mb-4">Shopping Cart:</h2>
            <ul>
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between mb-2"
                >
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 ">
              <p className="text-lg font-semibold">
                Total: ${amount_to_pay.toFixed(2)} = {amount_to_pay.toFixed(2)}{" "}
                CRI
              </p>

              <div className="flex flex-row w-full">
                <button
                  className="bg-box  py-2 mt-2 rounded-md w-1/2 mx-2"
                  onClick={() => addToCart()}
                >
                  Add to cart
                </button>
                <button
                  className="bg-box  py-2 mt-2 rounded-md w-1/2 mx-2"
                  onClick={() => clearCart()}
                >
                  Clear cart
                </button>
              </div>
            </div>
          </div>

          {loading && <CircularProgress className="absolute" />}

          <div className="flex flex-row">
            <SimpleButton styles="mt-10" onClick={handleConfirmButton}>
              Purchase
            </SimpleButton>
          </div>
        </div>
        <Notification />
      </div>
    </section>
  );
};

export default PayMerchant;
