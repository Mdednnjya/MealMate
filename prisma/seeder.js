import { PrismaClient, Role, DonationStatus, DonationType, RequestStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const user1 = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                phone_number: '1234567890',
                role: Role.USER,
            },
        });
        console.log('User1 created:', user1);

        const user2 = await prisma.user.create({
            data: {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                phone_number: '0987654321',
                role: Role.USER,
            },
        });
        console.log('User2 created:', user2);

        const donations = [
            {
                user_id: user1.id,
                title: 'Burger Bangor',
                notes: 'Best take before this evening.',
                location: 'Austin',
                quantity: 1,
                expiry_date: new Date('2024-07-30'),
                status: DonationStatus.AVAILABLE,
                type: DonationType.FOOD,
                image: 'public/images/donations/burger.jpg',
            },
            {
                user_id: user2.id,
                title: 'Farm-Fresh Veggie',
                notes: 'Assorted vegetables from local farmer\'s market',
                location: 'Downtown Springfield',
                quantity: 2,
                expiry_date: new Date('2024-07-25'),
                status: DonationStatus.AVAILABLE,
                type: DonationType.FOOD,
                image: 'public/images/donations/veggies.jpg',
            },
            {
                user_id: user2.id,
                title: 'Deli Sandwich Surplus',
                notes: 'Variety of turkey and ham sandwiches',
                location: 'Riverside District',
                quantity: 3,
                expiry_date: new Date('2024-07-29'),
                status: DonationStatus.AVAILABLE,
                type: DonationType.FOOD,
                image: 'public/images/donations/sandwich.jpg',
            },
            {
                user_id: user2.id,
                title: 'Tacco Original',
                notes: 'Homemade Fresh Tacco from Mexico',
                location: 'Downtown Springfield',
                quantity: 2,
                expiry_date: new Date('2024-07-25'),
                status: DonationStatus.AVAILABLE,
                type: DonationType.FOOD,
                image: 'public/images/donations/beef-taco.jpeg',
            },
            {
                user_id: user2.id,
                title: 'Coca Cola',
                notes: '600 ml fresh',
                location: 'Denpasar Utara',
                quantity: 2,
                expiry_date: new Date('2024-07-25'),
                status: DonationStatus.AVAILABLE,
                type: DonationType.DRINK,
                image: 'public/images/donations/coca-cola.jpeg',
            },
            {
                user_id: user2.id,
                title: 'Ayam Betutu',
                notes: '2 Potong ayam Betutu + sayur',
                location: 'Seminyak',
                quantity: 2,
                expiry_date: new Date('2024-07-23'),
                status: DonationStatus.AVAILABLE,
                type: DonationType.FOOD,
                image: 'public/images/donations/ayam-betutu.jpg',
            },
            {
                user_id: user1.id,
                title: 'Excess Bread',
                notes: 'Freshly baked, surplus from bakery',
                location: 'Baker Street',
                quantity: 5,
                expiry_date: new Date('2024-07-28'),
                status: DonationStatus.AVAILABLE,
                type: DonationType.FOOD,
                image: 'public/images/donations/excess-bread.jpeg',
            },
        ];

        for (const donationData of donations) {
            const donation = await prisma.donation.create({ data: donationData });
            console.log('Donation created:', donation);
        }

        const excessBreadDonation = await prisma.donation.findFirst({ where: { title: 'Excess Bread' } });

        if (excessBreadDonation) {
            const request = await prisma.request.create({
                data: {
                    user_id: user2.id,
                    donation_id: excessBreadDonation.id,
                    status: RequestStatus.PENDING,
                },
            });
            console.log('Request created:', request);
        } else {
            console.error('Donation with title "Excess Bread" not found.');
        }
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .then(() => {
        console.log('Seeding completed');
    })
    .catch((error) => {
        console.error('Seeding failed:', error);
    });
