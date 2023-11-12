import styles from "../style";
import hero from "../assets/hero.png";

const Hero = () => {
  return (
    <section
      id="home"
      className={`flex md:flex-row flex-col ${styles.paddingY}`}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
      >
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-black ss:leading-[100.8px] leading-[75px]">
            The Next <br className="sm:block hidden" /> <span>Generation</span>{" "}
          </h1>
        </div>

        <h1 className="font-poppins font-semibold ss:text-[68px] text-[52px]  ss:leading-[100.8px] leading-[75px] w-full">
          Donation System
        </h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          A new solution on Algorand blockchain to ensure a secure and
          transparent donation system for thousands of organizations
        </p>
      </div>

      <div className={`${styles.flexCenter} md:my-0 relative m-8 mr-18`}>
        <img
          src={hero}
          alt="billing"
          className="w-[100%] h-[90%] relative z-[10] color-black"
        />
      </div>
    </section>
  );
};

export default Hero;
