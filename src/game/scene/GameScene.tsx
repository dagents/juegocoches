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
let Animation: typeof import("@babylonjs/core").Animation;

interface GameSceneProps {
  gameState: GameState | null;
  className?: string;
}

// Determine continent region from country code for building styles
function getRegion(countryCode: string): "european" | "asian" | "american" | "default" {
  const european = ["ES", "FR", "DE", "IT", "GB", "PT", "NL", "BE", "CH", "AT", "PL", "SE", "NO", "DK", "FI", "IE", "GR", "RO", "CZ", "HU", "AD"];
  const asian = ["JP", "CN", "KR", "IN", "TH", "VN", "PH", "ID", "MY", "SG", "TW", "HK"];
  const american = ["US", "CA", "MX", "BR", "AR", "CO", "CL", "PE", "VE"];
  if (european.includes(countryCode)) return "european";
  if (asian.includes(countryCode)) return "asian";
  if (american.includes(countryCode)) return "american";
  return "default";
}

// Get environment colors based on game context
function getSceneColors(state: GameState | null) {
  if (!state) {
    return {
      sky: [0.02, 0.02, 0.06] as [number, number, number],
      ground: [0.1, 0.1, 0.15] as [number, number, number],
      accent: [0.5, 0.2, 0.8] as [number, number, number],
      ambient: [0.3, 0.3, 0.4] as [number, number, number],
    };
  }

  const happiness = state.stats.happiness / 100;
  const wealth = state.stats.money / 100;
  const health = state.stats.health / 100;

  // Night/day cycle: winter months darker, summer brighter
  const month = state.currentMonth;
  const seasonBrightness = 1 - 0.3 * Math.abs(month - 6.5) / 5.5; // peaks in June/July

  return {
    sky: [
      (0.02 + happiness * 0.05) * seasonBrightness,
      (0.02 + health * 0.03) * seasonBrightness,
      (0.06 + wealth * 0.04) * seasonBrightness,
    ] as [number, number, number],
    ground: [0.08 + wealth * 0.1, 0.08 + happiness * 0.08, 0.12 + health * 0.05] as [number, number, number],
    accent: [0.4 + happiness * 0.4, 0.1 + health * 0.3, 0.7 + wealth * 0.2] as [number, number, number],
    ambient: [
      (0.2 + happiness * 0.2) * seasonBrightness,
      (0.2 + health * 0.15) * seasonBrightness,
      (0.25 + wealth * 0.15) * seasonBrightness,
    ] as [number, number, number],
  };
}

// Get scene complexity based on age/wealth
function getSceneElements(state: GameState | null) {
  if (!state) return { buildings: 0, trees: 0, particles: false };
  const wealth = state.stats.money / 100;
  return {
    buildings: Math.floor(1 + wealth * 8),
    trees: Math.floor(2 + (1 - wealth) * 5),
    particles: state.stats.happiness > 60,
  };
}

// Character visual config based on age
function getCharacterConfig(age: number, health: number) {
  if (age <= 12) {
    // Child: small, bright
    return { height: 0.8, radius: 0.2, color: [0.9, 0.6, 0.2], headScale: 0.4, bobSpeed: 3, bobHeight: 0.06 };
  } else if (age <= 17) {
    // Teen: medium, electric
    return { height: 1.2, radius: 0.25, color: [0.3, 0.5, 0.9], headScale: 0.45, bobSpeed: 2.5, bobHeight: 0.05 };
  } else if (age <= 55) {
    // Adult: full size, color based on health
    const h = health / 100;
    return { height: 1.5, radius: 0.3, color: [0.3 + (1 - h) * 0.5, 0.2 + h * 0.5, 0.3], headScale: 0.5, bobSpeed: 2, bobHeight: 0.04 };
  } else {
    // Elderly: slightly shorter, gray tint, slower
    return { height: 1.3, radius: 0.28, color: [0.55, 0.55, 0.6], headScale: 0.48, bobSpeed: 1.2, bobHeight: 0.025 };
  }
}

