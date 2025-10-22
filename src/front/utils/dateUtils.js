// src/front/utils/dateUtils.js

/**
 * Calcula la fecha del primer día de la semana (por defecto, Lunes) para una fecha dada.
 * @param {Date} d - La fecha de referencia.
 * @param {number} weekStartsOn - El día en que empieza la semana (0=Domingo, 1=Lunes, ...). Por defecto es 1 (Lunes).
 * @returns {Date} La fecha del primer día de la semana.
 */
export const startOfWeek = (d, weekStartsOn = 1) => {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate()); // Clona la fecha sin la hora
  // Calcula cuántos días hay que retroceder para llegar al inicio de la semana
  const day = (date.getDay() + 7 - weekStartsOn) % 7;
  date.setDate(date.getDate() - day);
  return date;
};

/**
 * Añade un número específico de días a una fecha dada.
 * @param {Date} d - La fecha inicial.
 * @param {number} n - El número de días a añadir (puede ser negativo para restar).
 * @returns {Date} La nueva fecha.
 */
export const addDays = (d, n) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); // Clona la fecha sin la hora
  x.setDate(x.getDate() + n);
  return x;
};

/**
 * Genera una clave única en formato 'YYYY-MM-DD' para una fecha dada, basada en la hora local.
 * Es crucial para identificar días de forma consistente, independientemente de la zona horaria.
 * @param {Date} date - La fecha a convertir.
 * @returns {string} La fecha en formato 'YYYY-MM-DD'.
 */
export const localKey = (date) => {
  const y = date.getFullYear();
  // getMonth() devuelve 0-11, por eso sumamos 1
  const m = String(date.getMonth() + 1).padStart(2, "0"); // Asegura dos dígitos (ej. '01', '12')
  const d = String(date.getDate()).padStart(2, "0"); // Asegura dos dígitos (ej. '01', '31')
  return `${y}-${m}-${d}`;
};

/**
 * Formatea una fecha para mostrarla de forma legible (ej. "19 Oct").
 * @param {Date} date - La fecha a formatear.
 * @returns {string} La fecha formateada.
 */
export const fmtDay = (date) =>
  date
    // toLocaleDateString es ideal porque usa el formato local del usuario
    .toLocaleDateString(undefined, { day: "2-digit", month: "short" })
    .replace(".", ""); // Elimina puntos si los hubiera (depende del idioma)

/**
 * Obtiene la letra inicial del día de la semana para una fecha dada.
 * @param {Date} date - La fecha.
 * @returns {string} La letra del día ('D', 'L', 'M', 'X', 'J', 'V', 'S').
 */
export const dayLetter = (date) => ["D", "L", "M", "X", "J", "V", "S"][date.getDay()]; 