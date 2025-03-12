// Инициализация сцены, камеры и рендера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Свет
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7).normalize();
scene.add(light);

// Простая модель птеродактиля (низкополигональная)
const pterodactylGeometry = new THREE.ConeGeometry(0.5, 1, 8); // Тело
const pterodactylMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const pterodactyl = new THREE.Mesh(pterodactylGeometry, pterodactylMaterial);
pterodactyl.rotation.x = Math.PI / 2;
scene.add(pterodactyl);

// Скалы (случайные объекты)
const rocks = [];
function createRock() {
  const geometry = new THREE.CylinderGeometry(0.5 + Math.random(), 1 + Math.random() * 3, Math.random() * 5 + 2, 8);
  const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
  const rock = new THREE.Mesh(geometry, material);

  rock.position.set(Math.random() * 20 - 10, Math.random() * -10 + 5, -30);
  rocks.push(rock);
  scene.add(rock);
}

// Создаем несколько скал
for (let i = 0; i < 10; i++) {
  createRock();
}

// Позиция камеры
camera.position.z = 5;

// Управление птеродактилем
let velocity = { x: 0, y: 0 };
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') velocity.y = -0.1;
  if (event.key === 'ArrowDown') velocity.y = 0.1;
});

window.addEventListener('keyup', () => {
  velocity.y = 0;
});

// Анимация
function animate() {
  requestAnimationFrame(animate);

  // Движение птеродактиля
  pterodactyl.position.y += velocity.y;

  // Движение скал к игроку
  rocks.forEach((rock) => {
    rock.position.z += 0.1;
    if (rock.position.z > camera.position.z) {
      rock.position.z = -30; // Перемещаем скалу назад
      rock.position.x = Math.random() * 20 - 10;
      rock.position.y = Math.random() * -10 + 5;
    }

    // Проверка столкновений (упрощенная)
    const distance = pterodactyl.position.distanceTo(rock.position);
    if (distance < 1) {
      alert('Вы проиграли!');
      window.location.reload();
    }
  });

  renderer.render(scene, camera);
}

animate();
