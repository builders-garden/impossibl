/** biome-ignore-all lint/suspicious/noExplicitAny: generic props for pixi */
"use client";

import { Application, extend, useApplication, useTick } from "@pixi/react";
import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Register PixiJS components
extend({
  Container,
  Graphics,
  Text,
});

// CONSTANTS
const TILE = 20;
const GROUND_Y = 400;

// LEVEL
const LEVEL = {
  player: {
    x: 0 * TILE,
    y: GROUND_Y - TILE,
    width: TILE,
    height: TILE,
    color: 0xff4444, // red color for player
    runSpeed: 200,
    jumpVelocity: -400,
    gravity: 1800,
  },
  obstacles: [
    { kind: "spike", x: 8 * TILE, y: GROUND_Y },
    { kind: "block", x: 18 * TILE, y: GROUND_Y, width: 3 * TILE, height: TILE },
    { kind: "block", x: 19 * TILE, y: GROUND_Y, width: 3 * TILE, height: TILE },
    { kind: "block", x: 20 * TILE, y: GROUND_Y, width: 3 * TILE, height: TILE },
    { kind: "block", x: 26 * TILE, y: GROUND_Y, width: 3 * TILE, height: TILE },
    {
      kind: "platform",
      x: 18 * TILE,
      y: GROUND_Y - TILE,
      width: TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 19 * TILE,
      y: GROUND_Y - TILE,
      width: TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 20 * TILE,
      y: GROUND_Y - TILE,
      width: TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 22 * TILE,
      y: GROUND_Y - 2 * TILE,
      width: TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 23 * TILE,
      y: GROUND_Y - 2 * TILE,
      width: TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 24 * TILE,
      y: GROUND_Y - 2 * TILE,
      width: TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 26 * TILE,
      y: GROUND_Y - 3 * TILE,
      width: TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 27 * TILE,
      y: GROUND_Y - 3 * TILE,
      width: TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 28 * TILE,
      y: GROUND_Y - 3 * TILE,
      width: TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 29 * TILE,
      y: GROUND_Y - 3 * TILE,
      width: TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 30 * TILE,
      y: GROUND_Y - 3 * TILE,
      width: TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 31 * TILE,
      y: GROUND_Y - 3 * TILE,
      width: TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 32 * TILE,
      y: GROUND_Y - 3 * TILE,
      width: TILE,
      height: TILE,
    },
    { kind: "spike", x: 29 * TILE, y: GROUND_Y - 3 * TILE },
    {
      kind: "block",
      x: 34 * TILE,
      y: GROUND_Y,
      width: 4 * TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 34 * TILE,
      y: GROUND_Y - 3 * TILE,
      width: 2 * TILE,
      height: TILE,
    },
    { kind: "spike", x: 38 * TILE, y: GROUND_Y },
    {
      kind: "block",
      x: 44 * TILE,
      y: GROUND_Y,
      width: 4 * TILE,
      height: TILE,
    },
    {
      kind: "block",
      x: 48 * TILE,
      y: GROUND_Y,
      width: 4 * TILE,
      height: TILE,
    },
    {
      kind: "block",
      x: 52 * TILE,
      y: GROUND_Y,
      width: 4 * TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 44 * TILE,
      y: GROUND_Y - TILE,
      width: 2 * TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 48 * TILE,
      y: GROUND_Y - 2 * TILE,
      width: 2 * TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 52 * TILE,
      y: GROUND_Y - 3 * TILE,
      width: 2 * TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 56 * TILE,
      y: GROUND_Y - 4 * TILE,
      width: 2 * TILE,
      height: TILE,
    },
    { kind: "spike", x: 59 * TILE, y: GROUND_Y - 4 * TILE },
    {
      kind: "platform",
      x: 64 * TILE,
      y: GROUND_Y - 3 * TILE,
      width: 2 * TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 68 * TILE,
      y: GROUND_Y - 2 * TILE,
      width: 2 * TILE,
      height: TILE,
    },
    {
      kind: "platform",
      x: 72 * TILE,
      y: GROUND_Y - TILE,
      width: 2 * TILE,
      height: TILE,
    },
    { kind: "spike", x: 76 * TILE, y: GROUND_Y },
  ],
  endX: 82 * TILE,
};

const DrawGraphics = ({
  draw,
  ...props
}: { draw: (g: Graphics) => void } & any) => {
  const drawRef = useRef(draw);
  drawRef.current = draw;

  return (
    <pixiGraphics
      draw={(g) => {
        drawRef.current(g);
      }}
      {...props}
    />
  );
};

type GameState = "playing" | "won" | "paused" | "lost";

