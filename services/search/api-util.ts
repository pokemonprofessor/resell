import { ApiError } from "@sajari/sdk-node";

export const handleError = (e: any) => {
  if (e instanceof ApiError) {
    const msg = [
      `Message: ${e.message}`,
      `Code: ${e.code}`,
      `Details: ${JSON.stringify(e.details, null, 2)}`,
    ].join("\n");
    console.error(msg);
    return;
  }

  console.error(e);
};