import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import pingRoute from "./routes/ping.js";
import paceCalcRoute from "./routes/pace-calculation.js";
import unitConversionRoute from "./routes/unit-conversion.js";
import WAPointsCalculationRoute from "./routes/wa-points-calculation.js";
import splitsCalculatorRoute from "./routes/splits-calculation.js";
import steepleSplitsCalculatorRoute from "./routes/steeplechase-splits-calculator.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.json({ limit: '1MB' }));
app.use(express.urlencoded({ extended: true, limit: '1MB' }));

app.use((req, res, next) => {
  res.setTimeout(10_000, () => {
    if (!res.headersSent) {
      res.status(503).json({ error: 'Request timed out' });
    }
  });
  next();
});

app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
}));

app.use("/api/ping", pingRoute);
app.use("/api/pacecalc", paceCalcRoute);
app.use("/api/unitconversion", unitConversionRoute);
app.use("/api/wapointscalc", WAPointsCalculationRoute);
app.use("/api/splitscalc", splitsCalculatorRoute);
app.use("/api/steeplesplitscalc", steepleSplitsCalculatorRoute);

app.listen(3001, () => {
    console.log("API running on http://localhost:3001");
});