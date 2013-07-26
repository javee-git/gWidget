/*--------------------BrowserCompatibility----------------------------*/
isFirefox = false;
isIE = false;
isChrome = false;
isOpera = false;
isHTML = false;
if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    isChrome = true;
} else if (navigator.appName.indexOf("Microsoft") != -1) {
    isIE = true;
} else if (navigator.userAgent.indexOf('Opera') != -1) {
    isOpera = true;
} else {
    isFirefox = true;
}
var x = false;

/*-----------------------CoreMethodsNfunction----------------------------*/
Suggest = function (param) {
    for (var a in param) Suggest[a] = param[a];
    return Suggest;
};

function SuggestEventCore(el, event, handler) {
    if (el.addEventListener)
        el.addEventListener(event, handler, false);
    else if (el.attachEvent)
        el.attachEvent("on" + event, handler);
};

function SuggestCoreSetters(input) {
    if (typeof (input) == "string") input = input.toLowerCase();

    switch (input) {
    case "1":
    case "true":
    case "yes":
    case "y":
    case 1:
    case true:
        return true;
        break;

    default:
        return false;
    }
};
/*------------------------Postions&offset-----------------------------*/
function SuggestOffset(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docEle = document.documentElement;
    var scrollTop = window.pageYOffset || docEle.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEle.scrollLeft || body.scrollLeft;
    var clientTop = docEle.clientTop || body.clientTop || 0;
    var clientLeft = docEle.clientLeft || body.clientLeft || 0;
    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    return {
        top: Math.round(top),
        left: Math.round(left)
    }
};
function SuggestGetOffset(elem) {
    if (elem.getBoundingClientRect) {
        return SuggestOffset(elem);
    }
};
/*------------------------BaseFunction---------------------------------*/
function SuggestComboBase(parent, name, width, optionType, tabIndex) {
	this.T = new trie7();
    if (typeof (parent) == "string") parent = document.getElementById(parent);    
    this.Suggest_Event();
    this.optionType = (optionType != window.undefined && Suggest_optionStore[optionType]) ? optionType : 'default';
    this._optionObject = Suggest_optionStore[this.optionType];
    if (!window.Suggest_glbSelectAr) {
        window.Suggest_glbSelectAr = new Array();
        SuggestEventCore(document.body, "click", this.closeAll);}
	if (parent.tagName == "SELECT")
        return SuggestComboDropDown(parent);
    else
        this._createSelf(parent, name, width, tabIndex);
    Suggest_glbSelectAr.push(this);
};
/*------------------------ExtendedMethods-----------------------------*/
SuggestComboBase.prototype.enableFilteringMode = function (mode) { //main method to enable filtering mode
      this._filter = SuggestCoreSetters(mode);
};

SuggestComboBase.prototype.getOptionByLabel = function (value) { //show value from label
    for (var i = 0; i < this.optionsArr.length; i++)
        if (this.optionsArr[i].text == value) return this.optionsArr[i];
};

SuggestComboBase.prototype.render = function (mode) { //render the options
    this.redrawOptions();
};

SuggestComboBase.prototype.addOption = function (options) { //adding options from remote file
	this.optionsArr = new Array();
    //if (!arguments[0].length) args = [arguments];
    if (!arguments[0].length) args = [];
    else args = options;
    this.render(false);
    var addFlag = (this.T.prefixes===0)?true:false;
    //console.time('render');
	//console.log(addFlag);  
    for (var i = 0; i < args.length; i++) {
        var attr = args[i];
        if (attr.length) {
            attr.value = attr[0] || "";
            attr.text = attr[1] || "";
            attr.css = attr[2] || "";
        }
        if(addFlag){
        	this.T.insert(attr[1].toLowerCase());	
        }
        if(x == true) {
        	this._addOption(attr);
    	}
	}
    this.render(true);
};

SuggestComboBase.prototype._addOption = function (attr) { //making private
    dOpt = new this._optionObject();
    this.optionsArr.push(dOpt);
    dOpt.setValue.apply(dOpt, [attr]);
};

