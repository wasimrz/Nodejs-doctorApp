const express = require("express");
const router = express.Router();
const ServiceManager = require("../../service/ServiceManager");

router.use(express.json());


router.post("/bookAppointment", ServiceManager.policy.addPolicy);

router.get("/getAllData",ServiceManager.policy.getPolicy)


module.exports = router;
