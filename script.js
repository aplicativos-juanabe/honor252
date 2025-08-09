// Script para cargar y mostrar el cuadro de honor dinámicamente

// Función para obtener la clase CSS según el puesto
function getPositionClass(position) {
  return `position-${position}`;
}

// Función para obtener el texto del puesto
function getPositionText(position) {
  const positions = {
    1: "1° Puesto",
    2: "2° Puesto",
    3: "3° Puesto",
  };
  return positions[position] || `${position}° Puesto`;
}

// Función para crear una tarjeta de estudiante
function createStudentCard(student) {
  return `
        <div class="student-card">
            <img src="${student.photo}" alt="Foto de ${
    student.name
  }" class="student-photo">
            <h3 class="student-name">${student.name}</h3>
            <div class="student-position ${getPositionClass(student.position)}">
                ${getPositionText(student.position)}
            </div>
        </div>
    `;
}

// Función para crear una sección de grupo
function createGroupSection(groupData) {
  const studentsHTML = groupData.students
    .map((student) => createStudentCard(student))
    .join("");

  return `
        <div class="group-section">
            <h3 class="group-title">${groupData.group}</h3>
            <div class="students-grid">
                ${studentsHTML}
            </div>
        </div>
    `;
}

// Función para crear una sección de grado
function createGradeSection(gradeData) {
  const groupsHTML = gradeData.groups
    .map((group) => createGroupSection(group))
    .join("");

  return `
        <div class="grade-section">
            <h2 class="grade-title">Grado ${gradeData.grade}</h2>
            ${groupsHTML}
        </div>
    `;
}

// Función principal para cargar los datos desde el archivo JSON
async function loadGallery() {
  try {
    const galleryContainer = document.getElementById("gallery-container");

    if (!galleryContainer) {
      console.error("Contenedor de galería no encontrado");
      return;
    }

    // Mostrar mensaje de carga
    galleryContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: white;">
                <h3>Cargando cuadro de honor...</h3>
                <p>Por favor espere un momento</p>
            </div>
        `;

    // Cargar datos desde el archivo JSON
    const response = await fetch("data.json");

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const studentsData = await response.json();

    // Generar HTML para todos los grados
    const galleryHTML = studentsData.grades
      .map((grade) => createGradeSection(grade))
      .join("");

    // Insertar el HTML en el contenedor
    galleryContainer.innerHTML = galleryHTML;

    console.log("Galería cargada exitosamente");
    console.log(`Total de grados: ${studentsData.grades.length}`);

    // Contar total de estudiantes
    const totalStudents = studentsData.grades.reduce((total, grade) => {
      return (
        total +
        grade.groups.reduce((gradeTotal, group) => {
          return gradeTotal + group.students.length;
        }, 0)
      );
    }, 0);

    console.log(`Total de estudiantes: ${totalStudents}`);
  } catch (error) {
    console.error("Error al cargar la galería:", error);
    const galleryContainer = document.getElementById("gallery-container");
    if (galleryContainer) {
      galleryContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: white;">
                    <h3>Error al cargar los datos</h3>
                    <p>Por favor, verifica que el archivo <strong>data.json</strong> esté disponible en la misma carpeta.</p>
                    <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 1rem;">
                        Error técnico: ${error.message}
                    </p>
                </div>
            `;
    }
  }
}

// Función para añadir efectos visuales adicionales
function addVisualEffects() {
  // Efecto de aparición gradual para las tarjetas
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Aplicar el efecto a todas las tarjetas después de un pequeño retraso
  setTimeout(() => {
    const cards = document.querySelectorAll(".student-card");
    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      card.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(card);
    });
  }, 100);
}

// Función para actualizar el periodo académico dinámicamente
function updateAcademicPeriod() {
  const periodElement = document.querySelector(".academic-period");
  if (periodElement) {
    const currentYear = new Date().getFullYear();
    periodElement.textContent = `Jornada Tarde - Segundo Periodo - Año ${currentYear}`;
  }
}

// Cargar la galería cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  loadGallery().then(() => {
    // Añadir efectos visuales después de cargar los datos
    addVisualEffects();
    // Actualizar el periodo académico
    updateAcademicPeriod();
  });
});

// Función para recargar los datos (útil para actualizaciones)
function reloadGallery() {
  console.log("Recargando galería...");
  loadGallery().then(() => {
    addVisualEffects();
  });
}

// Exponer función global para recargar si es necesario
window.reloadGallery = reloadGallery;
