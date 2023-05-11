import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import logo from "../../public/images/logo.png";
import patient from "../../public/images/patient.svg";
import axios from "axios";
export default function EspacePatient() {
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
          <div className="card EspacePatient">
            <Image alt="" src={patient} className="patient" />
            <h5>Patient Spaces</h5>
            <Link
              href="/login_patient"
              type="submit"
              className="EspacePatientButton"
            >
              Access the Patient space
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
