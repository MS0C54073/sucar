
'use client';

import { ProfileForm } from '@/components/dashboard/settings/profile-form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAuth } from '@/context/auth-provider';
import { VehicleManagement } from '@/components/dashboard/settings/vehicle-management';
import { DocumentManagement } from '@/components/dashboard/settings/document-management';

export default function SettingsPage() {
  const { role } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, profile, and documents.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {role === 'client' && (
            <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
          )}
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        {role === 'client' && (
          <TabsContent value="vehicles">
            <VehicleManagement />
          </TabsContent>
        )}
        <TabsContent value="documents">
            <DocumentManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
