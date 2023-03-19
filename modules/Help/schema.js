const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const helpSchema = new Schema(
    {
        title: { type: String },
        description: { type: String },
        isActive: { type: Boolean, default: true },
       
    },
    {
        timestamps: true,
    }

);
const help = mongoose.model("help", helpSchema);

module.exports = help;