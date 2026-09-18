-- CreateEnum
CREATE TYPE "StopEventType" AS ENUM ('REACHED', 'SKIPPED');

-- AlterTable
ALTER TABLE "trip" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "trip_stop_event" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "bus_stop_id" INTEGER NOT NULL,
    "event_type" "StopEventType" NOT NULL,
    "event_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boarding_count" INTEGER NOT NULL DEFAULT 0,
    "alighting_count" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,

    CONSTRAINT "trip_stop_event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trip_stop_event" ADD CONSTRAINT "trip_stop_event_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stop_event" ADD CONSTRAINT "trip_stop_event_bus_stop_id_fkey" FOREIGN KEY ("bus_stop_id") REFERENCES "bus_stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
