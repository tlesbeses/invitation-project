/**
 * Google Apps Script — Receptor de confirmaciones de asistencia.
 *
 * Pegar este código en: Extensiones > Apps Script (dentro de tu Google Sheet).
 * Más tarde: Implementar > Nueva implementación > Web App,
 * con Ejecutar como = tú mismo y Quién tiene acceso = Cualquier persona.
 */

const SHEET_NAME = "Respuestas";

function doGet() {
  return respuesta(true, "El endpoint esta activo.");
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");

    const nombre = String(data.nombre || "").trim();
    const asistencia = String(data.asistencia || "").trim();
    const acompanantes = parseInt(data.acompanantes, 10);
    const nombresAcompanantes = String(data.nombresAcompanantes || "").trim();
    const comentario = String(data.comentario || "").trim();

    // Validaciones básicas
    if (!nombre) return respuesta(false, "El nombre es obligatorio.");
    if (!["Sí", "No"].includes(asistencia)) return respuesta(false, "Asistencia inválida.");
    if (!isFinite(acompanantes) || acompanantes < 0 || acompanantes > 6) {
      return respuesta(false, "El número de acompañantes es inválido.");
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    // Encabezados si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Fecha de registro", "Nombre", "Asistencia", "Acompañantes", "Nombres de acompañantes", "Comentario"]);
    }

    sheet.appendRow([
      new Date().toISOString().slice(0, 10),
      nombre,
      asistencia,
      acompanantes,
      nombresAcompanantes,
      comentario
    ]);

    return respuesta(true, "Confirmación registrada.");
  } catch (err) {
    return respuesta(false, "Error al procesar la solicitud.");
  }
}

function respuesta(ok, mensaje) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok, mensaje }))
    .setMimeType(ContentService.MimeType.JSON);
}