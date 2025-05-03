import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import logo from "../../public/images/logo.png";
import Medicine from "../../public/images/Doctor-amico.png";
import { useTranslation } from "next-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function EspacePatient() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;
  return (
    <div
      className="container-fluid px-0"
      style={{ overflow: "auto", direction: locale === "ar" ? "rtl" : "ltr" }}
    >
      <section className="header-page">
        <div className="container">
          <div className="row justify-content-between py-3 align-items-center">
            <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
              <Link href="/">
                <Image alt="Logo" src={logo} width="100" />
              </Link>
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
                    <i className="fa fa-user-md"></i> {t("professional_space")}
                  </Link>
                </div>
                <div className="col-6 col-md-4 col-lg-5 d-flex justify-content-center">
                  <Link className="btn_Espace_Patients" href="/patient_space">
                    <i className="fa fa-user"></i> {t("patient_space")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="card EspaceMedicine p-3 my-4 text-center">
            <div className="d-flex justify-content-center mb-3">
              <Image
                alt="Medicine"
                src={Medicine}
                className="img-fluid"
                style={{ maxWidth: "30%", height: "auto" }}
              />
            </div>
            <h5 className="fw-bold fs-4"></h5>
            <div className="EspaceProfessionnel mb-3"></div>
            <div className="d-flex flex-md-row justify-content-center align-items-center gap-3">
              <Link
                href="/login_patient"
                type="submit"
                className="EspaceProfessionnelButton1 text-white text-decoration-none px-4 py-1"
              >
                {t("access_professional_patient")}
              </Link>
            </div>
          </div>
        </div>
      </section>
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
