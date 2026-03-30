-- AddForeignKey
ALTER TABLE "Currentstream" ADD CONSTRAINT "Currentstream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
