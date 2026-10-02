const Result = require('../models/results');

exports.fetchEmail = (req, res) => {
    console.log(req.body);
    Result.findOne({ rollNo: req.body.rollNo }).exec()
        .then(success => {
            if (success) {
                res.send({
                    status: false,
                    message: "TEST ALREADY SUBMITTED"
                });
            } else {
                res.send({
                    status: true,
                    message: 'Good to gooo!!'
                });
            }
        })
        .catch(err => {
            res.send({
                status: true,
                message: 'Good to gooo!!',
                err: err
            });
        });
};

exports.createResult = (req, res) => {
    console.log(req.body);
    Result.findOne({ rollNo: req.body.rollNo }).exec()
        .then(success => {
            if (!success) {
                let newResults = new Result(req.body);
                newResults.save()
                    .then(success => {
                        res.send({ success: true });
                    })
                    .catch(err => {
                        res.status(400).json({
                            error: err
                        });
                    });
            } else {
                res.send({
                    message: "Already Submitted"
                });
            }
        })
        .catch(err => {
            res.status(400).json({
                error: err
            });
        });
};

exports.getAllResults = (req, res) => {
    Result.find().exec()
        .then(success => {
            res.send(success);
        })
        .catch(err => {
            res.send({
                message: 'No Results Found',
                status: false
            });
        });
};
