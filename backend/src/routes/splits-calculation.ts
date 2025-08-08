import express from "express";

import getSplitsByTime from "../controllers/splitsCalculation/byTime.js"
import getSplitsByPace from "../controllers/splitsCalculation/byPace.js"

const router = express.Router();

router.get("/", (req, res) => {
    res.send("You've reached the root of splits calculation");
});

router.get("/bytime", (req, res) => {

    const distance = Number(req.query.distance);
    const distUnit = Number(req.query.distUnit);
    const time = Number(req.query.time);
    const splitLen = Number(req.query.splitLen);
    const splitUnit = Number(req.query.splitUnit);

    if (isNaN(distance) || isNaN(distUnit) || isNaN(time) || isNaN(splitLen) || isNaN(splitUnit)){
        return res.status(400).json({error: "Invalid or missing parameters"});
    }

    if(time <= 0 || distUnit < 0 || distUnit > 3 || splitUnit < 0 || splitUnit > 3 || distance <= 0){
        return res.status(400).json({error: "Invalid parameters"});
    }

    const result = getSplitsByTime(distance, distUnit, time, splitLen, splitUnit);

    res.json(result);

});

router.get("/bypace", (req, res) => {

    const distance = Number(req.query.distance);
    const distUnit = Number(req.query.distUnit);
    const pace = Number(req.query.pace);
    const paceUnit = Number(req.query.paceUnit);
    const splitLen = Number(req.query.splitLen);
    const splitUnit = Number(req.query.splitUnit);

    if (isNaN(distance) || isNaN(distUnit) || isNaN(pace) || isNaN(paceUnit) || isNaN(splitLen) || isNaN(splitUnit)){
        return res.status(400).json({error: "Invalid or missing parameters"});
    }

    if(pace <= 0 || distUnit < 0 || distUnit > 3 || splitUnit < 0 || splitUnit > 3 || distance <= 0 || paceUnit < 0 || paceUnit > 3){
        return res.status(400).json({error: "Invalid parameters"});
    }

    const result = getSplitsByPace(distance, distUnit, pace, paceUnit, splitLen, splitUnit);

    res.json(result);

});

export default router;