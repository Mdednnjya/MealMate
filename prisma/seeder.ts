import { PrismaClient, DonationStatus } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Seeder User',
            email: 'seeder@example.com',
            password: 'hashedpassword', // Gunakan bcrypt untuk hash password
        },
    })

    const donations = [
        {
            user_id: user.id,
            title: "Burger Bangor",
            location: "Austin",
            expiry_date: new Date("2024-07-25"),
            notes: "Variety of turkey and ham sandwiches",
            quantity: 5,
            status: DonationStatus.Available,
        },
        {
            user_id: user.id,
            title: "Farm-Fresh Veggie",
            location: "Austin",
            expiry_date: new Date("2024-07-25"),
            notes: "Assorted fresh vegetables from local farm",
            quantity: 10,
            status: DonationStatus.Available,
        },
        {
            user_id: user.id,
            title: "Deli Sandwich Surplus",
            location: "Riverside District",
            expiry_date: new Date("2024-07-29"),
            notes: "Variety of turkey and ham sandwiches",
            quantity: 8,
            status: DonationStatus.Available,
        },
    ]

    for (const donation of donations) {
        await prisma.donation.create({
            data: donation,
        })
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })