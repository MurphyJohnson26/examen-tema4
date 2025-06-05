// Script mejorado para la aplicación VR con interacción completa
console.log("🥽 Aplicación Web VR - Examen Tema 4 (Versión Mejorada)")

// Variables globales
let scene,
  camera,
  interactiveObjects = []
let environmentObjects = []
let floatingObjects = []
let isVRMode = false

// Colores para diferentes tipos de objetos
const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#FF6347",
  "#9ACD32",
  "#20B2AA",
  "#FFD700",
  "#FF69B4",
]

const environmentColors = [
  "#F0F8FF",
  "#E6E6FA",
  "#FFFFFF",
  "#FFF8DC",
  "#F5F5DC",
  "#FFFACD",
  "#F0FFFF",
  "#F8F8FF",
  "#FFFAFA",
  "#F5F5F5",
]

// Esperar a que A-Frame esté listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, inicializando aplicación VR mejorada...")

  // Ocultar pantalla de carga
  setTimeout(() => {
    const loadingScreen = document.getElementById("loadingScreen")
    if (loadingScreen) {
      loadingScreen.style.opacity = "0"
      loadingScreen.style.transition = "opacity 1s ease-out"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 1000)
    }
  }, 2000)

  // Inicializar cuando A-Frame esté listo
  const sceneEl = document.querySelector("a-scene")
  if (sceneEl.hasLoaded) {
    initializeVRApp()
  } else {
    sceneEl.addEventListener("loaded", initializeVRApp)
  }
})

function initializeVRApp() {
  console.log("🎮 Inicializando aplicación VR mejorada...")

  scene = document.querySelector("a-scene")
  camera = document.querySelector("#camera")

  // Obtener todos los objetos interactivos
  interactiveObjects = document.querySelectorAll(".interactive-object")
  environmentObjects = document.querySelectorAll(".environment-object")
  floatingObjects = document.querySelectorAll(".floating-object")

  console.log(`📦 ${interactiveObjects.length} objetos interactivos totales`)
  console.log(`🏠 ${environmentObjects.length} objetos del entorno`)
  console.log(`✨ ${floatingObjects.length} objetos flotantes`)

  // Verificar si el modelo GLB se cargó
  checkBathroomModel()

  // Configurar eventos de interacción
  setupInteractionEvents()

  // Configurar eventos VR
  setupVREvents()

  // Configurar animaciones aleatorias
  setupRandomAnimations()

  // Configurar controles VR mejorados
  setupVRControls()

  console.log("✅ Aplicación VR mejorada inicializada correctamente")
}

function checkBathroomModel() {
  const bathroomModel = document.querySelector("#bathroom-scene")
  const bathroomEnvironment = document.querySelector("#bathroom-environment")

  // Intentar mostrar el modelo GLB después de 3 segundos
  setTimeout(() => {
    if (bathroomModel && bathroomModel.getAttribute("gltf-model")) {
      console.log("📦 Intentando cargar modelo GLB...")
      bathroomModel.setAttribute("visible", true)
      // Mantener el entorno básico visible también
      bathroomEnvironment.setAttribute("visible", true)
    } else {
      console.log("🏠 Usando entorno básico creado con primitivas")
      bathroomEnvironment.setAttribute("visible", true)
    }
  }, 3000)
}

function setupInteractionEvents() {
  console.log("🤚 Configurando eventos de interacción mejorados...")

  // Configurar interacciones para objetos del entorno
  environmentObjects.forEach((object, index) => {
    setupEnvironmentObjectInteraction(object)
  })

  // Configurar interacciones para objetos flotantes
  floatingObjects.forEach((object, index) => {
    setupFloatingObjectInteraction(object)
  })
}

