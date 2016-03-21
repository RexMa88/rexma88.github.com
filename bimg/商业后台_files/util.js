alertTime = 100000;
var timer_msg;
function fillUserMsg(message, fans, atme, pmsg, sysmesg, recommend) {
	$('#message').find('span').html(message);
	$('.mes_fans').text(fans);
	$('.mes_atme').text(atme);
	$('.mes_pmsg').text(pmsg);
	$('.mes_sysmesg').text(sysmesg);
	$('.mes_recom').text(recommend);
}

function getUserMsg ( ) {
	//checkHaveInvite();
	var url = server_url + 'msg/ajax_getMsg';
	var data = {};
	var callback = function ( r ) {
		if ( r != "" ) {
			if (r.indexOf('div')!=-1) {
				var $floatDiv = $('#msg_float_div');
				var msgDivObj = document.getElementById('systemUserMsg');
				if (msgDivObj) {
					msgDivObj.innerHTML = r;
				}
				var $userMsg = $('#systemUserMsg');
				if( $floatDiv.length<=0 ){
					$userMsg.floatdiv("righttop").show();
					r = null;
				}else{
					$userMsg.show();
					r = null;
				}
				//判断浏览器版本
				var isIE6=false;
				var Sys = {};
				var ua = navigator.userAgent.toLowerCase();
				var s;
			    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : 0;
				if(Sys.ie && Sys.ie=="6.0"){
					isIE6=true;
				}
				//alert($.browser.version);
				var height   = $('#navigation').height()+1;
				var func = function(){
					var windowWidth;//窗口的高和宽
					var windowWH = $.windowWH();
					windowWidth = windowWH.windowWidth;
					var $floatDiv = $('#msg_float_div');
					if( $floatDiv.length > 0 ){
						var wrapper = $('#wrapper');
						var offset = wrapper.offset();
						var bodyoffset = $userMsg.offset();
						if( !isIE6){
							if( bodyoffset.top<= 30 && $userMsg.scrollTop() <= 30){
								//top = height;
								$floatDiv.css({right:(windowWidth-wrapper.width())/2+'px',top:height+'px'});
							}else{
								//top = 0;
								$floatDiv.css({right:(windowWidth-wrapper.width())/2+'px',top:0+'px'});
							}
						}else{
							var scrollTop=document.documentElement.scrollTop;
							if( scrollTop <=30){
								//top = height;
								$floatDiv.css({right:(windowWidth-wrapper.width())/2+'px',top:height+'px'});
							}else{
								$floatDiv.css({right:(windowWidth-wrapper.width())/2+'px',top:scrollTop+'px'});
								//top = scrollTop;
							}
							scrollTop = null;
						}
						wrapper = null;
						offset  = null;
						bodyoffset = null;
					}	
					$floatDiv = null;
					windowWidth = null;
					windowWH = null;
				}	
				$floatDiv = null;
				//func = null;
				$(window).scroll(func).resize(func);
			}
			else {
				data = $.JSON.decode(r);
				$('.mes_know').hide();
				$('#showMoreMessage li').remove();
				$('#showMoreMessage').hide();
				if (data['total_num']>0) {
					($.browser.msie && $.browser.version=='6.0') || $('#showMoreMessage').css({'left': $('#message').offset().left + $('#message').width() - $('#showMoreMessage').width() - 4 + 'px'}).show();
					//reset
					fillUserMsg('消息<em class=\"redarrow\"></em>', '查看关注', '查看@我的', '查看私信', '查看系统消息', '查看喜欢我的');
					for (var key in keywords) {
						$('#moreMessageBox').append($('#moreMessageBox '+keywords[key][1]).parent());
					}
					$('#moreMessageBox').append($('#moreMessageBox .mes_know'));
					$('.mes_know').show();
					var message = '<span class="red">(<strong>'+data['total_num']+'</strong>)</span>';
					$('#message').find('.redarrow').before(message);
					var keywords = {'fans_num':['个新关注','.mes_fans','查看关注'], 'atme_num':['个新@我的', '.mes_atme', '查看@我的'], 'pmsg_num':['条新私信', '.mes_pmsg', '查看私信'], 'sysmesg':['条新系统消息', '.mes_sysmesg', '查看系统消息'], 'recommend_num':['个喜欢我的', '.mes_recom', '查看喜欢我的']};
					for (var key in keywords) {
						if (data[key]>0) {
							if (data[key]>99) {
								data[key] = '99+';
							}
							var txt = '有<strong class="red">' + data[key] + '</strong>' + keywords[key][0];
							$(keywords[key][1]).html(txt);
							$(keywords[key][1]).parent().clone(true).appendTo($('#showMoreMessage'));
						}
						else {
							$(keywords[key][1]).html(keywords[key][2]);
							$('.mes_know').css({'border-bottom':'1px solid #ccc'});
							$('#moreMessageBox').append($('#moreMessageBox '+keywords[key][1]).parent());
						}
					}
					$('.mes_know').clone(true).appendTo($('#showMoreMessage'));
					$('#showMoreMessage .mes_know').css({'border-bottom':0});
					$('.mes_know').click(function(){
						$('.mes_know').hide();
						var user_id = data['user_id'];
						var msgParams = ["fans_num", "atme_num", "pmsg_num", "sysmesg", "recommend_num"];
						setUserAllMsgZero(msgParams, user_id);
						fillUserMsg('消息<em class=\"redarrow\"></em>', '查看关注', '查看@我的', '查看私信', '查看系统消息', '查看喜欢我的');
						for (var key in keywords) {
							$('#moreMessageBox').append($('#moreMessageBox ' + keywords[key][1]).parent());
						}
						$('#moreMessageBox').append($('#moreMessageBox .mes_know'));
					});
				}
				else {
					fillUserMsg('消息<em class=\"redarrow\"></em>', '查看关注', '查看@我的', '查看私信', '查看系统消息', '查看喜欢我的');
					$('#moreMessageBox').append($('#moreMessageBox .mes_know'));
				}
				if(alertTime > 60000){
					alertTime /= 1.2;
				}
			}  
		}else{
			alertTime *= 1.2;
			$('#systemUserMsg').hide();
		}
		alertTime = parseInt(alertTime);
		timer_msg = setTimeout( "getUserMsg();", alertTime);
		//这个地方有问题不应该这么搞呀
		//$('.twitter_avatar').find('img:not(.js_processed)').floatUserInfo().addClass('js_processed');
	};
	$.post(url,data,callback);
	return true;
}

