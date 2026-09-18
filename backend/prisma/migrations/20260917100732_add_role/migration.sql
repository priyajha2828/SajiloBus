-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PASSENGER', 'DRIVER');

-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "driver" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'DRIVER';

-- AlterTable
ALTER TABLE "passenger" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PASSENGER';