function setupEnvironmentObjectInteraction(object) {
  // Eventos para objetos del entorno (paredes, bañera, etc.)
  object.addEventListener("mouseenter", function () {
    console.log(`🏠 Hover sobre objeto del entorno: ${this.id}`)

    // Efecto sutil de brillo para objetos del entorno
    const currentMaterial = this.getAttribute("material")
    this.setAttribute("material", {
      ...currentMaterial,
      emissive: "#FFFF00",
      emissiveIntensity: 0.1,
    })
  })

  object.addEventListener("mouseleave", function () {
    // Quitar brillo
    const currentMaterial = this.getAttribute("material")
    this.setAttribute("material", {
      ...currentMaterial,
      emissive: "#000000",
      emissiveIntensity: 0,
    })
  })

  object.addEventListener("click", function () {
    console.log(`🎯 Interacción con objeto del entorno: ${this.id}`)

    // Cambiar color del objeto del entorno
    const randomColor = environmentColors[Math.floor(Math.random() * environmentColors.length)]
    this.setAttribute("material", "color", randomColor)

    // Efecto de vibración sutil
    this.setAttribute("animation__shake", {
      property: "position",
      to: `${this.getAttribute("position").x + 0.1} ${this.getAttribute("position").y} ${this.getAttribute("position").z}`,
      dur: 100,
      direction: "alternate",
      loop: 3,
    })

    // Crear ondas desde el punto de interacción
    createRippleEffect(this.getAttribute("position"))
  })
}

function setupFloatingObjectInteraction(object) {
  // Eventos para objetos flotantes (los 16 objetos 3D)
  object.addEventListener("mouseenter", function () {
    console.log(`✨ Hover sobre objeto flotante: ${this.id}`)

    // Efecto de escala más dramático
    this.setAttribute("animation__hover", {
      property: "scale",
      to: "1.4 1.4 1.4",
      dur: 300,
      easing: "easeOutQuad",
    })

    // Efecto de brillo intenso
    const currentMaterial = this.getAttribute("material")
    this.setAttribute("material", {
      ...currentMaterial,
      emissive: "#FFFFFF",
      emissiveIntensity: 0.3,
    })
  })

  object.addEventListener("mouseleave", function () {
    // Volver al tamaño normal
    this.setAttribute("animation__hover", {
      property: "scale",
      to: "1 1 1",
      dur: 300,
      easing: "easeOutQuad",
    })

    // Quitar brillo
    const currentMaterial = this.getAttribute("material")
    this.setAttribute("material", {
      ...currentMaterial,
      emissive: "#000000",
      emissiveIntensity: 0,
    })
  })

  object.addEventListener("click", function () {
    console.log(`🎯 Interacción con objeto flotante: ${this.id}`)

    // Cambiar color aleatoriamente
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    this.setAttribute("material", "color", randomColor)

    // Efecto de teletransporte
    const newX = (Math.random() - 0.5) * 10
    const newY = 1 + Math.random() * 3
    const newZ = -8 + Math.random() * 8

    this.setAttribute("animation__teleport", {
      property: "position",
      to: `${newX} ${newY} ${newZ}`,
      dur: 1000,
      easing: "easeInOutQuad",
    })

    // Efecto de rotación rápida
    this.setAttribute("animation__spin", {
      property: "rotation",
      to: `${Math.random() * 720} ${Math.random() * 720} ${Math.random() * 720}`,
      dur: 1000,
      easing: "easeOutBounce",
    })

    // Crear efecto de partículas en la posición original
    createParticleExplosion(this.getAttribute("position"))
  })
}

function setupVREvents() {
  console.log("🥽 Configurando eventos VR mejorados...")

  const sceneEl = document.querySelector("a-scene")

  sceneEl.addEventListener("enter-vr", () => {
    console.log("🎮 Entrando en modo VR")
    isVRMode = true

    // Ocultar instrucciones en VR
    const instructions = document.getElementById("instructions")
    if (instructions) {
      instructions.style.display = "none"
    }

    // Activar controles VR específicos
    enableVRControls()
  })

  sceneEl.addEventListener("exit-vr", () => {
    console.log("🖥️ Saliendo del modo VR")
    isVRMode = false

    // Mostrar instrucciones
    const instructions = document.getElementById("instructions")
    if (instructions) {
      instructions.style.display = "block"
    }
  })
}

