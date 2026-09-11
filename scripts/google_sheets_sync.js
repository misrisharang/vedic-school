/**
 * ============================================================================
 * THE VEDIC SCHOOL — SUPABASE TO GOOGLE SHEETS REAL-TIME SYNC
 * ============================================================================
 * 
 * Google Spreadsheet: https://docs.google.com/spreadsheets/d/153ysYM60jXdZZhELbMo9sJfac-1KOk0U2zWjpihNVZ8/edit
 * 
 * Worksheets Managed:
 * 1. "All Inquiries"       (source: public.inquiries)
 * 2. "Demo Registrations"  (source: public.registrations WHERE registration_type = 'demo')
 * 3. "Personal Assessments" (source: public.registrations WHERE registration_type = 'assessment')
 * 
 * ============================================================================
 */

// Optional security token: If set, webhook requests must provide ?secret=YOUR_TOKEN
var API_SECRET = "";

// Sheet Names
var SHEET_INQUIRIES = "All Inquiries";
var SHEET_DEMO = "Demo Registrations";
var SHEET_ASSESSMENT = "Personal Assessments";

// Column Definitions
var COLS_INQUIRIES = [
  "Date",
  "Name",
  "Email",
  "WhatsApp Country",
  "WhatsApp Country Code",
  "WhatsApp Number",
  "Grade",
  "Inquiry Type",
  "Message",
  "Inquiry ID"
];

var COLS_DEMO = [
  "Registration Date",
  "Parent Name",
  "Child Name",
  "WhatsApp Country",
  "WhatsApp Country Code",
  "WhatsApp Number",
  "Child Grade",
  "Email",
  "WhatsApp Consent",
  "Demo Date",
  "Class Link",
  "Registration ID",
  "Saturday Sent",
  "2-Hour Sent",
  "30-Min Sent"
];

var COLS_ASSESSMENT = [
  "Registration Date",
  "Parent Name",
  "Child Name",
  "WhatsApp Country",
  "WhatsApp Country Code",
  "WhatsApp Number",
  "Grade",
  "Board",
  "Support Needed",
  "Email",
  "WhatsApp Consent",
  "Registration ID"
];

var SPREADSHEET_ID = "153ysYM60jXdZZhELbMo9sJfac-1KOk0U2zWjpihNVZ8";

/**
 * Returns the spreadsheet instance.
 * Tries getActiveSpreadsheet() first; falls back to openById() for Web App / Standalone contexts.
 */
function getSpreadsheet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) {}
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// ============================================================================
// TOP-LEVEL RUNNABLE FUNCTIONS (Visible in Apps Script Function Dropdown)
// ============================================================================

/**
 * 1. INITIAL SETUP FUNCTION
 * Run this function from the dropdown to initialize all 3 worksheets with:
 * - Proper tab names
 * - Styled, bold header rows with dark slate background (#2C3338) and white text
 * - Frozen top header row
 * - Proper column widths (expanded for Message, Support Needed, Email, UUIDs)
 * - Safe removal of default blank "Sheet1"
 */
function setupAllWorksheets() {
  var ss = getSpreadsheet();

  initSheet(ss, SHEET_INQUIRIES, COLS_INQUIRIES);
  initSheet(ss, SHEET_DEMO, COLS_DEMO);
  initSheet(ss, SHEET_ASSESSMENT, COLS_ASSESSMENT);

  // Remove default blank "Sheet1" if other sheets exist
  var defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch (err) {
      // Ignore if cannot delete
    }
  }

  ss.toast("All 3 worksheets initialized with headers and styling!", "Setup Complete", 5);
}

/**
 * Triggered automatically when the spreadsheet is opened.
 * Adds 'The Vedic School' menu to the Google Sheet toolbar.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("The Vedic School")
    .addItem("Initialize / Reset Sheet Headers", "setupAllWorksheets")
    .addToUi();
}

/**
 * Test function: Inserts or updates a mock inquiry into 'All Inquiries'.
 * Select 'testInquirySync' from the dropdown and click 'Run' to test without Supabase.
 */
