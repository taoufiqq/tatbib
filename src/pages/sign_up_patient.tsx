import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import logo from "../../public/images/logo.png";
export default function SignUpPatient() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  //---------add admin-------------

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const Patient = {
      firstName,
      lastName,
      age,
      telephone,
      email,
      password,
      login,
    };

    axios
      .post(`https://tatbib-api.onrender.com/patient/authentication`, Patient)

      .then((res) => {
        if (!res.data) {
          return false;
        } else {
          console.log(res.data);
          router.push("/login_patient");
        }
      });
  };
  return (
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
          <div className="row ">
            <div>
              <form
                className="row"
                method="#"
                action="#"
                onSubmit={handleSubmit}
              >
                <label className="form-label" style={{ marginTop: "1%" }}>
                  Sign Up
                </label>
                <div className="fromloginSignUp" style={{ marginTop: "3%" }}>
                  <div className="row ">
                    <div className="col-md-6">
                      <input
                        type="text"
                        placeholder="FirstName"
                        className="form-control"
                        id="FirstName"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        placeholder="LastName"
                        className="form-control"
                        id="LastName"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-md-6">
                      <input
                        type="text"
                        placeholder="Age"
                        className="form-control"
                        id="age"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        placeholder="Télephone"
                        className="form-control"
                        id="tel"
                        required
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-md-6">
                      <input
                        type="text"
                        placeholder="Email"
                        className="form-control"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="password"
                        placeholder="Password"
                        className="form-control "
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="login"
                    placeholder="login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="submit"
                    className="form-control mt-5 btnConnect"
                    id="signup"
                    value="confirm"
                  />
                  <Link
                    href="/login_patient"
                    style={{ textDecoration: "none" }}
                  >
                    <input
                      type="submit"
                      className="form-control mt-3 btnAuth"
                      value="I already have an account"
                    />
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
