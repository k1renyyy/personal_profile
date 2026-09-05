"use client";

import { useEffect, useRef } from "react";

// Adapted from Olaf's MIT-licensed Silk Shader:
// https://21st.dev/@olaf.stolle/components/silk-shader
const VERTEX_SHADER = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_colors[4];

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 palette(float x) {
  float f = clamp(x, 0.0, 1.0) * 3.0;
  vec3 color = u_colors[0];
  color = mix(color, u_colors[1], smoothstep(0.0, 1.0, clamp(f, 0.0, 1.0)));
  color = mix(color, u_colors[2], smoothstep(0.0, 1.0, clamp(f - 1.0, 0.0, 1.0)));
  color = mix(color, u_colors[3], smoothstep(0.72, 1.0, clamp(f - 2.0, 0.0, 1.0)));
  return color;
}

vec3 shade(vec2 p, float time) {
  vec2 q = p * 1.6;
  float amplitude = 0.5475;

  for (float i = 1.0; i < 5.0; i += 1.0) {
    q.x += amplitude / i * cos(i * 2.4 * q.y + time * 0.8 + 1928.0);
    q.y += amplitude / i * cos(i * 1.7 * q.x + time * 0.6);
  }

  return palette(0.5 + 0.5 * sin(q.x + q.y));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  vec3 color = shade(p * 1.26, u_time);
  color = (color - 0.5) * 1.22 + 0.5;
  color += (grainHash(gl_FragCoord.xy) - 0.5) * 0.032;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

const DARK_COLORS = new Float32Array([
  0.0, 0.0, 0.0,
  0.102, 0.22, 0.439,
  0.184, 0.337, 0.482,
  0.58, 0.62, 0.62,
]);

const LIGHT_COLORS = new Float32Array([
  0.98, 0.985, 1.0,
  0.82, 0.89, 1.0,
  0.31, 0.58, 0.91,
  0.06, 0.1, 0.18,
]);

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;

  gl.deleteShader(shader);
  return null;
}

export function SilkBackground(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!canvas || !gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertexShader || !fragmentShader || !program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const colors = gl.getUniformLocation(program, "u_colors");
    const syncColors = () => {
      gl.uniform3fv(
        colors,
        document.documentElement.classList.contains("dark") ? DARK_COLORS : LIGHT_COLORS,
      );
    };
    syncColors();

    let frame = 0;
    let visible = document.visibilityState === "visible";
    let inView = true;
    const startedAt = performance.now();

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(bounds.width * dpr));
      const height = Math.max(1, Math.round(bounds.height * dpr));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    const draw = (now: number) => {
      frame = 0;
      if (!visible || !inView) return;
      resize();
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, ((now - startedAt) / 1000) * 0.42);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!frame && visible && inView) frame = requestAnimationFrame(draw);
    };
    const onVisibilityChange = () => {
      visible = document.visibilityState === "visible";
      if (visible) start();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    const resizeObserver = new ResizeObserver(start);
    const themeObserver = new MutationObserver(() => {
      syncColors();
      start();
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView) start();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    resizeObserver.observe(canvas);
    themeObserver.observe(document.documentElement, { attributeFilter: ["class"] });
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}
