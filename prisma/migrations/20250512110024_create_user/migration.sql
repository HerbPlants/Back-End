-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "user"."users" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) DEFAULT public.uuid_generate_v4(),
    "username" VARCHAR(255),
    "nm_lengkap" VARCHAR(255),
    "password" VARCHAR(255),
    "email" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_users_cuid" ON "user"."users"("uuid");
