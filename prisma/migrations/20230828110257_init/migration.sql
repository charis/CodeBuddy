-- CreateTable
CREATE TABLE "User" (
    "_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "forgotPasswordToken" TEXT,
    "forgotPasswordTokenExpiry" TIMESTAMP(3),
    "verifyToken" TEXT,
    "verifyTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "_id" SERIAL NOT NULL,
    "problem_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "videoId" TEXT,
    "link" TEXT,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "AttemptedProblem" (
    "_id" SERIAL NOT NULL,
    "pid" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL DEFAULT false,
    "uid" INTEGER NOT NULL,

    CONSTRAINT "AttemptedProblem_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_problem_id_key" ON "Problem"("problem_id");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_order_key" ON "Problem"("order");

-- AddForeignKey
ALTER TABLE "AttemptedProblem" ADD CONSTRAINT "AttemptedProblem_pid_fkey" FOREIGN KEY ("pid") REFERENCES "Problem"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptedProblem" ADD CONSTRAINT "AttemptedProblem_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
