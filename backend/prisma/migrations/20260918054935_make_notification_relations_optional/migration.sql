-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_passenger_id_fkey";

-- AlterTable
ALTER TABLE "notification" ALTER COLUMN "passenger_id" DROP NOT NULL,
ALTER COLUMN "admin_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "passenger"("id") ON DELETE SET NULL ON UPDATE CASCADE;
