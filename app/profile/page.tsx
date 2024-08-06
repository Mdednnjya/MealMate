// app/profile/page.tsx
import { getProfileData } from "@/utils/api/profile/get-profile";
import ProfileContent from "@/components/profile/profile-content";

export default async function ProfilePage() {
    const { user, profile, error } = await getProfileData();

    if (!user) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            },
        };
    }

    if (error || !profile) {
        console.error('Error fetching profile:', error);
        return <div>Error loading profile</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <ProfileContent user={user} profile={profile} />
        </div>
    );
}