import styles, { layout } from "../style";
import SimpleButton from "./Button";
import SimpleSlider from "./Slider";
import { useState, useEffect } from "react";
import { useContract } from "../utils/useContract.js";
import CircularProgress from "@mui/material/CircularProgress";
import Notification, { showToast } from "./Notification"; // Adjust the import path
import { useWallet } from "@txnlab/use-wallet";
import {
  CRI_ASA_ID,
  FAMILY_ROLE,
  REDCROSS_ROLE,
  family_addresses,
  cri_addresses,
  rounding_digits,
} from "../constants/index.js";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { useAppSelector } from "../store/store.js";

const Donate = () => {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { activeAddress } = useWallet();
  const { donor_transfer_asa, get_asa_balance } = useContract();
  const [cri_balance, set_cri_balance] = useState(0);
  const [donate_subject, set_donate_subject] = useState(FAMILY_ROLE);
  const [selectedAddress, setSelectedAddress] = useState(
    family_addresses[0].address
  );

  const roles = useAppSelector((state) => state.account.roles);

  const theme = createTheme({
    palette: {
      primary: {
        main: grey[50],
      },
    },
  });

  const handleDonateSubject = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    set_donate_subject(newAlignment);
    if (newAlignment === FAMILY_ROLE) {
      setSelectedAddress(family_addresses[0].address);
    } else {
      setSelectedAddress(cri_addresses[0].address);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setSelectedAddress(selectedOption);
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

  const handleSliderChange = (newValue: number) => {
    setSliderValue(newValue);
  };

  const handleConfirmButton = () => {
    if (!activeAddress) {
      showToast("Not logged !", false);
      return;
    }

    if (sliderValue <= 0) {
      showToast("Select a positive value from the slider !", false);
      return;
    }

    if (!selectedAddress) {
      showToast("Select address not well formed !", false);
      return;
    }

    setLoading(true);
    donor_transfer_asa(sliderValue * 1_000_000, selectedAddress)
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
    <section className={`${layout.sectionCol}`}>
      <div className={`${layout.sectionCenter}`}>
        <div
          className={`${layout.sectionCenter} ${styles.paragraph} rounded-[20px] bg-box-2 py-8 px-12`}
        >
          <div className=" flex flex-row ">
            <p className={`${styles.heading3}`}>Donate</p>
          </div>

          {roles.is_donor && (
            <ThemeProvider theme={theme}>
              <ToggleButtonGroup
                color="error"
                value={donate_subject}
                exclusive
                onChange={handleDonateSubject}
              >
                <ToggleButton value={REDCROSS_ROLE}>Red Cross</ToggleButton>
                <ToggleButton value={FAMILY_ROLE}>Family</ToggleButton>
              </ToggleButtonGroup>
            </ThemeProvider>
          )}

          <div className="w-full relative mt-10">
            <select
              className=" border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              value={selectedAddress}
              onChange={handleSelectChange}
            >
              {(donate_subject == FAMILY_ROLE
                ? family_addresses
                : cri_addresses
              ).map((option, index) => (
                <option key={index} value={option.address}>
                  {option.name} - {option.address.substring(0, 10)}
                </option>
              ))}
            </select>
          </div>

          <p className={`${styles.paragraph} mt-10`}>
            {"Description: " +
              (donate_subject == FAMILY_ROLE
                ? family_addresses
                : cri_addresses
              ).find((add) => add.address == selectedAddress)?.note}
          </p>

          <p className={`${styles.paragraph} mt-10 `}>
            {"CRI Amount: " + cri_balance.toPrecision(rounding_digits)}
          </p>

          {loading && <CircularProgress className="absolute" />}

          <SimpleSlider
            handlerFunction={handleSliderChange}
            minValue={0}
            maxValue={Math.trunc(cri_balance)}
          />

          <SimpleButton onClick={handleConfirmButton}>Confirm</SimpleButton>
        </div>
        <Notification />
      </div>
    </section>
  );
};

export default Donate;
