import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/utils/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { id, name, email, phone_number, password, role } = req.body;

        try {
            const user = await prisma.user.create({
                data: {
                    id,
                    name,
                    email,
                    phone_number,
                    password,
                    role,
                },
            });
            res.status(200).json(user);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Error creating user' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
