import styles, { layout } from "../style";
import SimpleButton from "./Button";
import SimpleSlider from "./Slider";
import { useState, useEffect } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useContract } from "../utils/useContract.js";
import CircularProgress from "@mui/material/CircularProgress";
import Notification, { showToast } from "./Notification"; // Adjust the import path
import { useWallet } from "@txnlab/use-wallet";
import {
  CRI_ASA_ID,
  USDC_ASA_ID,
  rounding_digits,
} from "../constants/index.js";

const Exchange = () => {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [isBuyCriMode, setIsBuyCriMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { activeAddress } = useWallet();
  const { donor_buy_token, get_asa_balance } = useContract();
  const [cri_balance, set_cri_balance] = useState(0);
  const [usdc_balance, set_usdc_balance] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => fetchData(), 3000);
    return () => {
      clearInterval(interval);
    };
  }, [activeAddress]);

  async function fetchData() {
    try {
      let criBalance = await get_asa_balance(CRI_ASA_ID);
      set_cri_balance(criBalance / 1_000_000);

      let usdcBalance = await get_asa_balance(USDC_ASA_ID);
      set_usdc_balance(usdcBalance / 1_000_000);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleSliderChange = (newValue: number) => {
    setSliderValue(newValue);
  };

  const handleConfirmButton = () => {
    if (!activeAddress) {
      showToast("Not logged !", false);
      return;
    }

    if (!isBuyCriMode) {
      showToast("Not implemented yet !", false);
      return;
    }

    setLoading(true);
    donor_buy_token(sliderValue * 1_000_000)
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
      });
  };

  return (
    <section className={`${layout.sectionCol}`}>
      <div className={`${layout.sectionCenter}`}>
        <div
          className={`${layout.sectionCenter} ${styles.paragraph} bg-box-2 rounded-[20px] box-shadow py-8 px-12`}
        >
          <div className=" flex flex-row ">
            <p className={`${styles.heading3}`}>Buy CRI</p>
            {false && (
              <button
                type="button"
                className={`m-2 w-8 h-8 py-6 px-6 text-primary bg-blue-gradient rounded-[15px] ${styles.flexCenter}`}
                onClick={() => setIsBuyCriMode((prev) => !prev)}
              >
                <AutorenewIcon />
              </button>
            )}
          </div>
          {false && (
            <p className={`${styles.paragraph} mt-5 `}>
              {isBuyCriMode ? "Buy " : "Sell "} CRI Token
            </p>
          )}

          <p className={`${styles.paragraph} mt-8 `}>
            {"USDC Amount: " + usdc_balance.toPrecision(rounding_digits)}
          </p>

          <p className={`${styles.paragraph} mt-8 `}>
            {"CRI Amount: " + cri_balance.toPrecision(rounding_digits)}
          </p>

          {loading && <CircularProgress className="absolute" />}

          <SimpleSlider
            handlerFunction={handleSliderChange}
            minValue={0}
            maxValue={
              isBuyCriMode ? Math.trunc(usdc_balance) : Math.trunc(cri_balance)
            }
          />

          <SimpleButton onClick={handleConfirmButton}>Confirm</SimpleButton>
        </div>
        <Notification />
      </div>
    </section>
  );
};

export default Exchange;
