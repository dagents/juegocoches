"use client";

import { useEffect, useRef } from "react";
import type { GameState } from "@/game/engine/GameState";

// Dynamic import to avoid SSR issues with Babylon.js
let Engine: typeof import("@babylonjs/core").Engine;
let Scene: typeof import("@babylonjs/core").Scene;
let ArcRotateCamera: typeof import("@babylonjs/core").ArcRotateCamera;
let HemisphericLight: typeof import("@babylonjs/core").HemisphericLight;
let PointLight: typeof import("@babylonjs/core").PointLight;
let Vector3: typeof import("@babylonjs/core").Vector3;
let Color3: typeof import("@babylonjs/core").Color3;
let Color4: typeof import("@babylonjs/core").Color4;
let MeshBuilder: typeof import("@babylonjs/core").MeshBuilder;
let StandardMaterial: typeof import("@babylonjs/core").StandardMaterial;
let GlowLayer: typeof import("@babylonjs/core").GlowLayer;
let ParticleSystem: typeof import("@babylonjs/core").ParticleSystem;
let Texture: typeof import("@babylonjs/core").Texture;

interface GameSceneProps {
  gameState: GameState | null;
  className?: string;
}

// Get environment colors based on game context
function getSceneColors(state: GameState | null) {
  if (!state) {
    return {
      sky: [0.02, 0.02, 0.06],
      ground: [0.1, 0.1, 0.15],
      accent: [0.5, 0.2, 0.8],
      ambient: [0.3, 0.3, 0.4],
    };
  }

  const happiness = state.stats.happiness / 100;
  const wealth = state.stats.money / 100;
  const health = state.stats.health / 100;

  return {
    sky: [0.02 + happiness * 0.05, 0.02 + health * 0.03, 0.06 + wealth * 0.04],
    ground: [0.08 + wealth * 0.1, 0.08 + happiness * 0.08, 0.12 + health * 0.05],
    accent: [0.4 + happiness * 0.4, 0.1 + health * 0.3, 0.7 + wealth * 0.2],
    ambient: [0.2 + happiness * 0.2, 0.2 + health * 0.15, 0.25 + wealth * 0.15],
  };
}

// Get scene complexity based on age/wealth
function getSceneElements(state: GameState | null) {
  if (!state) return { buildings: 0, trees: 0, particles: false };
  const wealth = state.stats.money / 100;
  const age = Math.min(state.currentAge / 80, 1);
  return {
    buildings: Math.floor(1 + wealth * 8),
    trees: Math.floor(2 + (1 - wealth) * 5),
    particles: state.stats.happiness > 60,
  };
}

