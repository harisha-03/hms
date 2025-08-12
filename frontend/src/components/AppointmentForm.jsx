import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
    appointment_date: "",
    department: "",
    doctorId: "",
    address: "",
  });

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/doctors`);
        setDoctors(data.doctors);

        // Extract unique departments
        const uniqueDepartments = [
          ...new Set(data.doctors.map((doc) => doc.doctorDepartment)),
        ];
        setDepartments(uniqueDepartments);
      } catch (error) {
        toast.error("Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  // Filter doctors based on department
  useEffect(() => {
    if (formData.department) {
      const filtered = doctors.filter(
        (doc) => doc.doctorDepartment === formData.department
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]);
    }
  }, [formData.department, doctors]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Reset doctor when department changes
    if (e.target.name === "department") {
      setFormData((prev) => ({ ...prev, doctorId: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post(
        `/appointment/post`, // ✅ correct backend route
        formData
      );
      toast.success(data.message);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nic: "",
        dob: "",
        gender: "",
        appointment_date: "",
        department: "",
        doctorId: "",
        address: "",
      });
      setFilteredDoctors([]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Booking failed";
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="container form-component">
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <input type="text" name="nic" placeholder="NIC" value={formData.nic} onChange={handleChange} />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type="date" name="appointment_date" value={formData.appointment_date} onChange={handleChange} />

        {/* Department Dropdown */}
        <select name="department" value={formData.department} onChange={handleChange}>
          <option value="">Select Department</option>
          {departments.map((dept, idx) => (
            <option key={idx} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Doctor Dropdown */}
        <select name="doctorId" value={formData.doctorId} onChange={handleChange} disabled={!formData.department}>
          <option value="">Select Doctor</option>
          {filteredDoctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.firstName} {doc.lastName} ({doc.doctorDepartment})
            </option>
          ))}
        </select>

        <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange}></textarea>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
