const express = require('express');
const router = express.Router();
const ServiceManager = require('../../service/ServiceManager');

router.use(express.json());

router.post('/bookAppointment', ServiceManager.appointment.bookAppointment);

router.get('/listAppointments', ServiceManager.appointment.listAppointments);

//get appointmnet Id using userId
router.get('/list', ServiceManager.appointment.getAppointmentDeatils);

router.get("/getPatient/:doctorId", ServiceManager.appointment.getPatients);

//cancel appointmnet using appointmentId
router.patch('/cancel', ServiceManager.appointment.cancelAppointment);

//reschedule appointmnet using appointmentId
router.patch('/reschedule', ServiceManager.appointment.rescheduleAppointment);


module.exports = router;