export default function GameScene({ gameState, className }: GameSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<InstanceType<typeof import("@babylonjs/core").Engine> | null>(null);
  const sceneRef = useRef<InstanceType<typeof import("@babylonjs/core").Scene> | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initScene() {
      if (!canvasRef.current || !mounted) return;

      // Dynamic import Babylon.js (client-side only)
      const BABYLON = await import("@babylonjs/core");
      Engine = BABYLON.Engine;
      Scene = BABYLON.Scene;
      ArcRotateCamera = BABYLON.ArcRotateCamera;
      HemisphericLight = BABYLON.HemisphericLight;
      PointLight = BABYLON.PointLight;
      Vector3 = BABYLON.Vector3;
      Color3 = BABYLON.Color3;
      Color4 = BABYLON.Color4;
      MeshBuilder = BABYLON.MeshBuilder;
      StandardMaterial = BABYLON.StandardMaterial;
      GlowLayer = BABYLON.GlowLayer;
      ParticleSystem = BABYLON.ParticleSystem;
      Texture = BABYLON.Texture;

      if (!mounted) return;

      const engine = new Engine(canvasRef.current, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        antialias: true,
      });
      engineRef.current = engine;

      const scene = new Scene(engine);
      sceneRef.current = scene;

      const colors = getSceneColors(gameState);
      scene.clearColor = new Color4(colors.sky[0], colors.sky[1], colors.sky[2], 1);

      // Camera
      const camera = new ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 3,
        15,
        new Vector3(0, 2, 0),
        scene
      );
      camera.lowerRadiusLimit = 8;
      camera.upperRadiusLimit = 25;
      camera.lowerBetaLimit = 0.3;
      camera.upperBetaLimit = Math.PI / 2.2;
      camera.attachControl(canvasRef.current, true);

      // Ambient light
      const ambientLight = new HemisphericLight(
        "ambient",
        new Vector3(0, 1, 0),
        scene
      );
      ambientLight.intensity = 0.6;
      ambientLight.diffuse = new Color3(colors.ambient[0], colors.ambient[1], colors.ambient[2]);

      // Point light (sun)
      const sunLight = new PointLight(
        "sun",
        new Vector3(5, 10, -5),
        scene
      );
      sunLight.intensity = 0.8;
      sunLight.diffuse = new Color3(1, 0.95, 0.8);

      // Glow layer for neon effect
      const glow = new GlowLayer("glow", scene);
      glow.intensity = 0.4;

      // Ground plane
      const ground = MeshBuilder.CreateGround("ground", { width: 30, height: 30 }, scene);
      const groundMat = new StandardMaterial("groundMat", scene);
      groundMat.diffuseColor = new Color3(colors.ground[0], colors.ground[1], colors.ground[2]);
      groundMat.specularColor = new Color3(0.05, 0.05, 0.05);
      ground.material = groundMat;

      // Character (simple stylized figure)
      const body = MeshBuilder.CreateCapsule("body", { height: 1.5, radius: 0.3 }, scene);
      body.position.y = 1;
      const bodyMat = new StandardMaterial("bodyMat", scene);
      bodyMat.diffuseColor = new Color3(colors.accent[0], colors.accent[1], colors.accent[2]);
      bodyMat.emissiveColor = new Color3(colors.accent[0] * 0.3, colors.accent[1] * 0.3, colors.accent[2] * 0.3);
      body.material = bodyMat;

      // Head (parented to body so it moves with it)
      const head = MeshBuilder.CreateSphere("head", { diameter: 0.5 }, scene);
      head.parent = body;
      head.position.y = 1;
      const headMat = new StandardMaterial("headMat", scene);
      headMat.diffuseColor = new Color3(0.9, 0.75, 0.65);
      head.material = headMat;

      // Keyboard input tracking
      const keys: Record<string, boolean> = {};
      const onKeyDown = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true; };
      const onKeyUp = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      const MOVE_SPEED = 0.08;
      const GROUND_LIMIT = 14; // half of ground size minus margin

      // Scene elements based on game state
      const elements = getSceneElements(gameState);

      // Buildings (wealth indicator)
      for (let i = 0; i < elements.buildings; i++) {
        const height = 1 + Math.random() * 4;
        const width = 0.8 + Math.random() * 1.2;
        const building = MeshBuilder.CreateBox(
          `building${i}`,
          { width, height, depth: width },
          scene
        );
        const angle = (i / elements.buildings) * Math.PI * 2;
        const dist = 5 + Math.random() * 8;
        building.position.x = Math.cos(angle) * dist;
        building.position.z = Math.sin(angle) * dist;
        building.position.y = height / 2;

        const buildingMat = new StandardMaterial(`buildingMat${i}`, scene);
        const brightness = 0.1 + Math.random() * 0.15;
        buildingMat.diffuseColor = new Color3(brightness, brightness, brightness + 0.05);
        buildingMat.emissiveColor = new Color3(
          colors.accent[0] * 0.05,
          colors.accent[1] * 0.05,
          colors.accent[2] * 0.1
        );
        building.material = buildingMat;

        // Window lights
        if (Math.random() > 0.5) {
          const windowLight = MeshBuilder.CreatePlane(`window${i}`, { size: 0.3 }, scene);
          windowLight.position = building.position.clone();
          windowLight.position.y = height * 0.6;
          windowLight.position.x += width / 2 + 0.01;
          const windowMat = new StandardMaterial(`windowMat${i}`, scene);
          windowMat.emissiveColor = new Color3(1, 0.9, 0.5);
          windowLight.material = windowMat;
        }
      }

      // Trees (nature)
      for (let i = 0; i < elements.trees; i++) {
        const trunk = MeshBuilder.CreateCylinder(`trunk${i}`, { height: 1.5, diameter: 0.2 }, scene);
        const angle = (i / elements.trees) * Math.PI * 2 + 0.5;
        const dist = 4 + Math.random() * 6;
        trunk.position.x = Math.cos(angle) * dist;
        trunk.position.z = Math.sin(angle) * dist;
        trunk.position.y = 0.75;

        const trunkMat = new StandardMaterial(`trunkMat${i}`, scene);
        trunkMat.diffuseColor = new Color3(0.3, 0.2, 0.1);
        trunk.material = trunkMat;

        const canopy = MeshBuilder.CreateSphere(`canopy${i}`, { diameter: 1.5 }, scene);
        canopy.position = trunk.position.clone();
        canopy.position.y = 2;
        const canopyMat = new StandardMaterial(`canopyMat${i}`, scene);
        canopyMat.diffuseColor = new Color3(0.1, 0.3 + Math.random() * 0.2, 0.1);
        canopy.material = canopyMat;
      }

      // Floating orb (destiny indicator)
      const orb = MeshBuilder.CreateSphere("destinyOrb", { diameter: 0.4 }, scene);
      orb.position.y = 4;
      const orbMat = new StandardMaterial("orbMat", scene);
      orbMat.emissiveColor = new Color3(colors.accent[0], colors.accent[1], colors.accent[2]);
      orbMat.alpha = 0.7;
      orb.material = orbMat;

      // Animate orb + character movement
      let time = 0;
      scene.registerBeforeRender(() => {
        time += 0.02;
        orb.position.y = 4 + Math.sin(time) * 0.5;
        orb.rotation.y += 0.01;

        // Character movement (WASD + arrow keys)
        let dx = 0;
        let dz = 0;
        if (keys["w"] || keys["arrowup"]) dz += 1;
        if (keys["s"] || keys["arrowdown"]) dz -= 1;
        if (keys["a"] || keys["arrowleft"]) dx -= 1;
        if (keys["d"] || keys["arrowright"]) dx += 1;

        if (dx !== 0 || dz !== 0) {
          // Move relative to camera angle
          const cameraAngle = camera.alpha + Math.PI / 2;
          const moveX = (dx * Math.cos(cameraAngle) - dz * Math.sin(cameraAngle)) * MOVE_SPEED;
          const moveZ = (dx * Math.sin(cameraAngle) + dz * Math.cos(cameraAngle)) * MOVE_SPEED;

          body.position.x = Math.max(-GROUND_LIMIT, Math.min(GROUND_LIMIT, body.position.x + moveX));
          body.position.z = Math.max(-GROUND_LIMIT, Math.min(GROUND_LIMIT, body.position.z + moveZ));

          // Rotate character to face movement direction
          body.rotation.y = Math.atan2(moveX, moveZ);
        }

        // Camera follows character
        camera.target.x = body.position.x;
        camera.target.z = body.position.z;

        // Orb follows character
        orb.position.x = body.position.x;
        orb.position.z = body.position.z;
      });

      // Render loop
      engine.runRenderLoop(() => {
        scene.render();
      });

      // Resize handler
      const handleResize = () => engine.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        engine.dispose();
      };
    }

    initScene();

    return () => {
      mounted = false;
      engineRef.current?.dispose();
    };
  }, [gameState?.currentAge, gameState?.stats.money, gameState?.stats.happiness, gameState?.stats.health]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full touch-none outline-none ${className ?? ""}`}
    />
  );
}
