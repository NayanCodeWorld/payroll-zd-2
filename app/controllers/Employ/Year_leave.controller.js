"use strict";
const express = require("express");

const yearModal = require("../../models/Employ/Year_Leave.modal");

class year_Leave {
  async year_leave(req, res) {
    var year = req.body.year;
    var leave = req.body.leave;

    const yearFind = await yearModal.findOne({ year: year });
    if (yearFind) {
      return res.send({ message: " Year Already Exists." });
    }

    if (!year || !leave) {
      res.send({ message: "please fill out this field" });
    } else {
      const yearLeave = new yearModal({
        year,
        leave,
      });
      await yearLeave.save();
      //console.log({ yearLeave });
      res.send({ message: "Success " });
    }
  }

  async get_year_leave(req, res, next) {
    try {
      yearModal
        .find({})
        .then(function (leave) {
          res.send(leave);
        })
        .catch(next);
    } catch (err) {
      res.send({ error: err });
    }
  }

  async delete_year_leave(req, res) {
    const { id } = req.params;
    try {
      yearModal
        .findByIdAndDelete(id)
        .then(function (leave) {
          res.status(200).send({ message: "Leave is Deleted." });
        })
        .catch((error) => console.log(error));
    } catch (err) {
      res.status(400).send({ error: err });
    }
  }
}
module.exports = new year_Leave();
