import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import { CustomError } from "../errors/errorHandler";
import { constructPrismaWhereSql } from "../helpers/constructPrismaWhereSql";

interface GetQueryString {
  hakusana: string;
  kohde: string;
  vuosi?: string;
}

interface Result {
  stamps: [];
  message?: string;
}

const prisma: PrismaClient = new PrismaClient();
const apiPostimerkitRouter: express.Router = express.Router();
apiPostimerkitRouter.use(express.json());

apiPostimerkitRouter.get(
  "/",
  async (
    req: express.Request<{}, {}, {}, GetQueryString>,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const queryString = req.query.hakusana?.trim().toLowerCase() || "";
      const queryTarget = req.query.kohde?.trim().toLowerCase() || "asiasanat";
      const [startYear, endYear] =
        req.query.vuosi
          ?.trim()
          .split("-")
          .map((year) => Number(year)) || [];

      if (queryString.trim().length < 2) {
        return next(
          new CustomError(
            403,
            "Hakusanan on oltava vähintään kaksi merkkiä pitkä"
          )
        );
      }

      const filterByYears: boolean = Boolean(startYear && endYear);

      const filter = constructPrismaWhereSql(queryString, queryTarget);

      if (!filter) {
        return next(new CustomError(403, "Virheellinen kohde"));
      }

      // Hakusana on merkkijonossa ensimmäisenä -> ensin ei mitään, täytyy loppua välilyöntiin tai pilkkuun
      // Hakusana on keskellä -> molemmilla puolilla välilyönnit, lopussa ehkä pilkku
      // Hakusana on viimeisenä -> ensin välilyönti, jälkeen ei tule mitään
      const postimerkit: [] = await prisma.$queryRaw`
      SELECT * FROM postimerkki
      WHERE ${filter}
      ${
        filterByYears
          ? Prisma.sql`AND YEAR(STR_TO_DATE(ilmestymispaiva,'%d.%m.%Y')) BETWEEN ${startYear} AND ${endYear}`
          : Prisma.empty
      }
      LIMIT 41`;

      if (!postimerkit.length)
        return next(
          new CustomError(
            404,
            `Hakusanalla ${queryString} ei löytynyt yhtään postimerkkiä`
          )
        );

      let result: Result = {
        stamps: postimerkit,
      };

      if (postimerkit.length > 40) {
        postimerkit.pop();

        result = {
          ...result,
          message:
            "Haulla löytyi yli 40 postimerkkiä, näytetään vain ensimmäiset 40. Ole hyvä ja tarkenna hakua",
        };
      }

      return res.json(result);
    } catch (e: any) {
      console.log(e);
      next(new CustomError());
    }
  }
);

export default apiPostimerkitRouter;
