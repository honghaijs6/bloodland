const mongoose = require('mongoose');
const landConfigSchema = new mongoose.Schema({
    landPrice: { type: Number, default: 36617 },
});

landConfigSchema.set('toJSON', { virtuals: true });
module.exports =  landConfigSchema;
