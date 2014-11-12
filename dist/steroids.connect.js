!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),(o.steroids||(o.steroids={})).connect=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//	http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//	http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = function() {

	//---------------------------------------------------------------------
	// qrcode
	//---------------------------------------------------------------------

	/**
	 * qrcode
	 * @param typeNumber 1 to 10
	 * @param errorCorrectLevel 'L','M','Q','H'
	 */
	var qrcode = function(typeNumber, errorCorrectLevel) {

		var PAD0 = 0xEC;
		var PAD1 = 0x11;

		var _typeNumber = typeNumber;
		var _errorCorrectLevel = QRErrorCorrectLevel[errorCorrectLevel];
		var _modules = null;
		var _moduleCount = 0;
		var _dataCache = null;
		var _dataList = new Array();

		var _this = {};

		var makeImpl = function(test, maskPattern) {

			_moduleCount = _typeNumber * 4 + 17;
			_modules = function(moduleCount) {
				var modules = new Array(moduleCount);
				for (var row = 0; row < moduleCount; row += 1) {
					modules[row] = new Array(moduleCount);
					for (var col = 0; col < moduleCount; col += 1) {
						modules[row][col] = null;
					}
				}
				return modules;
			}(_moduleCount);

			setupPositionProbePattern(0, 0);
			setupPositionProbePattern(_moduleCount - 7, 0);
			setupPositionProbePattern(0, _moduleCount - 7);
			setupPositionAdjustPattern();
			setupTimingPattern();
			setupTypeInfo(test, maskPattern);

			if (_typeNumber >= 7) {
				setupTypeNumber(test);
			}

			if (_dataCache == null) {
				_dataCache = createData(_typeNumber, _errorCorrectLevel, _dataList);
			}

			mapData(_dataCache, maskPattern);
		};

		var setupPositionProbePattern = function(row, col) {

			for (var r = -1; r <= 7; r += 1) {

				if (row + r <= -1 || _moduleCount <= row + r) continue;

				for (var c = -1; c <= 7; c += 1) {

					if (col + c <= -1 || _moduleCount <= col + c) continue;

					if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
							|| (0 <= c && c <= 6 && (r == 0 || r == 6) )
							|| (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
						_modules[row + r][col + c] = true;
					} else {
						_modules[row + r][col + c] = false;
					}
				}
			}
		};

		var getBestMaskPattern = function() {

			var minLostPoint = 0;
			var pattern = 0;

			for (var i = 0; i < 8; i += 1) {

				makeImpl(true, i);

				var lostPoint = QRUtil.getLostPoint(_this);

				if (i == 0 || minLostPoint > lostPoint) {
					minLostPoint = lostPoint;
					pattern = i;
				}
			}

			return pattern;
		};

		var setupTimingPattern = function() {

			for (var r = 8; r < _moduleCount - 8; r += 1) {
				if (_modules[r][6] != null) {
					continue;
				}
				_modules[r][6] = (r % 2 == 0);
			}

			for (var c = 8; c < _moduleCount - 8; c += 1) {
				if (_modules[6][c] != null) {
					continue;
				}
				_modules[6][c] = (c % 2 == 0);
			}
		};

		var setupPositionAdjustPattern = function() {

			var pos = QRUtil.getPatternPosition(_typeNumber);

			for (var i = 0; i < pos.length; i += 1) {

				for (var j = 0; j < pos.length; j += 1) {

					var row = pos[i];
					var col = pos[j];

					if (_modules[row][col] != null) {
						continue;
					}

					for (var r = -2; r <= 2; r += 1) {

						for (var c = -2; c <= 2; c += 1) {

							if (r == -2 || r == 2 || c == -2 || c == 2
									|| (r == 0 && c == 0) ) {
								_modules[row + r][col + c] = true;
							} else {
								_modules[row + r][col + c] = false;
							}
						}
					}
				}
			}
		};

		var setupTypeNumber = function(test) {

			var bits = QRUtil.getBCHTypeNumber(_typeNumber);

			for (var i = 0; i < 18; i += 1) {
				var mod = (!test && ( (bits >> i) & 1) == 1);
				_modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
			}

			for (var i = 0; i < 18; i += 1) {
				var mod = (!test && ( (bits >> i) & 1) == 1);
				_modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
			}
		};

		var setupTypeInfo = function(test, maskPattern) {

			var data = (_errorCorrectLevel << 3) | maskPattern;
			var bits = QRUtil.getBCHTypeInfo(data);

			// vertical
			for (var i = 0; i < 15; i += 1) {

				var mod = (!test && ( (bits >> i) & 1) == 1);

				if (i < 6) {
					_modules[i][8] = mod;
				} else if (i < 8) {
					_modules[i + 1][8] = mod;
				} else {
					_modules[_moduleCount - 15 + i][8] = mod;
				}
			}

			// horizontal
			for (var i = 0; i < 15; i += 1) {

				var mod = (!test && ( (bits >> i) & 1) == 1);

				if (i < 8) {
					_modules[8][_moduleCount - i - 1] = mod;
				} else if (i < 9) {
					_modules[8][15 - i - 1 + 1] = mod;
				} else {
					_modules[8][15 - i - 1] = mod;
				}
			}

			// fixed module
			_modules[_moduleCount - 8][8] = (!test);
		};

		var mapData = function(data, maskPattern) {

			var inc = -1;
			var row = _moduleCount - 1;
			var bitIndex = 7;
			var byteIndex = 0;
			var maskFunc = QRUtil.getMaskFunction(maskPattern);

			for (var col = _moduleCount - 1; col > 0; col -= 2) {

				if (col == 6) col -= 1;

				while (true) {

					for (var c = 0; c < 2; c += 1) {

						if (_modules[row][col - c] == null) {

							var dark = false;

							if (byteIndex < data.length) {
								dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
							}

							var mask = maskFunc(row, col - c);

							if (mask) {
								dark = !dark;
							}

							_modules[row][col - c] = dark;
							bitIndex -= 1;

							if (bitIndex == -1) {
								byteIndex += 1;
								bitIndex = 7;
							}
						}
					}

					row += inc;

					if (row < 0 || _moduleCount <= row) {
						row -= inc;
						inc = -inc;
						break;
					}
				}
			}
		};

		var createBytes = function(buffer, rsBlocks) {

			var offset = 0;

			var maxDcCount = 0;
			var maxEcCount = 0;

			var dcdata = new Array(rsBlocks.length);
			var ecdata = new Array(rsBlocks.length);

			for (var r = 0; r < rsBlocks.length; r += 1) {

				var dcCount = rsBlocks[r].dataCount;
				var ecCount = rsBlocks[r].totalCount - dcCount;

				maxDcCount = Math.max(maxDcCount, dcCount);
				maxEcCount = Math.max(maxEcCount, ecCount);

				dcdata[r] = new Array(dcCount);

				for (var i = 0; i < dcdata[r].length; i += 1) {
					dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
				}
				offset += dcCount;

				var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
				var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

				var modPoly = rawPoly.mod(rsPoly);
				ecdata[r] = new Array(rsPoly.getLength() - 1);
				for (var i = 0; i < ecdata[r].length; i += 1) {
					var modIndex = i + modPoly.getLength() - ecdata[r].length;
					ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
				}
			}

			var totalCodeCount = 0;
			for (var i = 0; i < rsBlocks.length; i += 1) {
				totalCodeCount += rsBlocks[i].totalCount;
			}

			var data = new Array(totalCodeCount);
			var index = 0;

			for (var i = 0; i < maxDcCount; i += 1) {
				for (var r = 0; r < rsBlocks.length; r += 1) {
					if (i < dcdata[r].length) {
						data[index] = dcdata[r][i];
						index += 1;
					}
				}
			}

			for (var i = 0; i < maxEcCount; i += 1) {
				for (var r = 0; r < rsBlocks.length; r += 1) {
					if (i < ecdata[r].length) {
						data[index] = ecdata[r][i];
						index += 1;
					}
				}
			}

			return data;
		};

		var createData = function(typeNumber, errorCorrectLevel, dataList) {

			var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);

			var buffer = qrBitBuffer();

			for (var i = 0; i < dataList.length; i += 1) {
				var data = dataList[i];
				buffer.put(data.getMode(), 4);
				buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
				data.write(buffer);
			}

			// calc num max data.
			var totalDataCount = 0;
			for (var i = 0; i < rsBlocks.length; i += 1) {
				totalDataCount += rsBlocks[i].dataCount;
			}

			if (buffer.getLengthInBits() > totalDataCount * 8) {
				throw new Error('code length overflow. ('
					+ buffer.getLengthInBits()
					+ '>'
					+ totalDataCount * 8
					+ ')');
			}

			// end code
			if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
				buffer.put(0, 4);
			}

			// padding
			while (buffer.getLengthInBits() % 8 != 0) {
				buffer.putBit(false);
			}

			// padding
			while (true) {

				if (buffer.getLengthInBits() >= totalDataCount * 8) {
					break;
				}
				buffer.put(PAD0, 8);

				if (buffer.getLengthInBits() >= totalDataCount * 8) {
					break;
				}
				buffer.put(PAD1, 8);
			}

			return createBytes(buffer, rsBlocks);
		};

		_this.addData = function(data) {
			var newData = qr8BitByte(data);
			_dataList.push(newData);
			_dataCache = null;
		};

		_this.isDark = function(row, col) {
			if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
				throw new Error(row + ',' + col);
			}
			return _modules[row][col];
		};

		_this.getModuleCount = function() {
			return _moduleCount;
		};

		_this.make = function() {
			makeImpl(false, getBestMaskPattern() );
		};

		_this.createTableTag = function(cellSize, margin) {

			cellSize = cellSize || 2;
			margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

			var qrHtml = '';

			qrHtml += '<table style="';
			qrHtml += ' border-width: 0px; border-style: none;';
			qrHtml += ' border-collapse: collapse;';
			qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
			qrHtml += '">';
			qrHtml += '<tbody>';

			for (var r = 0; r < _this.getModuleCount(); r += 1) {

				qrHtml += '<tr>';

				for (var c = 0; c < _this.getModuleCount(); c += 1) {
					qrHtml += '<td style="';
					qrHtml += ' border-width: 0px; border-style: none;';
					qrHtml += ' border-collapse: collapse;';
					qrHtml += ' padding: 0px; margin: 0px;';
					qrHtml += ' width: ' + cellSize + 'px;';
					qrHtml += ' height: ' + cellSize + 'px;';
					qrHtml += ' background-color: ';
					qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
					qrHtml += ';';
					qrHtml += '"/>';
				}

				qrHtml += '</tr>';
			}

			qrHtml += '</tbody>';
			qrHtml += '</table>';

			return qrHtml;
		};

		_this.createImgTag = function(cellSize, margin) {

			cellSize = cellSize || 2;
			margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

			var size = _this.getModuleCount() * cellSize + margin * 2;
			var min = margin;
			var max = size - margin;

			return createImgTag(size, size, function(x, y) {
				if (min <= x && x < max && min <= y && y < max) {
					var c = Math.floor( (x - min) / cellSize);
					var r = Math.floor( (y - min) / cellSize);
					return _this.isDark(r, c)? 0 : 1;
				} else {
					return 1;
				}
			} );
		};

		return _this;
	};

	//---------------------------------------------------------------------
	// qrcode.stringToBytes
	//---------------------------------------------------------------------

	qrcode.stringToBytes = function(s) {
		var bytes = new Array();
		for (var i = 0; i < s.length; i += 1) {
			var c = s.charCodeAt(i);
			bytes.push(c & 0xff);
		}
		return bytes;
	};

	//---------------------------------------------------------------------
	// qrcode.createStringToBytes
	//---------------------------------------------------------------------

	/**
	 * @param unicodeData base64 string of byte array.
	 * [16bit Unicode],[16bit Bytes], ...
	 * @param numChars
	 */
	qrcode.createStringToBytes = function(unicodeData, numChars) {

		// create conversion map.

		var unicodeMap = function() {

			var bin = base64DecodeInputStream(unicodeData);
			var read = function() {
				var b = bin.read();
				if (b == -1) throw new Error();
				return b;
			};

			var count = 0;
			var unicodeMap = {};
			while (true) {
				var b0 = bin.read();
				if (b0 == -1) break;
				var b1 = read();
				var b2 = read();
				var b3 = read();
				var k = String.fromCharCode( (b0 << 8) | b1);
				var v = (b2 << 8) | b3;
				unicodeMap[k] = v;
				count += 1;
			}
			if (count != numChars) {
				throw new Error(count + ' != ' + numChars);
			}

			return unicodeMap;
		}();

		var unknownChar = '?'.charCodeAt(0);

		return function(s) {
			var bytes = new Array();
			for (var i = 0; i < s.length; i += 1) {
				var c = s.charCodeAt(i);
				if (c < 128) {
					bytes.push(c);
				} else {
					var b = unicodeMap[s.charAt(i)];
					if (typeof b == 'number') {
						if ( (b & 0xff) == b) {
							// 1byte
							bytes.push(b);
						} else {
							// 2bytes
							bytes.push(b >>> 8);
							bytes.push(b & 0xff);
						}
					} else {
						bytes.push(unknownChar);
					}
				}
			}
			return bytes;
		};
	};

	//---------------------------------------------------------------------
	// QRMode
	//---------------------------------------------------------------------

	var QRMode = {
		MODE_NUMBER :		1 << 0,
		MODE_ALPHA_NUM : 	1 << 1,
		MODE_8BIT_BYTE : 	1 << 2,
		MODE_KANJI :		1 << 3
	};

	//---------------------------------------------------------------------
	// QRErrorCorrectLevel
	//---------------------------------------------------------------------

	var QRErrorCorrectLevel = {
		L : 1,
		M : 0,
		Q : 3,
		H : 2
	};

	//---------------------------------------------------------------------
	// QRMaskPattern
	//---------------------------------------------------------------------

	var QRMaskPattern = {
		PATTERN000 : 0,
		PATTERN001 : 1,
		PATTERN010 : 2,
		PATTERN011 : 3,
		PATTERN100 : 4,
		PATTERN101 : 5,
		PATTERN110 : 6,
		PATTERN111 : 7
	};

	//---------------------------------------------------------------------
	// QRUtil
	//---------------------------------------------------------------------

	var QRUtil = function() {

		var PATTERN_POSITION_TABLE = [
			[],
			[6, 18],
			[6, 22],
			[6, 26],
			[6, 30],
			[6, 34],
			[6, 22, 38],
			[6, 24, 42],
			[6, 26, 46],
			[6, 28, 50],
			[6, 30, 54],
			[6, 32, 58],
			[6, 34, 62],
			[6, 26, 46, 66],
			[6, 26, 48, 70],
			[6, 26, 50, 74],
			[6, 30, 54, 78],
			[6, 30, 56, 82],
			[6, 30, 58, 86],
			[6, 34, 62, 90],
			[6, 28, 50, 72, 94],
			[6, 26, 50, 74, 98],
			[6, 30, 54, 78, 102],
			[6, 28, 54, 80, 106],
			[6, 32, 58, 84, 110],
			[6, 30, 58, 86, 114],
			[6, 34, 62, 90, 118],
			[6, 26, 50, 74, 98, 122],
			[6, 30, 54, 78, 102, 126],
			[6, 26, 52, 78, 104, 130],
			[6, 30, 56, 82, 108, 134],
			[6, 34, 60, 86, 112, 138],
			[6, 30, 58, 86, 114, 142],
			[6, 34, 62, 90, 118, 146],
			[6, 30, 54, 78, 102, 126, 150],
			[6, 24, 50, 76, 102, 128, 154],
			[6, 28, 54, 80, 106, 132, 158],
			[6, 32, 58, 84, 110, 136, 162],
			[6, 26, 54, 82, 110, 138, 166],
			[6, 30, 58, 86, 114, 142, 170]
		];
		var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
		var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
		var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

		var _this = {};

		var getBCHDigit = function(data) {
			var digit = 0;
			while (data != 0) {
				digit += 1;
				data >>>= 1;
			}
			return digit;
		};

		_this.getBCHTypeInfo = function(data) {
			var d = data << 10;
			while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
				d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
			}
			return ( (data << 10) | d) ^ G15_MASK;
		};

		_this.getBCHTypeNumber = function(data) {
			var d = data << 12;
			while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
				d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
			}
			return (data << 12) | d;
		};

		_this.getPatternPosition = function(typeNumber) {
			return PATTERN_POSITION_TABLE[typeNumber - 1];
		};

		_this.getMaskFunction = function(maskPattern) {

			switch (maskPattern) {

			case QRMaskPattern.PATTERN000 :
				return function(i, j) { return (i + j) % 2 == 0; };
			case QRMaskPattern.PATTERN001 :
				return function(i, j) { return i % 2 == 0; };
			case QRMaskPattern.PATTERN010 :
				return function(i, j) { return j % 3 == 0; };
			case QRMaskPattern.PATTERN011 :
				return function(i, j) { return (i + j) % 3 == 0; };
			case QRMaskPattern.PATTERN100 :
				return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
			case QRMaskPattern.PATTERN101 :
				return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
			case QRMaskPattern.PATTERN110 :
				return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
			case QRMaskPattern.PATTERN111 :
				return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

			default :
				throw new Error('bad maskPattern:' + maskPattern);
			}
		};

		_this.getErrorCorrectPolynomial = function(errorCorrectLength) {
			var a = qrPolynomial([1], 0);
			for (var i = 0; i < errorCorrectLength; i += 1) {
				a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
			}
			return a;
		};

		_this.getLengthInBits = function(mode, type) {

			if (1 <= type && type < 10) {

				// 1 - 9

				switch(mode) {
				case QRMode.MODE_NUMBER 	: return 10;
				case QRMode.MODE_ALPHA_NUM 	: return 9;
				case QRMode.MODE_8BIT_BYTE	: return 8;
				case QRMode.MODE_KANJI		: return 8;
				default :
					throw new Error('mode:' + mode);
				}

			} else if (type < 27) {

				// 10 - 26

				switch(mode) {
				case QRMode.MODE_NUMBER 	: return 12;
				case QRMode.MODE_ALPHA_NUM 	: return 11;
				case QRMode.MODE_8BIT_BYTE	: return 16;
				case QRMode.MODE_KANJI		: return 10;
				default :
					throw new Error('mode:' + mode);
				}

			} else if (type < 41) {

				// 27 - 40

				switch(mode) {
				case QRMode.MODE_NUMBER 	: return 14;
				case QRMode.MODE_ALPHA_NUM	: return 13;
				case QRMode.MODE_8BIT_BYTE	: return 16;
				case QRMode.MODE_KANJI		: return 12;
				default :
					throw new Error('mode:' + mode);
				}

			} else {
				throw new Error('type:' + type);
			}
		};

		_this.getLostPoint = function(qrcode) {

			var moduleCount = qrcode.getModuleCount();

			var lostPoint = 0;

			// LEVEL1

			for (var row = 0; row < moduleCount; row += 1) {
				for (var col = 0; col < moduleCount; col += 1) {

					var sameCount = 0;
					var dark = qrcode.isDark(row, col);

					for (var r = -1; r <= 1; r += 1) {

						if (row + r < 0 || moduleCount <= row + r) {
							continue;
						}

						for (var c = -1; c <= 1; c += 1) {

							if (col + c < 0 || moduleCount <= col + c) {
								continue;
							}

							if (r == 0 && c == 0) {
								continue;
							}

							if (dark == qrcode.isDark(row + r, col + c) ) {
								sameCount += 1;
							}
						}
					}

					if (sameCount > 5) {
						lostPoint += (3 + sameCount - 5);
					}
				}
			};

			// LEVEL2

			for (var row = 0; row < moduleCount - 1; row += 1) {
				for (var col = 0; col < moduleCount - 1; col += 1) {
					var count = 0;
					if (qrcode.isDark(row, col) ) count += 1;
					if (qrcode.isDark(row + 1, col) ) count += 1;
					if (qrcode.isDark(row, col + 1) ) count += 1;
					if (qrcode.isDark(row + 1, col + 1) ) count += 1;
					if (count == 0 || count == 4) {
						lostPoint += 3;
					}
				}
			}

			// LEVEL3

			for (var row = 0; row < moduleCount; row += 1) {
				for (var col = 0; col < moduleCount - 6; col += 1) {
					if (qrcode.isDark(row, col)
							&& !qrcode.isDark(row, col + 1)
							&&  qrcode.isDark(row, col + 2)
							&&  qrcode.isDark(row, col + 3)
							&&  qrcode.isDark(row, col + 4)
							&& !qrcode.isDark(row, col + 5)
							&&  qrcode.isDark(row, col + 6) ) {
						lostPoint += 40;
					}
				}
			}

			for (var col = 0; col < moduleCount; col += 1) {
				for (var row = 0; row < moduleCount - 6; row += 1) {
					if (qrcode.isDark(row, col)
							&& !qrcode.isDark(row + 1, col)
							&&  qrcode.isDark(row + 2, col)
							&&  qrcode.isDark(row + 3, col)
							&&  qrcode.isDark(row + 4, col)
							&& !qrcode.isDark(row + 5, col)
							&&  qrcode.isDark(row + 6, col) ) {
						lostPoint += 40;
					}
				}
			}

			// LEVEL4

			var darkCount = 0;

			for (var col = 0; col < moduleCount; col += 1) {
				for (var row = 0; row < moduleCount; row += 1) {
					if (qrcode.isDark(row, col) ) {
						darkCount += 1;
					}
				}
			}

			var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
			lostPoint += ratio * 10;

			return lostPoint;
		};

		return _this;
	}();

	//---------------------------------------------------------------------
	// QRMath
	//---------------------------------------------------------------------

	var QRMath = function() {

		var EXP_TABLE = new Array(256);
		var LOG_TABLE = new Array(256);

		// initialize tables
		for (var i = 0; i < 8; i += 1) {
			EXP_TABLE[i] = 1 << i;
		}
		for (var i = 8; i < 256; i += 1) {
			EXP_TABLE[i] = EXP_TABLE[i - 4]
				^ EXP_TABLE[i - 5]
				^ EXP_TABLE[i - 6]
				^ EXP_TABLE[i - 8];
		}
		for (var i = 0; i < 255; i += 1) {
			LOG_TABLE[EXP_TABLE[i] ] = i;
		}

		var _this = {};

		_this.glog = function(n) {

			if (n < 1) {
				throw new Error('glog(' + n + ')');
			}

			return LOG_TABLE[n];
		};

		_this.gexp = function(n) {

			while (n < 0) {
				n += 255;
			}

			while (n >= 256) {
				n -= 255;
			}

			return EXP_TABLE[n];
		};

		return _this;
	}();

	//---------------------------------------------------------------------
	// qrPolynomial
	//---------------------------------------------------------------------

	function qrPolynomial(num, shift) {

		if (typeof num.length == 'undefined') {
			throw new Error(num.length + '/' + shift);
		}

		var _num = function() {
			var offset = 0;
			while (offset < num.length && num[offset] == 0) {
				offset += 1;
			}
			var _num = new Array(num.length - offset + shift);
			for (var i = 0; i < num.length - offset; i += 1) {
				_num[i] = num[i + offset];
			}
			return _num;
		}();

		var _this = {};

		_this.getAt = function(index) {
			return _num[index];
		};

		_this.getLength = function() {
			return _num.length;
		};

		_this.multiply = function(e) {

			var num = new Array(_this.getLength() + e.getLength() - 1);

			for (var i = 0; i < _this.getLength(); i += 1) {
				for (var j = 0; j < e.getLength(); j += 1) {
					num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
				}
			}

			return qrPolynomial(num, 0);
		};

		_this.mod = function(e) {

			if (_this.getLength() - e.getLength() < 0) {
				return _this;
			}

			var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

			var num = new Array(_this.getLength() );
			for (var i = 0; i < _this.getLength(); i += 1) {
				num[i] = _this.getAt(i);
			}

			for (var i = 0; i < e.getLength(); i += 1) {
				num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
			}

			// recursive call
			return qrPolynomial(num, 0).mod(e);
		};

		return _this;
	};

	//---------------------------------------------------------------------
	// QRRSBlock
	//---------------------------------------------------------------------

	var QRRSBlock = function() {

		var RS_BLOCK_TABLE = [

			// L
			// M
			// Q
			// H

			// 1
			[1, 26, 19],
			[1, 26, 16],
			[1, 26, 13],
			[1, 26, 9],

			// 2
			[1, 44, 34],
			[1, 44, 28],
			[1, 44, 22],
			[1, 44, 16],

			// 3
			[1, 70, 55],
			[1, 70, 44],
			[2, 35, 17],
			[2, 35, 13],

			// 4
			[1, 100, 80],
			[2, 50, 32],
			[2, 50, 24],
			[4, 25, 9],

			// 5
			[1, 134, 108],
			[2, 67, 43],
			[2, 33, 15, 2, 34, 16],
			[2, 33, 11, 2, 34, 12],

			// 6
			[2, 86, 68],
			[4, 43, 27],
			[4, 43, 19],
			[4, 43, 15],

			// 7
			[2, 98, 78],
			[4, 49, 31],
			[2, 32, 14, 4, 33, 15],
			[4, 39, 13, 1, 40, 14],

			// 8
			[2, 121, 97],
			[2, 60, 38, 2, 61, 39],
			[4, 40, 18, 2, 41, 19],
			[4, 40, 14, 2, 41, 15],

			// 9
			[2, 146, 116],
			[3, 58, 36, 2, 59, 37],
			[4, 36, 16, 4, 37, 17],
			[4, 36, 12, 4, 37, 13],

			// 10
			[2, 86, 68, 2, 87, 69],
			[4, 69, 43, 1, 70, 44],
			[6, 43, 19, 2, 44, 20],
			[6, 43, 15, 2, 44, 16]
		];

		var qrRSBlock = function(totalCount, dataCount) {
			var _this = {};
			_this.totalCount = totalCount;
			_this.dataCount = dataCount;
			return _this;
		};

		var _this = {};

		var getRsBlockTable = function(typeNumber, errorCorrectLevel) {

			switch(errorCorrectLevel) {
			case QRErrorCorrectLevel.L :
				return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
			case QRErrorCorrectLevel.M :
				return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
			case QRErrorCorrectLevel.Q :
				return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
			case QRErrorCorrectLevel.H :
				return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
			default :
				return undefined;
			}
		};

		_this.getRSBlocks = function(typeNumber, errorCorrectLevel) {

			var rsBlock = getRsBlockTable(typeNumber, errorCorrectLevel);

			if (typeof rsBlock == 'undefined') {
				throw new Error('bad rs block @ typeNumber:' + typeNumber +
						'/errorCorrectLevel:' + errorCorrectLevel);
			}

			var length = rsBlock.length / 3;

			var list = new Array();

			for (var i = 0; i < length; i += 1) {

				var count = rsBlock[i * 3 + 0];
				var totalCount = rsBlock[i * 3 + 1];
				var dataCount = rsBlock[i * 3 + 2];

				for (var j = 0; j < count; j += 1) {
					list.push(qrRSBlock(totalCount, dataCount) );
				}
			}

			return list;
		};

		return _this;
	}();

	//---------------------------------------------------------------------
	// qrBitBuffer
	//---------------------------------------------------------------------

	var qrBitBuffer = function() {

		var _buffer = new Array();
		var _length = 0;

		var _this = {};

		_this.getBuffer = function() {
			return _buffer;
		};

		_this.getAt = function(index) {
			var bufIndex = Math.floor(index / 8);
			return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
		};

		_this.put = function(num, length) {
			for (var i = 0; i < length; i += 1) {
				_this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
			}
		};

		_this.getLengthInBits = function() {
			return _length;
		};

		_this.putBit = function(bit) {

			var bufIndex = Math.floor(_length / 8);
			if (_buffer.length <= bufIndex) {
				_buffer.push(0);
			}

			if (bit) {
				_buffer[bufIndex] |= (0x80 >>> (_length % 8) );
			}

			_length += 1;
		};

		return _this;
	};

	//---------------------------------------------------------------------
	// qr8BitByte
	//---------------------------------------------------------------------

	var qr8BitByte = function(data) {

		var _mode = QRMode.MODE_8BIT_BYTE;
		var _data = data;
		var _bytes = qrcode.stringToBytes(data);

		var _this = {};

		_this.getMode = function() {
			return _mode;
		};

		_this.getLength = function(buffer) {
			return _bytes.length;
		};

		_this.write = function(buffer) {
			for (var i = 0; i < _bytes.length; i += 1) {
				buffer.put(_bytes[i], 8);
			}
		};

		return _this;
	};

	//=====================================================================
	// GIF Support etc.
	//

	//---------------------------------------------------------------------
	// byteArrayOutputStream
	//---------------------------------------------------------------------

	var byteArrayOutputStream = function() {

		var _bytes = new Array();

		var _this = {};

		_this.writeByte = function(b) {
			_bytes.push(b & 0xff);
		};

		_this.writeShort = function(i) {
			_this.writeByte(i);
			_this.writeByte(i >>> 8);
		};

		_this.writeBytes = function(b, off, len) {
			off = off || 0;
			len = len || b.length;
			for (var i = 0; i < len; i += 1) {
				_this.writeByte(b[i + off]);
			}
		};

		_this.writeString = function(s) {
			for (var i = 0; i < s.length; i += 1) {
				_this.writeByte(s.charCodeAt(i) );
			}
		};

		_this.toByteArray = function() {
			return _bytes;
		};

		_this.toString = function() {
			var s = '';
			s += '[';
			for (var i = 0; i < _bytes.length; i += 1) {
				if (i > 0) {
					s += ',';
				}
				s += _bytes[i];
			}
			s += ']';
			return s;
		};

		return _this;
	};

	//---------------------------------------------------------------------
	// base64EncodeOutputStream
	//---------------------------------------------------------------------

	var base64EncodeOutputStream = function() {

		var _buffer = 0;
		var _buflen = 0;
		var _length = 0;
		var _base64 = '';

		var _this = {};

		var writeEncoded = function(b) {
			_base64 += String.fromCharCode(encode(b & 0x3f) );
		};

		var encode = function(n) {
			if (n < 0) {
				// error.
			} else if (n < 26) {
				return 0x41 + n;
			} else if (n < 52) {
				return 0x61 + (n - 26);
			} else if (n < 62) {
				return 0x30 + (n - 52);
			} else if (n == 62) {
				return 0x2b;
			} else if (n == 63) {
				return 0x2f;
			}
			throw new Error('n:' + n);
		};

		_this.writeByte = function(n) {

			_buffer = (_buffer << 8) | (n & 0xff);
			_buflen += 8;
			_length += 1;

			while (_buflen >= 6) {
				writeEncoded(_buffer >>> (_buflen - 6) );
				_buflen -= 6;
			}
		};

		_this.flush = function() {

			if (_buflen > 0) {
				writeEncoded(_buffer << (6 - _buflen) );
				_buffer = 0;
				_buflen = 0;
			}

			if (_length % 3 != 0) {
				// padding
				var padlen = 3 - _length % 3;
				for (var i = 0; i < padlen; i += 1) {
					_base64 += '=';
				}
			}
		};

		_this.toString = function() {
			return _base64;
		};

		return _this;
	};

	//---------------------------------------------------------------------
	// base64DecodeInputStream
	//---------------------------------------------------------------------

	var base64DecodeInputStream = function(str) {

		var _str = str;
		var _pos = 0;
		var _buffer = 0;
		var _buflen = 0;

		var _this = {};

		_this.read = function() {

			while (_buflen < 8) {

				if (_pos >= _str.length) {
					if (_buflen == 0) {
						return -1;
					}
					throw new Error('unexpected end of file./' + _buflen);
				}

				var c = _str.charAt(_pos);
				_pos += 1;

				if (c == '=') {
					_buflen = 0;
					return -1;
				} else if (c.match(/^\s$/) ) {
					// ignore if whitespace.
					continue;
				}

				_buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
				_buflen += 6;
			}

			var n = (_buffer >>> (_buflen - 8) ) & 0xff;
			_buflen -= 8;
			return n;
		};

		var decode = function(c) {
			if (0x41 <= c && c <= 0x5a) {
				return c - 0x41;
			} else if (0x61 <= c && c <= 0x7a) {
				return c - 0x61 + 26;
			} else if (0x30 <= c && c <= 0x39) {
				return c - 0x30 + 52;
			} else if (c == 0x2b) {
				return 62;
			} else if (c == 0x2f) {
				return 63;
			} else {
				throw new Error('c:' + c);
			}
		};

		return _this;
	};

	//---------------------------------------------------------------------
	// gifImage (B/W)
	//---------------------------------------------------------------------

	var gifImage = function(width, height) {

		var _width = width;
		var _height = height;
		var _data = new Array(width * height);

		var _this = {};

		_this.setPixel = function(x, y, pixel) {
			_data[y * _width + x] = pixel;
		};

		_this.write = function(out) {

			//---------------------------------
			// GIF Signature

			out.writeString('GIF87a');

			//---------------------------------
			// Screen Descriptor

			out.writeShort(_width);
			out.writeShort(_height);

			out.writeByte(0x80); // 2bit
			out.writeByte(0);
			out.writeByte(0);

			//---------------------------------
			// Global Color Map

			// black
			out.writeByte(0x00);
			out.writeByte(0x00);
			out.writeByte(0x00);

			// white
			out.writeByte(0xff);
			out.writeByte(0xff);
			out.writeByte(0xff);

			//---------------------------------
			// Image Descriptor

			out.writeString(',');
			out.writeShort(0);
			out.writeShort(0);
			out.writeShort(_width);
			out.writeShort(_height);
			out.writeByte(0);

			//---------------------------------
			// Local Color Map

			//---------------------------------
			// Raster Data

			var lzwMinCodeSize = 2;
			var raster = getLZWRaster(lzwMinCodeSize);

			out.writeByte(lzwMinCodeSize);

			var offset = 0;

			while (raster.length - offset > 255) {
				out.writeByte(255);
				out.writeBytes(raster, offset, 255);
				offset += 255;
			}

			out.writeByte(raster.length - offset);
			out.writeBytes(raster, offset, raster.length - offset);
			out.writeByte(0x00);

			//---------------------------------
			// GIF Terminator
			out.writeString(';');
		};

		var bitOutputStream = function(out) {

			var _out = out;
			var _bitLength = 0;
			var _bitBuffer = 0;

			var _this = {};

			_this.write = function(data, length) {

				if ( (data >>> length) != 0) {
					throw new Error('length over');
				}

				while (_bitLength + length >= 8) {
					_out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
					length -= (8 - _bitLength);
					data >>>= (8 - _bitLength);
					_bitBuffer = 0;
					_bitLength = 0;
				}

				_bitBuffer = (data << _bitLength) | _bitBuffer;
				_bitLength = _bitLength + length;
			};

			_this.flush = function() {
				if (_bitLength > 0) {
					_out.writeByte(_bitBuffer);
				}
			};

			return _this;
		};

		var getLZWRaster = function(lzwMinCodeSize) {

			var clearCode = 1 << lzwMinCodeSize;
			var endCode = (1 << lzwMinCodeSize) + 1;
			var bitLength = lzwMinCodeSize + 1;

			// Setup LZWTable
			var table = lzwTable();

			for (var i = 0; i < clearCode; i += 1) {
				table.add(String.fromCharCode(i) );
			}
			table.add(String.fromCharCode(clearCode) );
			table.add(String.fromCharCode(endCode) );

			var byteOut = byteArrayOutputStream();
			var bitOut = bitOutputStream(byteOut);

			// clear code
			bitOut.write(clearCode, bitLength);

			var dataIndex = 0;

			var s = String.fromCharCode(_data[dataIndex]);
			dataIndex += 1;

			while (dataIndex < _data.length) {

				var c = String.fromCharCode(_data[dataIndex]);
				dataIndex += 1;

				if (table.contains(s + c) ) {

					s = s + c;

				} else {

					bitOut.write(table.indexOf(s), bitLength);

					if (table.size() < 0xfff) {

						if (table.size() == (1 << bitLength) ) {
							bitLength += 1;
						}

						table.add(s + c);
					}

					s = c;
				}
			}

			bitOut.write(table.indexOf(s), bitLength);

			// end code
			bitOut.write(endCode, bitLength);

			bitOut.flush();

			return byteOut.toByteArray();
		};

		var lzwTable = function() {

			var _map = {};
			var _size = 0;

			var _this = {};

			_this.add = function(key) {
				if (_this.contains(key) ) {
					throw new Error('dup key:' + key);
				}
				_map[key] = _size;
				_size += 1;
			};

			_this.size = function() {
				return _size;
			};

			_this.indexOf = function(key) {
				return _map[key];
			};

			_this.contains = function(key) {
				return typeof _map[key] != 'undefined';
			};

			return _this;
		};

		return _this;
	};

	var createImgTag = function(width, height, getPixel, alt) {

		var gif = gifImage(width, height);
		for (var y = 0; y < height; y += 1) {
			for (var x = 0; x < width; x += 1) {
				gif.setPixel(x, y, getPixel(x, y) );
			}
		}

		var b = byteArrayOutputStream();
		gif.write(b);

		var base64 = base64EncodeOutputStream();
		var bytes = b.toByteArray();
		for (var i = 0; i < bytes.length; i += 1) {
			base64.writeByte(bytes[i]);
		}
		base64.flush();

		var img = '';
		img += '<img';
		img += '\u0020src="';
		img += 'data:image/gif;base64,';
		img += base64;
		img += '"';
		img += '\u0020width="';
		img += width;
		img += '"';
		img += '\u0020height="';
		img += height;
		img += '"';
		if (alt) {
			img += '\u0020alt="';
			img += alt;
			img += '"';
		}
		img += '/>';

		return img;
	};

	//---------------------------------------------------------------------
	// returns qrcode function.
	return qrcode;
}();

