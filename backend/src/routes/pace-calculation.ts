import express from "express";

import calculatePace from "../controllers/paceCalculation/pace.js";
import calculateDistance from "../controllers/paceCalculation/distance.js";
import calculateTime from "../controllers/paceCalculation/time.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("You've reached the root of pace calculation");
});

router.get("/distance", (req, res) => {

    const time = Number(req.query.time);
    const pace = Number(req.query.pace);
    const unit = Number(req.query.unit);

    if(isNaN(time) || isNaN(pace) || isNaN(unit)){
        return res.status(400).json({error: "Invalid or missing parameters"});
    }

    if (unit > 3 || unit < 0 || time < 0 || pace <= 0){
        return res.status(400).json({error: "Invalid parameters"});
    }

    const result = calculateDistance(time, pace, unit);

    res.json(result);

});

router.get("/pace", (req, res) => {

    const time = Number(req.query.time);
    const distance = Number(req.query.distance);
    const unit = Number(req.query.unit);

    if(isNaN(time) || isNaN(distance) || isNaN(unit)){
        return res.status(400).json({error: "Invalid or missing parameters"});
    }

    if (unit > 3 || unit < 0 || time < 0 || distance <= 0){
        return res.status(400).json({error: "Invalid parameters"});
    }

    const result = calculatePace(time, distance, unit);

    res.json(result);

});

router.get("/time", (req, res) => {

    const pace = Number(req.query.pace);
    const distance = Number(req.query.distance);
    const paceUnit = Number(req.query.paceUnit);
    const distUnit = Number(req.query.distUnit);

    if(isNaN(pace) || isNaN(distance) || isNaN(paceUnit) || isNaN(distUnit)){
        return res.status(400).json({error: "Invalid or missing parameters"});
    }

    if (paceUnit > 3 || paceUnit < 0 || distUnit > 3 || distUnit < 0 || pace < 0 || distance < 0){
        return res.status(400).json({error: "Invalid parameters"});
    }

    const result = calculateTime(pace, distance, paceUnit, distUnit);

    res.json(result);

});

export default router;