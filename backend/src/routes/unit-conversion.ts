import express from "express";

import convertPace from "../controllers/unitConversion/pace.js";
import convertDistance from "../controllers/unitConversion/distance.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("You've reached the root of unit conversion");
});

router.get("/pace", (req, res) => {

    const pace = Number(req.query.pace);
    const unit = Number(req.query.unit);

    if (isNaN(pace) || isNaN(unit)){
        return res.status(400).json({error: "Invalid or missing parameters"});
    }

    if(pace < 0 || unit < 0 || unit > 3){
        return res.status(400).json({error: "Invalid parameters"});
    }

    const result = convertPace(pace, unit);

    res.json(result);

});

router.get("/distance", (req, res) => {

    const distance = Number(req.query.distance);
    const unit = Number(req.query.unit);

    if (isNaN(distance) || isNaN(unit)){
        return res.status(400).json({error: "Invalid or missing parameters"});
    }

    if(distance < 0 || unit < 0 || unit > 3){
        return res.status(400).json({error: "Invalid parameters"});
    }

    const result = convertDistance(distance, unit);

    res.json(result);

});

export default router;