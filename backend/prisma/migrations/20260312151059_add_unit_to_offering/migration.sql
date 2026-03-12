-- Step 1: Add unitId as nullable
ALTER TABLE "Offering" ADD COLUMN "unitId" TEXT;

-- Step 2: Backfill - assign each offering to the first unit of its venue
UPDATE "Offering" o
SET "unitId" = (
  SELECT u.id FROM "Unit" u
  WHERE u."venueId" = o."venueId"
  ORDER BY u."createdAt" ASC
  LIMIT 1
);

-- Step 3: Make unitId required
ALTER TABLE "Offering" ALTER COLUMN "unitId" SET NOT NULL;

-- Step 4: Add foreign key
ALTER TABLE "Offering" ADD CONSTRAINT "Offering_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