module.exports = qrcode;

},{}],2:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$http", function($http) {
    var _apiBase;
    _apiBase = "http://localhost:4567/__appgyver";
    this.ping = function() {
      return $http.get("" + _apiBase + "/ping");
    };
    this.getCloudConfig = function() {
      return $http.get("" + _apiBase + "/cloud_config");
    };
    this.getAppConfig = function() {
      return $http.get("" + _apiBase + "/app_config");
    };
    this.getAccessToken = function() {
      return $http.get("" + _apiBase + "/access_token");
    };
    this.deploy = function() {
      return $http.get("" + _apiBase + "/deploy");
    };
    this.launchSimulator = function() {
      return $http.get("" + _apiBase + "/emulators/simulator/start");
    };
    this.launchEmulator = function() {
      return $http.get("" + _apiBase + "/emulators/android/start");
    };
    this.launchGenymotion = function() {
      return $http.get("" + _apiBase + "/emulators/genymotion/start");
    };
    this.getDataConfig = function() {
      return $http.get("" + _apiBase + "/data/config");
    };
    this.initData = function() {
      return $http.post("" + _apiBase + "/data/init");
    };
    this.syncData = function() {
      return $http.post("" + _apiBase + "/data/sync");
    };
    this.generate = function(parameters) {
      return $http.post("" + _apiBase + "/generate", parameters);
    };
    return this;
  }
];


},{}],3:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$scope", "BuildServerApi", function($scope, BuildServerApi) {
    $scope.viewReady = false;
    $scope.isDeploying = false;
    $scope.hasCloudJson = false;
    $scope.deployError = void 0;
    $scope.getCloudJson = function() {
      $scope.waiting = "Fetching your App ID from Steroids CLI...";
      return BuildServerApi.getCloudConfig().then(function(res) {
        $scope.cloudId = res.data.id;
        $scope.cloudHash = res.data.identification_hash;
        return $scope.hasCloudJson = true;
      }, function(error) {
        return $scope.hasCloudJson = false;
      })["finally"](function() {
        $scope.waiting = null;
        return $scope.viewReady = true;
      });
    };
    $scope.getCloudJson();
    return $scope.deploy = function() {
      if ($scope.isDeploying) {
        return;
      }
      $scope.isDeploying = true;
      return BuildServerApi.deploy().then(function(res) {
        $scope.getCloudJson();
        return $scope.deployError = void 0;
      }, function(error) {
        return $scope.deployError = "Could not deploy your project to the cloud. " + error.data.error;
      })["finally"](function() {
        return $scope.isDeploying = false;
      });
    };
  }
];


},{}],4:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "BuildServerApi", function(BuildServerApi) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/build-settings/build-settings-view.html",
      link: function(scope, element, attrs) {
        scope.viewReady = false;
        scope.isDeploying = false;
        scope.hasCloudJson = false;
        scope.deployError = void 0;
        scope.getCloudJson = function() {
          scope.waiting = "Fetching your App ID from Steroids CLI...";
          return BuildServerApi.getCloudConfig().then(function(res) {
            scope.cloudId = res.data.id;
            scope.cloudHash = res.data.identification_hash;
            return scope.hasCloudJson = true;
          }, function(error) {
            return scope.hasCloudJson = false;
          })["finally"](function() {
            scope.waiting = null;
            return scope.viewReady = true;
          });
        };
        scope.getCloudJson();
        return scope.deploy = function() {
          if (scope.isDeploying) {
            return;
          }
          scope.isDeploying = true;
          return BuildServerApi.deploy().then(function(res) {
            scope.getCloudJson();
            return scope.deployError = void 0;
          }, function(error) {
            return scope.deployError = "Could not deploy your project to the cloud. " + error.data.error;
          })["finally"](function() {
            return scope.isDeploying = false;
          });
        };
      }
    };
  }
];


},{}],5:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.build-settings", []).directive("buildSettingsView", _dereq_("./buildSettingsViewDirective")).service("BuildServerApi", _dereq_("./BuildServerApiService")).controller("CloudViewCtrl", _dereq_("./CloudViewCtrl"));


},{"./BuildServerApiService":2,"./CloudViewCtrl":3,"./buildSettingsViewDirective":4}],6:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$rootScope", "$state", "$interval", "BuildServerApi", function($rootScope, $state, $interval, BuildServerApi) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/connect-ui/connect-ui.html",
      link: function(scope, element, attrs) {

        /*
        Tabs
         */
        var syncDataAfterTheseEvents;
        scope.$state = $state;
        scope.tabs = [
          {
            stateHref: "connect",
            name: "qr",
            label: "Connect"
          }, {
            stateHref: "logs",
            name: "logs",
            label: "Logs",
            legacyAppIncompatible: true
          }, {
            stateHref: "docs",
            name: "docs",
            label: "Documentation"
          }, {
            stateHref: "cloud",
            name: "build-settings",
            label: "Cloud"
          }, {
            stateHref: "data",
            name: "data",
            label: "Data",
            legacyAppIncompatible: true
          }
        ];

        /*
        Legacy app logic
         */
        scope.getAppConfig = function() {
          return BuildServerApi.getAppConfig().then(function(res) {
            var newTabs;
            if (res.status === 204) {
              newTabs = [];
              angular.forEach(scope.tabs, function(tab) {
                if (tab.legacyAppIncompatible == null) {
                  return this.push(tab);
                }
              }, newTabs);
              return scope.tabs = newTabs;
            }
          });
        };
        scope.getAppConfig();

        /*
        State
         */
        scope.isConnected = true;
        scope.workingOn = void 0;
        scope.startWorkingOn = function(what) {
          return scope.workingOn = what;
        };
        scope.finishWorking = function() {
          return scope.workingOn = void 0;
        };
        $interval(function() {
          return BuildServerApi.ping().then(function() {
            return scope.isConnected = true;
          }, function() {
            return scope.isConnected = false;
          });
        }, 1000);

        /*
        Events
         */
        syncDataAfterTheseEvents = ["ag.data-configurator.provider.created", "ag.data-configurator.provider.updated", "ag.data-configurator.provider.destroyed", "ag.data-configurator.resource.created", "ag.data-configurator.resource.updated", "ag.data-configurator.resource.destroyed", "ag.data-configurator.service.created", "ag.data-configurator.service.updated", "ag.data-configurator.service.destroyed"];
        return angular.forEach(syncDataAfterTheseEvents, function(eventName) {
          return $rootScope.$on(eventName, function() {
            scope.startWorkingOn("Synchronizing app data configuration...");
            console.log("Syncing data...");
            return BuildServerApi.syncData().then(function() {
              return console.log("Data synced successfully.");
            }, function(error) {
              return console.log("Failed to sync data.", error);
            })["finally"](function() {
              return scope.finishWorking();
            });
          });
        });
      }
    };
  }
];


},{}],7:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.connect-ui", []).directive("connectUi", _dereq_("./connectUiDirective"));


},{"./connectUiDirective":6}],8:[function(_dereq_,module,exports){
var steroidsConnectModules;

steroidsConnectModules = angular.module("SteroidsConnect", ["ui.router", _dereq_("./logs").name, _dereq_("./preview").name, _dereq_("./navigation-and-themes").name, _dereq_("./generators").name, _dereq_("./connect-ui").name, _dereq_("./docs").name, _dereq_("./build-settings").name, _dereq_("./data").name, _dereq_("./data-generators").name, "AppGyver.UI-kit", "AppGyver.DataConfigurator", "AppGyver.DataBrowser"]);

_dereq_("../templates/SteroidsConnectTemplates");

steroidsConnectModules.config([
  "$locationProvider", "$stateProvider", "$urlRouterProvider", function($locationProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(false);
    $stateProvider.state("connect", {
      url: "/connect",
      templateUrl: "/steroids-connect/preview/preview-view.html",
      controller: "ConnectViewCtrl"
    }).state("logs", {
      url: "/logs",
      templateUrl: "/steroids-connect/logs/log-view.html",
      controller: "LogViewCtrl"
    }).state("docs", {
      url: "/docs",
      templateUrl: "/steroids-connect/docs/docs-view.html"
    }).state("cloud", {
      url: "/cloud",
      templateUrl: "/steroids-connect/build-settings/build-settings-view.html",
      controller: "CloudViewCtrl"
    }).state("data", {
      url: "/data",
      templateUrl: "/steroids-connect/data/data-view.html",
      controller: "DataViewCtrl"
    }).state("data.configure", {
      url: "/configure",
      templateUrl: "/steroids-connect/data/data-configure.html"
    }).state("data.browse", {
      url: "/browse",
      templateUrl: "/steroids-connect/data/data-browse.html"
    }).state("data.generators", {
      url: "/generators",
      templateUrl: "/steroids-connect/data/data-generators.html"
    });
    return $urlRouterProvider.otherwise("/connect");
  }
]);

steroidsConnectModules.run([
  "LogCloudConnector", "DeviceCloudConnector", function(LogCloudConnector, DeviceCloudConnector) {
    LogCloudConnector.setEndpoint("http://localhost:4567/__appgyver/logger");
    LogCloudConnector.connect();
    return DeviceCloudConnector.connect();
  }
]);


},{"../templates/SteroidsConnectTemplates":53,"./build-settings":5,"./connect-ui":7,"./data":13,"./data-generators":10,"./docs":15,"./generators":18,"./logs":24,"./navigation-and-themes":38,"./preview":51}],9:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$q", "$timeout", "$sce", "Restangular", "BuildServerApi", function($q, $timeout, $sce, Restangular, BuildServerApi) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/data-generators/data-generators-view.html",
      scope: {
        configApiBaseUrl: "@",
        appId: "@",
        authorizationToken: "@"
      },
      controller: function($scope) {

        /*
        Initial State
         */
        $scope.loadingResources = true;
        $scope.isGenerating = false;
        $scope.selectedResource = void 0;
        $scope.format = "coffee";
        $scope.resources = [];

        /*
        View Initialization
         */
        (function() {
          var promisesForQ;
          Restangular.setBaseUrl($scope.configApiBaseUrl);
          Restangular.setRequestSuffix(".json");
          Restangular.setDefaultHttpFields({
            withCredentials: true
          });
          Restangular.setRestangularFields({
            id: "uid"
          });
          if ($scope.authorizationToken && $scope.authorizationToken !== "") {
            Restangular.setDefaultHeaders({
              Authorization: $scope.authorizationToken
            });
          }
          promisesForQ = [];
          Restangular.one("app", $scope.appId).all("service_providers").getList().then(function(providers) {
            var provider, tempPromise, _i, _len;
            for (_i = 0, _len = providers.length; _i < _len; _i++) {
              provider = providers[_i];
              tempPromise = Restangular.one("app", $scope.appId).one("service_providers", provider.uid).all("resources").getList().then(function(resources) {
                var resource, _j, _len1, _results;
                _results = [];
                for (_j = 0, _len1 = resources.length; _j < _len1; _j++) {
                  resource = resources[_j];
                  _results.push($scope.resources.push(resource));
                }
                return _results;
              });
              promisesForQ.push(tempPromise);
            }
          }).then(function() {
            return $q.all(promisesForQ)["finally"](function() {
              if ($scope.resources.length >= 1) {
                $scope.selectedResource = $scope.resources[0];
              }
              return $scope.loadingResources = false;
            });
          });
        })();

        /*
        View actions
         */
        $scope.generatorError = false;
        $scope.generatorErrorMessage = "";
        $scope.generatorSuccess = false;
        $scope.generatorSuccessMessage = "";
        return $scope.generate = function() {
          if ($scope.isGenerating || $scope.loadingResources || !$scope.selectedResource) {
            return;
          }
          $scope.generatorError = false;
          $scope.generatorSuccess = false;
          $scope.isGenerating = true;
          $scope.generatorSuccessMessage = $sce.trustAsHtml("To access your new data scaffold, open <code>app/structure.coffee</code> and change the location of the root view (or a tab) to \"<b>" + ($scope.selectedResource.name.toLowerCase()) + "#index</b>\" ");
          return BuildServerApi.generate({
            name: "scaffold",
            parameters: {
              name: $scope.selectedResource.name,
              options: {
                scriptExt: $scope.format
              }
            }
          }).then(function() {
            console.log("Data scaffold generation successful!");
            return $scope.generatorSuccess = true;
          }, function(e) {
            console.log("Data scaffold generation failed!", e);
            $scope.generatorError = true;
            return $scope.generatorErrorMessage = e.statusText;
          })["finally"](function() {
            return $scope.isGenerating = false;
          });
        };
      }
    };
  }
];


},{}],10:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.data-generators", []).directive("dataGeneratorsView", _dereq_("./dataGeneratorsViewDirective"));


},{"./dataGeneratorsViewDirective":9}],11:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$scope", "$state", "$q", "$timeout", "BuildServerApi", function($scope, $state, $q, $timeout, BuildServerApi) {
    var _checkReadyState, _deploy, _getCloudConfig, _getDataConfig, _initializeData;
    $scope.$state = $state;

    /*
    Internal helpers
     */
    _deploy = function() {
      return BuildServerApi.deploy().then(function(res) {
        $scope.cloudId = res.data.id;
        $scope.cloudHash = res.data.identification_hash;
        return $scope.appDeployed = true;
      }, function(err) {
        return $scope.error = "Could not deploy your project to the cloud. " + err.data.error;
      });
    };
    _initializeData = function() {
      return BuildServerApi.initData().then(function() {}, function(err) {
        return $scope.error = "Could not initialize data to your project. " + err.data.error;
      });
    };
    _getCloudConfig = function() {
      return BuildServerApi.getCloudConfig().then(function(res) {
        $scope.cloudId = res.data.id;
        $scope.cloudHash = res.data.identification_hash;
        return $scope.appDeployed = true;
      });
    };
    _getDataConfig = function() {
      return BuildServerApi.getDataConfig().then(function(res) {
        return $scope.dataReady = res.data.initialized;
      });
    };

    /*
    View initial state
     */
    $scope.viewReady = false;
    $scope.appDeployed = false;
    $scope.dataReady = false;
    $scope.dataEnabled = false;
    $scope.error = void 0;
    $scope.isInitializing = false;
    $scope.currentTab = "configure";

    /*
    View initialization
     */
    _checkReadyState = function() {
      var _finishBeforeViewReady;
      _finishBeforeViewReady = [];
      _finishBeforeViewReady.push(_getCloudConfig());
      _finishBeforeViewReady.push(BuildServerApi.getAccessToken().then(function(res) {
        return $scope.accessToken = res.data;
      }));
      _finishBeforeViewReady.push(_getDataConfig());
      return $q.all(_finishBeforeViewReady)["finally"](function() {
        return $timeout(function() {
          $scope.viewReady = true;
          if ($state.is("data")) {
            return $state.go("data.configure");
          }
        }, 100);
      });
    };
    _checkReadyState();

    /*
    View actions
     */
    $scope.setCurrentTab = function(newTab) {
      return $scope.currentTab = newTab;
    };
    return $scope.initializeData = function() {
      var promise;
      if ($scope.isInitializing) {
        return;
      }
      $scope.isInitializing = true;
      $scope.error = void 0;
      promise = !$scope.appDeployed ? _deploy().then(_initializeData) : _initializeData();
      promise.then(_checkReadyState);
      return promise["finally"](function() {
        return $scope.isInitializing = false;
      });
    };
  }
];


},{}],12:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$q", "$timeout", "BuildServerApi", function($q, $timeout, BuildServerApi) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/data/data-view.html",
      controller: function($scope) {

        /*
        Internal helpers
         */
        var _deploy, _finishBeforeViewReady, _getCloudConfig, _getDataConfig, _initializeData;
        _deploy = function() {
          return BuildServerApi.deploy().then(function(res) {
            $scope.cloudId = res.data.id;
            $scope.cloudHash = res.data.identification_hash;
            return $scope.appDeployed = true;
          }, function(err) {
            return $scope.error = "Could not deploy your project to the cloud. " + err.data.error;
          });
        };
        _initializeData = function() {
          return BuildServerApi.initData().then(function() {}, function(err) {
            return $scope.error = "Could not initialize data to your project. " + err.data.error;
          });
        };
        _getCloudConfig = function() {
          return BuildServerApi.getCloudConfig().then(function(res) {
            $scope.cloudId = res.data.id;
            $scope.cloudHash = res.data.identification_hash;
            return $scope.appDeployed = true;
          });
        };
        _getDataConfig = function() {
          return BuildServerApi.getDataConfig().then(function(res) {
            return $scope.dataReady = res.data.initialized;
          });
        };

        /*
        View initial state
         */
        $scope.viewReady = false;
        $scope.appDeployed = false;
        $scope.dataReady = false;
        $scope.dataEnabled = false;
        $scope.error = void 0;
        $scope.isInitializing = false;
        $scope.currentTab = "configure";

        /*
        View initialization
         */
        _finishBeforeViewReady = [];
        _finishBeforeViewReady.push(_getCloudConfig());
        _finishBeforeViewReady.push(BuildServerApi.getAccessToken().then(function(res) {
          return $scope.accessToken = res.data;
        }));
        _finishBeforeViewReady.push(_getDataConfig());
        $q.all(_finishBeforeViewReady)["finally"](function() {
          return $timeout(function() {
            return $scope.viewReady = true;
          }, 100);
        });

        /*
        View actions
         */
        $scope.setCurrentTab = function(newTab) {
          return $scope.currentTab = newTab;
        };
        return $scope.initializeData = function() {
          var promise;
          if ($scope.isInitializing) {
            return;
          }
          $scope.isInitializing = true;
          $scope.error = void 0;
          promise = !$scope.appDeployed ? _deploy().then(_initializeData).then(_getCloudConfig).then(_getDataConfig) : _initializeData();
          return promise["finally"](function() {
            return $scope.isInitializing = false;
          });
        };
      }
    };
  }
];


},{}],13:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.data", []).directive("cloudDataView", _dereq_("./dataViewDirective")).controller("DataViewCtrl", _dereq_("./DataViewCtrl"));


},{"./DataViewCtrl":11,"./dataViewDirective":12}],14:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/docs/docs-view.html",
      link: function(scope, element, attrs) {}
    };
  }
];


},{}],15:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.docs", []).directive("docsView", _dereq_("./docsViewDirective"));


},{"./docsViewDirective":14}],16:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {

      /*
      EXPOSED GENERATORS API DEFINITION
       */
      generators: [
        {
          name: "AngularJS SPA Scaffold",
          image_url: "//localhost:3000/assets/new/views/steroids-overview/grid-no-native-coding.png"
        }, {
          name: "MPA Scaffold",
          image_url: "//localhost:3000/assets/new/views/steroids-overview/grid-multi-page-architecture.png"
        }, {
          name: "Camera Example",
          image_url: "//localhost:3000/assets/new/views/steroids-overview/grid-native-performance.png"
        }, {
          name: "Mankeli",
          image_url: "//localhost:3000/assets/new/views/steroids-overview/grid-native-performance.png"
        }, {
          name: "Hilavitkutin",
          image_url: "//localhost:3000/assets/new/views/steroids-overview/grid-native-performance.png"
        }
      ]
    };
  }
];


},{}],17:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "GeneratorsAPI", function(GeneratorsAPI) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/generators/generators-view.html",
      link: function(scope, element, attrs) {
        return scope.GeneratorsAPI = GeneratorsAPI;
      }
    };
  }
];


},{}],18:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.generators", []).directive("generatorsView", _dereq_("./generatorsViewDirective")).factory("GeneratorsAPI", _dereq_("./GeneratorsAPI"));


},{"./GeneratorsAPI":16,"./generatorsViewDirective":17}],19:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$interval", "$http", "LogsAPI", function($interval, $http, LogsAPI) {
    var connection, endpoint, lastRequestTime, requestLogs;
    endpoint = void 0;
    connection = void 0;
    lastRequestTime = void 0;
    requestLogs = function() {
      return $http.get("" + endpoint + "?from=" + lastRequestTime).success(function(data) {
        LogsAPI.add(data);
        return lastRequestTime = new Date().toISOString();
      });
    };
    this.setEndpoint = function(endpointUrl) {
      return endpoint = endpointUrl;
    };
    this.connect = function() {
      if (!endpoint) {
        throw new Error("Endpoint is not set for LogConnector.");
      }
      return connection = $interval(requestLogs, 1000);
    };
    return this;
  }
];


},{}],20:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$scope", "LogsAPI", "LogsFilterAPI", function($scope, LogsAPI, LogsFilterAPI) {
    $scope.LogsAPI = LogsAPI;
    return $scope.LogsFilterAPI = LogsFilterAPI;
  }
];


},{}],21:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {

      /*
      EXPOSED LOGS API DEFINITION
       */
      logs: [],
      add: function(newLogMsg) {
        if ($.isArray(newLogMsg)) {
          return this.logs = newLogMsg.concat(this.logs);
        } else {
          if (newLogMsg != null) {
            return this.logs.push(newLogMsg);
          }
        }
      },
      clear: function() {
        return this.logs = [];
      }
    };
  }
];


},{}],22:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$filter", "DevicesAPI", "LogsAPI", function($filter, DevicesAPI, LogsAPI) {
    return {

      /*
      EXPOSED LOGS FILTER API DEFINITION
       */
      filters: {
        deviceName: "",
        view: "",
        level: ""
      },
      clearFilters: function() {
        return this.filters = {
          deviceName: "",
          view: "",
          level: ""
        };
      },
      filterByDeviceName: function(deviceName) {
        if (deviceName != null) {
          return this.filters['deviceName'] = deviceName;
        } else {
          return this.filters['deviceName'] = "";
        }
      },
      availableDeviceNameFilters: function(includeAll) {
        var availableForFiltering, device, devicesNow, ip;
        if (includeAll == null) {
          includeAll = true;
        }
        availableForFiltering = [];
        if (includeAll === true) {
          availableForFiltering.push({
            label: "All devices",
            filterBy: ""
          });
        }
        devicesNow = DevicesAPI.devices;
        if (devicesNow) {
          for (ip in devicesNow) {
            device = devicesNow[ip];
            availableForFiltering.push({
              label: device.simulator ? "" + device.device + " simulator" : device.device,
              filterBy: device.ipAddress
            });
          }
        }
        return availableForFiltering;
      },
      filterByViewName: function(viewName) {
        if (viewName != null) {
          return this.filters['view'] = viewName;
        } else {
          return this.filters['view'] = "";
        }
      },
      availableViewNameFilters: function(includeAll) {
        var availableForFiltering, logMsg, _i, _len, _ref;
        if (includeAll == null) {
          includeAll = true;
        }
        availableForFiltering = [];
        if (includeAll === true) {
          availableForFiltering.push({
            label: "All views",
            filterBy: ""
          });
        }
        _ref = $filter("unique")(LogsAPI.logs, "view");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          logMsg = _ref[_i];
          availableForFiltering.push({
            label: $filter("viewUrlToRouteName")(logMsg.view),
            filterBy: logMsg.view
          });
        }
        return availableForFiltering;
      },
      filterByLogLevel: function(level) {
        if (level != null) {
          return this.filters['level'] = level;
        } else {
          return this.filters['level'] = "";
        }
      },
      availableLogLevelFilters: [
        {
          label: "All",
          level: ""
        }, {
          label: "Info",
          level: "info"
        }, {
          label: "Errors",
          level: "error"
        }, {
          label: "Warnings",
          level: "warn"
        }, {
          label: "Debug",
          level: "debug"
        }
      ]
    };
  }
];


},{}],23:[function(_dereq_,module,exports){

/*
Filters out all duplicate items from an array by checking the specified key
@param [key] {string} the name of the attribute of each object to compare for uniqueness
if the key is empty, the entire object will be compared
if the key === false then no filtering will be performed
@return {array}
 */
module.exports = angular.module("ui.filters", []).filter("unique", function() {
  return function(items, filterOn) {
    var extractValueToCompare, hashCheck, newItems;
    if (filterOn === false) {
      return items;
    }
    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      hashCheck = {};
      newItems = [];
      extractValueToCompare = function(item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };
      angular.forEach(items, function(item) {
        var i, isDuplicate, valueToCheck;
        valueToCheck = void 0;
        isDuplicate = false;
        i = 0;
        while (i < newItems.length) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
          i++;
        }
        if (!isDuplicate) {
          newItems.push(item);
        }
      });
      items = newItems;
    }
    return items;
  };
});


},{}],24:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.logs", [_dereq_("./../preview").name, _dereq_("./filterUnique").name]).directive("logMessage", _dereq_("./logMessageDirective")).directive("logView", _dereq_("./logViewDirective")).directive("logFiltersView", _dereq_("./logFiltersViewDirective")).filter("logTimeFormat", _dereq_("./logTimeFormatFilter")).filter("logTimeMillisecondsFormat", _dereq_("./logTimeMillisecondsFormatFilter")).filter("logDateFormat", _dereq_("./logDateFormatFilter")).filter("viewUrlToRouteName", _dereq_("./viewUrlToRouteNameFilter")).factory("LogsAPI", _dereq_("./LogsAPI")).factory("LogsFilterAPI", _dereq_("./LogsFilterAPI")).service("LogCloudConnector", _dereq_("./LogCloudConnectorService")).controller("LogViewCtrl", _dereq_("./LogViewCtrl"));


},{"./../preview":51,"./LogCloudConnectorService":19,"./LogViewCtrl":20,"./LogsAPI":21,"./LogsFilterAPI":22,"./filterUnique":23,"./logDateFormatFilter":25,"./logFiltersViewDirective":26,"./logMessageDirective":27,"./logTimeFormatFilter":28,"./logTimeMillisecondsFormatFilter":29,"./logViewDirective":30,"./viewUrlToRouteNameFilter":31}],25:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return function(input) {
      var dd, inputDateTime, mm, yyyy;
      inputDateTime = new Date(input);
      dd = inputDateTime.getDate();
      if (dd < 10) {
        dd = "0" + dd;
      }
      mm = inputDateTime.getMonth();
      if (mm < 10) {
        mm = "0" + mm;
      }
      yyyy = inputDateTime.getFullYear();
      return "" + yyyy + "-" + mm + "-" + dd;
    };
  }
];


},{}],26:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "LogsAPI", "LogsFilterAPI", function(LogsAPI, LogsFilterAPI) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "/steroids-connect/logs/log-filters-view.html",
      link: function(scope, element, attrs) {
        scope.LogsAPI = LogsAPI;
        return scope.LogsFilterAPI = LogsFilterAPI;
      }
    };
  }
];


},{}],27:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "LogsFilterAPI", function(LogsFilterAPI) {
    return {
      restrict: "A",
      replace: true,
      scope: {
        logMessage: "=logMessage"
      },
      templateUrl: "/steroids-connect/logs/log-message.html",
      link: function(scope, element, attrs) {
        scope.LogsFilterAPI = LogsFilterAPI;
        scope.isOpen = false;
        scope.toggleAdditionalDetails = function() {
          return scope.isOpen = !scope.isOpen;
        };
        return scope.hasAdditionalDetails = function() {
          if (scope.logMessage.blob && scope.logMessage.blob.length > 0) {
            return true;
          } else {
            return false;
          }
        };
      }
    };
  }
];


},{}],28:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return function(input) {
      var hh, inputDateTime, mm, ss;
      inputDateTime = new Date(input);
      hh = inputDateTime.getHours();
      if (hh < 10) {
        hh = "0" + hh;
      }
      mm = inputDateTime.getMinutes();
      if (mm < 10) {
        mm = "0" + mm;
      }
      ss = inputDateTime.getSeconds();
      if (ss < 10) {
        ss = "0" + ss;
      }
      return "" + hh + ":" + mm + ":" + ss;
    };
  }
];


},{}],29:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return function(input) {
      var inputDateTime, ms;
      inputDateTime = new Date(input);
      ms = inputDateTime.getMilliseconds();
      if (ms < 10) {
        "00" + ms;
      } else if (ms < 100) {
        "0" + ms;
      }
      return "" + ms;
    };
  }
];


},{}],30:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "LogsAPI", "LogsFilterAPI", function(LogsAPI, LogsFilterAPI) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/logs/log-view.html",
      link: function(scope, element, attrs) {
        scope.LogsAPI = LogsAPI;
        return scope.LogsFilterAPI = LogsFilterAPI;
      }
    };
  }
];


},{}],31:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return function(input) {
      return input.replace("http://localhost/app/", "").replace(".html", "").replace("/", "#");
    };
  }
];


},{}],32:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$http", function($http) {
    return {

      /*
      EXPOSED SETTINGS API DEFINITION
       */
      settings: void 0,
      load: function() {
        this.settings = $http.get("__appgyver_settings.json");
        return this.settings;
      },
      save: function() {
        return console.log("Saving Steroids settings...");
      },

      /*
      ASSETS
       */
      assets: void 0,
      loadAssets: function() {
        this.assets = $http.get("__app_assets.json");
        return this.assets;
      }
    };
  }
];


},{}],33:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$scope", "$modalInstance", "tabIndex", "tabs", "icons", "views", function($scope, $modalInstance, tabIndex, tabs, icons, views) {
    $scope.icons = icons;
    $scope.views = views;
    $scope.isNewTab = tabIndex === -1;
    tabs = angular.copy(tabs);
    if (tabIndex >= 0) {
      $scope.tab = tabs[tabIndex];
    } else {
      $scope.tab = {
        title: "",
        location: "",
        icon: ""
      };
    }
    $scope.ok = function() {
      if (tabIndex >= 0) {
        tabs[tabIndex] = $scope.tab;
      } else {
        tabs.push($scope.tab);
      }
      return $modalInstance.close(tabs);
    };
    $scope.remove = function() {
      tabs.splice(tabIndex, 1);
      return $modalInstance.close(tabs);
    };
    return $scope.cancel = function() {
      return $modalInstance.dismiss("cancel");
    };
  }
];


},{}],34:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "/steroids-connect/navigation-and-themes/color-input.html",
      scope: {
        color: "="
      },
      link: function(scope, element, attrs) {}
    };
  }
];


},{}],35:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("colorpicker.module", []).factory("Helper", function() {
  return {
    closestSlider: function(elem) {
      var matchesSelector;
      matchesSelector = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector;
      if (matchesSelector.bind(elem)("I")) {
        return elem.parentNode;
      }
      return elem;
    },
    getOffset: function(elem, fixedPosition) {
      var scrollX, scrollY, x, y;
      x = 0;
      y = 0;
      scrollX = 0;
      scrollY = 0;
      while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
        x += elem.offsetLeft;
        y += elem.offsetTop;
        if (!fixedPosition && elem.tagName === "BODY") {
          scrollX += document.documentElement.scrollLeft || elem.scrollLeft;
          scrollY += document.documentElement.scrollTop || elem.scrollTop;
        } else {
          scrollX += elem.scrollLeft;
          scrollY += elem.scrollTop;
        }
        elem = elem.offsetParent;
      }
      return {
        top: y,
        left: x,
        scrollX: scrollX,
        scrollY: scrollY
      };
    },
    stringParsers: [
      {
        re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
        parse: function(execResult) {
          return [execResult[1], execResult[2], execResult[3], execResult[4]];
        }
      }, {
        re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
        parse: function(execResult) {
          return [2.55 * execResult[1], 2.55 * execResult[2], 2.55 * execResult[3], execResult[4]];
        }
      }, {
        re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
        parse: function(execResult) {
          return [parseInt(execResult[1], 16), parseInt(execResult[2], 16), parseInt(execResult[3], 16)];
        }
      }, {
        re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
        parse: function(execResult) {
          return [parseInt(execResult[1] + execResult[1], 16), parseInt(execResult[2] + execResult[2], 16), parseInt(execResult[3] + execResult[3], 16)];
        }
      }
    ]
  };
}).factory("Color", [
  "Helper", function(Helper) {
    return {
      value: {
        h: 1,
        s: 1,
        b: 1,
        a: 1
      },
      rgb: function() {
        var rgb;
        rgb = this.toRGB();
        return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
      },
      rgba: function() {
        var rgb;
        rgb = this.toRGB();
        return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ")";
      },
      hex: function() {
        return this.toHex();
      },
      RGBtoHSB: function(r, g, b, a) {
        var C, H, S, V;
        r /= 255;
        g /= 255;
        b /= 255;
        H = void 0;
        S = void 0;
        V = void 0;
        C = void 0;
        V = Math.max(r, g, b);
        C = V - Math.min(r, g, b);
        H = (C === 0 ? null : (V === r ? (g - b) / C : (V === g ? (b - r) / C + 2 : (r - g) / C + 4)));
        H = ((H + 360) % 6) * 60 / 360;
        S = (C === 0 ? 0 : C / V);
        return {
          h: H || 1,
          s: S,
          b: V,
          a: a || 1
        };
      },
      setColor: function(val) {
        var key, match, parser, values;
        val = val.toLowerCase();
        for (key in Helper.stringParsers) {
          if (Helper.stringParsers.hasOwnProperty(key)) {
            parser = Helper.stringParsers[key];
            match = parser.re.exec(val);
            values = match && parser.parse(match);
            if (values) {
              this.value = this.RGBtoHSB.apply(null, values);
              return false;
            }
          }
        }
      },
      setHue: function(h) {
        this.value.h = 1 - h;
      },
      setSaturation: function(s) {
        this.value.s = s;
      },
      setLightness: function(b) {
        this.value.b = 1 - b;
      },
      setAlpha: function(a) {
        this.value.a = parseInt((1 - a) * 100, 10) / 100;
      },
      toRGB: function(h, s, b, a) {
        var B, C, G, R, X;
        if (!h) {
          h = this.value.h;
          s = this.value.s;
          b = this.value.b;
        }
        h *= 360;
        R = void 0;
        G = void 0;
        B = void 0;
        X = void 0;
        C = void 0;
        h = (h % 360) / 60;
        C = b * s;
        X = C * (1 - Math.abs(h % 2 - 1));
        R = G = B = b - C;
        h = ~~h;
        R += [C, X, 0, 0, X, C][h];
        G += [X, C, C, X, 0, 0][h];
        B += [0, 0, X, C, C, X][h];
        return {
          r: Math.round(R * 255),
          g: Math.round(G * 255),
          b: Math.round(B * 255),
          a: a || this.value.a
        };
      },
      toHex: function(h, s, b, a) {
        var rgb;
        rgb = this.toRGB(h, s, b, a);
        return "#" + ((1 << 24) | (parseInt(rgb.r, 10) << 16) | (parseInt(rgb.g, 10) << 8) | parseInt(rgb.b, 10)).toString(16).substr(1);
      }
    };
  }
]).factory("Slider", [
  "Helper", function(Helper) {
    var pointer, slider;
    slider = {
      maxLeft: 0,
      maxTop: 0,
      callLeft: null,
      callTop: null,
      knob: {
        top: 0,
        left: 0
      }
    };
    pointer = {};
    return {
      getSlider: function() {
        return slider;
      },
      getLeftPosition: function(event) {
        return Math.max(0, Math.min(slider.maxLeft, slider.left + ((event.pageX || pointer.left) - pointer.left)));
      },
      getTopPosition: function(event) {
        return Math.max(0, Math.min(slider.maxTop, slider.top + ((event.pageY || pointer.top) - pointer.top)));
      },
      setSlider: function(event, fixedPosition) {
        var target, targetOffset;
        target = Helper.closestSlider(event.target);
        targetOffset = Helper.getOffset(target, fixedPosition);
        slider.knob = target.children[0].style;
        slider.left = event.pageX - targetOffset.left - window.pageXOffset + targetOffset.scrollX;
        slider.top = event.pageY - targetOffset.top - window.pageYOffset + targetOffset.scrollY;
        pointer = {
          left: event.pageX,
          top: event.pageY
        };
      },
      setSaturation: function(event, fixedPosition) {
        slider = {
          maxLeft: 100,
          maxTop: 100,
          callLeft: "setSaturation",
          callTop: "setLightness"
        };
        this.setSlider(event, fixedPosition);
      },
      setHue: function(event, fixedPosition) {
        slider = {
          maxLeft: 0,
          maxTop: 100,
          callLeft: false,
          callTop: "setHue"
        };
        this.setSlider(event, fixedPosition);
      },
      setAlpha: function(event, fixedPosition) {
        slider = {
          maxLeft: 0,
          maxTop: 100,
          callLeft: false,
          callTop: "setAlpha"
        };
        this.setSlider(event, fixedPosition);
      },
      setKnob: function(top, left) {
        slider.knob.top = top + "px";
        slider.knob.left = left + "px";
      }
    };
  }
]).directive("colorpicker", [
  "$document", "$compile", "Color", "Slider", "Helper", function($document, $compile, Color, Slider, Helper) {
    return {
      require: "?ngModel",
      restrict: "A",
      link: function($scope, elem, attrs, ngModel) {
        var bindMouseEvents, colorpickerPreview, colorpickerTemplate, documentMousedownHandler, emitEvent, fixedPosition, getColorpickerTemplatePosition, hideColorpickerTemplate, inputTemplate, mousemove, mouseup, pickerColor, pickerColorInput, pickerColorPointers, position, previewColor, sliderAlpha, sliderHue, sliderSaturation, target, template, thisFormat, update, withInput;
        thisFormat = (attrs.colorpicker ? attrs.colorpicker : "hex");
        position = (angular.isDefined(attrs.colorpickerPosition) ? attrs.colorpickerPosition : "bottom");
        fixedPosition = (angular.isDefined(attrs.colorpickerFixedPosition) ? attrs.colorpickerFixedPosition : false);
        target = (angular.isDefined(attrs.colorpickerParent) ? elem.parent() : angular.element(document.body));
        withInput = (angular.isDefined(attrs.colorpickerWithInput) ? attrs.colorpickerWithInput : false);
        inputTemplate = (withInput ? "<input type=\"text\" name=\"colorpicker-input\">" : "");
        template = "<div class=\"colorpicker dropdown\">" + "<div class=\"dropdown-menu\">" + "<colorpicker-saturation><i></i></colorpicker-saturation>" + "<colorpicker-hue><i></i></colorpicker-hue>" + "<colorpicker-alpha><i></i></colorpicker-alpha>" + "<colorpicker-preview></colorpicker-preview>" + inputTemplate + "<button class=\"close close-colorpicker\">&times;</button>" + "</div>" + "</div>";
        colorpickerTemplate = angular.element(template);
        pickerColor = Color;
        sliderAlpha = void 0;
        sliderHue = colorpickerTemplate.find("colorpicker-hue");
        sliderSaturation = colorpickerTemplate.find("colorpicker-saturation");
        colorpickerPreview = colorpickerTemplate.find("colorpicker-preview");
        pickerColorPointers = colorpickerTemplate.find("i");
        $compile(colorpickerTemplate)($scope);
        if (withInput) {
          pickerColorInput = colorpickerTemplate.find("input");
          pickerColorInput.on("mousedown", function(event) {
            event.stopPropagation();
          }).on("keyup", function(event) {
            var newColor;
            newColor = this.value;
            elem.val(newColor);
            if (ngModel) {
              $scope.$apply(ngModel.$setViewValue(newColor));
            }
            event.stopPropagation();
            event.preventDefault();
          });
          elem.on("keyup", function() {
            pickerColorInput.val(elem.val());
          });
        }
        bindMouseEvents = function() {
          $document.on("mousemove", mousemove);
          $document.on("mouseup", mouseup);
        };
        if (thisFormat === "rgba") {
          colorpickerTemplate.addClass("alpha");
          sliderAlpha = colorpickerTemplate.find("colorpicker-alpha");
          sliderAlpha.on("click", function(event) {
            Slider.setAlpha(event, fixedPosition);
            mousemove(event);
          }).on("mousedown", function(event) {
            Slider.setAlpha(event, fixedPosition);
            bindMouseEvents();
          });
        }
        sliderHue.on("click", function(event) {
          Slider.setHue(event, fixedPosition);
          mousemove(event);
        }).on("mousedown", function(event) {
          Slider.setHue(event, fixedPosition);
          bindMouseEvents();
        });
        sliderSaturation.on("click", function(event) {
          Slider.setSaturation(event, fixedPosition);
          mousemove(event);
        }).on("mousedown", function(event) {
          Slider.setSaturation(event, fixedPosition);
          bindMouseEvents();
        });
        if (fixedPosition) {
          colorpickerTemplate.addClass("colorpicker-fixed-position");
        }
        colorpickerTemplate.addClass("colorpicker-position-" + position);
        target.append(colorpickerTemplate);
        if (ngModel) {
          ngModel.$render = function() {
            elem.val(ngModel.$viewValue);
          };
          $scope.$watch(attrs.ngModel, function() {
            update();
          });
        }
        elem.on("$destroy", function() {
          colorpickerTemplate.remove();
        });
        previewColor = function() {
          var e;
          try {
            colorpickerPreview.css("backgroundColor", pickerColor[thisFormat]());
          } catch (_error) {
            e = _error;
            colorpickerPreview.css("backgroundColor", pickerColor.toHex());
          }
          sliderSaturation.css("backgroundColor", pickerColor.toHex(pickerColor.value.h, 1, 1, 1));
          if (thisFormat === "rgba") {
            sliderAlpha.css.backgroundColor = pickerColor.toHex();
          }
        };
        mousemove = function(event) {
          var left, newColor, slider, top;
          left = Slider.getLeftPosition(event);
          top = Slider.getTopPosition(event);
          slider = Slider.getSlider();
          Slider.setKnob(top, left);
          if (slider.callLeft) {
            pickerColor[slider.callLeft].call(pickerColor, left / 100);
          }
          if (slider.callTop) {
            pickerColor[slider.callTop].call(pickerColor, top / 100);
          }
          previewColor();
          newColor = pickerColor[thisFormat]();
          elem.val(newColor);
          if (ngModel) {
            $scope.$apply(ngModel.$setViewValue(newColor));
          }
          if (withInput) {
            pickerColorInput.val(newColor);
          }
          return false;
        };
        mouseup = function() {
          $document.off("mousemove", mousemove);
          $document.off("mouseup", mouseup);
        };
        update = function() {
          pickerColor.setColor(elem.val());
          pickerColorPointers.eq(0).css({
            left: pickerColor.value.s * 100 + "px",
            top: 100 - pickerColor.value.b * 100 + "px"
          });
          pickerColorPointers.eq(1).css("top", 100 * (1 - pickerColor.value.h) + "px");
          pickerColorPointers.eq(2).css("top", 100 * (1 - pickerColor.value.a) + "px");
          previewColor();
        };
        getColorpickerTemplatePosition = function() {
          var positionOffset, positionValue;
          positionValue = void 0;
          positionOffset = Helper.getOffset(elem[0]);
          if (angular.isDefined(attrs.colorpickerParent)) {
            positionOffset.left = 0;
            positionOffset.top = 0;
          }
          if (position === "top") {
            positionValue = {
              top: positionOffset.top - 147,
              left: positionOffset.left
            };
          } else if (position === "right") {
            positionValue = {
              top: positionOffset.top,
              left: positionOffset.left + 126
            };
          } else if (position === "bottom") {
            positionValue = {
              top: positionOffset.top + elem[0].offsetHeight + 2,
              left: positionOffset.left
            };
          } else if (position === "left") {
            positionValue = {
              top: positionOffset.top,
              left: positionOffset.left - 150
            };
          }
          return {
            top: positionValue.top + "px",
            left: positionValue.left + "px"
          };
        };
        documentMousedownHandler = function() {
          hideColorpickerTemplate();
        };
        elem.on("click", function() {
          update();
          colorpickerTemplate.addClass("colorpicker-visible").css(getColorpickerTemplatePosition());
          $document.on("mousedown", documentMousedownHandler);
        });
        colorpickerTemplate.on("mousedown", function(event) {
          event.stopPropagation();
          event.preventDefault();
        });
        emitEvent = function(name) {
          if (ngModel) {
            $scope.$emit(name, {
              name: attrs.ngModel,
              value: ngModel.$modelValue
            });
          }
        };
        hideColorpickerTemplate = function() {
          if (colorpickerTemplate.hasClass("colorpicker-visible")) {
            colorpickerTemplate.removeClass("colorpicker-visible");
            emitEvent("colorpicker-closed");
            $document.off("mousedown", documentMousedownHandler);
          }
        };
        colorpickerTemplate.find("button").on("click", function() {
          hideColorpickerTemplate();
        });
      }
    };
  }
]);


},{}],36:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/navigation-and-themes/drawer-configurator.html",
      scope: {
        position: "@drawerPosition",
        steroidsSettings: "="
      },
      link: function(scope, element, attrs) {}
    };
  }
];


},{}],37:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/navigation-and-themes/general-settings-configurator.html",
      scope: {
        steroidsSettings: "=",
        assets: "="
      },
      link: function(scope, element, attrs) {}
    };
  }
];


},{}],38:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.navigation-and-themes", [_dereq_("./colorpicker").name, _dereq_("./ui-sortable").name, "ui.bootstrap"]).directive("stickyScroll", _dereq_("./stickyScrollDirective")).directive("colorInput", _dereq_("./colorInputDirective")).directive("viewSelector", _dereq_("./viewSelectorDirective")).directive("tabEditor", _dereq_("./tabEditorDirective")).directive("generalSettingsConfiguratorView", _dereq_("./generalSettingsConfiguratorViewDirective")).directive("navigationBarConfiguratorView", _dereq_("./navigationBarConfiguratorViewDirective")).directive("statusBarConfiguratorView", _dereq_("./statusBarConfiguratorViewDirective")).directive("tabsConfiguratorView", _dereq_("./tabsConfiguratorViewDirective")).directive("drawerConfiguratorView", _dereq_("./drawerConfiguratorViewDirective")).directive("navigationAndThemesView", _dereq_("./navigationAndThemesViewDirective")).factory("SteroidsSettingsAPI", _dereq_("./SteroidsSettingsAPI")).controller("TabModalCtrl", _dereq_("./TabModalCtrl"));


},{"./SteroidsSettingsAPI":32,"./TabModalCtrl":33,"./colorInputDirective":34,"./colorpicker":35,"./drawerConfiguratorViewDirective":36,"./generalSettingsConfiguratorViewDirective":37,"./navigationAndThemesViewDirective":39,"./navigationBarConfiguratorViewDirective":40,"./statusBarConfiguratorViewDirective":41,"./stickyScrollDirective":42,"./tabEditorDirective":43,"./tabsConfiguratorViewDirective":44,"./ui-sortable":45,"./viewSelectorDirective":46}],39:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "SteroidsSettingsAPI", "$timeout", "$interval", function(SteroidsSettingsAPI, $timeout, $interval) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/navigation-and-themes/navigation-and-themes-view.html",
      link: function(scope, element, attrs) {

        /*
        SETTINGS
         */
        scope.savingSettings = false;
        scope.unsavedChanges = false;
        scope.loadingSettings = true;
        scope.steroidsSettings = void 0;
        scope.appAssets = void 0;
        scope.loadSettings = function() {
          scope.loadingSettings = true;
          return SteroidsSettingsAPI.load().success(function(data) {
            return scope.steroidsSettings = data;
          })["finally"](function() {
            return scope.loadingSettings = false;
          });
        };
        scope.loadSettings();
        scope.save = function() {
          if (!scope.unsavedChanges) {
            return;
          }
          scope.savingSettings = true;
          return $timeout(function() {
            scope.savingSettings = false;
            return scope.unsavedChanges = false;
          }, 1000);
        };
        scope.$watch("steroidsSettings", function(newVal, oldVal) {
          if (oldVal !== void 0) {
            return scope.unsavedChanges = true;
          }
        }, true);
        scope.loadAssets = function() {
          return SteroidsSettingsAPI.loadAssets().success(function(data) {
            return scope.appAssets = data;
          });
        };
        return scope.loadAssets();
      }
    };
  }
];


},{}],40:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/navigation-and-themes/navigation-bar-configurator.html",
      scope: {
        steroidsSettings: "="
      },
      link: function(scope, element, attrs) {}
    };
  }
];


},{}],41:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/navigation-and-themes/status-bar-configurator.html",
      scope: {
        steroidsSettings: "="
      },
      link: function(scope, element, attrs) {
        scope.statusBarStyles = ["Dark", "Light"];
        scope.isEnabled = function() {
          var _ref;
          if ((_ref = scope.steroidsSettings.configuration) != null ? _ref.status_bar_enabled : void 0) {
            return true;
          } else {
            return false;
          }
        };
        scope.enable = function() {
          var _ref;
          if (scope.isEnabled()) {
            return;
          }
          if (!scope.steroidsSettings.configuration) {
            return scope.steroidsSettings.configuration = {
              status_bar_enabled: true,
              status_bar_style: "Light"
            };
          } else {
            return (_ref = scope.steroidsSettings.configuration) != null ? _ref.status_bar_enabled = true : void 0;
          }
        };
        return scope.disable = function() {
          var _ref;
          if (!scope.isEnabled()) {
            return;
          }
          if (!scope.steroidsSettings.configuration) {
            return scope.steroidsSettings.configuration = {
              status_bar_enabled: false,
              status_bar_style: "Light"
            };
          } else {
            return (_ref = scope.steroidsSettings.configuration) != null ? _ref.status_bar_enabled = false : void 0;
          }
        };
      }
    };
  }
];


},{}],42:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$window", function($window) {
    return {
      restrict: "A",
      scope: {
        offset: "@"
      },
      link: function(scope, element, attrs) {
        var $element, $windowElem, handleScroll, isOverOffset;
        $element = angular.element(element);
        $windowElem = angular.element($window);
        if (!scope.offset) {
          scope.offset = 0;
        }
        scope.distance = $element.offset().top - scope.offset;
        isOverOffset = function() {
          return $windowElem[0].pageYOffset > scope.offset;
        };
        handleScroll = function() {
          if (isOverOffset()) {
            if (!$element.hasClass("sticky-scroll")) {
              $element.addClass("sticky-scroll");
              $element.width($element.parent().width());
              return $element.css("top", scope.distance + "px");
            }
          } else {
            return $element.removeClass("sticky-scroll");
          }
        };
        $element.width($element.parent().width());
        handleScroll();
        return $windowElem.bind("scroll", function() {
          return handleScroll();
        });
      }
    };
  }
];


},{}],43:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$modal", function($modal) {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "/steroids-connect/navigation-and-themes/tab-editor.html",
      scope: {
        tabs: "=",
        icons: "=",
        views: "="
      },
      link: function(scope, element, attrs) {
        scope.getPreviewForTab = function(iconPath) {
          var icon, _i, _len, _ref;
          _ref = scope.icons;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            icon = _ref[_i];
            if (icon.path === iconPath) {
              return icon.url;
            }
          }
          return iconPath;
        };
        return scope.openEditModal = function(tabIndex) {
          var editModal;
          editModal = $modal.open({
            templateUrl: "/steroids-connect/navigation-and-themes/tab-modal.html",
            controller: "TabModalCtrl",
            size: "lg",
            resolve: {
              tabIndex: function() {
                return tabIndex;
              },
              tabs: function() {
                return scope.tabs;
              },
              icons: function() {
                return scope.icons;
              },
              views: function() {
                return scope.views;
              }
            }
          });
          return editModal.result.then(function(newTabs) {
            return scope.tabs = newTabs;
          });
        };
      }
    };
  }
];


},{}],44:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$timeout", function($timeout) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/navigation-and-themes/tabs-configurator.html",
      scope: {
        steroidsSettings: "=",
        assets: "="
      },
      link: function(scope, element, attrs) {
        scope.isEnabled = function() {
          if (scope.steroidsSettings.tabBar.enabled) {
            return true;
          } else {
            return false;
          }
        };
        scope.enable = function() {
          if (scope.isEnabled()) {
            return;
          }
          return scope.steroidsSettings.tabBar.enabled = true;
        };
        return scope.disable = function() {
          if (!scope.isEnabled()) {
            return;
          }
          return scope.steroidsSettings.tabBar.enabled = false;
        };
      }
    };
  }
];


},{}],45:[function(_dereq_,module,exports){
module.exports = angular.module("ui.sortable", []).value("uiSortableConfig", {}).directive("uiSortable", [
  "uiSortableConfig", "$timeout", "$log", function(uiSortableConfig, $timeout, $log) {
    return {
      require: "?ngModel",
      link: function(scope, element, attrs, ngModel) {
        var callbacks, combineCallbacks, hasSortingHelper, opts, savedNodes, wrappers;
        combineCallbacks = function(first, second) {
          if (second && (typeof second === "function")) {
            return function(e, ui) {
              first(e, ui);
              second(e, ui);
            };
          }
          return first;
        };
        hasSortingHelper = function(element, ui) {
          var helperOption;
          helperOption = element.sortable("option", "helper");
          return helperOption === "clone" || (typeof helperOption === "function" && ui.item.sortable.isCustomHelperUsed());
        };
        savedNodes = void 0;
        opts = {};
        callbacks = {
          receive: null,
          remove: null,
          start: null,
          stop: null,
          update: null
        };
        wrappers = {
          helper: null
        };
        angular.extend(opts, uiSortableConfig, scope.$eval(attrs.uiSortable));
        if (!angular.element.fn || !angular.element.fn.jquery) {
          $log.error("ui.sortable: jQuery should be included before AngularJS!");
          return;
        }
        if (ngModel) {
          scope.$watch(attrs.ngModel + ".length", function() {
            $timeout(function() {
              if (!!element.data("ui-sortable")) {
                element.sortable("refresh");
              }
            });
          });
          callbacks.start = function(e, ui) {
            ui.item.sortable = {
              index: ui.item.index(),
              cancel: function() {
                ui.item.sortable._isCanceled = true;
              },
              isCanceled: function() {
                return ui.item.sortable._isCanceled;
              },
              isCustomHelperUsed: function() {
                return !!ui.item.sortable._isCustomHelperUsed;
              },
              _isCanceled: false,
              _isCustomHelperUsed: ui.item.sortable._isCustomHelperUsed
            };
          };
          callbacks.activate = function() {
            var excludes, phElement, placeholder;
            savedNodes = element.contents();
            placeholder = element.sortable("option", "placeholder");
            if (placeholder && placeholder.element && typeof placeholder.element === "function") {
              phElement = placeholder.element();
              phElement = angular.element(phElement);
              excludes = element.find("[class=\"" + phElement.attr("class") + "\"]");
              savedNodes = savedNodes.not(excludes);
            }
          };
          callbacks.update = function(e, ui) {
            if (!ui.item.sortable.received) {
              ui.item.sortable.dropindex = ui.item.index();
              ui.item.sortable.droptarget = ui.item.parent();
              element.sortable("cancel");
            }
            if (hasSortingHelper(element, ui) && !ui.item.sortable.received) {
              savedNodes = savedNodes.not(savedNodes.last());
            }
            savedNodes.appendTo(element);
            if (ui.item.sortable.received && !ui.item.sortable.isCanceled()) {
              scope.$apply(function() {
                ngModel.$modelValue.splice(ui.item.sortable.dropindex, 0, ui.item.sortable.moved);
              });
            }
          };
          callbacks.stop = function(e, ui) {
            if (!ui.item.sortable.received && ("dropindex" in ui.item.sortable) && !ui.item.sortable.isCanceled()) {
              scope.$apply(function() {
                ngModel.$modelValue.splice(ui.item.sortable.dropindex, 0, ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0]);
              });
            } else {
              if ((("dropindex" in ui.item.sortable) || ui.item.sortable.isCanceled()) && !hasSortingHelper(element, ui)) {
                savedNodes.appendTo(element);
              }
            }
          };
          callbacks.receive = function(e, ui) {
            ui.item.sortable.received = true;
          };
          callbacks.remove = function(e, ui) {
            if (!("dropindex" in ui.item.sortable)) {
              element.sortable("cancel");
              ui.item.sortable.cancel();
            }
            if (!ui.item.sortable.isCanceled()) {
              scope.$apply(function() {
                ui.item.sortable.moved = ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0];
              });
            }
          };
          wrappers.helper = function(inner) {
            if (inner && typeof inner === "function") {
              return function(e, item) {
                var innerResult;
                innerResult = inner(e, item);
                item.sortable._isCustomHelperUsed = item !== innerResult;
                return innerResult;
              };
            }
            return inner;
          };
          scope.$watch(attrs.uiSortable, (function(newVal) {
            if (!!element.data("ui-sortable")) {
              angular.forEach(newVal, function(value, key) {
                if (callbacks[key]) {
                  if (key === "stop") {
                    value = combineCallbacks(value, function() {
                      scope.$apply();
                    });
                  }
                  value = combineCallbacks(callbacks[key], value);
                } else {
                  if (wrappers[key]) {
                    value = wrappers[key](value);
                  }
                }
                element.sortable("option", key, value);
              });
            }
          }), true);
          angular.forEach(callbacks, function(value, key) {
            opts[key] = combineCallbacks(value, opts[key]);
          });
        } else {
          $log.info("ui.sortable: ngModel not provided!", element);
        }
        element.sortable(opts);
      }
    };
  }
]);


},{}],46:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "/steroids-connect/navigation-and-themes/view-selector.html",
      scope: {
        view: "=",
        views: "="
      },
      link: function(scope, element, attrs) {
        scope.selectedId = scope.view.id;
        scope.$watch("view", function() {
          return scope.selectedId = scope.view.id;
        }, true);
        return scope.setViewById = function(id) {
          var view, _i, _len, _ref;
          _ref = scope.views;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            view = _ref[_i];
            if (!(view.id === id)) {
              continue;
            }
            scope.view = view;
            return;
          }
        };
      }
    };
  }
];


},{}],47:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$scope", "$location", "$timeout", "DevicesAPI", "BuildServerApi", function($scope, $location, $timeout, DevicesAPI, BuildServerApi) {
    var decodedQrCode, parseQueryParams, qrCode, _emulatorTimeout, _simulatorTimeout;
    $scope.DevicesAPI = DevicesAPI;
    $scope.simulatorLaunchError = void 0;
    $scope.emulatorLaunchError = void 0;
    parseQueryParams = function() {
      var param, paramObj, params, _i, _len;
      params = /(?:[^\?]*\?)([^#]*)(?:#.*)?/g.exec($location.absUrl());
      if (params == null) {
        return {};
      }
      params = params[1].split("&");
      paramObj = {};
      for (_i = 0, _len = params.length; _i < _len; _i++) {
        param = params[_i];
        param = param.split("=");
        paramObj[param[0]] = param[1];
      }
      return paramObj;
    };
    qrCode = parseQueryParams()["qrcode"];
    decodedQrCode = decodeURIComponent(qrCode);
    $scope.qrCode = decodedQrCode;

    /*
    EMULATOR
     */
    $scope.emulatorIsLaunching = false;
    _emulatorTimeout = void 0;
    $scope.launchEmulator = function() {
      if ($scope.emulatorIsLaunching) {
        return;
      }
      $scope.emulatorIsLaunching = true;
      BuildServerApi.launchEmulator().then(function(res) {
        return $scope.emulatorLaunchError = void 0;
      }, function(error) {
        $scope.emulatorIsLaunching = false;
        return $scope.emulatorLaunchError = error.data.error;
      })["finally"](function() {});
      return $timeout(function() {
        return $scope.emulatorIsLaunching = false;
      }, 2000);
    };

    /*
    SIMULATOR
     */
    $scope.simulatorIsLaunching = false;
    _simulatorTimeout = void 0;
    return $scope.launchSimulator = function() {
      if ($scope.simulatorIsLaunching) {
        return;
      }
      $scope.simulatorIsLaunching = true;
      BuildServerApi.launchSimulator().then(function(res) {
        return $scope.simulatorLaunchError = void 0;
      }, function(error) {
        $scope.simulatorIsLaunching = false;
        return $scope.simulatorLaunchError = error.data.error;
      })["finally"](function() {});
      return $timeout(function() {
        return $scope.simulatorIsLaunching = false;
      }, 2000);
    };
  }
];


},{}],48:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$interval", "$http", "DevicesAPI", function($interval, $http, DevicesAPI) {
    var connection, requestClients;
    connection = void 0;
    requestClients = function() {
      return $http.get("http://localhost:4567/__appgyver/clients").success(function(data) {
        var devices;
        devices = Object.keys(data.clients).length === 0 ? null : data.clients;
        return DevicesAPI.setDevices(devices);
      });
    };
    this.connect = function() {
      return connection = $interval(requestClients, 1000);
    };
    return this;
  }
];


},{}],49:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  function() {
    return {

      /*
      EXPOSED DEVICES API DEFINITION
       */
      setDevices: function(devices) {
        return this.devices = devices;
      },
      devices: {}
    };
  }
];


},{}],50:[function(_dereq_,module,exports){
"use strict";
var qrcode;

qrcode = _dereq_("../../../bower_components/qrcode-generator/js/qrcode.js");

window.qrcode = qrcode;

angular.module("monospaced.qrcode", []).directive("qrcode", [
  "$window", function($window) {
    var canvas2D, draw, levels;
    canvas2D = !!$window.CanvasRenderingContext2D;
    levels = {
      L: "Low",
      M: "Medium",
      Q: "Quartile",
      H: "High"
    };
    draw = function(context, qr, modules, tile) {
      var col, h, row, w;
      row = 0;
      while (row < modules) {
        col = 0;
        while (col < modules) {
          w = Math.ceil((col + 1) * tile) - Math.floor(col * tile);
          h = Math.ceil((row + 1) * tile) - Math.floor(row * tile);
          context.fillStyle = (qr.isDark(row, col) ? "#000" : "#fff");
          context.fillRect(Math.round(col * tile), Math.round(row * tile), w, h);
          col++;
        }
        row++;
      }
    };
    return {
      restrict: "E",
      template: "<canvas></canvas>",
      link: function(scope, element, attrs) {
        var canvas, context, data, domElement, error, errorCorrectionLevel, isMonitoring, modules, monitorParentSize, qr, render, setData, setErrorCorrectionLevel, setSize, setVersion, size, tile, trim, version;
        domElement = element[0];
        canvas = element.find("canvas")[0];
        context = (canvas2D ? canvas.getContext("2d") : null);
        trim = /^\s+|\s+$/g;
        error = void 0;
        version = void 0;
        errorCorrectionLevel = void 0;
        data = void 0;
        size = void 0;
        modules = void 0;
        tile = void 0;
        qr = void 0;
        setVersion = function(value) {
          version = Math.max(1, Math.min(parseInt(value, 10), 10)) || 4;
        };
        setErrorCorrectionLevel = function(value) {
          errorCorrectionLevel = (value in levels ? value : "M");
        };
        setData = function(value) {
          var e;
          if (!value) {
            return;
          }
          data = value.replace(trim, "");
          qr = qrcode(version, errorCorrectionLevel);
          qr.addData(data);
          try {
            qr.make();
          } catch (_error) {
            e = _error;
            error = e.message;
            return;
          }
          error = false;
          modules = qr.getModuleCount();
        };
        isMonitoring = false;
        monitorParentSize = function() {
          if (!isMonitoring) {
            isMonitoring = true;
            return $(window).resize(function() {
              setSize(attrs.size);
              return render();
            });
          }
        };
        setSize = function(value) {
          if (String(value).indexOf("%") > -1) {
            size = element.width();
            monitorParentSize();
          } else {
            size = parseInt(value, 10) || modules * 2;
          }
          tile = size / modules;
          canvas.width = canvas.height = size;
        };
        render = function() {
          if (!qr) {
            return;
          }
          if (error) {
            if (!canvas2D) {
              domElement.innerHTML = "<img src width=\"" + size + "\"" + "height=\"" + size + "\">";
            }
            scope.$emit("qrcode:error", error);
            return;
          }
          if (canvas2D) {
            draw(context, qr, modules, tile);
          } else {
            domElement.innerHTML = qr.createImgTag(tile, 0);
          }
        };
        setVersion(attrs.version);
        setErrorCorrectionLevel(attrs.errorCorrectionLevel);
        setSize(attrs.size);
        attrs.$observe("version", function(value) {
          if (!value) {
            return;
          }
          setVersion(value);
          setData(data);
          setSize(size);
          render();
        });
        attrs.$observe("errorCorrectionLevel", function(value) {
          if (!value) {
            return;
          }
          setErrorCorrectionLevel(value);
          setData(data);
          setSize(size);
          render();
        });
        attrs.$observe("data", function(value) {
          if (!value) {
            return;
          }
          setData(value);
          setSize(size);
          render();
        });
        attrs.$observe("size", function(value) {
          if (!value) {
            return;
          }
          setSize(value);
          render();
        });
      }
    };
  }
]);

module.exports = angular.module("monospaced.qrcode");


},{"../../../bower_components/qrcode-generator/js/qrcode.js":1}],51:[function(_dereq_,module,exports){
"use strict";
module.exports = angular.module("SteroidsConnect.preview", [_dereq_("./angular-qrcode").name]).directive("previewView", _dereq_("./previewViewDirective")).factory("DevicesAPI", _dereq_("./DevicesAPI")).service("DeviceCloudConnector", _dereq_("./DeviceCloudConnectorService")).controller("ConnectViewCtrl", _dereq_("./ConnectViewCtrl"));


},{"./ConnectViewCtrl":47,"./DeviceCloudConnectorService":48,"./DevicesAPI":49,"./angular-qrcode":50,"./previewViewDirective":52}],52:[function(_dereq_,module,exports){
"use strict";
module.exports = [
  "$location", "$timeout", "DevicesAPI", "BuildServerApi", function($location, $timeout, DevicesAPI, BuildServerApi) {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "/steroids-connect/preview/preview-view.html",
      link: function($scope, element, attrs) {
        var decodedQrCode, parseQueryParams, qrCode, _emulatorTimeout, _simulatorTimeout;
        $scope.DevicesAPI = DevicesAPI;
        $scope.simulatorLaunchError = void 0;
        $scope.emulatorLaunchError = void 0;
        parseQueryParams = function() {
          var param, paramObj, params, _i, _len;
          params = /(?:[^\?]*\?)([^#]*)(?:#.*)?/g.exec($location.absUrl());
          if (params == null) {
            return {};
          }
          params = params[1].split("&");
          paramObj = {};
          for (_i = 0, _len = params.length; _i < _len; _i++) {
            param = params[_i];
            param = param.split("=");
            paramObj[param[0]] = param[1];
          }
          return paramObj;
        };
        qrCode = parseQueryParams()["qrcode"];
        decodedQrCode = decodeURIComponent(qrCode);
        $scope.qrCode = decodedQrCode;

        /*
        EMULATOR
         */
        $scope.emulatorIsLaunching = false;
        _emulatorTimeout = void 0;
        $scope.launchEmulator = function() {
          if ($scope.emulatorIsLaunching) {
            return;
          }
          $scope.emulatorIsLaunching = true;
          BuildServerApi.launchEmulator().then(function(res) {
            return $scope.emulatorLaunchError = void 0;
          }, function(error) {
            $scope.emulatorIsLaunching = false;
            return $scope.emulatorLaunchError = error.data.error;
          })["finally"](function() {});
          return $timeout(function() {
            return $scope.emulatorIsLaunching = false;
          }, 2000);
        };

        /*
        SIMULATOR
         */
        $scope.simulatorIsLaunching = false;
        _simulatorTimeout = void 0;
        return $scope.launchSimulator = function() {
          if ($scope.simulatorIsLaunching) {
            return;
          }
          $scope.simulatorIsLaunching = true;
          BuildServerApi.launchSimulator().then(function(res) {
            return $scope.simulatorLaunchError = void 0;
          }, function(error) {
            $scope.simulatorIsLaunching = false;
            return $scope.simulatorLaunchError = error.data.error;
          })["finally"](function() {});
          return $timeout(function() {
            return $scope.simulatorIsLaunching = false;
          }, 2000);
        };
      }
    };
  }
];


},{}],53:[function(_dereq_,module,exports){
angular.module('SteroidsConnect').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('/steroids-connect/build-settings/build-settings-view.html',
    "<div id=\"view-cloud-settings\" class=\"container\">\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "\n" +
    "    <!-- Content -->\n" +
    "    <div class=\"col-xs-12\" ng-if=\"viewReady\">\n" +
    "      <div class=\"row\">\n" +
    "\n" +
    "        <!-- App actions -->\n" +
    "        <div class=\"col-sm-12\">\n" +
    "\n" +
    "          <h2>App Cloud Settings</h2>\n" +
    "          <p>On this page, you can deploy your app to the AppGyver Cloud and manage your app's cloud settings, including online sharing and Build Service settings.</p>\n" +
    "\n" +
    "          <br>\n" +
    "\n" +
    "          <h3>App Details</h3>\n" +
    "          <p>App Cloud ID: <b>{{hasCloudJson ? cloudId : \"&laquo;Your app hasn't been deployed to AppGyver Cloud yet.&raquo;\"}}</b></p>\n" +
    "          <br>\n" +
    "\n" +
    "          <!-- Deploy button -->\n" +
    "          <div class=\"clearfix\">\n" +
    "            <button class=\"btn btn-lg btn-primary\" ng-click=\"deploy()\" ng-disabled=\"isDeploying\" style=\"display: inline-block; float: left;\">\n" +
    "              <span class=\"glyphicon glyphicon-cloud-upload\"></span> {{isDeploying ? 'Deploying...' : 'Deploy to cloud'}}\n" +
    "            </button>\n" +
    "            <ag-ui-spinner size=\"29\" color=\"black\" ng-show=\"isDeploying\" style=\"display: inline-block; float: left; margin-left: 10px;\"></ag-ui-spinner>\n" +
    "          </div>\n" +
    "\n" +
    "          <p class=\"text-muted\" ng-hide=\"hasCloudJson || deployError\" style=\"padding-top: 6px;\"><small>Deploy the app to AppGyver Cloud to use the Build Service <br class=\"hidden-xs hidden-sm\">and to share your app online.</small></p>\n" +
    "\n" +
    "          <p class=\"text-danger\" ng-show=\"deployError\" style=\"margin-top: 6px;\"><small>{{deployError}}</small></p>\n" +
    "\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"row\" ng-show=\"hasCloudJson\">\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <br>\n" +
    "          <br class=\"hidden-xs hidden-sm\">\n" +
    "          <h2>Build Service</h2>\n" +
    "          <p>The Build Service allows you to configure your app's build settings and create stand-alone builds.</p>\n" +
    "          <br>\n" +
    "          <a class=\"btn btn-lg btn-primary\" ng-href=\"http://cloud.appgyver.com/applications/{{cloudId}}\" target=\"_blank\">\n" +
    "            <span class=\"glyphicon glyphicon-cog\"></span> Open Build Service\n" +
    "          </a>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-sm-6\">\n" +
    "          <br>\n" +
    "          <br class=\"hidden-xs hidden-sm\">\n" +
    "          <h2>Share App</h2>\n" +
    "          <p>The cloud-deployed version of your app can be shared online. The QR code at the link above can be scanned by anyone with an AppGyver Scanner, allowing you to easily share your app with whomever you want. Note that the share page will always serve the latest cloud-deployed version of your app.</p>\n" +
    "          <br>\n" +
    "          <a class=\"btn btn-primary\" ng-href=\"https://share.appgyver.com/?id={{cloudId}}&hash={{cloudHash}}\" target=\"_blank\">\n" +
    "            <span class=\"glyphicon glyphicon-qrcode\"></span> Open cloud share page\n" +
    "          </a>\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/steroids-connect/connect-ui/connect-ui.html',
    "<div id=\"view-connect-ui\" class=\"ag__global__products ag__steroids-connect\">\n" +
    "\n" +
    "  <!-- Navbar -->\n" +
    "  <nav class=\"navbar navbar-default navbar-static-top ag__steroids-connect__header\" role=\"navigation\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "      <!-- Navbar header -->\n" +
    "      <div class=\"navbar-header\">\n" +
    "        <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#ag-steroids-connect-nav\">\n" +
    "          <span class=\"icon-bar\"></span>\n" +
    "          <span class=\"icon-bar\"></span>\n" +
    "          <span class=\"icon-bar\"></span>\n" +
    "        </button>\n" +
    "        <div class=\"navbar-brand\">\n" +
    "          <img src=\"//s3.amazonaws.com/appgyver.assets/global-assets/images/appgyver-universal-logos/appgyver-logo-white.svg\" alt=\"Steroids Connect\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <!-- Navbar links -->\n" +
    "      <ul class=\"nav navbar-nav navbar-right\">\n" +
    "        <li ng-repeat=\"tab in tabs\" ng-class=\"{'active': $state.includes(tab.stateHref)}\"><a ui-sref=\"{{tab.stateHref}}\">{{tab.label}}</a></li>\n" +
    "      </ul>\n" +
    "\n" +
    "    </div>\n" +
    "  </nav>\n" +
    "\n" +
    "  <!-- Statubar -->\n" +
    "  <div class=\"ag__steroids-connect__status-bar\" ng-if=\"isConnected\">\n" +
    "    <div class=\"container\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\" ng-if=\"workingOn\">\n" +
    "          <ag-ui-spinner size=\"18\" color=\"#999C9C\" style=\"display: inline-block;\"></ag-ui-spinner>\n" +
    "          <p class=\"ag__steroids-connect__status-bar__status-text\">{{workingOn}}</p>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-12\" ng-if=\"!workingOn\">\n" +
    "          <span class=\"ag__steroids-connect__status-bar__iconbox glyphicon glyphicon-ok\"></span>\n" +
    "          <p class=\"ag__steroids-connect__status-bar__status-text\">Connection established with the Steroids Development Server, all good!</p>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-12\" ng-if=\"!isConnected\">\n" +
    "          <span class=\"ag__steroids-connect__status-bar__iconbox glyphicon glyphicon-warning-sign\"></span>\n" +
    "          <p class=\"ag__steroids-connect__status-bar__status-text red\"><b>Cannot connect to the Steroids Development Server!</b> Start the Steroids Development Server by running <code>steroids connect</code> in Terminal in your project directory.</p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- ui-router views -->\n" +
    "  <div class=\"container-fluid\" ui-view ng-if=\"isConnected\"></div>\n" +
    "\n" +
    "  <!-- Really bad stuff! -->\n" +
    "  <div class=\"container error-container\" ng-class=\"{'error-active': !isConnected}\">\n" +
    "\n" +
    "    <div class=\"not-connected-error\" ng-class=\"{'error-active': !isConnected}\">\n" +
    "      <h1>Connection lost!</h1>\n" +
    "      <br>\n" +
    "      <p><b>Cannot connect to the Steroids Development Server!</b> Start the Steroids Development Server by running <code>steroids connect</code> in Terminal in your project directory.</p>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/steroids-connect/data-generators/data-generators-view.html',
    "<div id=\"data-view-generators\" class=\"container\">\n" +
    "\n" +
    "  <!-- View header -->\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12 col-sm-8\">\n" +
    "      <h3 style=\"margin: 0px;\">Data Generators:</h3>\n" +
    "      <p>Generate an AngularJS-based CRUD scaffold from your data resources.</p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <br><br>\n" +
    "\n" +
    "  <!-- List of available generators -->\n" +
    "  <div class=\"row\">\n" +
    "\n" +
    "    <div class=\"col-xs-12 col-sm-6\">\n" +
    "      <form class=\"form-horizontal\" role=\"form\">\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label for=\"resourceName\" class=\"col-sm-4 control-label\">Data Resource</label>\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <select ng-hide=\"loadingResources\" name=\"resourceSelector\" class=\"form-control\" ng-model=\"selectedResource\" ng-options=\"resource as resource.name for resource in resources\"></select>\n" +
    "            <div ng-show=\"loadingResources\" class=\"form-control-static\" style=\"vertical-align: center;\"><ag-ui-spinner size=\"22\" color=\"black\" style=\"display: inline-block; float: left;\"></ag-ui-spinner> <span style=\"vertical-align: top; display: inline-block; float: left; line-height: 22px; margin-left: 10px;\">Loading resources...</span></div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-sm-4 control-label\">Script Format</label>\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <div class=\"radio\">\n" +
    "              <label>\n" +
    "                <input type=\"radio\" name=\"format\" value=\"coffee\" ng-model=\"format\" checked>\n" +
    "                CoffeeScript\n" +
    "              </label>\n" +
    "            </div>\n" +
    "            <div class=\"radio\">\n" +
    "              <label>\n" +
    "                <input type=\"radio\" name=\"format\" value=\"js\" ng-model=\"format\">\n" +
    "                JavaScript\n" +
    "              </label>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <div class=\"col-sm-offset-4 col-sm-8\">\n" +
    "\n" +
    "            <div class=\"clearfix\">\n" +
    "              <button type=\"button\" class=\"btn btn-lg btn-primary\" ng-click=\"generate()\" ng-disabled=\"loadingResources || isGenerating || !selectedResource\" style=\"display: inline-block; float: left;\">\n" +
    "                Generate CRUD Scaffold\n" +
    "              </button>\n" +
    "              <ag-ui-spinner size=\"29\" color=\"black\" ng-show=\"isGenerating\" style=\"display: inline-block; float: left; margin-left: 10px;\"></ag-ui-spinner>\n" +
    "            </div>\n" +
    "\n" +
    "            <p ng-if=\"generatorError\" class=\"text-danger\" style=\"margin-top: 6px;\"><small>Failed to generate scaffold. {{generatorErrorMessage ? generatorErrorMessage : \"An unknown error occured.\"}}</small></p>\n" +
    "            <p ng-if=\"generatorSuccess\" class=\"text-success\" style=\"margin-top: 6px;\"><small ng-bind-html=\"generatorSuccessMessage\"></small></p>\n" +
    "\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "      </form>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/steroids-connect/data/data-browse.html',
    "<div ag-data-browser-ui data-raml-url=\"https://config-api.appgyver.com/application_configuration/app/{{cloudId}}/raml.yml?identification_hash={{cloudHash}}\"></div>"
  );


  $templateCache.put('/steroids-connect/data/data-configure.html',
    "<div ag-data-configurator config-api-base-url=\"https://config-api.appgyver.com/application_configuration\" config-api-app-id=\"{{cloudId}}\" config-api-authorization-token=\"{{accessToken}}\"></div>"
  );


  $templateCache.put('/steroids-connect/data/data-generators.html',
    "<data-data-generators-view config-api-base-url=\"https://config-api.appgyver.com/application_configuration\" app-id=\"{{cloudId}}\" authorization-token=\"{{accessToken}}\"></data-data-generators-view>"
  );


  $templateCache.put('/steroids-connect/data/data-view.html',
    "<div id=\"view-data\" class=\"container\">\n" +
    "\n" +
    "\n" +
    "  <!-- Title + tabs -->\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <ul class=\"nav nav-pills pull-right\" ng-if=\"viewReady && dataReady\">\n" +
    "\n" +
    "        <li ng-class=\"{'active': $state.includes('data.configure')}\">\n" +
    "          <a ui-sref=\".configure\">1. Configure data</a>\n" +
    "        </li>\n" +
    "\n" +
    "        <li ng-class=\"{'active': $state.includes('data.browse')}\">\n" +
    "          <a ui-sref=\".browse\">2. Browse data</a>\n" +
    "        </li>\n" +
    "\n" +
    "        <li ng-class=\"{'active': $state.includes('data.generators')}\">\n" +
    "          <a ui-sref=\".generators\">3. Generate scaffolds</a>\n" +
    "        </li>\n" +
    "\n" +
    "      </ul>\n" +
    "      <h1 class=\"no-margin\">Data</h1>\n" +
    "      <p>Configure Supersonic Data for your app.</p>\n" +
    "      <br><br>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <!-- If data is not initialized -->\n" +
    "\n" +
    "  <div class=\"row\" ng-if=\"viewReady && !dataReady\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "\n" +
    "      <!-- Initialize button -->\n" +
    "      <div class=\"clearfix\">\n" +
    "        <button class=\"btn btn-lg btn-primary\" ng-click=\"initializeData()\" ng-disabled=\"isInitializing\" style=\"display: inline-block; float: left;\">\n" +
    "          <span class=\"glyphicon glyphicon-cloud-upload\"></span> {{isInitializing ? 'Initializing...' : 'Initialize data'}}\n" +
    "        </button>\n" +
    "        <ag-ui-spinner size=\"29\" color=\"black\" ng-show=\"isInitializing\" style=\"display: inline-block; float: left; margin-left: 10px;\"></ag-ui-spinner>\n" +
    "      </div>\n" +
    "\n" +
    "      <p ng-class=\"{'text-muted': !error, 'text-danger': error}\" style=\"margin-top: 6px;\">{{error ? error : \"Your application will be deployed to AppGyver Cloud, and we'll also provision an AppGyver Sandbox Database for you so you can get going straight away.\"}}</p>\n" +
    "\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <!-- All good! -->\n" +
    "\n" +
    "  <div class=\"row\" ng-if=\"viewReady && dataReady\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <div class=\"row\" ui-view></div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/steroids-connect/docs/docs-view.html',
    "<div id=\"view-docs\" class=\"container\">\n" +
    "\n" +
    "  <div class=\"row\">\n" +
    "\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <h2>Documentation and Tutorials</h2>\n" +
    "      <p>We've got a bunch of great learning material available for you in the Supersonic docs. Click the link below to open our documentation or jump straight to the API reference.</p>\n" +
    "      <br>\n" +
    "      <a\n" +
    "        class=\"btn btn-lg btn-primary\"\n" +
    "        href=\"http://docs.appgyver.com\"\n" +
    "        target=\"_blank\">\n" +
    "        Supersonic Documentation &raquo;\n" +
    "      </a>\n" +
    "      <a\n" +
    "        class=\"btn btn-lg btn-primary\"\n" +
    "        href=\"http://docs.appgyver.com\"\n" +
    "        target=\"_blank\">\n" +
    "        Supersonic API Reference &raquo;\n" +
    "      </a>\n" +
    "\n" +
    "      <br><br>\n" +
    "\n" +
    "      <h2>Forums</h2>\n" +
    "      <p>Struggling with something Supersonic, or just want to share an awesome thing you created? Join the discussion on our forums – we've got a great community, and the AppGyver team is very active there!</p>\n" +
    "      <p>As always, feel free to mail us at <a href=\"mailto:contact@appgyver.com\">contact@appgyver.com</a> with any questions or feedback!</p>\n" +
    "      <br>\n" +
    "      <a\n" +
    "        class=\"btn btn-lg btn-primary\"\n" +
    "        href=\"http://forums.appgyver.com\"\n" +
    "        target=\"_blank\">\n" +
    "        AppGyver Forums &raquo;\n" +
    "      </a>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/steroids-connect/generators/generators-view.html',
    "<div id=\"view-generators\" class=\"container\">\n" +
    "\n" +
    "  <!-- View header -->\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-xs-12 col-sm-8\">\n" +
    "      <h2 style=\"margin: 0px;\">Generators:</h2>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-12 col-sm-4\">\n" +
    "      <br class=\"visible-xs\">\n" +
    "      <div class=\"form-group\">\n" +
    "        <input type=\"text\" ng-model=\"generatorNameFilter\" class=\"form-control\" placeholder=\"Search...\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <br><br>\n" +
    "\n" +
    "  <!-- List of available generators -->\n" +
    "  <div class=\"row\">\n" +
    "\n" +
    "    <!-- Individual cards -->\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-3\" ng-repeat=\"generator in filteredGenerators = (GeneratorsAPI.generators | filter:{'name': generatorNameFilter})\">\n" +
    "      <div class=\"generator-card\" style=\"background-image: url('{{generator.image_url}}');\">\n" +
    "        <div class=\"generator-name font-proxima\"><b>{{generator.name}}</b></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- No generators matching search -->\n" +
    "    <div ng-if=\"filteredGenerators.length == 0\" class=\"text-center\">\n" +
    "      <h2>No generators matching \"{{generatorNameFilter}}\"</h2>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/logs/log-filters-view.html',
    "<div id=\"view-log-filters\">\n" +
    "\n" +
    "  <form class=\"ag__form form-inline font-proxima\" role=\"form\" id=\"log-view-filters-form\">\n" +
    "\n" +
    "    <!-- Filter for log msg type -->\n" +
    "    <div class=\"form-group\">\n" +
    "      <div class=\"btn-group\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-class=\"{'active': LogsFilterAPI.filters.level == availableLogLevel.level}\" ng-click=\"LogsFilterAPI.filterByLogLevel(availableLogLevel.level)\" ng-repeat=\"availableLogLevel in LogsFilterAPI.availableLogLevelFilters\">{{availableLogLevel.label}}</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Filter for device name -->\n" +
    "    <div class=\"form-group\" style=\"margin-left: 10px;\">\n" +
    "      <div class=\"form-control-select ag__pill\">\n" +
    "        <select name=\"filterByDeviceName\" ng-model=\"LogsFilterAPI.filters.deviceName\" ng-options=\"x.filterBy as x.label for x in LogsFilterAPI.availableDeviceNameFilters(true)\"></select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Filter for view name -->\n" +
    "    <div class=\"form-group\" style=\"margin-left: 10px;\">\n" +
    "      <div class=\"form-control-select ag__pill\">\n" +
    "        <select name=\"filterByViewName\" ng-model=\"LogsFilterAPI.filters.view\" ng-options=\"x.filterBy as x.label for x in LogsFilterAPI.availableViewNameFilters()\"></select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Button for clearing out all filters -->\n" +
    "    <div class=\"form-group\" style=\"margin-left: 10px;\">\n" +
    "      <button name=\"clearFiltersBtn\" type=\"button\" ng-click=\"LogsFilterAPI.clearFilters()\" class=\"btn btn-default\">Clear filters</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Button for clearing all of logs -->\n" +
    "    <div class=\"form-group\" style=\"margin-left: 10px;\">\n" +
    "      <button name=\"clearFiltersBtn\" type=\"button\" ng-click=\"LogsAPI.clear()\" class=\"btn btn-danger\">Clear log</button>\n" +
    "    </div>\n" +
    "\n" +
    "  </form>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/steroids-connect/logs/log-message.html',
    "<tr class=\"logMsg\" ng-class=\"(logMessage.level == 'error') ? 'level-error' : ''\">\n" +
    "  <td class=\"text-muted logMsg-device-name\">\n" +
    "    <span class=\"glyphicon glyphicon-phone\"></span>\n" +
    "    <a ng-click=\"LogsFilterAPI.filterByDeviceName(logMessage.deviceName)\">{{logMessage.deviceName}}</a>\n" +
    "  </td>\n" +
    "  <td class=\"text-muted logMsg-view-name\">\n" +
    "    <span class=\"glyphicon glyphicon-list-alt\"></span>\n" +
    "    <a ng-click=\"LogsFilterAPI.filterByViewName(logMessage.view)\">{{logMessage.view | viewUrlToRouteName}}</a>\n" +
    "  </td>\n" +
    "  <td class=\"text-muted logMsg-time\">\n" +
    "    <span class=\"glyphicon glyphicon-time\"></span>\n" +
    "    <abbr title=\"{{logMessage.datetime | logDateFormat}}\">{{logMessage.datetime | logTimeFormat}}.{{logMessage.datetime | logTimeMillisecondsFormat}}</abbr>\n" +
    "  </td>\n" +
    "  <td class=\"logMsg-content font-proxima\">\n" +
    "    <div ng-click=\"toggleAdditionalDetails()\" ng-class=\"{'has-more-details': hasAdditionalDetails()}\">\n" +
    "      <b>{{logMessage.message}}</b>\n" +
    "      <span ng-if=\"hasAdditionalDetails()\" class=\"caret\"></span>\n" +
    "    </div>\n" +
    "    <div ng-if=\"hasAdditionalDetails()\" ng-show=\"isOpen\">\n" +
    "      <pre>{{logMessage.blob}}</pre>\n" +
    "    </div>\n" +
    "  </td>\n" +
    "</tr>\n"
  );


  $templateCache.put('/steroids-connect/logs/log-view.html',
    "<div id=\"view-log-view\">\n" +
    "\n" +
    "  <!-- Filter options -->\n" +
    "  <div class=\"row filters-container\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <log-filters-view></log-filters-view>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- Table containing the log entries -->\n" +
    "  <div class=\"row bg-white logs-container\">\n" +
    "    <div class=\"col-xs-12\">\n" +
    "      <table>\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th class=\"logMsg-device-name\">Device</th>\n" +
    "            <th class=\"logMsg-view-name\">View</th>\n" +
    "            <th class=\"logMsg-time\">Time</th>\n" +
    "            <th class=\"logMsg-content\">Message</th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "          <tr\n" +
    "            log-message=\"logMsg\"\n" +
    "            ng-repeat=\"logMsg in LogsAPI.logs | filter:LogsFilterAPI.filters\">\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('/steroids-connect/navigation-and-themes/color-input.html',
    "<div class=\"input-group ag-color-input\">\n" +
    "  <span class=\"input-group-addon\" ng-style=\"{ 'background-color': color }\"><span style=\"visibility: hidden;\">@</span></span>\n" +
    "  <input type=\"text\" colorpicker class=\"form-control\" ng-model=\"color\">\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/navigation-and-themes/drawer-configurator.html',
    "<div class=\"row configurator-section\">\n" +
    "\n" +
    "  <div class=\"hidden-xs col-sm-4\">\n" +
    "    <img ng-src=\"//appgyver.assets.s3.amazonaws.com/steroids-connect/images/navtheme-{{position}}-drawer.png\" class=\"img-responsive\" style=\"width: 100%;\" alt=\"\">\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-xs-12 col-sm-8 col-md-7 col-md-offset-1\">\n" +
    "    <h2><span class=\"text-capitalize\">{{position}}</span> drawer menu</h2>\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/navigation-and-themes/general-settings-configurator.html',
    "<div class=\"row configurator-section\">\n" +
    "\n" +
    "  <div class=\"hidden-xs col-sm-4\">\n" +
    "    <img src=\"//appgyver.assets.s3.amazonaws.com/steroids-connect/images/navtheme-general.png\" class=\"img-responsive\" style=\"width: 100%;\" alt=\"\">\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-xs-12 col-sm-8 col-md-7 col-md-offset-1\">\n" +
    "\n" +
    "    <div class=\"clearfix\">\n" +
    "      <h2 class=\"pull-left\">General layout settings</h2>\n" +
    "    </div>\n" +
    "\n" +
    "    <div>\n" +
    "      <br><br><br>\n" +
    "      <form class=\"form-horizontal\" role=\"form\">\n" +
    "\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-sm-4 control-label\">App start view</label>\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <view-selector view=\"steroidsSettings.initialView\" views=\"assets.views\"></view-selector>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-sm-4 control-label\">App background color</label>\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <color-input color=\"steroidsSettings.appearance.app_background_color\"></color-input>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-sm-4 control-label\">Page background color</label>\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <color-input color=\"steroidsSettings.appearance.page_background_color\"></color-input>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "      </form>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/navigation-and-themes/navigation-and-themes-view.html',
    "<div id=\"steroids-connect_navigation-and-themes-view\" class=\"container\">\n" +
    "\n" +
    "  <!-- When settings are laoded successfully -->\n" +
    "  <div ng-if=\"!loadingSettings && steroidsSettings\" class=\"row\">\n" +
    "\n" +
    "    <div class=\"col-sm-10\">\n" +
    "\n" +
    "      <!-- General layout settings -->\n" +
    "      <general-settings-configurator-view steroids-settings=\"steroidsSettings\" assets=\"appAssets\"></general-settings-configurator-view>\n" +
    "\n" +
    "      <br><br><hr><br><br>\n" +
    "\n" +
    "      <!-- Navigation bar -->\n" +
    "      <navigation-bar-configurator-view steroids-settings=\"steroidsSettings\"></navigation-bar-configurator-view>\n" +
    "\n" +
    "      <br><br><hr><br><br>\n" +
    "\n" +
    "      <!-- Status bar -->\n" +
    "      <status-bar-configurator-view steroids-settings=\"steroidsSettings\"></status-bar-configurator-view>\n" +
    "\n" +
    "      <br><br><hr><br><br>\n" +
    "\n" +
    "      <!-- Tabs -->\n" +
    "      <tabs-configurator-view steroids-settings=\"steroidsSettings\" assets=\"appAssets\"></tabs-configurator-view>\n" +
    "\n" +
    "      <br><br><hr><br><br>\n" +
    "\n" +
    "      <!-- Left drawer menu -->\n" +
    "      <drawer-configurator-view steroids-settings=\"steroidsSettings\" drawer-position=\"left\"></drawer-configurator-view>\n" +
    "\n" +
    "      <br><br><hr><br><br>\n" +
    "\n" +
    "      <!-- Right drawer menu -->\n" +
    "      <drawer-configurator-view steroids-settings=\"steroidsSettings\" drawer-position=\"right\"></drawer-configurator-view>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-sm-2\">\n" +
    "      <div class=\"ui-configurer-saveform\" sticky-scroll offset=\"109\">\n" +
    "        <div class=\"ui-configurer-saveform-unsaved font-proxima\">\n" +
    "          <span ng-hide=\"unsavedChanges\">No changes</span>\n" +
    "          <span ng-show=\"unsavedChanges\">Unsaved changes</span>\n" +
    "        </div>\n" +
    "        <button class=\"btn btn-primary btn-block font-proxima\" ng-click=\"save()\" ng-disabled=\"!unsavedChanges || savingSettings\"><span ng-hide=\"savingSettings\">Save settings</span><span ng-show=\"savingSettings\">Saving...</span></button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/navigation-and-themes/navigation-bar-configurator.html',
    "<div class=\"row configurator-section\">\n" +
    "\n" +
    "  <div class=\"hidden-xs col-sm-4\">\n" +
    "    <img src=\"//appgyver.assets.s3.amazonaws.com/steroids-connect/images/navtheme-navbar.png\" class=\"img-responsive\" style=\"width: 100%;\" alt=\"\">\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-xs-12 col-sm-8 col-md-7 col-md-offset-1\">\n" +
    "\n" +
    "    <div class=\"clearfix\">\n" +
    "      <h2 class=\"pull-left\">Navigation bar</h2>\n" +
    "    </div>\n" +
    "\n" +
    "    <div>\n" +
    "      <br><br><br>\n" +
    "      <form class=\"form-horizontal\" role=\"form\">\n" +
    "\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-sm-4 control-label\">Title color</label>\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <color-input color=\"steroidsSettings.appearance.nav_bar_title_text_color\"></color-input>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-sm-4 control-label\">Background color</label>\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <color-input color=\"steroidsSettings.appearance.nav_bar_tint_color\"></color-input>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-sm-4 control-label\">Button title color</label>\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <color-input color=\"steroidsSettings.appearance.nav_bar_button_title_text_color\"></color-input>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "      </form>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/navigation-and-themes/status-bar-configurator.html',
    "<div class=\"row configurator-section\">\n" +
    "\n" +
    "  <div class=\"hidden-xs col-sm-4\">\n" +
    "    <img src=\"//appgyver.assets.s3.amazonaws.com/steroids-connect/images/navtheme-statusbar.png\" class=\"img-responsive\" style=\"width: 100%;\" alt=\"\">\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-xs-12 col-sm-8 col-md-7 col-md-offset-1\">\n" +
    "\n" +
    "    <div class=\"clearfix\">\n" +
    "      <h2 class=\"pull-left\">Status bar</h2>\n" +
    "      <div class=\"btn-group pull-right\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"enable()\" ng-class=\"{'active': isEnabled()}\">On</button>\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"disable()\" ng-class=\"{'active': !isEnabled()}\">Off</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"isEnabled()\">\n" +
    "      <br><br><br>\n" +
    "      <form class=\"form-horizontal\" role=\"form\">\n" +
    "        <div class=\"form-group\">\n" +
    "          <label for=\"statusbarStyle\" class=\"col-sm-4 control-label\">Style</label>\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <select class=\"form-control\" id=\"statusbarStyle\" ng-model=\"steroidsSettings.configuration.status_bar_style\" ng-options=\"style for style in statusBarStyles\"></select>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/navigation-and-themes/tab-editor.html',
    "<div>\n" +
    "\n" +
    "  <div class=\"tab-editor well\" ng-if=\"icons\">\n" +
    "    <div class=\"container-fluid\">\n" +
    "      <div class=\"row\">\n" +
    "\n" +
    "        <div ng-class=\"{'col-xs-10': tabs.length < 5, 'col-xs-12': tabs.length >= 5}\">\n" +
    "          <div class=\"row\" ui-sortable ng-model=\"tabs\">\n" +
    "\n" +
    "            <!-- Existing tabs -->\n" +
    "\n" +
    "            <div class=\"tab\" ng-class=\"{'col-xs-3': tabs.length < 5, 'col-xs-2': tabs.length >= 5}\" ng-repeat=\"tab in tabs\">\n" +
    "              <div class=\"tab-container\" ng-click=\"openEditModal($index)\">\n" +
    "                <div class=\"tab-icon\"><img ng-src=\"{{getPreviewForTab(tab.icon)}}\" alt=\"\"></div>\n" +
    "                <span class=\"tab-title\">{{tab.title}}</span>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-xs-2\" ng-hide=\"tabs.length >= 5\">\n" +
    "          <div class=\"row\">\n" +
    "\n" +
    "            <!-- Create new tab -->\n" +
    "\n" +
    "            <div class=\"tab tab-adder col-xs-12\">\n" +
    "              <div class=\"tab-adder-container\" ng-click=\"openEditModal(-1)\">\n" +
    "                <div class=\"tab-icon\"><span class=\"glyphicon glyphicon-plus-sign\"></span></div>\n" +
    "                <span class=\"tab-title\">New tab</span>\n" +
    "              </div>\n" +
    "            </div>\n" +
    "\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <small class=\"text-muted\">You can re-order tabs by dragging them.</small>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/navigation-and-themes/tab-modal.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\" ng-show=\"isNewTab\" style=\"text-transform: none;\">New tab</h3>\n" +
    "  <h3 class=\"modal-title\" ng-hide=\"isNewTab\" style=\"text-transform: none;\">Edit tab</h3>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "  <form class=\"form-horizontal\" role=\"form\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">Title</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"tab.title\">\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "      <label class=\"col-sm-2 control-label\">View</label>\n" +
    "      <div class=\"col-sm-10\">\n" +
    "        <select class=\"form-control\" ng-model=\"tab.location\" ng-options=\"view.location as view.id for view in views\"></select>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "  </form>\n" +
    "\n" +
    "  <hr>\n" +
    "\n" +
    "  <div class=\"container-fluid\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-xs-2 text-center ag-icon-container\" ng-class=\"{'active': icon.path == tab.icon}\" ng-repeat=\"icon in icons\">\n" +
    "        <div ng-click=\"tab.icon=icon.path\">\n" +
    "          <img ng-src=\"{{icon.url}}\" class=\"ag-tab-icon big\" alt=\"\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer ag-tab-adder-modal-footer\">\n" +
    "  <button class=\"btn btn-danger\" ng-click=\"remove()\" ng-hide=\"isNewTab\">Remove tab</button>\n" +
    "\n" +
    "  <span style=\"display: inline-block;\" ng-if=\"!tab.location\" tooltip=\"Select view before saving\" tooltip-trigger=\"mouseenter\" tooltip-append-to-body=\"true\">\n" +
    "    <button class=\"btn btn-primary\" disabled>Save</button>\n" +
    "  </span>\n" +
    "  <span style=\"display: inline-block;\" ng-if=\"!tab.icon && tab.location\" tooltip=\"Select icon before saving\" tooltip-trigger=\"mouseenter\" tooltip-append-to-body=\"true\">\n" +
    "    <button class=\"btn btn-primary\" disabled>Save</button>\n" +
    "  </span>\n" +
    "  <button ng-if=\"tab.icon && tab.location\" class=\"btn btn-primary ag-animation-jump\" ng-click=\"ok()\">Save</button>\n" +
    "\n" +
    "  <button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/navigation-and-themes/tabs-configurator.html',
    "<div class=\"row configurator-section\">\n" +
    "\n" +
    "  <div class=\"hidden-xs col-sm-4\">\n" +
    "    <img src=\"//appgyver.assets.s3.amazonaws.com/steroids-connect/images/navtheme-tabs.png\" class=\"img-responsive\" style=\"width: 100%;\" alt=\"\">\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"col-xs-12 col-sm-8 col-md-7 col-md-offset-1\">\n" +
    "\n" +
    "    <div class=\"clearfix\">\n" +
    "      <h2 class=\"pull-left\">Tabs</h2>\n" +
    "      <div class=\"btn-group pull-right\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"enable()\" ng-class=\"{'active': isEnabled()}\">On</button>\n" +
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"disable()\" ng-class=\"{'active': !isEnabled()}\">Off</button>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"isEnabled()\">\n" +
    "      <br><br><br>\n" +
    "      <form class=\"form-horizontal\" role=\"form\">\n" +
    "\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-sm-4 control-label\">Background color</label>\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <color-input color=\"steroidsSettings.appearance.tab_bar_tint_color\"></color-input>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-sm-4 control-label\">Tab title color</label>\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <color-input color=\"steroidsSettings.appearance.tab_bar_button_title_text_color\"></color-input>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "          <label class=\"col-sm-4 control-label\">Active tab title color</label>\n" +
    "          <div class=\"col-sm-8\">\n" +
    "            <color-input color=\"steroidsSettings.appearance.tab_bar_selected_icon_tint_color\"></color-input>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "      </form>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"isEnabled()\">\n" +
    "      <hr>\n" +
    "      <tab-editor tabs=\"steroidsSettings.tabBar.tabs\" icons=\"assets.icons\" views=\"assets.views\"></tab-editor>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/steroids-connect/navigation-and-themes/view-selector.html',
    "<select class=\"form-control\" ng-model=\"selectedId\" ng-change=\"setViewById(selectedId)\" ng-options=\"x.id as x.id for x in views\"></select>"
  );


  $templateCache.put('/steroids-connect/preview/preview-view.html',
    "<div id=\"view-preview-view\" class=\"container\">\n" +
    "  <div class=\"row\">\n" +
    "\n" +
    "    <!-- QR code -->\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-5\">\n" +
    "      <div class=\"row\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "          <qrcode version=\"8\" error-correction-level=\"M\" size=\"100%\" data=\"{{qrCode}}\" class=\"img-responsive\"></qrcode>\n" +
    "          <br><br>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-12\">\n" +
    "          <h3>AppGyver Scanner</h3>\n" +
    "          <p>To connect your device with the Steroids Development Server and start developing your app, please scan the QR code above with the AppGyver Scanner app.</p>\n" +
    "          <p>Download AppGyver Scanner from App Store or Google Play.</p>\n" +
    "          </p>\n" +
    "          <br>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-6\">\n" +
    "          <a href=\"https://itunes.apple.com/fi/app/appgyver-scanner/id575076515\" target=\"_blank\" title=\"AppGyver Scanner on App Store\">\n" +
    "            <img src=\"//appgyver.assets.s3.amazonaws.com/steroids-connect/images/badge-app-store.png\" alt=\"Download Scanner from App Store\" class=\"img-responsive\">\n" +
    "          </a>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-6\">\n" +
    "          <a href=\"https://play.google.com/store/apps/details?id=com.appgyver.freshandroid\" target=\"_blank\" title=\"AppGyver Scanner on Google Play\">\n" +
    "            <img src=\"//appgyver.assets.s3.amazonaws.com/steroids-connect/images/badge-google-play.png\" alt=\"Download Scanner from Google Play\" class=\"img-responsive\">\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Connected devices -->\n" +
    "    <div class=\"col-xs-12 col-sm-6 col-md-6 col-md-offset-1\">\n" +
    "      <br class=\"visible-xs\"><br class=\"visible-xs\">\n" +
    "      <h2 class=\"no-margin\">Connected devices:</h2>\n" +
    "      <br>\n" +
    "      <ul class=\"devices-list\">\n" +
    "\n" +
    "        <li ng-repeat=\"device in DevicesAPI.devices\">\n" +
    "          <div class=\"status-indicator\" ng-class=\"{'yellow': false, 'green': true}\"></div>\n" +
    "          <h2 class=\"no-margin\"><b>{{device.device}}{{device.simulator? \" simulator\" : \"\"}}</b></h2>\n" +
    "          <span class=\"text-muted\"><small>Scanner: <b>{{device.version}}</b> &middot; OS: <b>{{device.osVersion}}</b> &middot; IP: <b>{{device.ipAddress}}</b></small></span>\n" +
    "          <span ng-if=\"!device.connected && device.error\"><a href=\"\">{{device.error.message}}</a></span>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "      <p ng-hide=\"DevicesAPI.devices\">No connected devices detected. Please scan the QR code on the left with your iOS or Android device running the AppGyver Scanner app, or launch the iOS Simulator or Android Emulator below.<br><br></p>\n" +
    "      <br>\n" +
    "      <div class=\"clearfix\">\n" +
    "        <button class=\"btn btn-lg btn-primary\" ng-click=\"launchSimulator()\" ng-disabled=\"simulatorIsLaunching\" style=\"display: inline-block; float: left;\">\n" +
    "          <span class=\"glyphicon glyphicon-phone\"></span> {{simulatorIsLaunching? \"Launching iOS Simulator...\" : \"Launch iOS Simulator\"}}\n" +
    "        </button>\n" +
    "        <ag-ui-spinner size=\"29\" color=\"black\" ng-show=\"simulatorIsLaunching\" style=\"display: inline-block; float: left; margin-left: 10px;\"></ag-ui-spinner>\n" +
    "        <p class=\"text-danger\" ng-show=\"simulatorLaunchError\" style=\"display: inline-block; margin-left: 10px;\"><small>{{simulatorLaunchError}}</small></p>\n" +
    "      </div>\n" +
    "      <br>\n" +
    "      <div class=\"clearfix\">\n" +
    "        <button class=\"btn btn-lg btn-primary\" ng-click=\"launchEmulator()\" ng-disabled=\"emulatorIsLaunching\" style=\"display: inline-block; float: left;\">\n" +
    "          <span class=\"glyphicon glyphicon-phone\"></span> {{emulatorIsLaunching? \"Launching Android Emulator...\" : \"Launch Android Emulator\"}}\n" +
    "        </button>\n" +
    "        <ag-ui-spinner size=\"29\" color=\"black\" ng-show=\"emulatorIsLaunching\" style=\"display: inline-block; float: left; margin-left: 10px;\"></ag-ui-spinner>\n" +
    "        <p class=\"text-danger\" ng-show=\"emulatorLaunchError\" style=\"display: inline-block; margin-left: 10px;\"><small>{{emulatorLaunchError}}</small></p>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "</div>\n"
  );

}]);

},{}]},{},[8])
(8)
});