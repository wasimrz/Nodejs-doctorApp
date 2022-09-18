const express = require("express");
const router = express.Router();
const ServiceManager = require("../../service/ServiceManager");

router.use(express.json());

/**************  APP REVIEW ROUTES ***************/
//Add AppReview
router.post("/review/create", ServiceManager.app.addAppReview);
//List all App Review
router.get("/review/list", ServiceManager.app.getReviews);
//Like the Review
router.post("/review/like", ServiceManager.app.likeReview);
//Dislike the Review
router.post("/review/dislike", ServiceManager.app.dislikeReview);




module.exports = router;
