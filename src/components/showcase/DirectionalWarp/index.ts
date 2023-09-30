import * as THREE from "three";

const vertexShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;

        void main() {
            vUv = uv;
            vNormal = normal;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
        }
    `;
const fragmentShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform vec2 scale;
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        
        void main() {
            float progress = abs(sin(time * 0.5));
            vec2 UV = vUv;
            UV = (UV - 0.5) / scale + 0.5;
            float p = progress;
            p = smoothstep(0.0, 1.0, (p * 2.0 + UV.x - 1.0));
            vec2 a = (UV - 0.5) * (1.0 - p) + 0.5;
            vec2 b = (UV - 0.5) * p + 0.5;
            vec4 textureA = texture2D(texture1, a);
            vec4 textureB = texture2D(texture2, b);
            vec4 finalColor = mix(textureA, textureB, p);
            gl_FragColor = finalColor;
        }
    `;

function main() {
  // Basic
  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -10, 10);
  camera.position.z = 1;

  const canvas = document.querySelector("canvas");
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas,
  });
  renderer.setPixelRatio(devicePixelRatio);

  // Main
  const [ryoiki, yuji] = ["/images/ryoiki.jpeg", "/images/yuji.jpeg"].map(
    (url) => new THREE.TextureLoader().load(url)
  );
  // Resource size
  const imageAspect = 841 / 467;

  const geometry = new THREE.PlaneGeometry(1, 1);
  // GLSL

  const uniforms = {
    time: { value: 0.0 },
    scale: { value: new THREE.Vector2(1, 1) },
    texture1: { value: ryoiki },
    texture2: { value: yuji },
  };

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    side: THREE.DoubleSide,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(0, 0, 0);
  scene.add(plane);

  // Run Animation
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    uniforms.time.value += delta;
    renderer.render(scene, camera);
  }
  onWindowResize();
  animate();

  // Events
  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    const container = document.querySelector(".canvas-container");
    const canvas = document.querySelector("canvas");

    if (container && canvas) {
      const rect = container.getBoundingClientRect();

      const width = rect.width;
      const height = rect.height;
      // Set renderer
      renderer.setSize(width, height);
      // Set scale
      const viewportAspect = width / height;
      if (imageAspect > viewportAspect) {
        material.uniforms.scale.value.set(imageAspect / viewportAspect, 1);
      } else {
        material.uniforms.scale.value.set(1, viewportAspect / imageAspect);
      }
      // End
    }
  }
}

main();