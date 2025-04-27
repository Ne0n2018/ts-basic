-- CreateTable
CREATE TABLE "Admin" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Token" (
    "Id" TEXT NOT NULL,
    "Token" TEXT NOT NULL,
    "AdminId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_Token_key" ON "Token"("Token");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_AdminId_fkey" FOREIGN KEY ("AdminId") REFERENCES "Admin"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
