require("dotenv");
const mongoose  = require('mongoose');
const repository = require("./AppRepository");

function Service() {}


Service.prototype.createAppReview = async function(req){
    let {reviewTitle, reviewDescripption, reviewDate, reviewedUserId, reviewedUserName, reviewedUserMail, reviewedUserMobile} = req.body;

    let reviewObj = {
        _id : new mongoose.Types.ObjectId().toHexString(),
        reviewTitle : reviewTitle,
        reviewDescripption: reviewDescripption,
        reviewDate: Date(reviewDate),
        reviewedUserId: reviewedUserId,
        reviewedUserName: reviewedUserName,
        reviewedUserMail: reviewedUserMail,
        reviewedUserMobile: reviewedUserMobile,
        likes: []
    }

    return repository.createDocument(reviewObj, "AppReview");
}

Service.prototype.getAppReview = async function(){
    return repository.getAllDocuments("AppReview");
}

Service.prototype.likeAppReview = async function(req){
    let {reviewId, userId} = req.body;
    let query1 = {'_id':reviewId, 'likes':{$in:[userId]} }
    let isAlreadyLiked = await repository.checkDocExists(query1);

    if(!isAlreadyLiked){
        let query = {'_id':reviewId}
        let aggregationQuery =  [
            {
                $match: { _id: reviewId }
            },
            {
                $project: {
                    likes_count: { $size: "$likes" }
                }
            }
        ];
        let aggregationRes = await repository.getAggregation(aggregationQuery);
        let likes_count = aggregationRes[0].likes_count + 1;

        let updation = { $push: {'likes':userId}, $set:{reviewNoOfLikes : likes_count}};
        return repository.getByIDAndUpdate(query, updation, "AppReview");
    }else{
        return {'msg':"Already Liked the review"};
    }
}
 
Service.prototype.dislikeAppReview = async function(req){
    let {reviewId, userId} = req.body;
    let query1 = {'_id':reviewId, 'likes':{$in:[userId]} }
    let isAlreadyLiked = await repository.checkDocExists(query1);

    if(isAlreadyLiked){
        let aggregationQuery =  [
            {
                $match: { _id: reviewId }
            },
            {
                $project: {
                    likes_count: { $size: "$likes" }
                }
            }
        ];

        let aggregationRes = await repository.getAggregation(aggregationQuery);
        let likes_count = aggregationRes[0].likes_count - 1;
        let query = {'_id':reviewId}
        let updation = { $pull: {'likes':userId}, $set:{reviewNoOfLikes : likes_count}  };
        return repository.getByIDAndUpdate(query, updation, "AppReview");
    }else{
        return {'msg':"Not Liked "};
    }
    
}

module.exports = new Service();
