import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import logo from "../../public/images/logo.png";
import Medicine from "../../public/images/doctor.png";
export default function ProfessionalSpaces() {
  return (
    <div className="container-fluid px-0" style={{ overflow: "auto" }}>
      <section className="header-page">
        <div className="container">
          <div className="row justify-content-between py-3 align-items-center">
            <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
              <Link href="/">
                <Image alt="" src={logo} width="100" />
              </Link>
            </div>

            <div className="col-12 col-sm-9 col-lg-6 col-xl-4">
              <div className="row justify-content-center">
                <div className="col-6 col-md-4 col-lg-5 col-xl-6 d-flex justify-content-end">
                  <Link
                    className="btn_Espace_Professionnels"
                    href="/professional_space"
                  >
                    <i className="fas fa-user-injured"></i> Professional Spaces
                  </Link>
                </div>
                <div className="col-6 col-md-4 col-lg-5 d-flex justify-content-center">
                  <Link className="btn_Espace_Patients" href="/patient_space">
                    <i className="fas fa-user-injured"></i> Patient Spaces
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="card EspaceMedicine">
            <Image alt="" src={Medicine} className="Medicine" />
            <h5>Professional Spaces</h5>
            <div className="EspaceProfessionnel">
              Access the Professionals spaces
            </div>
            <div className="btn">
              <Link
                href="/login_medicine"
                style={{
                  textDecoration: "none",
                  lineHeight: 2,
                  color: "white",
                }}
                type="submit"
                className="EspaceProfessionnelButton1"
              >
                Medicine
              </Link>
              <Link
                href="/login_secretary"
                style={{
                  textDecoration: "none",
                  lineHeight: 2,
                  color: "white",
                }}
                type="submit"
                className="EspaceProfessionnelButton1"
              >
                Secretary
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
