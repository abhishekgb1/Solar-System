'use strict';
try {
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
        let paused = reducedMotion;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        renderer.domElement.setAttribute('aria-label','Interactive 3D solar system. Drag to orbit and scroll or pinch to zoom.');

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = true;
        controls.minDistance = 50;
        controls.maxDistance = 3000;
        controls.autoRotate = !paused;
        controls.autoRotateSpeed = 0.3; 

        // Stars
        const starsGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 7000; i++) {
            const x = THREE.MathUtils.randFloatSpread(10000);
            const y = THREE.MathUtils.randFloatSpread(10000);
            const z = THREE.MathUtils.randFloatSpread(10000);
            starVertices.push(x, y, z);
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
        const starfield = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starfield);

        // Lights
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2, 10000);
        scene.add(pointLight);

        // Sun
        const sun = new THREE.Mesh(new THREE.SphereGeometry(40, 64, 64), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
        scene.add(sun);

        // Planet data
        const planetData = [
            { name: 'Mercury', radius: 4, color: 0xaaaaaa, orbitRadius: 80, speed: 0.00008 },
            { name: 'Venus', radius: 5, color: 0xffaa88, orbitRadius: 120, speed: 0.00007 },
            { name: 'Earth', radius: 6, color: 0x2233ff, orbitRadius: 170, speed: 0.00006 },
            { name: 'Mars', radius: 5, color: 0xff4422, orbitRadius: 220, speed: 0.00005 },
            { name: 'Jupiter', radius: 12, color: 0xff8855, orbitRadius: 300, speed: 0.00003 },
            { name: 'Saturn', radius: 11, color: 0xffddaa, orbitRadius: 400, speed: 0.00002 },
            { name: 'Uranus', radius: 9, color: 0x55aaff, orbitRadius: 500, speed: 0.000015 },
            { name: 'Neptune', radius: 9, color: 0x3333ff, orbitRadius: 600, speed: 0.00001 }
        ];

        const planets = [];
        const labels = [];

        planetData.forEach(data => {
            const orbit = new THREE.Object3D();
            scene.add(orbit);

            const planet = new THREE.Mesh(
                new THREE.SphereGeometry(data.radius, 32, 32),
                new THREE.MeshPhongMaterial({ color: data.color, shininess: 30 })
            );

            const angle = Math.random() * Math.PI * 2;
            planet.position.set(Math.cos(angle) * data.orbitRadius, 0, Math.sin(angle) * data.orbitRadius);
            orbit.add(planet);
            if (data.name === 'Saturn') {
                const ring = new THREE.Mesh(new THREE.RingGeometry(15, 23, 64), new THREE.MeshBasicMaterial({color:0xcab895,side:THREE.DoubleSide,transparent:true,opacity:.7}));
                ring.rotation.x = Math.PI / 2.4; planet.add(ring);
            }

            planets.push({ mesh: planet, orbit: orbit, speed: data.speed, name: data.name });

            const orbitCurve = new THREE.EllipseCurve(0, 0, data.orbitRadius, data.orbitRadius, 0, 2 * Math.PI);
            const points = orbitCurve.getPoints(400);
            const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
            const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x444444 });
            const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
            scene.add(orbitLine);

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = '40px Arial';
            context.fillStyle = 'white';
            context.fillText(data.name, 0, 40);
            const texture = new THREE.CanvasTexture(canvas);
            const labelMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const label = new THREE.Sprite(labelMaterial);
            label.scale.set(50, 25, 1);
            scene.add(label);
            labels.push({ sprite: label, planet: planet });

            if (data.name === 'Earth') {
                const moonOrbit = new THREE.Object3D();
                planet.add(moonOrbit);
                const moon = new THREE.Mesh(
                    new THREE.SphereGeometry(1.5, 16, 16),
                    new THREE.MeshPhongMaterial({ color: 0xaaaaaa, shininess: 10 })
                );
                moon.position.x = 12;
                moonOrbit.add(moon);
                planets.push({ mesh: moon, orbit: moonOrbit, speed: 0.0005, name: 'Moon' });

                const moonCanvas = document.createElement('canvas');
                const moonContext = moonCanvas.getContext('2d');
                moonContext.font = '40px Arial';
                moonContext.fillStyle = 'white';
                moonContext.fillText('Moon', 0, 40);
                const moonTextureCanvas = new THREE.CanvasTexture(moonCanvas);
                const moonLabelMaterial = new THREE.SpriteMaterial({ map: moonTextureCanvas, transparent: true });
                const moonLabel = new THREE.Sprite(moonLabelMaterial);
                moonLabel.scale.set(50, 25, 1);
                scene.add(moonLabel);
                labels.push({ sprite: moonLabel, planet: moon });
            }
        });

        camera.position.set(0, 400, 1000);
        controls.update();


        const pauseButton = document.querySelector('#toggle-motion');
        function updatePauseLabel() { pauseButton.textContent = paused ? 'Resume motion' : 'Pause motion'; pauseButton.setAttribute('aria-pressed', String(paused)); }
        pauseButton.addEventListener('click',()=>{paused=!paused;controls.autoRotate=!paused;updatePauseLabel();});
        updatePauseLabel();
        document.querySelector('#reset-view').addEventListener('click',()=>{camera.position.set(0,400,1000);controls.target.set(0,0,0);controls.update();});
        document.querySelector('#toggle-labels').addEventListener('click',event=>{const visible=event.currentTarget.getAttribute('aria-pressed')!=='true';event.currentTarget.setAttribute('aria-pressed',String(visible));event.currentTarget.textContent=visible?'Hide labels':'Show labels';labels.forEach(label=>label.sprite.visible=visible);});
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const delta = Math.min(clock.getDelta(), .05);
            if(!paused) {
                planets.forEach(p=>{p.orbit.rotation.y+=p.speed*delta*1200;p.mesh.rotation.y+=delta*.12;});
                sun.rotation.y+=delta*.03;
            }
            controls.update();
            labels.forEach(label=>{const position=label.planet.getWorldPosition(new THREE.Vector3());label.sprite.position.copy(position.add(new THREE.Vector3(0,20,0)));});
            renderer.render(scene,camera);
        }
        animate();
        window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

} catch(error) {document.querySelector('#simulation-error').hidden=false;document.querySelectorAll('.simulation-buttons button').forEach(button=>button.disabled=true);}
