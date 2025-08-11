import express from "express";

import { EVENTCONVERSIONS } from "../utils/load-event-conversions.js"
import { FLATTOBANKEDCONVERSIONS } from "../utils/load-flat-to-banked-conversions.js"

import convertEvent from "../controllers/flatBankedConverter/convert.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("You've reached the root of flat/banked converter.");
});

router.get("/convert", (req, res) => {

    const event = String(req.query.event);
    const time = Number(req.query.time);
    const gender = String(req.query.gender);
    const isDoubleString = String(req.query.isDouble);
    const doubleEvent = String(req.query.doubleEvent);
    const isUndersizeString = String(req.query.isUndersize);
    const isFlatString = String(req.query.isFlat);

    if (isNaN(time) || isDoubleString === undefined || isFlatString === undefined || isUndersizeString === undefined || event === undefined){
        return res.status(400).json({error: "Invalid or missing parameters"});
    }

    const isDouble: boolean = isDoubleString.toLowerCase().includes("true");
    const isFlat: boolean = isFlatString.toLowerCase().includes("true");
    const isUndersize: boolean = isUndersizeString.toLowerCase().includes("true");

    if (time < 0){
        return res.status(400).json({error: "Invalid time"});
    }

    if(!(gender === "men" || gender === "women")){
        return res.status(400).json({error: "Invalid or missing gender (men, women)"});
    }

    if(!(event in FLATTOBANKEDCONVERSIONS)){
        return res.status(400).json({error: "Invalid or missing event"});
    }

    if(!(doubleEvent in EVENTCONVERSIONS) && isDouble){
        return res.status(400).json({error: "Invalid or missing double event"});
    }

    const result = convertEvent(event, time, gender, isDouble, doubleEvent, isUndersize, isFlat);

    res.json(result);

});

export default router;