// Google Apps Script - Leadership Board Backend
// Deploy as Web App: Execute as "Me", Access "Anyone"

// Sheet configuration
var SHEET_NAME = 'Votes';
var ADMIN_SECRET = PropertiesService.getScriptProperties().getProperty('ADMIN_SECRET') || 'CHANGE_ME';

// Valid team members
var VALID_MEMBERS = [
  'Mohamed Atef',
  'Mauricio Atri',
  'Adele Aviles',
  'Andrei Balta',
  'Karim Beydoun',
  'Tina Chen',
  'Cassie Clavin',
  'Hakim Ghanem',
  'Raul Guadarrama',
  'Maddy Keeshan',
  'Rish Khara',
  'Gilbert Lemieux',
  'Hilda Lui',
  'Marco Mendes',
  'Neal Vachhani'
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var voter = data.voter;
    var first = data.first;
    var second = data.second;
    var third = data.third;

    // Validate all fields present
    if (!voter || !first || !second || !third) {
      return sendResponse({ success: false, error: 'All fields are required.' });
    }

    // Validate all are valid team members
    if (VALID_MEMBERS.indexOf(voter) === -1 ||
        VALID_MEMBERS.indexOf(first) === -1 ||
        VALID_MEMBERS.indexOf(second) === -1 ||
        VALID_MEMBERS.indexOf(third) === -1) {
      return sendResponse({ success: false, error: 'Invalid team member name.' });
    }

    // Validate no self-voting
    if (voter === first || voter === second || voter === third) {
      return sendResponse({ success: false, error: 'You cannot vote for yourself.' });
    }

    // Validate no duplicate choices
    if (first === second || first === third || second === third) {
      return sendResponse({ success: false, error: 'You cannot pick the same person twice.' });
    }

    // Get or create sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Voter', '1st Choice', '2nd Choice', '3rd Choice', 'Timestamp']);
    }

    // Check if voter already voted - overwrite if so
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var existingRow = -1;

    for (var i = 1; i < values.length; i++) {
      if (values[i][0] === voter) {
        existingRow = i + 1; // 1-indexed row number
        break;
      }
    }

    var timestamp = new Date().toISOString();
    var rowData = [voter, first, second, third, timestamp];

    if (existingRow > 0) {
      // Overwrite existing vote
      sheet.getRange(existingRow, 1, 1, 5).setValues([rowData]);
    } else {
      // New vote
      sheet.appendRow(rowData);
    }

    return sendResponse({ success: true, message: 'Vote recorded successfully.' });

  } catch (err) {
    return sendResponse({ success: false, error: 'Server error: ' + err.message });
  }
}

function doGet(e) {
  try {
    var secret = e.parameter.secret;

    if (!secret || secret !== ADMIN_SECRET) {
      return sendResponse({ success: false, error: 'Unauthorized.' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet || sheet.getLastRow() < 2) {
      return sendResponse({
        success: true,
        votes: [],
        totalMembers: VALID_MEMBERS.length,
        members: VALID_MEMBERS
      });
    }

    var dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5);
    var values = dataRange.getValues();

    var votes = values.map(function(row) {
      return {
        voter: row[0],
        first: row[1],
        second: row[2],
        third: row[3],
        timestamp: row[4]
      };
    });

    return sendResponse({
      success: true,
      votes: votes,
      totalMembers: VALID_MEMBERS.length,
      members: VALID_MEMBERS
    });

  } catch (err) {
    return sendResponse({ success: false, error: 'Server error: ' + err.message });
  }
}

function sendResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run once to set the admin secret
function setAdminSecret() {
  PropertiesService.getScriptProperties().setProperty('ADMIN_SECRET', 'YOUR_SECRET_HERE');
}
