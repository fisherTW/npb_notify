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
	var acc = getAccToken(code);
	
	notify(acc, '提醒：精彩直播 馬上開始');
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