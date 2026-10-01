import { notFound } from "next/navigation";
import { profileSectionsFor } from "@/modules/auth/permissions";
import { requirePageUser } from "@/modules/auth/server/session";
import { getProfile } from "@/modules/profile/server/profile";
import { ProfileForm } from "@/modules/profile/components/ProfileForm";

// Every logged-in user can edit their own profile
export default async function ProfilePage() {
  const user = await requirePageUser();
  const profile = await getProfile(user.id);
  if (!profile) notFound();

  return (
    <ProfileForm
      profile={profile}
      sections={profileSectionsFor(user)}
      loginAvatarUrl={user.loginAvatarUrl}
    />
  );
}
