import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManagementCompteSecretary() {
  const router = useRouter();

  const [status, setStatus] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
 

  useEffect(() => {

    const id_Secretary = localStorage.getItem("idSecretary") || "";
    axios
      .get(
        `https://tatbib-api.onrender.com/medcine/getSecretaryById/${id_Secretary}`
      )
      .then(function (response) {
        setStatus(response.data.status);
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const id_Secretary = localStorage.getItem("idSecretary") || "";
    const data = { status: updatedStatus };

    axios
      .put(
        `https://tatbib-api.onrender.com/medcine/activateCompteSecretary/${id_Secretary}`,
        data
      )
      .then((res) => {
        if (!res.data.message) {
          router.push("/account_secretary");
          //   toastr.success('Operation accomplished successfully')
        } else {
          console.log(res.data);
          return false;
        }
      });
  };

  return (
    <div className="Containerr" style={{ overflow: "hidden" }}>
      <main>
        <div className="table">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-5">
                  <h2>
                    Secretary <b>Management Compte</b>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-6 px-5 py-4 ConfirmForm">
          <h2 className="h2">Activate Account Secretary</h2>
          <form onSubmit={handleSubmit}>
            <div className="col-12">
              <div className="input-icons mb-4">
                <select
                  className="select p-3"
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                >
                  <option selected>Choose a status</option>
                  <option value="InActive">InActive</option>
                  <option value="Active">Active</option>
                  <option value="Block">Block</option>
                </select>
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="button1 py-3">
                Confirm
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
