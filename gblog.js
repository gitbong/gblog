/**
 * gblog.js -
 * this js depends on jquery
 */
(function (n_, fn_) {
	if (typeof define === 'function' && define.amd) {
		define(n_, ['jquery'], function () {
			return fn_;
		});
	} else {
		window[n_] = fn_;
	}
})('gblog', (function () {
	var _uiInited = false;
	var _isStop = false;

	var _touchNum = 0;
	var _loopId = 0;
	var _isStart = 0;
	var _isShow = 0;
	var _okNum = 0;
	var _lineNum = 0;

	var _$view = 0;

	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;

	function _show() {
		_$view.show();
		_isShow = true;
	}

	function _hide() {
		_$view.hide();
		_isShow = false;
	}

	function _log() {
		if (!_uiInited)
			_initUI();

		var val = '';
		for (var i = 0; i < arguments.length; i++) {
			val += _getLogStr(arguments[i]);
			if (i != arguments.length - 1)
				val += ',';
		}

		if (_isStop)return;
		var str = "<a style='color:#11b1d6'>" + _lineNum + ':</a>';

		val = "<a style='padding-left:5px;'>" + val + "</div>";

		_$view.find('.log-ctn').append("<div>" + str + val + "</div>").scrollTop(99999999999999999);

		_lineNum++;
	}

	function _initEvt() {
		window.addEventListener('touchstart', function (e) {
			if (_isShow)return;
			_touchNum++;
			clearTimeout(_loopId);

			var x = e.touches[0].clientX;
			if (_touchNum == 1 || _touchNum == 3) {
				if (x < w / 2) {
					_okNum++;
				} else {
					_touchNum = 0;
					_okNum = 0;
				}
			}

			if (_touchNum == 2 || _touchNum == 4) {
				if (x > w / 2) {
					_okNum++;
				} else {
					_touchNum = 0;
					_okNum = 0;
				}
			}

			if (_okNum == 4) {
				_touchNum = _okNum = 0;
				_show();
			}
			_loopId = setTimeout(function () {
				_touchNum = _okNum = 0;
			}, 1000);
		})
	}

	function _initUI() {
		_uiInited = true;
		var style = 'font-size:90%;opacity: .6;padding:4px;font-weight:light;width:32%;height:9%;position:fixed;bottom:0;border:#666;background:#222;color:#fff';
		$('body').append('\
                <div id="gbdebug" style="display:none;overflow: hidden">\
                    <div class="log-ctn" style="width: 100%;height:90%;position: absolute;left:0;top:0;overflow: auto"></div>\
                    <button class="gbclose-btn" style="' + style + ';right:68%;">Close</button>\
                    <button class="gbclean-btn" style="' + style + ';right:34%;">Clean</button>\
                    <button class="gbstop-btn" style="' + style + ';right:0%;">Stop Record</button>\
                </div>\
            ');

		_$view = $('#gbdebug');

		var w = document.documentElement.clientWidth;
		var h = document.documentElement.clientHeight;
		_$view.css({
			'z-index': '99999999999999999',
			"letter-spacing": "2px",
			"overflow": "auto",
			"font-family": "sans-serif,aril",
			left: 0,
			top: 0,
			position: 'absolute',
			'line-height': '16px',
			'font-size': '18px',
			color: '#fff',
			'background-color': '#000',
			opacity: '.8'
		});
		_$view.css({width: "100%", height: "100%"});
		//
		$('.gbclose-btn').bind('touchstart', function () {
			_hide();
		})
		$('.gbclean-btn').bind('touchstart', function () {
			$('#gbdebug .log-ctn').empty();
		})
		$('.gbstop-btn').bind('touchstart', function () {
			_isStop = !_isStop;
			if (_isStop) {
				$(this).html('Start Record').css('color', "#fff");
			} else {
				$(this).html('Stop Record').css('color', "#fff");
			}
		})
	}

	//console.log(_getLogStr({b: [[], {}]}));
	function _getLogStr() {
		var m = '';
		var attrNum = 0;
		for (var k in arguments) {
			attrNum++;
		}

		// console.log(attrNum)
		var initNum = 0;
		for (var i in arguments) {
			m += _onType(arguments[i]);
			initNum++;
			if (initNum < attrNum) {
				m += ',';
			}
		}

		return m;
	}

	function _onType(v_) {
		var str = '';
		if (v_ == null) {
			str += _onNull(v_);
		} else {
			switch (typeof(v_)) {
				case 'string':
				{
					str += _onString(v_);
					break;
				}
				case 'number':
				{
					str += _onNumber(v_);
					break;
				}
				case 'object':
				{
					if (v_.length || v_.toString() == "") {
						str += _onArr(v_);
					} else {
						str += _onObj(v_);
					}
					break;
				}
				case 'boolean':
				{
					str += _onBoolean(v_);
					break;
				}
			}
		}
		return str;
	}

	function _onNull(v_) {
		return 'null';
	}

	function _onString(v_) {
		return '"' + v_ + '"';
	}

	function _onNumber(v_) {
		return v_;
	}

	function _onObj(v_) {
		var str = '{';
		for (var i in v_) {
			if (v_[i] == null) {
				str += i + ':' + _onNull(v_[i]);
			} else {
				switch (typeof(v_[i])) {
					case 'string':
					{
						str += i + ':' + _onString(v_[i]);
						break;
					}
					case 'number':
					{
						str += i + ':' + _onNumber(v_[i]);
						break;
					}
					case 'object':
					{
						if (v_[i].length || v_[i].toString() == "") {
							str += i + ":" + _onArr(v_[i]);
						} else {
							str += i + ":" + _onObj(v_[i]);
						}
						break;
					}
					case 'boolean':
					{
						str += i + ":" + _onBoolean(v_[i]);
						break;
					}
				}
			}
			str += ',';
		}
		if (str.length > 1)
			str = str.substr(0, str.length - 1);
		str += '}';
		return str;
	}

	function _onArr(v_) {
		var str = '[';

		for (var i = 0; i < v_.length; i++) {
			if (v_[i] == null) {
				str += _onNull(v_[i]);
			} else {
				switch (typeof(v_[i])) {
					case 'string':
					{
						str += _onString(v_[i]);
						break;
					}
					case 'number':
					{
						str += _onNumber(v_[i]);
						break;
					}
					case 'object':
					{
						if (v_[i].length || v_[i].toString() == "") {
							str += _onArr(v_[i]);
						} else {
							str += _onObj(v_[i]);
						}
						break;
					}
					case 'boolean':
					{
						str += _onBoolean(v_[i]);
						break;
					}
				}
			}
			str += ',';
		}
		if (str.length > 1)
			str = str.substr(0, str.length - 1);
		str += ']';
		return str;
	}

	function _onBoolean(v_) {
		return v_ + '';
	}

	$(function () {
		_initUI();
		_initEvt();
	});

	return _log;
})());


//
