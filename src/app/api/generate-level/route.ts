import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { env } from "@/lib/env";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const requestSchema = z.object({
  prompt: z.string().min(1).max(1000),
  difficulty: z
    .enum(["medium", "hard", "extreme"])
    .optional()
    .default("medium"),
});

// Type definitions for the level structure
type Obstacle =
  | { kind: "spike"; x: number; y: number }
  | { kind: "block"; x: number; y: number; width: number; height: number }
  | { kind: "platform"; x: number; y: number; width: number; height: number };

type Level = {
  player: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: number;
    runSpeed: number;
    jumpVelocity: number;
    gravity: number;
  };
  obstacles: Obstacle[];
  endX: number;
};

const TILE = 20;
const GROUND_Y = 400;

// Regex patterns for extracting JSON from markdown code blocks
const JSON_MARKDOWN_REGEX = /```(?:json)?\s*(\{[\s\S]*\})\s*```/;
const JSON_OBJECT_REGEX = /(\{[\s\S]*\})/;

const systemPrompt = `You are a game level designer for a 2D platformer game. Generate a complete level in JSON format.

Game mechanics:
- TILE size: ${TILE} pixels
- GROUND_Y: ${GROUND_Y} pixels (ground level)
- Player starts at x: 0, y: ${GROUND_Y - TILE}
- Player dimensions: ${TILE}x${TILE} pixels
- Player moves automatically to the right at runSpeed pixels per second
- Player can jump with jumpVelocity (negative value, typically -300 to -500)
- Gravity pulls player down (typically 1200-2000)

Obstacle types:
1. "spike": Deadly obstacle that kills on contact. Can be on ground (y = ${GROUND_Y}) or on platforms (y < ${GROUND_Y})
2. "block": Creates solid ground at y = ${GROUND_Y}. IMPORTANT: Blocks REMOVE ground where they are placed, creating gaps/voids. Use multiple adjacent blocks to create solid ground sections.
3. "platform": Jumpable platform, can be at any height (y < ${GROUND_Y}). Player can land on top only.

Level design principles:
- CRITICAL: Level MUST be completable! Never place impossible obstacles at the start.
- Start safe: First 5-10 tiles should be clear or have easy, jumpable obstacles
- Create progression: early obstacles, gaps (voids), staircases, floating platforms, final ramp
- Blocks create gaps: Place blocks strategically to create void pits that player must jump over
- Staircases: Use platforms at increasing heights (e.g., GROUND_Y - TILE, GROUND_Y - 2*TILE, etc.)
- Floating platforms: Place platforms over voids to create jumping challenges
- Spikes: Can be on ground or on platforms for extra challenge
- endX: Should be positioned after all obstacles. Levels must be LONG: typically 120-200+ tiles from start (2400-4000+ pixels). Create extensive levels with many obstacles, multiple sections, and varied challenges throughout.
- Ensure all gaps are jumpable with the given player stats (runSpeed, jumpVelocity, gravity)
- Test mentally: Can a player with these stats complete this level? If not, adjust obstacles

Constraints:
- All x, y coordinates must be multiples of TILE (${TILE})
- Player x is always 0, y is always ${GROUND_Y - TILE}
- Player width and height are always ${TILE}
- Player color: MUST ALWAYS be 0xff4444 (red) - do not change this
- Player runSpeed: typically 150-300
- Player jumpVelocity: typically -300 to -500 (negative for upward)
- Player gravity: typically 1200-2000
- Spikes: y can be ${GROUND_Y} (ground) or less (on platforms)
- Blocks: y should be ${GROUND_Y} (ground level)
- Platforms: y should be less than ${GROUND_Y} (above ground)
- Width and height should be multiples of TILE (${TILE})
- endX should be a multiple of TILE and positioned after all obstacles

Return ONLY valid JSON matching this exact structure:
{
  "player": {
    "x": 0,
    "y": ${GROUND_Y - TILE},
    "width": ${TILE},
    "height": ${TILE},
    "color": 0xff4444,
    "runSpeed": number,
    "jumpVelocity": number,
    "gravity": number
  },
  "obstacles": [
    {"kind": "spike", "x": number, "y": number},
    {"kind": "block", "x": number, "y": number, "width": number, "height": number},
    {"kind": "platform", "x": number, "y": number, "width": number, "height": number}
  ],
  "endX": number
}`;

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

    const { prompt, difficulty } = parsed.data;

    // Adjust difficulty parameters in the prompt
    const difficultyHints = {
      medium:
        "Create a LONG medium difficulty level (120-180 tiles) with moderate challenges, many obstacles, gaps, and varied platform heights. Level must be completable - start with easy obstacles and gradually increase difficulty. Include multiple sections with different challenges.",
      hard: "Create a LONG hard level (150-200 tiles) with tight jumps, many obstacles, spikes, and challenging platform sequences. Level must be completable - ensure all gaps are jumpable and obstacles are strategically placed. Include multiple challenging sections.",
      extreme:
        "Create a VERY LONG extreme difficulty level (180-250+ tiles) with very tight jumps, many obstacles, spikes, and very challenging platform sequences. Level must still be completable - test that all gaps are jumpable with the player's stats. Include many challenging sections throughout.",
    };

    const userPrompt = `${prompt}\n\nDifficulty: ${difficulty}\n${difficultyHints[difficulty]}\n\nIMPORTANT REQUIREMENTS:\n1. The level MUST be completable! Start with safe/easy obstacles in the first 5-10 tiles.\n2. The level MUST be LONG - aim for 120-250+ tiles (2400-5000+ pixels) depending on difficulty.\n3. Include MANY obstacles throughout the level - create multiple sections with varied challenges.\n4. Ensure all gaps are jumpable with the player's runSpeed, jumpVelocity, and gravity.\n5. Never place impossible obstacles at the start.\n6. Player color MUST be 0xff4444 (red) - do not change this.\n\nGenerate the complete level JSON with player parameters, obstacles, and endX.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from OpenAI" },
        { status: 500 }
      );
    }

    let levelData: Level;
    try {
      levelData = JSON.parse(content) as Level;
    } catch (_parseError) {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch =
        content.match(JSON_MARKDOWN_REGEX) || content.match(JSON_OBJECT_REGEX);

      if (jsonMatch) {
        levelData = JSON.parse(jsonMatch[1]) as Level;
      } else {
        throw new Error("Failed to parse JSON from response");
      }
    }

    // Validate and normalize the level data
    const normalizeCoord = (n: number) => Math.round(n / TILE) * TILE;

    // Validate that early obstacles are safe (first 10 tiles = 200 pixels)
    const SAFE_START_ZONE = 10 * TILE; // 200 pixels
    const earlyObstacles = (levelData.obstacles || []).filter(
      (obs) => obs.x < SAFE_START_ZONE
    );

    // Check for impossible early obstacles
    const hasImpossibleStart = earlyObstacles.some((obs) => {
      if (obs.kind === "spike" && obs.x < 5 * TILE) {
        // Spikes too early
        return true;
      }
      if (obs.kind === "block") {
        // Blocks that create gaps too early might be problematic
        // But we'll allow them if they're not too close to start
        return obs.x < 3 * TILE;
      }
      return false;
    });

    if (hasImpossibleStart) {
      // Filter out impossible early obstacles
      levelData.obstacles = (levelData.obstacles || []).filter(
        (obs) =>
          !(obs.x < SAFE_START_ZONE && obs.kind === "spike" && obs.x < 5 * TILE)
      );
    }

    const normalizedLevel: Level = {
      player: {
        x: 0,
        y: GROUND_Y - TILE,
        width: TILE,
        height: TILE,
        color: 0xff4444, // Always red
        runSpeed: levelData.player?.runSpeed ?? 200,
        jumpVelocity: levelData.player?.jumpVelocity ?? -400,
        gravity: levelData.player?.gravity ?? 1800,
      },
      obstacles: (levelData.obstacles || []).map((obs) => {
        if (obs.kind === "spike") {
          // Spikes can be on ground or on platforms
          return {
            kind: "spike" as const,
            x: normalizeCoord(obs.x),
            y: normalizeCoord(obs.y),
          };
        }

        if (obs.kind === "block") {
          return {
            kind: "block" as const,
            x: normalizeCoord(obs.x),
            y: GROUND_Y, // Blocks are always ground level
            width: Math.max(
              TILE,
              Math.round((obs.width || TILE) / TILE) * TILE
            ),
            height: Math.max(
              TILE,
              Math.round((obs.height || TILE) / TILE) * TILE
            ),
          };
        }

        // platform
        return {
          kind: "platform" as const,
          x: normalizeCoord(obs.x),
          y: normalizeCoord(obs.y),
          width: Math.max(TILE, Math.round((obs.width || TILE) / TILE) * TILE),
          height: Math.max(
            TILE,
            Math.round((obs.height || TILE) / TILE) * TILE
          ),
        };
      }),
      endX: Math.max(
        TILE * 100, // Minimum endX for long levels (2000 pixels)
        normalizeCoord(levelData.endX || TILE * 150)
      ),
    };

    return NextResponse.json({ level: normalizedLevel }, { status: 200 });
  } catch (error) {
    console.error("Error generating level:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
