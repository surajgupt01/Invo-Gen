-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('Free', 'Lite', 'Pro');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Downloads" INTEGER,
ADD COLUMN     "Storage" INTEGER,
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'Free',
ALTER COLUMN "subscription" DROP NOT NULL;
