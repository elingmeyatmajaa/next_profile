/*
  Warnings:

  - Made the column `name` on table `Permission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Permission` MODIFY `name` VARCHAR(191) NOT NULL;
