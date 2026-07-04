-- CreateEnum
CREATE TYPE "BusStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "SOSStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "LoginStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passenger" (
    "id" SERIAL NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passenger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver" (
    "id" SERIAL NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "license_no" TEXT NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "admin_id" INTEGER,

    CONSTRAINT "driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bus" (
    "id" SERIAL NOT NULL,
    "bus_number" TEXT NOT NULL,
    "plate_number" TEXT,
    "capacity" INTEGER,
    "status" "BusStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route" (
    "id" SERIAL NOT NULL,
    "route_name" TEXT NOT NULL,
    "start_point" TEXT NOT NULL,
    "end_point" TEXT NOT NULL,
    "distance" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bus_stop" (
    "id" SERIAL NOT NULL,
    "stop_name" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,

    CONSTRAINT "bus_stop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route_details" (
    "id" SERIAL NOT NULL,
    "route_id" INTEGER NOT NULL,
    "bus_stop_id" INTEGER NOT NULL,
    "order_index" INTEGER NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "route_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bus_assignment" (
    "id" SERIAL NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "bus_id" INTEGER NOT NULL,
    "assigned_from" TIMESTAMP(3) NOT NULL,
    "assigned_to" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bus_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip" (
    "id" SERIAL NOT NULL,
    "route_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "bus_id" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_history" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "passenger_id" INTEGER NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sos" (
    "id" SERIAL NOT NULL,
    "passenger_id" INTEGER NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "message" TEXT NOT NULL,
    "status" "SOSStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sos_contact" (
    "id" SERIAL NOT NULL,
    "passenger_id" INTEGER NOT NULL,
    "contact_name" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sos_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passenger_login_log" (
    "id" SERIAL NOT NULL,
    "passenger_id" INTEGER NOT NULL,
    "login_time" TIMESTAMP(3) NOT NULL,
    "logout_time" TIMESTAMP(3),
    "status" "LoginStatus" NOT NULL,

    CONSTRAINT "passenger_login_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_login_log" (
    "id" SERIAL NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "login_time" TIMESTAMP(3) NOT NULL,
    "logout_time" TIMESTAMP(3),
    "status" "LoginStatus" NOT NULL,

    CONSTRAINT "driver_login_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bus_schedule" (
    "id" SERIAL NOT NULL,
    "bus_id" INTEGER NOT NULL,
    "route_id" INTEGER NOT NULL,
    "departure_time" TIME(0) NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bus_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_firebase_uid_key" ON "admin"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "passenger_firebase_uid_key" ON "passenger"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "passenger_email_key" ON "passenger"("email");

-- CreateIndex
CREATE UNIQUE INDEX "driver_firebase_uid_key" ON "driver"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "driver_email_key" ON "driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "driver_license_no_key" ON "driver"("license_no");

-- CreateIndex
CREATE UNIQUE INDEX "bus_bus_number_key" ON "bus"("bus_number");

-- CreateIndex
CREATE UNIQUE INDEX "bus_plate_number_key" ON "bus"("plate_number");

-- AddForeignKey
ALTER TABLE "driver" ADD CONSTRAINT "driver_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_details" ADD CONSTRAINT "route_details_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route_details" ADD CONSTRAINT "route_details_bus_stop_id_fkey" FOREIGN KEY ("bus_stop_id") REFERENCES "bus_stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bus_assignment" ADD CONSTRAINT "bus_assignment_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bus_assignment" ADD CONSTRAINT "bus_assignment_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_history" ADD CONSTRAINT "trip_history_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "passenger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sos" ADD CONSTRAINT "sos_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "passenger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sos_contact" ADD CONSTRAINT "sos_contact_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "passenger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passenger_login_log" ADD CONSTRAINT "passenger_login_log_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "passenger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_login_log" ADD CONSTRAINT "driver_login_log_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bus_schedule" ADD CONSTRAINT "bus_schedule_bus_id_fkey" FOREIGN KEY ("bus_id") REFERENCES "bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bus_schedule" ADD CONSTRAINT "bus_schedule_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
