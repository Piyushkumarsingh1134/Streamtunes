-- CreateTable
CREATE TABLE "Currentstream" (
    "userId" TEXT NOT NULL,
    "streamId" TEXT,

    CONSTRAINT "Currentstream_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Currentstream_streamId_key" ON "Currentstream"("streamId");

-- AddForeignKey
ALTER TABLE "Currentstream" ADD CONSTRAINT "Currentstream_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;
