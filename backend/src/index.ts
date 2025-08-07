import express from "express";
import cors from "cors";

import pingRoute from "./routes/ping.js";
import paceCalcRoute from "./routes/pace-calculation.js";
import unitConversionRoute from "./routes/unit-conversion.js";
import WAPointsCalculationRoute from "./routes/wa-points-calculation.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/ping", pingRoute);
app.use("/api/pacecalc", paceCalcRoute);
app.use("/api/unitconversion", unitConversionRoute);
app.use("/api/wapointscalc", WAPointsCalculationRoute);

app.listen(3001, () => {
    console.log("API running on http://localhost:3001");
});