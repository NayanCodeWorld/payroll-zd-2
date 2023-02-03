"use strict"

const { Schema, model } = require('mongoose');

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const leave = Schema({

    UUID: {
        type: String,
        required: true,
    },
    LEAVE_TYPE
        : {
        type: String,
        required: true,
        trim: [true, "space not allow"],
        enum: ['full', 'half']
    },
    DATE
        : {
        type: Date,
        required: true,

    },
    REASON_FOR_LEAVE: {
        type: String,
        required: true
    },



},
    {
        timestamps: true
    },

)

// collection creation 
const SalaryModal = model('SALARY', leave, "salary");





module.exports = SalaryModal;