function setupVRControls() {
  console.log("🎮 Configurando controles VR con joysticks...")

  const leftHand = document.querySelector("#leftHand")
  const rightHand = document.querySelector("#rightHand")

  // Eventos para mano izquierda
  if (leftHand) {
    leftHand.addEventListener("triggerdown", function () {
      console.log("👈 Trigger izquierdo presionado")
      createHandEffect(this.getAttribute("position"), "#ff0000")
      randomizeNearbyObjects(this.getAttribute("position"))
    })

    leftHand.addEventListener("gripdown", () => {
      console.log("👈 Grip izquierdo presionado")
      teleportToRandomLocation()
    })
  }

  // Eventos para mano derecha
  if (rightHand) {
    rightHand.addEventListener("triggerdown", function () {
      console.log("👉 Trigger derecho presionado")
      createHandEffect(this.getAttribute("position"), "#0000ff")
      explodeNearbyObjects(this.getAttribute("position"))
    })

    rightHand.addEventListener("gripdown", () => {
      console.log("👉 Grip derecho presionado")
      resetAllObjectsToOriginalPositions()
    })
  }
}

function enableVRControls() {
  console.log("🎮 Activando controles VR específicos...")

  // Configurar movement-controls para joysticks
  const rig = document.querySelector("#rig")
  if (rig) {
    rig.setAttribute("movement-controls", {
      fly: false,
      constrainToNavMesh: false,
      speed: 0.3,
      camera: "#camera",
    })
  }
}

function setupRandomAnimations() {
  console.log("🎭 Configurando animaciones aleatorias distribuidas...")

  floatingObjects.forEach((object, index) => {
    // Crear animación de rotación única para cada objeto
    const randomDuration = 3000 + Math.random() * 8000
    const randomX = Math.random() * 720
    const randomY = Math.random() * 720
    const randomZ = Math.random() * 720

    object.setAttribute("animation", {
      property: "rotation",
      to: `${randomX} ${randomY} ${randomZ}`,
      loop: true,
      dur: randomDuration,
      easing: "linear",
    })

    // Animación de flotación sutil
    const floatDuration = 2000 + Math.random() * 4000
    const floatHeight = 0.2 + Math.random() * 0.4

    object.setAttribute("animation__float", {
      property: "position.y",
      to: `+=${floatHeight}`,
      dur: floatDuration,
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    })
  })
}

function createParticleExplosion(position) {
  console.log("💥 Creando explosión de partículas")

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("a-sphere")
    particle.setAttribute("radius", 0.08)
    particle.setAttribute("material", {
      color: colors[Math.floor(Math.random() * colors.length)],
      transparent: true,
      opacity: 0.9,
      emissive: colors[Math.floor(Math.random() * colors.length)],
      emissiveIntensity: 0.5,
    })

    const offsetX = (Math.random() - 0.5) * 4
    const offsetY = Math.random() * 3
    const offsetZ = (Math.random() - 0.5) * 4

    particle.setAttribute("position", {
      x: position.x,
      y: position.y,
      z: position.z,
    })

    // Animación de explosión
    particle.setAttribute("animation", {
      property: "position",
      to: {
        x: position.x + offsetX,
        y: position.y + offsetY + 2,
        z: position.z + offsetZ,
      },
      dur: 2000,
      easing: "easeOutQuad",
    })

    // Animación de rotación
    particle.setAttribute("animation__spin", {
      property: "rotation",
      to: `${Math.random() * 720} ${Math.random() * 720} ${Math.random() * 720}`,
      dur: 2000,
      loop: true,
    })

    // Animación de desvanecimiento
    particle.setAttribute("animation__fade", {
      property: "material.opacity",
      from: 0.9,
      to: 0,
      dur: 2000,
    })

    scene.appendChild(particle)

    // Eliminar partícula después de la animación
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle)
      }
    }, 2100)
  }
}

