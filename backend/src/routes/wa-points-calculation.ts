import express from "express";

import type { WAData } from "../types/wadata.types.js";

import ptsToPerf from "../controllers/WAPointsCalculation/pts-to-perf.js";
import perfToPts from "../controllers/WAPointsCalculation/perf-to-pts.js";

import { WATABLES } from "../utils/load-wa-tables.js";

const router = express.Router();

const validCategories = ["track", "field", "short", "road"];
const validGenders = ["men", "women"];

router.get("/", (req, res) => {
    res.send("You've reached the root of WA points calculation");
});

router.get("/ptstoperf", (req, res) => {

    const category = String(req.query.category);
    const gender = String(req.query.gender);
    const event = String(req.query.event);
    const target = Number(req.query.target);

    if (isNaN(target)){
        return res.status(400).json({error: "Invalid or missing target"});
    }

    if (target < 1 || target > 1400){
        return res.status(400).json({error: "Target out of bounds (1-1400 inclusive)"});
    }

    if(!validCategories.includes(category)){
        return res.status(400).json({error: "Invalid or missing category (track, field, road, short)"});
    }

    if(!validGenders.includes(gender)){
        return res.status(400).json({error: "Invalid or missing gender (men, women)"});
    }

    const events = WATABLES[category as keyof WAData][gender as "men" | "women"];
    if(!(event in events)){
        return res.status(400).json({error: "Invalid or missing event"});
    }

    const result = ptsToPerf(category, gender, event, target);

    res.json(result);

});

router.get("/perftopts", (req, res) => {

    const category = String(req.query.category);
    const gender = String(req.query.gender);
    const event = String(req.query.event);
    const target = Number(req.query.target);

    if (isNaN(target)){
        return res.status(400).json({error: "Invalid or missing target"});
    }

    if (target < 0){
        return res.status(400).json({error: "Target out of bounds. Must be >= 0"});
    }

    if(!validCategories.includes(category)){
        return res.status(400).json({error: "Invalid or missing category (track, field, road, short)"});
    }

    if(!validGenders.includes(gender)){
        return res.status(400).json({error: "Invalid or missing gender (men, women)"});
    }

    const events = WATABLES[category as keyof WAData][gender as "men" | "women"];
    if(!(event in events)){
        return res.status(400).json({error: "Invalid or missing event"});
    }

    const result = perfToPts(category, gender, event, target);

    res.json(result);

});

export default router;