import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import axios from "axios"; // Import Axios
import logo from "../../public/images/logo.png";
import { Medicine } from "@/types";

export default function SearchMedicine() {
  const router = useRouter();
  const [medicine, setMedicine] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(
          "https://tatbib-api.onrender.com/medcine/getAllMedcine"
        ); // Using Axios to make the API request
        if (response.status === 200) {
          const data = response.data; // Axios automatically parses the JSON response
          if (Array.isArray(data)) {
            setMedicine(data); // Set the medicine data
          } else {
            setError("Invalid medicine data format.");
          }
        } else {
          setError("Failed to fetch medicines.");
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
        setError("Error loading medicine data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines(); // Fetch the medicines when component mounts
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            border: "4px solid rgba(0, 0, 0, 0.1)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            borderLeftColor: "#09f",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p>Loading doctor data...</p>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!medicine || medicine.length === 0) {
    return <div>No medicines found.</div>;
  }

  const listMedicines = medicine.map((item, index) => (
    <div className="blog-slider mt-5" key={item._id || index}>
      <div className="blog-slider__wrp swiper-wrapper">
        <div className="blog-slider__item swiper-slide">
          <div className="blog-slider__img">
            <Image
              src={logo}
              alt={`${item.fullName || "Doctor"} profile`}
              width={100}
              height={100}
            />
          </div>
          <div className="blog-slider__content">
            <div className="blog-slider__title">
              <h4>{item.fullName || "Unknown Doctor"}</h4>
            </div>
            <span className="blog-slider__code">
              {item.speciality || "General"}
            </span>
            <div className="blog-slider__code">
              {item.city || "Unknown location"}
            </div>
            <div
              className="blog-slider__title"
              style={{
                color: item.availability !== "NotAvailable" ? "green" : "red",
              }}
            >
              {item.availability || "Availability unknown"}
            </div>
            {item.availability === "NotAvailable" ? (
              <Link
                href="#"
                className="blog-slider__button"
                passHref
                onClick={(e) => e.preventDefault()}
              >
                TeleConsultation
              </Link>
            ) : (
              <Link
                href={{
                  pathname: "/appointment",
                  query: {
                    id: item._id,
                    login: item.login,
                  },
                }}
                className="blog-slider__button"
                passHref
              >
                Take Appointment
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="container-fluid px-0" style={{ overflow: "auto" }}>
      <section className="header-page">
        <div className="container">
          <div className="row justify-content-between py-3 align-items-center">
            <div className="col-12 col-sm-3 col-lg-4 d-flex justify-content-center justify-content-lg-start py-2 py-lg-0">
              <Link href="/" passHref>
                <Image alt="Website logo" src={logo} width={100} height={50} />
              </Link>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row align-items-center">
            {listMedicines.length > 0 ? (
              listMedicines
            ) : (
              <div>No medicines available</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
