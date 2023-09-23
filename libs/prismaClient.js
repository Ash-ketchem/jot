import { PrismaClient } from "@prisma/client";

let client;

if (process.env.NODE_ENV === "production") {
  client = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  client = global.prisma;
}

export default client;
