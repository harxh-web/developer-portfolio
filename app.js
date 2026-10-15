// Harsh's Developer World: 3D Playground Portfolio
// Pure JavaScript + WebGL/Canvas 3D Engine + Web Audio Synthesizer

(function () {
  'use strict';

  // --- 1. AUDIO SYNTHESIZER (Web Audio API) ---
  let audioCtx = null;
  let isMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(fn) {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;
    try {
      fn(audioCtx, audioCtx.currentTime);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  const AudioFX = {
    click: () => {
      playSound((ctx, t) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.07);
      });
    },

    coinToss: () => {
      playSound((ctx, t) => {
        // Whoosh
        const whoosh = ctx.createOscillator();
        const wGain = ctx.createGain();
        whoosh.type = 'sine';
        whoosh.frequency.setValueAtTime(240, t);
        whoosh.frequency.exponentialRampToValueAtTime(800, t + 0.35);
        wGain.gain.setValueAtTime(0.01, t);
        wGain.gain.linearRampToValueAtTime(0.25, t + 0.15);
        wGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        whoosh.connect(wGain);
        wGain.connect(ctx.destination);
        whoosh.start(t);
        whoosh.stop(t + 0.45);

        // Flutter spinning ticks
        for (let i = 0; i < 8; i++) {
          const spin = ctx.createOscillator();
          const sGain = ctx.createGain();
          const tickTime = t + 0.08 + i * 0.055;
          spin.type = 'triangle';
          spin.frequency.setValueAtTime(1400 + Math.random() * 500, tickTime);
          sGain.gain.setValueAtTime(0.07, tickTime);
          sGain.gain.exponentialRampToValueAtTime(0.001, tickTime + 0.04);
          spin.connect(sGain);
          sGain.connect(ctx.destination);
          spin.start(tickTime);
          spin.stop(tickTime + 0.05);
        }
      });
    },

    coinLand: (isHeads) => {
      playSound((ctx, t) => {
        // Metallic chime
        const bell = ctx.createOscillator();
        const bGain = ctx.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(isHeads ? 1760 : 1250, t);
        bGain.gain.setValueAtTime(0.3, t);
        bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        bell.connect(bGain);
        bGain.connect(ctx.destination);
        bell.start(t);
        bell.stop(t + 0.5);

        // Grass thud
        const thud = ctx.createOscillator();
        const tGain = ctx.createGain();
        thud.type = 'sine';
        thud.frequency.setValueAtTime(120, t);
        thud.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        tGain.gain.setValueAtTime(0.25, t);
        tGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        thud.connect(tGain);
        tGain.connect(ctx.destination);
        thud.start(t);
        thud.stop(t + 0.18);
      });
    },

    streak: (count) => {
      playSound((ctx, t) => {
        const notes = count === 1 ? [523.25, 659.25] : [523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = t + 0.08 + i * 0.12;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          gain.gain.setValueAtTime(0.2, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.4);
        });
      });
    },

    fail: () => {
      playSound((ctx, t) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(340, t + 0.05);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.3);
        gain.gain.setValueAtTime(0.18, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + 0.05);
        osc.stop(t + 0.4);
      });
    },

    fanfare: () => {
      playSound((ctx, t) => {
        const notes = [
          { f: 523.25, time: 0 },
          { f: 659.25, time: 0.12 },
          { f: 783.99, time: 0.24 },
          { f: 1046.50, time: 0.38 }
        ];
        notes.forEach(({ f, time }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = t + time;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, start);
          gain.gain.setValueAtTime(0.22, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.5);
        });

        // Grand chord
        const chord = [523.25, 659.25, 783.99, 1046.50];
        chord.forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = t + 0.55;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, start);
          gain.gain.setValueAtTime(0.15, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 1.3);
        });
      });
    }
  };

  // --- 2. GAME STATE MANAGEMENT ---
  const GameState = {
    consecutiveHeads: 0,
    targetHeads: 3,
    isFlipping: false,
    isUnlocked: false,
    totalFlips: 0,
    headsCount: 0,
    tailsCount: 0,
    history: [],
    timeOfDay: 'day' // 'day', 'sunset', 'dusk'
  };

  // --- 3. PORTFOLIO & PROJECTS DATA ---
  const PORTFOLIO_DATA = {
    name: 'Harshvardhansingh Thakur',
    title: 'AI / ML Engineer & Creative Full-Stack Developer',
    institution: 'Faculty of Engineering & Technology (2nd-Year CSE)',
    bio: 'Passionate 2nd-year Computer Science Engineering student obsessed with autonomous agentic architectures, reinforcement learning simulations, and interactive 3D WebGL experiences.',
    email: 'harshvardhan.dev@gmail.com',
    stats: [
      { label: 'Projects Built', value: '12+' },
      { label: 'Agentic Tools', value: '8' },
      { label: 'Technologies', value: '20+' },
      { label: 'Academic Standing', value: 'Top 5%' }
    ],
    projects: [
      {
        id: 'agentforge-os',
        title: 'AgentForge OS',
        tagline: 'Autonomous multi-agent orchestration framework for automated codebase refactoring',
        category: 'AI/Agents',
        featured: true,
        desc: 'An experimental multi-agent runtime where specialized LLM agents (Architect, Coder, Reviewer, and Test Generator) collaborate in real-time to diagnose issues, write unit tests, and fix bugs autonomously.',
        architecture: [
          'LangGraph-based state machine coordinating asynchronous tool-calling agents',
          'AST-aware code chunking and vector retrieval via ChromaDB for semantic context',
          'Sandboxed execution environment with automatic test loop and rollback mechanisms',
          'Interactive visual dashboard streaming agent reasoning logs in real time'
        ],
        metrics: [
          '94.2% success rate on automated unit test generation',
          'Sub-2 second tool dispatch latency',
          'Strict JSON schema validation eliminates hallucinations'
        ],
        tech: ['Python', 'LangGraph', 'OpenAI API', 'ChromaDB', 'FastAPI', 'Docker', 'React']
      },
      {
        id: 'neurovision-3d',
        title: 'NeuroVision 3D',
        tagline: 'Real-time Neural Radiance Field (NeRF) visualizer & point cloud explorer',
        category: '3D & WebGL',
        featured: true,
        desc: 'An interactive in-browser 3D WebGL renderer for viewing synthesized novel views of complex 3D scenes trained using Instant-NGP and 3D Gaussian Splatting techniques.',
        architecture: [
          'Custom Three.js shader pipeline decoding spherical harmonics in WebGL2',
          'Octree spatial acceleration for smooth 60 FPS camera navigation across 500k+ splats',
          'Progressive Level-of-Detail (LoD) streaming from serverless edge storage',
          'Interactive lighting tweaks and depth-buffer post-processing passes'
        ],
        metrics: [
          '60 FPS steady rendering on standard integrated GPUs',
          '5x faster load time using quantized binary geometry buffers',
          'Over 500k points rendered without frame stutter'
        ],
        tech: ['TypeScript', 'Three.js', 'React Three Fiber', 'GLSL', 'WebGL2', 'Vite']
      },
      {
        id: 'promptcrafter-studio',
        title: 'PromptCrafter Studio',
        tagline: 'Automated prompt optimization and LLM benchmark evaluation platform',
        category: 'AI/Agents',
        featured: true,
        desc: 'A developer playground for systematic prompt engineering, providing automated Few-Shot prompt generation, temperature sweep comparisons, and automated rubric scoring with Claude and GPT-4o.',
        architecture: [
          'Genetic algorithm optimization loop for evolving prompt variants against test sets',
          'Side-by-side token efficiency and latency benchmarking suite',
          'Custom evaluator using G-Eval metric paradigms for objective grading',
          'Export directly to production-ready Python & TypeScript client SDK wrappers'
        ],
        metrics: [
          '38% reduction in token consumption across tested prompts',
          '+22% increase in output formatting consistency',
          'Integrated with 6 major LLM providers'
        ],
        tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Anthropic Claude SDK', 'Supabase', 'Python']
      },
      {
        id: 'rl-playground-sim',
        title: 'Autonomous GameWorld RL',
        tagline: 'Reinforcement learning environment for multi-agent competitive navigation',
        category: 'Systems & ML',
        featured: false,
        desc: 'Custom physics simulations where Deep Q-Network (DQN) and Proximal Policy Optimization (PPO) agents learn goal-seeking, obstacle evasion, and cooperative territorial strategy.',
        architecture: [
          'Custom PyTorch implementation of Proximal Policy Optimization (PPO)',
          'Vectorized environment parallelization using Ray / Gymnasium wrappers',
          'Real-time WebSocket telemetry visualizer rendered via HTML5 Canvas',
          'Checkpoint saving and replay buffer inspection tools'
        ],
        metrics: [
          '10,000 steps/sec simulation speed on local workstation',
          'Converged optimal policy achieved in under 200 epochs',
          'Zero deadlocks in competitive adversarial runs'
        ],
        tech: ['Python', 'PyTorch', 'Gymnasium', 'Ray', 'WebSockets', 'Canvas API']
      },
      {
        id: 'biomed-scan-ai',
        title: 'BioMedScan AI',
        tagline: 'Deep learning diagnostic assistant for pulmonary anomaly detection',
        category: 'Systems & ML',
        featured: false,
        desc: 'A computer vision convolutional network utilizing Attention U-Net architectures for lesion segmentation and classification on high-resolution chest radiographs.',
        architecture: [
          'Attention U-Net backbone with pre-trained ResNet-50 feature extractor',
          'Mixed-precision FP16 training with albumentations data augmentation pipeline',
          'Grad-CAM heatmaps for explainable clinical AI interpretability',
          'DICOM format ingest parser with privacy scrubbing'
        ],
        metrics: [
          '96.4% AUC-ROC score on validation dataset',
          'Explainable saliency map generation in 180ms',
          'Compliant with HIPAA data sanitization benchmarks'
        ],
        tech: ['Python', 'PyTorch', 'Torchvision', 'OpenCV', 'Streamlit', 'NumPy']
      },
      {
        id: 'synthetix-copilot',
        title: 'Synthetix Code Copilot',
        tagline: 'Context-aware AST based developer assistant for proactive code refactoring',
        category: 'AI/Agents',
        featured: false,
        desc: 'A lightweight IDE sidecar that monitors file edits, creates syntax tree diffs, and predicts edge case bugs and typing mismatches before compile time.',
        architecture: [
          'Tree-sitter parser generating incremental AST diffs on keystroke debounce',
          'Local embedding cache for zero-latency symbols and imports resolution',
          'Hybrid model routing: lightweight local model for completions, frontier LLM for deep refactors',
          'VS Code extension protocol integration'
        ],
        metrics: [
          'Less than 50ms local AST parsing overhead',
          'Reduced type errors by 40% during test runs',
          'Zero telemetry leakage for private repos'
        ],
        tech: ['TypeScript', 'Rust', 'Tree-Sitter', 'Node.js', 'LLM API']
      }
    ],
    skills: [
      {
        category: 'AI / ML & Agentic Systems',
        items: [
          { name: 'PyTorch & Neural Networks', level: 90, desc: 'Deep learning, custom loss functions, training loops' },
          { name: 'Agentic Frameworks (LangGraph, AutoGen)', level: 88, desc: 'State graphs, memory buffers, autonomous tool use' },
          { name: 'LLM Orchestration & Prompting', level: 92, desc: 'Few-shot engineering, structured outputs, JSON mode' },
          { name: 'Vector DBs (ChromaDB, Pinecone)', level: 85, desc: 'Semantic search, hybrid retrieval, embeddings' },
          { name: 'Computer Vision & Grad-CAM', level: 80, desc: 'CNNs, U-Net segmentation, OpenCV, saliency maps' }
        ]
      },
      {
        category: 'Programming Languages',
        items: [
          { name: 'Python', level: 95, desc: 'Asyncio, NumPy, Pandas, PyTorch, FastAPI, typing' },
          { name: 'TypeScript & JavaScript', level: 90, desc: 'Modern ESNext, strong static typing, React internals' },
          { name: 'C++', level: 82, desc: 'Data structures, memory management, competitive programming' },
          { name: 'SQL & Database Design', level: 85, desc: 'Relational schema design, indexing, queries' }
        ]
      },
      {
        category: 'Web & Creative Tech',
        items: [
          { name: 'React & Next.js', level: 92, desc: 'Hooks, custom states, concurrent rendering, performance' },
          { name: 'Three.js & 3D WebGL', level: 86, desc: '3D scenes, shaders, lighting, low-poly procedural assets' },
          { name: 'Tailwind CSS & Design Systems', level: 94, desc: 'Responsive layouts, modern animations, UI polish' },
          { name: 'Web Audio API', level: 84, desc: 'Synthesizers, sound effects, audio nodes' }
        ]
      },
      {
        category: 'Tools, DevOps & Systems',
        items: [
          { name: 'Git & GitHub Collaboration', level: 90, desc: 'Feature branching, CI workflows, code reviews' },
          { name: 'Docker & Containerization', level: 80, desc: 'Multi-stage builds, local dev environments' },
          { name: 'Linux & Shell Scripting', level: 85, desc: 'Bash automation, server configs, process management' },
          { name: 'FastAPI & RESTful APIs', level: 88, desc: 'Pydantic schemas, Swagger docs, async endpoints' }
        ]
      }
    ],
    education: [
      {
        period: '2024 - Present (Current: 2nd Year)',
        degree: 'B.Tech in Computer Science & Engineering',
        institution: 'Faculty of Engineering & Technology',
        score: 'CGPA: 8.9 / 10.0',
        desc: 'Specializing in Artificial Intelligence and Autonomous Computing. Core coursework: Data Structures & Algorithms, Object-Oriented Programming, Discrete Mathematics, Neural Networks, Computer Architecture.',
        badges: ['Top 5% of Cohort', 'AI Research Interest Group', 'Hackathon Finalist']
      },
      {
        period: '2022 - 2024',
        degree: 'Higher Secondary Education (Science - PCM & CS)',
        institution: 'Senior Secondary High School',
        score: 'Percentage: 94.6%',
        desc: 'Focused on Mathematics, Physics, and Computer Science fundamentals. Led the High School Tech Club and built early web tools.',
        badges: ['Merit Scholar', 'CS Subject Topper']
      }
    ],
    agentKnowledge: {
      default: "I'm Harsh's Autonomous Portfolio Agent! Ask me about Harsh's projects (AgentForge OS, NeuroVision 3D), his AI/ML skillset, his 2nd-year CSE coursework, or how this interactive 3D playground was constructed!",
      who: "Harshvardhansingh Thakur is a driven 2nd-year Computer Science Engineering student passionate about AI/ML, autonomous agentic coding, and creative 3D web interfaces. He combines deep algorithmic understanding with modern frontend craft.",
      projects: "Harsh has built several standout projects: 1) 'AgentForge OS' (autonomous multi-agent coding framework), 2) 'NeuroVision 3D' (real-time WebGL NeRF & point cloud visualizer), 3) 'PromptCrafter Studio' (prompt optimization bench), and 4) 'Autonomous GameWorld RL' (PyTorch PPO simulations). Which one would you like to dive deeper into?",
      skills: "Harsh's technical toolkit includes: Python, PyTorch, LangGraph/AutoGen, TypeScript, React, Three.js / WebGL, C++, Tailwind CSS, Docker, and FastAPI. He has a strong mathematical base in linear algebra and neural networks.",
      hire: "Why hire Harsh? He is in the top 5% of his CSE cohort, actively writes production-grade code, understands modern agentic architectures, and builds full-stack creative web applications that wow users. He learns at blistering speed and is ready for high-impact internship/research roles!",
      playground: "This playground portfolio is rendered in real-time 3D! The trees, clouds, signboard, and coin are procedural 3D models with custom warm sunlight, rim lighting, dynamic shadows, and physics-calculated coin flips accompanied by custom Web Audio API synthesis."
    }
  };

  // --- 4. 3D PROCEDURAL PLAYGROUND ENGINE ---
  const canvas = document.getElementById('canvas3d');
  const ctx3d = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Camera setup
  const Camera = {
    x: 0,
    y: 180,
    z: 550,
    targetX: 0,
    targetY: 40,
    targetZ: 0,
    rotX: 0.22,
    rotY: 0,
    fov: 650,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0
  };

  // Mouse Orbit & Parallax
  window.addEventListener('mousedown', (e) => {
    if (e.target.closest('#canvas3d')) {
      Camera.isDragging = true;
      Camera.lastMouseX = e.clientX;
      Camera.lastMouseY = e.clientY;
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (Camera.isDragging) {
      const dx = e.clientX - Camera.lastMouseX;
      const dy = e.clientY - Camera.lastMouseY;
      Camera.rotY += dx * 0.005;
      Camera.rotX = Math.max(0.08, Math.min(0.55, Camera.rotX + dy * 0.005));
      Camera.lastMouseX = e.clientX;
      Camera.lastMouseY = e.clientY;
    } else {
      // Subtle gentle parallax
      const normX = (e.clientX / width - 0.5) * 0.08;
      Camera.rotY = Camera.rotY * 0.95 + normX * 0.05;
    }
  });

  window.addEventListener('mouseup', () => {
    Camera.isDragging = false;
  });

  // Touch Support for mobile
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1 && e.target.closest('#canvas3d')) {
      Camera.isDragging = true;
      Camera.lastMouseX = e.touches[0].clientX;
      Camera.lastMouseY = e.touches[0].clientY;
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (Camera.isDragging && e.touches.length === 1) {
      const dx = e.touches[0].clientX - Camera.lastMouseX;
      const dy = e.touches[0].clientY - Camera.lastMouseY;
      Camera.rotY += dx * 0.006;
      Camera.rotX = Math.max(0.08, Math.min(0.55, Camera.rotX + dy * 0.006));
      Camera.lastMouseX = e.touches[0].clientX;
      Camera.lastMouseY = e.touches[0].clientY;
    }
  });

  window.addEventListener('touchend', () => {
    Camera.isDragging = false;
  });

  // 3D Matrix Math & Projection
  function project(x, y, z) {
    // Translate relative to camera target
    const tx = x - Camera.targetX;
    const ty = y - Camera.targetY;
    const tz = z - Camera.targetZ;

    // Rotate Y
    const cosY = Math.cos(Camera.rotY);
    const sinY = Math.sin(Camera.rotY);
    const x1 = tx * cosY - tz * sinY;
    const z1 = tx * sinY + tz * cosY;

    // Rotate X
    const cosX = Math.cos(Camera.rotX);
    const sinX = Math.sin(Camera.rotX);
    const y2 = ty * cosX - z1 * sinX;
    const z2 = ty * sinX + z1 * cosX;

    // Camera distance
    const camZ = z2 + Camera.z;
    if (camZ <= 10) return null;

    const scale = Camera.fov / camZ;
    return {
      x: width / 2 + x1 * scale,
      y: height / 2 - (y2 - 60) * scale,
      z: camZ,
      scale: scale
    };
  }

  // --- PROCEDURAL 3D ASSETS ---

  // 1. Clouds
  const CLOUDS = [];
  for (let i = 0; i < 9; i++) {
    CLOUDS.push({
      x: (Math.random() - 0.5) * 1600,
      y: 280 + Math.random() * 120,
      z: (Math.random() - 0.5) * 1200,
      speed: 0.15 + Math.random() * 0.25,
      scale: 35 + Math.random() * 30,
      puffs: [
        { dx: 0, dy: 0, r: 1 },
        { dx: -25, dy: -6, r: 0.75 },
        { dx: 25, dy: -4, r: 0.8 },
        { dx: -12, dy: 10, r: 0.7 },
        { dx: 14, dy: 8, r: 0.75 }
      ]
    });
  }

  // 2. Trees (Stylized low-poly pine & round trees)
  const TREES = [
    { x: -320, z: -150, type: 'pine', scale: 1.1, jiggle: 0 },
    { x: -220, z: -280, type: 'round', scale: 1.25, jiggle: 0 },
    { x: -400, z: 80, type: 'pine', scale: 0.95, jiggle: 0 },
    { x: -280, z: 220, type: 'round', scale: 1.1, jiggle: 0 },
    { x: 300, z: -180, type: 'pine', scale: 1.2, jiggle: 0 },
    { x: 240, z: -320, type: 'round', scale: 1.3, jiggle: 0 },
    { x: 380, z: 60, type: 'round', scale: 1.0, jiggle: 0 },
    { x: 290, z: 240, type: 'pine', scale: 1.15, jiggle: 0 },
    { x: -120, z: -380, type: 'pine', scale: 0.85, jiggle: 0 },
    { x: 140, z: -400, type: 'round', scale: 0.9, jiggle: 0 }
  ];

  // 3. Flowers & Stones
  const NATURE_DETAILS = [];
  for (let i = 0; i < 45; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 420;
    NATURE_DETAILS.push({
      x: Math.cos(angle) * dist,
      z: Math.sin(angle) * dist,
      type: Math.random() < 0.65 ? 'flower' : 'stone',
      color: ['#FF5E7E', '#FFE8A3', '#FFFFFF', '#67C9FF'][Math.floor(Math.random() * 4)],
      scale: 0.7 + Math.random() * 0.6
    });
  }

  // 4. Floating Pollen / Fireflies
  const PARTICLES = [];
  for (let i = 0; i < 40; i++) {
    PARTICLES.push({
      x: (Math.random() - 0.5) * 800,
      y: 10 + Math.random() * 140,
      z: (Math.random() - 0.5) * 800,
      vx: (Math.random() - 0.5) * 0.3,
      vy: 0.1 + Math.random() * 0.2,
      vz: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2
    });
  }

  // 5. The 3D Interactive Coin
  const Coin = {
    x: 0,
    y: 75,
    z: 0,
    radius: 54,
    thickness: 10,
    angleX: 0,
    angleY: 0,
    angleZ: 0,
    targetFace: 'heads', // 'heads' (0) or 'tails' (Math.PI)
    isFlipping: false,
    flipProgress: 0,
    flipDuration: 100, // frames (~1.6s)
    baseY: 75,
    bounce: 0,
    settleAngle: 0
  };

  // Tree click interaction
  canvas.addEventListener('click', (e) => {
    // Check if clicked near coin
    const coinProj = project(Coin.x, Coin.y, Coin.z);
    if (coinProj) {
      const dist = Math.hypot(e.clientX - coinProj.x, e.clientY - coinProj.y);
      if (dist < Coin.radius * coinProj.scale * 1.5) {
        if (!GameState.isFlipping) {
          triggerCoinToss();
          return;
        }
      }
    }

    // Check if clicked near trees
    TREES.forEach((tree) => {
      const p = project(tree.x, 60, tree.z);
      if (p) {
        const dist = Math.hypot(e.clientX - p.x, e.clientY - p.y);
        if (dist < 60 * p.scale) {
          tree.jiggle = 1.0;
          AudioFX.click();
        }
      }
    });
  });

  // --- 5. RENDER LOOP ---
  let animFrameId = null;
  let globalTick = 0;

  function render() {
    globalTick += 0.02;

    // Palette depending on Time of Day
    let skyTop = '#67C9FF';
    let skyBottom = '#249BEE';
    let grassColor = '#66C94D';
    let grassDark = '#4BAA34';
    let sunColor = '#FFE8A3';

    if (GameState.timeOfDay === 'sunset') {
      skyTop = '#FF7E5F';
      skyBottom = '#FEB47B';
      grassColor = '#7CA53A';
      grassDark = '#5C7E27';
      sunColor = '#FFA050';
    } else if (GameState.timeOfDay === 'dusk') {
      skyTop = '#141E30';
      skyBottom = '#243B55';
      grassColor = '#1C4B30';
      grassDark = '#10321F';
      sunColor = '#E0E8FF';
    }

    // 1. Draw Sky Gradient
    const skyGrad = ctx3d.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, skyTop);
    skyGrad.addColorStop(1, skyBottom);
    ctx3d.fillStyle = skyGrad;
    ctx3d.fillRect(0, 0, width, height);

    // 2. Draw Sun / Moon
    const sunProj = project(280, 420, -700);
    if (sunProj) {
      const sunGrad = ctx3d.createRadialGradient(
        sunProj.x,
        sunProj.y,
        10 * sunProj.scale,
        sunProj.x,
        sunProj.y,
        120 * sunProj.scale
      );
      sunGrad.addColorStop(0, sunColor);
      sunGrad.addColorStop(0.4, 'rgba(255, 232, 163, 0.4)');
      sunGrad.addColorStop(1, 'rgba(255, 232, 163, 0)');
      ctx3d.fillStyle = sunGrad;
      ctx3d.beginPath();
      ctx3d.arc(sunProj.x, sunProj.y, 120 * sunProj.scale, 0, Math.PI * 2);
      ctx3d.fill();
    }

    // 3. Draw Clouds
    CLOUDS.forEach((c) => {
      c.x += c.speed;
      if (c.x > 800) c.x = -800;
      const cp = project(c.x, c.y, c.z);
      if (cp) {
        ctx3d.fillStyle = 'rgba(255, 255, 255, 0.94)';
        c.puffs.forEach((puff) => {
          ctx3d.beginPath();
          ctx3d.arc(
            cp.x + puff.dx * cp.scale,
            cp.y + puff.dy * cp.scale,
            c.scale * puff.r * cp.scale,
            0,
            Math.PI * 2
          );
          ctx3d.fill();
        });
      }
    });

    // 4. Draw Grassy Ground Field (Rolling Stylized Discs & Tiles)
    const groundProj = project(0, 0, 0);
    if (groundProj) {
      // Main central playground circle
      const grassGrad = ctx3d.createRadialGradient(
        groundProj.x,
        groundProj.y + 40,
        30,
        groundProj.x,
        groundProj.y,
        width * 0.75
      );
      grassGrad.addColorStop(0, grassColor);
      grassGrad.addColorStop(0.7, grassDark);
      grassGrad.addColorStop(1, '#1A592D');

      ctx3d.fillStyle = grassGrad;
      ctx3d.beginPath();
      ctx3d.ellipse(
        groundProj.x,
        groundProj.y + 110,
        width * 0.85,
        height * 0.45,
        0,
        0,
        Math.PI * 2
      );
      ctx3d.fill();

      // Stylized grass rings / contour terraces
      ctx3d.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx3d.lineWidth = 2;
      ctx3d.stroke();
    }

    // Render list for depth sorting
    const renderQueue = [];

    // Add Nature Details (flowers/stones)
    NATURE_DETAILS.forEach((d) => {
      const p = project(d.x, 0, d.z);
      if (p) {
        renderQueue.push({
          z: p.z,
          draw: () => {
            if (d.type === 'flower') {
              // Stem
              ctx3d.strokeStyle = '#247A3B';
              ctx3d.lineWidth = 2 * p.scale;
              ctx3d.beginPath();
              ctx3d.moveTo(p.x, p.y);
              ctx3d.lineTo(p.x, p.y - 12 * p.scale * d.scale);
              ctx3d.stroke();

              // Petals
              ctx3d.fillStyle = d.color;
              ctx3d.beginPath();
              ctx3d.arc(p.x, p.y - 12 * p.scale * d.scale, 5 * p.scale * d.scale, 0, Math.PI * 2);
              ctx3d.fill();

              // Flower Center
              ctx3d.fillStyle = '#FFD043';
              ctx3d.beginPath();
              ctx3d.arc(p.x, p.y - 12 * p.scale * d.scale, 2 * p.scale * d.scale, 0, Math.PI * 2);
              ctx3d.fill();
            } else {
              // Stone
              ctx3d.fillStyle = '#8FA89B';
              ctx3d.beginPath();
              ctx3d.ellipse(
                p.x,
                p.y,
                8 * p.scale * d.scale,
                5 * p.scale * d.scale,
                0,
                0,
                Math.PI * 2
              );
              ctx3d.fill();
              ctx3d.fillStyle = 'rgba(255, 255, 255, 0.3)';
              ctx3d.beginPath();
              ctx3d.ellipse(
                p.x - 2,
                p.y - 2,
                4 * p.scale * d.scale,
                2 * p.scale * d.scale,
                0,
                0,
                Math.PI * 2
              );
              ctx3d.fill();
            }
          }
        });
      }
    });

    // Add Trees
    TREES.forEach((tree) => {
      const p = project(tree.x, 0, tree.z);
      if (p) {
        if (tree.jiggle > 0) tree.jiggle = Math.max(0, tree.jiggle - 0.05);
        const jiggleOffset = Math.sin(globalTick * 15) * tree.jiggle * 10;
        const wind = Math.sin(globalTick + tree.x * 0.01) * 3;

        renderQueue.push({
          z: p.z,
          draw: () => {
            const sc = p.scale * tree.scale;
            // Tree shadow
            ctx3d.fillStyle = 'rgba(23, 53, 42, 0.2)';
            ctx3d.beginPath();
            ctx3d.ellipse(p.x, p.y, 25 * sc, 12 * sc, 0, 0, Math.PI * 2);
            ctx3d.fill();

            // Trunk
            ctx3d.fillStyle = '#6E421E';
            ctx3d.beginPath();
            ctx3d.moveTo(p.x - 7 * sc, p.y);
            ctx3d.lineTo(p.x + 7 * sc, p.y);
            ctx3d.lineTo(p.x + 4 * sc, p.y - 45 * sc);
            ctx3d.lineTo(p.x - 4 * sc, p.y - 45 * sc);
            ctx3d.closePath();
            ctx3d.fill();

            const tx = p.x + jiggleOffset + wind;

            if (tree.type === 'pine') {
              // 3 stacked cones
              const levels = [
                { y: p.y - 30 * sc, w: 45 * sc, h: 40 * sc, col: '#247A3B' },
                { y: p.y - 55 * sc, w: 35 * sc, h: 35 * sc, col: '#2D8A44' },
                { y: p.y - 78 * sc, w: 24 * sc, h: 30 * sc, col: '#38A053' }
              ];
              levels.forEach((lvl) => {
                ctx3d.fillStyle = lvl.col;
                ctx3d.beginPath();
                ctx3d.moveTo(tx, lvl.y - lvl.h);
                ctx3d.lineTo(tx + lvl.w / 2, lvl.y);
                ctx3d.lineTo(tx - lvl.w / 2, lvl.y);
                ctx3d.closePath();
                ctx3d.fill();

                // Highlight side
                ctx3d.fillStyle = 'rgba(255, 255, 255, 0.15)';
                ctx3d.beginPath();
                ctx3d.moveTo(tx, lvl.y - lvl.h);
                ctx3d.lineTo(tx + lvl.w / 2, lvl.y);
                ctx3d.lineTo(tx, lvl.y);
                ctx3d.closePath();
                ctx3d.fill();
              });
            } else {
              // Round stylized foliage
              const folY = p.y - 70 * sc;
              ctx3d.fillStyle = '#3CA452';
              ctx3d.beginPath();
              ctx3d.arc(tx, folY, 36 * sc, 0, Math.PI * 2);
              ctx3d.fill();

              ctx3d.fillStyle = '#4EC066';
              ctx3d.beginPath();
              ctx3d.arc(tx - 10 * sc, folY - 8 * sc, 22 * sc, 0, Math.PI * 2);
              ctx3d.fill();

              ctx3d.fillStyle = 'rgba(255, 255, 255, 0.18)';
              ctx3d.beginPath();
              ctx3d.arc(tx - 12 * sc, folY - 14 * sc, 14 * sc, 0, Math.PI * 2);
              ctx3d.fill();
            }
          }
        });
      }
    });

    // Add 3D Wooden Signboard Posts & Plank
    const signPostP1 = project(-110, 0, -60);
    const signPostP2 = project(110, 0, -60);
    if (signPostP1 && signPostP2) {
      renderQueue.push({
        z: signPostP1.z + 10,
        draw: () => {
          // Signboard posts in the ground
          ctx3d.fillStyle = '#5A3113';
          [signPostP1, signPostP2].forEach((sp) => {
            ctx3d.fillRect(sp.x - 4 * sp.scale, sp.y - 90 * sp.scale, 8 * sp.scale, 90 * sp.scale);
          });
        }
      });
    }

    // Update Coin Physics & Flip Animation
    if (Coin.isFlipping) {
      Coin.flipProgress++;
      const t = Coin.flipProgress / Coin.flipDuration; // 0 to 1

      // Parabolic upward arc: rises up to +220px, falls back down
      const arc = 4 * t * (1 - t);
      Coin.y = Coin.baseY + arc * 200;

      // Spin rapidly: multiple 360 degree rotations
      // Finish exactly at settleAngle (0 for heads, PI for tails)
      const totalSpins = 4 * Math.PI; // 2 full revolutions
      Coin.angleX = totalSpins * t + (1 - t) * 0.2 + t * Coin.settleAngle;
      Coin.angleZ = Math.sin(t * Math.PI * 2) * 0.4;

      if (Coin.flipProgress >= Coin.flipDuration) {
        Coin.isFlipping = false;
        Coin.angleX = Coin.settleAngle;
        Coin.angleZ = 0;
        Coin.y = Coin.baseY;
        Coin.bounce = 1.0;
        onCoinLandFinish();
      }
    } else {
      // Idle floating bob
      Coin.y = Coin.baseY + Math.sin(globalTick * 3) * 6;
      Coin.angleY = Math.sin(globalTick * 1.5) * 0.15;
    }

    if (Coin.bounce > 0) {
      Coin.bounce = Math.max(0, Coin.bounce - 0.08);
      Coin.y += Math.sin(Coin.bounce * Math.PI) * 12;
    }

    // Add Coin to render queue
    const cp = project(Coin.x, Coin.y, Coin.z);
    const shadowP = project(Coin.x, 0, Coin.z);
    if (cp && shadowP) {
      renderQueue.push({
        z: cp.z,
        draw: () => {
          const sc = cp.scale;

          // 1. Coin Shadow on Grass
          const shadowScale = (1 - (Coin.y - Coin.baseY) / 300) * sc;
          ctx3d.fillStyle = 'rgba(23, 53, 42, 0.25)';
          ctx3d.beginPath();
          ctx3d.ellipse(
            shadowP.x,
            shadowP.y,
            Coin.radius * shadowScale * 1.1,
            Coin.radius * shadowScale * 0.45,
            0,
            0,
            Math.PI * 2
          );
          ctx3d.fill();

          // 2. 3D Coin Orientation & Rendering
          // Calculate cosine of angleX to see which face is visible
          const cosPitch = Math.cos(Coin.angleX);
          const r = Coin.radius * sc;
          const ry = Math.max(2, Math.abs(cosPitch) * r);
          const isFront = cosPitch >= 0; // True = Heads ('H'), False = Tails ('T')

          // Coin Rim / Thickness extrusion
          const rimHeight = Coin.thickness * sc * Math.sin(Coin.angleX);
          ctx3d.fillStyle = '#B87A00'; // Darker beveled gold edge
          ctx3d.beginPath();
          ctx3d.ellipse(cp.x, cp.y + rimHeight, r, ry, 0, 0, Math.PI * 2);
          ctx3d.ellipse(cp.x, cp.y, r, ry, 0, 0, Math.PI * 2);
          ctx3d.fill();

          // Coin Face Main Disc
          const goldGrad = ctx3d.createRadialGradient(
            cp.x - r * 0.3,
            cp.y - ry * 0.3,
            r * 0.1,
            cp.x,
            cp.y,
            r
          );
          goldGrad.addColorStop(0, '#FFF5D0');
          goldGrad.addColorStop(0.35, '#FFD700');
          goldGrad.addColorStop(0.8, '#F5B000');
          goldGrad.addColorStop(1, '#C68E17');

          ctx3d.fillStyle = goldGrad;
          ctx3d.beginPath();
          ctx3d.ellipse(cp.x, cp.y, r, ry, 0, 0, Math.PI * 2);
          ctx3d.fill();

          // Inner Embossed Ring
          ctx3d.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx3d.lineWidth = 3 * sc;
          ctx3d.beginPath();
          ctx3d.ellipse(cp.x, cp.y, r * 0.82, ry * 0.82, 0, 0, Math.PI * 2);
          ctx3d.stroke();

          // Embossed Lettering & Graphics ('H' for Heads, 'T' for Tails)
          ctx3d.save();
          ctx3d.translate(cp.x, cp.y);
          ctx3d.scale(1, Math.abs(cosPitch));

          ctx3d.font = `900 ${Math.round(44 * sc)}px Outfit, sans-serif`;
          ctx3d.textAlign = 'center';
          ctx3d.textBaseline = 'middle';

          if (isFront) {
            // HEADS: Big Embossed "H" with Laurels & Star
            ctx3d.fillStyle = '#8C5800';
            ctx3d.fillText('H', 1, 3);
            ctx3d.fillStyle = '#FFFFFF';
            ctx3d.fillText('H', 0, 0);

            // Subtitle
            ctx3d.font = `800 ${Math.round(11 * sc)}px Outfit, sans-serif`;
            ctx3d.fillStyle = '#734600';
            ctx3d.fillText('HEADS', 0, r * 0.48);
            ctx3d.fillText('★ HARSH ★', 0, -r * 0.48);
          } else {
            // TAILS: Big Embossed "T" with Circuit Nodes
            ctx3d.fillStyle = '#8C5800';
            ctx3d.fillText('T', 1, 3);
            ctx3d.fillStyle = '#FFFFFF';
            ctx3d.fillText('T', 0, 0);

            // Subtitle
            ctx3d.font = `800 ${Math.round(11 * sc)}px Outfit, sans-serif`;
            ctx3d.fillStyle = '#734600';
            ctx3d.fillText('TAILS', 0, r * 0.48);
            ctx3d.fillText('⟨ DEVELOPER ⟩', 0, -r * 0.48);
          }
          ctx3d.restore();

          // Specular Glint Across Coin
          ctx3d.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx3d.lineWidth = 4 * sc;
          ctx3d.beginPath();
          ctx3d.ellipse(cp.x - r * 0.35, cp.y - ry * 0.35, r * 0.25, ry * 0.25, -0.4, 0, Math.PI);
          ctx3d.stroke();
        }
      });
    }

    // Add Floating Pollen / Fireflies
    PARTICLES.forEach((pt) => {
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.z += pt.vz;
      if (pt.y > 180) pt.y = 10;
      if (pt.x > 400) pt.x = -400;
      if (pt.x < -400) pt.x = 400;
      if (pt.z > 400) pt.z = -400;
      if (pt.z < -400) pt.z = 400;

      const pp = project(pt.x, pt.y, pt.z);
      if (pp) {
        const glow = Math.sin(globalTick * 3 + pt.phase) * 0.5 + 0.5;
        renderQueue.push({
          z: pp.z,
          draw: () => {
            const rad = (GameState.timeOfDay === 'dusk' ? 3.5 : 2) * pp.scale;
            ctx3d.fillStyle =
              GameState.timeOfDay === 'dusk'
                ? `rgba(160, 255, 100, ${glow * 0.8 + 0.2})`
                : `rgba(255, 245, 200, ${glow * 0.5 + 0.3})`;
            ctx3d.beginPath();
            ctx3d.arc(pp.x, pp.y, rad, 0, Math.PI * 2);
            ctx3d.fill();
          }
        });
      }
    });

    // 5. Sort & Draw Everything by Depth (Back to Front)
    renderQueue.sort((a, b) => b.z - a.z);
    renderQueue.forEach((item) => item.draw());

    animFrameId = requestAnimationFrame(render);
  }

  animFrameId = requestAnimationFrame(render);

  // --- 6. COIN TOSS LOGIC & STREAK MANAGEMENT ---
  const tossBtn = document.getElementById('tossBtn');
  const streakTokens = [
    document.getElementById('token1'),
    document.getElementById('token2'),
    document.getElementById('token3')
  ];
  const feedbackBanner = document.getElementById('feedbackBanner');
  const streakCountLabel = document.getElementById('streakCountLabel');
  const historyContainer = document.getElementById('historyContainer');
  const resetBtn = document.getElementById('resetBtn');
  const muteBtn = document.getElementById('muteBtn');
  const skipBtn = document.getElementById('skipBtn');
  const timeToggleBtn = document.getElementById('timeToggleBtn');
  const viewPortfolioBtn = document.getElementById('viewPortfolioBtn');
  const portfolioModal = document.getElementById('portfolioModal');
  const closePortfolioBtn = document.getElementById('closePortfolioBtn');

  function updateStreakUI() {
    streakCountLabel.innerText = `HEADS IN A ROW: ${GameState.consecutiveHeads} / ${GameState.targetHeads}`;
    streakTokens.forEach((token, idx) => {
      if (idx < GameState.consecutiveHeads) {
        token.classList.add('active');
        token.innerHTML = 'H';
      } else {
        token.classList.remove('active');
        token.innerHTML = idx + 1;
      }
    });
  }

  function updateHistoryUI(result) {
    const pill = document.createElement('div');
    pill.className = `history-pill ${result === 'heads' ? 'history-h' : 'history-t'}`;
    pill.innerText = result === 'heads' ? 'H' : 'T';
    historyContainer.appendChild(pill);
    if (historyContainer.children.length > 8) {
      historyContainer.removeChild(historyContainer.firstChild);
    }
  }

  function triggerCoinToss() {
    if (GameState.isFlipping) return;

    initAudio();
    GameState.isFlipping = true;
    tossBtn.disabled = true;

    // Play toss whoosh & spinning sounds
    AudioFX.coinToss();

    // Determine fair outcome
    const isHeads = Math.random() < 0.5;
    const outcome = isHeads ? 'heads' : 'tails';

    // Set 3D Coin target settle angle (0 = Heads up, Math.PI = Tails up)
    Coin.isFlipping = true;
    Coin.flipProgress = 0;
    Coin.targetFace = outcome;
    Coin.settleAngle = isHeads ? 0 : Math.PI;

    // Temporary feedback
    feedbackBanner.className = 'feedback-banner feedback-default';
    feedbackBanner.innerText = 'Coin is in the air...';
  }

  function onCoinLandFinish() {
    GameState.isFlipping = false;
    const outcome = Coin.targetFace;
    const isHeads = outcome === 'heads';

    GameState.totalFlips++;
    GameState.history.push(outcome);
    updateHistoryUI(outcome);

    AudioFX.coinLand(isHeads);

    if (isHeads) {
      GameState.headsCount++;
      GameState.consecutiveHeads++;
      updateStreakUI();

      if (GameState.consecutiveHeads === 1) {
        feedbackBanner.className = 'feedback-banner feedback-heads';
        feedbackBanner.innerText = "Nice! It's HEADS! You're off to a great start!";
        AudioFX.streak(1);
        tossBtn.disabled = false;
      } else if (GameState.consecutiveHeads === 2) {
        feedbackBanner.className = 'feedback-banner feedback-heads';
        feedbackBanner.innerText = "Another HEADS! You're one step away!";
        AudioFX.streak(2);
        tossBtn.disabled = false;
      } else if (GameState.consecutiveHeads >= 3) {
        feedbackBanner.className = 'feedback-banner feedback-unlocked';
        feedbackBanner.innerText = "JACKPOT! 3 HEADS IN A ROW! Harsh's universe is UNLOCKED!";
        AudioFX.fanfare();
        fireConfettiCelebration();
        GameState.isUnlocked = true;
        viewPortfolioBtn.style.display = 'inline-flex';

        // Auto open portfolio after brief celebration
        setTimeout(() => {
          openPortfolio();
        }, 1300);
      }
    } else {
      GameState.tailsCount++;
      GameState.consecutiveHeads = 0;
      updateStreakUI();
      feedbackBanner.className = 'feedback-banner feedback-tails';
      feedbackBanner.innerText = "Aw, it's TAILS! Streak reset to 0. Try again!";
      AudioFX.fail();
      tossBtn.disabled = false;
    }
  }

  // --- 7. CONFETTI CELEBRATION FX ---
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confCtx = confettiCanvas.getContext('2d');
  let confettiParticles = [];

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function fireConfettiCelebration() {
    confettiParticles = [];
    const colors = ['#FFD700', '#66C94D', '#249BEE', '#FF5E7E', '#FFFFFF', '#FFE8A3'];
    for (let i = 0; i < 160; i++) {
      confettiParticles.push({
        x: width / 2 + (Math.random() - 0.5) * 200,
        y: height * 0.7,
        vx: (Math.random() - 0.5) * 18,
        vy: -14 - Math.random() * 12,
        size: 7 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }
    animateConfetti();
  }

  function animateConfetti() {
    confCtx.clearRect(0, 0, width, height);
    let activeCount = 0;

    confettiParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.98;
      p.rotation += p.rotSpeed;
      if (p.y > height * 0.8) p.opacity -= 0.02;

      if (p.opacity > 0) {
        activeCount++;
        confCtx.save();
        confCtx.translate(p.x, p.y);
        confCtx.rotate((p.rotation * Math.PI) / 180);
        confCtx.fillStyle = p.color;
        confCtx.globalAlpha = p.opacity;
        confCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        confCtx.restore();
      }
    });

    if (activeCount > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confCtx.clearRect(0, 0, width, height);
    }
  }

  // --- 8. UI CONTROLS & EVENT LISTENERS ---
  tossBtn.addEventListener('click', () => {
    AudioFX.click();
    triggerCoinToss();
  });

  resetBtn.addEventListener('click', () => {
    AudioFX.click();
    GameState.consecutiveHeads = 0;
    updateStreakUI();
    feedbackBanner.className = 'feedback-banner feedback-default';
    feedbackBanner.innerText = 'Streak reset to 0. Flip a coin to start again!';
  });

  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.innerHTML = isMuted ? '🔇 Sound: Off' : '🔊 Sound: On';
    if (!isMuted) AudioFX.click();
  });

  skipBtn.addEventListener('click', () => {
    AudioFX.click();
    GameState.consecutiveHeads = 3;
    GameState.isUnlocked = true;
    updateStreakUI();
    feedbackBanner.className = 'feedback-banner feedback-unlocked';
    feedbackBanner.innerText = 'Recruiter Pass: Harsh\'s Developer Profile Unlocked!';
    viewPortfolioBtn.style.display = 'inline-flex';
    fireConfettiCelebration();
    setTimeout(() => {
      openPortfolio();
    }, 600);
  });

  timeToggleBtn.addEventListener('click', () => {
    AudioFX.click();
    if (GameState.timeOfDay === 'day') {
      GameState.timeOfDay = 'sunset';
      timeToggleBtn.innerHTML = '🌅 Sunset';
    } else if (GameState.timeOfDay === 'sunset') {
      GameState.timeOfDay = 'dusk';
      timeToggleBtn.innerHTML = '🌙 Dusk';
    } else {
      GameState.timeOfDay = 'day';
      timeToggleBtn.innerHTML = '☀️ Day';
    }
  });

  function openPortfolio() {
    AudioFX.click();
    portfolioModal.classList.add('open');
  }

  function closePortfolio() {
    AudioFX.click();
    portfolioModal.classList.remove('open');
  }

  viewPortfolioBtn.addEventListener('click', openPortfolio);
  closePortfolioBtn.addEventListener('click', closePortfolio);

  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      AudioFX.click();
      const tabId = btn.getAttribute('data-tab');
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      const targetContent = document.getElementById(tabId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // --- 9. POPULATE PROJECTS & SKILLS ---
  const projectsGrid = document.getElementById('projectsGrid');
  const projectModal = document.getElementById('projectModal');
  const projectModalContent = document.getElementById('projectModalContent');
  const filterChips = document.querySelectorAll('.filter-chip');

  function renderProjects(categoryFilter = 'All') {
    projectsGrid.innerHTML = '';
    const filtered =
      categoryFilter === 'All'
        ? PORTFOLIO_DATA.projects
        : PORTFOLIO_DATA.projects.filter((p) => p.category === categoryFilter);

    filtered.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div>
          <div class="card-top-badge">
            <span class="cat-tag">${p.category}</span>
            ${p.featured ? '<span style="font-size:0.75rem; font-weight:800; color:#247A3B;">★ Featured</span>' : ''}
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-tagline">${p.tagline}</p>
          <p class="project-desc">${p.desc}</p>
          <div class="project-metrics">
            ${p.metrics.map((m) => `<div>✓ ${m}</div>`).join('')}
          </div>
          <div class="tech-tags">
            ${p.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="project-actions">
          <button class="btn-play btn-green view-proj-btn" style="flex:1; font-size:0.85rem; padding:10px;" data-id="${p.id}">
            Architecture & Details
          </button>
        </div>
      `;
      projectsGrid.appendChild(card);
    });

    // Attach event listeners to detail buttons
    document.querySelectorAll('.view-proj-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        AudioFX.click();
        const pid = btn.getAttribute('data-id');
        const proj = PORTFOLIO_DATA.projects.find((item) => item.id === pid);
        if (proj) openProjectModal(proj);
      });
    });
  }

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      AudioFX.click();
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      renderProjects(chip.getAttribute('data-cat'));
    });
  });

  function openProjectModal(p) {
    projectModalContent.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
        <div>
          <span class="cat-tag">${p.category}</span>
          <h2 style="font-family:'Outfit', sans-serif; font-size:1.8rem; font-weight:900; margin-top:8px; color:#17352A;">${p.title}</h2>
          <p style="font-weight:600; color:#247A3B; margin-top:4px;">${p.tagline}</p>
        </div>
        <button id="closeProjModalBtn" style="background:#E2EFE7; border:none; width:36px; height:36px; border-radius:50%; font-weight:800; cursor:pointer; font-size:1.1rem; color:#17352A;">✕</button>
      </div>

      <div style="font-size:0.95rem; color:#2D5243; line-height:1.6; margin-bottom:20px;">
        ${p.desc}
      </div>

      <h4 style="font-family:'Outfit', sans-serif; font-size:1.1rem; font-weight:800; color:#17352A; margin-bottom:10px;">Technical Architecture & Engineering Highlights</h4>
      <ul style="padding-left:20px; font-size:0.9rem; color:#2D5243; line-height:1.6; margin-bottom:24px;">
        ${p.architecture.map((a) => `<li style="margin-bottom:6px;"><strong>${a.split(':')[0]}:</strong>${a.split(':').slice(1).join(':')}</li>`).join('')}
      </ul>

      <h4 style="font-family:'Outfit', sans-serif; font-size:1.1rem; font-weight:800; color:#17352A; margin-bottom:10px;">Proven Metrics</h4>
      <div style="background:#F4FAF6; border-radius:14px; padding:14px 18px; margin-bottom:24px; border:1px solid #D6E8DF;">
        ${p.metrics.map((m) => `<div style="font-size:0.88rem; font-weight:700; color:#247A3B; margin-bottom:4px;">✓ ${m}</div>`).join('')}
      </div>

      <h4 style="font-family:'Outfit', sans-serif; font-size:1.1rem; font-weight:800; color:#17352A; margin-bottom:10px;">Technologies & Frameworks</h4>
      <div class="tech-tags" style="margin-bottom:28px;">
        ${p.tech.map((t) => `<span class="tech-tag" style="font-size:0.85rem; padding:4px 10px;">${t}</span>`).join('')}
      </div>

      <div style="display:flex; gap:12px;">
        <button class="btn-play btn-green" id="closeProjModalBottom" style="flex:1;">Done Reading</button>
      </div>
    `;

    projectModal.classList.add('open');
    document.getElementById('closeProjModalBtn').addEventListener('click', () => {
      AudioFX.click();
      projectModal.classList.remove('open');
    });
    document.getElementById('closeProjModalBottom').addEventListener('click', () => {
      AudioFX.click();
      projectModal.classList.remove('open');
    });
  }

  // Populate Skills
  const skillsGrid = document.getElementById('skillsGrid');
  PORTFOLIO_DATA.skills.forEach((cat) => {
    const card = document.createElement('div');
    card.className = 'skill-category-card';
    card.innerHTML = `
      <div class="skill-cat-header">
        <span>⚡</span> ${cat.category}
      </div>
      <div class="skill-items">
        ${cat.items
          .map(
            (s) => `
          <div class="skill-row">
            <div class="skill-info">
              <span>${s.name}</span>
              <span style="color:#247A3B;">${s.level}%</span>
            </div>
            <div class="skill-bar-bg">
              <div class="skill-bar-fill" style="width:${s.level}%;"></div>
            </div>
            <div class="skill-extra">${s.desc}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
    skillsGrid.appendChild(card);
  });

  // Populate Education
  const eduContainer = document.getElementById('educationContainer');
  PORTFOLIO_DATA.education.forEach((edu) => {
    const item = document.createElement('div');
    item.style.cssText =
      'background:#FFFFFF; border:2px solid #E2EFE7; border-radius:20px; padding:24px; margin-bottom:20px; box-shadow:0 6px 16px rgba(23,53,42,0.05);';
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <div>
          <span style="font-size:0.8rem; font-weight:800; color:#247A3B; text-transform:uppercase;">${edu.period}</span>
          <h3 style="font-family:'Outfit', sans-serif; font-size:1.3rem; font-weight:800; color:#17352A; margin-top:2px;">${edu.degree}</h3>
          <div style="font-size:0.95rem; font-weight:600; color:#4A6E5D;">${edu.institution}</div>
        </div>
        <span style="background:#EBF7FF; color:#1572C4; font-weight:800; font-size:0.85rem; padding:4px 12px; border-radius:8px;">${edu.score}</span>
      </div>
      <p style="font-size:0.9rem; color:#2D5243; line-height:1.5; margin-top:8px;">${edu.desc}</p>
      <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
        ${edu.badges.map((b) => `<span style="background:#F0F8F3; color:#1E6934; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:6px;">★ ${b}</span>`).join('')}
      </div>
    `;
    eduContainer.appendChild(item);
  });

  // --- 10. INTERACTIVE AI AGENT CHAT TERMINAL ---
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const promptChips = document.querySelectorAll('.prompt-chip');

  function addChatMessage(sender, text, thinkingSteps = null) {
    const bubble = document.createElement('div');
    bubble.className = `msg-bubble ${sender === 'user' ? 'msg-user' : 'msg-agent'}`;

    if (thinkingSteps && thinkingSteps.length > 0) {
      const thinkBox = document.createElement('div');
      thinkBox.className = 'thinking-block';
      thinkBox.innerHTML = `<span>⚙</span> ${thinkingSteps.join(' → ')}`;
      bubble.appendChild(thinkBox);
    }

    const textSpan = document.createElement('div');
    textSpan.innerText = text;
    bubble.appendChild(textSpan);

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleUserChat(userText) {
    if (!userText.trim()) return;
    AudioFX.click();
    addChatMessage('user', userText);
    chatInput.value = '';

    // Simulate Agent Thinking
    const qLower = userText.toLowerCase();
    let reply = PORTFOLIO_DATA.agentKnowledge.default;
    let steps = ['Parsing query syntax', 'Querying Harsh knowledge graph', 'Generating response'];

    if (qLower.includes('who') || qLower.includes('about') || qLower.includes('harsh')) {
      reply = PORTFOLIO_DATA.agentKnowledge.who;
      steps = ['Retrieving student bio', 'Matching CSE 2nd-year credentials', 'Formulating profile summary'];
    } else if (qLower.includes('project') || qLower.includes('work') || qLower.includes('built')) {
      reply = PORTFOLIO_DATA.agentKnowledge.projects;
      steps = ['Scanning project index', 'Filtering AgentForge OS & NeuroVision', 'Compiling architecture notes'];
    } else if (qLower.includes('skill') || qLower.includes('tech') || qLower.includes('stack')) {
      reply = PORTFOLIO_DATA.agentKnowledge.skills;
      steps = ['Analyzing core proficiencies', 'Benchmarking PyTorch & TypeScript skills', 'Formatting capabilities'];
    } else if (qLower.includes('hire') || qLower.includes('why') || qLower.includes('intern')) {
      reply = PORTFOLIO_DATA.agentKnowledge.hire;
      steps = ['Evaluating strengths & academic ranking', 'Extracting impact metrics', 'Generating recommendation'];
    } else if (qLower.includes('playground') || qLower.includes('3d') || qLower.includes('coin')) {
      reply = PORTFOLIO_DATA.agentKnowledge.playground;
      steps = ['Inspecting 3D Canvas pipeline', 'Analyzing Web Audio synthesis', 'Drafting procedural design explanation'];
    }

    setTimeout(() => {
      addChatMessage('agent', reply, steps);
      AudioFX.streak(1);
    }, 450);
  }

  chatSendBtn.addEventListener('click', () => handleUserChat(chatInput.value));
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUserChat(chatInput.value);
  });

  promptChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      handleUserChat(q);
    });
  });

  // --- 11. CONTACT FORM & EMAIL COPY ---
  const contactForm = document.getElementById('contactForm');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');

  copyEmailBtn.addEventListener('click', () => {
    AudioFX.click();
    navigator.clipboard.writeText(emailText.innerText).then(() => {
      const originalText = copyEmailBtn.innerText;
      copyEmailBtn.innerText = 'Copied! ✓';
      setTimeout(() => {
        copyEmailBtn.innerText = originalText;
      }, 2000);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    AudioFX.fanfare();
    alert("Thank you! Your message has been sent to Harshvardhansingh Thakur. Harsh will get back to you shortly!");
    contactForm.reset();
  });

  // Initial render
  renderProjects('All');
  updateStreakUI();
})();
