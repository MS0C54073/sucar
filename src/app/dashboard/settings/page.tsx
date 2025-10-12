import { ProfileForm } from "@/components/dashboard/settings/profile-form";

export default function SettingsPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-headline">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>
            <ProfileForm />
        </div>
    );
}
