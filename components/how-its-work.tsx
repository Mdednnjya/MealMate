import {uberMoveText} from "@/components/fonts";
export default function HowItWorks() {
    const steps = [
        {
            number: "1",
            title: "Upload your donation",
            description: "Snap a photo of your surplus food and add quick details like type, quantity, and expiry date."
        },
        {
            number: "2",
            title: "Provide Location Information",
            description: "Enter your pickup address to help recipients find your donation easily."
        },
        {
            number: "3",
            title: "Connect and Confirm",
            description: "Get notified when someone requests your donation, chat to arrange details, and complete the handover."
        }
    ];

    return (
        <section className="py-12 sm:py-16 lg:py-20">
            <h2 className={`text-2xl sm:text-3xl ${uberMoveText.className} font-bold text-center mb-8 sm:mb-10`}>How MealMate works</h2>
            <div className="max-w-4xl mx-auto p-10 shadow-md">
                {steps.map((step, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start mb-8 rounded-xl p-6">
                        <div className="mb-4 sm:mb-0 sm:mr-6">
                            <span className="font-poppins text-3xl sm:text-4xl font-bold">{step.number}</span>
                        </div>
                        <div>
                            <h3 className="font-poppins text-lg sm:text-xl font-bold mb-2">{step.title}</h3>
                            <p className="font-poppins">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}