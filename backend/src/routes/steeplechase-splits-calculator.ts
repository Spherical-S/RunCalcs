import express from "express";

import steepleSplitsByPace from "../controllers/steeplechaseSplitsCalculation/bypace.js";
import steepleSplitsByTime from "../controllers/steeplechaseSplitsCalculation/bytime.js";
import steepleSplitsBy400m from "../controllers/steeplechaseSplitsCalculation/by400m.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("You've reached the root of steeplechase splits calculation");
});

const validPitTypes = ["inside", "outside"];

router.get("/bypace", (req, res) => {

    const pace = Number(req.query.pace);
    const paceUnit = Number(req.query.paceUnit);
    const pitType = String(req.query.pitType);

    if (isNaN(pace) || isNaN(paceUnit)){
        return res.status(400).json({error: "Invalid or missing parameters"});
    }

    if(pace <= 0 || paceUnit < 0 || paceUnit > 3){
        return res.status(400).json({error: "Invalid parameters"});
    }

    if(!validPitTypes.includes(pitType)){
        return res.status(400).json({error: "Invalid pit type (inside or outside)"});
    }

    const result = steepleSplitsByPace(pace, paceUnit, pitType);

    res.json(result);

});

router.get("/bytime", (req, res) => {

    const time = Number(req.query.time);
    const distance = Number(req.query.distance);
    const distUnit = Number(req.query.distUnit);
    const pitType = String(req.query.pitType);

    if (isNaN(time) || isNaN(distance) || isNaN(distUnit)){
        return res.status(400).json({error: "Invalid or missing parameters"});
    }

    if(time <= 0 || distUnit < 0 || distUnit > 3 || distance <= 0){
        return res.status(400).json({error: "Invalid parameters"});
    }

    if(!validPitTypes.includes(pitType)){
        return res.status(400).json({error: "Invalid pit type (inside or outside)"});
    }

    const result = steepleSplitsByTime(time, distance, distUnit, pitType);

    res.json(result);

});

router.get("/by400m", (req, res) => {

    const time = Number(req.query.time);
    const pitType = String(req.query.pitType);

    if (isNaN(time)){
        return res.status(400).json({error: "Invalid or missing parameters"});
    }

    if(time <= 0){
        return res.status(400).json({error: "Invalid parameters"});
    }

    if(!validPitTypes.includes(pitType)){
        return res.status(400).json({error: "Invalid pit type (inside or outside)"});
    }

    const result = steepleSplitsBy400m(time, pitType);

    res.json(result);

});

export default router;