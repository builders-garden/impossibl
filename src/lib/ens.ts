import {
  getAddress as getAddressFromOnchainkit,
  getAvatar,
  getName,
} from "@coinbase/onchainkit/identity";
import { type Address, createPublicClient, getAddress, http } from "viem";
import { base, mainnet } from "viem/chains";
import { normalize } from "viem/ens";

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

/**
 * Get the ENS name for a given address
 * @param address
 * @returns normalized ENS name or null if not found
 */
export async function getEnsName(address: Address): Promise<string | null> {
  const ensName = await mainnetClient.getEnsName({
    address: getAddress(address),
  });
  if (!ensName) {
    return null;
  }
  return normalize(ensName);
}

/**
 * Get the address from a ENS name
 * @param ensName - The ENS name to get the address from
 * @returns
 */
export async function getAddressFromEnsName(
  ensName: string
): Promise<Address | null> {
  const address = await mainnetClient.getEnsAddress({
    name: normalize(ensName),
  });
  if (!address) {
    return null;
  }
  return getAddress(address);
}

/**
 * Get the ENS avatar for a given ENS name
 * @param ensName
 * @returns
 */
export async function getEnsAvatar(ensName: string) {
  const ensAvatar = await mainnetClient.getEnsAvatar({ name: ensName });
  return ensAvatar;
}

/**
 * Get the Base name for a given address
 * @param address
 * @returns normalized Base name or null if not found
 */
export async function getBasename(address: Address): Promise<string | null> {
  const baseName = await getName({ address: getAddress(address), chain: base });
  if (!baseName) {
    return null;
  }
  return normalize(baseName);
}

/**
 * Get the address from a Base name
 * @param basename - The Base name to get the address from
 * @returns
 */
export async function getAddressFromBasename(
  basename: string
): Promise<Address | null> {
  const address = await getAddressFromOnchainkit({
    name: normalize(basename),
    chain: base,
  });
  if (!address) {
    return null;
  }
  return getAddress(address);
}

/**
 * Get the Base avatar for a given Base name
 * @param baseName
 * @returns
 */
export async function getBasenameAvatar(baseName: string) {
  const baseAvatar = await getAvatar({ ensName: baseName, chain: base });
  return baseAvatar;
}

/**
 * Lookup the ENS or Base name and avatar for a given address
 * @param address - The address to lookup
 * @returns
 */
export async function ensLookup(
  address: string
): Promise<{ name: string; avatar: string }> {
  const [ensName, baseName] = await Promise.all([
    getEnsName(getAddress(address)),
    getBasename(getAddress(address)),
  ]);
  let ensAvatar: string | null = null;
  let baseNameAvatar: string | null = null;
  if (ensName) {
    ensAvatar = await getEnsAvatar(ensName);
    return {
      name: ensName,
      avatar: ensAvatar ?? "",
    };
  }
  if (baseName) {
    baseNameAvatar = await getBasenameAvatar(baseName);
    return {
      name: baseName,
      avatar: baseNameAvatar ?? "",
    };
  }
  return {
    name: baseName ?? ensName ?? address,
    avatar: baseNameAvatar ?? ensAvatar ?? "",
  };
}
