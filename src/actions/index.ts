import { defineAction } from "astro:actions";
import { z } from "zod";

/**
 * Helper function to make requests to Listmonk API
 */
export async function sendToListmonk(
  method: string,
  path: string,
  payload?: any
) {
  const baseUrl =
    import.meta.env.PUBLIC_LISTMONK_URL || "https://sub.dalab.top";
  const url = new URL(path, baseUrl);

  const headers: any = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url.href, {
      method: method,
      headers,
      body: JSON.stringify({ ...payload }),
    });

    // Check if response is OK
    if (!response.ok) {
      const text = await response.text();
      console.error("Listmonk API error response:", text);
      throw new Error(`HTTP ${response.status}: ${text.substring(0, 200)}`);
    }

    // Check content type
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 500));
      throw new Error("Expected JSON response but got: " + contentType);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Listmonk API error:", error);
    throw error;
  }
}

interface SubscriptionPayload {
  email: string;
  name?: string;
  list_uuids: string[];
}

export const server = {
  subscribe: defineAction({
    accept: "form",
    input: z.object({
      email: z
        .string({ message: "Email is required." })
        .email("Please enter a valid email address."),
      name: z.string().optional(),
      list_id: z.string().default("402eb8c4-563a-49ff-8910-bfca103ffd56"),
    }),

    handler: async (formData) => {
      console.log("📧 Subscription request:", formData.email);

      // Listmonk API format - see: https://listmonk.app/docs/apis/public/
      const payload: SubscriptionPayload = {
        email: formData.email,
        name: formData.name || "",
        list_uuids: [formData.list_id],
      };

      const responseData = await sendToListmonk(
        "POST",
        "/api/public/subscription",
        payload
      );

      if (!responseData) {
        return {
          listmonkErrors: null,
          message: "Oops! Something went wrong. Please try again.",
          success: false,
        };
      }

      // Listmonk returns a message on error
      if (responseData.error || responseData.message?.includes("already")) {
        return {
          listmonkErrors: responseData,
          message:
            responseData.message || "Subscription failed. Please try again.",
          success: false,
        };
      }

      return {
        message: "Successfully subscribed! Check your email to confirm.",
        data: responseData,
        listmonkErrors: null,
        success: true,
      };
    },
  }),
};
