import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/database";
import { tournament } from "@/lib/database/db.schema";

const requestSchema = z.object({
  address: z.string().min(1),
  tournamentId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.message },
        { status: 400 }
      );
    }

    const { address, tournamentId } = parsed.data;

    // Read tournament and merkleValues from database
    const tournamentData = await db.query.tournament.findFirst({
      where: eq(tournament.id, tournamentId),
    });

    if (!tournamentData) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 }
      );
    }

    const merkleValues = tournamentData.merkleValues;
    if (
      !(merkleValues && Array.isArray(merkleValues)) ||
      merkleValues.length === 0
    ) {
      return NextResponse.json(
        { error: "Merkle tree not generated for this tournament" },
        { status: 400 }
      );
    }

    // Reconstruct the Merkle tree from merkleValues
    const tree = StandardMerkleTree.of(merkleValues as [string, string][], [
      "address",
      "uint256",
    ]);

    // Find the leaf and get the proof
    let proof: string[] | null = null;
    let value: [string, string] | null = null;

    for (const [i, v] of tree.entries()) {
      if (v[0].toLowerCase() === address.toLowerCase()) {
        proof = tree.getProof(i);
        value = v;
        break;
      }
    }

    if (!proof) {
      return NextResponse.json(
        { error: "No proof found for the given address in this tournament" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      proof,
      value,
    });
  } catch (error) {
    console.error("Error generating proof:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to generate proof",
      },
      { status: 500 }
    );
  }
}
