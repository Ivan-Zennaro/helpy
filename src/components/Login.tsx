import { useEffect, useState } from "react";
import { useWallet } from "@txnlab/use-wallet";
import styles, { layout } from "../style";
import Button from "./Button";
import { useContract } from "../utils/useContract.js";
import { setAccount, clean, setRole } from "../store/features/accountSlice.js";
import { useAppDispatch } from "../store/store.js";

const Login = () => {
  const dispatch = useAppDispatch();

  const { providers, activeAccount } = useWallet();
  const { getRole } = useContract();
  const [is_donor, set_is_donor] = useState(false);
  const [is_merchant, set_is_merchant] = useState(false);
  const [is_family, set_is_family] = useState(false);
  const [is_redcross, set_is_redcross] = useState(false);

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
    <section id="login" className={layout.sectionCol}>
      <div
        className={`${layout.sectionCenter} ${styles.paragraph}  rounded-[20px] box-shadow bg-box-2 py-8 px-12`}
      >
        <div className="flex flex-col p-2 ">
          <p className={`${styles.heading2} `}>Account</p>
          {activeAccount?.address ? (
            <>
              <p className={`${styles.heading4} `}>
                Address: {activeAccount?.address.substring(0, 15)}
              </p>

              {is_donor && <p className={styles.paragraph}>You are a donor</p>}
              {is_merchant && (
                <p className={styles.paragraph}>You are a merchant</p>
              )}
              {is_family && (
                <p className={styles.paragraph}>You are a family</p>
              )}
              {is_redcross && (
                <p className={styles.paragraph}>You are a red cross</p>
              )}
              {!is_donor && !is_merchant && !is_family && !is_redcross && (
                <p>nessun ruolo</p>
              )}
            </>
          ) : (
            <p className={`${styles.heading3} mt-5`}>
              Connect your wallet to interact
            </p>
          )}
        </div>

        <div className="flex flex-row p-2">
          {providers?.map((provider) => (
            <div key={provider.metadata.id}>
              {!activeAccount?.address ? (
                <Button onClick={provider.connect}>Connect</Button>
              ) : (
                <Button onClick={provider.disconnect}>Disconnect</Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Login;
