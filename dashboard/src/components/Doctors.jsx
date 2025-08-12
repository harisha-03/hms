import axiosInstance from "../config/axiosConfig";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axiosInstance.get("/user/doctors", {
          withCredentials: true,
        });
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch doctors");
      }
    };
    fetchDoctors();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page doctors">
      <h1>DOCTORS</h1>
      <div className="banner">
        {doctors && doctors.length > 0 ? (
          doctors.map((element) => (
            <div className="card" key={element._id}>
              <img
                src={element.docAvatar?.url || "/default-avatar.png"}
                alt="doctor avatar"
              />
              <h4>{`${element.firstName || ""} ${element.lastName || ""}`}</h4>
              <div className="details">
                <p>
                  Email: <span>{element.email || "N/A"}</span>
                </p>
                <p>
                  Phone: <span>{element.phone || "N/A"}</span>
                </p>
                <p>
                  DOB: <span>{element.dob ? element.dob.substring(0, 10) : "N/A"}</span>
                </p>
                <p>
                  Department: <span>{element.doctorDepartment || "N/A"}</span>
                </p>
                <p>
                  NIC: <span>{element.nic || "N/A"}</span>
                </p>
                <p>
                  Gender: <span>{element.gender || "N/A"}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <h1>No Registered Doctors Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Doctors;
