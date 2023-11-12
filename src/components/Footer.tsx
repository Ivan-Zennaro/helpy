import styles from "../style";
import logo from "../assets/logo.png";

const Footer = () => (
  <section className={`${styles.flexCenter} ${styles.paddingY}`}>
    <div className="w-full flex justify-center  md:flex-row pt-6 border-t-[1px] border-t-[#3F3E45] ">
      <img
        src={logo}
        alt="Helpy"
        className="w-[250px] h-[80px] object-contain"
      />
    </div>
  </section>
);

export default Footer;