function setUserAllMsgZero(msgParams, userid) {
	var url = server_url + 'msg/ajax_setAllMsgZero';
	var data = {"msgParams[]" : msgParams};
	var callback = function( r ) {
		clearTimeout(timer_msg);
		getUserMsg();
	}
	$.post(url, data, callback);
	return true;
}

function setUserMsgZero ( msgParam , userid) {
	var url = server_url + 'msg/ajax_setMsgZero';
	var data = {"msgParm" : msgParam};
	var callback = function ( r ) {
		clearTimeout(timer_msg);
		getUserMsg();
	};
	$.post(url,data,callback);
	return true;
}

function setUserMsgGroupZero(groupid, userid) {
	var url = server_url + 'msg/ajax_setMsgGroupZero';
	var data = {'group_id' : groupid};
	var callback = function(r) {
		getUserMsg();
	};
	$.post(url,data,callback);
	return true;
}

function systemCron (){
	//这个地方要判断一下twitterPromt变量是否被定义了。因为这个变量只有在twitter页面才会被加载~~
	if ( typeof(twitterPrompt) != "undefined" ){
		if( twitterListObj.lType=='person' || twitterListObj.lType=='topic'){
			window.clearInterval(timerObj.timeOff);
		}else if( twitterListObj.lType=='any' ){
			//随便看看 滚屏
			twitterListObj.getTwitterList(0);
		}else{
			//我的页面 新内容提示
			twitterPrompt.getNewTwitter();
			//twitterToolsObj.linkMe();
		}
	}
}

//所有定时器开关
var timerObj = {
	//用户新信息提示, 邀请逛街提示
	userAlertTime:0,
	//随便看看中的
	timeOff:0,
	//随便看看页里的自动翻页
	autoPage:0,
	//自动翻页数最大值
	autoPageNum:0
}

//$('#fm_hd_smnv_middle').corner("bottom");
