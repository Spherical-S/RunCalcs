import express from "express";

import calculateGAPByPace from "../controllers/GAPCalculator/pace.js";
import calculateGAPByTime from "../controllers/GAPCalculator/time.js";

//import convertEvent from "../controllers/flatBankedConverter/convert.js";
//CHANGE TO THE RIGHT CONTROLLER WHEN IT EXISTS^^^

const router = express.Router();

router.get("/", (req, res) => {
    res.send("You've reached the root of flat/banked converter.");
});

// bypacegrade (takes pace, pace unit, grade)
// bytimegrade (takes time, distance, distance unit, grade)
// bypaceelev (takes pace, pace unit, elevation, elevation unit) - elevation unit is just a distance unit
// bytimeelev (takes time, distance, distance unit, elevation, elevation unit)

router.get("/pace", (req, res) => {

    const pace = Number(req.query.pace);
    const paceUnit = Number(req.query.paceUnit);
    const grade = Number(req.query.grade);

    if (isNaN(pace) || isNaN(grade) || isNaN(paceUnit)) {
        return res.status(400).json({ error: "Invalid or missing parameters" });
    }

    if (paceUnit > 3 || paceUnit < 0 || grade < -45 || grade > 45 || pace < 0) {
        return res.status(400).json({ error: "Invalid parameters" });
    }

    const result = calculateGAPByPace(pace, paceUnit, grade);

    res.json(result);

});

router.get("/time", (req, res) => {

    const time = Number(req.query.time);
    const distance = Number(req.query.distance);
    const distUnit = Number(req.query.distUnit);
    const grade = Number(req.query.grade);

    if (isNaN(time) || isNaN(distance) || isNaN(distUnit) || isNaN(grade)) {
        return res.status(400).json({ error: "Invalid or missing parameters" });
    }

    if (distUnit > 3 || distUnit < 0 || grade < -45 || grade > 45 || time < 0 || distance <= 0) {
        return res.status(400).json({ error: "Invalid parameters" });
    }

    const result = calculateGAPByTime(time, distance, distUnit, grade);

    res.json(result);

});

export default router;