function testInquirySync() {
  var ss = getSpreadsheet();
  var mockInquiry = {
    id: "test-inquiry-uuid-001",
    name: "Test Parent",
    email: "test.parent@example.com",
    whatsapp_country: "India",
    whatsapp_country_code: "+91",
    whatsapp: "9876543210",
    grade: "Grade 6",
    inquiry_type: "Vedic Maths Course",
    message: "Test inquiry message submitted at " + new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  var res = syncInquiryRecord(ss, mockInquiry);
  Logger.log("testInquirySync result: " + res);
  ss.toast("Test inquiry synced: " + res, "Success", 5);
}

/**
 * Test function: Inserts or updates a mock demo into 'Demo Registrations'.
 * Select 'testDemoSync' from the dropdown and click 'Run' to test without Supabase.
 */
function testDemoSync() {
  var ss = getSpreadsheet();
  var mockDemo = {
    id: "test-demo-uuid-001",
    registration_type: "demo",
    parent_name: "Test Demo Parent",
    child_name: "Test Child",
    whatsapp_country: "United Kingdom",
    whatsapp_country_code: "+44",
    whatsapp: "7911123456",
    grade: "Grade 5",
    email: "test.demo@example.com",
    whatsapp_consent: true,
    demo_date: "Next Sunday at 11:30 AM IST",
    class_link: "https://meet.google.com/test-demo",
    created_at: new Date().toISOString()
  };

  var res = syncDemoRecord(ss, mockDemo);
  Logger.log("testDemoSync result: " + res);
  ss.toast("Test demo synced: " + res, "Success", 5);
}

/**
 * Test function: Inserts or updates a mock assessment into 'Personal Assessments'.
 * Select 'testAssessmentSync' from the dropdown and click 'Run' to test without Supabase.
 */
function testAssessmentSync() {
  var ss = getSpreadsheet();
  var mockAssessment = {
    id: "test-assess-uuid-001",
    registration_type: "assessment",
    parent_name: "Test Assessment Parent",
    child_name: "Test Assessment Child",
    whatsapp_country: "United Arab Emirates",
    whatsapp_country_code: "+971",
    whatsapp: "501234567",
    grade: "Grade 7",
    board: "CBSE",
    support_needed: "Needs help with mental calculations and fractions",
    email: "test.assess@example.com",
    whatsapp_consent: true,
    created_at: new Date().toISOString()
  };

  var res = syncAssessmentRecord(ss, mockAssessment);
  Logger.log("testAssessmentSync result: " + res);
  ss.toast("Test assessment synced: " + res, "Success", 5);
}

// ============================================================================
// WEBHOOK ENDPOINTS
// ============================================================================

/**
 * Main Webhook Receiver: Processes POST requests from Supabase Database Webhooks.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (lockError) {
    return jsonResponse({ success: false, error: "Server busy, lock acquisition timed out" }, 503);
  }

  try {
    // 1. Verify Secret if configured
    if (API_SECRET) {
      var providedSecret = (e && e.parameter && e.parameter.secret) ? e.parameter.secret : "";
      if (providedSecret !== API_SECRET) {
        return jsonResponse({ success: false, error: "Unauthorized: Invalid secret token" }, 401);
      }
    }

    // 2. Validate payload
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: "Empty request payload" }, 400);
    }

    var payload = JSON.parse(e.postData.contents);
    var ss = getSpreadsheet();

    // 3. Batch Backfill Mode (used by backfill_to_sheets.py)
    if (payload.action === "backfill") {
      setupAllWorksheets();
      var inqCount = 0;
      var demoCount = 0;
      var assessCount = 0;

      if (payload.inquiries && payload.inquiries.length) {
        for (var i = 0; i < payload.inquiries.length; i++) {
          syncInquiryRecord(ss, payload.inquiries[i]);
          inqCount++;
        }
      }

      if (payload.registrations && payload.registrations.length) {
        for (var j = 0; j < payload.registrations.length; j++) {
          var reg = payload.registrations[j];
          if (reg.registration_type === "demo") {
            syncDemoRecord(ss, reg);
            demoCount++;
          } else if (reg.registration_type === "assessment") {
            syncAssessmentRecord(ss, reg);
            assessCount++;
          }
        }
      }

      return jsonResponse({
        success: true,
        message: "Backfill completed successfully",
        stats: { inquiries: inqCount, demo: demoCount, assessment: assessCount }
      });
    }

    // 4. Supabase Database Webhook payload handling
    var table = payload.table || (payload.record && payload.record.table) || "";
    var record = payload.record || payload.data || payload;

    if (!record || !record.id) {
      return jsonResponse({ success: false, error: "Missing record or record id in payload" }, 400);
    }

    var resultStatus = "";

    // Route to appropriate sheet
    if (table === "inquiries" || (!table && record.inquiry_type !== undefined)) {
      resultStatus = syncInquiryRecord(ss, record);
    } else if (table === "registrations" || (!table && record.registration_type !== undefined)) {
      if (record.registration_type === "demo") {
        resultStatus = syncDemoRecord(ss, record);
      } else if (record.registration_type === "assessment") {
        resultStatus = syncAssessmentRecord(ss, record);
      } else {
        return jsonResponse({ success: false, error: "Unknown registration_type: " + record.registration_type }, 400);
      }
    } else {
      return jsonResponse({ success: false, error: "Unknown table: " + table }, 400);
    }

    return jsonResponse({ success: true, result: resultStatus });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check endpoint for testing Web App connectivity in browser.
 */
function doGet(e) {
  return jsonResponse({
    status: "ok",
    service: "The Vedic School Google Sheets Sync",
    time: new Date().toISOString()
  });
}

// ============================================================================
// RECORD SYNC & UPSERT HELPERS
// ============================================================================

/**
 * Initializes a single sheet with header styling, frozen row, and column widths.
 */
function initSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  // Freeze header row
  sheet.setFrozenRows(1);

  // Style header row: Dark slate header with white text
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setFontWeight("bold")
    .setBackground("#2C3338")
    .setFontColor("#FFFFFF")
    .setFontFamily("Arial")
    .setFontSize(10)
    .setVerticalAlignment("middle");

  sheet.setRowHeight(1, 38);

  // Column auto-sizing and padding
  for (var c = 1; c <= headers.length; c++) {
    sheet.autoResizeColumn(c);
    var colWidth = sheet.getColumnWidth(c);
    if (colWidth < 120) {
      sheet.setColumnWidth(c, 120);
    }
  }

  // Widen specific long-text columns
  for (var i = 0; i < headers.length; i++) {
    if (headers[i] === "Message") {
      sheet.setColumnWidth(i + 1, 340);
    }
    if (headers[i] === "Support Needed") {
      sheet.setColumnWidth(i + 1, 280);
    }
    if (headers[i] === "Inquiry ID" || headers[i] === "Registration ID") {
      sheet.setColumnWidth(i + 1, 280);
    }
    if (headers[i] === "Email") {
      sheet.setColumnWidth(i + 1, 220);
    }
  }

  return sheet;
}

