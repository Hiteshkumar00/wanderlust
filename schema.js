const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({

    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    image: Joi.string().allow("", null),
    country: Joi.string().required()
 
  }).required()
});


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rate: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  })
}).required();