SuggestComboBase.prototype._createSelf = function (selParent, name, width, tab) { //creating related HTML & DOM
    if (width.toString().indexOf("%") != -1) {
        var self = this,
         	resWidht = parseInt(width) / 100,
       		width = parseInt(selParent.offsetWidth); 
    }
    var width = parseInt(width || 100); 
    this.ListPosition = "Bottom"; 
    this.DOMParent = selParent;
    this.optionsArr = [];
    var opt = new this._optionObject();
    opt.DrawHeader(this, name, width, tab);
    this.DOMlist = document.createElement("DIV");
    this.DOMlist.className = 'Suggest_combo_list ';
    this.DOMlist.style.width = width - (isIE ? 0 : 0) + "px";
    if (isOpera || isHTML) this.DOMlist.style.overflow = "auto";     
    this.DOMlist.style.display = "none";
    document.body.insertBefore(this.DOMlist, document.body.firstChild);
    this.DOMlist.combo = this.DOMelem.combo = this;
    this.DOMelem_input.onkeydown = this._onKey;
    this.DOMelem_input.onkeypress = this._onKeyF;
    this.DOMelem_input.onblur = this._onBlur;
    this.DOMelem.onclick = this._toggleSelect;
    this.DOMlist.onclick = this._selectOption;
    this.DOMlist.onmousedown = function () {
        this._skipBlur = true;
    }
    this.DOMlist.onkeydown = function (e) {
        this.combo.DOMelem_input.focus();
        (e || event).cancelBubble = true;
        this.combo.DOMelem_input.onkeydown(e)
    }
    this.DOMlist.onmouseover = this._listOver;
};
SuggestComboBase.prototype.filterSelf = function (mode) { //filtering the options
    var text = this.getComboText();
	if(text==''){
		console.time('getallwords');
		var ctList = this.T.getAllWords();
		console.timeEnd('getallwords');
	}else{
		console.time('autocomp');
		var ctList = this.T.autoComplete(text.toLowerCase());
		console.timeEnd('autocomp');
		
	}
	var arr = new Array();
	for (var i in ctList){
		arr.push([i, ctList[i]]);
	}
	this.addOption(arr);
	this.render();
    if (this.DOMlist.style.display != "block") this.openSelect();            
	if (!mode) this._correctSelection();
};

SuggestComboBase.prototype._listOver = function (e) { //event-based method to select options
    e = e || event;
    e.cancelBubble = true;
    var node = (isIE ? event.srcElement : e.target);
    var that = this.combo;
    if (node.parentNode == that.DOMlist) {
        if (that._selOption) that._selOption.deselect();
        if (that._tempSel) that._tempSel.deselect();
        var i = 0;
        for (i; i < that.DOMlist.childNodes.length; i++) {
            if (that.DOMlist.childNodes[i] == node) break;
        }
        var z = that.optionsArr[i];
        that._tempSel = z;
        that._tempSel.select();
    }
};

SuggestComboBase.prototype._positList = function () { //static method to place the options properly
    var pos = this.getPosition(this.DOMelem);
    if (this.ListPosition == 'Bottom') {
        this.DOMlist.style.top = pos[1] + this.DOMelem.offsetHeight - 1 + "px";
        this.DOMlist.style.left = pos[0] + "px";
    } 
};

SuggestComboBase.prototype.getPosition = function (oNode, pNode) { 
    if (isIE) {
        if (!pNode)
            pNode = document.body;
        var oCurrentNode = oNode;
        var iLeft = 0;
        var iTop = 0;
        while ((oCurrentNode) && (oCurrentNode != pNode)) {
            iLeft += oCurrentNode.offsetLeft - oCurrentNode.scrollLeft + oCurrentNode.clientLeft;
            iTop += oCurrentNode.offsetTop - oCurrentNode.scrollTop + oCurrentNode.clientTop;
            oCurrentNode = oCurrentNode.offsetParent;
        }

        if (document.documentElement.scrollTop) {
            iTop += document.documentElement.scrollTop;
        }
        if (document.documentElement.scrollLeft) {
            iLeft += document.documentElement.scrollLeft;
        }
        return new Array(iLeft, iTop);
    }
    var pos = SuggestGetOffset(oNode);
    return [pos.left, pos.top];
};
/*------------------------StaticMethods-------------------------------*/
SuggestComboBase.prototype.getComboText = function () { 
    return this.DOMelem_input.value;
};

SuggestComboBase.prototype.setComboText = function (text) { 
    this.DOMelem_input.value = text;
};

SuggestComboBase.prototype.getActualValue = function () { 
    return this.DOMelem_hidden_input.value;
};

