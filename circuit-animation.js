(() => {
  const canvas = document.getElementById("particle-background");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0, height = 0, circuits = [], animationId = null, lastFrame = 0;
  const spacing = 90;
  const traceColor = "rgba(69, 107, 154, 0.12)";
  const signalColor = "rgba(69, 107, 154, 0.75)";

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createCircuits();
    drawFrame(0);
  }

  function createCircuits() {
    circuits = [];
    const rows = Math.ceil(height / spacing);
    const cols = Math.ceil(width / spacing);
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        if (Math.random() > 0.23) continue;
        const x = col * spacing + Math.random() * 24;
        const y = row * spacing + Math.random() * 24;
        const length = 25 + Math.random() * 55;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const horizontalFirst = Math.random() > 0.5;
        const points = horizontalFirst
          ? [[x, y], [x + length * direction, y], [x + length * direction, y + length * 0.55]]
          : [[x, y], [x, y + length * 0.55], [x + length * direction, y + length * 0.55]];
        const totalLength = points.slice(1).reduce((sum, point, i) => {
          const previous = points[i];
          return sum + Math.hypot(point[0] - previous[0], point[1] - previous[1]);
        }, 0);
        circuits.push({ points, totalLength, progress: Math.random(), speed: 0.08 + Math.random() * 0.12, radius: 1.5 + Math.random() });
      }
    }
  }

  function drawTrace(points) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.strokeStyle = traceColor;
    ctx.lineWidth = 1;
    ctx.stroke();
    for (const [x, y] of points) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(69, 107, 154, 0.18)";
      ctx.fill();
    }
  }

  function getPointOnTrace(circuit, progress) {
    let distance = progress * circuit.totalLength;
    for (let i = 1; i < circuit.points.length; i++) {
      const a = circuit.points[i - 1], b = circuit.points[i];
      const segmentLength = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (distance <= segmentLength) {
        const t = segmentLength === 0 ? 0 : distance / segmentLength;
        return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t };
      }
      distance -= segmentLength;
    }
    const last = circuit.points[circuit.points.length - 1];
    return { x: last[0], y: last[1] };
  }

  function drawFrame(deltaSeconds) {
    ctx.clearRect(0, 0, width, height);
    for (const circuit of circuits) {
      drawTrace(circuit.points);
      if (reducedMotion) continue;
      circuit.progress += circuit.speed * deltaSeconds;
      if (circuit.progress > 1) circuit.progress -= 1;
      const point = getPointOnTrace(circuit, circuit.progress);
      ctx.beginPath();
      ctx.arc(point.x, point.y, circuit.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(69, 107, 154, 0.10)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(point.x, point.y, circuit.radius, 0, Math.PI * 2);
      ctx.fillStyle = signalColor;
      ctx.fill();
    }
  }

  function animate(timestamp) {
    if (document.hidden) { animationId = null; return; }
    if (timestamp - lastFrame >= 33) {
      const deltaSeconds = Math.min((timestamp - lastFrame) / 1000, 0.05);
      lastFrame = timestamp;
      drawFrame(deltaSeconds);
    }
    animationId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (reducedMotion || document.hidden || animationId !== null) return;
    lastFrame = performance.now();
    animationId = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAnimation();
    else startAnimation();
  });
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  startAnimation();
})();
