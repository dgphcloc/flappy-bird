"use client";

import createSupabaseAdminAuthClient from "@/lib/supabase/admin";
import { useState } from "react";
import { Loader, Button, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { FaCamera } from "react-icons/fa";
import { generateFilePath } from "@/helpers/helperStore";

interface AvatarProps {
  onUpload: (url: string) => void;
}

export default function AvatarUpload({ onUpload }: AvatarProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const supabase = await createSupabaseAdminAuthClient();
    try {
      setIsLoading(true);

      if (!event.target.files?.length) return;

      const file = event.target.files[0];
      const filePath = await generateFilePath(file);

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        onUpload(publicUrlData.publicUrl);
      }
      notifications.show({
        title: "Success",
        message: "Avatar has been updated successfully!",
        color: "green",
      });
    } catch (error) {
      if (error) {
        notifications.show({
          title: "Error",
          message: "Failed to update avatar. Please try again.",
          color: "red",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button>
        <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {isLoading ? (
            <Loader color="rgba(255, 255, 255, 1)" size="xs" />
          ) : (
            <>
              <Group align="center" gap="xs">
                <FaCamera />
                <Text>Change Avatar</Text>
              </Group>
            </>
          )}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={uploadAvatar}
            disabled={isLoading}
          />
        </label>
      </Button>
    </div>
  );
}
