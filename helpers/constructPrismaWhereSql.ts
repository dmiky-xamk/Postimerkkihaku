import { Prisma } from "@prisma/client";

export const constructPrismaWhereSql = (
  queryString: string,
  queryTarget: string
): Prisma.Sql | string => {
  const firstInString = `${queryString} %`;
  const firstInStringWithComma = `${queryString}, %`;
  const middleInString = `% ${queryString} %`;
  const middleInStringWithComma = `% ${queryString}, %`;
  const lastInString = `% ${queryString}`;

  // Prisma didn't accept dynamic column names so they are hard coded.
  if (queryTarget === "asiasanat") {
    return Prisma.sql`(asiasanat LIKE ${firstInString} OR asiasanat LIKE ${firstInStringWithComma} OR asiasanat LIKE ${middleInString} OR asiasanat LIKE ${middleInStringWithComma} OR asiasanat LIKE ${lastInString})`;
  }

  if (queryTarget == "merkinnimi") {
    return Prisma.sql`(merkinNimi LIKE ${firstInString} OR merkinNimi LIKE ${firstInStringWithComma} OR merkinNimi LIKE ${middleInString} OR merkinNimi LIKE ${middleInStringWithComma} OR merkinNimi LIKE ${lastInString})`;
  }

  if (queryTarget === "taiteilija") {
    return Prisma.sql`(taiteilija LIKE ${firstInString} OR taiteilija LIKE ${firstInStringWithComma} OR taiteilija LIKE ${middleInString} OR taiteilija LIKE ${middleInStringWithComma} OR taiteilija LIKE ${lastInString})`;
  }

  return "";
};
