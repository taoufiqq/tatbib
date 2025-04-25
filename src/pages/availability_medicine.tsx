import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withAuth from "@/components/withPrivateRoute";

const ManagementAvailablityMedcine = () => {
  const router = useRouter();
  const [availablity, setAvailablity] = useState("");
  const [updatedAvailablity, setUpdatedAvailablity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorAvailability = async () => {
      try {
        const id = localStorage.getItem("id_medcine");
        if (!id) {
          throw new Error("Doctor ID not found");
        }

        const response = await axios.get(
          `https://tatbib-api.onrender.com/medcine/getMedcineById/${id}`
        );
        
        if (response.data?.availablity) {
          setAvailablity(response.data.availablity);
          setUpdatedAvailablity(response.data.availablity);
        }
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        toast.error("Failed to load doctor availability");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAvailability();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const id = localStorage.getItem("id_medcine");
      if (!id) {
        throw new Error("Doctor ID not found");
      }

      if (!updatedAvailablity) {
        toast.warning("Please select an availability option");
        return;
      }

      const response = await axios.put(
        `https://tatbib-api.onrender.com/medcine/updateAvailablityMedcine/${id}`,
        { availablity: updatedAvailablity }
      );

      if (response.data) {
        toast.success("Availability updated successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        router.push("/medicine_dashboard");
      }
    } catch (err) {
      console.error("Error updating availability:", err);
      toast.error("Failed to update availability");
    }
  };

  if (typeof window === "undefined") {
    return null; // Skip during SSR
  }

  if (loading) {
    return <div className="loading">Loading doctor data...</div>;
  }

  return (
    <div className="container" style={{ overflow: "hidden" }}>
      <main>
        <div className="table">
          <div className="table-wrapper">
            <div className="table-title">
              <div className="row">
                <div className="col-sm-5">
                  <h2>
                    Doctor <b>Availability Management</b>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-6 px-5 py-4 confirm-form">
          <h2 className="form-title">Update Availability</h2>
          <form onSubmit={handleSubmit}>
            <div className="col-12">
              <div className="input-group mb-4">
                <select
                  className="form-select p-3"
                  value={updatedAvailablity}
                  onChange={(e) => setUpdatedAvailablity(e.target.value)}
                  required
                >
                  <option value="">Select your availability</option>
                  <option value="Available">Available</option>
                  <option value="NotAvailable">Not Available</option>
                </select>
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="submit-button py-3">
                Confirm
              </button>
            </div>
          </form>
        </div>
      </main>

      <ToastContainer />
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 2rem;
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.2rem;
        }
        .table-title {
          padding: 1rem 0;
          margin-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }
        .confirm-form {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin: 2rem auto;
          max-width: 600px;
        }
        .form-title {
          color: #333;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .form-select {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        .form-select:focus {
          border-color: #3b82f6;
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .submit-button {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }
        .submit-button:hover {
          background: #2563eb;
          transform: translateY(-2px);
        }
        .submit-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default withAuth(ManagementAvailablityMedcine);