import { NextResponse } from "next/server";
import { signUpWithUsernameAndPassword } from "@/app/shared/_action";
import { ErrorCodes, ErrorMessages } from "@/app/shared/errorMessages";
import { generateUserEmailTemp } from "@/helpers/helperStore";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, passwordConfirm } = body;

    console.log("Registration request data:", body);
    try {
      const result = await signUpWithUsernameAndPassword({
        data: {
          username,
          password,
          passwordConfirm,
          email: generateUserEmailTemp(),
        },
      });
      console.log("Registration result:", result);
      const parsedResult = JSON.parse(result);
      if (parsedResult.error) {
        console.log("parsedResult:", parsedResult);
        return NextResponse.json(parsedResult, { status: 400 });
      }

      return NextResponse.json(parsedResult, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        {
          error: {
            message: "Lỗi chưa đăng ký được",
            code: ErrorCodes.REGISTRATION_FAILED,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in register route:", error);
    return NextResponse.json(
      {
        error: {
          code: ErrorCodes.NETWORK_ERROR,
          message: ErrorMessages[ErrorCodes.NETWORK_ERROR],
        },
      },
      { status: 500 }
    );
  }
}
