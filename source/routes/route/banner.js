const express = require("express");
const router = express.Router();
const ServiceManager = require("../../service/ServiceManager");

router.use(express.json());

router.post("/create", ServiceManager.banner.add);

router.get("/list", ServiceManager.banner.getBanners);

module.exports = router;