/**
 * Sync an inquiry record into 'All Inquiries'.
 * Upserts by Inquiry ID (Col 10).
 */
function syncInquiryRecord(ss, record) {
  var sheet = ss.getSheetByName(SHEET_INQUIRIES) || initSheet(ss, SHEET_INQUIRIES, COLS_INQUIRIES);
  var id = String(record.id || "").trim();
  if (!id) return "Skipped (no id)";

  var rowData = [
    formatDate(record.created_at),
    cleanStr(record.name),
    cleanStr(record.email),
    cleanStr(record.whatsapp_country),
    formatTextCode(record.whatsapp_country_code),
    formatTextPhone(record.whatsapp),
    cleanStr(record.grade),
    cleanStr(record.inquiry_type),
    cleanStr(record.message),
    id
  ];

  var ID_COL = 10;
  return upsertRow(sheet, ID_COL, id, rowData);
}

/**
 * Sync a demo registration into 'Demo Registrations'.
 * Upserts by Registration ID (Col 12).
 */
function syncDemoRecord(ss, record) {
  var sheet = ss.getSheetByName(SHEET_DEMO) || initSheet(ss, SHEET_DEMO, COLS_DEMO);
  var id = String(record.id || "").trim();
  if (!id) return "Skipped (no id)";

  var rowData = [
    formatDate(record.registered_at || record.created_at),
    cleanStr(record.parent_name),
    cleanStr(record.child_name),
    cleanStr(record.whatsapp_country),
    formatTextCode(record.whatsapp_country_code),
    formatTextPhone(record.whatsapp),
    cleanStr(record.grade),
    cleanStr(record.email),
    record.whatsapp_consent !== undefined ? Boolean(record.whatsapp_consent) : true,
    record.demo_date ? formatDate(record.demo_date) : "",
    cleanStr(record.class_link),
    id,
    record.saturday_sent !== undefined ? Boolean(record.saturday_sent) : false,
    record.two_hour_sent !== undefined ? Boolean(record.two_hour_sent) : false,
    record.thirty_min_sent !== undefined ? Boolean(record.thirty_min_sent) : false
  ];

  var ID_COL = 12;
  return upsertRow(sheet, ID_COL, id, rowData);
}

