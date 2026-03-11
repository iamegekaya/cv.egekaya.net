"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type LightPillarProps = {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  className?: string;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
  pillarRotation?: number;
  quality?: "low" | "medium" | "high";
};

const QUALITY_SETTINGS = {
  low: {
    iterations: 24,
    waveIterations: 1,
    pixelRatio: 0.75,
    precision: "mediump" as const,
    stepMultiplier: 1.5,
    targetFPS: 30,
  },
  medium: {
    iterations: 40,
    waveIterations: 2,
    pixelRatio: 1,
    precision: "mediump" as const,
    stepMultiplier: 1.2,
    targetFPS: 60,
  },
  high: {
    iterations: 80,
    waveIterations: 4,
    pixelRatio: 2,
    precision: "highp" as const,
    stepMultiplier: 1.0,
    targetFPS: 60,
  },
};

function toRgba(hexColor: string, alpha: number) {
  const color = new THREE.Color(hexColor);
  const red = Math.round(color.r * 255);
  const green = Math.round(color.g * 255);
  const blue = Math.round(color.b * 255);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export default function LightPillar({
  topColor = "#027333",
  bottomColor = "#03318C",
  intensity = 1,
  rotationSpeed = 0.5,
  interactive = false,
  className = "",
  glowAmount = 0.01,
  pillarWidth = 4,
  pillarHeight = 0.7,
  noiseIntensity = 0,
  mixBlendMode = "screen",
  pillarRotation = 200,
  quality = "high",
}: LightPillarProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const timeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const supportCanvas = document.createElement("canvas");
    const gl =
      supportCanvas.getContext("webgl") ??
      supportCanvas.getContext("experimental-webgl");

    if (!gl) {
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    const hardwareConcurrency = navigator.hardwareConcurrency ?? 4;
    const isLowEndDevice = hardwareConcurrency <= 4;

    let effectiveQuality = quality;
    if (isLowEndDevice && quality === "high") {
      effectiveQuality = "medium";
    }

    const settings = QUALITY_SETTINGS[effectiveQuality];

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: effectiveQuality === "low" ? "low-power" : "high-performance",
        precision: settings.precision,
        stencil: false,
        depth: false,
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.pixelRatio));

    container.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const parseColor = (value: string) => {
      const color = new THREE.Color(value);
      return new THREE.Vector3(color.r, color.g, color.b);
    };

    const waveAngle = 0.4;
    const waveSinValues = new Float32Array(4);
    const waveCosValues = new Float32Array(4);
    for (let index = 0; index < 4; index += 1) {
      waveSinValues[index] = Math.sin(waveAngle);
      waveCosValues[index] = Math.cos(waveAngle);
    }

    const pillarRotationInRadians = (pillarRotation * Math.PI) / 180;

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        uniform vec3 uTopColor;
        uniform vec3 uBottomColor;
        uniform float uIntensity;
        uniform bool uInteractive;
        uniform float uGlowAmount;
        uniform float uPillarWidth;
        uniform float uPillarHeight;
        uniform float uNoiseIntensity;
        uniform float uRotCos;
        uniform float uRotSin;
        uniform float uPillarRotCos;
        uniform float uPillarRotSin;
        uniform float uWaveSin[4];
        uniform float uWaveCos[4];
        varying vec2 vUv;

        const float PI = 3.141592653589793;
        const float EPSILON = 0.001;
        const float E = 2.71828182845904523536;

        float noise(vec2 coord) {
          vec2 r = (E * sin(E * coord));
          return fract(r.x * r.y * (1.0 + coord.x));
        }

        void main() {
          vec2 fragCoord = vUv * uResolution;
          vec2 uv = (fragCoord * 2.0 - uResolution) / uResolution.y;

          uv = vec2(
            uv.x * uPillarRotCos - uv.y * uPillarRotSin,
            uv.x * uPillarRotSin + uv.y * uPillarRotCos
          );

          vec3 origin = vec3(0.0, 0.0, -10.0);
          vec3 direction = normalize(vec3(uv, 1.0));

          float maxDepth = 50.0;
          float depth = 0.1;

          float rotCos = uRotCos;
          float rotSin = uRotSin;
          if (uInteractive && length(uMouse) > 0.0) {
            float mouseAngle = uMouse.x * PI * 2.0;
            rotCos = cos(mouseAngle);
            rotSin = sin(mouseAngle);
          }

          vec3 color = vec3(0.0);

          const int ITERATIONS = ${settings.iterations};
          const int WAVE_ITERATIONS = ${settings.waveIterations};
          const float STEP_MULT = ${settings.stepMultiplier.toFixed(1)};

          for (int i = 0; i < ITERATIONS; i++) {
            vec3 pos = origin + direction * depth;

            float newX = pos.x * rotCos - pos.z * rotSin;
            float newZ = pos.x * rotSin + pos.z * rotCos;
            pos.x = newX;
            pos.z = newZ;

            vec3 deformed = pos;
            deformed.y *= uPillarHeight;
            deformed = deformed + vec3(0.0, uTime, 0.0);

            float frequency = 1.0;
            float amplitude = 1.0;
            for (int j = 0; j < WAVE_ITERATIONS; j++) {
              float wx = deformed.x * uWaveCos[j] - deformed.z * uWaveSin[j];
              float wz = deformed.x * uWaveSin[j] + deformed.z * uWaveCos[j];
              deformed.x = wx;
              deformed.z = wz;

              float phase = uTime * float(j) * 2.0;
              vec3 oscillation = cos(deformed.zxy * frequency - phase);
              deformed += oscillation * amplitude;
              frequency *= 2.0;
              amplitude *= 0.5;
            }

            vec2 cosinePair = cos(deformed.xz);
            float fieldDistance = length(cosinePair) - 0.2;

            float radialBound = length(pos.xz) - uPillarWidth;
            float k = 4.0;
            float h = max(k - abs(-radialBound - (-fieldDistance)), 0.0);
            fieldDistance = -(min(-radialBound, -fieldDistance) - h * h * 0.25 / k);
            fieldDistance = abs(fieldDistance) * 0.15 + 0.01;

            vec3 gradient = mix(uBottomColor, uTopColor, smoothstep(15.0, -15.0, pos.y));
            color += gradient / fieldDistance;

            if (fieldDistance < EPSILON || depth > maxDepth) break;
            depth += fieldDistance * STEP_MULT;
          }

          float widthNormalization = uPillarWidth / 3.0;
          color = tanh(color * uGlowAmount / widthNormalization);

          float rnd = noise(gl_FragCoord.xy);
          color -= rnd / 15.0 * uNoiseIntensity;

          gl_FragColor = vec4(color * uIntensity, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: mouseRef.current },
        uTopColor: { value: parseColor(topColor) },
        uBottomColor: { value: parseColor(bottomColor) },
        uIntensity: { value: intensity },
        uInteractive: { value: interactive },
        uGlowAmount: { value: glowAmount },
        uPillarWidth: { value: pillarWidth },
        uPillarHeight: { value: pillarHeight },
        uNoiseIntensity: { value: noiseIntensity },
        uRotCos: { value: 1.0 },
        uRotSin: { value: 0.0 },
        uPillarRotCos: { value: Math.cos(pillarRotationInRadians) },
        uPillarRotSin: { value: Math.sin(pillarRotationInRadians) },
        uWaveSin: { value: waveSinValues },
        uWaveCos: { value: waveCosValues },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    materialRef.current = material;
    geometryRef.current = geometry;

    let mouseMoveTimeout = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive || mouseMoveTimeout !== 0) {
        return;
      }

      mouseMoveTimeout = window.setTimeout(() => {
        mouseMoveTimeout = 0;
      }, 16);

      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      mouseRef.current.set(x, y);
    };

    if (interactive) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    let lastTime = performance.now();
    const frameTime = 1000 / settings.targetFPS;

    const animate = (currentTime: number) => {
      if (!rendererRef.current || !materialRef.current || !sceneRef.current || !cameraRef.current) {
        return;
      }

      const deltaTime = currentTime - lastTime;
      if (deltaTime >= frameTime) {
        timeRef.current += 0.016 * rotationSpeed;
        materialRef.current.uniforms.uTime.value = timeRef.current;

        const rotationAngle = timeRef.current * 0.3;
        materialRef.current.uniforms.uRotCos.value = Math.cos(rotationAngle);
        materialRef.current.uniforms.uRotSin.value = Math.sin(rotationAngle);

        rendererRef.current.render(sceneRef.current, cameraRef.current);
        lastTime = currentTime - (deltaTime % frameTime);
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);

    let resizeTimeout = 0;

    const handleResize = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (!rendererRef.current || !materialRef.current || !containerRef.current) {
          return;
        }

        const nextWidth = containerRef.current.clientWidth;
        const nextHeight = containerRef.current.clientHeight;

        rendererRef.current.setSize(nextWidth, nextHeight);
        materialRef.current.uniforms.uResolution.value.set(nextWidth, nextHeight);
      }, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        container.removeEventListener("mousemove", handleMouseMove);
      }

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      window.clearTimeout(mouseMoveTimeout);
      window.clearTimeout(resizeTimeout);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }

      materialRef.current?.dispose();
      geometryRef.current?.dispose();

      rendererRef.current = null;
      materialRef.current = null;
      geometryRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      rafRef.current = null;
    };
  }, [
    topColor,
    bottomColor,
    intensity,
    rotationSpeed,
    interactive,
    glowAmount,
    pillarWidth,
    pillarHeight,
    noiseIntensity,
    mixBlendMode,
    pillarRotation,
    quality,
  ]);

  const fallbackGlowStyle = {
    background: [
      `radial-gradient(34% 48% at 50% 18%, ${toRgba(topColor, 0.2)} 0%, transparent 72%)`,
      `radial-gradient(36% 52% at 50% 82%, ${toRgba(bottomColor, 0.2)} 0%, transparent 74%)`,
      `linear-gradient(${pillarRotation}deg, ${toRgba(topColor, 0.12)} 0%, transparent 38%, transparent 62%, ${toRgba(bottomColor, 0.12)} 100%)`,
    ].join(", "),
  } satisfies React.CSSProperties;

  const fallbackPillarStyle = {
    background: `linear-gradient(${pillarRotation}deg, ${toRgba(topColor, 0.16)} 0%, ${toRgba(topColor, 0.06)} 35%, ${toRgba(bottomColor, 0.06)} 65%, ${toRgba(bottomColor, 0.16)} 100%)`,
    mixBlendMode,
  } satisfies React.CSSProperties;

  return (
    <div className={`relative h-full w-full overflow-hidden bg-black ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 opacity-90" style={fallbackGlowStyle} />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[150%] w-[clamp(18rem,36vmax,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={fallbackPillarStyle}
      />
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        style={{ mixBlendMode }}
      />
    </div>
  );
}
