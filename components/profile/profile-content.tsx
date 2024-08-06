// components/profile/ProfileContent.tsx
import Image from 'next/image';
import { Country, State } from 'country-state-city';
import EditProfileButton from "@/components/profile/edit-profile-button";
import LogoutButton from "@/components/profile/logout-button";

interface ProfileContentProps {
    user: any;
    profile: any;
}

export default function ProfileContent({ user, profile }: ProfileContentProps) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
            <div className="space-y-4">
                <div className="flex justify-center mb-4">
                    <Image
                        src={profile.profile_photo || '/images/default-profile.png'}
                        alt="Profile Photo"
                        width={100}
                        height={100}
                        className="rounded-full"
                    />
                </div>
                <ProfileField label="Name" value={profile.name || 'Not set'} />
                <ProfileField label="Email" value={user.email || 'Not set'} />
                <ProfileField label="Phone Number" value={profile.phone_number || 'Not set'} />
                <ProfileField
                    label="Country"
                    value={profile.country ? Country.getCountryByCode(profile.country)?.name || 'Unknown' : 'Not set'}
                    icon={profile.country && (
                        <Image
                            src={`https://flagcdn.com/w20/${profile.country.toLowerCase()}.png`}
                            width={20}
                            height={15}
                            alt={profile.country}
                            className="mr-2"
                        />
                    )}
                />
                <ProfileField
                    label="State"
                    value={profile.state && profile.country
                        ? State.getStateByCodeAndCountry(profile.state, profile.country)?.name || 'Unknown'
                        : 'Not set'}
                />
                <ProfileField label="City" value={profile.city || 'Not set'} />
                <EditProfileButton userId={user.id} />
                <LogoutButton />
            </div>
        </div>
    );
}

interface ProfileFieldProps {
    label: string;
    value: string;
    icon?: React.ReactNode;
}

function ProfileField({ label, value, icon }: ProfileFieldProps) {
    return (
        <div>
            <p className="text-sm font-bold">{label}</p>
            <p className="px-3 py-2 flex items-center">
                {icon}
                {value}
            </p>
        </div>
    );
}