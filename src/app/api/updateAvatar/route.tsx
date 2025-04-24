import { getCurrentUserProfile } from "@/app/shared/_action";
import { generateFilePath, getFilenameFromUrl } from "@/helpers/helperStore";
import createSupabaseAdminAuthClient from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const avatar = formData.get("avatar");

    if (!avatar || !(avatar instanceof File)) {
      return new Response(JSON.stringify({ error: "Avatar is required" }), {
        status: 400,
      });
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(avatar.type)) {
      return new Response(
        JSON.stringify({
          error: "Invalid file type. Only JPEG and PNG are allowed.",
        }),
        { status: 400 }
      );
    }

    const maxSize = 2 * 1024 * 1024;
    if (avatar.size > maxSize) {
      return new Response(
        JSON.stringify({ error: "File size exceeds 2MB limit." }),
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminAuthClient();
    const arrayBuffer = await avatar.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = await generateFilePath(avatar);

    if (!fileName) {
      return new Response(JSON.stringify({ error: `Upload failed` }), {
        status: 500,
      });
    }
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, buffer, {
        contentType: avatar.type,
        upsert: false,
      });

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
        status: 500,
      });
    }

    const user = await getCurrentUserProfile();

    if (user) {
      const id = user.id;
      const filePath = getFilenameFromUrl(user.avatar_url);

      if (filePath) {
        const { error: removeError } = await supabase.storage
          .from("avatars")
          .remove([filePath]);

        if (removeError) {
          return new Response(JSON.stringify({ error: removeError.message }), {
            status: 500,
          });
        }
      }

      const publicUrl = supabase.storage.from("avatars").getPublicUrl(fileName)
        .data.publicUrl;
      //
      const { error: upsertError, data: upsertData } = await supabase
        .from("profiles")
        .upsert({ id, avatar_url: publicUrl });

      if (upsertError) {
        return new Response(JSON.stringify({ error: upsertError.message }), {
          status: 500,
        });
      }

      return new Response(
        JSON.stringify({
          message: "Avatar uploaded successfully",
          url: publicUrl,
          upsertImage: upsertData,
        }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: `Upload failed: ${error}` }), {
      status: 500,
    });
  }
}