type GameProps = {
  attempts: number;
  onAttempt: (hasWon: boolean) => void;
  loading: boolean;
  error: string | null;
  ready: boolean;
  onGameStateChange?: (state: GameState) => void;
};
const GameContent = ({ attempts, onAttempt, onGameStateChange }: GameProps) => {
  const { app } = useApplication();
  const worldRef = useRef<Container>(null);
  const playerRef = useRef<Graphics>(null);
  const [gameState, setGameState] = useState<GameState>("playing");

  // Notify parent of game state changes
  useEffect(() => {
    onGameStateChange?.(gameState);
  }, [gameState, onGameStateChange]);

  // Game state in refs to avoid re-renders during game loop
  const state = useRef({
    x: LEVEL.player.x,
    y: LEVEL.player.y,
    vy: 0,
    onGround: false,
    wantsJump: false,
    width: LEVEL.player.width,
    height: LEVEL.player.height,
  });

  // Input handling
  useEffect(() => {
    if (!app || (app && !app.canvas)) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && gameState === "playing") {
        state.current.wantsJump = true;
        // Prevent scrolling
        e.preventDefault();
      }
      if (e.code === "Escape") {
        setGameState((prev) => (prev === "paused" ? "playing" : "paused"));
      }
    };

    const handlePointerDown = () => {
      if (gameState === "playing") {
        state.current.wantsJump = true;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    app.canvas.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (app.canvas) {
        app.canvas.removeEventListener("pointerdown", handlePointerDown);
      }
    };
  }, [app, gameState]);

  // Reset function
  const resetPlayer = () => {
    state.current.x = LEVEL.player.x;
    state.current.y = LEVEL.player.y;
    state.current.vy = 0;
    state.current.onGround = false;
  };

  // Game Loop
  useTick((ticker) => {
    if (gameState === "won" || gameState === "paused" || gameState === "lost") {
      return;
    }

    // Pixi v8 ticker.deltaTime is frame-based (1 = 60fps approx)
    const seconds = ticker.deltaTime / 60;
    const s = state.current;

    // Move Horizontal
    s.x += LEVEL.player.runSpeed * seconds;

    // Jump
    if (s.wantsJump && s.onGround) {
      s.vy = LEVEL.player.jumpVelocity;
      s.onGround = false;
    }
    s.wantsJump = false;

    // Gravity
    s.vy += LEVEL.player.gravity * seconds;
    s.y += s.vy * seconds;

    // Player bounds
    const px1 = s.x;
    const px2 = s.x + s.width;

    // Ground/Void check
    const overBlock = LEVEL.obstacles.some((o) => {
      if (o.kind !== "block") {
        return false;
      }
      const ox2 = o.x + (o.width || TILE);
      return px2 > o.x && px1 < ox2;
    });

    const groundTop = GROUND_Y - s.height;

    if (!overBlock && s.y >= groundTop) {
      s.y = groundTop;
      s.vy = 0;
      s.onGround = true;
    }

    // Recompute vertical bounds
    const adjPy1 = s.y;
    const adjPy2 = s.y + s.height;

    // Collisions
    for (const o of LEVEL.obstacles) {
      const oWidth = o.width || TILE;
      const oHeight = o.height || TILE;
      const ox1 = o.x;
      const ox2 = o.x + oWidth;

      let oy1 = o.y;
      if (o.kind === "spike") {
        oy1 = o.y - TILE;
      }
      const oy2 = oy1 + oHeight;

      if (o.kind === "spike" || o.kind === "block") {
        const hit = px1 < ox2 && px2 > ox1 && adjPy1 < oy2 && adjPy2 > oy1;
        if (hit) {
          onAttempt(false);
          setGameState("lost");
          resetPlayer();
          break;
        }
      } else if (o.kind === "platform") {
        const horizontal = px2 > ox1 && px1 < ox2;
        const falling = s.vy > 0;
        const landing = adjPy2 > oy1 && adjPy1 < oy1 && falling;

        if (horizontal && landing) {
          s.y = oy1 - s.height;
          s.vy = 0;
          s.onGround = true;
        }
      }
    }

    // Win check
    if (s.x > LEVEL.endX + TILE) {
      setGameState("won");
      onAttempt(true);
    }

    // Apply state to refs
    if (playerRef.current) {
      playerRef.current.x = s.x;
      playerRef.current.y = s.y;
    }

    // Camera
    if (worldRef.current) {
      const targetX = -s.x + app.screen.width * 0.3;
      worldRef.current.x += (targetX - worldRef.current.x) * 0.1;
    }
  });

  // Helper to draw ground
  const drawGround = useCallback((g: Graphics) => {
    g.clear();
    g.rect(0, GROUND_Y, 5000, 800 - GROUND_Y);
    g.fill(0x111111); // dark grey as ground color
  }, []);

  // Helper to draw player
  const drawPlayer = useCallback((g: Graphics) => {
    g.clear();
    g.rect(0, 0, LEVEL.player.width, LEVEL.player.height);
    g.fill(LEVEL.player.color); // red as player color
  }, []);

  // Helper to draw flag
  const drawFlag = useCallback((g: Graphics) => {
    g.clear();
    g.beginFill(0xffffff); // white as flag color
    g.fill(0xaa66ff); // purple as flag color
    g.setStrokeStyle({ width: 4, color: 0xffffff }); // white as flag color
    g.moveTo(0, 0);
    g.lineTo(0, -TILE * 2);
    g.stroke();
    g.poly([0, -TILE * 2, TILE, -TILE * 1.5, 0, -TILE]);
    g.endFill();
    g.stroke();
  }, []);

  // Render obstacles
  const obstacleComponents = useMemo(() => {
    return LEVEL.obstacles.map((o, i) => {
      const draw = (g: Graphics) => {
        g.clear();
        if (o.kind === "spike") {
          const s = TILE;
          g.fill(0x000000);
          g.setStrokeStyle({ width: 2, color: 0xffffff });
          g.moveTo(0, s);
          g.lineTo(s / 2, 0);
          g.lineTo(s, s);
          g.lineTo(0, s);
          g.stroke();
        } else if (o.kind === "block") {
          g.fill(0x00ff00);
          g.setStrokeStyle({ width: 2, color: 0x00ff00 }); // green as grass color
          g.rect(0, 0, o.width || TILE, o.height || TILE);
          g.stroke();
        } else if (o.kind === "platform") {
          g.fill(0x1e1e1e); // dark grey color for platforms
          g.rect(0, 0, o.width || TILE, o.height || TILE);
          g.stroke();
        }
      };

      // Position adjustment for spikes
      const y = o.kind === "spike" ? o.y - TILE : o.y;

      // Use a composite key
      const key = `${i}-${o.kind}-${o.x}`;

      return <DrawGraphics draw={draw} key={key} x={o.x} y={y} />;
    });
  }, []);

  // Style for text
  const textStyle = useMemo(
    () =>
      new TextStyle({
        fill: "#f0f0f0",
        fontSize: 50,
        fontWeight: "bold",
      }),
    []
  );

  // Style for attempts text
  const attemptsTextStyle = useMemo(
    () =>
      new TextStyle({
        fill: "#ffffff",
        fontSize: 20,
        fontWeight: "bold",
      }),
    []
  );

  // Style for menu text
  const menuTextStyle = useMemo(
    () =>
      new TextStyle({
        fill: "#ffffff",
        fontSize: 30,
        fontWeight: "bold",
      }),
    []
  );

  if (!app) {
    return null;
  }

  return (
    <>
      <pixiContainer ref={worldRef}>
        <DrawGraphics draw={drawGround} />
        {obstacleComponents}
        <DrawGraphics draw={drawPlayer} ref={playerRef} x={0} y={0} />
        <DrawGraphics draw={drawFlag} x={LEVEL.endX} y={GROUND_Y} />
      </pixiContainer>

      <pixiText
        style={attemptsTextStyle}
        text={`Attempt ${attempts}`}
        x={20}
        y={20}
      />

      {gameState === "paused" && (
        <pixiContainer>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.rect(0, 0, app.screen.width, app.screen.height);
              g.fill({ color: 0x000000, alpha: 0.5 });
            }}
          />
          <pixiText
            anchor={0.5}
            style={textStyle}
            text="PAUSED"
            x={app.screen.width / 2}
            y={app.screen.height / 2 - 50}
          />
          <pixiText
            anchor={0.5}
            style={menuTextStyle}
            text="Press ESC to Resume"
            x={app.screen.width / 2}
            y={app.screen.height / 2 + 20}
          />
          <pixiText
            anchor={0.5}
            cursor="pointer"
            eventMode="static"
            onPointerDown={(e: any) => {
              e.preventDefault();
              window.history.back();
            }}
            style={menuTextStyle}
            text="Click here to Exit"
            x={app.screen.width / 2}
            y={app.screen.height / 2 + 70}
          />
        </pixiContainer>
      )}

      {/* Victory text removed - handled by external dialog */}

      {/* {!ready && (
        <pixiText
          anchor={0.5}
          style={textStyle}
          text="Not ready..."
          x={app.screen.width / 2}
          y={app.screen.height / 2}
        />
      )} */}

      {/* {loading && (
        <pixiText
          anchor={0.5}
          style={textStyle}
          text="Loading..."
          x={app.screen.width / 2}
          y={app.screen.height / 2}
        />
      )}

      {error && (
        <pixiText
          anchor={0.5}
          style={textStyle}
          text={error}
          x={app.screen.width / 2}
          y={app.screen.height / 2}
        />
      )} */}
    </>
  );
};

export default function Game({
  attempts,
  onAttempt,
  loading,
  error,
  ready,
  onGameStateChange,
}: GameProps) {
  const [mounted, setMounted] = useState(false);
  const parentRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-neutral-900"
      ref={parentRef}
    >
      <Application antialias={true} background="#222222" resizeTo={parentRef}>
        <GameContent
          attempts={attempts}
          error={error}
          loading={loading}
          onAttempt={onAttempt}
          onGameStateChange={onGameStateChange}
          ready={ready}
        />
      </Application>
    </div>
  );
}