SuggestComboBase.prototype.getSelectedText = function () { 
    return (this._selOption ? this._selOption.text : "");
};

SuggestComboBase.prototype.getSelectedIndex = function () {
    for (var i = 0; i < this.optionsArr.length; i++)
        if (this.optionsArr[i] == this._selOption) return i;
    return -1;
};

SuggestComboBase.prototype._correctSelection = function () {
    if (this.getComboText() != "")
        for (var i = 0; i < this.optionsArr.length; i++)
            if (!this.optionsArr[i].isHidden()) {
                return this.selectOption(i, true, false);
            }
    this.unSelectOption();
};

SuggestComboBase.prototype.selectNext = function (step) {
    var z = this.getSelectedIndex() + step;
    while (this.optionsArr[z]) {
        if (!this.optionsArr[z].isHidden())
            return this.selectOption(z, false, false);
        z += step;
    }
};

SuggestComboBase.prototype.redrawOptions = function () {
    if (this._skiprender) return;
    for (var i = this.DOMlist.childNodes.length - 1; i >= 0; i--)
        this.DOMlist.removeChild(this.DOMlist.childNodes[i]);
    for (var i = 0; i < this.optionsArr.length; i++)
        this.DOMlist.appendChild(this.optionsArr[i].render());
};

SuggestComboBase.prototype.unSelectOption = function () {
    if (this._selOption) this._selOption.deselect();
    if (this._tempSel) this._tempSel.deselect();
    this._tempSel = this._selOption = null;
};

/*------------------------KeyCodesEvents---------------------------------*/
SuggestComboBase.prototype._onKeyF = function (e) { //key press handler
    var that = this.parentNode.combo;
    var ev = e || event;
    ev.cancelBubble = true;
    if (ev.keyCode == "13" || ev.keyCode == "9") {
        that._confirmSelection();
        that.closeAll();
    } else
    if (ev.keyCode == "27") {
        that._resetSelection();
        that.closeAll();
    } else that._activeMode = true;
    if (ev.keyCode == "13" || ev.keyCode == "27") {
        that.callEvent("onKeyPressed", [ev.keyCode])
        return false;
    }
    return true;
};

SuggestComboBase.prototype._onKey = function (e) { //keyup handler
    var that = this.parentNode.combo;
    (e || event).cancelBubble = true;
    var ev = (e || event).keyCode;
    if (ev > 15 && ev < 19) return true;
    if (ev == 27) return true;
    if ((that.DOMlist.style.display != "block") && (ev != "13") && (ev != "9") && ((!that._filter) || (that._filterAny)))
        that.DOMelem.onclick(e || event);

    if ((ev != "13") && (ev != "9")) {
        window.setTimeout(function () {
            that._onKeyB(ev);
        }, 1);
        if (ev == "40" || ev == "38")
            return false;
    } else if (ev == 9) {
        that._confirmSelection();
        that.closeAll();
        (e || event).cancelBubble = false;
    }
};

SuggestComboBase.prototype._onKeyB = function (ev) { //keydown handler
    if (ev == "40") {
        var z = this.selectNext(1);
    } else if (ev == "38") { 
        this.selectNext(-1);
    } else {
        this.callEvent("onKeyPressed", [ev])
        if (this._filter) return this.filterSelf((ev == 8) || (ev == 46));
        for (var i = 0; i < this.optionsArr.length; i++)
            if (this.optionsArr[i].data()[1] == this.DOMelem_input.value) {
                ev.cancelBubble = true;
                this.selectOption(i, false, false);
                return false;
            }
        this.unSelectOption();
    }
    return true;
};

SuggestComboBase.prototype._confirmSelection = function (data, status) {
    this._activeMode = false;
};

SuggestComboBase.prototype._resetSelection = function (data, status) {
    //var z = this.getOption(this.DOMelem_hidden_input.value);
};

SuggestComboBase.prototype.selectOption = function (ind, filter, conf) {
   // if (arguments.length < 3) conf = true;
    this.unSelectOption();
    var z = this.optionsArr[ind];
    if (!z) return;
    this._selOption = z;
    this._selOption.select();
    var corr = this._selOption.content.offsetTop + this._selOption.content.offsetHeight - this.DOMlist.scrollTop - this.DOMlist.offsetHeight;
    if (corr > 0) this.DOMlist.scrollTop += corr;
    corr = this.DOMlist.scrollTop - this._selOption.content.offsetTop;
    if (corr > 0) this.DOMlist.scrollTop -= corr;
    var data = this._selOption.data();
    if (filter) {
        var text = this.getComboText();
        if (text != data[1]) {
            this.setComboText(data[1]);
            SuggestComboRange(this.DOMelem_input, text.length + 1, data[1].length);
        }
    } else
        this.setComboText(data[1]);
    this._selOption.RedrawHeader(this);
    this.callEvent("onSelectionChange", []);
}; 