function createRippleEffect(position) {
  console.log("🌊 Creando efecto de ondas")

  for (let i = 0; i < 3; i++) {
    const ripple = document.createElement("a-ring")
    ripple.setAttribute("radius-inner", 0.1)
    ripple.setAttribute("radius-outer", 0.2)
    ripple.setAttribute("material", {
      color: "#00BFFF",
      transparent: true,
      opacity: 0.6,
    })
    ripple.setAttribute("position", position)
    ripple.setAttribute("rotation", "-90 0 0")

    // Animación de expansión
    setTimeout(() => {
      ripple.setAttribute("animation", {
        property: "geometry.radiusOuter",
        from: 0.2,
        to: 3,
        dur: 1500,
        easing: "easeOutQuad",
      })

      ripple.setAttribute("animation__fade", {
        property: "material.opacity",
        from: 0.6,
        to: 0,
        dur: 1500,
      })
    }, i * 200)

    scene.appendChild(ripple)

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple)
      }
    }, 1700)
  }
}

function createHandEffect(position, color) {
  const effect = document.createElement("a-ring")
  effect.setAttribute("radius-inner", 0.1)
  effect.setAttribute("radius-outer", 0.3)
  effect.setAttribute("material", {
    color: color,
    transparent: true,
    opacity: 0.8,
  })
  effect.setAttribute("position", position)

  effect.setAttribute("animation", {
    property: "scale",
    from: "0.1 0.1 0.1",
    to: "3 3 3",
    dur: 800,
  })

  effect.setAttribute("animation__fade", {
    property: "material.opacity",
    from: 0.8,
    to: 0,
    dur: 800,
  })

  scene.appendChild(effect)

  setTimeout(() => {
    if (effect.parentNode) {
      effect.parentNode.removeChild(effect)
    }
  }, 900)
}

function randomizeNearbyObjects(position) {
  floatingObjects.forEach((object) => {
    const objPos = object.getAttribute("position")
    const distance = Math.sqrt(
      Math.pow(objPos.x - position.x, 2) + Math.pow(objPos.y - position.y, 2) + Math.pow(objPos.z - position.z, 2),
    )

    if (distance < 3) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      object.setAttribute("material", "color", randomColor)
    }
  })
}

function explodeNearbyObjects(position) {
  floatingObjects.forEach((object) => {
    const objPos = object.getAttribute("position")
    const distance = Math.sqrt(
      Math.pow(objPos.x - position.x, 2) + Math.pow(objPos.y - position.y, 2) + Math.pow(objPos.z - position.z, 2),
    )

    if (distance < 2) {
      createParticleExplosion(objPos)
    }
  })
}

function teleportToRandomLocation() {
  const rig = document.querySelector("#rig")
  const newX = (Math.random() - 0.5) * 8
  const newZ = -8 + Math.random() * 8

  rig.setAttribute("animation__teleport", {
    property: "position",
    to: `${newX} 1.6 ${newZ}`,
    dur: 500,
    easing: "easeInOutQuad",
  })
}

function resetAllObjectsToOriginalPositions() {
  console.log("🔄 Reseteando posiciones de objetos")
  // Esta función podría implementarse para volver a las posiciones originales
  floatingObjects.forEach((object) => {
    object.setAttribute("scale", "1 1 1")
    const currentMaterial = object.getAttribute("material")
    object.setAttribute("material", {
      ...currentMaterial,
      emissive: "#000000",
      emissiveIntensity: 0,
    })
  })
}

// Exponer funciones para debugging
window.vrApp = {
  teleport: teleportToRandomLocation,
  explode: (pos = { x: 0, y: 2, z: -3 }) => createParticleExplosion(pos),
  ripple: (pos = { x: 0, y: 0, z: -3 }) => createRippleEffect(pos),
  isVRMode: () => isVRMode,
  objectCount: () => ({
    total: interactiveObjects.length,
    environment: environmentObjects.length,
    floating: floatingObjects.length,
  }),
}

console.log("🚀 Script VR mejorado cargado")
console.log("💡 Prueba: vrApp.explode() para crear explosión")
console.log("💡 Prueba: vrApp.teleport() para teletransportarte")
