const joi = require('joi');
exports.createnotificationVailidate = joi.object({
    title:joi.string().required(),
    body:joi.string().required(),
    topic:joi.string().required(),
    image:joi.string().required()
});

exports.getnotificationVailidate = joi.object({
    id:joi.string().hex().length(24)
});

exports.editnotificationVailidate = joi.object({
    id:joi.string().hex().length(24),
    title:joi.string().optional(),
    body:joi.string().optional(),
    topic:joi.string().optional(),
    image:joi.string().optional()
});

exports.removenotificationVailidate = joi.object({
    id:joi.string().hex().length(24)
});
