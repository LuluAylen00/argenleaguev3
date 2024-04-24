const model = require('../models/index');
const fs = require("fs");
const path = require("path");

const controller = {
    home: (req,res) => {
        return res.sendFile(path.resolve(__dirname, "../views/index.html"));
    },
    apiList: async (req,res) => {
        return res.send({
            data: await model.listData(),
            status: 200
        })
    },
    apiCreate: async function (req, res) {
        await model.create()
        return res.send({
            status: 200
        })
    },
    apiInsertPlayers: async function (req, res) {
        await model.insertPlayers(req.body)
        return res.send({
            status: 200
        })
    },
    apiUpdatePlayerInfo: async function (req, res) {
        await model.updatePlayer(req.body)
        return res.send({
            status: 200
        })
    },
    apiUpdateMatchInfo: async function(req, res) {
        await model.setMatchInfo(req.body);
        return res.send({
            status: 200
        })
    },
    apiSetWinner: async function (req, res) {
        await model.setMatchWinner({matchId: req.body.matchId, winner: req.body.winner});
        return res.send({
            status: 200
        })
    },
}

module.exports = controller;