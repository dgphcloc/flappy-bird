import { NextResponse } from "next/server";
import { signInWithUsernameAndPassword } from "@/app/shared/_action";
import { ErrorCodes, ErrorMessages } from "@/app/shared/errorMessages";

type ErrorCode = keyof typeof ErrorCodes;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Kiểm tra input
    if (!username || !password) {
      return NextResponse.json(
        {
          error: ErrorCodes.EMPTY_FIELDS,
          message: ErrorMessages[ErrorCodes.EMPTY_FIELDS],
        },
        { status: 400 }
      );
    }

    try {
      const result = await signInWithUsernameAndPassword({
        username,
        password,
      });

      console.log("Raw result from signInWithUsernameAndPassword:", result);

      const parsedResult = JSON.parse(result);
      console.log("Parsed result:", parsedResult);

      if (parsedResult.error) {
        // Xử lý các loại lỗi từ Supabase
        let errorCode: ErrorCode = "SERVER_ERROR";

        if (
          parsedResult.error.message.includes("Invalid username or password")
        ) {
          errorCode = "INVALID_CREDENTIALS";
        } else if (parsedResult.error.message.includes("User not found")) {
          errorCode = "USER_NOT_FOUND";
        } else if (parsedResult.error.message.includes("Invalid password")) {
          errorCode = "INVALID_PASSWORD";
        } else if (parsedResult.error.message.includes("disabled")) {
          errorCode = "ACCOUNT_DISABLED";
        } else if (parsedResult.error.message.includes("Too many requests")) {
          errorCode = "TOO_MANY_ATTEMPTS";
        }

        console.log("Error code:", errorCode);
        console.log("Error message:", parsedResult.error.message);

        return NextResponse.json(
          {
            error: ErrorCodes[errorCode],
            message: ErrorMessages[ErrorCodes[errorCode]],
          },
          { status: 400 }
        );
      }

      return NextResponse.json(parsedResult);
    } catch (error) {
      // Xử lý lỗi từ server
      console.error("Error in signInWithUsernameAndPassword:", error);
      return NextResponse.json(
        {
          error: ErrorCodes.SERVER_ERROR,
          message: ErrorMessages[ErrorCodes.SERVER_ERROR],
        },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error) {
      return NextResponse.json(
        {
          error: ErrorCodes.SERVER_ERROR,
          message: ErrorMessages[ErrorCodes.SERVER_ERROR],
        },
        { status: 400 }
      );
    }
    // Xử lý lỗi parse JSON
  }
}