SuggestComboBase.prototype._selectOption = function (e) {
    (e || event).cancelBubble = true;
    var node = (isIE ? event.srcElement : e.target),
    	that = this.combo,
		i = 0;
    for (i; i < that.DOMlist.childNodes.length; i++) {
        if (that.DOMlist.childNodes[i] == node) break;
    }
    that.selectOption(i, false, true);
    that.closeAll();
    that.callEvent("onBlur", [])
    that._activeMode = false;
}

SuggestComboBase.prototype.openSelect = function () {
    if (this._disabled) return;
    this.closeAll();

    this.DOMlist.style.display = "block";
    this._positList();
    this.callEvent("onOpen", []);
    if (this._tempSel) this._tempSel.deselect();
    if (this._selOption) this._selOption.select();
    if (this._selOption) {
        var corr = this._selOption.content.offsetTop + this._selOption.content.offsetHeight - this.DOMlist.scrollTop - this.DOMlist.offsetHeight;
        if (corr > 0) this.DOMlist.scrollTop += corr;
        corr = this.DOMlist.scrollTop - this._selOption.content.offsetTop;
        if (corr > 0) this.DOMlist.scrollTop -= corr;
    }
    if (this._filter) this.filterSelf();
};

SuggestComboBase.prototype._toggleSelect = function (e) {
    var that = this.combo;
    if (that.DOMlist.style.display == "block") {
        that.closeAll();
    } else {
        that.openSelect();
    }
    (e || event).cancelBubble = true;
};

SuggestComboBase.prototype.closeAll = function () {
    if (window.Suggest_glbSelectAr)
        for (var i = 0; i < Suggest_glbSelectAr.length; i++) {
            if (Suggest_glbSelectAr[i].DOMlist.style.display == "block") {
                Suggest_glbSelectAr[i].DOMlist.style.display = "none";

            }
            Suggest_glbSelectAr[i]._activeMode = false;
        }
};
var Suggest_optionStore = [];
function SuggestComboRange(InputId, Start, End) {
    var Input = typeof (InputId) == 'object' ? InputId : document.getElementById(InputId),
    	Length = Input.value.length;
    Start--;
    if (Start < 0 || Start > End || Start > Length) Start = 0;
    if (End > Length)  End = Length;       
    if (Start == End) return;
    if (Input.setSelectionRange) {
        Input.setSelectionRange(Start, End);
    } else if (Input.createTextRange) {
        var range = Input.createTextRange();
        range.moveStart('character', Start);
        range.moveEnd('character', End - Length);
    }
};
/*------------------------SettingDefaults---------------------------------*/
SuggestCombo_defaultOption = function () {
    this.init();
};

SuggestCombo_defaultOption.prototype.init = function () {
    this.value = null;
    this.text = "";
    this.selected = false;
    this.css = "";
};

SuggestCombo_defaultOption.prototype.select = function () {
    if (this.content) {
        this.content.className = "Suggest_selected_option";
    }
}

SuggestCombo_defaultOption.prototype.hide = function (mode) {
    this.render().style.display = mode ? "none" : "";
}
SuggestCombo_defaultOption.prototype.isHidden = function () {
    return (this.render().style.display == "none");
}
SuggestCombo_defaultOption.prototype.deselect = function () {
    if (this.content) this.render();
    this.content.className = "";
};

SuggestCombo_defaultOption.prototype.setValue = function (attr) {
    this.value = attr.value || "";
    this.text = attr.text || "";
    this.css = attr.css || "";
    this.content = null;
};

SuggestCombo_defaultOption.prototype.render = function () {
    if (!this.content) {
        this.content = document.createElement("DIV");
        this.content._self = this;

        this.content.style.cssText = 'width:100%; overflow:hidden;' + this.css;
        if (isOpera || isHTML) this.content.style.padding = "2px 0px 2px 0px";
        this.content.innerHTML = this.text;
        this._ctext = (typeof this.content.textContent != "undefined") ? this.content.textContent : this.content.innerText;
    }
    return this.content;
};

