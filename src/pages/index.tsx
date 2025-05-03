import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import logo from "../../public/images/logo.png";
import health from "../../public/images/healthh.svg";
import icon1 from "../../public/images/map-doctor.png";
import icon2 from "../../public/images/bell.png";
import icon3 from "../../public/images/phone-alt.png";
import icon4 from "../../public/images/clipboard-list.png";
import Medicin from "../../public/images/d.jpg";
import wiqaytna from "../../public/images/wiqaytna.png";
import { Medicine } from "@/types";
import { useTranslation } from "next-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

export default function Home() {
  const [speciality, setSpeciality] = useState("");
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;

  const [medcine, setMedcine] = useState<Medicine[] | null>(null);

  useEffect(() => {
    axios
      .get(`https://tatbib-api.onrender.com/medcine/getAllMedcine`)
      .then(function (response) {
        setMedcine(response.data);
        setSpeciality(response.data.speciality);
        console.log("all medcine", response.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    axios
      .get(
        `https://tatbib-api.onrender.com/medcine/searchMedcine/${speciality}`
      )
      .then((res) => {
        if (!res.data) {
          return false;
        } else {
          localStorage.setItem("medcine", JSON.stringify(res.data));
          router.push("/search_medicine");
        }
      });
  };
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const tips = [t("tip1"), t("tip2"), t("tip3"), t("tip4"), t("tip5")];

  const toggleTip = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <div
      className=""
      style={{ overflow: "auto", direction: locale === "ar" ? "rtl" : "ltr" }}
    >
      <section className="header-page">
        <div className="container">
          <div className="py-3 row justify-content-between align-items-center">
            <div className="py-2 col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-lg-0">
              <Image alt="" src={logo} width="100" />
              <div className="ms-3">
                <LanguageSwitcher />
              </div>
            </div>

            <div className="col-12 col-sm-9 col-lg-6 col-xl-4">
              <div className="row justify-content-center">
                <div className="col-6 col-md-4 col-lg-5 col-xl-6 d-flex justify-content-end">
                  <Link
                    className="btn_Espace_Professionnels"
                    href="/professional_space"
                  >
                    <i className="fas fa-user-injured"></i>{" "}
                    {t("professional_space")}
                  </Link>
                </div>
                <div className="col-6 col-md-4 col-lg-5 d-flex justify-content-center">
                  <Link className="btn_Espace_Patients" href="/patient_space">
                    <i className="fas fa-user-injured"></i> {t("patient_space")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav className="social" style={{ direction: "ltr", left: "2%" }}>
          <ul>
            <li>
              <Link href="#">
                {t("twitter")} <i className="fa fa-twitter twitter"></i>
              </Link>
            </li>
            <li>
              <Link href="#">
                {t("linkedin")} <i className="fa fa-linkedin"></i>
              </Link>
            </li>
            <li>
              <Link href="#">
                {t("google_plus")} <i className="fa fa-google-plus"></i>
              </Link>
            </li>
            <li>
              <Link href="#">
                {t("facebook")} <i className="fa fa-facebook"></i>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="container">
          <div className="row align-items-center">
            <div
              className="px-5 py-4 col-12 col-md-6 col-lg-6 formSearch"
              style={{ background: "white", borderRadius: "7px" }}
            >
              <h2 className="h2 text-center">{t("find_doctor_title")}</h2>
              <form className="py-5" onSubmit={handleSubmit}>
                <div className="col-12">
                  <div className="mb-4 input-icons">
                    <select
                      className="p-3 select"
                      defaultValue="Choisir Un Medcine"
                    >
                      <option defaultValue="Choisir Un Medcine">
                        {t("choose_medicine")}
                      </option>
                      {medcine &&
                        medcine.map((element, i: any) => (
                          <option key={i} value={element.fullName}>
                            {element.fullName}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-4 input-icons">
                    <select
                      className="p-3 select"
                      defaultValue="Choisir Une Spécialité"
                      onChange={(e) => setSpeciality(e.target.value)}
                    >
                      <option defaultValue="Choisir Une Spécialité">
                        {t("choose_speciality")}
                      </option>
                      {medcine &&
                        medcine.map((item, indexSpeciality: any) => (
                          <option key={indexSpeciality} value={item.speciality}>
                            {item.speciality}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-4 input-icons">
                    <select
                      className="p-3 select"
                      defaultValue="Choisir Une Ville"
                    >
                      <option defaultValue="Choisir Une Ville">
                        {t("Choose_city")}
                      </option>
                      {medcine &&
                        medcine.map((itemCity, index: any) => (
                          <option key={index} value={itemCity.city}>
                            {itemCity.city}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="d-grid">
                  <button type="submit" className="py-3 button1">
                    {t("search")}
                  </button>
                </div>
              </form>
            </div>
            <div className="col-12 col-md-6 col-lg-6 ">
              <Image alt="" id="health" className="health-img" src={health} />
            </div>
          </div>
        </div>
      </section>
      {/* New How It Works Section */}
      <div className="container py-5">
        <h3 className="text-center fw-bold fs-2" style={{ color: "#2CA5B8" }}>
          {t("how_it_works")}
        </h3>
        <div className="row py-4 text-center">
          <div className="col-12 col-md-4 mb-4">
            <i className="fa fa-search fa-3x text-info mb-3"></i>
            <h5 className="fw-bold">{t("step1_title")}</h5>
            <p>{t("step1_description")}</p>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <i className="fa fa-calendar fa-3x text-info mb-3"></i>

            <h5 className="fw-bold">{t("step2_title")}</h5>
            <p>{t("step2_description")}</p>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <i className="fa fa-user-md fa-3x text-info mb-3"></i>
            <h5 className="fw-bold">{t("step3_title")}</h5>
            <p>{t("step3_description")}</p>
          </div>
        </div>
      </div>
      {/* why choose tatbib Section */}

      <div className="py-5 container-fluid" style={{ background: "#2CA5B8" }}>
        <h3 className="text-center fw-bold fs-2 text-white">
          {t("why_choose_tatbib")}
        </h3>
        <div className="py-4 row justify-content-center text-center">
          {[icon1, icon2, icon3, icon4].map((icon, i) => (
            <div
              key={i}
              className="col-12 col-sm-6 col-md-3 d-flex flex-column align-items-center mb-4"
            >
              <Image alt="" src={icon} className="mb-3" />
              <span className="fw-bold fs-5 text-white">
                {t(
                  [
                    "smart_agenda",
                    "digital_medical_record",
                    "teleconsiel",
                    "secure_access",
                  ][i]
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New How It Works Section */}
      <div className="container my-5">
        <h3 className="text-center mb-4" style={{ color: "#2CA5B8" }}>
          {t("health_tips")}
        </h3>
        <div className="accordion" id="healthTipsAccordion">
          {tips.map((tip, index) => (
            <div className="accordion-item mb-2" key={index}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${
                    activeIndex === index ? "" : "collapsed"
                  }`}
                  onClick={() => toggleTip(index)}
                >
                  {t("tip" + (index + 1))}
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${
                  activeIndex === index ? "show" : ""
                }`}
              >
                <div className="accordion-body">{tip}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/*card Medcine Section */}
      <div className="container py-5 cardMedcine">
        <h4
          className="py-3 text-center fs-2 fw-bold"
          style={{ color: "#2CA5B8" }}
        >
          {t("our_practitioners")}
        </h4>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {medcine &&
            medcine.map((item: any, index: number) => (
              <SwiperSlide key={item._id || index}>
                <div
                  className="m-2 text-center p-3"
                  style={{
                    backgroundColor: "#E5E5E5",
                    borderRadius: "20px",
                    height: "100%",
                  }}
                >
                  <Image alt="" src={Medicin} className="img-fluid mb-2" />
                  <h4>{item.fullName}</h4>
                  <h5>{item.speciality}</h5>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div className="nav-elements"></div>

      <div className="container py-5">
        <div className="row align-items-center">
          {/* Text Section */}
          <div className="col-12 col-lg-8 mb-4 mb-lg-0">
            <h1 className="py-2">{t("covid_message")}</h1>
            <p className="fs-5 mb-3">{t("wiqaytna_message")}</p>
            <Link
              href="https://www.wiqaytna.ma/"
              target="_blank"
              className="btn btn-primary fs-5 w-100 w-md-auto"
              style={{
                background: "#1AA9E9",
                border: "none",
                maxWidth: "250px",
                height: "50px",
              }}
            >
              {t("more_information")}
            </Link>
          </div>

          {/* Image Section */}
          <div className="col-12 col-lg-4 text-center">
            <Image src={wiqaytna} alt="wiqaytna" className="img-fluid" />
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-sm-4 col-xs-12">
              <div className="single_footer">
                <h4>{t("specialties")}</h4>
                <ul>
                  <li>
                    <Link className="list-item" href="#">
                      {locale === "fr"
                        ? "Cardiologue"
                        : locale === "ar"
                        ? "طبيب القلب"
                        : "Cardiologist"}
                    </Link>
                  </li>
                  <li>
                    <Link className="list-item" href="#">
                      {locale === "fr"
                        ? "Dermatologue"
                        : locale === "ar"
                        ? "طبيب الجلدية"
                        : "Dermatologist"}
                    </Link>
                  </li>
                  <li>
                    <Link className="list-item" href="#">
                      {locale === "fr"
                        ? "Gastroentérologie"
                        : locale === "ar"
                        ? "أمراض الجهاز الهضمي"
                        : "Gastroenterology"}
                    </Link>
                  </li>
                  <li>
                    <Link className="list-item" href="#">
                      {locale === "fr"
                        ? "Dentiste"
                        : locale === "ar"
                        ? "طبيب أسنان"
                        : "Dentist"}
                    </Link>
                  </li>
                  <li>
                    <Link className="list-item" href="#">
                      {locale === "fr"
                        ? "Médecine Générale"
                        : locale === "ar"
                        ? "الطب العام"
                        : "General Medicine"}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-4 col-sm-4 col-xs-12">
              <div className="single_footer single_footer_address">
                <h4>{t("popular_searches")}</h4>
                <ul>
                  <li>
                    <Link className="list-item" href="#">
                      {locale === "fr"
                        ? "Médecin généraliste à casablanca"
                        : locale === "ar"
                        ? "طبيب عام في الدار البيضاء"
                        : "General doctor in casablanca"}
                    </Link>
                  </li>
                  <li>
                    <Link className="list-item" href="#">
                      {locale === "fr"
                        ? "Médecin dentiste à casablanca"
                        : locale === "ar"
                        ? "طبيب أسنان في الدار البيضاء"
                        : "Dentist doctor in casablanca"}
                    </Link>
                  </li>
                  <li>
                    <Link className="list-item" href="#">
                      {locale === "fr"
                        ? "Médecin dentiste à rabat"
                        : locale === "ar"
                        ? "طبيب أسنان في الرباط"
                        : "Dentist doctor in rabat"}
                    </Link>
                  </li>
                  <li>
                    <Link className="list-item" href="#">
                      {locale === "fr"
                        ? "Médecin dentiste à agadir"
                        : locale === "ar"
                        ? "طبيب أسنان في أكادير"
                        : "Dentist doctor in agadir"}
                    </Link>
                  </li>
                  <li>
                    <Link className="list-item" href="#">
                      {locale === "fr"
                        ? "Médecin dentiste à Marrakech"
                        : locale === "ar"
                        ? "طبيب أسنان في مراكش"
                        : "Dentist doctor in Marrakech"}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-4 col-sm-4 col-xs-12">
              <div className="single_footer single_footer_address">
                <h4>{t("subscribe_today")}</h4>
                <div className="signup_form">
                  <form action="#" className="subscribe">
                    <input
                      type="text"
                      className="subscribe__input"
                      placeholder={t("email_placeholder")}
                    />
                    <button type="button" className="subscribe__btn">
                      <i className="fa fa-paper-plane"></i>
                    </button>
                  </form>
                </div>
              </div>
              <div className="social_profile">
                <ul>
                  <li>
                    <Link href="#">
                      <i className="fa fa-twitter twitter"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <i className="fa fa-linkedin"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <i className="fa fa-google-plus"></i>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <i className="fa fa-facebook"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-sm-12 col-xs-12">
              <span className="copyright">
                {t("copyright")}{" "}
                <Link href="#" className="">
                  {t("terms_of_service")}
                </Link>
                .
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
