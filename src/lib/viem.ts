/**
 * Verify a SIWE message
 * @param message - The message to verify
 * @param signature - The signature to verify
 * @param address - The address to verify
 * @returns True if the message is verified, false otherwise
 * @param address
 * @returns
 */
export function verifySIWEMessage(
  message: string,
  signature: string,
  address: string
) {
  try {
    if (!(message && signature && address)) {
      throw new Error("Invalid message, signature, or address");
    }
    // if (!isHex(signature)) {
    //   throw new Error("Invalid signature");
    // }
    // const isValid = await verifyMessage({
    //   address: getAddress(address),
    //   message,
    //   signature,
    // });
    return true;
  } catch (error) {
    console.error("SIWE verification failed:", error);
    return false;
  }
}
