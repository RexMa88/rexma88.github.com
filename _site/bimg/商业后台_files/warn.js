/***************公共提示系统*******************/


var leftSeconds = 0;//提示框生命周期
var isTime=3;
var isArea='';
var isHeader='';
function clearAlertBox(isTime,isHeader)
{
	$("#showAlertBox").remove();
	if(isTime > 0) clearInterval(intervalIdFun);
	if(checkNull(isHeader) == false) return false;
	else window.location.href=isHeader;
}
/**
 * 显示文字
 * isTime 是否需要倒计时
 * isArea 是否指定显示区(选择显示区显示时不会有跳转和倒计时关闭)
 * isHeader 是否跳转
 */
function WornAjax(word,isTime,isArea,isHeader){
	if($("#showAlertBox").length >0 && $("#showAlertBox").attr('display') != 'none') return false;
	//指定显示位置
	
	if(checkNull(isArea) != false ){
		$("#"+isArea).html(word);
		return false;
	}else{
		$("#showAlertWoldBox").html(word);
	}
	
	var html = createDivHtml(word,isTime,isHeader);
	$("body").append(html);
	leftSeconds = isTime - 1;
	
	if(isTime > 0) {
		if(checkNull(isHeader) == false) var op = '关闭';
		else var op = '跳转';
		$("#showAlertBoxLetfTime").html("<font style='color:red;font-widght:900;'>"+isTime+"</font>秒后"+op);
		intervalIdFun = setInterval("pageDownAjax('"+isHeader+"')",1000);
	}else{
		$("#showAlertBoxLetfTime").html('');
	}
}

function pageDownAjax(isHeader)
{
	if(checkNull(isHeader) == false) var op = '关闭';
	else var op = '跳转';
	$("#showAlertBoxLetfTime").html("<font style='color:red;font-widght:900;'>"+leftSeconds+"</font>秒后"+op);
	if( leftSeconds == 0) {
		clearAlertBox(1,isHeader);
		//if(isHeader != undefined) window.location.href=isHeader;
		return false;
	}
	leftSeconds = leftSeconds - 1;
}

/**
 * 生成容器代码
 */
function createDivHtml(wold,isTime,isHeader)
{
	var html = '<div id="showAlertBox"><div id="jospTimeShowBox"><span id="showAlertBoxLetfTime"></span><span id="closeWarnBox"><a href="javascript:void(0);" onclick="javascript:clearAlertBox('+isTime+',\''+isHeader+'\');">关闭</a></span></div><div id="showAlertWoldBox_Box"><img src="/static/img/warning-large.png"></img><span id="showAlertWoldBox">'+wold+'</span></div></div>';
	return html;
}

function checkNull(keyVal){
	if(keyVal == undefined || keyVal == 'undefined' || keyVal == '' || keyVal == 0 ) return false;
	else return keyVal;
}