export default function GameScene({ gameState, className }: GameSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<InstanceType<typeof import("@babylonjs/core").Engine> | null>(null);

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
      Animation = BABYLON.Animation;

      if (!mounted) return;

      const engine = new Engine(canvasRef.current, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        antialias: true,
      });
      engineRef.current = engine;

      const scene = new Scene(engine);

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

      // Season brightness for light intensity
      const month = gameState?.currentMonth ?? 6;
      const seasonBrightness = 1 - 0.3 * Math.abs(month - 6.5) / 5.5;

      // Ambient light
      const ambientLight = new HemisphericLight("ambient", new Vector3(0, 1, 0), scene);
      ambientLight.intensity = 0.4 + 0.3 * seasonBrightness;
      ambientLight.diffuse = new Color3(colors.ambient[0], colors.ambient[1], colors.ambient[2]);

      // Sun light — position changes with season
      const sunLight = new PointLight("sun", new Vector3(5, 8 + seasonBrightness * 4, -5), scene);
      sunLight.intensity = 0.5 + 0.5 * seasonBrightness;
      sunLight.diffuse = new Color3(1, 0.9 + seasonBrightness * 0.05, 0.7 + seasonBrightness * 0.15);

      // Glow layer
      const glow = new GlowLayer("glow", scene);
      glow.intensity = 0.4;

      // Ground plane
      const ground = MeshBuilder.CreateGround("ground", { width: 30, height: 30 }, scene);
      const groundMat = new StandardMaterial("groundMat", scene);
      groundMat.diffuseColor = new Color3(colors.ground[0], colors.ground[1], colors.ground[2]);
      groundMat.specularColor = new Color3(0.05, 0.05, 0.05);
      ground.material = groundMat;

      // --- Character with age-based visuals ---
      const age = gameState?.currentAge ?? 25;
      const health = gameState?.stats.health ?? 50;
      const charCfg = getCharacterConfig(age, health);

      const body = MeshBuilder.CreateCapsule("body", { height: charCfg.height, radius: charCfg.radius }, scene);
      body.position.y = charCfg.height / 2 + 0.1;
      const bodyMat = new StandardMaterial("bodyMat", scene);
      bodyMat.diffuseColor = new Color3(charCfg.color[0], charCfg.color[1], charCfg.color[2]);
      bodyMat.emissiveColor = new Color3(charCfg.color[0] * 0.2, charCfg.color[1] * 0.2, charCfg.color[2] * 0.2);
      body.material = bodyMat;

      // Head
      const head = MeshBuilder.CreateSphere("head", { diameter: charCfg.headScale }, scene);
      head.parent = body;
      head.position.y = charCfg.height / 2 + charCfg.headScale * 0.4;
      const headMat = new StandardMaterial("headMat", scene);
      headMat.diffuseColor = age > 55
        ? new Color3(0.75, 0.7, 0.7) // gray tint for elderly
        : new Color3(0.9, 0.75, 0.65);
      head.material = headMat;

      // Walking bob animation using Babylon.js Animation system
      const bobAnim = new Animation("bobAnim", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
      const baseY = body.position.y;
      const fps = 30;
      const frameDuration = Math.round(fps / charCfg.bobSpeed);
      bobAnim.setKeys([
        { frame: 0, value: baseY },
        { frame: frameDuration, value: baseY + charCfg.bobHeight },
        { frame: frameDuration * 2, value: baseY },
      ]);
      body.animations = [bobAnim];
      scene.beginAnimation(body, 0, frameDuration * 2, true);

      // Keyboard input tracking
      const keys: Record<string, boolean> = {};
      const onKeyDown = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true; };
      const onKeyUp = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      const MOVE_SPEED = 0.08;
      const GROUND_LIMIT = 14;

      // --- Buildings with regional style ---
      const elements = getSceneElements(gameState);
      const region = getRegion(gameState?.countryCode ?? "");

      for (let i = 0; i < elements.buildings; i++) {
        const angle = (i / elements.buildings) * Math.PI * 2;
        const dist = 5 + Math.random() * 8;
        const px = Math.cos(angle) * dist;
        const pz = Math.sin(angle) * dist;

        if (region === "european") {
          // European stone: wide, shorter, warm tones
          const h = 1.5 + Math.random() * 2;
          const w = 1.2 + Math.random() * 1;
          const building = MeshBuilder.CreateBox(`building${i}`, { width: w, height: h, depth: w * 0.8 }, scene);
          building.position.set(px, h / 2, pz);
          const mat = new StandardMaterial(`bmat${i}`, scene);
          mat.diffuseColor = new Color3(0.25 + Math.random() * 0.1, 0.2 + Math.random() * 0.05, 0.15);
          building.material = mat;
          // Roof: triangular prism approximated by a flattened box rotated
          const roof = MeshBuilder.CreateBox(`roof${i}`, { width: w * 1.1, height: 0.5, depth: w * 0.9 }, scene);
          roof.position.set(px, h + 0.25, pz);
          roof.rotation.x = 0;
          const roofMat = new StandardMaterial(`rmat${i}`, scene);
          roofMat.diffuseColor = new Color3(0.5, 0.15, 0.1);
          roof.material = roofMat;
        } else if (region === "asian") {
          // Asian pagoda-style: tall narrow base, tiered roofs
          const tiers = 2 + Math.floor(Math.random() * 2);
          for (let t = 0; t < tiers; t++) {
            const tierW = 1.5 - t * 0.3;
            const tierH = 1.2;
            const tier = MeshBuilder.CreateBox(`building${i}_t${t}`, { width: tierW, height: tierH, depth: tierW }, scene);
            tier.position.set(px, tierH / 2 + t * tierH, pz);
            const mat = new StandardMaterial(`bmat${i}_t${t}`, scene);
            mat.diffuseColor = new Color3(0.15, 0.12 + t * 0.03, 0.1);
            tier.material = mat;
            // Overhang roof
            const overhang = MeshBuilder.CreateBox(`ovh${i}_t${t}`, { width: tierW * 1.4, height: 0.1, depth: tierW * 1.4 }, scene);
            overhang.position.set(px, (t + 1) * tierH, pz);
            const oMat = new StandardMaterial(`omat${i}_t${t}`, scene);
            oMat.diffuseColor = new Color3(0.6, 0.2, 0.15);
            overhang.material = oMat;
          }
        } else if (region === "american") {
          // American skyscrapers: very tall, narrow
          const h = 3 + Math.random() * 5;
          const w = 0.8 + Math.random() * 0.6;
          const building = MeshBuilder.CreateBox(`building${i}`, { width: w, height: h, depth: w }, scene);
          building.position.set(px, h / 2, pz);
          const mat = new StandardMaterial(`bmat${i}`, scene);
          const b = 0.12 + Math.random() * 0.1;
          mat.diffuseColor = new Color3(b, b, b + 0.05);
          mat.specularColor = new Color3(0.2, 0.2, 0.2);
          building.material = mat;
          // Window rows
          for (let wy = 1; wy < h - 0.5; wy += 1) {
            if (Math.random() > 0.4) {
              const win = MeshBuilder.CreatePlane(`win${i}_${wy}`, { width: w * 0.6, height: 0.3 }, scene);
              win.position.set(px + w / 2 + 0.01, wy, pz);
              const wMat = new StandardMaterial(`wmat${i}_${wy}`, scene);
              wMat.emissiveColor = new Color3(0.8, 0.7, 0.3);
              win.material = wMat;
            }
          }
        } else {
          // Default generic buildings
          const h = 1 + Math.random() * 4;
          const w = 0.8 + Math.random() * 1.2;
          const building = MeshBuilder.CreateBox(`building${i}`, { width: w, height: h, depth: w }, scene);
          building.position.set(px, h / 2, pz);
          const mat = new StandardMaterial(`bmat${i}`, scene);
          const brightness = 0.1 + Math.random() * 0.15;
          mat.diffuseColor = new Color3(brightness, brightness, brightness + 0.05);
          mat.emissiveColor = new Color3(colors.accent[0] * 0.05, colors.accent[1] * 0.05, colors.accent[2] * 0.1);
          building.material = mat;
          // Window light
          if (Math.random() > 0.5) {
            const windowLight = MeshBuilder.CreatePlane(`window${i}`, { size: 0.3 }, scene);
            windowLight.position.set(px + w / 2 + 0.01, h * 0.6, pz);
            const windowMat = new StandardMaterial(`windowMat${i}`, scene);
            windowMat.emissiveColor = new Color3(1, 0.9, 0.5);
            windowLight.material = windowMat;
          }
        }
      }

      // Trees
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

      // --- Luxury car when wealth is high ---
      const wealth = gameState?.stats.money ?? 0;
      if (wealth >= 70) {
        // Simple car: box body + 4 cylinder wheels
        const carBody = MeshBuilder.CreateBox("carBody", { width: 1.8, height: 0.5, depth: 0.9 }, scene);
        carBody.position.set(2.5, 0.4, 1.5);
        const carMat = new StandardMaterial("carMat", scene);
        carMat.diffuseColor = wealth >= 90
          ? new Color3(0.8, 0.1, 0.1)  // red supercar
          : new Color3(0.15, 0.15, 0.15); // black luxury
        carMat.specularColor = new Color3(0.4, 0.4, 0.4);
        carBody.material = carMat;

        // Cabin top
        const carTop = MeshBuilder.CreateBox("carTop", { width: 1, height: 0.35, depth: 0.8 }, scene);
        carTop.position.set(2.5, 0.72, 1.5);
        const topMat = new StandardMaterial("carTopMat", scene);
        topMat.diffuseColor = new Color3(0.2, 0.25, 0.35);
        topMat.alpha = 0.7;
        carTop.material = topMat;

        // Wheels
        const wheelPositions = [[-0.6, -0.4], [-0.6, 0.4], [0.6, -0.4], [0.6, 0.4]];
        wheelPositions.forEach(([dx, dz], wi) => {
          const wheel = MeshBuilder.CreateCylinder(`wheel${wi}`, { height: 0.1, diameter: 0.3 }, scene);
          wheel.rotation.x = Math.PI / 2;
          wheel.position.set(2.5 + dx, 0.15, 1.5 + dz);
          const wMat = new StandardMaterial(`wheelMat${wi}`, scene);
          wMat.diffuseColor = new Color3(0.05, 0.05, 0.05);
          wheel.material = wMat;
        });
      }

      // --- Weather effects: rain or sunshine particles ---
      const happiness = gameState?.stats.happiness ?? 50;

      if (happiness < 30) {
        // Rain particle system
        const rain = new ParticleSystem("rain", 500, scene);
        rain.createPointEmitter(new Vector3(-10, 0, -10), new Vector3(10, 0, 10));
        rain.emitter = new Vector3(0, 12, 0);
        rain.minSize = 0.02;
        rain.maxSize = 0.04;
        rain.minLifeTime = 0.5;
        rain.maxLifeTime = 1.0;
        rain.emitRate = 300;
        rain.direction1 = new Vector3(-0.2, -1, -0.2);
        rain.direction2 = new Vector3(0.2, -1, 0.2);
        rain.minEmitPower = 8;
        rain.maxEmitPower = 12;
        rain.gravity = new Vector3(0, -9.8, 0);
        rain.color1 = new Color4(0.5, 0.6, 0.8, 0.6);
        rain.color2 = new Color4(0.3, 0.4, 0.7, 0.3);
        rain.colorDead = new Color4(0.2, 0.3, 0.5, 0);
        // Use a procedural texture — small white circle
        rain.isLocal = false;
        rain.start();
      } else if (happiness > 70) {
        // Sunshine glow: golden sparkle particles
        const sun = new ParticleSystem("sunshine", 100, scene);
        sun.createPointEmitter(new Vector3(-5, 0, -5), new Vector3(5, 0, 5));
        sun.emitter = new Vector3(0, 10, 0);
        sun.minSize = 0.05;
        sun.maxSize = 0.15;
        sun.minLifeTime = 1;
        sun.maxLifeTime = 2.5;
        sun.emitRate = 30;
        sun.direction1 = new Vector3(-1, -0.5, -1);
        sun.direction2 = new Vector3(1, -0.5, 1);
        sun.minEmitPower = 1;
        sun.maxEmitPower = 3;
        sun.gravity = new Vector3(0, -0.5, 0);
        sun.color1 = new Color4(1, 0.9, 0.4, 0.8);
        sun.color2 = new Color4(1, 0.8, 0.2, 0.4);
        sun.colorDead = new Color4(1, 0.7, 0, 0);
        sun.start();
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
          const cameraAngle = camera.alpha + Math.PI / 2;
          const moveX = (dx * Math.cos(cameraAngle) - dz * Math.sin(cameraAngle)) * MOVE_SPEED;
          const moveZ = (dx * Math.sin(cameraAngle) + dz * Math.cos(cameraAngle)) * MOVE_SPEED;

          body.position.x = Math.max(-GROUND_LIMIT, Math.min(GROUND_LIMIT, body.position.x + moveX));
          body.position.z = Math.max(-GROUND_LIMIT, Math.min(GROUND_LIMIT, body.position.z + moveZ));

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
  }, [gameState?.currentAge, gameState?.currentMonth, gameState?.stats.money, gameState?.stats.happiness, gameState?.stats.health, gameState?.countryCode]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full touch-none outline-none ${className ?? ""}`}
    />
  );
}
