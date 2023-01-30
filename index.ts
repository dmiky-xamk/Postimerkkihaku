import express from "express";
import path from "path";
import errorHandler from "./errors/errorHandler";
import apiPostimerkitRouter from "./routes/api.postimerkit";
import dotenv from "dotenv";

dotenv.config();

const app: express.Application = express();

const port: number = Number(process.env.PORT);

app.use(express.static(path.resolve(__dirname, "public")));
app.use("/api/postimerkit", apiPostimerkitRouter);
app.use(errorHandler);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!res.headersSent) {
      res.status(404).json({ error: "Virheellinen reitti" });
    }

    next();
  }
);

app.listen(port, () => {
  console.log("Palvelin käynnistyi porttiin", port);
});
