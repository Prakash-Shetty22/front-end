import React from "react";
import { Routes, Route } from 'react-router-dom';
import FloatingActionButtonZoom from "../FloatingActionButtonZoom";
import DoctorDashboard from "../doctor/DoctorDashboard";
import PatientDashboard from "../patient/PatientDashboard";
import AdminDashboard from "../admin/AdminDashBoard";
import Availability from "../doctor/Availability";
import Appointment from "../doctor/Appointment";
import AppointmentRequests from "../admin/AppointmentRequests";
import AppointmentStatus from "../admin/AppointmentStatus";
import ViewDetails from "../admin/ViewDetails";
import PatientChat from "../messaging/PatientChat";
import ContactList from "../messaging/ContactList";

const Routing = () => {

    return (
        <Routes>
            {console.log("Inside Routing")}
            <Route exact path="/" element={<FloatingActionButtonZoom />}></Route>
            <Route exact path="/doctor" element={<DoctorDashboard />}></Route>
            <Route exact path="/patient" element={<PatientDashboard />}></Route>
            <Route exact path="/admin" element={<AdminDashboard/>}></Route>
            <Route exact path="/doctor/availabilities" element={<Availability />}></Route>
            <Route exact path="/doctor/appointments" element={<Appointment />}></Route>
            <Route exact path="/admin/requests" element={<AppointmentRequests/>}></Route>
            <Route exact path="/admin/status" element={<AppointmentStatus/>}></Route>
            <Route exact path="/admin/details" element={<ViewDetails/>}></Route>
            <Route exact path="/admin/message" element={<ContactList />}></Route>
            <Route exact path="/start-conversation" element={<PatientChat />}></Route>
        </Routes>
    )
}

export default Routing;