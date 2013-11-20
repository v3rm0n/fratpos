/*jslint node: true*/
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema(
    {
        content: {type: String, required: true},
        time: {type: Date, required: true}
    },
    {
        toJSON: {virtuals: true}
    }
);

FeedbackSchema.virtual('formattedTime').get(function () {
    var time = this.time,
        hours = time.getHours() > 9 ? time.getHours() : '0' + time.getHours(),
        minutes = time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes(),
        date = time.getDate() > 9 ? time.getDate() : '0' + time.getDate(),
        month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1);
    return hours + ':' + minutes + ' ' + date + '.' + month + '.' + time.getFullYear();
});

mongoose.model('Feedback', FeedbackSchema);