SuggestCombo_defaultOption.prototype.data = function () {
    if (this.content)
        return [this.value, this._ctext ? this._ctext : this.text];
};

SuggestCombo_defaultOption.prototype.DrawHeader = function (self, name, width, tab) {
    var z = document.createElement("DIV");
    z.style.width = width + "px";
    z.className = 'Suggest_combo_box ' + (Suggest.skin || "");
    z._self = self;
    self.DOMelem = z;
    this._DrawHeaderInput(self, name, width, tab);
    this._DrawHeaderButton(self, name, width);
    self.DOMParent.appendChild(self.DOMelem);
};

SuggestCombo_defaultOption.prototype._DrawHeaderInput = function (self, name, width, tab) {

    var z = document.createElement('input');
    z.setAttribute("autocomplete", "off");
    z.type = 'text';
    z.className = 'Suggest_combo_input';

    if (tab) z.tabIndex = tab;
    z.style.width = width - 19 - (document.compatMode == "BackCompat" ? 0 : 3) + 'px';
    self.DOMelem.appendChild(z);
    self.DOMelem_input = z;

    z = document.createElement('input');
    z.type = 'hidden';
    z.name = name;
    self.DOMelem.appendChild(z);
    self.DOMelem_hidden_input = z;

    z = document.createElement('input');
    z.type = 'hidden';
    z.name = (name || "").replace(/(\]?)$/, "_new_value$1");
    z.value = "true";
    self.DOMelem.appendChild(z);
    self.DOMelem_hidden_input2 = z;
};

SuggestCombo_defaultOption.prototype._DrawHeaderButton = function (self, name, width) {
    var z = document.createElement('img');
    z.className = 'Suggest_combo_img';
    if (Suggest.image_path) Suggest_globalImgPath = Suggest.image_path;
    z.src = (window.Suggest_globalImgPath ? Suggest_globalImgPath : "") + 'drop_down' +  '.gif';
    self.DOMelem.appendChild(z);
    self.DOMelem_button = z;
};

SuggestCombo_defaultOption.prototype.RedrawHeader = function (self) {}
Suggest_optionStore['default'] = SuggestCombo_defaultOption;
/*------------------------BindEventsOnCombo---------------------------------*/
SuggestComboBase.prototype.Suggest_Event = function () {
    this.attachEvent = function (original, catcher, CallObj) {
        CallObj = CallObj || this;
        original = 'ev_' + original;
        if ((!this[original]) || (!this[original].addEvent)) {
            var z = new this.eventCatcher(CallObj);
            z.addEvent(this[original]);
            this[original] = z;
        }
        return (original + ':' + this[original].addEvent(catcher)); //return ID (event name & event ID)
    }
    this.callEvent = function (name, arg0) {
        if (this["ev_" + name]) return this["ev_" + name].apply(this, arg0);
        return true;
    }
    this.checkEvent = function (name) {
        if (this["ev_" + name]) return true;
        return false;
    }

    this.eventCatcher = function (obj) {
        var Suggest_catch = new Array();
        var m_obj = obj;
        var func_server = function (catcher, rpc) {
            catcher = catcher.split(":");
            var postVar = "";
            var postVar2 = "";
            var target = catcher[1];
            var z = function () {}
            return z;
        }
        var z = function () {
            if (Suggest_catch)
                var res = true;
            for (var i = 0; i < Suggest_catch.length; i++) {
                if (Suggest_catch[i] != null) {
                    var zr = Suggest_catch[i].apply(m_obj, arguments);
                    res = res && zr;
                }
            }
            return res;
        }
        z.addEvent = function (ev) {
            if (typeof (ev) != "function")
                if (ev && ev.indexOf && ev.indexOf("server:") == 0)
                    ev = new func_server(ev, m_obj.rpcServer);
                else
                    ev = eval(ev);
            if (ev)
                return Suggest_catch.push(ev) - 1;
            return false;
        }
        z.removeEvent = function (id) {
            Suggest_catch[id] = null;
        }
        return z;
    }
    
    this.detachEvent = function (id) {
        if (id != false) {
            var list = id.split(':'); 
            this[list[0]].removeEvent(list[1]); 
        }
    }
};
