import styles from "../style";

const NoFeaturesInfo = () => (
  <section
    className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col rounded-[20px] bg-box`}
  >
    <div className="flex-1 flex flex-col">
      <h2 className={styles.heading2}>
        <div className="text-black">You must login to access features!</div>
      </h2>
      <p className={`${styles.paragraph} w-full mt-5`}>
        To access features you need to first connect your wallet into the
        application. Go to the login section, click connect and follow the
        information of the wallet provider !
      </p>
    </div>
  </section>
);

export default NoFeaturesInfo;
