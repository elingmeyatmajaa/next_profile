/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Permission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[module_id,action_id]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action_id` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `module_id` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Action_name_key` ON `Action`;

-- DropIndex
DROP INDEX `Module_name_key` ON `Module`;

-- DropIndex
DROP INDEX `Permission_name_key` ON `Permission`;

-- DropIndex
DROP INDEX `Permission_slug_key` ON `Permission`;

-- AlterTable
ALTER TABLE `Permission` DROP COLUMN `createdAt`,
    DROP COLUMN `name`,
    DROP COLUMN `slug`,
    ADD COLUMN `action_id` INTEGER NOT NULL,
    ADD COLUMN `module_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Permission_module_id_action_id_key` ON `Permission`(`module_id`, `action_id`);

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `Module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `Action`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
