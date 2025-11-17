
// --- CONFIGURACIÓN DE NIVELES ---
// Esta es una curva de XP "lineal". Cada nivel cuesta 1000 XP.
// Puedes hacerla más difícil después (ej. 1200, 1500...) si quieres.
const XP_PER_LEVEL = 1000;

/**
 * Traduce el XP total de un usuario a su Nivel y progreso actual.
 * @param {number} totalExp - El XP total acumulado por el usuario.
 * @returns {object} Un objeto con { level, currentLevelExp, expToNextLevel }
 */
export const calculateLevelData = (totalExp) => {
    // 1. Calcular el Nivel Actual
    // Math.floor(7500 / 1000) = 7. El nivel es 7 + 1 = 8.
    // Math.floor(50 / 1000) = 0. El nivel es 0 + 1 = 1.
    const level = Math.floor(totalExp / XP_PER_LEVEL) + 1;

    // 2. Calcular el XP necesario para el siguiente nivel
    // Nivel 8 * 1000 = 8000 XP.
    // Nivel 1 * 1000 = 1000 XP.
    const expForNextLevel = level * XP_PER_LEVEL;

    // 3. Calcular el XP necesario para el nivel actual (el "piso" de XP)
    // (Nivel 8 - 1) * 1000 = 7000 XP.
    // (Nivel 1 - 1) * 1000 = 0 XP.
    const expForThisLevel = (level - 1) * XP_PER_LEVEL;

    // 4. Calcular el XP que el usuario tiene *dentro* de su nivel actual
    // 7500 (total) - 7000 (piso) = 500 XP.
    // 50 (total) - 0 (piso) = 50 XP.
    const currentLevelExp = totalExp - expForThisLevel;

    // 5. Calcular el total de XP que este nivel requiere (el "denominador")
    // 8000 - 7000 = 1000 XP.
    // 1000 - 0 = 1000 XP.
    const expRequiredForLevel = expForNextLevel - expForThisLevel;

    return {
        level: level,             // ej. 8
        currentLevelExp: currentLevelExp, // ej. 500
        expToNextLevel: expRequiredForLevel // ej. 1000
    };
};