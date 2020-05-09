(function (console, $global) { "use strict";
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
Reflect.isEnumValue = function(v) {
	return v != null && v.__enum__ != null;
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null; else return js_Boot.getClass(o);
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw new js__$Boot_HaxeError("Too many arguments");
	}
	return null;
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = ["haxe","IMap"];
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe_Timer;
haxe_Timer.__name__ = ["haxe","Timer"];
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_ds_BalancedTree = function() {
};
$hxClasses["haxe.ds.BalancedTree"] = haxe_ds_BalancedTree;
haxe_ds_BalancedTree.__name__ = ["haxe","ds","BalancedTree"];
haxe_ds_BalancedTree.prototype = {
	set: function(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	,get: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) return node.value;
			if(c < 0) node = node.left; else node = node.right;
		}
		return null;
	}
	,remove: function(key) {
		try {
			this.root = this.removeLoop(key,this.root);
			return true;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			if( js_Boot.__instanceof(e,String) ) {
				return false;
			} else throw(e);
		}
	}
	,exists: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) return true; else if(c < 0) node = node.left; else node = node.right;
		}
		return false;
	}
	,iterator: function() {
		var ret = [];
		this.iteratorLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,setLoop: function(k,v,node) {
		if(node == null) return new haxe_ds_TreeNode(null,k,v,null);
		var c = this.compare(k,node.key);
		if(c == 0) return new haxe_ds_TreeNode(node.left,k,v,node.right,node == null?0:node._height); else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,removeLoop: function(k,node) {
		if(node == null) throw new js__$Boot_HaxeError("Not_found");
		var c = this.compare(k,node.key);
		if(c == 0) return this.merge(node.left,node.right); else if(c < 0) return this.balance(this.removeLoop(k,node.left),node.key,node.value,node.right); else return this.balance(node.left,node.key,node.value,this.removeLoop(k,node.right));
	}
	,iteratorLoop: function(node,acc) {
		if(node != null) {
			this.iteratorLoop(node.left,acc);
			acc.push(node.value);
			this.iteratorLoop(node.right,acc);
		}
	}
	,merge: function(t1,t2) {
		if(t1 == null) return t2;
		if(t2 == null) return t1;
		var t = this.minBinding(t2);
		return this.balance(t1,t.key,t.value,this.removeMinBinding(t2));
	}
	,minBinding: function(t) {
		if(t == null) throw new js__$Boot_HaxeError("Not_found"); else if(t.left == null) return t; else return this.minBinding(t.left);
	}
	,removeMinBinding: function(t) {
		if(t.left == null) return t.right; else return this.balance(this.removeMinBinding(t.left),t.key,t.value,t.right);
	}
	,balance: function(l,k,v,r) {
		var hl;
		if(l == null) hl = 0; else hl = l._height;
		var hr;
		if(r == null) hr = 0; else hr = r._height;
		if(hl > hr + 2) {
			if((function($this) {
				var $r;
				var _this = l.left;
				$r = _this == null?0:_this._height;
				return $r;
			}(this)) >= (function($this) {
				var $r;
				var _this1 = l.right;
				$r = _this1 == null?0:_this1._height;
				return $r;
			}(this))) return new haxe_ds_TreeNode(l.left,l.key,l.value,new haxe_ds_TreeNode(l.right,k,v,r)); else return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe_ds_TreeNode(l.right.right,k,v,r));
		} else if(hr > hl + 2) {
			if((function($this) {
				var $r;
				var _this2 = r.right;
				$r = _this2 == null?0:_this2._height;
				return $r;
			}(this)) > (function($this) {
				var $r;
				var _this3 = r.left;
				$r = _this3 == null?0:_this3._height;
				return $r;
			}(this))) return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left),r.key,r.value,r.right); else return new haxe_ds_TreeNode(new haxe_ds_TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe_ds_TreeNode(r.left.right,r.key,r.value,r.right));
		} else return new haxe_ds_TreeNode(l,k,v,r,(hl > hr?hl:hr) + 1);
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,__class__: haxe_ds_BalancedTree
};
var haxe_ds_TreeNode = function(l,k,v,r,h) {
	if(h == null) h = -1;
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) this._height = ((function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)) > (function($this) {
		var $r;
		var _this1 = $this.right;
		$r = _this1 == null?0:_this1._height;
		return $r;
	}(this))?(function($this) {
		var $r;
		var _this2 = $this.left;
		$r = _this2 == null?0:_this2._height;
		return $r;
	}(this)):(function($this) {
		var $r;
		var _this3 = $this.right;
		$r = _this3 == null?0:_this3._height;
		return $r;
	}(this))) + 1; else this._height = h;
};
$hxClasses["haxe.ds.TreeNode"] = haxe_ds_TreeNode;
haxe_ds_TreeNode.__name__ = ["haxe","ds","TreeNode"];
haxe_ds_TreeNode.prototype = {
	__class__: haxe_ds_TreeNode
};
var haxe_ds_EnumValueMap = function() {
	haxe_ds_BalancedTree.call(this);
};
$hxClasses["haxe.ds.EnumValueMap"] = haxe_ds_EnumValueMap;
haxe_ds_EnumValueMap.__name__ = ["haxe","ds","EnumValueMap"];
haxe_ds_EnumValueMap.__interfaces__ = [haxe_IMap];
haxe_ds_EnumValueMap.__super__ = haxe_ds_BalancedTree;
haxe_ds_EnumValueMap.prototype = $extend(haxe_ds_BalancedTree.prototype,{
	compare: function(k1,k2) {
		var d = k1[1] - k2[1];
		if(d != 0) return d;
		var p1 = k1.slice(2);
		var p2 = k2.slice(2);
		if(p1.length == 0 && p2.length == 0) return 0;
		return this.compareArgs(p1,p2);
	}
	,compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) return ld;
		var _g1 = 0;
		var _g = a1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var d = this.compareArg(a1[i],a2[i]);
			if(d != 0) return d;
		}
		return 0;
	}
	,compareArg: function(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) return this.compare(v1,v2); else if((v1 instanceof Array) && v1.__enum__ == null && ((v2 instanceof Array) && v2.__enum__ == null)) return this.compareArgs(v1,v2); else return Reflect.compare(v1,v2);
	}
	,__class__: haxe_ds_EnumValueMap
});
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
$hxClasses["haxe.ds._StringMap.StringMapIterator"] = haxe_ds__$StringMap_StringMapIterator;
haxe_ds__$StringMap_StringMapIterator.__name__ = ["haxe","ds","_StringMap","StringMapIterator"];
haxe_ds__$StringMap_StringMapIterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: haxe_ds__$StringMap_StringMapIterator
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
	,__class__: haxe_ds_StringMap
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
$hxClasses["js._Boot.HaxeError"] = js__$Boot_HaxeError;
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = ["js","Boot"];
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_Browser = function() { };
$hxClasses["js.Browser"] = js_Browser;
js_Browser.__name__ = ["js","Browser"];
js_Browser.alert = function(v) {
	window.alert(js_Boot.__string_rec(v,""));
};
var vinnie_Scene = function(game) {
	this.game = game;
	this.audio = game.audio;
	this.document = window.document;
	this.body = this.document.body;
	this.inventory = game.inventory;
	this.width = 300;
	this.height = 200;
	this.title = "";
	this.allowDragging = true;
	this.allowEndDragging = true;
	this.equippedItem = null;
	this.scale = 1;
};
$hxClasses["vinnie.Scene"] = vinnie_Scene;
vinnie_Scene.__name__ = ["vinnie","Scene"];
vinnie_Scene.prototype = {
	preload: function() {
		this.inventory.preloadItems();
		this.game.preloader.preloadArt(vinnie_Assets.vinnie);
		this.game.preloader.preloadArt(vinnie_Assets.vinnieShades);
		this.game.preloader.preloadSound(vinnie_Assets.death);
		this.game.preloader.preloadSound(vinnie_Assets.getItem);
		this.game.preloader.preloadSound(vinnie_Assets.getItem);
		this.game.preloader.preloadSound(vinnie_Assets.completeScene);
		this.game.preloader.preloadSound(vinnie_Assets.eureka);
	}
	,registerSounds: function() {
		this.audio.registerSound(vinnie_Assets.death);
		this.audio.registerSound(vinnie_Assets.getItem);
		this.audio.registerSound(vinnie_Assets.getItem);
		this.audio.registerSound(vinnie_Assets.completeScene);
		this.audio.registerSound(vinnie_Assets.eureka);
	}
	,start: function() {
		this.registerSounds();
		this.mainView = this.document.createElement("div");
		this.mainView.style.padding = "0";
		this.mainView.style.margin = "0";
		this.mainView.style.position = "absolute";
		this.mainView.style.width = "" + this.width + "px";
		this.mainView.style.height = "" + this.height + "px";
		this.mainView.style.top = "50%";
		this.mainView.style.left = "50%";
		this.mainView.style.marginLeft = "-" + this.width / 2 + "px";
		this.mainView.style.marginTop = "-" + this.height / 2 + "px";
		this.mainView.style.overflow = "hidden";
		this.body.appendChild(this.mainView);
		this.mouseX = 0;
		this.mouseY = 0;
		this.mainView.onmousemove = $bind(this,this.onMouseMove);
		this.mainView.addEventListener("touchstart",$bind(this,this.onTouchStart));
		this.body.addEventListener("touchmove",$bind(this,this.onTouchMove));
		this.body.addEventListener("touchend",$bind(this,this.onTouchEnd));
		this.updatePosition();
		var newTitle = "Vinnie's Tomb";
		if(this.title != "" && this.title != null) newTitle += " - " + this.title;
		this.document.title = newTitle;
		this.inventory.hide();
		this.setCursor(null);
	}
	,end: function() {
		this.destroyView();
		this.audio.stopMusic();
		this.audio.unregisterAll();
	}
	,destroyView: function() {
		this.body.removeEventListener("touchmove",$bind(this,this.onTouchMove));
		this.body.removeEventListener("touchend",$bind(this,this.onTouchEnd));
		if(this.mainView != null) {
			if(this.mainView.parentNode != null) this.mainView.parentNode.removeChild(this.mainView);
			this.mainView.removeEventListener("touchstart",$bind(this,this.onTouchStart));
			this.mainView = null;
		}
		this.inventory.hide();
	}
	,updatePosition: function() {
		var screenWidth = window.innerWidth;
		var screenHeight = window.innerHeight;
		this.scale = Math.min(screenWidth / this.width,screenHeight / this.height);
		if(!this.game.isMobile) this.scale = Math.round(this.scale / .25) * .25;
		this.scale = Math.min(this.scale,2);
		if(this.mainView != null && this.scale != 1) this.mainView.style.transform = "scale(" + this.scale + "," + this.scale + ")";
		this.inventory.resetPosition();
	}
	,giveItem: function(msg) {
		this.audio.playSound(vinnie_Assets.getItem);
		this.message(msg);
	}
	,message: function(msg) {
		js_Browser.alert(msg);
	}
	,makeArt: function(art,x,y,onClick) {
		var img = this.document.createElement("img");
		img.src = "assets/art/" + art + ".gif";
		img.style.position = "absolute";
		img.style.left = "" + x + "px";
		img.style.top = "" + y + "px";
		if(onClick != null) {
			var f = this.makeHandler(onClick);
			img.onclick = function(e) {
				f();
			};
		}
		this.mainView.appendChild(img);
		return img;
	}
	,playSound: function(sound,pause) {
		if(pause == null) pause = false;
		return this.audio.playSound(sound,pause);
	}
	,playMusic: function(music) {
		this.audio.playMusic(music);
		return;
	}
	,makeRect: function(x,y,width,height,color) {
		var div = this.document.createElement("div");
		div.style.position = "absolute";
		if(color != null) div.style.backgroundColor = color;
		div.style.left = "" + x + "px";
		div.style.top = "" + y + "px";
		div.style.width = "" + width + "px";
		div.style.height = "" + height + "px";
		this.mainView.appendChild(div);
		return div;
	}
	,makeVinnie: function(x,y) {
		var _g = this;
		this.vinnie = this.makeArt(vinnie_Assets.vinnie,x,y);
		this.vinnie.style.zIndex = "999";
		this.vinnie.onclick = function(e) {
			if(!_g.isDraggingVinnie && !_g.game.isPaused) {
				_g.onVinnieClicked();
				if(e != null) e.stopPropagation();
			}
		};
		if(this.game.shadesOn) this.wearShades();
		return this.vinnie;
	}
	,wearShades: function() {
		if(this.vinnie != null) this.vinnie.src = "assets/art/" + vinnie_Assets.vinnieShades + ".gif";
	}
	,makeItem: function(itemType,x,y,mustDrag,customHandler) {
		if(mustDrag == null) mustDrag = true;
		var _g = this;
		var itemInfo = vinnie_Inventory.itemInfo.get(itemType);
		if(itemInfo == null) return null;
		var item = null;
		var getItem = this.makeHandler(function() {
			if(!mustDrag || _g.isDraggingVinnie) {
				if(customHandler == null) {
					item.parentNode.removeChild(item);
					_g.obtainItem(itemType);
				} else customHandler();
			}
		});
		item = this.makeArt(itemInfo.icon,x,y,getItem);
		return item;
	}
	,makeClickHotspot: function(x,y,width,height,handler) {
		var hotspot = this.document.createElement("div");
		hotspot.style.position = "absolute";
		hotspot.style.left = "" + x + "px";
		hotspot.style.top = "" + y + "px";
		hotspot.style.width = "" + width + "px";
		hotspot.style.height = "" + height + "px";
		hotspot.onclick = this.makeHandler(handler);
		this.mainView.appendChild(hotspot);
		return hotspot;
	}
	,makeHoverHotspot: function(x,y,width,height,handler) {
		var hotspot = this.document.createElement("div");
		hotspot.style.position = "absolute";
		hotspot.style.left = "" + x + "px";
		hotspot.style.top = "" + y + "px";
		hotspot.style.width = "" + width + "px";
		hotspot.style.height = "" + height + "px";
		hotspot.onmouseover = this.makeHandler(handler);
		hotspot.ontouchmove = this.makeHandler(handler);
		this.mainView.appendChild(hotspot);
		return hotspot;
	}
	,makeDialogBox: function(x,y,width,height,textColor,bgColor) {
		var div = this.makeRect(x,y,width,height);
		div.style.fontFamily = "\"MS Sans Serif\", sans-serif";
		div.style.fontWeight = "700";
		div.style.fontSize = "8.25pt";
		if(textColor != null) div.style.color = textColor;
		if(bgColor != null) div.style.background = bgColor;
		div.style.cursor = "default";
		var text = this.document.createTextNode("");
		div.appendChild(text);
		return div;
	}
	,obtainItem: function(itemType) {
		var _g = this;
		var itemInfo = vinnie_Inventory.itemInfo.get(itemType);
		if(itemInfo != null) this.audio.playSound(vinnie_Assets.getItem,true).then(function() {
			_g.inventory.addItem(itemType);
			_g.inventory.show();
			_g.message("You now have " + itemInfo.name);
			_g.cancelDrag();
		});
	}
	,onVinnieClicked: function() {
		if(this.isDraggingVinnie) {
			this.onVinnieEndDrag(null);
			return;
		}
		if(this.allowDragging) {
			this.isDraggingVinnie = true;
			this.document.onclick = $bind(this,this.onVinnieEndDrag);
			this.vinnie.style.display = "none";
			this.setCursor(this.game.shadesOn?vinnie_Assets.vinnieShades:vinnie_Assets.vinnie);
			if(this.equippedItem != null) this.equippedItem = null;
		}
	}
	,onVinnieEndDrag: function(_) {
		if(this.allowEndDragging) {
			this.document.onclick = null;
			this.vinnie.style.display = "block";
			if(this.cursor != null) {
				this.vinnie.style.top = this.cursor.style.top;
				this.vinnie.style.left = this.cursor.style.left;
			}
			this.setCursor(null);
			this.isDraggingVinnie = false;
		}
	}
	,cancelDrag: function() {
		if(this.isDraggingVinnie) {
			this.setCursor(null);
			this.document.onclick = null;
			this.vinnie.style.display = "block";
			this.isDraggingVinnie = false;
		}
	}
	,makeHandler: function(f) {
		var _g = this;
		return function() {
			if(!_g.game.isPaused) f();
		};
	}
	,nextScene: function(nextScene,passCode,msg) {
		var _g = this;
		this.audio.playSound(vinnie_Assets.completeScene,true).then(function() {
			_g.message(msg == null?"You have completed " + _g.title:msg);
			if(passCode != null) {
				var gameData = vinnie_MainMenu.PASSCODE_GAMES.get(passCode);
				if(gameData != null) {
					var showPasscode = _g.game.shadesOn == gameData.shades;
					var _g1 = 0;
					var _g2 = gameData.inventory;
					while(_g1 < _g2.length) {
						var item = _g2[_g1];
						++_g1;
						if(!_g.inventory.hasItem(item)) {
							showPasscode = false;
							break;
						}
					}
					if(showPasscode) _g.message("" + passCode);
				}
			}
			var scene = Type.createInstance(nextScene,[_g.game]);
			_g.game.startScene(scene);
		});
	}
	,transitionToNextScene: function(nextScene,transition) {
		this.mainView.style.display = "none";
		this.audio.stopMusic();
		transition();
		var scene = Type.createInstance(nextScene,[this.game]);
		this.game.startScene(scene);
	}
	,bonusScene: function(id) {
		if(this.game.bonusScenes && !this.game.bonusSceneCompleted[id]) {
			this.message("YOU HAVE FOUND A HIDDEN BONUS SCENE");
			this.game.startScene(new vinnie_ActionScene(this.game,js_Boot.getClass(this),id));
		}
	}
	,vinnieDied: function() {
		var _g = this;
		this.game.isPaused = true;
		this.allowDragging = false;
		this.audio.playSound(vinnie_Assets.death);
		if(this.vinnie != null) this.vinnie.onclick = function(_) {
			_g.exitGame();
		};
	}
	,exitGame: function() {
		this.document.location.href = "http://www.reldni.com";
	}
	,isEquipped: function(itemType) {
		return this.equippedItem != null && this.equippedItem.type == itemType;
	}
	,equipItem: function(item) {
		if(!this.isDraggingVinnie) {
			if(item != null) {
				this.equippedItem = item;
				this.setCursor(this.equippedItem.icon);
				this.cursor.style.top = "-1000px";
			} else {
				this.equippedItem = null;
				this.setCursor(null);
			}
		}
	}
	,setCursor: function(art) {
		if(this.cursor != null && this.cursor.parentNode != null) {
			this.cursor.parentNode.removeChild(this.cursor);
			this.cursor = null;
		}
		if(this.mainView != null) {
			if(art != null) {
				this.mainView.style.cursor = "none";
				this.cursor = this.makeArt(art,0,0);
				this.cursor.style.zIndex = "9999";
				var viewRect = this.mainView.getBoundingClientRect();
				var x = (this.mouseX - viewRect.left) / this.scale - 16;
				var y = (this.mouseY - viewRect.top) / this.scale - 16;
				this.cursor.style.left = "" + x + "px";
				this.cursor.style.top = "" + y + "px";
				this.cursor.style.setProperty("pointer-events","none");
			} else this.mainView.style.cursor = "auto";
		}
	}
	,onMouseMove: function(e) {
		if(e.currentTarget == this.mainView) {
			this.mouseX = e.clientX;
			this.mouseY = e.clientY;
			var viewRect = this.mainView.getBoundingClientRect();
			if(this.cursor != null) {
				var x = (this.mouseX - viewRect.left) / this.scale - 16;
				var y = (this.mouseY - viewRect.top) / this.scale - 16;
				this.cursor.style.left = "" + x + "px";
				this.cursor.style.top = "" + y + "px";
			}
		}
	}
	,onTouchStart: function(e) {
		if(!this.game.isPaused && e.currentTarget == this.mainView) {
			this.mouseX = e.touches[0].clientX;
			this.mouseY = e.touches[0].clientY;
			this.touchStartElement = e.touches[0].target;
			var viewRect = this.mainView.getBoundingClientRect();
			if(this.vinnie != null && !this.isDraggingVinnie) {
				var x = (e.touches[0].clientX - viewRect.left) / this.scale;
				var y = (e.touches[0].clientY - viewRect.top) / this.scale;
				var dx = x - (this.vinnie.offsetLeft + 16);
				var dy = y - (this.vinnie.offsetTop + 16);
				var dist = Math.sqrt(dx * dx + dy * dy);
				if(dist <= 40) {
					this.onVinnieClicked();
					e.stopPropagation();
					return false;
				}
			}
		}
		return true;
	}
	,onTouchMove: function(e) {
		if(e.currentTarget == this.body) {
			var dx = e.touches[0].clientX - this.mouseX;
			this.mouseX = e.touches[0].clientX;
			this.mouseY = e.touches[0].clientY;
			var viewRect = this.mainView.getBoundingClientRect();
			var x = (this.mouseX - viewRect.left) / this.scale;
			var y = (this.mouseY - viewRect.top) / this.scale;
			if(x < 0 || x > this.width || y < 0 || y > this.height) return true;
			if(this.cursor != null) {
				this.cursor.style.left = "" + (x - 16) + "px";
				this.cursor.style.top = "" + (y - 16) + "px";
			}
			if(!this.game.isPaused) {
				if(!this.isDraggingVinnie && this.equippedItem == null && this.dialogScroller != null) this.dialogGotoLine(dx < 0?this.curDialogLine + 1:this.curDialogLine - 1);
				var obj = this.document.elementFromPoint(e.touches[0].pageX,e.touches[0].pageY);
				if(obj != null && obj.onmouseover != null) obj.onmouseover(null);
			}
		}
		return true;
	}
	,onTouchEnd: function(e) {
		if(e.touches.length == 0) {
			if(!this.game.isPaused) {
				var obj = this.document.elementFromPoint(e.changedTouches[0].pageX,e.changedTouches[0].pageY);
				if(obj != null && obj.onclick != null && !obj.disabled && obj != this.touchStartElement) obj.onclick(null);
			}
			if(this.isDraggingVinnie) {
				this.vinnie.style.display = "block";
				this.onVinnieEndDrag(null);
			}
			this.touchStartElement = null;
			return false;
		}
		return true;
	}
	,dialog: function(lines) {
		var scrollContainer = this.document.createElement("div");
		scrollContainer.style.position = "absolute";
		scrollContainer.style.width = "" + this.width + "px";
		scrollContainer.style.height = "16px";
		scrollContainer.style.bottom = "0";
		scrollContainer.style.left = "0";
		scrollContainer.style.zIndex = "9000";
		this.mainView.appendChild(scrollContainer);
		var scrollBar = this.document.createElement("div");
		scrollBar.style.width = "" + this.width + "px";
		scrollBar.style.overflowX = "scroll";
		scrollBar.style.overflowY = "hidden";
		scrollBar.style.position = "absolute";
		scrollBar.style.zIndex = "9000";
		scrollContainer.appendChild(scrollBar);
		this.dialogScroller = scrollBar;
		var innerDiv = this.document.createElement("div");
		innerDiv.style.width = "" + this.width * 10 + "px";
		innerDiv.style.height = "1px";
		scrollBar.appendChild(innerDiv);
		this.dialogLines = lines;
		this.dialogScroller.onscroll = $bind(this,this.onDialogScroll);
		this.curDialogLine = 0;
		this.curDialogScroll = this.dialogScroller.scrollLeft;
		if(this.dialogLines != null && this.dialogLines.length > 0) this.dialogLines[0]();
		return scrollContainer;
	}
	,onDialogScroll: function(e) {
		if(e.currentTarget == this.dialogScroller) {
			var line = this.curDialogLine;
			if(!this.game.isPaused) if(this.dialogScroller.scrollLeft > this.curDialogScroll) line += 1; else line += -1;
			this.dialogGotoLine(line);
		}
		return false;
	}
	,dialogGotoLine: function(line) {
		if(this.isDialogScrolling) {
			this.dialogScroller.scrollLeft = this.curDialogScroll;
			if(this.scrollTimer != null) this.scrollTimer.stop();
			this.scrollTimer = new haxe_Timer(150);
			this.scrollTimer.run = $bind(this,this.onScrollStopped);
			return;
		}
		if(this.dialogLines == null || this.dialogLines.length <= 1) return;
		if(line < 0) line = 0;
		if(line >= this.dialogLines.length) line = this.dialogLines.length - 1;
		if(this.curDialogLine != line) {
			this.curDialogLine = line;
			var dialogLine = this.dialogLines[this.curDialogLine];
			if(dialogLine != null) dialogLine();
			var maxScroll = this.dialogScroller.scrollWidth - this.dialogScroller.clientWidth;
			this.curDialogScroll = this.curDialogLine * maxScroll / (this.dialogLines.length - 1) | 0;
			this.dialogScroller.scrollLeft = this.curDialogScroll;
		}
		this.isDialogScrolling = true;
		this.scrollTimer = new haxe_Timer(150);
		this.scrollTimer.run = $bind(this,this.onScrollStopped);
	}
	,onScrollStopped: function() {
		this.isDialogScrolling = false;
		this.scrollTimer.stop();
		this.scrollTimer = null;
	}
	,animate: function(elem,time,properties,onComplete) {
		var _g = this;
		var gotTime = false;
		var curTime = 0.0;
		var startTime = 0.0;
		var propDeltas = [];
		var $it0 = properties.keys();
		while( $it0.hasNext() ) {
			var propName = $it0.next();
			var value = Std.parseInt(elem.style.getPropertyValue(propName));
			if(value != null) {
				var to;
				to = __map_reserved[propName] != null?properties.getReserved(propName):properties.h[propName];
				var speed = (to - value) / time;
				propDeltas.push({ name : propName, val : value, speed : speed, to : to});
			}
		}
		time *= 1000;
		var animator;
		var animator1 = null;
		animator1 = function(t) {
			if(!gotTime) {
				curTime = t;
				startTime = t;
				gotTime = true;
			}
			var dt = (t - curTime) / 1000;
			curTime = t;
			var _g1 = 0;
			while(_g1 < propDeltas.length) {
				var prop = propDeltas[_g1];
				++_g1;
				prop.val += prop.speed * dt;
				elem.style.setProperty(prop.name,"" + prop.val + "px");
			}
			if(curTime - startTime < time) window.requestAnimationFrame(animator1); else {
				var _g2 = 0;
				while(_g2 < propDeltas.length) {
					var prop1 = propDeltas[_g2];
					++_g2;
					prop1.val += prop1.speed * dt;
					elem.style.setProperty(prop1.name,"" + prop1.to + "px");
				}
				_g.game.isPaused = false;
				if(onComplete != null) onComplete();
			}
		};
		animator = animator1;
		this.game.isPaused = true;
		window.requestAnimationFrame(animator);
	}
	,getViewRect: function() {
		if(this.mainView != null) return this.mainView.getBoundingClientRect(); else return this.body.getBoundingClientRect();
	}
	,__class__: vinnie_Scene
};
var vinnie_ActionScene = function(game,previousScene,sceneId) {
	vinnie_Scene.call(this,game);
	this.title = "Walk Slowly and Past The Hidden Death Traps";
	this.allowDragging = false;
	this.width = 446;
	this.height = 341;
	this.previousScene = previousScene;
	game.bonusSceneCompleted[sceneId] = true;
	this.traps = vinnie_ActionScene.ACTION_SCENE_DATA[sceneId];
};
$hxClasses["vinnie.ActionScene"] = vinnie_ActionScene;
vinnie_ActionScene.__name__ = ["vinnie","ActionScene"];
vinnie_ActionScene.__super__ = vinnie_Scene;
vinnie_ActionScene.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		vinnie_Scene.prototype.start.call(this);
		this.message("IN THIS BONUS SCENE, USE THE ARROW KEYS TO MOVE VINNIE TO THE TOP");
		this.makeArt(vinnie_Assets.bgAction,0,0);
		this.vinnieX = 200;
		this.vinnieY = 305;
		this.makeVinnie(this.vinnieX,this.vinnieY);
		window.addEventListener("keydown",$bind(this,this.onKeyPress));
	}
	,end: function() {
		window.removeEventListener("keydown",$bind(this,this.onKeyPress));
		vinnie_Scene.prototype.end.call(this);
	}
	,onKeyPress: function(e) {
		if(!this.game.isPaused) {
			var dx = 0;
			var dy = 0;
			if(e.keyCode == 38) dy = -3;
			if(e.keyCode == 40) dy = 3;
			if(e.keyCode == 37) dx = -5;
			if(e.keyCode == 39) dx = 5;
			this.vinnieX += dx;
			this.vinnieY += dy;
			this.vinnieX = this.clamp(this.vinnieX,0,this.width - 32);
			this.vinnieY = this.clamp(this.vinnieY,0,this.height - 32);
			this.vinnie.style.left = "" + this.vinnieX + "px";
			this.vinnie.style.top = "" + this.vinnieY + "px";
			if(this.traps != null) {
				var _g = 0;
				var _g1 = this.traps;
				while(_g < _g1.length) {
					var trap = _g1[_g];
					++_g;
					if(this.vinnieX >= trap.x && this.vinnieX <= trap.x + 49 && this.vinnieY >= trap.y && this.vinnieY <= trap.y + 33) {
						this.onDeathTrap();
						return false;
					}
				}
			}
			if(this.vinnieY <= 0) this.onWin();
		}
		e.stopPropagation();
		return false;
	}
	,clamp: function(val,min,max) {
		if(val < min) return min; else if(val > max) return max; else return val;
	}
	,onDeathTrap: function() {
		window.removeEventListener("keydown",$bind(this,this.onKeyPress));
		this.audio.playSound(vinnie_Assets.death,false);
		this.vinnie.style.display = "none";
		this.message("You have stepped on a hidden Death Trap.  You must try again.");
		this.game.startScene(this);
	}
	,onWin: function() {
		this.nextScene(this.previousScene,null,"You have successfully traversed the field of death traps!");
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadArt(vinnie_Assets.bgAction);
		this.game.preloader.preloadSound(vinnie_Assets.death);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerSound(vinnie_Assets.death);
	}
	,__class__: vinnie_ActionScene
});
var vinnie__$Assets_Art_$Impl_$ = {};
$hxClasses["vinnie._Assets.Art_Impl_"] = vinnie__$Assets_Art_$Impl_$;
vinnie__$Assets_Art_$Impl_$.__name__ = ["vinnie","_Assets","Art_Impl_"];
vinnie__$Assets_Art_$Impl_$.get_id = function(this1) {
	return this1;
};
vinnie__$Assets_Art_$Impl_$.get_url = function(this1) {
	return "assets/art/" + this1 + ".gif";
};
var vinnie__$Assets_Sound_$Impl_$ = {};
$hxClasses["vinnie._Assets.Sound_Impl_"] = vinnie__$Assets_Sound_$Impl_$;
vinnie__$Assets_Sound_$Impl_$.__name__ = ["vinnie","_Assets","Sound_Impl_"];
vinnie__$Assets_Sound_$Impl_$.get_id = function(this1) {
	return this1;
};
vinnie__$Assets_Sound_$Impl_$.get_url = function(this1) {
	return "assets/sounds/" + this1;
};
var vinnie__$Assets_Music_$Impl_$ = {};
$hxClasses["vinnie._Assets.Music_Impl_"] = vinnie__$Assets_Music_$Impl_$;
vinnie__$Assets_Music_$Impl_$.__name__ = ["vinnie","_Assets","Music_Impl_"];
vinnie__$Assets_Music_$Impl_$.get_id = function(this1) {
	return this1;
};
vinnie__$Assets_Music_$Impl_$.get_url = function(this1) {
	return "assets/music/" + this1 + ".mp3";
};
var vinnie_Assets = function() { };
$hxClasses["vinnie.Assets"] = vinnie_Assets;
vinnie_Assets.__name__ = ["vinnie","Assets"];
var vinnie_AudioManager = function(game) {
	this.game = game;
	this.audios = new haxe_ds_StringMap();
	this.audiosToPrime = [];
	window.onpagehide = $bind(this,this.onFocusChanged);
	window.onpageshow = $bind(this,this.onFocusChanged);
	window.document.addEventListener("visibilitychange",$bind(this,this.onFocusChanged));
	var _g = [];
	var _g1 = 0;
	while(_g1 < 40) {
		var i = _g1++;
		_g.push(new Audio());
	}
	this.audioPool = _g;
	this.audiosToPrime = this.audioPool.slice();
};
$hxClasses["vinnie.AudioManager"] = vinnie_AudioManager;
vinnie_AudioManager.__name__ = ["vinnie","AudioManager"];
vinnie_AudioManager.prototype = {
	registerSound: function(sound) {
		if(!this.audios.exists(sound)) {
			var dst = this.audioPool.pop();
			if(dst != null) {
				dst.src = "assets/sounds/" + sound;
				dst.autoplay = false;
				dst.load();
				dst.play();
				dst.pause();
				this.audios.set(sound,dst);
			}
		}
	}
	,registerMusic: function(sound) {
		if(!this.audios.exists(sound)) {
			var dst = this.audioPool.pop();
			if(dst != null) {
				dst.src = "assets/music/" + sound + ".mp3";
				dst.autoplay = false;
				dst.load();
				this.audios.set(sound,dst);
			}
		}
	}
	,playSound: function(sound,pause) {
		if(pause == null) pause = false;
		var _g = this;
		this.stopSound();
		var audio = this.audios.get(sound);
		if(audio == null) {
			audio = new Audio();
			audio.src = "assets/sounds/" + sound;
		}
		try {
			audio.currentTime = 0;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
		}
		audio.volume = 1.0;
		audio.loop = false;
		audio.play();
		var handle = new vinnie__$AudioManager_AudioHandle(audio);
		this.curSound = handle;
		if(pause) {
			this.game.isPaused = true;
			handle.then(function() {
				_g.game.isPaused = false;
			});
		}
		return handle;
	}
	,playMusic: function(music) {
		this.stopMusic();
		var audio = this.audios.get(music);
		if(audio == null) {
			audio = new Audio();
			audio.src = "assets/music/" + music + ".mp3";
		}
		audio.loop = true;
		audio.volume = 1.0;
		try {
			audio.currentTime = 0;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
		}
		audio.play();
		this.curMusic = new vinnie__$AudioManager_AudioHandle(audio);
	}
	,stopSound: function() {
		if(this.curSound != null) this.curSound.stop();
		this.curSound = null;
	}
	,stopMusic: function() {
		if(this.curMusic != null) {
			this.curMusic.stop();
			this.curMusic = null;
		}
	}
	,unregisterAll: function() {
		var $it0 = this.audios.iterator();
		while( $it0.hasNext() ) {
			var audio = $it0.next();
			if(audio != null) {
				if(audio.loop) audio.pause();
				this.audioPool.push(audio);
			}
		}
		this.audios = new haxe_ds_StringMap();
	}
	,onFocusChanged: function(_) {
		if(this.curMusic != null) {
			if(window.document.hidden) this.curMusic.pause(); else this.curMusic.resume();
		}
	}
	,primeSounds: function() {
		var _g = 0;
		var _g1 = this.audiosToPrime;
		while(_g < _g1.length) {
			var audio = _g1[_g];
			++_g;
			audio.volume = 0.0;
			audio.play();
			audio.pause();
		}
		if(this.audiosToPrime.length > 0) this.audiosToPrime.splice(0,this.audiosToPrime.length);
	}
	,__class__: vinnie_AudioManager
};
var vinnie__$AudioManager_AudioHandle = function(audio) {
	var _g = this;
	this.audio = audio;
	this.onComplete = function() {
		audio.onended = null;
	};
	audio.onended = audio.onerror = function(_) {
		_g.onComplete();
	};
	if(audio.error != null) haxe_Timer.delay(function() {
		_g.onComplete();
	},1);
};
$hxClasses["vinnie._AudioManager.AudioHandle"] = vinnie__$AudioManager_AudioHandle;
vinnie__$AudioManager_AudioHandle.__name__ = ["vinnie","_AudioManager","AudioHandle"];
vinnie__$AudioManager_AudioHandle.prototype = {
	then: function(f) {
		var oldOnComplete = this.onComplete;
		this.onComplete = function() {
			oldOnComplete();
			f();
		};
		return this;
	}
	,stop: function() {
		this.audio.pause();
	}
	,pause: function() {
		this.audio.pause();
	}
	,resume: function() {
		this.audio.play();
	}
	,__class__: vinnie__$AudioManager_AudioHandle
};
var vinnie_InventoryItemType = { __ename__ : true, __constructs__ : ["Magnet","Sword","SkullThatOozesBloodIntermittently","Diamond","Banana","Key","Underwear","CD","Money","EightBall","Cheese","Shades","ToolBox"] };
vinnie_InventoryItemType.Magnet = ["Magnet",0];
vinnie_InventoryItemType.Magnet.toString = $estr;
vinnie_InventoryItemType.Magnet.__enum__ = vinnie_InventoryItemType;
vinnie_InventoryItemType.Sword = ["Sword",1];
vinnie_InventoryItemType.Sword.toString = $estr;
vinnie_InventoryItemType.Sword.__enum__ = vinnie_InventoryItemType;
vinnie_InventoryItemType.SkullThatOozesBloodIntermittently = ["SkullThatOozesBloodIntermittently",2];
vinnie_InventoryItemType.SkullThatOozesBloodIntermittently.toString = $estr;
vinnie_InventoryItemType.SkullThatOozesBloodIntermittently.__enum__ = vinnie_InventoryItemType;
vinnie_InventoryItemType.Diamond = ["Diamond",3];
vinnie_InventoryItemType.Diamond.toString = $estr;
vinnie_InventoryItemType.Diamond.__enum__ = vinnie_InventoryItemType;
vinnie_InventoryItemType.Banana = ["Banana",4];
vinnie_InventoryItemType.Banana.toString = $estr;
vinnie_InventoryItemType.Banana.__enum__ = vinnie_InventoryItemType;
vinnie_InventoryItemType.Key = ["Key",5];
vinnie_InventoryItemType.Key.toString = $estr;
vinnie_InventoryItemType.Key.__enum__ = vinnie_InventoryItemType;
vinnie_InventoryItemType.Underwear = ["Underwear",6];
vinnie_InventoryItemType.Underwear.toString = $estr;
vinnie_InventoryItemType.Underwear.__enum__ = vinnie_InventoryItemType;
vinnie_InventoryItemType.CD = ["CD",7];
vinnie_InventoryItemType.CD.toString = $estr;
vinnie_InventoryItemType.CD.__enum__ = vinnie_InventoryItemType;
vinnie_InventoryItemType.Money = ["Money",8];
vinnie_InventoryItemType.Money.toString = $estr;
vinnie_InventoryItemType.Money.__enum__ = vinnie_InventoryItemType;
vinnie_InventoryItemType.EightBall = ["EightBall",9];
vinnie_InventoryItemType.EightBall.toString = $estr;
vinnie_InventoryItemType.EightBall.__enum__ = vinnie_InventoryItemType;
vinnie_InventoryItemType.Cheese = ["Cheese",10];
vinnie_InventoryItemType.Cheese.toString = $estr;
vinnie_InventoryItemType.Cheese.__enum__ = vinnie_InventoryItemType;
vinnie_InventoryItemType.Shades = ["Shades",11];
vinnie_InventoryItemType.Shades.toString = $estr;
vinnie_InventoryItemType.Shades.__enum__ = vinnie_InventoryItemType;
vinnie_InventoryItemType.ToolBox = ["ToolBox",12];
vinnie_InventoryItemType.ToolBox.toString = $estr;
vinnie_InventoryItemType.ToolBox.__enum__ = vinnie_InventoryItemType;
var vinnie_Inventory = function(game) {
	this.game = game;
	var _this = window.document;
	this.inventoryView = _this.createElement("div");
	this.inventoryView.style.position = "absolute";
	this.inventoryView.style.top = "50%";
	this.inventoryView.style.left = "50%";
	this.inventoryView.style.display = "none";
	this.inventoryView.style.background = "#ffe0c0";
	this.inventoryView.style.zIndex = "10001";
	var w = 270;
	var h = 120;
	this.inventoryView.style.width = "" + w + "px";
	this.inventoryView.style.height = "" + h + "px";
	this.inventoryView.style.marginLeft = "-" + w / 2 + "px";
	this.inventoryView.style.border = "1px solid black";
	this.inventoryView.style.overflow = "hidden";
	window.document.body.appendChild(this.inventoryView);
	var titleBar;
	var _this1 = window.document;
	titleBar = _this1.createElement("div");
	titleBar.style.background = "#000080";
	titleBar.style.color = "white";
	titleBar.style.fontSize = "8.5pt";
	titleBar.style.width = "100%";
	titleBar.style.padding = "4px 2px";
	titleBar.style.fontFamily = "\"MS Sans Serif\",sans-serif";
	titleBar.style.fontWeight = "bold";
	titleBar.style.cursor = "default";
	titleBar.appendChild(window.document.createTextNode("Item Inventory"));
	titleBar.onclick = $bind(this,this.onTitleBarClicked);
	this.inventoryView.appendChild(titleBar);
	this.useCollapse = false;
	this.isCollapsed = false;
	this.items = new haxe_ds_EnumValueMap();
};
$hxClasses["vinnie.Inventory"] = vinnie_Inventory;
vinnie_Inventory.__name__ = ["vinnie","Inventory"];
vinnie_Inventory.prototype = {
	show: function() {
		this.inventoryView.style.display = "block";
		this.resetPosition();
	}
	,hide: function() {
		this.inventoryView.style.display = "none";
	}
	,hasItem: function(item) {
		return this.items.exists(item);
	}
	,addItem: function(item) {
		var _g = this;
		var itemInfo = vinnie_Inventory.itemInfo.get(item);
		if(itemInfo != null) {
			var itemPic;
			var _this = window.document;
			itemPic = _this.createElement("img");
			itemPic.src = "assets/art/" + itemInfo.icon + ".gif";
			itemPic.style.position = "absolute";
			itemPic.style.left = "" + (itemInfo.x + 2) + "px";
			itemPic.style.top = "" + (itemInfo.y + 16) + "px";
			itemPic.onclick = (function(f,a1) {
				return function() {
					f(a1);
				};
			})($bind(this,this.onEquipItem),itemInfo);
			itemPic.addEventListener("touchstart",function(_) {
				((function(f1,a11) {
					return function() {
						f1(a11);
					};
				})($bind(_g,_g.onEquipItem),itemInfo))();
			});
			this.inventoryView.appendChild(itemPic);
			this.items.set(item,itemPic);
		}
	}
	,resetPosition: function() {
		if(this.game.scene != null) {
			var viewRect = this.game.scene.getViewRect();
			var height = 120;
			var yPos = viewRect.top - height - 4;
			if(yPos < 0) {
				yPos = 0;
				this.useCollapse = true;
				this.isCollapsed = true;
				height = 20;
			} else {
				this.useCollapse = false;
				this.isCollapsed = false;
			}
			this.inventoryView.style.top = "" + yPos + "px";
			this.inventoryView.style.height = "" + height + "px";
		}
	}
	,removeItem: function(item) {
		var itemPic = this.items.get(item);
		if(itemPic != null && itemPic.parentNode != null) itemPic.parentNode.removeChild(itemPic);
		this.items.remove(item);
	}
	,removeAllItems: function() {
		var $it0 = this.items.iterator();
		while( $it0.hasNext() ) {
			var itemPic = $it0.next();
			if(itemPic != null && itemPic.parentNode != null) itemPic.parentNode.removeChild(itemPic);
		}
		this.items = new haxe_ds_EnumValueMap();
	}
	,onEquipItem: function(item) {
		if(item.type == vinnie_InventoryItemType.ToolBox) {
			if(!this.hasItem(vinnie_InventoryItemType.EightBall)) {
				js_Browser.alert("You find an eight ball inside the metal box.");
				this.addItem(vinnie_InventoryItemType.EightBall);
			} else js_Browser.alert("The Metal Box is empty.");
		} else if(item.type == vinnie_InventoryItemType.EightBall && Type.getClass(this.game.scene) != vinnie_Scene13) js_Browser.alert("You do not need the eight ball in this scene"); else if(item.type == vinnie_InventoryItemType.CD && Type.getClass(this.game.scene) != vinnie_Scene17) js_Browser.alert("You do not have a CD player to play the disc"); else if(item.type == vinnie_InventoryItemType.Shades) {
			this.game.shadesOn = true;
			this.removeItem(vinnie_InventoryItemType.Shades);
			js_Browser.alert("You put on the cool shades.");
			if(this.game.scene != null) this.game.scene.wearShades();
		} else if(this.game.scene != null) this.game.scene.equipItem(item);
		this.onCollapseInventory(null);
	}
	,preloadItems: function() {
		var $it0 = vinnie_Inventory.itemInfo.iterator();
		while( $it0.hasNext() ) {
			var item = $it0.next();
			this.game.preloader.preloadArt(item.icon);
		}
	}
	,onTitleBarClicked: function(_) {
		if(this.useCollapse) {
			this.inventoryView.addEventListener("mouseleave",$bind(this,this.onCollapseInventory));
			this.inventoryView.style.height = "120px";
			this.isCollapsed = true;
		}
	}
	,onCollapseInventory: function(_) {
		this.inventoryView.removeEventListener("mouseleave",$bind(this,this.onCollapseInventory));
		if(this.useCollapse) {
			this.inventoryView.style.height = "20px";
			this.isCollapsed = false;
		}
	}
	,__class__: vinnie_Inventory
};
var vinnie_Scene3 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 398;
	this.height = 199;
	this.title = "Scene Three";
};
$hxClasses["vinnie.Scene3"] = vinnie_Scene3;
vinnie_Scene3.__name__ = ["vinnie","Scene3"];
vinnie_Scene3.__super__ = vinnie_Scene;
vinnie_Scene3.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		var _g = this;
		vinnie_Scene.prototype.start.call(this);
		this.audio.playMusic(vinnie_Assets.musicScene3);
		this.makeArt(vinnie_Assets.bgScene3,0,0);
		this.makeClickHotspot(66,150,57,45,(function(f,id) {
			return function() {
				f(id);
			};
		})($bind(this,this.bonusScene),0));
		this.makeClickHotspot(304,146,35,37,function() {
			_g.message("CAUTION - This game will rot your brain");
		});
		this.makeClickHotspot(152,136,73,57,$bind(this,this.onHoleClicked));
		this.makeHoverHotspot(0,40,73,49,$bind(this,this.onFried));
		this.makeVinnie(352,88);
		this.inventory.show();
	}
	,onHoleClicked: function() {
		this.audio.playSound(vinnie_Assets.teleport);
		this.message("You have entered the underworld and completed Scene Three");
		this.transitionToNextScene(vinnie_Scene4,$bind(this,this.underworldTransition));
	}
	,underworldTransition: function() {
		this.audio.playSound(vinnie_Assets.nar1);
		this.message("You gently ride down on a cushion of air to the underworld.  You do not have to wander far until you reach two party-bots.  These stationary robots had been fused together to guard and protect.  They were programmed to throw pies at anyone entering the underworld during the war with the drunken eyed sailors of moldville.  The war has been over for years and Underworld has become a wealthy metropolis.  Inside the underworld city lies many lucrative franchises and taco stands.  You know that your journey most likely lies around the outskirts of the Underworld city.  Therefore, you will not have an opportunity to sample the fine dining establishments.");
	}
	,onFried: function() {
		if(this.isDraggingVinnie) {
			this.message("You climb to the top of the tree.  A freak bolt of lightning kills you!");
			this.cancelDrag();
			this.vinnie.src = "assets/art/" + vinnie_Assets.vinnieFried + ".gif";
			this.vinnie.style.left = "8px";
			this.vinnie.style.top = "32px";
			this.makeArt(vinnie_Assets.bolt,24,8);
			this.vinnieDied();
		}
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene3);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene3);
		this.game.preloader.preloadSound(vinnie_Assets.teleport);
		this.game.preloader.preloadSound(vinnie_Assets.nar1);
		this.game.preloader.preloadArt(vinnie_Assets.vinnieFried);
		this.game.preloader.preloadArt(vinnie_Assets.bolt);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene3);
		this.audio.registerSound(vinnie_Assets.teleport);
		this.audio.registerSound(vinnie_Assets.nar1);
	}
	,__class__: vinnie_Scene3
});
var vinnie_Scene8 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 400;
	this.height = 218;
	this.title = "Scene Eight";
};
$hxClasses["vinnie.Scene8"] = vinnie_Scene8;
vinnie_Scene8.__name__ = ["vinnie","Scene8"];
vinnie_Scene8.__super__ = vinnie_Scene;
vinnie_Scene8.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		var _g = this;
		vinnie_Scene.prototype.start.call(this);
		this.allowDragging = false;
		this.audio.playMusic(vinnie_Assets.musicScene8);
		this.makeArt(vinnie_Assets.bgScene8,0,0);
		this.makeHoverHotspot(-1,21,401,107,$bind(this,this.cancelDrag));
		this.line2 = this.makeArt(vinnie_Assets.scene8Line2,274,123);
		this.vinnieDialog = this.makeDialogBox(209,67,171,56,"black","white");
		this.vinnieDialog.style.fontFamily = "\"Times New Roman\",serif";
		this.vinnieDialog.style.fontSize = "9.75pt";
		this.vinnieDialog.style.fontWeight = "400";
		this.exit = this.makeArt(vinnie_Assets.exitLeft,8,160,$bind(this,this.onExitClicked));
		this.exit.style.display = "none";
		this.makeVinnie(349,162);
		this.guysDialog = this.makeDialogBox(12,49,191,56,"black","white");
		this.guysDialog.style.fontFamily = "\"Times New Roman\",serif";
		this.guysDialog.style.fontSize = "9.75pt";
		this.guysDialog.style.fontWeight = "normal";
		this.line1 = this.makeArt(vinnie_Assets.scene8Line1,69,105);
		this.makeItem(vinnie_InventoryItemType.ToolBox,296,170);
		this.makeArt(vinnie_Assets.funlander,176,164);
		this.makeArt(vinnie_Assets.funlander,138,163);
		this.makeArt(vinnie_Assets.funlander,106,165);
		this.makeArt(vinnie_Assets.funlander,75,164);
		this.makeArt(vinnie_Assets.ufo,322,-8,function() {
			_g.message("The alien space ship is suspended high in the sky above Fun Land.");
		});
		var vinnieSpeak = function(sound,dialog) {
			_g.vinnieDialog.style.display = "block";
			_g.vinnieDialog.textContent = dialog;
			_g.guysDialog.style.display = "none";
			_g.line1.style.display = "none";
			_g.line2.style.display = "block";
			_g.audio.playSound(sound,false);
		};
		var guysSpeak = function(sound1,dialog1) {
			_g.vinnieDialog.style.display = "none";
			_g.guysDialog.style.display = "block";
			_g.guysDialog.textContent = dialog1;
			_g.line1.style.display = "block";
			_g.line2.style.display = "none";
			_g.audio.playSound(sound1,false);
		};
		this.dialog([(function(f,a1,a2) {
			return function() {
				f(a1,a2);
			};
		})(vinnieSpeak,vinnie_Assets.vin11,"Why do you guys look so sad?  I thought this place was Fun Land."),(function(f1,a11,a21) {
			return function() {
				f1(a11,a21);
			};
		})(guysSpeak,vinnie_Assets.guy1,"That is the cruel irony."),(function(f2,a12,a22) {
			return function() {
				f2(a12,a22);
			};
		})(vinnieSpeak,vinnie_Assets.vin12,"Why are you so sad?"),(function(f3,a13,a23) {
			return function() {
				f3(a13,a23);
			};
		})(guysSpeak,vinnie_Assets.guy2,"We just found out that Donny Osmond canceled his gig here.  That’s only part of it though."),(function(f4,a14,a24) {
			return function() {
				f4(a14,a24);
			};
		})(vinnieSpeak,vinnie_Assets.vin13,"Tell me more."),(function(f5,a15,a25) {
			return function() {
				f5(a15,a25);
			};
		})(guysSpeak,vinnie_Assets.guy3,"There is a monster that terrorizes us through the night."),(function(f6,a16,a26) {
			return function() {
				f6(a16,a26);
			};
		})(vinnieSpeak,vinnie_Assets.vin14,"That’s terrible!  Does he try and eat you?"),(function(f7,a17,a27) {
			return function() {
				f7(a17,a27);
			};
		})(guysSpeak,vinnie_Assets.guy4,"No.  He tells horrible one liners and sings show tunes."),(function(f8,a18,a28) {
			return function() {
				f8(a18,a28);
			};
		})(vinnieSpeak,vinnie_Assets.vin15,"That doesn’t seem too bad."),(function(f9,a19,a29) {
			return function() {
				f9(a19,a29);
			};
		})(guysSpeak,vinnie_Assets.guy5,"He sounds like Leonard Cohen and he sings at three o’clock in the morning."),(function(f10,a110,a210) {
			return function() {
				f10(a110,a210);
			};
		})(vinnieSpeak,vinnie_Assets.vin16,"That is bad."),function() {
			_g.exit.style.display = "block";
			_g.vinnieDialog.style.display = "none";
			_g.guysDialog.style.display = "none";
			_g.line1.style.display = "none";
			_g.line2.style.display = "none";
			_g.allowDragging = true;
			_g.message("You would like to ask the sad guys about Vinnie’s Tomb, but they appear too upset to answer any questions.");
		}]);
	}
	,onExitClicked: function() {
		this.nextScene(vinnie_Scene9);
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene8);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene8);
		this.game.preloader.preloadArt(vinnie_Assets.scene8Line2);
		this.game.preloader.preloadArt(vinnie_Assets.exitLeft);
		this.game.preloader.preloadArt(vinnie_Assets.scene8Line1);
		this.game.preloader.preloadArt(vinnie_Assets.funlander);
		this.game.preloader.preloadArt(vinnie_Assets.funlander);
		this.game.preloader.preloadArt(vinnie_Assets.funlander);
		this.game.preloader.preloadArt(vinnie_Assets.funlander);
		this.game.preloader.preloadArt(vinnie_Assets.ufo);
		this.game.preloader.preloadSound(vinnie_Assets.vin11);
		this.game.preloader.preloadSound(vinnie_Assets.guy1);
		this.game.preloader.preloadSound(vinnie_Assets.vin12);
		this.game.preloader.preloadSound(vinnie_Assets.guy2);
		this.game.preloader.preloadSound(vinnie_Assets.vin13);
		this.game.preloader.preloadSound(vinnie_Assets.guy3);
		this.game.preloader.preloadSound(vinnie_Assets.vin14);
		this.game.preloader.preloadSound(vinnie_Assets.guy4);
		this.game.preloader.preloadSound(vinnie_Assets.vin15);
		this.game.preloader.preloadSound(vinnie_Assets.guy5);
		this.game.preloader.preloadSound(vinnie_Assets.vin16);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene8);
		this.audio.registerSound(vinnie_Assets.vin11);
		this.audio.registerSound(vinnie_Assets.guy1);
		this.audio.registerSound(vinnie_Assets.vin12);
		this.audio.registerSound(vinnie_Assets.guy2);
		this.audio.registerSound(vinnie_Assets.vin13);
		this.audio.registerSound(vinnie_Assets.guy3);
		this.audio.registerSound(vinnie_Assets.vin14);
		this.audio.registerSound(vinnie_Assets.guy4);
		this.audio.registerSound(vinnie_Assets.vin15);
		this.audio.registerSound(vinnie_Assets.guy5);
		this.audio.registerSound(vinnie_Assets.vin16);
	}
	,__class__: vinnie_Scene8
});
var vinnie_Scene12 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 399;
	this.height = 193;
	this.title = "Scene Twelve";
	this.allowDragging = false;
};
$hxClasses["vinnie.Scene12"] = vinnie_Scene12;
vinnie_Scene12.__name__ = ["vinnie","Scene12"];
vinnie_Scene12.__super__ = vinnie_Scene;
vinnie_Scene12.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		vinnie_Scene.prototype.start.call(this);
		this.makeArt(vinnie_Assets.bgScene12,0,0,$bind(this,this.onChasmClicked));
		this.makeClickHotspot(297,4,36,49,(function(f,id) {
			return function() {
				f(id);
			};
		})($bind(this,this.bonusScene),1));
		this.makeClickHotspot(31,123,27,27,(function(f1,a1) {
			return function() {
				f1(a1);
			};
		})($bind(this,this.message),"This isn't funny anymore."));
		this.makeClickHotspot(94,101,31,37,(function(f2,a11) {
			return function() {
				f2(a11);
			};
		})($bind(this,this.message),"Keep clicking."));
		this.makeVinnie(336,16);
		this.jerk = this.makeArt(vinnie_Assets.jerk,344,16);
		this.jerk.style.display = "none";
	}
	,onChasmClicked: function() {
		this.message("Travelling for thirty more days you come to a cliff.  You realise you are desperately lost.  You need to find away to rise above Underworld and continue your exciting adventure.  Suddenly a nasty creature jumps from behind you!  It pushes you off the cliff!");
		this.jerk.style.display = "block";
		this.animate(this.vinnie,1.0,(function($this) {
			var $r;
			var _g = new haxe_ds_StringMap();
			_g.set("top",$this.height + 32);
			$r = _g;
			return $r;
		}(this)),$bind(this,this.onFallComplete));
	}
	,onFallComplete: function() {
		var _g = this;
		this.audio.playSound(vinnie_Assets.death,true).then(function() {
			_g.message("Oddly enough you did not die.  Instead, you landed on a strategically placed mountain of breakfast cereal.");
			_g.audio.playSound(vinnie_Assets.trainWhistle,true).then(function() {
				_g.message("You discover a nearby train station.  You hop aboard the train bound for an unknown destination.");
				_g.message("Being a low budget game, we could not afford a real train, so you'll have to imagine it.");
				_g.nextScene(vinnie_Scene13);
			});
		});
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene12);
		this.game.preloader.preloadArt(vinnie_Assets.jerk);
		this.game.preloader.preloadSound(vinnie_Assets.death);
		this.game.preloader.preloadSound(vinnie_Assets.trainWhistle);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerSound(vinnie_Assets.death);
		this.audio.registerSound(vinnie_Assets.trainWhistle);
	}
	,__class__: vinnie_Scene12
});
var vinnie_MainMenu = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 446;
	this.height = 347;
};
$hxClasses["vinnie.MainMenu"] = vinnie_MainMenu;
vinnie_MainMenu.__name__ = ["vinnie","MainMenu"];
vinnie_MainMenu.__super__ = vinnie_Scene;
vinnie_MainMenu.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		var _g = this;
		vinnie_Scene.prototype.start.call(this);
		this.body.style.backgroundColor = "#ffe0c0";
		var menuDiv = this.document.createElement("div");
		menuDiv.style.margin = "0 auto";
		menuDiv.style.textAlign = "center";
		this.mainView.appendChild(menuDiv);
		var titleDiv = this.document.createElement("div");
		titleDiv.style.margin = "9px auto";
		titleDiv.style.position = "relative";
		menuDiv.appendChild(titleDiv);
		var img = this.document.createElement("img");
		img.src = "assets/art/" + vinnie_Assets.title + ".gif";
		img.style.display = "block";
		img.style.margin = "0 auto";
		titleDiv.appendChild(img);
		var subtitleDiv = this.document.createElement("div");
		subtitleDiv.style.position = "absolute";
		subtitleDiv.style.bottom = "5px";
		subtitleDiv.style.width = "100%";
		subtitleDiv.style.fontWeight = "bold";
		titleDiv.appendChild(subtitleDiv);
		var subtitleText = this.document.createElement("span");
		subtitleText.style.fontSize = "120%";
		subtitleText.style.fontStyle = "italic";
		subtitleText.appendChild(this.document.createTextNode("The Road to Vinnie's Tomb"));
		subtitleDiv.appendChild(subtitleText);
		subtitleDiv.appendChild(this.document.createElement("br"));
		var subtitleText1 = this.document.createElement("span");
		subtitleText1.appendChild(this.document.createTextNode("(For Lack of A Better Title)"));
		subtitleDiv.appendChild(subtitleText1);
		var button = this.makeButton("Begin The Game");
		button.style.margin = "2px auto 7px auto";
		button.style.width = "299px";
		button.style.height = "38px";
		var buttonHandler = this.makeHandler(function() {
			_g.game.startScene(new vinnie_Scene1(_g.game));
		});
		button.onclick = function(_) {
			buttonHandler();
		};
		menuDiv.appendChild(button);
		this.passCodeDiv = this.document.createElement("div");
		this.passCodeDiv.style.margin = "0 auto 33px auto";
		this.passCodeDiv.style.display = "block";
		menuDiv.appendChild(this.passCodeDiv);
		this.passCodeText = this.document.createElement("input");
		this.passCodeText.style.display = "none";
		this.passCodeText.style.width = "81px";
		this.passCodeText.style.height = "30px";
		this.passCodeText.style["float"] = "left";
		this.passCodeText.style.font = "Times New Roman";
		this.passCodeText.style.fontSize = "22px";
		this.passCodeText.style.textTransform = "uppercase";
		this.passCodeText.maxLength = 5;
		this.passCodeDiv.appendChild(this.passCodeText);
		this.passCodeButton = this.makeButton("Enter Pass Code");
		var buttonHandler2 = this.makeHandler(function() {
			_g.onEnterPassCodeClicked();
		});
		this.passCodeButton.onclick = buttonHandler2;
		this.passCodeButton.style.margin = "0 auto";
		this.passCodeButton.style.width = "299px";
		this.passCodeButton.style.height = "38px";
		this.passCodeDiv.appendChild(this.passCodeButton);
		var footer = this.document.createElement("div");
		footer.style.position = "absolute";
		footer.style.width = "100%";
		footer.style.height = "81px";
		footer.style.bottom = "0";
		footer.style.margin = "0";
		footer.style.padding = "0";
		footer.style.borderTop = "3px solid black";
		this.mainView.appendChild(footer);
		var helpDiv = this.document.createElement("div");
		helpDiv.style["float"] = "left";
		helpDiv.style.marginLeft = "12px";
		helpDiv.style.marginTop = "12px";
		footer.appendChild(helpDiv);
		var vinnie1 = this.document.createElement("img");
		vinnie1.src = "assets/art/" + vinnie_Assets.vinnieShades + ".gif";
		vinnie1.style["float"] = "left";
		vinnie1.style.margin = "0 15px 0 0";
		helpDiv.appendChild(vinnie1);
		var helpText = this.document.createElement("div");
		helpText.style.fontFamily = "\"Times New Roman\",serif";
		helpText.style.fontSize = "14.25pt";
		helpText.style.fontWeight = "400";
		helpText.style.width = "300px";
		helpText.appendChild(this.document.createTextNode("Press F1 at anytime for help and information."));
		helpText.onclick = function(_1) {
			_g.game.help();
		};
		helpDiv.appendChild(helpText);
		var versionText = this.document.createElement("div");
		versionText.appendChild(this.document.createTextNode("Web Version"));
		versionText.style.textAlign = "right";
		versionText.style.position = "absolute";
		versionText.style.right = "0px";
		versionText.style.fontFamily = "\"MS Sans Serif\",sans-serif";
		versionText.style.fontSize = "13.5pt";
		versionText.style.fontWeight = "400";
		versionText.style.fontWeight = "700";
		versionText.style.marginRight = "12px";
		versionText.style.marginTop = "12px";
		footer.appendChild(versionText);
		var hotspot = this.makeClickHotspot(13,171,39,32,$bind(this,this.onLightBulb));
		hotspot.onmouseover = function(_2) {
			_g.setCursor(vinnie_Assets.lightBulb);
		};
		hotspot.onmouseout = function(_3) {
			_g.setCursor(null);
		};
		this.lightBulbCount = 0;
		this.audio.playMusic(vinnie_Assets.musicIntro);
	}
	,end: function() {
		vinnie_Scene.prototype.end.call(this);
	}
	,onLightBulb: function() {
		var _g = this;
		this.message("It's nice to see you again Fred.  How are the wife and kids?");
		this.lightBulbCount++;
		if(this.lightBulbCount >= 6) this.audio.playSound(vinnie_Assets.completeScene).then(function() {
			_g.game.bonusScenes = true;
			_g.message("You now have access to the bonus scenes.  All you have to do is find them.");
		});
	}
	,makeButton: function(label) {
		var button = this.document.createElement("button");
		button.appendChild(this.document.createTextNode(label));
		button.style.fontSize = "13.5pt";
		button.style.fontWeight = "400";
		button.style.fontFamily = "\"MS Sans Serif\",sans-serif";
		button.style.display = "block";
		return button;
	}
	,onEnterPassCodeClicked: function() {
		var _g = this;
		if(this.passCodeText.style.display == "none") {
			this.passCodeDiv.style.width = "300px";
			this.passCodeDiv.style.height = "30px";
			this.passCodeDiv.style.border = "1px solid black";
			this.passCodeDiv.style.backgroundColor = "white";
			this.passCodeDiv.style.padding = "11px 7px";
			this.passCodeButton.style.width = "211px";
			this.passCodeButton.style.height = "30px";
			this.passCodeText.style.display = "block";
		} else {
			var passInfo;
			var key = this.passCodeText.value.toUpperCase();
			passInfo = vinnie_MainMenu.PASSCODE_GAMES.get(key);
			if(passInfo == null) this.audio.playSound(vinnie_Assets.vin22,true).then(function() {
				_g.message("INVALID PASS CODE");
			}); else this.audio.playSound(vinnie_Assets.completeScene,true).then(function() {
				var _g1 = 0;
				var _g11 = passInfo.inventory;
				while(_g1 < _g11.length) {
					var item = _g11[_g1];
					++_g1;
					_g.inventory.addItem(item);
				}
				_g.game.shadesOn = passInfo.shades;
				var scene = Type.createInstance(passInfo.scene,[_g.game]);
				scene.preload();
				_g.game.startScene(scene);
			});
		}
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadArt(vinnie_Assets.title);
		this.game.preloader.preloadArt(vinnie_Assets.vinnieShades);
		this.game.preloader.preloadArt(vinnie_Assets.lightBulb);
		this.game.preloader.preloadMusic(vinnie_Assets.musicIntro);
		this.game.preloader.preloadSound(vinnie_Assets.completeScene);
		this.game.preloader.preloadSound(vinnie_Assets.vin22);
		this.game.preloader.preloadSound(vinnie_Assets.completeScene);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicIntro);
		this.audio.registerSound(vinnie_Assets.completeScene);
		this.audio.registerSound(vinnie_Assets.vin22);
		this.audio.registerSound(vinnie_Assets.completeScene);
	}
	,__class__: vinnie_MainMenu
});
var vinnie_Preloader = function(game) {
	this.game = game;
	this.preloadedAssets = new haxe_ds_StringMap();
	this.requestQueue = [];
	this.isPreloading = false;
	this.image = new Image();
	this.audio = new Audio();
};
$hxClasses["vinnie.Preloader"] = vinnie_Preloader;
vinnie_Preloader.__name__ = ["vinnie","Preloader"];
vinnie_Preloader.prototype = {
	preloadArt: function(art) {
		this.addPreloadRequest(vinnie__$Preloader_PreloadRequest.Image("assets/art/" + art + ".gif"));
	}
	,preloadSound: function(sound) {
		this.addPreloadRequest(vinnie__$Preloader_PreloadRequest.Audio("assets/sounds/" + sound,sound));
	}
	,preloadMusic: function(sound) {
		this.addPreloadRequest(vinnie__$Preloader_PreloadRequest.Audio("assets/music/" + sound + ".mp3",sound));
	}
	,beginPreload: function() {
		if(this.curRequest == null) this.preloadNextAsset();
	}
	,addPreloadRequest: function(request) {
		var url;
		switch(request[1]) {
		case 1:
			var url1 = request[2];
			url = url1;
			break;
		case 0:
			var url2 = request[2];
			url = url2;
			break;
		}
		if(this.preloadedAssets.exists(url)) return;
		this.preloadedAssets.set(url,true);
		this.requestQueue.push(request);
		this.isPreloading = true;
	}
	,preloadNextAsset: function() {
		var _g = this;
		if(this.requestQueue.length > 0) {
			this.curRequest = this.requestQueue.pop();
			{
				var _g1 = this.curRequest;
				switch(_g1[1]) {
				case 1:
					var url = _g1[2];
					this.audio.autoplay = false;
					this.audio.oncanplaythrough = $bind(this,this.onAssetLoaded);
					this.audio.onerror = $bind(this,this.onAssetLoaded);
					this.audio.src = url;
					this.audio.load();
					break;
				case 0:
					var url1 = _g1[2];
					this.image.src = url1;
					this.image.onload = $bind(this,this.onAssetLoaded);
					this.image.onerror = $bind(this,this.onAssetLoaded);
					break;
				}
			}
		} else this.curRequest = null;
		if(this.requestQueue.length == 0 || this.curRequest == null) {
			this.isPreloading = false;
			haxe_Timer.delay(function() {
				if(!_g.isPreloading && _g.onPreloadComplete != null) _g.onPreloadComplete();
			},1);
		}
	}
	,onAssetLoaded: function(e) {
		if(this.curRequest != null) {
			var _g = this.curRequest;
			switch(_g[1]) {
			case 1:
				var id = _g[3];
				this.audio.onerror = null;
				this.audio.oncanplaythrough = null;
				break;
			case 0:
				this.image.onload = null;
				this.image.onerror = null;
				break;
			}
		}
		this.preloadNextAsset();
	}
	,__class__: vinnie_Preloader
};
var vinnie__$Preloader_PreloadRequest = { __ename__ : true, __constructs__ : ["Image","Audio"] };
vinnie__$Preloader_PreloadRequest.Image = function(url) { var $x = ["Image",0,url]; $x.__enum__ = vinnie__$Preloader_PreloadRequest; $x.toString = $estr; return $x; };
vinnie__$Preloader_PreloadRequest.Audio = function(url,id) { var $x = ["Audio",1,url,id]; $x.__enum__ = vinnie__$Preloader_PreloadRequest; $x.toString = $estr; return $x; };
var vinnie_Scene1 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 398;
	this.height = 199;
	this.title = "Scene One";
};
$hxClasses["vinnie.Scene1"] = vinnie_Scene1;
vinnie_Scene1.__name__ = ["vinnie","Scene1"];
vinnie_Scene1.__super__ = vinnie_Scene;
vinnie_Scene1.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		var _g = this;
		vinnie_Scene.prototype.start.call(this);
		this.audio.playMusic(vinnie_Assets.musicScene1);
		this.makeArt(vinnie_Assets.bgScene1,0,0);
		this.makeHoverHotspot(376,144,25,57,$bind(this,this.cancelDrag));
		this.makeHoverHotspot(312,176,57,17,$bind(this,this.cancelDrag));
		var sadEthel = this.makeArt(vinnie_Assets.sadEthel,339,144,function() {
			_g.message("That's Sad Ethel, the sea beastie from Edmonton.");
		});
		this.makeVinnie(344,64);
		this.makeItem(vinnie_InventoryItemType.Magnet,56,40);
		this.makeClickHotspot(147,47,64,38,(function(f,a1) {
			return function() {
				f(a1);
			};
		})($bind(this,this.message),"No one is quite sure if this is real grass."));
		this.makeArt(vinnie_Assets.exitLeft,8,168,function() {
			_g.nextScene(vinnie_Scene2);
		});
		this.audio.playSound(vinnie_Assets.narIntro);
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene1);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene1);
		this.game.preloader.preloadArt(vinnie_Assets.sadEthel);
		this.game.preloader.preloadArt(vinnie_Assets.exitLeft);
		this.game.preloader.preloadSound(vinnie_Assets.narIntro);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene1);
		this.audio.registerSound(vinnie_Assets.narIntro);
	}
	,__class__: vinnie_Scene1
});
var vinnie_Scene10 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 401;
	this.height = 216;
	this.title = "Scene Ten";
};
$hxClasses["vinnie.Scene10"] = vinnie_Scene10;
vinnie_Scene10.__name__ = ["vinnie","Scene10"];
vinnie_Scene10.__super__ = vinnie_Scene;
vinnie_Scene10.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		var _g = this;
		vinnie_Scene.prototype.start.call(this);
		this.allowDragging = false;
		this.audio.playMusic(vinnie_Assets.musicScene3);
		this.bg = this.makeArt(vinnie_Assets.bgScene10,0,0);
		this.makeHoverHotspot(8,24,201,177,$bind(this,this.onBeastHover));
		this.makeHoverHotspot(0,0,401,145,$bind(this,this.cancelDrag));
		this.cd = this.makeItem(vinnie_InventoryItemType.CD,200,168);
		this.cd.style.display = "none";
		this.vinnieLine = this.makeArt(vinnie_Assets.scene10Line2,295,145);
		this.vinnieDialog = this.makeDialogBox(256,80,161,65,"black","white");
		this.vinnieDialog.style.fontWeight = "normal";
		this.beastLine = this.makeArt(vinnie_Assets.scene10Line1,151,72);
		this.beastDialog = this.makeDialogBox(168,8,225,65,"black","white");
		this.beastDialog.style.fontWeight = "normal";
		this.makeVinnie(312,160);
		var beastSpeak = function(sound,dialog) {
			_g.vinnieLine.style.display = _g.vinnieDialog.style.display = "none";
			_g.beastLine.style.display = _g.beastDialog.style.display = "block";
			_g.beastDialog.textContent = dialog;
			if(sound != null) _g.audio.playSound(sound,false);
		};
		var vinnieSpeak = function(sound1,dialog1) {
			_g.vinnieLine.style.display = _g.vinnieDialog.style.display = "block";
			_g.beastLine.style.display = _g.beastDialog.style.display = "none";
			_g.vinnieDialog.textContent = dialog1;
			_g.audio.playSound(sound1,false);
		};
		beastSpeak(null,"Zzzzzzzzzzzzzzzz");
		this.exit = this.makeArt(vinnie_Assets.exitLeft,1,154,$bind(this,this.onExitClicked));
		this.exit.style.display = "none";
		this.dialog([function() {
		},(function(f,a1,a2) {
			return function() {
				f(a1,a2);
			};
		})(vinnieSpeak,vinnie_Assets.vin32,"Excuse me?  Are you sleeping?"),function() {
			beastSpeak(vinnie_Assets.sing1,"I’m awake now, thanks to you.");
			_g.bg.src = "assets/art/" + vinnie_Assets.bgScene10Awake + ".gif";
		},(function(f1,a11,a21) {
			return function() {
				f1(a11,a21);
			};
		})(vinnieSpeak,vinnie_Assets.vin33,"You look very tired."),(function(f2,a12,a22) {
			return function() {
				f2(a12,a22);
			};
		})(beastSpeak,vinnie_Assets.sing2,"What do you expect?  I’ve been singing and dancing all night long."),(function(f3,a13,a23) {
			return function() {
				f3(a13,a23);
			};
		})(vinnieSpeak,vinnie_Assets.vin34,"Are you the monster that keeps everyone awake at night?"),(function(f4,a14,a24) {
			return function() {
				f4(a14,a24);
			};
		})(beastSpeak,vinnie_Assets.sing3,"Yes.  What are you going to do about it?"),(function(f5,a15,a25) {
			return function() {
				f5(a15,a25);
			};
		})(vinnieSpeak,vinnie_Assets.vin35,"It’s very rude of you to keep everyone in Fun Land up at night."),(function(f6,a16,a26) {
			return function() {
				f6(a16,a26);
			};
		})(beastSpeak,vinnie_Assets.sing4,"I don’t care.  It’s my nature to sing, dance and tell jokes at night."),(function(f7,a17,a27) {
			return function() {
				f7(a17,a27);
			};
		})(vinnieSpeak,vinnie_Assets.vin36,"Why?"),(function(f8,a18,a28) {
			return function() {
				f8(a18,a28);
			};
		})(beastSpeak,vinnie_Assets.sing5,"Why do you think?  I’m a nocturnal kind of beast."),(function(f9,a19,a29) {
			return function() {
				f9(a19,a29);
			};
		})(vinnieSpeak,vinnie_Assets.vin22,"Do you know anything about Vinnie's Tomb?"),(function(f10,a110,a210) {
			return function() {
				f10(a110,a210);
			};
		})(beastSpeak,vinnie_Assets.sing6,"Sure.  I wrote a song about it.  Do you want to hear it?"),(function(f11,a111,a211) {
			return function() {
				f11(a111,a211);
			};
		})(vinnieSpeak,vinnie_Assets.vin37,"I guess so."),(function(f12,a112,a212) {
			return function() {
				f12(a112,a212);
			};
		})(beastSpeak,vinnie_Assets.sing7,"Then leave me alone, and come back tonight.  I’ll sing it for you then."),(function(f13,a113,a213) {
			return function() {
				f13(a113,a213);
			};
		})(vinnieSpeak,vinnie_Assets.vin38,"I want to hear it now."),function() {
			beastSpeak(vinnie_Assets.sing8,"Listen, you little punk.  I’ve had about enough of you!  Wait a minute.  I’ll give you a CD of the song.  You can hear it anytime.");
			_g.cd.style.display = "block";
		},(function(f14,a114,a214) {
			return function() {
				f14(a114,a214);
			};
		})(vinnieSpeak,vinnie_Assets.vin40,"Thanks, but I don’t have a CD player."),(function(f15,a115,a215) {
			return function() {
				f15(a115,a215);
			};
		})(beastSpeak,vinnie_Assets.sing9,"That's tough.  Go away."),function() {
			_g.vinnieLine.style.display = _g.vinnieDialog.style.display = "none";
			_g.beastLine.style.display = _g.beastDialog.style.display = "none";
			_g.exit.style.display = "block";
			_g.allowDragging = true;
			_g.inventory.show();
		}]);
	}
	,onBeastHover: function() {
		var _g = this;
		if(this.isEquipped(vinnie_InventoryItemType.Sword)) {
			this.audio.playSound(vinnie_Assets.sing11,false);
			this.message("Please don't hurt me.  I'll stop singing at night, if you leave me alone.");
			this.transitionToNextScene(vinnie_Scene11,function() {
				_g.inventory.show();
				_g.inventory.addItem(vinnie_InventoryItemType.Underwear);
				_g.inventory.addItem(vinnie_InventoryItemType.Cheese);
				_g.audio.playSound(vinnie_Assets.nar3,false);
				_g.message("Word quickly spreads that you have stopped the beast from singing at night.  After everyone in Fun Land has a good night's sleep, they give you a load of cash and a nicely written thank you note.  You decide to use the money to buy the key from the ill conceived horse.  On the way to the horse's newly constructed hay shack and rib joint  you meet a frog on welfare.  Still feeling like a philanthropist, you foolishly give the frog most of our money.  Fortunately, you still have enough to buy a pair of underwear and cheese.");
				_g.inventory.addItem(vinnie_InventoryItemType.Money);
				_g.audio.playSound(vinnie_Assets.nar4,false);
				_g.message("You decide to buy a lottery ticket with your last dollar.  Fun Land is a peachy place.  You find that the creatures there are really kind and decent.  You meet a monster snail who lets you stay at his hotel free of charge.  In the morning you are informed that the singing beast has moved to Australia.  He will be performing at the opera house one month a week.  You're glad he made out okay.  You are delighted when you win five hundred dollars in the lottery.  You rush to find the horse and buy the key.");
			});
		} else if(this.equippedItem != null) {
			this.audio.playSound(vinnie_Assets.sing10,false);
			this.message("I don't want that.  Get lost!");
		}
	}
	,onExitClicked: function() {
		this.nextScene(vinnie_Scene12);
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene3);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene10);
		this.game.preloader.preloadArt(vinnie_Assets.scene10Line2);
		this.game.preloader.preloadArt(vinnie_Assets.scene10Line1);
		this.game.preloader.preloadArt(vinnie_Assets.exitLeft);
		this.game.preloader.preloadSound(vinnie_Assets.vin32);
		this.game.preloader.preloadSound(vinnie_Assets.sing1);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene10Awake);
		this.game.preloader.preloadSound(vinnie_Assets.vin33);
		this.game.preloader.preloadSound(vinnie_Assets.sing2);
		this.game.preloader.preloadSound(vinnie_Assets.vin34);
		this.game.preloader.preloadSound(vinnie_Assets.sing3);
		this.game.preloader.preloadSound(vinnie_Assets.vin35);
		this.game.preloader.preloadSound(vinnie_Assets.sing4);
		this.game.preloader.preloadSound(vinnie_Assets.vin36);
		this.game.preloader.preloadSound(vinnie_Assets.sing5);
		this.game.preloader.preloadSound(vinnie_Assets.vin22);
		this.game.preloader.preloadSound(vinnie_Assets.sing6);
		this.game.preloader.preloadSound(vinnie_Assets.vin37);
		this.game.preloader.preloadSound(vinnie_Assets.sing7);
		this.game.preloader.preloadSound(vinnie_Assets.vin38);
		this.game.preloader.preloadSound(vinnie_Assets.sing8);
		this.game.preloader.preloadSound(vinnie_Assets.vin40);
		this.game.preloader.preloadSound(vinnie_Assets.sing9);
		this.game.preloader.preloadSound(vinnie_Assets.sing11);
		this.game.preloader.preloadSound(vinnie_Assets.nar3);
		this.game.preloader.preloadSound(vinnie_Assets.nar4);
		this.game.preloader.preloadSound(vinnie_Assets.sing10);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene3);
		this.audio.registerSound(vinnie_Assets.vin32);
		this.audio.registerSound(vinnie_Assets.sing1);
		this.audio.registerSound(vinnie_Assets.vin33);
		this.audio.registerSound(vinnie_Assets.sing2);
		this.audio.registerSound(vinnie_Assets.vin34);
		this.audio.registerSound(vinnie_Assets.sing3);
		this.audio.registerSound(vinnie_Assets.vin35);
		this.audio.registerSound(vinnie_Assets.sing4);
		this.audio.registerSound(vinnie_Assets.vin36);
		this.audio.registerSound(vinnie_Assets.sing5);
		this.audio.registerSound(vinnie_Assets.vin22);
		this.audio.registerSound(vinnie_Assets.sing6);
		this.audio.registerSound(vinnie_Assets.vin37);
		this.audio.registerSound(vinnie_Assets.sing7);
		this.audio.registerSound(vinnie_Assets.vin38);
		this.audio.registerSound(vinnie_Assets.sing8);
		this.audio.registerSound(vinnie_Assets.vin40);
		this.audio.registerSound(vinnie_Assets.sing9);
		this.audio.registerSound(vinnie_Assets.sing11);
		this.audio.registerSound(vinnie_Assets.nar3);
		this.audio.registerSound(vinnie_Assets.nar4);
		this.audio.registerSound(vinnie_Assets.sing10);
	}
	,__class__: vinnie_Scene10
});
var vinnie_Scene11 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 401;
	this.height = 200;
	this.title = "Scene Eleven";
};
$hxClasses["vinnie.Scene11"] = vinnie_Scene11;
vinnie_Scene11.__name__ = ["vinnie","Scene11"];
vinnie_Scene11.__super__ = vinnie_Scene;
vinnie_Scene11.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		vinnie_Scene.prototype.start.call(this);
		this.audio.playMusic(vinnie_Assets.musicScene1);
		this.makeArt(vinnie_Assets.bgScene9Visible,0,0);
		this.makeHoverHotspot(0,0,401,153,$bind(this,this.cancelDrag));
		this.makeClickHotspot(8,32,193,169,$bind(this,this.onHorseClicked));
		this.makeItem(vinnie_InventoryItemType.Key,200,168,false,$bind(this,this.onKeyClicked));
		this.makeVinnie(320,152);
		this.inventory.show();
	}
	,onHorseClicked: function() {
		var _g = this;
		if(this.isEquipped(vinnie_InventoryItemType.Money)) this.audio.playSound(vinnie_Assets.getItem,true).then(function() {
			_g.equipItem(null);
			_g.inventory.removeItem(vinnie_InventoryItemType.Money);
			_g.inventory.addItem(vinnie_InventoryItemType.Key);
			_g.message("You buy the key from the horse.  You now have the key to Vinnie's Tomb!");
			var passCode;
			if(_g.game.shadesOn) {
				if(_g.inventory.hasItem(vinnie_InventoryItemType.EightBall)) passCode = "METTA"; else passCode = "SETTA";
			} else if(_g.inventory.hasItem(vinnie_InventoryItemType.EightBall)) passCode = "RETTA"; else passCode = "NETTA";
			_g.nextScene(vinnie_Scene12,passCode);
		}); else {
			if(this.isDraggingVinnie || this.equippedItem != null) this.message("The horse wants something else for the key.");
			if(this.isEquipped(vinnie_InventoryItemType.Sword)) this.message("You really must stop threatning creatures with your sword.");
		}
	}
	,onKeyClicked: function() {
		this.message("You cannot take the key.  The horse would get mad.");
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene1);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene9Visible);
		this.game.preloader.preloadSound(vinnie_Assets.getItem);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene1);
		this.audio.registerSound(vinnie_Assets.getItem);
	}
	,__class__: vinnie_Scene11
});
var vinnie_Scene13 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 435;
	this.height = 254;
	this.title = "Scene Thirteen";
};
$hxClasses["vinnie.Scene13"] = vinnie_Scene13;
vinnie_Scene13.__name__ = ["vinnie","Scene13"];
vinnie_Scene13.__super__ = vinnie_Scene;
vinnie_Scene13.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		vinnie_Scene.prototype.start.call(this);
		this.madeSlingshot = false;
		this.audio.playMusic(vinnie_Assets.musicScene7);
		this.makeArt(vinnie_Assets.bgScene13,0,0);
		this.makeClickHotspot(0,0,93,69,$bind(this,this.onSphereClicked));
		this.makeClickHotspot(146,204,103,49,$bind(this,this.onGapClicked));
		this.makeClickHotspot(317,231,50,24,(function(f,a1) {
			return function() {
				f(a1);
			};
		})($bind(this,this.message),"Join the vinnie's Tomb fan club."));
		this.makeHoverHotspot(0,0,433,193,$bind(this,this.onFellInChasm));
		this.makeArt(vinnie_Assets.book,368,208,$bind(this,this.onBookClicked));
		this.slingshot = this.makeArt(vinnie_Assets.twig,256,192,$bind(this,this.onSlingshotClicked));
		this.sphere = this.makeArt(vinnie_Assets.sphereOfLight,12,0);
		this.makeVinnie(296,184);
		this.exit = this.makeArt(vinnie_Assets.exitRight,392,16,$bind(this,this.onExitClicked));
		this.exit.style.display = "none";
		this.inventory.show();
	}
	,onBookClicked: function() {
		if(this.isDraggingVinnie) {
			this.cancelDrag();
			this.message("To cross the pit use the sphere of light.  It rests on the other side.  You must wake it if you can.  Then you can get a ride.");
		}
	}
	,onSphereClicked: function() {
		if(this.isEquipped(vinnie_InventoryItemType.EightBall)) this.message("The chasm is too wide.  You cannot throw the eight ball that far.");
	}
	,onFellInChasm: function() {
		var _g = this;
		if(this.isDraggingVinnie) {
			this.cancelDrag();
			this.vinnie.style.display = "none";
			this.vinnieDied();
			this.message("You fall into the pit of fear and die!");
			this.document.onclick = function(_) {
				_g.exitGame();
			};
		}
	}
	,onGapClicked: function() {
		if(this.game.bonusScenes) this.bonusScene(2); else this.cancelDrag();
	}
	,onSlingshotClicked: function() {
		if(!this.madeSlingshot) {
			if(this.isEquipped(vinnie_InventoryItemType.Underwear)) {
				this.message("You stretch the underwear over the forked stick in the ground.  Now you have a neato slingshot device.  Wow, this is a cool game!");
				this.slingshot.src = "assets/art/" + vinnie_Assets.slingshot + ".gif";
				this.inventory.removeItem(vinnie_InventoryItemType.Underwear);
				this.equipItem(null);
				this.madeSlingshot = true;
			}
		} else if(this.isEquipped(vinnie_InventoryItemType.EightBall)) {
			this.inventory.removeItem(vinnie_InventoryItemType.EightBall);
			this.equipItem(null);
			this.crossPitOfFear();
		} else this.message("You can't do that with the forked stick.");
	}
	,crossPitOfFear: function() {
		var _g1 = this;
		this.audio.playSound(vinnie_Assets.sphereZap,false);
		this.allowDragging = false;
		this.vinnie.style.left = "296px";
		this.vinnie.style.top = "184px";
		var ball = this.makeArt(vinnie_Assets.eightBall,256,176);
		this.animate(ball,0.4,(function($this) {
			var $r;
			var _g = new haxe_ds_StringMap();
			if(__map_reserved.left != null) _g.setReserved("left",39); else _g.h["left"] = 39;
			if(__map_reserved.top != null) _g.setReserved("top",27); else _g.h["top"] = 27;
			$r = _g;
			return $r;
		}(this)),function() {
			ball.parentNode.removeChild(ball);
			ball = null;
			_g1.animate(_g1.sphere,0.2,(function($this) {
				var $r;
				var _g2 = new haxe_ds_StringMap();
				if(__map_reserved.left != null) _g2.setReserved("left",39); else _g2.h["left"] = 39;
				if(__map_reserved.top != null) _g2.setReserved("top",27); else _g2.h["top"] = 27;
				$r = _g2;
				return $r;
			}(this)),(function(f,a1,a2,a3,a4) {
				return function() {
					f(a1,a2,a3,a4);
				};
			})($bind(_g1,_g1.animate),_g1.sphere,0.2,(function($this) {
				var $r;
				var _g3 = new haxe_ds_StringMap();
				if(__map_reserved.left != null) _g3.setReserved("left",62); else _g3.h["left"] = 62;
				if(__map_reserved.top != null) _g3.setReserved("top",144); else _g3.h["top"] = 144;
				$r = _g3;
				return $r;
			}(this)),(function(f1,a11,a21,a31,a41) {
				return function() {
					f1(a11,a21,a31,a41);
				};
			})($bind(_g1,_g1.animate),_g1.sphere,0.2,(function($this) {
				var $r;
				var _g4 = new haxe_ds_StringMap();
				if(__map_reserved.left != null) _g4.setReserved("left",55); else _g4.h["left"] = 55;
				if(__map_reserved.top != null) _g4.setReserved("top",27); else _g4.h["top"] = 27;
				$r = _g4;
				return $r;
			}(this)),(function(f2,a12,a22,a32,a42) {
				return function() {
					f2(a12,a22,a32,a42);
				};
			})($bind(_g1,_g1.animate),_g1.sphere,0.2,(function($this) {
				var $r;
				var _g5 = new haxe_ds_StringMap();
				if(__map_reserved.left != null) _g5.setReserved("left",270); else _g5.h["left"] = 270;
				if(__map_reserved.top != null) _g5.setReserved("top",150); else _g5.h["top"] = 150;
				$r = _g5;
				return $r;
			}(this)),(function(f3,a13,a23,a33,a43) {
				return function() {
					f3(a13,a23,a33,a43);
				};
			})($bind(_g1,_g1.animate),_g1.sphere,0.8,(function($this) {
				var $r;
				var _g6 = new haxe_ds_StringMap();
				if(__map_reserved.left != null) _g6.setReserved("left",270); else _g6.h["left"] = 270;
				if(__map_reserved.top != null) _g6.setReserved("top",150); else _g6.h["top"] = 150;
				$r = _g6;
				return $r;
			}(this)),$bind(_g1,_g1.pickUpVinnie))))));
		});
	}
	,pickUpVinnie: function() {
		if(!this.game.shadesOn) {
			this.message("The Ball of light blinds you.  Your eyes burn up and you stagger into the pit of fear and die horribly.");
			this.vinnieDied();
			this.vinnie.style.display = "none";
			this.exitGame();
		} else {
			this.vinnie.style.display = "none";
			this.audio.playSound(vinnie_Assets.sphereZap,false);
			this.animate(this.sphere,0.2,(function($this) {
				var $r;
				var _g = new haxe_ds_StringMap();
				if(__map_reserved.left != null) _g.setReserved("left",345); else _g.h["left"] = 345;
				if(__map_reserved.top != null) _g.setReserved("top",0); else _g.h["top"] = 0;
				$r = _g;
				return $r;
			}(this)),$bind(this,this.onPitOfFearCrossed));
		}
	}
	,onPitOfFearCrossed: function() {
		this.vinnie.style.left = "360px";
		this.vinnie.style.top = "16px";
		this.vinnie.style.display = "block";
		this.exit.style.display = "block";
	}
	,onExitClicked: function() {
		this.message("You have crossed the pit of fear!");
		this.nextScene(vinnie_Scene14);
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene7);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene13);
		this.game.preloader.preloadArt(vinnie_Assets.book);
		this.game.preloader.preloadArt(vinnie_Assets.twig);
		this.game.preloader.preloadArt(vinnie_Assets.sphereOfLight);
		this.game.preloader.preloadArt(vinnie_Assets.exitRight);
		this.game.preloader.preloadArt(vinnie_Assets.slingshot);
		this.game.preloader.preloadSound(vinnie_Assets.sphereZap);
		this.game.preloader.preloadArt(vinnie_Assets.eightBall);
		this.game.preloader.preloadSound(vinnie_Assets.sphereZap);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene7);
		this.audio.registerSound(vinnie_Assets.sphereZap);
		this.audio.registerSound(vinnie_Assets.sphereZap);
	}
	,__class__: vinnie_Scene13
});
var vinnie_Scene14 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 399;
	this.height = 219;
	this.title = "Scene Fourteen";
	this.allowDragging = false;
};
$hxClasses["vinnie.Scene14"] = vinnie_Scene14;
vinnie_Scene14.__name__ = ["vinnie","Scene14"];
vinnie_Scene14.__super__ = vinnie_Scene;
vinnie_Scene14.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		var _g = this;
		vinnie_Scene.prototype.start.call(this);
		this.smacks = 0;
		this.audio.playMusic(vinnie_Assets.musicScene8);
		this.makeArt(vinnie_Assets.bgScene14,0,0);
		this.makeClickHotspot(12,99,132,94,(function(f,a1) {
			return function() {
				f(a1);
			};
		})($bind(this,this.message),"1"));
		this.makeClickHotspot(301,135,39,33,(function(f1,a11) {
			return function() {
				f1(a11);
			};
		})($bind(this,this.message),"2"));
		this.tombDoor = this.makeRect(0,100,151,93,"#808000");
		this.rockCover = this.makeArt(vinnie_Assets.bloodRockCover,277,132);
		this.makeClickHotspot(269,123,102,61,$bind(this,this.onBloodRockClicked));
		this.vinnieDialog = this.makeDialogBox(62,84,224,61,"black","white");
		this.vinnieLine = this.makeArt(vinnie_Assets.scene14Line2,230,145);
		this.eyeDialog = this.makeDialogBox(17,81,262,60,"black","white");
		this.eyeLine = this.makeArt(vinnie_Assets.scene14Line1,82,141);
		this.makeVinnie(271,162);
		this.eye = this.makeArt(vinnie_Assets.eyeGuy,112,167);
		var vinnieSpeak = function(sound,dialog) {
			_g.eye.style.display = "block";
			_g.eyeDialog.style.display = _g.eyeLine.style.display = "none";
			_g.vinnieDialog.style.display = _g.vinnieLine.style.display = "block";
			_g.vinnieDialog.textContent = dialog;
			_g.audio.playSound(sound,false);
		};
		var eyeSpeak = function(sound1,dialog1) {
			_g.eye.style.display = "block";
			_g.eyeDialog.style.display = _g.eyeLine.style.display = "block";
			_g.vinnieDialog.style.display = _g.vinnieLine.style.display = "none";
			_g.eyeDialog.textContent = dialog1;
			_g.audio.playSound(sound1,false);
		};
		this.dialog([(function(f2,a12,a2) {
			return function() {
				f2(a12,a2);
			};
		})(vinnieSpeak,vinnie_Assets.vin41,"Hello, is this the entrance to Vinnie's Tomb?"),(function(f3,a13,a21) {
			return function() {
				f3(a13,a21);
			};
		})(eyeSpeak,vinnie_Assets.eye1,"Allegedly, yes.  No one knows how to get in.  There are no doorways."),(function(f4,a14,a22) {
			return function() {
				f4(a14,a22);
			};
		})(vinnieSpeak,vinnie_Assets.vin42,"The entrance must be a secret."),(function(f5,a15,a23) {
			return function() {
				f5(a15,a23);
			};
		})(eyeSpeak,vinnie_Assets.eye2,"I guess so."),(function(f6,a16,a24) {
			return function() {
				f6(a16,a24);
			};
		})(vinnieSpeak,vinnie_Assets.vin44,"What's this gray thing I'm standing in front of?  It's shaped a bit like a tombstone."),(function(f7,a17,a25) {
			return function() {
				f7(a17,a25);
			};
		})(eyeSpeak,vinnie_Assets.eye3,"That is also a mystery.  It is known as the big blood rock.  Don’t ask me why.  I have to go now.  It's time to watch the PBS pledge break.  It’s nice meeting you."),function() {
			_g.eye.style.display = "none";
			_g.eyeDialog.style.display = _g.eyeLine.style.display = "none";
			_g.vinnieDialog.style.display = _g.vinnieLine.style.display = "none";
			_g.inventory.show();
		}]);
	}
	,onBloodRockClicked: function() {
		if(this.rockCover != null) {
			if(this.equippedItem != null && this.equippedItem.type == vinnie_InventoryItemType.SkullThatOozesBloodIntermittently) {
				this.setCursor(vinnie_Assets.bloodySkull);
				var rockY = this.rockCover.offsetTop;
				rockY += 5;
				this.rockCover.style.top = "" + rockY + "px";
				this.smacks++;
				if(this.smacks >= 6) {
					this.equipItem(null);
					this.inventory.removeItem(vinnie_InventoryItemType.SkullThatOozesBloodIntermittently);
					this.audio.playSound(vinnie_Assets.eureka,false);
					this.rockCover.parentNode.removeChild(this.rockCover);
					this.rockCover = null;
					this.message("You crush the skull that oozes blood against the big blood rock.  The big blood rock opens!");
				}
			}
		} else if(this.equippedItem != null && this.equippedItem.type == vinnie_InventoryItemType.Diamond) {
			this.equipItem(null);
			this.inventory.removeItem(vinnie_InventoryItemType.Diamond);
			this.diamond = this.makeArt(vinnie_Assets.diamond,301,135);
			this.animate(this.tombDoor,3.0,(function($this) {
				var $r;
				var _g = new haxe_ds_StringMap();
				if(__map_reserved.height != null) _g.setReserved("height",0); else _g.h["height"] = 0;
				$r = _g;
				return $r;
			}(this)),$bind(this,this.onDoorOpened));
		}
	}
	,onDoorOpened: function() {
		var _g = this;
		this.tombDoor.style.display = "none";
		this.audio.playSound(vinnie_Assets.getItem,true).then(function() {
			_g.message("You have opened the main door to Vinnie's Tomb");
			_g.message("The glittery diamond has melted into the big blood rock.");
			if(_g.diamond != null) _g.diamond.style.display = "none";
			_g.message("You have completed " + _g.title);
			_g.game.startScene(new vinnie_Scene15(_g.game));
		});
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene8);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene14);
		this.game.preloader.preloadArt(vinnie_Assets.bloodRockCover);
		this.game.preloader.preloadArt(vinnie_Assets.scene14Line2);
		this.game.preloader.preloadArt(vinnie_Assets.scene14Line1);
		this.game.preloader.preloadArt(vinnie_Assets.eyeGuy);
		this.game.preloader.preloadSound(vinnie_Assets.vin41);
		this.game.preloader.preloadSound(vinnie_Assets.eye1);
		this.game.preloader.preloadSound(vinnie_Assets.vin42);
		this.game.preloader.preloadSound(vinnie_Assets.eye2);
		this.game.preloader.preloadSound(vinnie_Assets.vin44);
		this.game.preloader.preloadSound(vinnie_Assets.eye3);
		this.game.preloader.preloadArt(vinnie_Assets.bloodySkull);
		this.game.preloader.preloadSound(vinnie_Assets.eureka);
		this.game.preloader.preloadArt(vinnie_Assets.diamond);
		this.game.preloader.preloadSound(vinnie_Assets.getItem);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene8);
		this.audio.registerSound(vinnie_Assets.vin41);
		this.audio.registerSound(vinnie_Assets.eye1);
		this.audio.registerSound(vinnie_Assets.vin42);
		this.audio.registerSound(vinnie_Assets.eye2);
		this.audio.registerSound(vinnie_Assets.vin44);
		this.audio.registerSound(vinnie_Assets.eye3);
		this.audio.registerSound(vinnie_Assets.eureka);
		this.audio.registerSound(vinnie_Assets.getItem);
	}
	,__class__: vinnie_Scene14
});
var vinnie_Scene15 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 443;
	this.height = 249;
	this.title = "Scene Fifteen";
	this.allowDragging = false;
};
$hxClasses["vinnie.Scene15"] = vinnie_Scene15;
vinnie_Scene15.__name__ = ["vinnie","Scene15"];
vinnie_Scene15.__super__ = vinnie_Scene;
vinnie_Scene15.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		vinnie_Scene.prototype.start.call(this);
		this.audio.playMusic(vinnie_Assets.musicScene9);
		this.makeArt(vinnie_Assets.bgScene15,0,0);
		this.makeClickHotspot(11,55,45,22,(function(f,a1) {
			return function() {
				f(a1);
			};
		})($bind(this,this.message),"Do not fear.  The game is almost over."));
		this.makeClickHotspot(192,168,33,33,$bind(this,this.onKeyHoleClicked));
		this.makeVinnie(114,168);
		this.inventory.show();
	}
	,onKeyHoleClicked: function() {
		if(this.isEquipped(vinnie_InventoryItemType.Key)) {
			this.message("You try inserting the key into the keyhole.  The key does not seem to fit!  After a few more futile attempts, you realize that the horse may have tricked you.  Perhaps, the snake brothers owned the only key to Vinnie's Tomb.  You get so mad, that you kick the door.  It creaks open.  It must have been unlocked all the time.");
			this.nextScene(vinnie_Scene16);
		} else this.message("Have you had a complete breakfast today?");
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene9);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene15);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene9);
	}
	,__class__: vinnie_Scene15
});
var vinnie_Scene16 = function(game) {
	this.count = 0;
	vinnie_Scene.call(this,game);
	this.width = 395;
	this.height = 196;
	this.title = "Scene16";
	this.allowDragging = false;
};
$hxClasses["vinnie.Scene16"] = vinnie_Scene16;
vinnie_Scene16.__name__ = ["vinnie","Scene16"];
vinnie_Scene16.__super__ = vinnie_Scene;
vinnie_Scene16.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		vinnie_Scene.prototype.start.call(this);
		this.count = 0;
		this.audio.playMusic(vinnie_Assets.musicScene1);
		this.makeArt(vinnie_Assets.bgScene16,0,0);
		this.panel = this.makeRect(56,72,283,123,"#c0c0c0");
		this.panel.style.border = "3px outset white";
		var innerPanel = this.makeRect(3,3,271,111,"#c0c0c0");
		innerPanel.style.border = "3px outset white";
		this.panel.appendChild(innerPanel);
		var initX = 13;
		var initY = 13;
		var _g = 0;
		while(_g < 8) {
			var x = _g++;
			var _g1 = 0;
			while(_g1 < 3) {
				var y = _g1++;
				var isOdd = (x + y & 1) != 0;
				var xPos = initX + x * 32;
				var yPos = initY + y * 32;
				var obj = this.makeArt(isOdd?vinnie_Assets.cheese:vinnie_Assets.banana,xPos,yPos);
				this.panel.appendChild(obj);
				if(y == 1 && (x == 0 || x == 7)) {
					obj.style.display = "none";
					this.panel.appendChild(this.makeHoverHotspot(xPos,yPos,32,32,(function(f,a1,a2) {
						return function() {
							f(a1,a2);
						};
					})($bind(this,this.onSlotHover),obj,x == 0?vinnie_InventoryItemType.Cheese:vinnie_InventoryItemType.Banana)));
				}
			}
		}
		this.makeVinnie(352,160);
		this.inventory.show();
	}
	,onSlotHover: function(obj,item) {
		var _g1 = this;
		if(this.isEquipped(item)) {
			obj.style.display = "block";
			this.inventory.removeItem(item);
			this.equipItem(null);
			this.count++;
			if(this.count >= 2) this.animate(this.panel,0.6,(function($this) {
				var $r;
				var _g = new haxe_ds_StringMap();
				if(__map_reserved.top != null) _g.setReserved("top",0); else _g.h["top"] = 0;
				if(__map_reserved.height != null) _g.setReserved("height",195); else _g.h["height"] = 195;
				$r = _g;
				return $r;
			}(this)),function() {
				_g1.audio.playSound(vinnie_Assets.completeScene,true).then(function() {
					_g1.panel.style.height = "123px";
					_g1.message("You have complete Scene Sixteen");
					_g1.game.startScene(new vinnie_Scene17(_g1.game));
				});
			});
		}
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene1);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene16);
		this.game.preloader.preloadArt(vinnie_Assets.cheese);
		this.game.preloader.preloadArt(vinnie_Assets.banana);
		this.game.preloader.preloadSound(vinnie_Assets.completeScene);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene1);
		this.audio.registerSound(vinnie_Assets.completeScene);
	}
	,__class__: vinnie_Scene16
});
var vinnie_Scene17 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 400;
	this.height = 200;
	this.title = "Scene 17";
	this.allowDragging = false;
};
$hxClasses["vinnie.Scene17"] = vinnie_Scene17;
vinnie_Scene17.__name__ = ["vinnie","Scene17"];
vinnie_Scene17.__super__ = vinnie_Scene;
vinnie_Scene17.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		vinnie_Scene.prototype.start.call(this);
		this.audio.playMusic(vinnie_Assets.musicScene2);
		this.makeArt(vinnie_Assets.bgScene17,0,0);
		this.door = this.makeArt(vinnie_Assets.scene17door,152,128);
		this.makeVinnie(272,168);
		this.makeHoverHotspot(304,168,41,33,$bind(this,this.onBeamHover));
		this.inventory.show();
	}
	,onBeamHover: function() {
		var _g = this;
		if(!this.isEquipped(vinnie_InventoryItemType.CD)) this.message("You look at the strange beam of light."); else {
			this.equipItem(null);
			this.audio.playSound(vinnie_Assets.eureka,true).then(function() {
				_g.makeArt(vinnie_Assets.cdBeam,198,78);
				_g.message("You use the CD to reflect the beam of light.  It might not work in real life, but this is only a stupid game.");
				_g.audio.playSound(vinnie_Assets.completeScene,true).then(function() {
					_g.door.style.display = "none";
					_g.message("The door opens and you have completed Scene Seventeen.");
					_g.transitionToNextScene(vinnie_Scene18,function() {
						_g.audio.playSound(vinnie_Assets.death,false);
						_g.message("You walk into the next room of the massive tomb.  Suddenly you are attacked by a giant Dragollater!  He snatches you in his teeth.  You will most likely die!");
					});
				});
			});
		}
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene2);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene17);
		this.game.preloader.preloadArt(vinnie_Assets.scene17door);
		this.game.preloader.preloadSound(vinnie_Assets.eureka);
		this.game.preloader.preloadArt(vinnie_Assets.cdBeam);
		this.game.preloader.preloadSound(vinnie_Assets.completeScene);
		this.game.preloader.preloadSound(vinnie_Assets.death);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene2);
		this.audio.registerSound(vinnie_Assets.eureka);
		this.audio.registerSound(vinnie_Assets.completeScene);
		this.audio.registerSound(vinnie_Assets.death);
	}
	,__class__: vinnie_Scene17
});
var vinnie_Scene18 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 399;
	this.height = 187;
	this.title = "Scene 18";
	this.allowDragging = false;
};
$hxClasses["vinnie.Scene18"] = vinnie_Scene18;
vinnie_Scene18.__name__ = ["vinnie","Scene18"];
vinnie_Scene18.__super__ = vinnie_Scene;
vinnie_Scene18.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		vinnie_Scene.prototype.start.call(this);
		this.audio.stopMusic();
		this.audio.playSound(vinnie_Assets.dragollater,false);
		this.makeArt(vinnie_Assets.bgScene18,0,0);
		var button = this.document.createElement("button");
		button.style.position = "absolute";
		button.style.left = "288px";
		button.style.top = "152px";
		button.style.width = "105px";
		button.style.height = "29px";
		button.textContent = "End Game";
		button.style.fontFamily = "\"MS Sans Serif,sans-serif";
		button.style.fontSize = "13.5pt";
		button.style.fontWeight = "bold";
		button.onclick = $bind(this,this.onEndGameClicked);
		this.mainView.appendChild(button);
		var text = this.makeDialogBox(0,8,this.width,100,"yellow");
		text.style.fontFamily = "Times New Roman,serif";
		text.style.fontSize = "24pt";
		text.style.fontWeight = "700";
		text.style.textAlign = "center";
		text.textContent = "TO BE CONTINUED";
		this.inventory.removeAllItems();
		this.inventory.show();
	}
	,onEndGameClicked: function() {
		this.audio.playSound(vinnie_Assets.death,false);
		this.message("Thank you for playing Vinnie's Tomb.  Be sure to continue the adventure with Vinnie's Tomb Chapter Two - Shine and Glow Vinnie.");
		this.exitGame();
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadSound(vinnie_Assets.dragollater);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene18);
		this.game.preloader.preloadSound(vinnie_Assets.death);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerSound(vinnie_Assets.dragollater);
		this.audio.registerSound(vinnie_Assets.death);
	}
	,__class__: vinnie_Scene18
});
var vinnie_Scene2 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 398;
	this.height = 199;
	this.title = "Scene Two";
	this.allowEndDragging = false;
};
$hxClasses["vinnie.Scene2"] = vinnie_Scene2;
vinnie_Scene2.__name__ = ["vinnie","Scene2"];
vinnie_Scene2.__super__ = vinnie_Scene;
vinnie_Scene2.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		var _g = this;
		vinnie_Scene.prototype.start.call(this);
		this.audio.playMusic(vinnie_Assets.musicScene2);
		this.makeArt(vinnie_Assets.bgScene2,0,0);
		this.crossedBridge = false;
		this.makeVinnie(352,88);
		this.sword = this.makeItem(vinnie_InventoryItemType.Sword,352,24,false,$bind(this,this.onSwordClicked));
		this.vinnieButton = null;
		this.makeHoverHotspot(32,0,321,201,function() {
			if(_g.isDraggingVinnie) {
				_g.resetVinnie();
				_g.message("Click on the parts of the bridge to cross the river.");
			}
		});
		this.makeClickHotspot(11,15,39,36,function() {
			_g.message("I could eat a cookie anytime.");
		});
		this.buttonBridge = [];
		var _g1 = 0;
		while(_g1 < 7) {
			var x = _g1++;
			this.buttonBridge[x] = [];
			var _g11 = 0;
			while(_g11 < 3) {
				var y = _g11++;
				if(vinnie_Scene2.BRIDGE_PATTERN[x][y] != null) this.buttonBridge[x][y] = this.makeButton(x,y,vinnie_Scene2.BRIDGE_PATTERN[x][y]);
			}
		}
		this.buttonBridge[6][1].disabled = false;
		this.exit = this.makeArt(vinnie_Assets.exitLeft,8,152,$bind(this,this.onExitClicked));
	}
	,resetVinnie: function() {
		this.cancelDrag();
		this.vinnie.style.left = "352px";
		this.vinnie.style.top = "88px";
		this.vinnie.style.display = "block";
		var _g = 0;
		while(_g < 7) {
			var ax = _g++;
			var _g1 = 0;
			while(_g1 < 3) {
				var ay = _g1++;
				var button = this.buttonBridge[ax][ay];
				if(button != null) {
					button.style.backgroundImage = null;
					button.disabled = true;
				}
			}
		}
		this.buttonBridge[6][1].disabled = false;
		this.vinnieButton = null;
	}
	,makeButton: function(tileX,tileY,killer) {
		var button = this.document.createElement("button");
		button.style.position = "absolute";
		var x = 47 + tileX * 41;
		var y = 31 + tileY * 49;
		button.style.left = "" + x + "px";
		button.style.top = "" + y + "px";
		button.style.width = "" + 41 + "px";
		button.style.height = "" + 49 + "px";
		button.style.backgroundRepeat = "no-repeat";
		button.style.backgroundPosition = "5px 5px";
		button.disabled = true;
		var f;
		if(killer) f = $bind(this,this.onKillerButtonClick); else f = $bind(this,this.onButtonClick);
		button.onclick = this.makeHandler((function(f1,x1,y1) {
			return function() {
				f1(x1,y1);
			};
		})(f,tileX,tileY));
		this.mainView.appendChild(button);
		return button;
	}
	,onSwordClicked: function() {
		var _g = this;
		if(this.crossedBridge) this.message("You can no longer reach the sword."); else this.audio.playSound(vinnie_Assets.getItem,true).then(function() {
			_g.inventory.addItem(vinnie_InventoryItemType.Sword);
			_g.inventory.show();
			_g.cancelDrag();
			_g.sword.parentNode.removeChild(_g.sword);
			_g.resetVinnie();
			_g.message("You now have a sword");
		});
	}
	,onButtonClick: function(x,y) {
		this.cancelDrag();
		if(x == 0 && y == 1) {
			this.onBridgeCrossed();
			return;
		}
		this.vinnie.style.display = "none";
		if(this.vinnieButton != null) this.vinnieButton.style.backgroundImage = "";
		var button = this.buttonBridge[x][y];
		button.style.backgroundImage = "url(\"" + ("assets/art/" + vinnie_Assets.vinnie + ".gif") + "\")";
		this.vinnieButton = button;
		var _g = 0;
		while(_g < 7) {
			var ax = _g++;
			var _g1 = 0;
			while(_g1 < 3) {
				var ay = _g1++;
				button = this.buttonBridge[ax][ay];
				if(button != null) {
					var dx = Math.abs(ax - x);
					var dy = Math.abs(ay - y);
					button.disabled = dx + dy != 1;
				}
			}
		}
	}
	,collapseBridge: function() {
		var _g = 0;
		var _g1 = this.buttonBridge;
		while(_g < _g1.length) {
			var col = _g1[_g];
			++_g;
			var _g2 = 0;
			while(_g2 < col.length) {
				var button = col[_g2];
				++_g2;
				if(button != null && button.parentNode != null) button.parentNode.removeChild(button);
			}
		}
	}
	,onBridgeCrossed: function() {
		this.crossedBridge = true;
		this.allowDragging = false;
		this.collapseBridge();
		this.vinnie.style.display = "block";
		this.vinnie.style.left = "8px";
		this.vinnie.style.top = "88px";
		this.audio.playSound(vinnie_Assets.death);
		this.message("The bridge collapsed!  Fortunately, you have made it to the other side safely.");
	}
	,onKillerButtonClick: function(x,y) {
		this.message("OH NO!  The Bridge Collapsed!");
		this.collapseBridge();
		this.vinnie = this.makeArt(vinnie_Assets.vinnieDrown,128,88);
		this.mainView.appendChild(this.vinnie);
		if(this.sword != null && this.sword.parentNode != null) this.sword.parentNode.removeChild(this.sword);
		if(this.exit != null && this.exit.parentNode != null) this.exit.parentNode.removeChild(this.exit);
		this.vinnieDied();
	}
	,onExitClicked: function() {
		if(this.crossedBridge) this.nextScene(vinnie_Scene3,this.inventory.hasItem(vinnie_InventoryItemType.Magnet) && this.inventory.hasItem(vinnie_InventoryItemType.Sword)?"ALVIN":null); else this.message("You must cross the river before you can travel to the next scene.");
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene2);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene2);
		this.game.preloader.preloadArt(vinnie_Assets.exitLeft);
		this.game.preloader.preloadSound(vinnie_Assets.getItem);
		this.game.preloader.preloadSound(vinnie_Assets.death);
		this.game.preloader.preloadArt(vinnie_Assets.vinnieDrown);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene2);
		this.audio.registerSound(vinnie_Assets.getItem);
		this.audio.registerSound(vinnie_Assets.death);
	}
	,__class__: vinnie_Scene2
});
var vinnie_Scene4 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 377;
	this.height = 200;
	this.title = "Scene Four";
	this.allowDragging = false;
};
$hxClasses["vinnie.Scene4"] = vinnie_Scene4;
vinnie_Scene4.__name__ = ["vinnie","Scene4"];
vinnie_Scene4.__super__ = vinnie_Scene;
vinnie_Scene4.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		var _g = this;
		vinnie_Scene.prototype.start.call(this);
		this.audio.playMusic(vinnie_Assets.musicScene4);
		this.mainView.style.backgroundColor = "black";
		this.makeArt(vinnie_Assets.partyBots,270,48);
		this.makeArt(vinnie_Assets.scene4Line1,87,95);
		this.makeArt(vinnie_Assets.scene4Line2,239,39);
		this.makeVinnie(72,136);
		this.partyBotsDialog = this.makeDialogBox(8,8,353,33,"white");
		this.vinnieDialog = this.makeDialogBox(8,56,169,49,"white");
		var speak = function(sound,partyBotsMsg,vinnieMsg) {
			_g.vinnieDialog.textContent = vinnieMsg;
			_g.partyBotsDialog.textContent = partyBotsMsg;
			_g.audio.playSound(sound,false);
		};
		var scrollContainer = this.dialog([(function(f,a1,a2,a3) {
			return function() {
				f(a1,a2,a3);
			};
		})(speak,vinnie_Assets.partyBots1,"Welcome to the Underworld!  You can get keen bargains on assorted undergarments.","That sounds just fine.  I'm trying to find the key to Vinnie's tomb.  Can you help?"),(function(f1,a11,a21,a31) {
			return function() {
				f1(a11,a21,a31);
			};
		})(speak,vinnie_Assets.partyBots2,"The key is hidden to have been hidden with the ancient Tibetan handkerchief.","Where should I start looking?"),function() {
			speak(vinnie_Assets.partyBots3,"There's an old queer snake who lives in a pile of garbage.  He may be able to help.  He's not far from here.","Thank you.  I'll try to find him.");
			if(_g.exit == null) _g.exit = _g.makeArt(vinnie_Assets.exitLeft,8,136,$bind(_g,_g.onExitClicked));
		}]);
		scrollContainer.style.width = "" + (this.width - 8) + "px";
		scrollContainer.style.border = "5px ridge white";
		scrollContainer.style.height = "22px";
		scrollContainer.style.background = "#c0c0c0";
		this.dialogScroller.style.width = "" + (this.width - 16) + "px";
		this.dialogScroller.style.top = "2px";
		this.dialogScroller.style.left = "3px";
	}
	,onExitClicked: function() {
		this.nextScene(vinnie_Scene5);
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene4);
		this.game.preloader.preloadArt(vinnie_Assets.partyBots);
		this.game.preloader.preloadArt(vinnie_Assets.scene4Line1);
		this.game.preloader.preloadArt(vinnie_Assets.scene4Line2);
		this.game.preloader.preloadSound(vinnie_Assets.partyBots1);
		this.game.preloader.preloadSound(vinnie_Assets.partyBots2);
		this.game.preloader.preloadSound(vinnie_Assets.partyBots3);
		this.game.preloader.preloadArt(vinnie_Assets.exitLeft);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene4);
		this.audio.registerSound(vinnie_Assets.partyBots1);
		this.audio.registerSound(vinnie_Assets.partyBots2);
		this.audio.registerSound(vinnie_Assets.partyBots3);
	}
	,__class__: vinnie_Scene4
});
var vinnie_Scene5 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 400;
	this.height = 197;
	this.title = "Scene Five";
};
$hxClasses["vinnie.Scene5"] = vinnie_Scene5;
vinnie_Scene5.__name__ = ["vinnie","Scene5"];
vinnie_Scene5.__super__ = vinnie_Scene;
vinnie_Scene5.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		var _g = this;
		vinnie_Scene.prototype.start.call(this);
		this.audio.playMusic(vinnie_Assets.musicScene5);
		this.wallMoved = false;
		this.mainView.style.backgroundColor = "black";
		this.makeHoverHotspot(120,64,65,49,$bind(this,this.onPanelHover));
		this.makeClickHotspot(272,49,64,34,function() {
			_g.message("This is about as scary as it gets.  Enjoy it.");
		});
		this.makeArt(vinnie_Assets.exitLeft,8,64,$bind(this,this.onExitClicked));
		this.makeHoverHotspot(0,96,401,105,$bind(this,this.onWallHover));
		this.makeRect(0,112,121,89,"#808080");
		this.makeRect(0,112,121,89,"#808080");
		this.makeRect(184,112,217,89,"#808080");
		this.makeVinnie(136,24);
		this.makeRect(120,176,65,25,"#808080");
		this.makeRect(168,120,17,73,"#808080");
		this.makeRect(120,120,17,73,"#808080");
		this.panel1 = this.makeRect(120,112,65,17,"#C0C0C0");
		this.panel2 = this.makeRect(120,64,65,17,"#C0C0C0");
		this.panel2.style.display = "none";
		this.skull = this.makeItem(vinnie_InventoryItemType.SkullThatOozesBloodIntermittently,136,136,true,$bind(this,this.onSkullThatOozesBloodIntermittentlyClicked));
		this.inventory.show();
	}
	,onPanelHover: function() {
		var _g = this;
		if(!this.wallMoved && this.isEquipped(vinnie_InventoryItemType.Magnet)) this.audio.playSound(vinnie_Assets.eureka,true).then(function() {
			_g.wallMoved = true;
			_g.panel1.style.display = "none";
			_g.panel2.style.display = "block";
		});
	}
	,onWallHover: function() {
		if(!this.wallMoved && this.isDraggingVinnie) {
			this.cancelDrag();
			this.message("You cannot break or penetrate the metal walls.");
		}
	}
	,onSkullThatOozesBloodIntermittentlyClicked: function() {
		if(this.wallMoved && this.skull != null) {
			this.skull.parentNode.removeChild(this.skull);
			this.obtainItem(vinnie_InventoryItemType.SkullThatOozesBloodIntermittently);
			this.skull = null;
		}
	}
	,onExitClicked: function() {
		this.nextScene(vinnie_Scene6);
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene5);
		this.game.preloader.preloadArt(vinnie_Assets.exitLeft);
		this.game.preloader.preloadSound(vinnie_Assets.eureka);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene5);
		this.audio.registerSound(vinnie_Assets.eureka);
	}
	,__class__: vinnie_Scene5
});
var vinnie_Scene6 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 400;
	this.height = 216;
	this.title = "Scene Six";
};
$hxClasses["vinnie.Scene6"] = vinnie_Scene6;
vinnie_Scene6.__name__ = ["vinnie","Scene6"];
vinnie_Scene6.__super__ = vinnie_Scene;
vinnie_Scene6.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		var _g = this;
		vinnie_Scene.prototype.start.call(this);
		this.allowDragging = false;
		this.audio.playMusic(vinnie_Assets.musicScene6);
		this.makeArt(vinnie_Assets.bgScene6,0,0);
		this.makeClickHotspot(192,177,41,26,function() {
			_g.message("This game has nothing to do with Maurice Chevalier.");
		});
		this.queerSnakeDialog = this.makeDialogBox(116,11,265,49,"white");
		this.vinnieDialog = this.makeDialogBox(176,32,217,41,"white");
		var line1 = this.makeArt(vinnie_Assets.scene6Line1,129,61);
		var line2 = this.makeArt(vinnie_Assets.scene6Line2,279,79);
		this.makeVinnie(328,144);
		this.makeItem(vinnie_InventoryItemType.Diamond,264,176);
		this.makeItem(vinnie_InventoryItemType.Banana,368,168);
		this.queerSnake = this.makeArt(vinnie_Assets.queerSnake,23,51);
		this.queerSnake.onmouseover = this.makeHandler($bind(this,this.onSnakeMouseOver));
		this.key = this.makeArt(vinnie_Assets.key,71,170,function() {
			_g.message("The snake will not let you take the key.");
		});
		this.key.style.display = "none";
		this.exit = this.makeArt(vinnie_Assets.exitLeft,8,149,$bind(this,this.onExitClicked));
		this.exit.style.display = "none";
		this.dialog([function() {
			line1.style.display = "none";
			_g.queerSnakeDialog.textContent = "";
			line2.style.display = "block";
			_g.vinnieDialog.textContent = "You must be the queer snake that the party-bots told me about.";
			_g.audio.playSound(vinnie_Assets.vin1,false);
		},function() {
			line1.style.display = "block";
			_g.queerSnakeDialog.textContent = "Actually my brother is the queer one.";
			line2.style.display = "none";
			_g.vinnieDialog.textContent = "";
			_g.audio.playSound(vinnie_Assets.snake1,false);
		},function() {
			line1.style.display = "none";
			_g.queerSnakeDialog.textContent = "";
			line2.style.display = "block";
			_g.vinnieDialog.textContent = "Where is he?";
			_g.audio.playSound(vinnie_Assets.vin2,false);
		},function() {
			line1.style.display = "block";
			_g.queerSnakeDialog.textContent = "He went to Las Vegas for a gig.  He's bigger than Wayne Newton.";
			line2.style.display = "none";
			_g.vinnieDialog.textContent = "";
			_g.audio.playSound(vinnie_Assets.snake2,false);
		},function() {
			line1.style.display = "none";
			_g.queerSnakeDialog.textContent = "";
			line2.style.display = "block";
			_g.vinnieDialog.textContent = "Very interesting.  I'm looking for a key to Vinnie's Tomb.";
			_g.audio.playSound(vinnie_Assets.vin3,false);
		},function() {
			line1.style.display = "block";
			_g.queerSnakeDialog.textContent = "The key is with me.  I'm keeping it for him.  When he gets back from Vegas, he plans to find Vinnie's Tomb himself.";
			line2.style.display = "none";
			_g.vinnieDialog.textContent = "";
			_g.audio.playSound(vinnie_Assets.snake3,false);
		},function() {
			line1.style.display = "none";
			_g.queerSnakeDialog.textContent = "";
			line2.style.display = "block";
			_g.vinnieDialog.textContent = "Would you consider selling or trading the key?";
			_g.audio.playSound(vinnie_Assets.vin4,false);
		},function() {
			line1.style.display = "block";
			_g.queerSnakeDialog.textContent = "Sorry.  It belongs to my brother.  I cannot give it up without his permission.";
			line2.style.display = "none";
			_g.vinnieDialog.textContent = "";
			_g.audio.playSound(vinnie_Assets.snake4,false);
		},function() {
			_g.queerSnakeDialog.textContent = "";
			_g.vinnieDialog.textContent = "";
			line1.style.display = "none";
			line2.style.display = "none";
			_g.inventory.show();
			_g.exit.style.display = "block";
			_g.allowDragging = true;
		}]);
	}
	,onExitClicked: function() {
		this.nextScene(vinnie_Scene7);
	}
	,onSnakeMouseOver: function() {
		var _g = this;
		if(this.exit.style.display == "block") {
			if(this.isDraggingVinnie) this.audio.playSound(vinnie_Assets.vin10,true).then(function() {
				_g.message("Can I take a look at the key?");
				_g.audio.playSound(vinnie_Assets.snake10,true).then(function() {
					_g.message("I guess so.");
					_g.key.style.display = "block";
					_g.cancelDrag();
				});
			}); else if(this.equippedItem != null) {
				var _g1 = this.equippedItem.type;
				switch(_g1[1]) {
				case 0:
					this.audio.playSound(vinnie_Assets.vin6,true).then(function() {
						_g.message("Will you trade the key for this magnet?");
						_g.audio.playSound(vinnie_Assets.snake5,true).then(function() {
							_g.message("That's a nifty magnet.  However, I don't think I need one.  The answer is no.");
						});
					});
					break;
				case 3:
					this.audio.playSound(vinnie_Assets.vin7,true).then(function() {
						_g.message("Will you trade the key for this diamond?");
						_g.audio.playSound(vinnie_Assets.snake6,true).then(function() {
							_g.message("No.  Diamonds are worthless in Underworld.  Why do you think it was lying in the garbage?");
						});
					});
					break;
				case 4:
					this.audio.playSound(vinnie_Assets.vin8,true).then(function() {
						_g.message("Will you trade the key for this banana?");
						_g.audio.playSound(vinnie_Assets.snake7,true).then(function() {
							_g.message("What do I look like?  I'm a snake, not a monkey.");
						});
					});
					break;
				case 2:
					this.audio.playSound(vinnie_Assets.vin9,true).then(function() {
						_g.message("Will you trade the key for this skull that oozes blood intermittently?");
						_g.audio.playSound(vinnie_Assets.snake8,true).then(function() {
							_g.message("I vaguely recall my brother mentioning something about a skull.  I better not make the trade though.");
						});
					});
					break;
				case 1:
					this.audio.playSound(vinnie_Assets.snake9,true).then(function() {
						_g.message("Are you threatening me?  Please go away before I lick you with my forked tongue.");
					});
					break;
				default:
				}
				this.equipItem(null);
			}
		}
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene6);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene6);
		this.game.preloader.preloadArt(vinnie_Assets.scene6Line1);
		this.game.preloader.preloadArt(vinnie_Assets.scene6Line2);
		this.game.preloader.preloadArt(vinnie_Assets.queerSnake);
		this.game.preloader.preloadArt(vinnie_Assets.key);
		this.game.preloader.preloadArt(vinnie_Assets.exitLeft);
		this.game.preloader.preloadSound(vinnie_Assets.vin1);
		this.game.preloader.preloadSound(vinnie_Assets.snake1);
		this.game.preloader.preloadSound(vinnie_Assets.vin2);
		this.game.preloader.preloadSound(vinnie_Assets.snake2);
		this.game.preloader.preloadSound(vinnie_Assets.vin3);
		this.game.preloader.preloadSound(vinnie_Assets.snake3);
		this.game.preloader.preloadSound(vinnie_Assets.vin4);
		this.game.preloader.preloadSound(vinnie_Assets.snake4);
		this.game.preloader.preloadSound(vinnie_Assets.vin10);
		this.game.preloader.preloadSound(vinnie_Assets.snake10);
		this.game.preloader.preloadSound(vinnie_Assets.vin6);
		this.game.preloader.preloadSound(vinnie_Assets.snake5);
		this.game.preloader.preloadSound(vinnie_Assets.vin7);
		this.game.preloader.preloadSound(vinnie_Assets.snake6);
		this.game.preloader.preloadSound(vinnie_Assets.vin8);
		this.game.preloader.preloadSound(vinnie_Assets.snake7);
		this.game.preloader.preloadSound(vinnie_Assets.vin9);
		this.game.preloader.preloadSound(vinnie_Assets.snake8);
		this.game.preloader.preloadSound(vinnie_Assets.snake9);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene6);
		this.audio.registerSound(vinnie_Assets.vin1);
		this.audio.registerSound(vinnie_Assets.snake1);
		this.audio.registerSound(vinnie_Assets.vin2);
		this.audio.registerSound(vinnie_Assets.snake2);
		this.audio.registerSound(vinnie_Assets.vin3);
		this.audio.registerSound(vinnie_Assets.snake3);
		this.audio.registerSound(vinnie_Assets.vin4);
		this.audio.registerSound(vinnie_Assets.snake4);
		this.audio.registerSound(vinnie_Assets.vin10);
		this.audio.registerSound(vinnie_Assets.snake10);
		this.audio.registerSound(vinnie_Assets.vin6);
		this.audio.registerSound(vinnie_Assets.snake5);
		this.audio.registerSound(vinnie_Assets.vin7);
		this.audio.registerSound(vinnie_Assets.snake6);
		this.audio.registerSound(vinnie_Assets.vin8);
		this.audio.registerSound(vinnie_Assets.snake7);
		this.audio.registerSound(vinnie_Assets.vin9);
		this.audio.registerSound(vinnie_Assets.snake8);
		this.audio.registerSound(vinnie_Assets.snake9);
	}
	,__class__: vinnie_Scene6
});
var vinnie_Scene7 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 399;
	this.height = 199;
	this.title = "Scene Seven";
	this.allowEndDragging = false;
};
$hxClasses["vinnie.Scene7"] = vinnie_Scene7;
vinnie_Scene7.__name__ = ["vinnie","Scene7"];
vinnie_Scene7.__super__ = vinnie_Scene;
vinnie_Scene7.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		var _g = this;
		vinnie_Scene.prototype.start.call(this);
		this.inventory.show();
		this.mainView.style.background = "black";
		this.doorOpened = false;
		this.audio.playMusic(vinnie_Assets.musicScene7);
		this.makeArt(vinnie_Assets.bgScene7,0,0);
		this.makeArt(vinnie_Assets.funLandEntrance,-6,19);
		this.makeHoverHotspot(0,2,400,117,$bind(this,this.cancelDrag));
		this.makeClickHotspot(178,182,36,18,function() {
			_g.message("Yet another useless hidden message.");
		});
		this.makeClickHotspot(88,17,23,27,function() {
			_g.message("You wonder what that could be.");
		});
		this.makeClickHotspot(272,128,85,48,$bind(this,this.onInsetClicked));
		this.makeVinnie(348,163);
		this.line = this.makeArt(vinnie_Assets.scene7Line,97,28);
		this.line.style.display = "none";
		this.makeClickHotspot(15,114,121,72,$bind(this,this.onEntranceClicked));
		this.door = this.document.createElement("button");
		this.door.style.position = "absolute";
		this.door.style.left = "24px";
		this.door.style.top = "123px";
		this.door.style.width = "106px";
		this.door.style.height = "58px";
		this.door.onclick = this.makeHandler($bind(this,this.onDoorClicked));
		this.mainView.appendChild(this.door);
	}
	,onDoorClicked: function() {
		if(!this.doorOpened) {
			if(this.equippedItem == null) this.message("The entrance to Fun Land appears to be closed.  That's a shame because Donny Osmond is hosting a benefit concert there for seven legged spiders from a windy city."); else this.message("That does not open the door.");
		}
	}
	,onInsetClicked: function() {
		var _g = this;
		if(!this.doorOpened) {
			if(this.equippedItem == null) this.message("You wonder what that could be."); else if(this.equippedItem.type != vinnie_InventoryItemType.Diamond) this.message("That will not help open the entrance"); else this.audio.playSound(vinnie_Assets.eureka,true).then(function() {
				_g.line.style.display = "block";
				_g.door.style.display = "none";
				_g.doorOpened = true;
				_g.diamond = _g.makeArt(vinnie_Assets.diamond,302,137,$bind(_g,_g.onInsetClicked));
				_g.inventory.removeItem(vinnie_InventoryItemType.Diamond);
				_g.equipItem(null);
			});
		} else if(this.diamond != null) {
			if(this.equippedItem == null) this.message("The diamond is stuck."); else if(this.equippedItem.type != vinnie_InventoryItemType.Sword) {
				this.message("That does not do much.");
				this.equipItem(null);
			} else this.audio.playSound(vinnie_Assets.getItem,true).then(function() {
				_g.message("You pry the glittery diamond back out of the hole with the sword.");
				_g.line.style.display = "none";
				_g.inventory.addItem(vinnie_InventoryItemType.Diamond);
				_g.diamond.parentNode.removeChild(_g.diamond);
				_g.diamond = null;
				_g.equipItem(null);
			});
		}
	}
	,onEntranceClicked: function() {
		if(this.doorOpened) this.nextScene(vinnie_Scene8,"LALAL");
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene7);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene7);
		this.game.preloader.preloadArt(vinnie_Assets.funLandEntrance);
		this.game.preloader.preloadArt(vinnie_Assets.scene7Line);
		this.game.preloader.preloadSound(vinnie_Assets.eureka);
		this.game.preloader.preloadArt(vinnie_Assets.diamond);
		this.game.preloader.preloadSound(vinnie_Assets.getItem);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene7);
		this.audio.registerSound(vinnie_Assets.eureka);
		this.audio.registerSound(vinnie_Assets.getItem);
	}
	,__class__: vinnie_Scene7
});
var vinnie_Scene9 = function(game) {
	vinnie_Scene.call(this,game);
	this.width = 401;
	this.height = 216;
	this.title = "Scene Nine";
};
$hxClasses["vinnie.Scene9"] = vinnie_Scene9;
vinnie_Scene9.__name__ = ["vinnie","Scene9"];
vinnie_Scene9.__super__ = vinnie_Scene;
vinnie_Scene9.prototype = $extend(vinnie_Scene.prototype,{
	start: function() {
		var _g = this;
		vinnie_Scene.prototype.start.call(this);
		this.allowDragging = false;
		this.audio.playMusic(vinnie_Assets.musicScene9);
		this.bg = this.makeArt(vinnie_Assets.bgScene9,0,0);
		this.makeHoverHotspot(0,0,401,137,$bind(this,this.cancelDrag));
		this.exit = this.makeArt(vinnie_Assets.exitLeft,0,112,$bind(this,this.onExitClicked));
		this.exit.style.display = "none";
		this.line1 = this.makeArt(vinnie_Assets.scene9Line1,184,40);
		this.vinnieDialog = this.makeDialogBox(192,96,201,49,"black","white");
		this.vinnieDialog.style.fontWeight = "normal";
		this.makeItem(vinnie_InventoryItemType.Shades,216,168);
		this.makeVinnie(312,152);
		this.horseDialog = this.makeDialogBox(200,8,193,81,"black","white");
		this.horseDialog.style.fontWeight = "normal";
		this.line2 = this.makeArt(vinnie_Assets.scene9Line2,264,145);
		var horseSpeak = function(sound,dialog) {
			_g.vinnieDialog.style.display = "none";
			_g.horseDialog.style.display = "block";
			_g.horseDialog.textContent = dialog;
			_g.line1.style.display = "block";
			_g.line2.style.display = "none";
			_g.audio.playSound(sound,false);
		};
		var vinnieSpeak = function(sound1,dialog1) {
			_g.vinnieDialog.style.display = "block";
			_g.vinnieDialog.textContent = dialog1;
			_g.horseDialog.style.display = "none";
			_g.line1.style.display = "none";
			_g.line2.style.display = "block";
			_g.audio.playSound(sound1,false);
		};
		this.dialog([(function(f,a1,a2) {
			return function() {
				f(a1,a2);
			};
		})(horseSpeak,vinnie_Assets.horse2,"Hello.  How are you this fine morning?"),(function(f1,a11,a21) {
			return function() {
				f1(a11,a21);
			};
		})(vinnieSpeak,vinnie_Assets.vin17,"Who is that?  I can’t see anyone there."),(function(f2,a12,a22) {
			return function() {
				f2(a12,a22);
			};
		})(horseSpeak,vinnie_Assets.horse2,"I’m an invisible horse."),(function(f3,a13,a23) {
			return function() {
				f3(a13,a23);
			};
		})(vinnieSpeak,vinnie_Assets.vin18,"Why are you invisible?"),(function(f4,a14,a24) {
			return function() {
				f4(a14,a24);
			};
		})(horseSpeak,vinnie_Assets.horse3,"The designer of this game can’t draw horses."),(function(f5,a15,a25) {
			return function() {
				f5(a15,a25);
			};
		})(vinnieSpeak,vinnie_Assets.vin19,"The designer can’t draw at all."),(function(f6,a16,a26) {
			return function() {
				f6(a16,a26);
			};
		})(horseSpeak,vinnie_Assets.horse4,"Would you like to see how I look?"),(function(f7,a17,a27) {
			return function() {
				f7(a17,a27);
			};
		})(vinnieSpeak,vinnie_Assets.vin20,"Not really, but go ahead."),function() {
			horseSpeak(vinnie_Assets.horse5,"What do you think?");
			_g.bg.src = "assets/art/" + vinnie_Assets.bgScene9Visible + ".gif";
		},(function(f8,a18,a28) {
			return function() {
				f8(a18,a28);
			};
		})(vinnieSpeak,vinnie_Assets.vin21,"I think you should stay invisible."),(function(f9,a19,a29) {
			return function() {
				f9(a19,a29);
			};
		})(horseSpeak,vinnie_Assets.horse6,"I guess you’re right."),(function(f10,a110,a210) {
			return function() {
				f10(a110,a210);
			};
		})(vinnieSpeak,vinnie_Assets.vin22,"Do you know anything about Vinnie’s Tomb?"),(function(f11,a111,a211) {
			return function() {
				f11(a111,a211);
			};
		})(horseSpeak,vinnie_Assets.horse7,"According to legend it’s a tomb where a clown named Vinnie and his band of chickens were buried twelve centuries ago."),(function(f12,a112,a212) {
			return function() {
				f12(a112,a212);
			};
		})(vinnieSpeak,vinnie_Assets.vin23,"The legend is wrong.  There were no chickens."),(function(f13,a113,a213) {
			return function() {
				f13(a113,a213);
			};
		})(horseSpeak,vinnie_Assets.horse8,"Well, the chickens added some colour to the story."),(function(f14,a114,a214) {
			return function() {
				f14(a114,a214);
			};
		})(vinnieSpeak,vinnie_Assets.vin24,"I need the key to Vinnie’s tomb, but the snake will not part with it."),(function(f15,a115,a215) {
			return function() {
				f15(a115,a215);
			};
		})(horseSpeak,vinnie_Assets.horse9,"That does not matter.  I have a dozen keys to Vinnie’s tomb."),(function(f16,a116,a216) {
			return function() {
				f16(a116,a216);
			};
		})(vinnieSpeak,vinnie_Assets.vin25,"You do?"),(function(f17,a117,a217) {
			return function() {
				f17(a117,a217);
			};
		})(horseSpeak,vinnie_Assets.horse10,"Sure.  That fool snake and his queer lounge king brother think they have a monopoly on Vinnie’s Tomb keys.  They don’t know that I have amassed a collection of them along with expensive trinkets from the Franklin mint."),(function(f18,a118,a218) {
			return function() {
				f18(a118,a218);
			};
		})(vinnieSpeak,vinnie_Assets.vin26,"Would you please give me a key?"),(function(f19,a119,a219) {
			return function() {
				f19(a119,a219);
			};
		})(horseSpeak,vinnie_Assets.horse11,"I'll give you one for five hundred dollars."),(function(f20,a120,a220) {
			return function() {
				f20(a120,a220);
			};
		})(vinnieSpeak,vinnie_Assets.vin27,"I don’t have any money."),(function(f21,a121,a221) {
			return function() {
				f21(a121,a221);
			};
		})(horseSpeak,vinnie_Assets.horse12,"Then you better get a job."),(function(f22,a122,a222) {
			return function() {
				f22(a122,a222);
			};
		})(vinnieSpeak,vinnie_Assets.vin28,"Where can I find a job?"),(function(f23,a123,a223) {
			return function() {
				f23(a123,a223);
			};
		})(horseSpeak,vinnie_Assets.horse13,"There aren’t any jobs here in Fun Land."),(function(f24,a124,a224) {
			return function() {
				f24(a124,a224);
			};
		})(vinnieSpeak,vinnie_Assets.vin29,"This is most irritating."),(function(f25,a125,a225) {
			return function() {
				f25(a125,a225);
			};
		})(horseSpeak,vinnie_Assets.horse14,"Wait a minute.  There is a handsome reward out for the capture of that loud mouthed beast."),(function(f26,a126,a226) {
			return function() {
				f26(a126,a226);
			};
		})(vinnieSpeak,vinnie_Assets.vin30,"What loud mouthed beast?"),(function(f27,a127,a227) {
			return function() {
				f27(a127,a227);
			};
		})(horseSpeak,vinnie_Assets.horse15,"The one that keeps us all night singing 'Climb Every Mountain' and 'Can’t Help Lovin’ Dat Man'."),(function(f28,a128,a228) {
			return function() {
				f28(a128,a228);
			};
		})(vinnieSpeak,vinnie_Assets.vin31,"I have heard of this monster already.  I guess I’ll have to find him."),function() {
			horseSpeak(vinnie_Assets.horse16,"Good luck.  You’re going to need it.");
			_g.allowDragging = true;
			_g.exit.style.display = "block";
		}]);
		this.audio.playSound(vinnie_Assets.horse1,false);
	}
	,onExitClicked: function() {
		this.nextScene(vinnie_Scene10);
	}
	,preload: function() {
		vinnie_Scene.prototype.preload.call(this);
		this.game.preloader.preloadMusic(vinnie_Assets.musicScene9);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene9);
		this.game.preloader.preloadArt(vinnie_Assets.exitLeft);
		this.game.preloader.preloadArt(vinnie_Assets.scene9Line1);
		this.game.preloader.preloadArt(vinnie_Assets.scene9Line2);
		this.game.preloader.preloadSound(vinnie_Assets.horse2);
		this.game.preloader.preloadSound(vinnie_Assets.vin17);
		this.game.preloader.preloadSound(vinnie_Assets.horse2);
		this.game.preloader.preloadSound(vinnie_Assets.vin18);
		this.game.preloader.preloadSound(vinnie_Assets.horse3);
		this.game.preloader.preloadSound(vinnie_Assets.vin19);
		this.game.preloader.preloadSound(vinnie_Assets.horse4);
		this.game.preloader.preloadSound(vinnie_Assets.vin20);
		this.game.preloader.preloadSound(vinnie_Assets.horse5);
		this.game.preloader.preloadArt(vinnie_Assets.bgScene9Visible);
		this.game.preloader.preloadSound(vinnie_Assets.vin21);
		this.game.preloader.preloadSound(vinnie_Assets.horse6);
		this.game.preloader.preloadSound(vinnie_Assets.vin22);
		this.game.preloader.preloadSound(vinnie_Assets.horse7);
		this.game.preloader.preloadSound(vinnie_Assets.vin23);
		this.game.preloader.preloadSound(vinnie_Assets.horse8);
		this.game.preloader.preloadSound(vinnie_Assets.vin24);
		this.game.preloader.preloadSound(vinnie_Assets.horse9);
		this.game.preloader.preloadSound(vinnie_Assets.vin25);
		this.game.preloader.preloadSound(vinnie_Assets.horse10);
		this.game.preloader.preloadSound(vinnie_Assets.vin26);
		this.game.preloader.preloadSound(vinnie_Assets.horse11);
		this.game.preloader.preloadSound(vinnie_Assets.vin27);
		this.game.preloader.preloadSound(vinnie_Assets.horse12);
		this.game.preloader.preloadSound(vinnie_Assets.vin28);
		this.game.preloader.preloadSound(vinnie_Assets.horse13);
		this.game.preloader.preloadSound(vinnie_Assets.vin29);
		this.game.preloader.preloadSound(vinnie_Assets.horse14);
		this.game.preloader.preloadSound(vinnie_Assets.vin30);
		this.game.preloader.preloadSound(vinnie_Assets.horse15);
		this.game.preloader.preloadSound(vinnie_Assets.vin31);
		this.game.preloader.preloadSound(vinnie_Assets.horse16);
		this.game.preloader.preloadSound(vinnie_Assets.horse1);
	}
	,registerSounds: function() {
		vinnie_Scene.prototype.registerSounds.call(this);
		this.audio.registerMusic(vinnie_Assets.musicScene9);
		this.audio.registerSound(vinnie_Assets.horse2);
		this.audio.registerSound(vinnie_Assets.vin17);
		this.audio.registerSound(vinnie_Assets.horse2);
		this.audio.registerSound(vinnie_Assets.vin18);
		this.audio.registerSound(vinnie_Assets.horse3);
		this.audio.registerSound(vinnie_Assets.vin19);
		this.audio.registerSound(vinnie_Assets.horse4);
		this.audio.registerSound(vinnie_Assets.vin20);
		this.audio.registerSound(vinnie_Assets.horse5);
		this.audio.registerSound(vinnie_Assets.vin21);
		this.audio.registerSound(vinnie_Assets.horse6);
		this.audio.registerSound(vinnie_Assets.vin22);
		this.audio.registerSound(vinnie_Assets.horse7);
		this.audio.registerSound(vinnie_Assets.vin23);
		this.audio.registerSound(vinnie_Assets.horse8);
		this.audio.registerSound(vinnie_Assets.vin24);
		this.audio.registerSound(vinnie_Assets.horse9);
		this.audio.registerSound(vinnie_Assets.vin25);
		this.audio.registerSound(vinnie_Assets.horse10);
		this.audio.registerSound(vinnie_Assets.vin26);
		this.audio.registerSound(vinnie_Assets.horse11);
		this.audio.registerSound(vinnie_Assets.vin27);
		this.audio.registerSound(vinnie_Assets.horse12);
		this.audio.registerSound(vinnie_Assets.vin28);
		this.audio.registerSound(vinnie_Assets.horse13);
		this.audio.registerSound(vinnie_Assets.vin29);
		this.audio.registerSound(vinnie_Assets.horse14);
		this.audio.registerSound(vinnie_Assets.vin30);
		this.audio.registerSound(vinnie_Assets.horse15);
		this.audio.registerSound(vinnie_Assets.vin31);
		this.audio.registerSound(vinnie_Assets.horse16);
		this.audio.registerSound(vinnie_Assets.horse1);
	}
	,__class__: vinnie_Scene9
});
var vinnie_Vinnie = function() {
	var body = window.document.body;
	body.style.margin = "0";
	body.style.padding = "0";
	body.style.overflow = "hidden";
	body.style.position = "aboslute";
	body.style.width = "100%";
	body.style.height = "100%";
	body.style.backgroundColor = "#ffe0c0";
	body.style.setProperty("-webkit-font-smoothing","none");
	body.style.setProperty("font-smooth","never");
	body.style.setProperty("-webkit-user-select","none");
	body.style.setProperty("image-rendering","optimizeSpeed");
	body.style.setProperty("image-rendering","-moz-crisp-edges");
	body.style.setProperty("image-rendering","-o-crisp-edges;");
	body.style.setProperty("image-rendering","-webkit-optimize-contrast");
	body.style.setProperty("image-rendering","optimize-contrast");
	body.style.setProperty("image-rendering","pixelated");
	body.style.setProperty("-ms-interpolation-mode","nearest-neighbor");
	body.style.setProperty("font-smooth","never");
	body.style.setProperty("-webkit-user-select","none");
	body.style.setProperty("user-select","none");
	body.ondragstart = function(_) {
		return false;
	};
	this.isMobile = new EReg("Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini","").match(window.navigator.userAgent);
	if(this.isMobile) {
		var sheet = window.document.styleSheets[0];
		if(sheet == null) {
			var style;
			var _this = window.document;
			style = _this.createElement("style");
			style.type = "text/css";
			window.document.head.appendChild(style);
			sheet = style.sheet;
		}
		if(sheet.insertRule != null) {
			sheet.insertRule("::-webkit-scrollbar { -webkit-appearance: none; }",sheet.cssRules.length);
			sheet.insertRule("::-webkit-scrollbar:horizontal { height: 12px; }",sheet.cssRules.length);
			sheet.insertRule("::-webkit-scrollbar-thumb { background-color: rgba(0.5, 0.5, 0.5, .5); border: 2px solid #808080; }",sheet.cssRules.length);
			sheet.insertRule("::-webkit-scrollbar-track { background-color: #c0c0c0; }",sheet.cssRules.length);
		}
	}
	this.preloader = new vinnie_Preloader(this);
	this.audio = new vinnie_AudioManager(this);
	window.addEventListener("resize",$bind(this,this.onResize));
	this.inventory = new vinnie_Inventory(this);
	this.isPaused = false;
	this.bonusScenes = false;
	this.bonusSceneCompleted = [];
	this.shadesOn = false;
	this.primedAudio = false;
	var _this1 = window.document;
	this.loadingScreen = _this1.createElement("div");
	this.loadingScreen.style.position = "absolute";
	this.loadingScreen.style.left = "50%";
	this.loadingScreen.style.top = "50%";
	this.loadingScreen.style.width = "314px";
	this.loadingScreen.style.height = "81px";
	this.loadingScreen.style.color = "red";
	this.loadingScreen.style.textAlign = "center";
	this.loadingScreen.style.fontFamily = "\"Times New Roman\",serif";
	this.loadingScreen.style.fontSize = "20.25pt";
	this.loadingScreen.style.fontWeight = "700";
	this.loadingScreen.style.marginLeft = "-157px";
	this.loadingScreen.style.marginTop = "-40px";
	this.loadingScreen.style.textShadow = "-1px -1px black";
	this.loadingScreen.style.cursor = "default";
	this.loadingScreen.textContent = "Loading Vinnie's Tomb, Please Wait...";
	this.loadingScreen.style.zIndex = "10000";
	var _this2 = window.document;
	this.playButton = _this2.createElement("button");
	this.playButton.textContent = "Play";
	this.playButton.style.position = "absolute";
	this.playButton.style.bottom = "0";
	this.playButton.style.width = "314px";
	this.playButton.style.height = "180px";
	this.playButton.style.fontSize = "30pt";
	this.playButton.style.display = "none";
	this.loadingScreen.appendChild(this.playButton);
	window.document.addEventListener("keydown",$bind(this,this.onKeyDown));
	this.startScene(new vinnie_MainMenu(this));
};
$hxClasses["vinnie.Vinnie"] = vinnie_Vinnie;
vinnie_Vinnie.__name__ = ["vinnie","Vinnie"];
vinnie_Vinnie.main = function() {
	new vinnie_Vinnie();
};
vinnie_Vinnie.prototype = {
	checkSceneLoaded: function(scene) {
		this.stopLoadingScreenTimer();
		this.loadingTimer = new haxe_Timer(100);
		this.loadingTimer.run = $bind(this,this.showLoadingScreen);
		this.preloader.onPreloadComplete = (function(f,a1) {
			return function() {
				f(a1);
			};
		})($bind(this,this.onPreloadComplete),scene);
		scene.preload();
		this.preloader.beginPreload();
	}
	,preloadNextScene: function() {
		if(this.scene != null) {
			var nextSceneClass = null;
			var className = null;
			if(Type.getClass(this.scene) == vinnie_MainMenu) nextSceneClass = vinnie_Scene1; else {
				var sceneNum = Std.parseInt((function($this) {
					var $r;
					var _this = Type.getClassName(Type.getClass($this.scene));
					$r = HxOverrides.substr(_this,"vinnie.Scene".length,null);
					return $r;
				}(this)));
				className = "vinnie.Scene" + (sceneNum + 1);
				nextSceneClass = Type.resolveClass(className);
			}
			if(nextSceneClass != null) {
				var nextScene = Type.createInstance(nextSceneClass,[this]);
				nextScene.preload();
				this.preloader.beginPreload();
			}
		}
	}
	,startScene: function(scene) {
		var oldScene = this.scene;
		if(oldScene != null) oldScene.end();
		this.checkSceneLoaded(scene);
	}
	,onPreloadComplete: function(scene) {
		var _g = this;
		this.preloader.onPreloadComplete = null;
		if(this.isMobile && !this.primedAudio) {
			this.primedAudio = true;
			this.playButton.style.display = "block";
			this.playButton.onclick = function(_) {
				_g.playButton.style.display = "none";
				_g.audio.primeSounds();
				_g.onSceneLoaded(scene);
			};
		} else this.onSceneLoaded(scene);
	}
	,onSceneLoaded: function(scene) {
		this.hideLoadingScreen();
		this.scene = scene;
		scene.start();
		this.preloadNextScene();
	}
	,onKeyDown: function(event) {
		var F1 = 112;
		if(event.keyCode == F1) {
			this.help();
			return false;
		}
		return true;
	}
	,help: function() {
		window.open("manual/Vintomb.html","_new");
	}
	,showLoadingScreen: function() {
		if(this.loadingScreen.parentNode == null) {
			this.stopLoadingScreenTimer();
			window.document.body.appendChild(this.loadingScreen);
		}
	}
	,stopLoadingScreenTimer: function() {
		if(this.loadingTimer != null) {
			this.loadingTimer.stop();
			this.loadingTimer = null;
		}
	}
	,hideLoadingScreen: function() {
		this.stopLoadingScreenTimer();
		if(this.loadingScreen != null && this.loadingScreen.parentNode != null) this.loadingScreen.parentNode.removeChild(this.loadingScreen);
	}
	,onResize: function(_) {
		if(this.scene != null) this.scene.updatePosition();
	}
	,__class__: vinnie_Vinnie
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var __map_reserved = {}
js_Boot.__toStr = {}.toString;
vinnie_ActionScene.TRAP_WIDTH = 49;
vinnie_ActionScene.TRAP_HEIGHT = 33;
vinnie_ActionScene.ACTION_SCENE_DATA = [[{ x : 196, y : 132},{ x : 13, y : 128},{ x : 89, y : 75},{ x : 144, y : 240},{ x : 382, y : 173},{ x : 301, y : 159}],[{ x : 249, y : 262},{ x : 2, y : 72},{ x : 87, y : 73},{ x : 188, y : 266},{ x : 398, y : 64},{ x : 398, y : 70}],[{ x : 85, y : 231},{ x : 378, y : 75},{ x : 315, y : 110},{ x : 10, y : 264},{ x : 239, y : 156},{ x : 167, y : 192}]];
vinnie_ActionScene.UP = 38;
vinnie_ActionScene.DOWN = 40;
vinnie_ActionScene.LEFT = 37;
vinnie_ActionScene.RIGHT = 39;
vinnie_Assets.title = "title";
vinnie_Assets.lightBulb = "light-bulb";
vinnie_Assets.exitLeft = "exit-left";
vinnie_Assets.exitRight = "exit-right";
vinnie_Assets.bolt = "bolt";
vinnie_Assets.scene4Line1 = "scene4-line1";
vinnie_Assets.scene4Line2 = "scene4-line2";
vinnie_Assets.scene6Line1 = "scene6-line1";
vinnie_Assets.scene6Line2 = "scene6-line2";
vinnie_Assets.funLandEntrance = "fun-land-entrance";
vinnie_Assets.scene7Line = "scene7-line";
vinnie_Assets.ufo = "ufo";
vinnie_Assets.scene8Line1 = "scene8-line1";
vinnie_Assets.scene8Line2 = "scene8-line2";
vinnie_Assets.scene9Line1 = "scene9-line1";
vinnie_Assets.scene9Line2 = "scene9-line2";
vinnie_Assets.scene10Line1 = "scene10-line1";
vinnie_Assets.scene10Line2 = "scene10-line2";
vinnie_Assets.book = "book";
vinnie_Assets.twig = "twig";
vinnie_Assets.slingshot = "slingshot";
vinnie_Assets.sphereOfLight = "sphere-of-light";
vinnie_Assets.bloodRockCover = "blood-rock-cover";
vinnie_Assets.scene14Line1 = "scene14-line1";
vinnie_Assets.scene14Line2 = "scene14-line2";
vinnie_Assets.scene17door = "scene17-door";
vinnie_Assets.cdBeam = "cd-beam";
vinnie_Assets.bgScene1 = "scene1";
vinnie_Assets.bgScene2 = "scene2";
vinnie_Assets.bgScene3 = "scene3";
vinnie_Assets.bgScene6 = "scene6";
vinnie_Assets.bgScene7 = "scene7";
vinnie_Assets.bgScene8 = "scene8";
vinnie_Assets.bgScene9 = "scene9";
vinnie_Assets.bgScene9Visible = "scene9-visible";
vinnie_Assets.bgScene10 = "scene10";
vinnie_Assets.bgScene10Awake = "scene10-awake";
vinnie_Assets.bgScene12 = "scene12";
vinnie_Assets.bgScene13 = "scene13";
vinnie_Assets.bgScene14 = "scene14";
vinnie_Assets.bgScene15 = "scene15";
vinnie_Assets.bgScene16 = "scene16";
vinnie_Assets.bgScene17 = "scene17";
vinnie_Assets.bgScene18 = "scene18";
vinnie_Assets.bgAction = "action";
vinnie_Assets.sadEthel = "sad-ethel";
vinnie_Assets.partyBots = "party-bots";
vinnie_Assets.queerSnake = "queer-snake";
vinnie_Assets.funlander = "funlander";
vinnie_Assets.jerk = "jerk";
vinnie_Assets.eyeGuy = "eye";
vinnie_Assets.vinnie = "vinnie";
vinnie_Assets.vinnieShades = "vinnie-shades";
vinnie_Assets.vinnieDrown = "vinnie-drown";
vinnie_Assets.vinnieFried = "vinnie-fried";
vinnie_Assets.magnet = "magnet";
vinnie_Assets.sword = "sword";
vinnie_Assets.skull = "skull";
vinnie_Assets.bloodySkull = "skull-blood";
vinnie_Assets.diamond = "diamond";
vinnie_Assets.banana = "banana";
vinnie_Assets.key = "key";
vinnie_Assets.underwear = "underwear";
vinnie_Assets.cd = "cd";
vinnie_Assets.money = "money";
vinnie_Assets.eightBall = "8ball";
vinnie_Assets.cheese = "cheese";
vinnie_Assets.shades = "shades";
vinnie_Assets.toolBox = "toolbox";
vinnie_Assets.getItem = "hap1.mp3";
vinnie_Assets.completeScene = "hap2.mp3";
vinnie_Assets.eureka = "hap3.mp3";
vinnie_Assets.death = "death.mp3";
vinnie_Assets.teleport = "teleport.mp3";
vinnie_Assets.trainWhistle = "WHI.MP3";
vinnie_Assets.sphereZap = "elev.mp3";
vinnie_Assets.dragollater = "SCREAM.MP3";
vinnie_Assets.narIntro = "INTRON.MP3";
vinnie_Assets.nar1 = "NAR1.MP3";
vinnie_Assets.nar3 = "NAR3.MP3";
vinnie_Assets.nar4 = "NAR4.MP3";
vinnie_Assets.vin1 = "Vin1.mp3";
vinnie_Assets.vin2 = "Vin2.mp3";
vinnie_Assets.vin3 = "Vin3.mp3";
vinnie_Assets.vin4 = "Vin4.mp3";
vinnie_Assets.vin6 = "vin6.mp3";
vinnie_Assets.vin7 = "Vin7.mp3";
vinnie_Assets.vin8 = "Vin8.mp3";
vinnie_Assets.vin9 = "Vin9.mp3";
vinnie_Assets.vin10 = "Vin10.mp3";
vinnie_Assets.vin11 = "Vin11.mp3";
vinnie_Assets.vin12 = "Vin12.mp3";
vinnie_Assets.vin13 = "Vin13.mp3";
vinnie_Assets.vin14 = "Vin14.mp3";
vinnie_Assets.vin15 = "Vin15.mp3";
vinnie_Assets.vin16 = "Vin16.mp3";
vinnie_Assets.vin17 = "Vin17.mp3";
vinnie_Assets.vin18 = "Vin18.mp3";
vinnie_Assets.vin19 = "Vin19.mp3";
vinnie_Assets.vin20 = "Vin20.mp3";
vinnie_Assets.vin21 = "Vin21.mp3";
vinnie_Assets.vin22 = "Vin22.mp3";
vinnie_Assets.vin23 = "Vin23.mp3";
vinnie_Assets.vin24 = "Vin24.mp3";
vinnie_Assets.vin25 = "Vin25.mp3";
vinnie_Assets.vin26 = "Vin26.mp3";
vinnie_Assets.vin27 = "Vin27.mp3";
vinnie_Assets.vin28 = "Vin28.mp3";
vinnie_Assets.vin29 = "Vin29.mp3";
vinnie_Assets.vin30 = "Vin30.mp3";
vinnie_Assets.vin31 = "Vin31.mp3";
vinnie_Assets.vin32 = "Vin32.mp3";
vinnie_Assets.vin33 = "Vin33.mp3";
vinnie_Assets.vin34 = "Vin34.mp3";
vinnie_Assets.vin35 = "Vin35.mp3";
vinnie_Assets.vin36 = "Vin36.mp3";
vinnie_Assets.vin37 = "Vin37.mp3";
vinnie_Assets.vin38 = "Vin38.mp3";
vinnie_Assets.vin40 = "Vin40.mp3";
vinnie_Assets.vin41 = "Vin41.mp3";
vinnie_Assets.vin42 = "Vin42.mp3";
vinnie_Assets.vin44 = "Vin44.mp3";
vinnie_Assets.partyBots1 = "Bot1.mp3";
vinnie_Assets.partyBots2 = "bot2.mp3";
vinnie_Assets.partyBots3 = "bot3.mp3";
vinnie_Assets.snake1 = "snake1.mp3";
vinnie_Assets.snake2 = "snake2.mp3";
vinnie_Assets.snake3 = "snake3.mp3";
vinnie_Assets.snake4 = "snake4.mp3";
vinnie_Assets.snake5 = "snake5.mp3";
vinnie_Assets.snake6 = "snake6.mp3";
vinnie_Assets.snake7 = "snake7.mp3";
vinnie_Assets.snake8 = "snake8.mp3";
vinnie_Assets.snake9 = "snake9.mp3";
vinnie_Assets.snake10 = "snake10.mp3";
vinnie_Assets.guy1 = "guy1.mp3";
vinnie_Assets.guy2 = "guy2.mp3";
vinnie_Assets.guy3 = "guy3.mp3";
vinnie_Assets.guy4 = "guy4.mp3";
vinnie_Assets.guy5 = "guy5.mp3";
vinnie_Assets.horse1 = "horse1.mp3";
vinnie_Assets.horse2 = "horse2.mp3";
vinnie_Assets.horse3 = "horse3.mp3";
vinnie_Assets.horse4 = "horse4.mp3";
vinnie_Assets.horse5 = "horse5.mp3";
vinnie_Assets.horse6 = "horse6.mp3";
vinnie_Assets.horse7 = "horse7.mp3";
vinnie_Assets.horse8 = "horse8.mp3";
vinnie_Assets.horse9 = "horse9.mp3";
vinnie_Assets.horse10 = "horse10.mp3";
vinnie_Assets.horse11 = "horse11.mp3";
vinnie_Assets.horse12 = "horse12.mp3";
vinnie_Assets.horse13 = "horse13.mp3";
vinnie_Assets.horse14 = "horse14.mp3";
vinnie_Assets.horse15 = "horse15.mp3";
vinnie_Assets.horse16 = "horse16.mp3";
vinnie_Assets.sing1 = "SING1.MP3";
vinnie_Assets.sing2 = "SING2.MP3";
vinnie_Assets.sing3 = "SING3.MP3";
vinnie_Assets.sing4 = "SING4.MP3";
vinnie_Assets.sing5 = "SING5.MP3";
vinnie_Assets.sing6 = "SING6.MP3";
vinnie_Assets.sing7 = "SING7.MP3";
vinnie_Assets.sing8 = "SING8.MP3";
vinnie_Assets.sing9 = "SING9.MP3";
vinnie_Assets.sing10 = "SING10.MP3";
vinnie_Assets.sing11 = "SING11.MP3";
vinnie_Assets.eye1 = "EYE1.MP3";
vinnie_Assets.eye2 = "EYE2.MP3";
vinnie_Assets.eye3 = "EYE3.MP3";
vinnie_Assets.musicIntro = "intro";
vinnie_Assets.musicScene1 = "scene1";
vinnie_Assets.musicScene2 = "scene2";
vinnie_Assets.musicScene3 = "scene3";
vinnie_Assets.musicScene4 = "scene4";
vinnie_Assets.musicScene5 = "scene5";
vinnie_Assets.musicScene6 = "scene6";
vinnie_Assets.musicScene7 = "scene7";
vinnie_Assets.musicScene8 = "scene8";
vinnie_Assets.musicScene9 = "scene9";
vinnie_Assets.musicScene10 = "scene10";
vinnie_Inventory.itemInfo = (function($this) {
	var $r;
	var _g = new haxe_ds_EnumValueMap();
	_g.set(vinnie_InventoryItemType.Magnet,{ type : vinnie_InventoryItemType.Magnet, name : "a magnet", icon : vinnie_Assets.magnet, x : 0, y : 8});
	_g.set(vinnie_InventoryItemType.Sword,{ type : vinnie_InventoryItemType.Sword, name : "a sword", icon : vinnie_Assets.sword, x : 40, y : 8});
	_g.set(vinnie_InventoryItemType.SkullThatOozesBloodIntermittently,{ type : vinnie_InventoryItemType.SkullThatOozesBloodIntermittently, name : "the skull that oozes blood intermittently.", icon : vinnie_Assets.skull, x : 80, y : 8});
	_g.set(vinnie_InventoryItemType.Diamond,{ type : vinnie_InventoryItemType.Diamond, name : "the glittery diamond.", icon : vinnie_Assets.diamond, x : 112, y : 8});
	_g.set(vinnie_InventoryItemType.Banana,{ type : vinnie_InventoryItemType.Banana, name : "an overripe banana.", icon : vinnie_Assets.banana, x : 144, y : 8});
	_g.set(vinnie_InventoryItemType.Key,{ type : vinnie_InventoryItemType.Key, name : "key.", icon : vinnie_Assets.key, x : 176, y : 48});
	_g.set(vinnie_InventoryItemType.Underwear,{ type : vinnie_InventoryItemType.Underwear, name : "underwear.", icon : vinnie_Assets.underwear, x : 136, y : 48});
	_g.set(vinnie_InventoryItemType.CD,{ type : vinnie_InventoryItemType.CD, name : "a the compact disc.", icon : vinnie_Assets.cd, x : 96, y : 48});
	_g.set(vinnie_InventoryItemType.Money,{ type : vinnie_InventoryItemType.Money, name : "money.", icon : vinnie_Assets.money, x : 48, y : 40});
	_g.set(vinnie_InventoryItemType.EightBall,{ type : vinnie_InventoryItemType.EightBall, name : "8-ball.", icon : vinnie_Assets.eightBall, x : 8, y : 48});
	_g.set(vinnie_InventoryItemType.Cheese,{ type : vinnie_InventoryItemType.Cheese, name : "cheese.", icon : vinnie_Assets.cheese, x : 216, y : 40});
	_g.set(vinnie_InventoryItemType.Shades,{ type : vinnie_InventoryItemType.Shades, name : "a pair of cool shades.  You wonder why you keep finding things just lying around.", icon : vinnie_Assets.shades, x : 232, y : 8});
	_g.set(vinnie_InventoryItemType.ToolBox,{ type : vinnie_InventoryItemType.ToolBox, name : "a metal box.", icon : vinnie_Assets.toolBox, x : 192, y : 8});
	$r = _g;
	return $r;
}(this));
vinnie_MainMenu.PASSCODE_GAMES = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	_g.set("ALVIN",{ scene : vinnie_Scene3, inventory : [vinnie_InventoryItemType.Magnet,vinnie_InventoryItemType.Sword], shades : false});
	_g.set("LALAL",{ scene : vinnie_Scene8, inventory : [vinnie_InventoryItemType.Magnet,vinnie_InventoryItemType.Sword,vinnie_InventoryItemType.SkullThatOozesBloodIntermittently,vinnie_InventoryItemType.Diamond,vinnie_InventoryItemType.Banana], shades : false});
	_g.set("SETTA",{ scene : vinnie_Scene12, inventory : [vinnie_InventoryItemType.Magnet,vinnie_InventoryItemType.Sword,vinnie_InventoryItemType.SkullThatOozesBloodIntermittently,vinnie_InventoryItemType.Diamond,vinnie_InventoryItemType.Banana,vinnie_InventoryItemType.ToolBox,vinnie_InventoryItemType.CD,vinnie_InventoryItemType.Underwear,vinnie_InventoryItemType.Key,vinnie_InventoryItemType.Cheese], shades : true});
	_g.set("METTA",{ scene : vinnie_Scene12, inventory : [vinnie_InventoryItemType.Magnet,vinnie_InventoryItemType.Sword,vinnie_InventoryItemType.SkullThatOozesBloodIntermittently,vinnie_InventoryItemType.Diamond,vinnie_InventoryItemType.Banana,vinnie_InventoryItemType.ToolBox,vinnie_InventoryItemType.EightBall,vinnie_InventoryItemType.CD,vinnie_InventoryItemType.Underwear,vinnie_InventoryItemType.Key,vinnie_InventoryItemType.Cheese], shades : true});
	_g.set("NETTA",{ scene : vinnie_Scene12, inventory : [vinnie_InventoryItemType.Magnet,vinnie_InventoryItemType.Sword,vinnie_InventoryItemType.SkullThatOozesBloodIntermittently,vinnie_InventoryItemType.Diamond,vinnie_InventoryItemType.Banana,vinnie_InventoryItemType.ToolBox,vinnie_InventoryItemType.CD,vinnie_InventoryItemType.Underwear,vinnie_InventoryItemType.Key,vinnie_InventoryItemType.Cheese], shades : false});
	_g.set("RETTA",{ scene : vinnie_Scene12, inventory : [vinnie_InventoryItemType.Magnet,vinnie_InventoryItemType.Sword,vinnie_InventoryItemType.SkullThatOozesBloodIntermittently,vinnie_InventoryItemType.Diamond,vinnie_InventoryItemType.Banana,vinnie_InventoryItemType.ToolBox,vinnie_InventoryItemType.EightBall,vinnie_InventoryItemType.CD,vinnie_InventoryItemType.Underwear,vinnie_InventoryItemType.Key,vinnie_InventoryItemType.Cheese], shades : false});
	$r = _g;
	return $r;
}(this));
vinnie_Scene2.BUTTON_WIDTH = 41;
vinnie_Scene2.BUTTON_HEIGHT = 49;
vinnie_Scene2.BRIDGE_X = 47;
vinnie_Scene2.BRIDGE_Y = 31;
vinnie_Scene2.BRIDGE_PATTERN = [[null,false,null],[false,false,false],[true,true,false],[true,true,false],[false,false,false],[false,false,false],[null,false,null]];
vinnie_Vinnie.EXIT_URL = "http://www.reldni.com";
vinnie_Vinnie.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
