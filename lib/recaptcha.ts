// lib/recaptcha.ts

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not set")
    return { success: false, error: "reCAPTCHA configuration error" }
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()

    if (data.success) {
      return { success: true }
    } else {
      const codes = data["error-codes"] || []
      console.error("[v0] reCAPTCHA verification failed. error-codes:", codes, "hostname:", data.hostname)
      return { success: false, error: `reCAPTCHA verification failed: ${codes.join(", ") || "unknown"}` }
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return { success: false, error: "reCAPTCHA verification error" }
  }
}
