// moment.js required
var moment = Moment.moment;
Logger = BetterLog.useSpreadsheet('1IleoLsNHA58sQhsOG0vi9pMSDLvzCt98RaUp9gvO6-w');
var sheet_setting	= '1UJ6XNl7dnEbX0L2XU9Ybpwp3UeezIbfCpEl_WUDdBhY';
var url_auth		= 'https://notify-bot.line.me/oauth/token';
var url_notify		= 'https://notify-api.line.me/api/notify';
var url_redirect	= 'https://script.google.com/macros/s/AKfycbx3dFPPqrhppQ508EFDQPUo67UrnNZNL9rdCtJWyi5pJPaE0vw/exec';
var client_id		= getSetting(2, 1);
var client_secret	= getSetting(2, 2);

// after subscribe button click
function doGet(e) {
	var code = e.parameter.code;
	var accToken = getAccToken(code);
	
	writeDb('1700', accToken);
}

function checkDbAndNotify() {
	var spreadsheet = SpreadsheetApp.openById(sheet_setting);
	var sheet = spreadsheet.getSheets()[1];
	var ret = sheet.getSheetValues(1,1,sheet.getLastRow(),sheet.getLastColumn());
	for(var i=0; i < ret.length; i++) {
		// do this 30 min before
		if(moment(moment().add(1, 'h').valueOf()).format('HH') + '00' == ret[i][0]) {
			notify(ret[i][1], '提醒：精彩直播 馬上開始');
		} else {
			sheet.getRange("c"+(i+1)).setValue(moment(moment().add(1, 'h').valueOf()).format('HH') + '00');
			sheet.getRange("d"+(i+1)).setValue(ret[i][0]);
		}
	}
}

function writeDb(notifyTime, accToken) {
	var spreadsheet = SpreadsheetApp.openById(sheet_setting);
	var sheet = spreadsheet.getSheets()[1];
	var row_to_write = getFirstEmptyRowWholeRow();
	sheet.getRange("a"+row_to_write).setValue(notifyTime);
	sheet.getRange("b"+row_to_write).setValue(accToken);
}

function getFirstEmptyRowWholeRow() {
	var spreadsheet = SpreadsheetApp.openById(sheet_setting);
	var sheet = spreadsheet.getSheets()[1];
	var range = sheet.getDataRange();
	var values = range.getValues();
	var row = 0;
	for (var row=0; row<values.length; row++) {
	  if (!values[row].join("")) break;
	}
	return (row+1);
}

function getAccToken(code) {
	var ret = '';

	var formData = {
		'code': code,
		'grant_type': 'authorization_code',
		'redirect_uri': url_redirect,
		'client_id': client_id,
		'client_secret':client_secret
	};
	var options = {
		'method' : 'post',
		'payload' : formData
	};
		
	var response = UrlFetchApp.fetch(url_auth, options);
	var res = JSON.parse(response);
	
	if(res.status == 200) {
		ret = res.access_token;
	}
	return ret;
}

function notify(accToken, msg) {
	var option = {
		method: 'post',
		headers: { Authorization: 'Bearer ' + accToken },
		payload: {
			message: msg
		}
	};
	UrlFetchApp.fetch(url_notify, option);
}

// B4 x=2, y=4
function getSetting(x, y) {
	var spreadsheet = SpreadsheetApp.openById(sheet_setting);
	var sheet = spreadsheet.getSheets()[0];
	var ret = sheet.getSheetValues(y,x,1,1);

	return ret[0][0];
}