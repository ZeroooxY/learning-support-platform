const mongoose = require('mongoose');
const Counter = require('./Counter');

const materialSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true, // e.g., Mathematics, Physics
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    parent_id: {
        type: Number,
        default: null,
    },
    type: {
        type: String,
        enum: ['MATERIAL', 'SUBMATERIAL'],
        default: 'MATERIAL',
    },
    pdfUrl: {
        type: String,
        default: null,
    }
}, { timestamps: true });

materialSchema.pre('save', async function () {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: 'materialId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true } // Create if not exists
        );
        this.id = counter.seq;
    }
});

module.exports = mongoose.model('Material', materialSchema);
