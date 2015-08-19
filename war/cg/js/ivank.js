
function Point(e, t) {
    if (!e) e = 0;
    if (!t) t = 0;
    this.x = e;
    this.y = t
}
function Rectangle(e, t, n, r) {
    this.x = e;
    this.y = t;
    this.width = n;
    this.height = r
}
function Transform() {
    this._obj = null;
    this._mdirty = false;
    this._vdirty = false;
    this._tmat = Point._m4.create();
    this._imat = Point._m4.create();
    this._atmat = Point._m4.create();
    this._aimat = Point._m4.create();
    this._cmat = Point._m4.create();
    this._cvec = Point._v4.create();
    this._cID = true;
    this._scaleX = 1;
    this._scaleY = 1;
    this._scaleZ = 1;
    this._rotationX = 0;
    this._rotationY = 0;
    this._rotationZ = 0
}
function EventDispatcher() {
    this.lsrs = {};
    this.cals = {}
}
function Event(e, t) {
    if (!t) t = false;
    this.type = e;
    this.target = null;
    this.currentTarget = null;
    this.bubbles = t
}
function MouseEvent(e, t) {
    Event.call(this, e, t);
    this.movementX = 0;
    this.movementY = 0
}
function TouchEvent(e, t) {
    Event.call(this, e, t);
    this.stageX = 0;
    this.stageY = 0;
    this.touchPointID = -1
}
function KeyboardEvent(e, t) {
    Event.call(this, e, t);
    this.altKey = false;
    this.ctrlKey = false;
    this.shiftKey = false;
    this.keyCode = 0;
    this.charCode = 0
}
function DisplayObject() {
    EventDispatcher.call(this);
    this.visible = true;
    this.parent = null;
    this.stage = null;
    this.transform = new Transform;
    this.transform._obj = this;
    this.blendMode = BlendMode.NORMAL;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this._brect = new Rectangle(0, 0, 0, 0);
    this._temp = new Float32Array(2);
    this._temp2 = new Float32Array(2);
    this._tempm = Point._m4.create();
    this._atsEv = new Event(Event.ADDED_TO_STAGE);
    this._rfsEv = new Event(Event.REMOVED_FROM_STAGE);
    this._atsEv.target = this._rfsEv.target = this
}
function InteractiveObject() {
    DisplayObject.call(this);
    this.buttonMode = false;
    this.mouseEnabled = true
}
function DisplayObjectContainer() {
    InteractiveObject.call(this);
    this.numChildren = 0;
    this.mouseChildren = true;
    this._children = [];
    this._brect2 = new Rectangle(0, 0, 0, 0)
}
function BitmapData(e) {
    this.width = 0;
    this.height = 0;
    this.rect = null;
    this.loader = new EventDispatcher;
    this.loader.bytesLoaded = 0;
    this.loader.bytesTotal = 0;
    this._img = null;
    this._texture = gl.createTexture();
    this._rwidth = 0;
    this._rheight = 0;
    this._tcBuffer = gl.createBuffer();
    this._vBuffer = gl.createBuffer();
    this._loaded = false;
    this._opEv = new Event(Event.OPEN);
    this._pgEv = new Event(Event.PROGRESS);
    this._cpEv = new Event(Event.COMPLETE);
    this._opEv.target = this._pgEv.target = this._cpEv.target = this.loader;
    if (e == null) return;
    this._img = document.createElement("img");
    var t = this,
        n = this._img;
    this._img.onload = function(e) {
        t._initFromImg(n, n.width, n.height);
        t.loader.dispatchEvent(t._cpEv)
    };
    this._img.src = e
}
function Bitmap(e) {
    DisplayObject.call(this);
    this.bitmapData = e
}
function Stage(e) {
    DisplayObjectContainer.call(this);
    document.body.style.margin = "0";
    var t = document.createElement("meta");
    t.setAttribute("name", "viewport");
    t.setAttribute("content", "width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0");
    document.getElementsByTagName("head")[0].appendChild(t);
    this.stage = this;
    this.stageWidth = 0;
    this.stageHeight = 0;
    this.focus = null;
    this._focii = [null, null, null];
    this._mousefocus = null;
    this._knM = false;
    this._mstack = new Stage._MStack;
    this._cmstack = new Stage._CMStack;
    this._sprg = null;
    this._pmat = Point._m4.create([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1]);
    this._umat = Point._m4.create([2, 0, 0, 0, 0, - 2, 0, 0, 0, 0, 2, 0, - 1, 1, 0, 1]);
    this._smat = Point._m4.create([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, .001, 0, 0, 0, 0, 1]);
    this._mcEvs = [new MouseEvent(MouseEvent.CLICK, true), new MouseEvent(MouseEvent.MIDDLE_CLICK, true), new MouseEvent(MouseEvent.RIGHT_CLICK, true)];
    this._mdEvs = [new MouseEvent(MouseEvent.MOUSE_DOWN, true), new MouseEvent(MouseEvent.MIDDLE_MOUSE_DOWN, true), new MouseEvent(MouseEvent.RIGHT_MOUSE_DOWN, true)];
    this._muEvs = [new MouseEvent(MouseEvent.MOUSE_UP, true), new MouseEvent(MouseEvent.MIDDLE_MOUSE_UP, true), new MouseEvent(MouseEvent.RIGHT_MOUSE_UP, true)];
    this._smd = [false, false, false];
    this._smu = [false, false, false];
    this._smm = false;
    this._srs = false;
    this._touches = [];
    for (var n = 0; n < 30; n++) this._touches.push({
        touch: null,
        target: null,
        act: 0
    });
    this._canvas = this.canvas = document.getElementById(e);
    Stage._main = this;
    var r = {
        alpha: true,
        antialias: true,
        depth: true,
        premultipliedAlpha: true
    };
    var i = this.canvas;
    gl = i.getContext("webgl", r);
    if (!gl) gl = i.getContext("experimental-webgl", r);
    if (!gl) alert("Could not initialize WebGL. Try to update your browser or graphic drivers.");
    var s = document;
    s.addEventListener("contextmenu", Stage._ctxt, false);
    s.addEventListener("dragstart", Stage._blck, false);
    if (Stage._isTD()) {
        i.addEventListener("touchstart", Stage._onTD, false);
        i.addEventListener("touchmove", Stage._onTM, false);
        i.addEventListener("touchend", Stage._onTU, false);
        s.addEventListener("touchstart", Stage._blck, false);
        s.addEventListener("touchmove", Stage._blck, false);
        s.addEventListener("touchend", Stage._blck, false)
    } else {
        i.addEventListener("mousedown", Stage._onMD, false);
        i.addEventListener("mousemove", Stage._onMM, false);
        i.addEventListener("mouseup", Stage._onMU, false)
    }
    s.addEventListener("keydown", Stage._onKD, false);
    s.addEventListener("keyup", Stage._onKU, false);
    s.addEventListener("keydown", Stage._blck, false);
    s.addEventListener("keyup", Stage._blck, false);
    window.addEventListener("resize", Stage._onRS, false);
    this._initShaders();
    this._initBuffers();
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    this._resize();
    this._srs = true;
    _requestAF(Stage._tick)
}
function Graphics() {
    this._conf = {
        ftype: 0,
        fbdata: null,
        fcolor: null,
        lwidth: 0,
        lcolor: null
    };
    this._points = [0, 0];
    this._fills = [];
    this._afills = [];
    this._rect = new Rectangle(0, 0, 0, 0);
    this._startNewFill()
}
function Sprite() {
    DisplayObjectContainer.call(this);
    this.graphics = new Graphics
}
function TextFormat(e, t, n, r, i, s, o) {
    this.font = e ? e : "Times new Roman";
    this.size = t ? t : 12;
    this.color = n ? n : 0;
    this.bold = r ? r : false;
    this.italic = i ? i : false;
    this.align = s ? s : TextFormatAlign.LEFT;
    this.leading = o ? o : 0;
    this.maxW = 0;
    this.data = {
        image: null,
        tw: 0,
        th: 0,
        rw: 0,
        rh: 0
    }
}
function TextField() {
    InteractiveObject.call(this);
    this._wordWrap = false;
    this._textW = 0;
    this._textH = 0;
    this._areaW = 100;
    this._areaH = 100;
    this._text = "";
    this._tForm = new TextFormat;
    this._rwidth = 0;
    this._rheight = 0;
    this._texture = gl.createTexture();
    this._tcArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0]);
    this._tcBuffer = gl.createBuffer();
    Stage._setBF(this._tcBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._tcArray, gl.STATIC_DRAW);
    this._fArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    this._vBuffer = gl.createBuffer();
    Stage._setBF(this._vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._fArray, gl.STATIC_DRAW);
    this._brect.x = this._brect.y = 0
}
window._requestAF = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e, t) {
        window.setTimeout(e, 1e3 / 60)
    }
}();
Point.prototype.add = function(e) {
    return new Point(this.x + e.x, this.y + e.y)
};
Point.prototype.clone = function() {
    return new Point(this.x, this.y)
};
Point.prototype.copyFrom = function(e) {
    this.x = e.x;
    this.y = e.y
};
Point.prototype.equals = function(e) {
    return this.x == e.x && this.y == e.y
};
Point.prototype.normalize = function(e) {
    var t = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x *= e / t;
    this.y *= e / t
};
Point.prototype.offset = function(e, t) {
    this.x += e;
    this.y += t
};
Point.prototype.setTo = function(e, t) {
    this.x = e;
    this.y = t
};
Point.prototype.subtract = function(e) {
    return new Point(this.x - e.x, this.y - e.y)
};
Point.distance = function(e, t) {
    return Point._distance(e.x, e.y, t.x, t.y)
};
Point.interpolate = function(e, t, n) {
    return new Point(e.x + n * (t.x - e.x), e.y + n * (t.y - e.y))
};
Point.polar = function(e, t) {
    return new Point(e * Math.cos(t), e * Math.sin(t))
};
Point._distance = function(e, t, n, r) {
    return Math.sqrt((n - e) * (n - e) + (r - t) * (r - t))
};
Point._v4 = {};
Point._m4 = {};
Point._v4.create = function() {
    var e = new Float32Array(4);
    return e
};
Point._m4.create = function(e) {
    var t = new Float32Array(16);
    t[0] = t[5] = t[10] = t[15] = 1;
    if (e) Point._m4.set(e, t);
    return t
};
Point._v4.add = function(e, t, n) {
    n[0] = e[0] + t[0];
    n[1] = e[1] + t[1];
    n[2] = e[2] + t[2];
    n[3] = e[3] + t[3]
};
Point._v4.set = function(e, t) {
    t[0] = e[0];
    t[1] = e[1];
    t[2] = e[2];
    t[3] = e[3]
};
Point._m4.set = function(e, t) {
    t[0] = e[0];
    t[1] = e[1];
    t[2] = e[2];
    t[3] = e[3];
    t[4] = e[4];
    t[5] = e[5];
    t[6] = e[6];
    t[7] = e[7];
    t[8] = e[8];
    t[9] = e[9];
    t[10] = e[10];
    t[11] = e[11];
    t[12] = e[12];
    t[13] = e[13];
    t[14] = e[14];
    t[15] = e[15]
};
Point._m4.multiply = function(e, t, n) {
    var r = e[0],
        i = e[1],
        s = e[2],
        o = e[3],
        u = e[4],
        a = e[5],
        f = e[6],
        l = e[7],
        c = e[8],
        h = e[9],
        p = e[10],
        d = e[11],
        v = e[12],
        m = e[13],
        g = e[14],
        y = e[15];
    var b = t[0],
        w = t[1],
        E = t[2],
        S = t[3];
    n[0] = b * r + w * u + E * c + S * v;
    n[1] = b * i + w * a + E * h + S * m;
    n[2] = b * s + w * f + E * p + S * g;
    n[3] = b * o + w * l + E * d + S * y;
    b = t[4];
    w = t[5];
    E = t[6];
    S = t[7];
    n[4] = b * r + w * u + E * c + S * v;
    n[5] = b * i + w * a + E * h + S * m;
    n[6] = b * s + w * f + E * p + S * g;
    n[7] = b * o + w * l + E * d + S * y;
    b = t[8];
    w = t[9];
    E = t[10];
    S = t[11];
    n[8] = b * r + w * u + E * c + S * v;
    n[9] = b * i + w * a + E * h + S * m;
    n[10] = b * s + w * f + E * p + S * g;
    n[11] = b * o + w * l + E * d + S * y;
    b = t[12];
    w = t[13];
    E = t[14];
    S = t[15];
    n[12] = b * r + w * u + E * c + S * v;
    n[13] = b * i + w * a + E * h + S * m;
    n[14] = b * s + w * f + E * p + S * g;
    n[15] = b * o + w * l + E * d + S * y;
    return n
};
Point._m4.inverse = function(e, t) {
    var n = e[0],
        r = e[1],
        i = e[2],
        s = e[3],
        o = e[4],
        u = e[5],
        a = e[6],
        f = e[7],
        l = e[8],
        c = e[9],
        h = e[10],
        p = e[11],
        d = e[12],
        v = e[13],
        m = e[14],
        g = e[15],
        y = n * u - r * o,
        b = n * a - i * o,
        w = n * f - s * o,
        E = r * a - i * u,
        S = r * f - s * u,
        x = i * f - s * a,
        T = l * v - c * d,
        N = l * m - h * d,
        C = l * g - p * d,
        k = c * m - h * v,
        L = c * g - p * v,
        A = h * g - p * m,
        O = y * A - b * L + w * k + E * C - S * N + x * T;
    if (!O) {
        return null
    }
    O = 1 / O;
    t[0] = (u * A - a * L + f * k) * O;
    t[1] = (i * L - r * A - s * k) * O;
    t[2] = (v * x - m * S + g * E) * O;
    t[3] = (h * S - c * x - p * E) * O;
    t[4] = (a * C - o * A - f * N) * O;
    t[5] = (n * A - i * C + s * N) * O;
    t[6] = (m * w - d * x - g * b) * O;
    t[7] = (l * x - h * w + p * b) * O;
    t[8] = (o * L - u * C + f * T) * O;
    t[9] = (r * C - n * L - s * T) * O;
    t[10] = (d * S - v * w + g * y) * O;
    t[11] = (c * w - l * S - p * y) * O;
    t[12] = (u * N - o * k - a * T) * O;
    t[13] = (n * k - r * N + i * T) * O;
    t[14] = (v * b - d * E - m * y) * O;
    t[15] = (l * E - c * b + h * y) * O;
    return t
};
Point._m4.multiplyVec2 = function(e, t, n) {
    var r = t[0],
        i = t[1];
    n[0] = r * e[0] + i * e[4] + e[12];
    n[1] = r * e[1] + i * e[5] + e[13]
};
Point._m4.multiplyVec4 = function(e, t, n) {
    var r = t[0],
        i = t[1],
        s = t[2],
        o = t[3];
    n[0] = e[0] * r + e[4] * i + e[8] * s + e[12] * o;
    n[1] = e[1] * r + e[5] * i + e[9] * s + e[13] * o;
    n[2] = e[2] * r + e[6] * i + e[10] * s + e[14] * o;
    n[3] = e[3] * r + e[7] * i + e[11] * s + e[15] * o
};
Rectangle.prototype.clone = function() {
    return new Rectangle(this.x, this.y, this.width, this.height)
};
Rectangle.prototype.contains = function(e, t) {
    return e >= this.x && e <= this.x + this.width && t >= this.y && t <= this.y + this.height
};
Rectangle.prototype.containsPoint = function(e) {
    return this.contains(e.x, e.y)
};
Rectangle.prototype.containsRect = function(e) {
    return this.x <= e.x && this.y <= e.y && e.x + e.width <= this.x + this.width && e.y + e.height <= this.y + this.height
};
Rectangle.prototype.copyFrom = function(e) {
    this.x = e.x;
    this.y = e.y;
    this.width = e.width;
    this.height = e.height
};
Rectangle.prototype.equals = function(e) {
    return this.x == e.x && this.y == e.y && this.width == e.width && this.height == e.height
};
Rectangle.prototype.inflate = function(e, t) {
    this.x -= e;
    this.y -= t;
    this.width += 2 * e;
    this.height += 2 * t
};
Rectangle.prototype.inflatePoint = function(e) {
    this.inflate(e.x, e.y)
};
Rectangle.prototype.intersection = function(e) {
    var t = Math.max(this.x, e.x);
    var n = Math.max(this.y, e.y);
    var r = Math.min(this.x + this.width, e.x + e.width);
    var i = Math.min(this.y + this.height, e.y + e.height);
    return new Rectangle(t, n, r - t, i - n)
};
Rectangle.prototype.intersects = function(e) {
    if (e.y + e.height < this.y || e.x > this.x + this.width || e.y > this.y + this.height || e.x + e.width < this.x) return false;
    return true
};
Rectangle.prototype.isEmpty = function() {
    return this.width <= 0 || this.height <= 0
};
Rectangle.prototype.offset = function(e, t) {
    this.x += e;
    this.y += t
};
Rectangle.prototype.offsetPoint = function(e) {
    this.offset(e.x, e.y)
};
Rectangle.prototype.setEmpty = function() {
    this.x = this.y = this.width = this.height = 0
};
Rectangle.prototype.setTo = function(e) {
    this.x = e.x;
    this.y = e.y;
    this.width = e.width;
    this.height = e.height
};
Rectangle.prototype.union = function(e) {
    if (this.isEmpty()) return e.clone();
    if (e.isEmpty()) return this.clone();
    var t = this.clone();
    t._unionWith(e);
    return t
};
Rectangle._temp = new Float32Array(2);
Rectangle.prototype._unionWith = function(e) {
    this._unionWP(e.x, e.y);
    this._unionWP(e.x + e.width, e.y + e.height)
};
Rectangle.prototype._unionWP = function(e, t) {
    var n = Math.min(this.x, e);
    var r = Math.min(this.y, t);
    this.width = Math.max(this.x + this.width, e) - n;
    this.height = Math.max(this.y + this.height, t) - r;
    this.x = n;
    this.y = r
};
Rectangle.prototype._setP = function(e, t) {
    this.x = e;
    this.y = t;
    this.width = this.height = 0
};
Rectangle.prototype._setAndTransform = function(e, t) {
    var n = Rectangle._temp;
    var r = Point._m4.multiplyVec2;
    n[0] = e.x;
    n[1] = e.y;
    r(t, n, n);
    this._setP(n[0], n[1]);
    n[0] = e.x + e.width;
    n[1] = e.y;
    r(t, n, n);
    this._unionWP(n[0], n[1]);
    n[0] = e.x;
    n[1] = e.y + e.height;
    r(t, n, n);
    this._unionWP(n[0], n[1]);
    n[0] = e.x + e.width;
    n[1] = e.y + e.height;
    r(t, n, n);
    this._unionWP(n[0], n[1])
};
Transform.prototype._getTMat = function() {
    var e = this._obj;
    var t = this._tmat;
    this._checkMat();
    t[12] = e.x;
    t[13] = e.y;
    t[14] = e.z;
    return t
};
Transform.prototype._getIMat = function() {
    Point._m4.inverse(this._getTMat(), this._imat);
    return this._imat
};
Transform.prototype._valsToMat = function() {
    var e = this._tmat;
    var t = this._scaleX;
    var n = this._scaleY;
    var r = this._scaleZ;
    var i = -.01745329252;
    var s = this._rotationX * i;
    var o = this._rotationY * i;
    var u = this._rotationZ * i;
    var a = Math.cos(s),
        f = Math.cos(o),
        l = Math.cos(u);
    var c = Math.sin(s),
        h = Math.sin(o),
        p = Math.sin(u);
    e[0] = f * l * t;
    e[1] = -f * p * t;
    e[2] = h * t;
    e[4] = (a * p + c * h * l) * n;
    e[5] = (a * l - c * h * p) * n;
    e[6] = -c * f * n;
    e[8] = (c * p - a * h * l) * r;
    e[9] = (c * l + a * h * p) * r;
    e[10] = a * f * r
};
Transform.prototype._matToVals = function() {
    var e = this._tmat;
    var t = e[0],
        n = e[1],
        r = e[2],
        i = e[4],
        s = e[5],
        o = e[6],
        u = e[8],
        a = e[9],
        f = e[10];
    this._scaleX = Math.sqrt(t * t + n * n + r * r);
    this._scaleY = Math.sqrt(i * i + s * s + o * o);
    this._scaleZ = Math.sqrt(u * u + a * a + f * f);
    var l = 1 / this._scaleX,
        c = 1 / this._scaleY,
        h = 1 / this._scaleZ;
    t *= l;
    n *= l;
    r *= l;
    i *= c;
    s *= c;
    o *= c;
    u *= h;
    a *= h;
    f *= h;
    var p = -57.29577951308;
    this._rotationX = p * Math.atan2(-o, f);
    this._rotationY = p * Math.atan2(r, Math.sqrt(o * o + f * f));
    this._rotationZ = p * Math.atan2(-n, t)
};
Transform.prototype._checkVals = function() {
    if (this._vdirty) {
        this._matToVals();
        this._vdirty = false
    }
};
Transform.prototype._checkMat = function() {
    if (this._mdirty) {
        this._valsToMat();
        this._mdirty = false
    }
};
Transform.prototype._setOPos = function(e) {
    var e = this._tmat;
    this._obj.x = e[12];
    this._obj.y = e[13];
    this._obj.z = e[14]
};
Transform.prototype._checkColorID = function() {
    var e = this._cmat;
    var t = this._cvec;
    this._cID = e[15] == 1 && e[0] == 1 && e[1] == 0 && e[2] == 0 && e[3] == 0 && e[4] == 0 && e[5] == 1 && e[6] == 0 && e[7] == 0 && e[8] == 0 && e[9] == 0 && e[10] == 1 && e[11] == 0 && e[12] == 0 && e[13] == 0 && e[14] == 0 && e[15] == 1 && t[0] == 0 && t[1] == 0 && t[2] == 0 && t[3] == 0
};
Transform.prototype._setMat3 = function(e) {
    var t = this._tmat;
    t[0] = e[0];
    t[1] = e[1];
    t[4] = e[3];
    t[5] = e[4];
    t[12] = e[6];
    t[13] = e[7]
};
Transform.prototype._getMat3 = function(e) {
    var t = this._tmat;
    e[0] = t[0];
    e[1] = t[1];
    e[3] = t[4];
    e[4] = t[5];
    e[6] = t[12];
    e[7] = t[13]
};
Transform.prototype._setCMat5 = function(e) {
    var t = this._cmat,
        n = this._cvec;
    for (var r = 0; r < 4; r++) {
        n[r] = e[20 + r];
        for (var i = 0; i < 4; i++) t[4 * r + i] = e[5 * r + i]
    }
};
Transform.prototype._getCMat5 = function(e) {
    var t = this._cmat,
        n = this._cvec;
    e[24] = 1;
    for (var r = 0; r < 4; r++) {
        e[20 + r] = n[r];
        for (var i = 0; i < 4; i++) e[5 * r + i] = t[4 * r + i]
    }
};
Transform.prototype.__defineSetter__("matrix", function(e) {
    this._checkMat();
    this._setMat3(e);
    this._setOPos();
    this._vdirty = true
});
Transform.prototype.__defineGetter__("matrix", function() {
    this._checkMat();
    var e = new Float32Array(9);
    this._getMat3(e);
    return e
});
Transform.prototype.__defineSetter__("matrix3D", function(e) {
    this._checkMat();
    Point._m4.set(e, this._tmat);
    this._setOPos();
    this._vdirty = true
});
Transform.prototype.__defineGetter__("matrix3D", function() {
    this._checkMat();
    return Point._m4.create(this._getTMat())
});
Transform.prototype.__defineSetter__("colorTransform", function(e) {
    this._setCMat5(e);
    this._checkColorID()
});
Transform.prototype.__defineGetter__("colorTransform", function() {
    var e = new Float32Array(25);
    this._getCMat5(e);
    return e
});
EventDispatcher.efbc = [];
EventDispatcher.prototype.hasEventListener = function(e) {
    var t = this.lsrs[e];
    if (t == null) return false;
    return t.length > 0
};
EventDispatcher.prototype.addEventListener = function(e, t) {
    this.addEventListener2(e, t, null)
};
EventDispatcher.prototype.addEventListener2 = function(e, t, n) {
    if (this.lsrs[e] == null) {
        this.lsrs[e] = [];
        this.cals[e] = []
    }
    this.lsrs[e].push(t);
    this.cals[e].push(n);
    if (e == Event.ENTER_FRAME) {
        var r = EventDispatcher.efbc;
        if (r.indexOf(this) < 0) r.push(this)
    }
};
EventDispatcher.prototype.removeEventListener = function(e, t) {
    var n = this.lsrs[e];
    if (n == null) return;
    var r = n.indexOf(t);
    if (r < 0) return;
    var i = this.cals[e];
    n.splice(r, 1);
    i.splice(r, 1);
    if (e == Event.ENTER_FRAME && n.length == 0) {
        var s = EventDispatcher.efbc;
        s.splice(s.indexOf(this), 1)
    }
};
EventDispatcher.prototype.dispatchEvent = function(e) {
    e.currentTarget = this;
    if (e.target == null) e.target = this;
    var t = this.lsrs[e.type];
    if (t == null) return;
    var n = this.cals[e.type];
    for (var r = 0; r < t.length; r++) {
        if (n[r] == null) t[r](e);
        else t[r].call(n[r], e)
    }
};
Event.ENTER_FRAME = "enterFrame";
Event.RESIZE = "resize";
Event.ADDED_TO_STAGE = "addedToStage";
Event.REMOVED_FROM_STAGE = "removedFromStage";
Event.CHANGE = "change";
Event.OPEN = "open";
Event.PROGRESS = "progress";
Event.COMPLETE = "complete";
MouseEvent.prototype = new Event;
MouseEvent.CLICK = "click";
MouseEvent.MOUSE_DOWN = "mouseDown";
MouseEvent.MOUSE_UP = "mouseUp";
MouseEvent.MIDDLE_CLICK = "middleClick";
MouseEvent.MIDDLE_MOUSE_DOWN = "middleMouseDown";
MouseEvent.MIDDLE_MOUSE_UP = "middleMouseUp";
MouseEvent.RIGHT_CLICK = "rightClick";
MouseEvent.RIGHT_MOUSE_DOWN = "rightMouseDown";
MouseEvent.RIGHT_MOUSE_UP = "rightMouseUp";
MouseEvent.MOUSE_MOVE = "mouseMove";
MouseEvent.MOUSE_OVER = "mouseOver";
MouseEvent.MOUSE_OUT = "mouseOut";
TouchEvent.prototype = new Event;
TouchEvent.prototype._setFromDom = function(e) {
    var t = window.devicePixelRatio || 1;
    this.stageX = e.clientX * t;
    this.stageY = e.clientY * t;
    this.touchPointID = e.identifier
};
TouchEvent.TOUCH_BEGIN = "touchBegin";
TouchEvent.TOUCH_END = "touchEnd";
TouchEvent.TOUCH_MOVE = "touchMove";
TouchEvent.TOUCH_OUT = "touchOut";
TouchEvent.TOUCH_OVER = "touchOver";
TouchEvent.TOUCH_TAP = "touchTap";
KeyboardEvent.prototype = new Event;
KeyboardEvent.prototype._setFromDom = function(e) {
    this.altKey = e.altKey;
    this.ctrlKey = e.ctrlKey;
    this.shiftKey = e.ShiftKey;
    this.keyCode = e.keyCode;
    this.charCode = e.charCode
};
KeyboardEvent.KEY_DOWN = "keyDown";
KeyboardEvent.KEY_UP = "keyUp";
var BlendMode = {
    NORMAL: "normal",
    ADD: "add",
    SUBTRACT: "subtract",
    MULTIPLY: "multiply",
    SCREEN: "screen",
    ERASE: "erase",
    ALPHA: "alpha"
};
DisplayObject.prototype = new EventDispatcher;
DisplayObject.prototype.dispatchEvent = function(e) {
    EventDispatcher.prototype.dispatchEvent.call(this, e);
    if (e.bubbles && this.parent != null) this.parent.dispatchEvent(e)
};
DisplayObject.prototype.globalToLocal = function(e) {
    var t = this._temp;
    t[0] = e.x;
    t[1] = e.y;
    Point._m4.multiplyVec2(this._getAIMat(), t, t);
    return new Point(t[0], t[1])
};
DisplayObject.prototype.localToGlobal = function(e) {
    var t = this._temp;
    t[0] = e.x;
    t[1] = e.y;
    Point._m4.multiplyVec2(this._getATMat(), t, t);
    return new Point(t[0], t[1])
};
DisplayObject.prototype.hitTestPoint = function(e) {
    var t = this._temp2;
    t[0] = e.x;
    t[1] = e.y;
    Point._m4.multiplyVec2(this._getAIMat(), t, t);
    Point._m4.multiplyVec2(this.transform._getTMat(), t, t);
    return this._htpLocal(t)
};
DisplayObject.prototype.hitTestObject = function(e) {
    var t = this._getRect(false);
    var n = e._getRect(false);
    if (!t || !n) return false;
    var r = this._getATMat();
    var i = e._getATMat();
    var s = t.clone(),
        o = n.clone();
    s._setAndTransform(t, r);
    o._setAndTransform(n, i);
    return s.intersects(o)
};
DisplayObject.prototype.getRect = function(e) {
    return this._makeRect(false, e)
};
DisplayObject.prototype.getBounds = function(e) {
    return this._makeRect(true, e)
};
DisplayObject.prototype._makeRect = function(e, t) {
    var n = this._getRect(e);
    Point._m4.multiply(this._getATMat(), t._getAIMat(), this._tempm);
    var r = new Rectangle(6710886.4, 6710886.4, 0, 0);
    if (n) r._setAndTransform(n, this._tempm);
    return r
};
DisplayObject.prototype._getRect = function(e) {
    return this._brect
};
DisplayObject.prototype._htpLocal = function(e) {
    var t = this._temp;
    Point._m4.multiplyVec2(this.transform._getIMat(), e, t);
    var n = this._getRect();
    if (n == null) return false;
    return n.contains(t[0], t[1])
};
DisplayObject.prototype._getTarget = function(e, t) {
    return null
};
DisplayObject.prototype._setStage = function(e) {
    var t = this.stage;
    this.stage = e;
    if (t == null && e != null) this.dispatchEvent(this._atsEv);
    if (t != null && e == null) this.dispatchEvent(this._rfsEv)
};
DisplayObject.prototype._preRender = function(e) {
    var t = this.transform._getTMat();
    e._mstack.push(t);
    e._cmstack.push(this.transform._cmat, this.transform._cvec, this.transform._cID, this.blendMode)
};
DisplayObject.prototype._render = function(e) {};
DisplayObject.prototype._renderAll = function(e) {
    if (!this.visible) return;
    this._preRender(e);
    this._render(e);
    e._mstack.pop();
    e._cmstack.pop()
};
DisplayObject.prototype._getATMat = function() {
    if (this.parent == null) return this.transform._getTMat();
    Point._m4.multiply(this.parent.transform._getTMat(), this.transform._getTMat(), this.transform._atmat);
    return this.transform._atmat
};
DisplayObject.prototype._getAIMat = function() {
    if (this.parent == null) return this.transform._getIMat();
    Point._m4.multiply(this.transform._getIMat(), this.parent._getAIMat(), this.transform._aimat);
    return this.transform._aimat
};
DisplayObject.prototype._getMouse = function() {
    var e = this._temp;
    e[0] = Stage._mouseX;
    e[1] = Stage._mouseY;
    Point._m4.multiplyVec2(this._getAIMat(), e, e);
    return e
};
this.dp = DisplayObject.prototype;
dp.ds = dp.__defineSetter__;
dp.dg = dp.__defineGetter__;
dp.ds("scaleX", function(e) {
    this.transform._checkVals();
    this.transform._scaleX = e;
    this.transform._mdirty = true
});
dp.ds("scaleY", function(e) {
    this.transform._checkVals();
    this.transform._scaleY = e;
    this.transform._mdirty = true
});
dp.ds("scaleZ", function(e) {
    this.transform._checkVals();
    this.transform._scaleZ = e;
    this.transform._mdirty = true
});
dp.dg("scaleX", function() {
    this.transform._checkVals();
    return this.transform._scaleX
});
dp.dg("scaleY", function() {
    this.transform._checkVals();
    return this.transform._scaleY
});
dp.dg("scaleZ", function() {
    this.transform._checkVals();
    return this.transform._scaleZ
});
dp.ds("rotationX", function(e) {
    this.transform._checkVals();
    this.transform._rotationX = e;
    this.transform._mdirty = true
});
dp.ds("rotationY", function(e) {
    this.transform._checkVals();
    this.transform._rotationY = e;
    this.transform._mdirty = true
});
dp.ds("rotationZ", function(e) {
    this.transform._checkVals();
    this.transform._rotationZ = e;
    this.transform._mdirty = true
});
dp.ds("rotation", function(e) {
    this.transform._checkVals();
    this.transform._rotationZ = e;
    this.transform._mdirty = true
});
dp.dg("rotationX", function() {
    this.transform._checkVals();
    return this.transform._rotationX
});
dp.dg("rotationY", function() {
    this.transform._checkVals();
    return this.transform._rotationY
});
dp.dg("rotationZ", function() {
    this.transform._checkVals();
    return this.transform._rotationZ
});
dp.dg("rotation", function() {
    this.transform._checkVals();
    return this.transform._rotationZ
});
dp.ds("alpha", function(e) {
    this.transform._cmat[15] = e;
    this.transform._checkColorID()
});
dp.dg("alpha", function() {
    return this.transform._cmat[15]
});
dp.dg("mouseX", function() {
    return this._getMouse()[0]
});
dp.dg("mouseY", function() {
    return this._getMouse()[1]
});
delete dp.ds;
delete dp.dg;
delete this.dp;
InteractiveObject.prototype = new DisplayObject;
InteractiveObject.prototype._getTarget = function(e, t) {
    if (!this.visible || !this.mouseEnabled) return null;
    var n = this._getRect();
    if (n == null) return null;
    var r = this._temp;
    r[0] = e;
    r[1] = t;
    Point._m4.multiplyVec2(this.transform._getIMat(), r, r);
    if (n.contains(r[0], r[1])) return this;
    return null
};
DisplayObjectContainer.prototype = new InteractiveObject;
DisplayObjectContainer.prototype.addChild = function(e) {
    this._children.push(e);
    e.parent = this;
    e._setStage(this.stage);
    ++this.numChildren
};
DisplayObjectContainer.prototype.removeChild = function(e) {
    var t = this._children.indexOf(e);
    if (t < 0) return;
    this._children.splice(t, 1);
    e.parent = null;
    e._setStage(null);
    --this.numChildren
};
DisplayObjectContainer.prototype.removeChildAt = function(e) {
    this.removeChild(this._children[e])
};
DisplayObjectContainer.prototype.contains = function(e) {
    return this._children.indexOf(e) >= 0
};
DisplayObjectContainer.prototype.getChildIndex = function(e) {
    return this._children.indexOf(e)
};
DisplayObjectContainer.prototype.setChildIndex = function(e, t) {
    var n = this._children.indexOf(e);
    if (t > n) {
        for (var r = n + 1; r <= t; r++) this._children[r - 1] = this._children[r];
        this._children[t] = e
    } else if (t < n) {
        for (var r = n - 1; r >= t; r--) this._children[r + 1] = this._children[r];
        this._children[t] = e
    }
};
DisplayObjectContainer.prototype.getChildAt = function(e) {
    return this._children[e]
};
DisplayObjectContainer.prototype._render = function(e) {
    for (var t = 0; t < this.numChildren; t++) this._children[t]._renderAll(e)
};
DisplayObjectContainer.prototype._getTarget = function(e, t) {
    if (!this.visible || !this.mouseChildren && !this.mouseEnabled) return null;
    var n = this._temp;
    n[0] = e;
    n[1] = t;
    Point._m4.multiplyVec2(this.transform._getIMat(), n, n);
    var r = n[0],
        i = n[1];
    var s = null;
    var o = this.numChildren - 1;
    for (var u = o; u > -1; u--) {
        var a = this._children[u]._getTarget(r, i);
        if (a != null) {
            s = a;
            break
        }
    }
    if (!this.mouseChildren && s != null) return this;
    return s
};
DisplayObjectContainer.prototype._getTarget = function(e, t) {
    if (!this.visible || !this.mouseChildren && !this.mouseEnabled) return null;
    var n = this._temp;
    n[0] = e;
    n[1] = t;
    Point._m4.multiplyVec2(this.transform._getIMat(), n, n);
    var r = n[0],
        i = n[1];
    var s = null;
    var o = this.numChildren - 1;
    for (var u = o; u > -1; u--) {
        var a = this._children[u]._getTarget(r, i);
        if (a != null) {
            s = a;
            break
        }
    }
    if (!this.mouseChildren && s != null) return this;
    return s
};
DisplayObjectContainer.prototype._htpLocal = function(e) {
    var t = this._temp;
    Point._m4.multiplyVec2(this.transform._getIMat(), e, t);
    var n = this._children.length;
    for (var r = 0; r < n; r++) {
        var i = this._children[r];
        if (i.visible) if (i._htpLocal(t)) return true
    }
    return false
};
DisplayObjectContainer.prototype._setStage = function(e) {
    InteractiveObject.prototype._setStage.call(this, e);
    for (var t = 0; t < this.numChildren; t++) this._children[t]._setStage(e)
};
DisplayObjectContainer.prototype._getRect = function(e) {
    if (this.numChildren == 0) return null;
    var t = null;
    var n = this._brect2;
    for (var r = 0; r < this.numChildren; r++) {
        var i = this._children[r];
        var s = i._getRect(e);
        if (!i.visible || s == null) continue;
        if (t == null) {
            t = this._brect;
            t._setAndTransform(s, i.transform._getTMat())
        } else {
            n._setAndTransform(s, i.transform._getTMat());
            t._unionWith(n)
        }
    }
    return t
};
BitmapData.empty = function(e, t) {
    var n = new BitmapData(null);
    n._initFromImg(null, e, t);
    return n
};
BitmapData.prototype.setPixels = function(e, t) {
    Stage._setTEX(this._texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, e.x, e.y, e.width, e.height, gl.RGBA, gl.UNSIGNED_BYTE, t);
    gl.generateMipmap(gl.TEXTURE_2D)
};
BitmapData.prototype.getPixels = function(e, t) {
    if (!t) t = new Uint8Array(e.width * e.height * 4);
    this._setTexAsFB();
    gl.readPixels(e.x, e.y, e.width, e.height, gl.RGBA, gl.UNSIGNED_BYTE, t);
    Stage._main._setFramebuffer(null, Stage._main.stageWidth, Stage._main.stageHeight, false);
    return t
};
BitmapData.prototype.draw = function(e) {
    this._setTexAsFB();
    e._render(Stage._main);
    Stage._main._setFramebuffer(null, Stage._main.stageWidth, Stage._main.stageHeight, false);
    Stage._setTEX(this._texture);
    gl.generateMipmap(gl.TEXTURE_2D)
};
BitmapData.prototype._setTexAsFB = function() {
    if (BitmapData._fbo == null) {
        BitmapData._fbo = gl.createFramebuffer();
        var e = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, e);
        gl.bindFramebuffer(gl.FRAMEBUFFER, BitmapData._fbo);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, e)
    }
    Stage._main._setFramebuffer(BitmapData._fbo, this._rwidth, this._rheight, true);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0)
};
BitmapData.prototype._initFromImg = function(e, t, n) {
    this._loaded = true;
    this.width = t;
    this.height = n;
    this._rwidth = BitmapData._nhpot(t);
    this._rheight = BitmapData._nhpot(n);
    this.rect = new Rectangle(0, 0, t, n);
    var r = t / this._rwidth;
    var i = n / this._rheight;
    Stage._setBF(this._tcBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, r, 0, 0, i, r, i]), gl.STATIC_DRAW);
    Stage._setBF(this._vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, t, 0, 0, 0, n, 0, t, n, 0]), gl.STATIC_DRAW);
    var s = BitmapData._canv;
    s.width = this._rwidth;
    s.height = this._rheight;
    var o = BitmapData._ctx;
    if (e != null) o.drawImage(e, 0, 0);
    var u = o.getImageData(0, 0, this._rwidth, this._rheight);
    Stage._setTEX(this._texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, u);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D)
};
BitmapData._canv = document.createElement("canvas");
BitmapData._ctx = BitmapData._canv.getContext("2d");
BitmapData._ipot = function(e) {
    return (e & e - 1) == 0
};
BitmapData._nhpot = function(e) {
    --e;
    for (var t = 1; t < 32; t <<= 1) e = e | e >> t;
    return e + 1
};
Bitmap.prototype = new InteractiveObject;
Bitmap.prototype._getRect = function() {
    return this.bitmapData.rect
};
Bitmap.prototype._render = function(e) {
    var t = this.bitmapData;
    if (!t._loaded) return;
    gl.uniformMatrix4fv(e._sprg.tMatUniform, false, e._mstack.top());
    e._cmstack.update();
    Stage._setVC(t._vBuffer);
    Stage._setTC(t._tcBuffer);
    Stage._setUT(1);
    Stage._setTEX(t._texture);
    Stage._setEBF(e._unitIBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
};
var gl;
Stage.prototype = new DisplayObjectContainer;
Stage._mouseX = 0;
Stage._mouseY = 0;
Stage._curBF = -1;
Stage._curEBF = -1;
Stage._curVC = -1;
Stage._curTC = -1;
Stage._curUT = -1;
Stage._curTEX = -1;
Stage._curBMD = "normal";
Stage._setBF = function(e) {
    if (Stage._curBF != e) {
        gl.bindBuffer(gl.ARRAY_BUFFER, e);
        Stage._curBF = e
    }
};
Stage._setEBF = function(e) {
    if (Stage._curEBF != e) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, e);
        Stage._curEBF = e
    }
};
Stage._setVC = function(e) {
    if (Stage._curVC != e) {
        gl.bindBuffer(gl.ARRAY_BUFFER, e);
        gl.vertexAttribPointer(Stage._main._sprg.vpa, 3, gl.FLOAT, false, 0, 0);
        Stage._curVC = Stage._curBF = e
    }
};
Stage._setTC = function(e) {
    if (Stage._curTC != e) {
        gl.bindBuffer(gl.ARRAY_BUFFER, e);
        gl.vertexAttribPointer(Stage._main._sprg.tca, 2, gl.FLOAT, false, 0, 0);
        Stage._curTC = Stage._curBF = e
    }
};
Stage._setUT = function(e) {
    if (Stage._curUT != e) {
        gl.uniform1i(Stage._main._sprg.useTex, e);
        Stage._curUT = e
    }
};
Stage._setTEX = function(e) {
    if (Stage._curTEX != e) {
        gl.bindTexture(gl.TEXTURE_2D, e);
        Stage._curTEX = e
    }
};
Stage._setBMD = function(e) {
    if (Stage._curBMD != e) {
        if (e == BlendMode.NORMAL) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        } else if (e == BlendMode.MULTIPLY) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA)
        } else if (e == BlendMode.ADD) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE)
        } else if (e == BlendMode.SUBTRACT) {
            gl.blendEquationSeparate(gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE)
        } else if (e == BlendMode.SCREEN) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR)
        } else if (e == BlendMode.ERASE) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA)
        } else if (e == BlendMode.ALPHA) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ZERO, gl.SRC_ALPHA)
        }
        Stage._curBMD = e
    }
};
Stage._okKeys = [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 13, 16, 18, 27];
Stage._isTD = function() {
    return !!("ontouchstart" in window)
};
Stage._ctxt = function(e) {
    if (Stage._main.hasEventListener(MouseEvent.RIGHT_CLICK)) e.preventDefault()
};
Stage._onTD = function(e) {
    Stage._setStageMouse(e.touches.item(0));
    Stage._main._smd[0] = true;
    Stage._main._knM = true;
    var t = Stage._main;
    for (var n = 0; n < e.changedTouches.length; n++) {
        var r = e.changedTouches.item(n);
        var i = t._touches[r.identifier];
        i.touch = r;
        i.act = 1
    }
};
Stage._onTM = function(e) {
    Stage._setStageMouse(e.touches.item(0));
    Stage._main._smm = true;
    Stage._main._knM = true;
    var t = Stage._main;
    for (var n = 0; n < e.changedTouches.length; n++) {
        var r = e.changedTouches.item(n);
        var i = t._touches[r.identifier];
        i.touch = r;
        i.act = 2
    }
};
Stage._onTU = function(e) {
    Stage._main._smu[0] = true;
    Stage._main._knM = true;
    var t = Stage._main;
    for (var n = 0; n < e.changedTouches.length; n++) {
        var r = e.changedTouches.item(n);
        var i = t._touches[r.identifier];
        i.touch = r;
        i.act = 3
    }
};
Stage._onMD = function(e) {
    Stage._setStageMouse(e);
    Stage._main._smd[e.button] = true;
    Stage._main._knM = true
};
Stage._onMM = function(e) {
    Stage._setStageMouse(e);
    Stage._main._smm = true;
    Stage._main._knM = true
};
Stage._onMU = function(e) {
    Stage._main._smu[e.button] = true;
    Stage._main._knM = true
};
Stage._onKD = function(e) {
    var t = Stage._main;
    var n = new KeyboardEvent(KeyboardEvent.KEY_DOWN, true);
    n._setFromDom(e);
    if (t.focus && t.focus.stage) t.focus.dispatchEvent(n);
    else t.dispatchEvent(n)
};
Stage._onKU = function(e) {
    var t = Stage._main;
    var n = new KeyboardEvent(KeyboardEvent.KEY_UP, true);
    n._setFromDom(e);
    if (t.focus && t.focus.stage) t.focus.dispatchEvent(n);
    else t.dispatchEvent(n)
};
Stage._blck = function(e) {
    if (e.keyCode != null) {
        if (Stage._okKeys.indexOf(e.keyCode) == -1) e.preventDefault()
    } else e.preventDefault()
};
Stage._onRS = function(e) {
    Stage._main._srs = true
};
Stage.prototype._resize = function() {
    var e = window.devicePixelRatio || 1;
    var t = window.innerWidth * e;
    var n = window.innerHeight * e;
    this._canvas.style.width = window.innerWidth + "px";
    this._canvas.style.height = window.innerHeight + "px";
    this.stageWidth = t;
    this.stageHeight = n;
    this._canvas.width = t;
    this._canvas.height = n;
    this._setFramebuffer(null, t, n, false)
};
Stage.prototype._getShader = function(e, t, n) {
    var r;
    if (n) r = e.createShader(e.FRAGMENT_SHADER);
    else r = e.createShader(e.VERTEX_SHADER);
    e.shaderSource(r, t);
    e.compileShader(r);
    if (!e.getShaderParameter(r, e.COMPILE_STATUS)) {
        alert(e.getShaderInfoLog(r));
        return null
    }
    return r
};
Stage.prototype._initShaders = function() {
    var e = "			precision mediump float;			varying vec2 texCoord;						uniform sampler2D uSampler;			uniform vec4 color;			uniform bool useTex;						uniform mat4 cMat;			uniform vec4 cVec;						void main(void) {				vec4 c = useTex ? texture2D(uSampler, texCoord) : color;				c = (cMat*c)+cVec;\n				c.xyz *= min(c.w, 1.0);\n				gl_FragColor = c;			}";
    var t = "			attribute vec3 verPos;			attribute vec2 texPos;						uniform mat4 tMat;						varying vec2 texCoord;						void main(void) {				gl_Position = tMat * vec4(verPos, 1.0);				texCoord = texPos;			}";
    var n = this._getShader(gl, e, true);
    var r = this._getShader(gl, t, false);
    this._sprg = gl.createProgram();
    gl.attachShader(this._sprg, r);
    gl.attachShader(this._sprg, n);
    gl.linkProgram(this._sprg);
    if (!gl.getProgramParameter(this._sprg, gl.LINK_STATUS)) {
        alert("Could not initialise shaders")
    }
    gl.useProgram(this._sprg);
    this._sprg.vpa = gl.getAttribLocation(this._sprg, "verPos");
    this._sprg.tca = gl.getAttribLocation(this._sprg, "texPos");
    gl.enableVertexAttribArray(this._sprg.tca);
    gl.enableVertexAttribArray(this._sprg.vpa);
    this._sprg.tMatUniform = gl.getUniformLocation(this._sprg, "tMat");
    this._sprg.cMatUniform = gl.getUniformLocation(this._sprg, "cMat");
    this._sprg.cVecUniform = gl.getUniformLocation(this._sprg, "cVec");
    this._sprg.samplerUniform = gl.getUniformLocation(this._sprg, "uSampler");
    this._sprg.useTex = gl.getUniformLocation(this._sprg, "useTex");
    this._sprg.color = gl.getUniformLocation(this._sprg, "color")
};
Stage.prototype._initBuffers = function() {
    this._unitIBuffer = gl.createBuffer();
    Stage._setEBF(this._unitIBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 1, 2, 3]), gl.STATIC_DRAW)
};
Stage.prototype._setFramebuffer = function(e, t, n, r) {
    this._mstack.clear();
    this._mstack.push(this._pmat, 0);
    if (r) {
        this._umat[5] = 2;
        this._umat[13] = -1
    } else {
        this._umat[5] = -2;
        this._umat[13] = 1
    }
    this._mstack.push(this._umat);
    this._smat[0] = 1 / t;
    this._smat[5] = 1 / n;
    this._mstack.push(this._smat);
    gl.bindFramebuffer(gl.FRAMEBUFFER, e);
    if (e) gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, t, n);
    gl.viewport(0, 0, t, n)
};
Stage._setStageMouse = function(e) {
    var t = window.devicePixelRatio || 1;
    Stage._mouseX = e.clientX * t;
    Stage._mouseY = e.clientY * t
};
Stage.prototype._drawScene = function() {
    if (this._srs) {
        this._resize();
        this.dispatchEvent(new Event(Event.RESIZE));
        this._srs = false
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (this._knM) {
        var e = this._getTarget(Stage._mouseX, Stage._mouseY);
        var t = this._mousefocus || this;
        var n = e || this;
        if (e != this._mousefocus) {
            if (t != this) {
                var r = new MouseEvent(MouseEvent.MOUSE_OUT, true);
                r.target = t;
                t.dispatchEvent(r)
            }
            if (n != this) {
                var r = new MouseEvent(MouseEvent.MOUSE_OVER, true);
                r.target = n;
                n.dispatchEvent(r)
            }
        }
        for (var i = 0; i < 3; i++) {
            this._mcEvs[i].target = this._mdEvs[i].target = this._muEvs[i].target = n;
            if (this._smd[i]) {
                n.dispatchEvent(this._mdEvs[i]);
                this._focii[i] = this.focus = e
            }
            if (this._smu[i]) {
                n.dispatchEvent(this._muEvs[i]);
                if (e == this._focii[i]) n.dispatchEvent(this._mcEvs[i])
            }
            this._smd[i] = this._smu[i] = false
        }
        if (this._smm) {
            var r = new MouseEvent(MouseEvent.MOUSE_MOVE, true);
            r.target = n;
            n.dispatchEvent(r);
            this._smm = false
        }
        this._mousefocus = e;
        var s = false,
            o = n;
        while (o.parent != null) {
            s |= o.buttonMode;
            o = o.parent
        }
        this._canvas.style.cursor = s ? "pointer" : "default"
    }
    var u = window.devicePixelRatio || 1;
    for (var i = 0; i < this._touches.length; i++) {
        var a = this._touches[i];
        if (a.act == 0) continue;
        var e = this._getTarget(a.touch.clientX * u, a.touch.clientY * u);
        var t = a.target || this;
        var n = e || this;
        if (e != a.target) {
            if (t != this) {
                var r = new TouchEvent(TouchEvent.TOUCH_OUT, true);
                r._setFromDom(a.touch);
                r.target = t;
                t.dispatchEvent(r)
            }
            if (n != this) {
                var r = new TouchEvent(TouchEvent.TOUCH_OVER, true);
                r._setFromDom(a.touch);
                r.target = n;
                n.dispatchEvent(r)
            }
        }
        var r;
        if (a.act == 1) r = new TouchEvent(TouchEvent.TOUCH_BEGIN, true);
        if (a.act == 2) r = new TouchEvent(TouchEvent.TOUCH_MOVE, true);
        if (a.act == 3) r = new TouchEvent(TouchEvent.TOUCH_END, true);
        r._setFromDom(a.touch);
        r.target = n;
        n.dispatchEvent(r);
        if (a.act == 3 && e == a.target) {
            r = new TouchEvent(TouchEvent.TOUCH_TAP, true);
            r._setFromDom(a.touch);
            r.target = n;
            n.dispatchEvent(r)
        }
        a.act = 0;
        a.target = a.act == 3 ? null : e
    }
    var f = EventDispatcher.efbc;
    var r = new Event(Event.ENTER_FRAME, true);
    for (var i = 0; i < f.length; i++) {
        r.target = f[i];
        f[i].dispatchEvent(r)
    }
    this._renderAll(this)
};
Stage._tick = function() {
    _requestAF(Stage._tick);
    Stage.prototype._drawScene.call(Stage._main)
};
Stage._MStack = function() {
    this.mats = [];
    this.size = 1;
    for (var e = 0; e < 30; e++) this.mats.push(Point._m4.create())
};
Stage._MStack.prototype.clear = function() {
    this.size = 1
};
Stage._MStack.prototype.push = function(e) {
    var t = this.size++;
    Point._m4.multiply(this.mats[t - 1], e, this.mats[t])
};
Stage._MStack.prototype.pop = function() {
    this.size--
};
Stage._MStack.prototype.top = function() {
    return this.mats[this.size - 1]
};
Stage._CMStack = function() {
    this.mats = [];
    this.vecs = [];
    this.isID = [];
    this.bmds = [];
    this.lnnm = [];
    this.size = 1;
    this.dirty = true;
    for (var e = 0; e < 30; e++) {
        this.mats.push(Point._m4.create());
        this.vecs.push(new Float32Array(4));
        this.isID.push(true);
        this.bmds.push(BlendMode.NORMAL);
        this.lnnm.push(0)
    }
};
Stage._CMStack.prototype.push = function(e, t, n, r) {
    var i = this.size++;
    this.isID[i] = n;
    if (n) {
        Point._m4.set(this.mats[i - 1], this.mats[i]);
        Point._v4.set(this.vecs[i - 1], this.vecs[i])
    } else {
        Point._m4.multiply(this.mats[i - 1], e, this.mats[i]);
        Point._m4.multiplyVec4(this.mats[i - 1], t, this.vecs[i]);
        Point._v4.add(this.vecs[i - 1], this.vecs[i], this.vecs[i])
    }
    if (!n) this.dirty = true;
    this.bmds[i] = r;
    this.lnnm[i] = r == BlendMode.NORMAL ? this.lnnm[i - 1] : i
};
Stage._CMStack.prototype.update = function() {
    if (this.dirty) {
        var e = Stage._main,
            t = this.size - 1;
        gl.uniformMatrix4fv(e._sprg.cMatUniform, false, this.mats[t]);
        gl.uniform4fv(e._sprg.cVecUniform, this.vecs[t]);
        this.dirty = false
    }
    var n = this.lnnm[this.size - 1];
    Stage._setBMD(this.bmds[n])
};
Stage._CMStack.prototype.pop = function() {
    if (!this.isID[this.size - 1]) this.dirty = true;
    this.size--
};
Graphics.prototype._startNewFill = function() {
    var e = this._points.length / 2;
    var t = new Graphics.Fill(e - 1, this._conf);
    this._endLine();
    this._fills.push(t);
    this._afills.push(t)
};
Graphics.prototype._startLine = function() {
    var e = this._points.length / 2;
    var t = this._fills[this._fills.length - 1];
    var n = new Graphics.Line(e - 1, this._conf);
    t.lines.push(n)
};
Graphics.prototype._endLine = function() {
    if (this._fills.length == 0) return;
    var e = this._points.length / 2;
    var t = this._fills[this._fills.length - 1];
    if (t.lines.length != 0) {
        var n = t.lines[t.lines.length - 1];
        n.end = e - 1;
        if (n.isEmpty()) t.lines.pop()
    }
};
Graphics.prototype._render = function(e) {
    this._endLine();
    gl.uniformMatrix4fv(e._sprg.tMatUniform, false, e._mstack.top());
    e._cmstack.update();
    for (var t = 0; t < this._afills.length; t++) this._afills[t].render(e, this._points, this._rect)
};
Graphics.prototype.lineStyle = function(e, t, n) {
    if (!t) t = 0;
    if (!n) n = 1;
    this._conf.lwidth = e;
    this._conf.lcolor = Graphics.makeColor(t, n);
    this._endLine();
    this._startLine()
};
Graphics.prototype.beginFill = function(e, t) {
    if (!t) t = 1;
    this._conf.ftype = 1;
    this._conf.fcolor = Graphics.makeColor(e, t);
    this._startNewFill()
};
Graphics.prototype.beginBitmapFill = function(e) {
    this._conf.ftype = 2;
    this._conf.fbdata = e;
    this._startNewFill()
};
Graphics.prototype.endFill = function() {
    this._conf.ftype = 0;
    this._startNewFill()
};
Graphics.prototype.moveTo = function(e, t) {
    this._endLine();
    this._points.push(e, t);
    this._startLine()
};
Graphics.prototype.lineTo = function(e, t) {
    this._points.push(e, t)
};
Graphics.prototype.curveTo = function(e, t, n, r) {
    var i = this._points;
    var s = i[i.length - 2];
    var o = i[i.length - 1];
    var u = .666666;
    this.cubicCurveTo(s + u * (e - s), o + u * (t - o), n + u * (e - n), r + u * (t - r), n, r)
};
Graphics.prototype.cubicCurveTo = function(e, t, n, r, i, s, o) {
    if (!o) o = 40;
    var u = this._points;
    var a = u[u.length - 2],
        f = u[u.length - 1];
    var l = e - a,
        c = t - f;
    var h = n - e,
        p = r - t;
    var d = i - n,
        v = s - r;
    var m = 1 / o;
    for (var g = 1; g < o; g++) {
        var y = g * m;
        var b = a + y * l,
            w = f + y * c;
        var E = e + y * h,
            S = t + y * p;
        var x = n + y * d,
            T = r + y * v;
        var N = E - b,
            C = S - w;
        var k = x - E,
            L = T - S;
        var A = b + y * N,
            O = w + y * C;
        var M = E + y * k,
            _ = S + y * L;
        var D = M - A,
            P = _ - O;
        this.lineTo(A + y * D, O + y * P)
    }
    this.lineTo(i, s)
};
Graphics.prototype.drawCircle = function(e, t, n) {
    this.drawEllipse(e, t, n * 2, n * 2)
};
Graphics.prototype.drawEllipse = function(e, t, n, r) {
    var i = n / 2,
        s = r / 2;
    var o = .553;
    this.moveTo(e, t - s);
    this.cubicCurveTo(e + o * i, t - s, e + i, t - o * s, e + i, t, 16);
    this.cubicCurveTo(e + i, t + o * s, e + o * i, t + s, e, t + s, 16);
    this.cubicCurveTo(e - o * i, t + s, e - i, t + o * s, e - i, t, 16);
    this.cubicCurveTo(e - i, t - o * s, e - o * i, t - s, e, t - s, 16)
};
Graphics.prototype.drawRect = function(e, t, n, r) {
    this.moveTo(e, t);
    this.lineTo(e + n, t);
    this.lineTo(e + n, t + r);
    this.lineTo(e, t + r);
    this.lineTo(e, t)
};
Graphics.prototype.drawRoundRect = function(e, t, n, r, i, s) {
    var o = i / 2,
        u = s / 2;
    var a = .553;
    var f = e + o,
        l = e + n - o;
    var c = t + u,
        h = t + r - u;
    this.moveTo(f, t);
    this.lineTo(l, t);
    this.cubicCurveTo(l + a * o, t, e + n, c - a * u, e + n, c, 16);
    this.lineTo(e + n, h);
    this.cubicCurveTo(e + n, h + a * u, l + a * o, t + r, l, t + r, 16);
    this.lineTo(f, t + r);
    this.cubicCurveTo(f - a * o, t + r, e, h + a * u, e, h, 16);
    this.lineTo(e, c);
    this.cubicCurveTo(e, c - a * u, f - a * o, t, f, t, 16)
};
Graphics.prototype.drawTriangles = function(e, t, n) {
    Graphics.Fill.updateRect(e, this._rect);
    var r = [];
    for (var i = 0; i < e.length; i += 2) r.push(e[i], e[i + 1], 0);
    this._afills.push(new Graphics.Tgs(r, t, n, this._conf.fcolor, this._conf.fbdata))
};
Graphics.prototype.drawTriangles3D = function(e, t, n) {
    this._afills.push(new Graphics.Tgs(e, t, n, this._conf.fcolor, this._conf.fbdata))
};
Graphics.prototype.clear = function() {
    this._conf.ftype = 0;
    this._conf.bdata = null;
    this._conf.fcolor = null;
    this._conf.lwidth = 0;
    this._points = [0, 0];
    this._fills = [];
    this._afills = [];
    this._rect.setEmpty();
    this._startNewFill()
};
Graphics.prototype._getRect = function(e) {
    return this._rect
};
Graphics.prototype._hits = function(e, t) {
    return this._rect.contains(e, t)
};
Graphics.makeColor = function(e, t) {
    var n = new Float32Array(4);
    n[0] = (e >> 16 & 255) * .0039215686;
    n[1] = (e >> 8 & 255) * .0039215686;
    n[2] = (e & 255) * .0039215686;
    n[3] = t;
    return n
};
Graphics.equalColor = function(e, t) {
    return e[0] == t[0] && e[1] == t[1] && e[2] == t[2] && e[3] == t[3]
};
Graphics.len = function(e, t) {
    return Math.sqrt(e * e + t * t)
};
Graphics.Fill = function(e, t) {
    this.type = t.ftype;
    this.color = t.fcolor;
    this.bdata = t.fbdata;
    this.lines = [new Graphics.Line(e, t)];
    this.lineTGS = [];
    this.dirty = true;
    this.tgs = null
};
Graphics.Fill.prototype.Build = function(e, t) {
    var n = [];
    var r = [];
    var i = [];
    var s = null;
    var o = -1;
    var u = null;
    for (var a = 0; a < this.lines.length; a++) {
        var f = this.lines[a];
        if (f.begin == f.end) continue;
        var l = f.begin * 2;
        var c = f.end * 2;
        var h = e[l] == e[c] && e[l + 1] == e[c + 1];
        if (h) c -= 2;
        if (f.width > 0) {
            if (s == null || f.width != o || !Graphics.equalColor(u, f.color)) {
                s = {
                    vrt: [],
                    ind: [],
                    color: f.color
                };
                i.push(s);
                o = f.width;
                u = f.color
            }
            Graphics.Line.GetTriangles(e, l, c, f, this.type != 0 || h, s.ind, s.vrt)
        }
        if (this.type != 0 && c - l > 2) {
            var p = e.slice(f.begin * 2, f.end * 2 + 2);
            if (h) {
                p.pop();
                p.pop()
            }
            if (Graphics.PolyK.GetArea(p) < 0) p = Graphics.PolyK.Reverse(p);
            Graphics.Fill.updateRect(p, t);
            var d = n.length / 3;
            var v = Graphics.PolyK.Triangulate(p);
            for (var m = 0; m < v.length; m++) r.push(v[m] + d);
            for (var m = 0; m < p.length / 2; m++) n.push(p[2 * m], p[2 * m + 1], 0)
        }
    }
    for (var m = 0; m < i.length; m++) {
        this.lineTGS.push(new Graphics.Tgs(i[m].vrt, i[m].ind, null, i[m].color))
    }
    if (n.length > 0) this.tgs = new Graphics.Tgs(n, r, null, this.color, this.bdata);
    this.dirty = false
};
Graphics.Fill.prototype.isEmpty = function() {
    if (this.lines.length == 0) return true;
    return this.lines[0].isEmpty()
};
Graphics.Fill.prototype.render = function(e, t, n) {
    if (this.dirty) this.Build(t, n);
    if (this.tgs) this.tgs.render(e);
    for (var r = 0; r < this.lineTGS.length; r++) this.lineTGS[r].render(e)
};
Graphics.Fill.updateRect = function(e, t) {
    var n = Infinity,
        r = Infinity;
    var i = -Infinity,
        s = -Infinity;
    if (!t.isEmpty()) {
        n = t.x;
        r = t.y;
        i = t.x + t.width;
        s = t.y + t.height
    }
    for (var o = 0; o < e.length; o += 2) {
        n = Math.min(n, e[o]);
        r = Math.min(r, e[o + 1]);
        i = Math.max(i, e[o]);
        s = Math.max(s, e[o + 1])
    }
    t.x = n;
    t.y = r;
    t.width = i - n;
    t.height = s - r
};
Graphics.Line = function(e, t) {
    this.begin = e;
    this.end = -1;
    this.width = t.lwidth;
    this.color = t.lcolor;
    this.dirty = true
};
Graphics.Line.prototype.isEmpty = function() {
    return this.begin == this.end
};
Graphics.Line.GetTriangles = function(e, t, n, r, i, s, o) {
    var u = o.length / 3;
    var a = n - t - 2;
    if (i) Graphics.Line.AddJoint(e, n, t, t + 2, r.width, o);
    else Graphics.Line.AddEnd(e, t, t + 2, true, r.width, o);
    for (var f = 0; f < a; f += 2) {
        Graphics.Line.AddJoint(e, t + f, t + f + 2, t + f + 4, r.width, o);
        s.push(u + f + 0, u + f + 1, u + f + 2, u + f + 1, u + f + 2, u + f + 3)
    }
    if (i) {
        Graphics.Line.AddJoint(e, t + a, t + a + 2, t, r.width, o);
        s.push(u + a + 0, u + a + 1, u + a + 2, u + a + 1, u + a + 2, u + a + 3);
        s.push(u + a + 2, u + a + 3, u + 0, u + a + 3, u + 0, u + 1)
    } else {
        Graphics.Line.AddEnd(e, t + a, t + a + 2, false, r.width, o);
        s.push(u + 0 + a, u + 1 + a, u + 2 + a, u + 1 + a, u + 2 + a, u + 3 + a)
    }
};
Graphics.Line.AddEnd = function(e, t, n, r, i, s) {
    var o = e[t],
        u = e[t + 1];
    var a = e[n],
        f = e[n + 1];
    var l = .5 * i / Graphics.len(o - a, u - f);
    var c = l * (u - f);
    dy = -l * (o - a);
    if (r) {
        s.push(o + c);
        s.push(u + dy);
        s.push(0);
        s.push(o - c);
        s.push(u - dy);
        s.push(0)
    } else {
        s.push(a + c);
        s.push(f + dy);
        s.push(0);
        s.push(a - c);
        s.push(f - dy);
        s.push(0)
    }
};
Graphics.Line.AddJoint = function(e, t, n, r, i, s) {
    var o = new Point,
        u = new Point,
        a = new Point,
        f = new Point,
        l = new Point;
    var c = e[t],
        h = e[t + 1];
    var p = e[n],
        d = e[n + 1];
    var v = e[r],
        m = e[r + 1];
    var g = .5 * i / Graphics.len(c - p, h - d);
    var y = .5 * i / Graphics.len(p - v, d - m);
    var b = g * (h - d),
        w = -g * (c - p);
    var E = y * (d - m),
        S = -y * (p - v);
    o.setTo(c + b, h + w);
    u.setTo(p + b, d + w);
    a.setTo(p + E, d + S);
    f.setTo(v + E, m + S);
    Graphics.PolyK._GetLineIntersection(o, u, a, f, l);
    s.push(l.x);
    s.push(l.y);
    s.push(0);
    o.setTo(c - b, h - w);
    u.setTo(p - b, d - w);
    a.setTo(p - E, d - S);
    f.setTo(v - E, m - S);
    Graphics.PolyK._GetLineIntersection(o, u, a, f, l);
    s.push(l.x);
    s.push(l.y);
    s.push(0)
};
Graphics.Tgs = function(e, t, n, r, i) {
    this.color = r;
    this.bdata = i;
    this.useTex = i != null;
    this.dirtyUVT = true;
    this.emptyUVT = n == null;
    this.useIndex = e.length / 3 <= 65536;
    if (this.useIndex) {
        this.ind = new Uint16Array(t);
        this.vrt = new Float32Array(e);
        if (n) this.uvt = new Float32Array(n);
        else this.uvt = new Float32Array(e.length * 2 / 3);
        this.ibuf = gl.createBuffer();
        Stage._setEBF(this.ibuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.ind, gl.STATIC_DRAW)
    } else {
        this.vrt = Graphics.Tgs.unwrapF32(t, e, 3);
        if (n) this.uvt = Tgs.unwrapF32(t, n, 2);
        else this.uvt = new Float32Array(t.length * 2)
    }
    this.vbuf = gl.createBuffer();
    Stage._setBF(this.vbuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.vrt, gl.STATIC_DRAW);
    this.tbuf = gl.createBuffer();
    Stage._setBF(this.tbuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvt, gl.STATIC_DRAW)
};
Graphics.Tgs.prototype.render = function(e) {
    if (this.useTex) {
        var t = this.bdata;
        if (t._loaded == false) return;
        if (this.dirtyUVT) {
            this.dirtyUVT = false;
            if (this.emptyUVT) {
                this.emptyUVT = false;
                var n = 1 / t._rwidth,
                    r = 1 / t._rheight;
                for (var i = 0; i < this.uvt.length; i++) {
                    this.uvt[2 * i] = n * this.vrt[3 * i];
                    this.uvt[2 * i + 1] = r * this.vrt[3 * i + 1]
                }
            } else if (t.width != t._rwidth || t.height != t._rheight) {
                var n = t.width / t._rwidth,
                    r = t.height / t._rheight;
                for (var i = 0; i < this.uvt.length; i++) {
                    this.uvt[2 * i] *= n;
                    this.uvt[2 * i + 1] *= r
                }
            }
            Stage._setBF(this.tbuf);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvt)
        }
        Stage._setUT(1);
        Stage._setTEX(t._texture)
    } else {
        Stage._setUT(0);
        gl.uniform4fv(e._sprg.color, this.color)
    }
    Stage._setTC(this.tbuf);
    Stage._setVC(this.vbuf);
    if (this.useIndex) {
        Stage._setEBF(this.ibuf);
        gl.drawElements(gl.TRIANGLES, this.ind.length, gl.UNSIGNED_SHORT, 0)
    } else gl.drawArrays(gl.TRIANGLES, 0, this.vrt.length / 3)
};
Graphics.Tgs.unwrapF32 = function(e, t, n) {
    var r = new Float32Array(e.length * n);
    for (var i = 0; i < e.length; i++) for (var s = 0; s < n; s++) r[i * n + s] = t[e[i] * n + s];
    return r
};
Graphics.PolyK = {};
Graphics.PolyK.Triangulate = function(e) {
    var t = e.length >> 1;
    if (t < 3) return [];
    var n = [];
    if (Graphics.PolyK.IsConvex(e)) {
        for (var r = 1; r < t - 1; r++) n.push(0, r, r + 1);
        return n
    }
    var i = [];
    for (var r = 0; r < t; r++) i.push(r);
    var r = 0;
    var s = t;
    while (s > 3) {
        var o = i[(r + 0) % s];
        var u = i[(r + 1) % s];
        var a = i[(r + 2) % s];
        var f = e[2 * o],
            l = e[2 * o + 1];
        var c = e[2 * u],
            h = e[2 * u + 1];
        var p = e[2 * a],
            d = e[2 * a + 1];
        var v = false;
        if (Graphics.PolyK._convex(f, l, c, h, p, d)) {
            v = true;
            for (var m = 0; m < s; m++) {
                var g = i[m];
                if (g == o || g == u || g == a) continue;
                if (Graphics.PolyK._PointInTriangle(e[2 * g], e[2 * g + 1], f, l, c, h, p, d)) {
                    v = false;
                    break
                }
            }
        }
        if (v) {
            n.push(o, u, a);
            i.splice((r + 1) % s, 1);
            s--;
            r = 0
        } else if (r++ > 3 * s) break
    }
    n.push(i[0], i[1], i[2]);
    return n
};
Graphics.PolyK.IsConvex = function(e) {
    if (e.length < 6) return true;
    var t = e.length - 4;
    for (var n = 0; n < t; n += 2) if (!Graphics.PolyK._convex(e[n], e[n + 1], e[n + 2], e[n + 3], e[n + 4], e[n + 5])) return false;
    if (!Graphics.PolyK._convex(e[t], e[t + 1], e[t + 2], e[t + 3], e[0], e[1])) return false;
    if (!Graphics.PolyK._convex(e[t + 2], e[t + 3], e[0], e[1], e[2], e[3])) return false;
    return true
};
Graphics.PolyK._convex = function(e, t, n, r, i, s) {
    return (t - r) * (i - n) + (n - e) * (s - r) >= 0
};
Graphics.PolyK._PointInTriangle = function(e, t, n, r, i, s, o, u) {
    var a = o - n,
        f = u - r;
    var l = i - n,
        c = s - r;
    var h = e - n,
        p = t - r;
    var d = a * a + f * f;
    var v = a * l + f * c;
    var m = a * h + f * p;
    var g = l * l + c * c;
    var y = l * h + c * p;
    var b = 1 / (d * g - v * v);
    var w = (g * m - v * y) * b;
    var E = (d * y - v * m) * b;
    return w >= 0 && E >= 0 && w + E < 1
};
Graphics.PolyK._GetLineIntersection = function(e, t, n, r, i) {
    var s = e.x - t.x,
        o = n.x - r.x;
    var u = e.y - t.y,
        a = n.y - r.y;
    var f = s * a - u * o;
    if (f == 0) return null;
    var l = e.x * t.y - e.y * t.x;
    var c = n.x * r.y - n.y * r.x;
    i.x = (l * o - s * c) / f;
    i.y = (l * a - u * c) / f
};
Graphics.PolyK.GetArea = function(e) {
    if (e.length < 6) return 0;
    var t = e.length - 2;
    var n = 0;
    for (var r = 0; r < t; r += 2) n += (e[r + 2] - e[r]) * (e[r + 1] + e[r + 3]);
    n += (e[0] - e[t]) * (e[t + 1] + e[1]);
    return -n * .5
};
Graphics.PolyK.Reverse = function(e) {
    var t = [];
    for (var n = e.length - 2; n >= 0; n -= 2) t.push(e[n], e[n + 1]);
    return t
};
Sprite.prototype = new DisplayObjectContainer;
Sprite.prototype._render = function(e) {
    this.graphics._render(e);
    DisplayObjectContainer.prototype._render.call(this, e)
};
Sprite.prototype._getTarget = function(e, t) {
    if (!this.visible || !this.mouseChildren && !this.mouseEnabled) return null;
    var n = DisplayObjectContainer.prototype._getTarget.call(this, e, t);
    if (n != null) return n;
    if (!this.mouseEnabled) return null;
    var r = this._temp;
    if (this.graphics._hits(r[0], r[1])) return this;
    return null
};
Sprite.prototype._getRect = function(e) {
    var t;
    var n = DisplayObjectContainer.prototype._getRect.call(this, e);
    var r = this.graphics._getRect(e);
    if (n != null && r != null) n._unionWith(r);
    if (n != null) t = n;
    else t = r;
    return t
};
Sprite.prototype._htpLocal = function(e) {
    var t = this._temp;
    Point._m4.multiplyVec2(this._getIMat(), e, t);
    if (this.graphics._hits(t[0], t[1])) return true;
    return DisplayObjectContainer.prototype._htpLocal.call(this, e)
};
var TextFormatAlign = {
    LEFT: "left",
    CENTER: "center",
    RIGHT: "right",
    JUSTIFY: "justify"
};
TextFormat.prototype.clone = function() {
    return new TextFormat(this.font, this.size, this.color, this.bold, this.italic, this.align, this.leading)
};
TextFormat.prototype.set = function(e) {
    this.font = e.font;
    this.size = e.size;
    this.color = e.color;
    this.bold = e.bold;
    this.italic = e.italic;
    this.align = e.align;
    this.leading = e.leading
};
TextFormat.prototype.getImageData = function(e, t) {
    var n = TextFormat._canvas;
    var r = TextFormat._context;
    var i = this.data;
    n.width = i.rw = this._nhpt(t._areaW);
    n.height = i.rh = this._nhpt(t._areaH);
    var s = this.color;
    var o = s >> 16 & 255;
    var u = s >> 8 & 255;
    var a = s & 255;
    r.textBaseline = "top";
    r.fillStyle = "rgb(" + o + "," + u + "," + a + ")";
    r.font = (this.italic ? "italic " : "") + (this.bold ? "bold " : "") + this.size + "px " + this.font;
    this.maxW = 0;
    var f = e.split("\n");
    var l = 0;
    var c = 0;
    var h = this.size * 1.25;
    for (var p = 0; p < f.length; p++) {
        var d = this.renderPar(f[p], c, h, r, t);
        l += d;
        c += d * (h + this.leading)
    }
    if (this.align == TextFormatAlign.JUSTIFY) this.maxW = Math.max(this.maxW, t._areaW);
    i.image = n;
    i.tw = this.maxW;
    i.th = (h + this.leading) * l - this.leading;
    return i
};
TextFormat.prototype.renderPar = function(e, t, n, r, i) {
    var s;
    if (i._wordWrap) s = e.split(" ");
    else s = [e];
    var o = r.measureText(" ").width;
    var u = 0;
    var a = i._areaW;
    var f = 0;
    var l = [
        []
    ];
    var c = [];
    for (var h = 0; h < s.length; h++) {
        var p = s[h];
        var d = r.measureText(p).width;
        if (u + d <= a || u == 0) {
            l[f].push(p);
            u += d + o
        } else {
            c.push(a - u + o);
            l.push([]);
            f++;
            u = 0;
            h--
        }
    }
    c.push(a - u + o);
    for (var h = 0; h < l.length; h++) {
        var v = l[h];
        while (v[v.length - 1] == "") {
            v.pop();
            c[h] += o
        }
        this.maxW = Math.max(this.maxW, a - c[h]);
        var m, g = t + (n + this.leading) * h;
        u = 0, m = o;
        if (this.align == TextFormatAlign.CENTER) u = c[h] * .5;
        if (this.align == TextFormatAlign.RIGHT) u = c[h];
        if (this.align == TextFormatAlign.JUSTIFY) m = o + c[h] / (v.length - 1);
        for (var y = 0; y < v.length; y++) {
            var p = v[y];
            r.fillText(p, u, g);
            var d = r.measureText(p).width;
            if (h < l.length - 1) u += d + m;
            else {
                u += d + o
            }
        }
    }
    return f + 1
};
TextFormat.prototype._nhpt = function(e) {
    --e;
    for (var t = 1; t < 32; t <<= 1) e = e | e >> t;
    return e + 1
};
TextFormat._canvas = document.createElement("canvas");
TextFormat._context = TextFormat._canvas.getContext("2d");
TextField.prototype = new InteractiveObject;
TextField.prototype.setTextFormat = function(e) {
    this._tForm.set(e);
    this._update()
};
TextField.prototype.getTextFormat = function(e) {
    return this._tForm.clone()
};
TextField.prototype._update = function() {
    var e = this._brect.width = this._areaW;
    var t = this._brect.height = this._areaH;
    if (e == 0 || t == 0) return;
    var n = this._tForm.getImageData(this._text, this);
    this._textW = n.tw;
    this._textH = n.th;
    if (n.rw != this._rwidth || n.rh != this._rheight) {
        gl.deleteTexture(this._texture);
        this._texture = gl.createTexture()
    }
    Stage._setTEX(this._texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, n.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    this._rwidth = n.rw;
    this._rheight = n.rh;
    var r = e / n.rw;
    var i = t / n.rh;
    var s = this._tcArray;
    s[2] = s[6] = r;
    s[5] = s[7] = i;
    Stage._setBF(this._tcBuffer);
    gl.vertexAttribPointer(Stage._main._sprg.tca, 2, gl.FLOAT, false, 0, 0);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, s);
    var o = this._fArray;
    o[3] = o[9] = e;
    o[7] = o[10] = t;
    Stage._setBF(this._vBuffer);
    gl.vertexAttribPointer(Stage._main._sprg.vpa, 3, gl.FLOAT, false, 0, 0);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, o)
};
TextField.prototype._render = function(e) {
    if (this._areaW == 0 || this._areaH == 0) return;
    gl.uniformMatrix4fv(e._sprg.tMatUniform, false, e._mstack.top());
    e._cmstack.update();
    Stage._setVC(this._vBuffer);
    Stage._setTC(this._tcBuffer);
    Stage._setUT(1);
    Stage._setTEX(this._texture);
    Stage._setEBF(e._unitIBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
};
this.tp = TextField.prototype;
tp.ds = tp.__defineSetter__;
tp.dg = tp.__defineGetter__;
tp.dg("textWidth", function() {
    return this._textW
});
tp.dg("textHeight", function() {
    return this._textH
});
tp.ds("wordWrap", function(e) {
    this._wordWrap = e;
    this._update()
});
tp.dg("wordWrap", function() {
    return this._wordWrap
});
tp.ds("width", function(e) {
    this._areaW = Math.max(0, e);
    this._update()
});
tp.dg("width", function() {
    return this._areaW
});
tp.ds("height", function(e) {
    this._areaH = Math.max(0, e);
    this._update()
});
tp.dg("height", function() {
    return this._areaH
});
tp.ds("text", function(e) {
    this._text = e.toString();
    this._update()
});
tp.dg("text", function() {
    return this._text
});
delete tp.ds;
delete tp.dg;
delete this.tp 