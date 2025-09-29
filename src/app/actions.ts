
"use server";

import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  // Dummy authentication logic. In a real app, you would validate credentials.
  const email = formData.get("email");
  const password = formData.get("password");

  if (email && password) {
    // Successful login redirects to the new gateway page.
    // This is disabled for static export.
    // redirect("/gateway");
  }

  // Failed login could redirect back to login with an error.
  // For now, we just don't redirect if fields are empty.
}
