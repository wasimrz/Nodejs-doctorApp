const express = require("express");
const router = express.Router();
const ServiceManager = require("../../service/ServiceManager");

router.use(express.json());

router.post("/createTerms", ServiceManager.terms.addTerms);
router.get("/getTerms",ServiceManager.terms.getTerms)
router.patch("/acceptTerms", ServiceManager.terms.acceptTerms);

module.exports = router;
