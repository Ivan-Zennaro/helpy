import { useState, useEffect } from "react";

import { useWallet } from "@txnlab/use-wallet";
import menu from "../assets/menu.svg";
import close from "../assets/close.svg";
import { navLinks } from "../constants";
import Button from "./Button";
import logo from "../assets/logo.png";
import styles from "../style";
import { useAppDispatch } from "../store/store.js";
import { useContract } from "../utils/useContract.js";
import { setAccount, clean, setRole } from "../store/features/accountSlice.js";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { providers, activeAccount } = useWallet();

  const { getRole } = useContract();
  const [is_donor, set_is_donor] = useState(false);
  const [is_merchant, set_is_merchant] = useState(false);
  const [is_family, set_is_family] = useState(false);
  const [is_redcross, set_is_redcross] = useState(false);

  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    dispatch(clean());
    if (!!activeAccount?.address) {
      dispatch(setAccount(activeAccount?.address));
      getRole()
        .then((roles) => {
          set_is_donor(roles.is_donor);
          set_is_merchant(roles.is_merchant);
          set_is_family(roles.is_family);
          set_is_redcross(roles.is_redcross);
          dispatch(setRole(roles));
        })
        .catch((e) => console.log(e));
    }
  }, [activeAccount?.address]);

  return (
    <nav className="w-flux flex py-6 justify-between items-center navbar">
      <div className="items-center ">
        <img src={logo} alt="Helpy" className="h-14 w-full ml-8" />
      </div>
      <ul className="list-none sm:flex hidden justify-end items-center flex-1 ">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`cursor-pointer ${styles.paragraph} ${
              index === navLinks.length - 1 ? "mr-0" : "mr-10"
            }`}
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}

        <li className="ml-5">
          {providers?.map((provider) => (
            <div key={provider.metadata.id}>
              {!activeAccount?.address ? (
                <Button onClick={provider.connect}>Connect</Button>
              ) : (
                <Button onClick={provider.disconnect}>
                  {activeAccount.address.substring(0, 8)}
                </Button>
              )}
            </div>
          ))}

          {activeAccount?.address && (
            <div className="text-center">
              {is_donor && <p>Role: Donor</p>}
              {is_merchant && <p>Role: Merchant</p>}
              {is_family && <p>Role: Family</p>}
              {is_redcross && <p>Role: Red Cross</p>}
              {!is_donor && !is_merchant && !is_family && !is_redcross && (
                <p>No role</p>
              )}
            </div>
          )}
        </li>
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle((prev) => !prev)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`${styles.paragraph} cursor-pointer ${
                  index === navLinks.length - 1 ? "mb-0" : "mb-4"
                }`}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