/**
 * Sync a personal assessment into 'Personal Assessments'.
 * Upserts by Registration ID (Col 12).
 */
function syncAssessmentRecord(ss, record) {
  var sheet = ss.getSheetByName(SHEET_ASSESSMENT) || initSheet(ss, SHEET_ASSESSMENT, COLS_ASSESSMENT);
  var id = String(record.id || "").trim();
  if (!id) return "Skipped (no id)";

  var rowData = [
    formatDate(record.registered_at || record.created_at),
    cleanStr(record.parent_name),
    cleanStr(record.child_name),
    cleanStr(record.whatsapp_country),
    formatTextCode(record.whatsapp_country_code),
    formatTextPhone(record.whatsapp),
    cleanStr(record.grade),
    cleanStr(record.board),
    cleanStr(record.support_needed),
    cleanStr(record.email),
    record.whatsapp_consent !== undefined ? Boolean(record.whatsapp_consent) : true,
    id
  ];

  var ID_COL = 12;
  return upsertRow(sheet, ID_COL, id, rowData);
}

/**
 * Checks if targetId exists in idColIndex.
 * Updates row if found; appends new row if not found.
 */
function upsertRow(sheet, idColIndex, targetId, rowData) {
  var lastRow = sheet.getLastRow();
  var existingRow = -1;

  if (lastRow > 1) {
    var idRange = sheet.getRange(2, idColIndex, lastRow - 1, 1).getValues();
    for (var i = 0; i < idRange.length; i++) {
      if (String(idRange[i][0]).trim() === targetId) {
        existingRow = i + 2;
        break;
      }
    }
  }

  if (existingRow > 0) {
    var targetRange = sheet.getRange(existingRow, 1, 1, rowData.length);
    targetRange.setValues([rowData]);
    return "Updated row " + existingRow;
  } else {
    sheet.appendRow(rowData);
    var newRowIndex = sheet.getLastRow();

    // Set phone number and ID columns as plain text (@)
    sheet.getRange(newRowIndex, 5).setNumberFormat("@"); // Country Code
    sheet.getRange(newRowIndex, 6).setNumberFormat("@"); // WhatsApp Number
    sheet.getRange(newRowIndex, idColIndex).setNumberFormat("@"); // UUID

    return "Inserted row " + newRowIndex;
  }
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

function cleanStr(val) {
  if (val === null || val === undefined) return "";
  return String(val).trim();
}

function formatTextCode(val) {
  if (!val) return "";
  var s = String(val).trim();
  return s.charAt(0) === "+" ? "'" + s : s;
}

function formatTextPhone(val) {
  if (!val) return "";
  var s = String(val).trim();
  return s.charAt(0) === "+" ? "'" + s : s;
}

function formatDate(val) {
  if (!val) return "";
  try {
    var d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return Utilities.formatDate(d, "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
  } catch (e) {
    return String(val);
  }
}

function jsonResponse(obj, code) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
