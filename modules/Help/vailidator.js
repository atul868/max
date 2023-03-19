const joi = require('joi');
exports.createHelpVailidate = joi.object({
    title:joi.string().required(),
    description:joi.string().required()
});

exports.getHelpVailidate = joi.object({
    id:joi.string().hex().length(24)
});

exports.editHelpVailidate = joi.object({
    id:joi.string().hex().length(24),
    title:joi.string().required(),
    description:joi.string().required()
});

exports.removeHelpVailidate = joi.object({
    id:joi.string().hex().length(24)
});

