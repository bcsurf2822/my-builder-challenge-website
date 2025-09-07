// Three.js Background Animation
let scene, camera, renderer, particles, mouse;

function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 0.02,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Mouse
    mouse = new THREE.Vector2();
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    animate();
}

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Animate particles
    particles.rotation.y = elapsedTime * 0.05;
    particles.rotation.x = elapsedTime * 0.02;

    // Raycaster for mouse interaction (optional, subtle effect)
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(particles);
    if (intersects.length > 0) {
       // This is where you could add more complex interaction logic
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

const LAMBDA_URL = 'https://q2mvpi35crk7dnienocajyhmbi0vflyq.lambda-url.us-east-2.on.aws/';

function initContactForm() {
    const form = document.querySelector('.contact-form-container');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('.contact-submit-btn');
        const messageDiv = document.getElementById('form-message');

        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        messageDiv.style.display = 'none';

        // Get form data
        const formData = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        };

        console.log('Sending form data:', formData); // Debug log

        try {
            const response = await fetch(LAMBDA_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status); // Debug log

            if (response.ok) {
                const result = await response.json();
                console.log('Response data:', result); // Debug log
                showMessage('Message sent successfully! Thank you for reaching out.', 'success');
                form.reset();
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('Error response:', errorData); // Debug log
                showMessage('Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        }

        // Reset button
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    });
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';

    // Auto-hide after 10 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 10000);
}

// Initialize everything on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initThreeJS();
    initContactForm();
});