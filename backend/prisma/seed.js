import {PrismaClient} from "../prisma/generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
export const prisma = new PrismaClient({adapter});

async function main() {

    await prisma.admin.create({
        data: {
            firebaseUid: "hiDzVHotU0Ys6JeiwMIkM8knbVp2",
            name:"Admin",
            email: "admin123@gmail.com",
            phone:"9800000000",
},
    });
}
main()
    .then(async () => {
        console.log("Admin seeded successfully");
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

