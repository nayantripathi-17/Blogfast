import _crypto from "crypto";
import { VerifyCsrfOptions } from "../types";

export async function verifyCsrf({ options, cookieValue, isPost, bodyValue }: VerifyCsrfOptions) {
  try {
    if (cookieValue) {
      const [csrfToken, csrfTokenHash] = cookieValue.split("|");
      const expectedCsrfTokenHash = (_crypto.createHash)("sha256").update(`${csrfToken}${options.secret}`).digest("hex");
      if (csrfTokenHash === expectedCsrfTokenHash) {
        const csrfTokenVerified = isPost && csrfToken === bodyValue;
        return {
          csrfTokenVerified,
        };
      }
    }
    return {
      csrfTokenVerified: false,
    };
  } catch (err) {
    throw err;
  }
}
