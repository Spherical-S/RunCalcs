import express from "express";

import { EVENTCONVERSIONS } from "../utils/load-event-conversions.js"

import convertEvent from "../controllers/timeConverter/convert.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("You've reached the root of track time converter.");
});

router.get("/convert", (req, res) => {

    const event = String(req.query.event);
    const time = Number(req.query.time);
    const gender = String(req.query.gender);

    if (isNaN(time) || event === undefined || gender === undefined){
        return res.status(400).json({error: "Invalid or missing time"});
    }

    if (time < 0){
        return res.status(400).json({error: "Invalid time"});
    }

    if(!(gender === "men" || gender === "women")){
        return res.status(400).json({error: "Invalid or missing gender (men, women)"});
    }

    if(!(event in EVENTCONVERSIONS)){
        return res.status(400).json({error: "Invalid or missing event"});
    }

    if((event === "100mH" && gender === "men") || (event === "110mH" && gender === "women")){
        return res.status(400).json({error: "Invalid event for this gender"});
    }

    const result = convertEvent(event, time, gender);

    res.json(result);

});

export default router;