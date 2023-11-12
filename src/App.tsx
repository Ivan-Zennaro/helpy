import styles from "./style";
import { useAppSelector } from "./store/store.js";

import {
  WalletProvider,
  useInitializeProviders,
  PROVIDER_ID,
} from "@txnlab/use-wallet";
import { PeraWalletConnect } from "@perawallet/connect";

import {
  Footer,
  Navbar,
  Hero,
  Login,
  Exchange,
  Donate,
  PayMerchant,
  MerchDashboard,
  DonorDashboard,
  CriDashboard,
  NoFeaturesInfo,
} from "./components";

const App = () => {
  const roles = useAppSelector((state) => state.account.roles);

  const providers = useInitializeProviders({
    providers: [{ id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect }],
  });

  return (
    <WalletProvider value={providers}>
      <div className="bg-primary w-full overflow-hidden">
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className={`${styles.boxWidth}`}>
            <Navbar />
          </div>
        </div>

        <div className={`bg-primary ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Hero />
          </div>
        </div>

        <div className={` ${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <div className="sm:hidden">{<Login />}</div>
            <div id="dashboard">
              {roles.is_redcross && <CriDashboard />}
              {roles.is_donor && <DonorDashboard />}
              {roles.is_merchant && <MerchDashboard />}
            </div>

            <div id="features">
              {roles.is_donor && <Exchange />}
              {(roles.is_donor || roles.is_redcross) && <Donate />}
              {(roles.is_redcross || roles.is_family) && <PayMerchant />}
              {!roles.is_donor &&
                !roles.is_family &&
                !roles.is_redcross &&
                !roles.is_merchant && <NoFeaturesInfo />}
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </WalletProvider>
  );
};

export default App;
