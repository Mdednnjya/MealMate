import DonationForm from '@/components/donations/donation-form';

export default function CreateDonationPage() {
    return (
        <main className="bg-white py-8 px-6 sm:px-12 md:px-20 lg:px-24">
            <h1 className="text-2xl font-bold mb-6">Create New Donation</h1>
            <DonationForm />
        </main>
    );
}