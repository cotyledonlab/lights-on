import { database } from "@lights-on/database";
import { afterAll, describe, expect, it } from "vitest";

describe("database health", () => {
  afterAll(async () => {
    await database.$disconnect();
  });

  it("accepts a basic PostgreSQL query", async () => {
    await expect(database.$queryRaw`SELECT 1 AS healthy`).resolves.toEqual([
      { healthy: 1 }
    ]);
  });
});
