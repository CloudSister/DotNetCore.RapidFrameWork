/**
 * 百度地图 api 功能整合
 * @author	Gloot
 * @QQ		345268267
 * @Blogs	http://www.cnblogs.com/editor
 * @dependency :<link href="http://api.map.baidu.com/library/TrafficControl/1.4/src/TrafficControl_min.css" rel="stylesheet" type="text/css" />
 * <script type="text/javascript" src="http://api.map.baidu.com/api?v=1.2&services=true"></script>
 * <script type="text/javascript" src="http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js"></script>
 * <script type="text/javascript" src="http://api.map.baidu.com/library/TrafficControl/1.4/src/TrafficControl_min.js"></script>  
 * <script type="text/javascript" src="/devices/scripts/GeoUtils.js"></script>
 */
console && console.log('In ZMap');
ZMap = {
	mapObj : null,
	mapId : '',
	opts: ''
};

ZMap.defaults = {
	city : '合肥',
	level: 12
};

ZMap.createMap = function(mapId, opts) {
	//debugger;
	if (ZMap.mapObj) {
		ZMap.mapObj.clearOverlays();
	}
	
	/*
	var newE = ZMap.dom.newE('baiduMid');
	newE.setAttribute('style', 'width:100%; height:100%;');
	var targetE = ZMap.dom.getE(mapId);
	ZMap.dom.after(newE, targetE);
	ZMap.dom.remove(targetE);
	ZMap.dom.set(newE, 'id', mapId);
	*/
	
	ZMap.mapObj = new BMap.Map(mapId);
	ZMap.mapId = mapId;
	ZMap.opts = opts;

	if (opts) {
		var level = opts.level || ZMap.defaults.level;
		if (opts.lng && opts.lat) {
			var point = new BMap.Point(opts.lng, opts.lat);
			ZMap.mapObj.centerAndZoom(point, level);
		} else if(opts.addr){
			ZMap.mapObj.centerAndZoom(opts.addr, level);
		} else {
			ZMap.mapObj.centerAndZoom(ZMap.defaults.city, level);
		}
	} else {
		ZMap.mapObj.centerAndZoom(ZMap.defaults.city, level);
	}
	//ZMap.mapObj.reset();

	opts.callback && opts.callback();
	
	setTimeout(function() { //删除版权
		$('#'+mapId).find('.anchorBL').remove();
	}, 1000);
};

ZMap.dom = {
	getE: function(eleId) {
		return document.getElementById(eleId);
	},
	newE : function(eleId) {
		var _ele = ZMap.dom.getE(eleId);
		if (_ele) {
			return _ele;
		}
		
		var ele = document.createElement('div');
		ZMap.dom.set(ele, 'id', eleId);
		return ele;
	},
	after : function(newE, targetE) {
		targetE.parentNode.lastChild == targetE ? targetE.parentNode.appendChild(newE) : targetE.parentNode.insertBefore(newE, targetE.nextSibling);
	},
	set : function(target,attr,val) {
		target.setAttribute(attr, val);
	},
	remove: function(target) {
		target.parentNode.removeChild(target);
	},
	getEbyCls : function(clsName, tagName) {
		var ClassElements = [];  
	    selElements = document.getElementsByTagName(tagName);  
	  
	    for (var i = 0; i < selElements.length; i++) {  
	        if (selElements[i].className == clsName) {  
	            ClassElements[ClassElements.length] = selElements[i];  
	        }  
	    }  
	    return ClassElements;  
	}
};

ZMap.enables = {
	scrollWheel: function() {
		ZMap.mapObj.enableScrollWheelZoom();
	}
};

ZMap.disables = {
	doubleClkZoom : function() {
		ZMap.mapObj.disableDoubleClickZoom();
	}
};

ZMap.controls = {
	addNavi : function(opts) {
		ZMap.mapObj.addControl(new BMap.NavigationControl(opts));
	},
	addScale : function(opts) {
		ZMap.mapObj.addControl(new BMap.ScaleControl(opts));
	},
	addOverview : function(opts) {
		ZMap.mapObj.addControl(new BMap.OverviewMapControl(opts));
	},
	addMapType : function(opts) {
		ZMap.mapObj.addControl(new BMap.MapTypeControl(opts));
	},
	addGeolocation : function(opts) { //mobi
		try {
			ZMap.mapObj.addControl(new BMap.GeolocationControl(opts));
		}catch(e) {}
	}
};

ZMap.iconMarker = function(icon, point) {
	var micon = new BMap.Icon(icon.img, new BMap.Size(icon.width, icon.height));
	var marker = new BMap.Marker(point, {icon: micon});
	ZMap.mapObj.addOverlay(marker);
	return marker;
};

ZMap.labelMarker = function(msg, point) {
	var lbl = new BMap.Label(msg, {});
	var marker = new BMap.Marker(point);
	marker.setLabel(lbl);
	ZMap.mapObj.addOverlay(marker);
	return marker;
};

ZMap.marker = function(point) {
	var marker = new BMap.Marker(point, {});
	ZMap.mapObj.addOverlay(marker);
	return marker;
};

ZMap.addPolygon = function(points, opts) {
	var polygon = new BMap.Polygon(points, {strokeColor: (opts.color || 'blue'), strokeWeight: (opts.weight || 5), strokeOpacity: (opts.opacity || 0.5)});
	ZMap.mapObj.addOverlay(polygon);
	return polygon;
};

ZMap.addPolyline = function(points,opts) {
	var polyline = new BMap.Polyline(points, {strokeColor: (opts.color || 'blue'), strokeWeight: (opts.weight || 5), strokeOpacity: (opts.opacity || 0.5)});
	ZMap.mapObj.addOverlay(polyline);
	return polyline;
};

ZMap.addCircle = function(point,distance, opts) {
	var circle = new BMap.Circle(me.point, me.distance ,{strokeColor:(opts.color || 'blue'), strokeWeight:(opts.weight || 2), strokeOpacity:(opts.opacity || 0.5)});
	ZMap.mapObj.addOverlay(circle);
	return circle;
};

ZMap.getMap = function() {
	return ZMap.mapObj;
};

ZMap.addListener = function(obj,type,callback) {
	ZMap.events.add('Main', obj, type, callback);
};

/**
 * 1. add => key: method_objName[x]
 * eg: GuiJiPlay_polyline
 * 2. ZMap.mapObj => key: Main
 * 3. caches => key : method_objName[x]_type || Main_type
 */
ZMap.events = {
	caches : {},
	add : function(key,obj,type,callback) {
		obj.addEventListener(type, callback);
		this.caches[key+'_'+type] = {'obj':obj, 'type':type, 'callback':callback};
	},
	remove : function(key, type) {
		this.removeByKey(key+'_'+type);
	},
	removeByKey : function(keytype) {
		if (this.caches[key]) {
			var json = this.caches[keytype];
			json['obj'] && json['obj'].removeEventListener(json['type'], json['callback']);
			
			delete this.caches[key];
		}
	},
	clear : function () {
		for (keytype in this.caches) {
			this.removeByKey(keytype);
		}
		
		this.caches = {};
	}
};

ZMap.msgAlert = function(opts, msg, pObj, point) {
	var infoWindow = new BMap.InfoWindow(msg, opts);
	pObj.openInfoWindow(infoWindow, point);
};

ZMap.setZoom = function(level) {
	ZMap.mapObj.setZoom(level);
};

ZMap.panTo = function(point) {
	ZMap.mapObj.panTo(point);
};

ZMap.init = function() {
	ZMap.clear();
	
	ZMap.events.clear();
};

ZMap.clear = function() {
	if (ZMap.mapObj) {
		ZMap.mapObj.clearOverlays();
	}
};

ZMap.remove = {
	overlay : function(lay) {
		ZMap.mapObj.removeOverlay(lay);
	},
	control : function(ctrl) {
		ZMap.mapObj.removeControl(ctrl);
	}
};

ZMap.getPoint = function(lnglat) {
	if (typeof lnglat != 'string')
		return null;
	
	var point = null;
	try {
		eval('point=new BMap.Point('+lnglat+');');
	}catch(e){}
	
	return point;
};

/**
 * 轨迹回放
 * @param opts
 * @returns {ZMap.GuiJiPlay}
 */
ZMap.GuiJiPlay = function(opts, flag) {
	if (flag) {
		ZMap.createMap(ZMap.mapId, ZMap.opts);
	}
	opts = opts || {};
	this.points = [];
	this.centerPoint = null;
	this.index = 0;
	this.timer = null;
	this.polyline = null;
	this.runlines = [];
	this.speed = 1000;
	this.isplay = false;
	
	this.potlen = 0;
	this.marker = {
		marker : null,
		label: '',
		icon: {
			width: 50,
			height: 50
		}
	};
	
	if (opts.label && opts.label != '') {
		this.marker.label = opts.label;
	}
	
	if (opts.icon) {
		this.marker.icon = opts.icon;
	}
};

ZMap.GuiJiPlay.prototype.set = function(pointArr) {
	var me = this;
	
	me.points = [];
	for (itm in pointArr) {
		var one = pointArr[itm];
		
		if (typeof one != "string")
			continue;
		
		var point = ZMap.getPoint(one);
		
		if (point && point instanceof BMap.Point) {
			me.points.push(point);
		}
	}

	me.potlen = me.points.length;
	
	me.init();
};

ZMap.GuiJiPlay.prototype.init = function() {
	var me = this;
	me.clear();
	
	me.centerPoint = new BMap.Point((me.points[0].lng + me.points[me.potlen - 1].lng) / 2, (me.points[0].lat + me.points[me.potlen - 1].lat) / 2);
	ZMap.mapObj.panTo(me.centerPoint);  

	me.polyline = new BMap.Polyline(me.points, {strokeColor: "blue", strokeWeight: 5, strokeOpacity: 1});
	ZMap.mapObj.addOverlay(me.polyline);  
	

	
	if (!me.marker.icon) {
		me.marker.marker = ZMap.iconMarker(me.marker.icon, me.points[0]);
	} else if (me.marker.label != '') {
		me.marker.marker = ZMap.labelMarker(me.marker.label, me.points[0]);
	} else {
		me.marker.marker = ZMap.marker(me.points[0]);
	}
	
};

ZMap.GuiJiPlay.prototype.reset = function() {
	var me = this;
	me.index = 0;
	if (me.marker.marker && me.points.length > 0) {
		me.marker.marker.setPosition(me.points[0]);  
	}
	
	me.pause();
};

ZMap.GuiJiPlay.prototype.clear = function() {

	var me = this;
	if (me.polyline) {
		ZMap.mapObj.removeOverlay(me.polyline);
	}

	me.clearStepline();
	me.polyline = null;
	me.runlines = [];
	me.reset();
};

ZMap.GuiJiPlay.prototype.clearStepline = function() {
	var me = this;
	for (itm in me.runlines) {
		var line = me.runlines[itm];
		if (line instanceof BMap.Polyline) {
			ZMap.mapObj.removeOverlay(line);
		}
		
	}
};

ZMap.GuiJiPlay.prototype.play = function(speed) {
	var me = this;
	if (speed)
		me.speed = speed;
	
	if (!me.isplay) {
		me.clearStepline();
		me.isplay = true;
	}
	
	var point = me.points[me.index];  
	
	if(me.index > 0) {  
		var cline = new BMap.Polyline([me.points[me.index - 1], point], {strokeColor: "red", strokeWeight: 1, strokeOpacity: 1});
        ZMap.mapObj.addOverlay(cline);  
        me.runlines.push(cline);
    }  
    
	me.marker.marker.setPosition(point);  
    me.index++;  
    if(true) {  
        ZMap.mapObj.panTo(point);  
    }  
    if(me.index < me.points.length) {  
        me.timer = window.setTimeout(function() {
        	me.play();
        }, me.speed);  
    } else {
    	ZMap.mapObj.panTo(point);  
    }
};

ZMap.GuiJiPlay.prototype.pause = function() {
	var me = this;
	if(me.timer) {  
        window.clearTimeout(me.timer);  
    }
	me.timer = null;
	me.isplay = false;
};


/**
 * 圈画区域,并可编辑
 * @param flag
 * @returns {ZMap.lineArea}
 */
ZMap.lineArea = function(opts, flag) {
	if (flag) {
		ZMap.createMap(ZMap.mapId, ZMap.opts);
	}
	
	this.polygon = null;
	this.historys = [];
	this.callback = opts.callback || null;
	this.linecolor = opts.color || 'blue';
	this.draw = true;
	this.init();
};

ZMap.lineArea.prototype.init = function() {
	var me = this;
	me.draw = true;
	me.polygon = null;
	me.historys = [];

	ZMap.addListener(ZMap.mapObj, 'click', function(e) {
		
		ZMap.addListener(ZMap.mapObj, 'dblclick', function(e) {
			
			if (me.polygon) {
				me.draw = false;
				me.polygon.enableEditing();
			}
		});
		me.drawgon(e);
	});
	
};

ZMap.lineArea.prototype.reDraw = function() {
	var me = this;
	me.draw = true;
};

ZMap.lineArea.prototype.drawgon = function(e) {
	var me = this;
	if (me.draw) {
		if (me.polygon) {
			ZMap.mapObj.removeOverlay(me.polygon);
		}
		
		me.historys.push(e.point);
		var len = me.historys.length;
		if (len > 0) {
			me.polygon = new BMap.Polygon(me.historys, {strokeColor: me.linecolor, strokeWeight: 5, strokeOpacity: 0.5});
			
			ZMap.mapObj.addOverlay(me.polygon);
			
		}
		
		me.callback(me.historys, me.polygon);
	}
};

ZMap.lineArea.prototype.edit = function() {
	var me = this;
	me.polygon.enableEditing();
};

ZMap.lineArea.prototype.disable = function() {
	var me = this;
	try {
		me.polygon.disableEditing();
	}catch(e){}
	
};

ZMap.lineArea.prototype.getGon = function() {
	return this.polygon;
}

ZMap.lineArea.prototype.clear = function() {
	var me = this;
	if (me.polygon) {
		ZMap.mapObj.removeOverlay(me.polygon);
	}
	
	me.polygon = null;
	me.historys = [];
	me.draw = false;
	
};


/**
 * 是否在圆圈范围内
 * @param flag
 * @returns {Array}
 */
ZMap.inCircleSearch = function(flag) {
	if (flag) {
		ZMap.createMap(ZMap.mapId, ZMap.opts);
	}
	
	this.point = null;
	this.distance = 500;
	this.show = true;
	this.circle = null;
	this.inCircles = [];
	this.markers = [];
	this.markered = false;
};

ZMap.inCircleSearch.prototype.set = function(opts) {
	var me = this;
	
	me.clear();
	
	me.clearCircle();

	me.distance = opts.distance || 500;
	me.point = opts.point || ZMap.mapObj.getCenter();
	me.show = opts.show || true;
	me.callback = opts.callback || function() {};
	me.markered = opts.markered || false;
	
	if (me.show) {
		me.circle = new BMap.Circle(me.point, me.distance ,{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
		ZMap.mapObj.addOverlay(me.circle);
	}
};

ZMap.inCircleSearch.prototype.clearCircle = function() {
	var me = this;
	if (me.circle) {
		ZMap.mapObj.removeOverlay(me.circle);
	}
};

ZMap.inCircleSearch.prototype.clear = function() {
	var me = this;
	if (me.markers && me.markers.length > 0) {
		for (itm in me.markers) {
			var marker = me.markers[itm];
			if (marker instanceof BMap.Marker) {
				ZMap.mapObj.removeOverlay(marker);
			}
		}
	}
	
	me.markers = [];
	me.inCircles = [];
};

ZMap.inCircleSearch.prototype.search = function(pointArr) {
	var me = this;
	
	me.clear();
	
	for (itm in pointArr) {
		var one = pointArr[itm];
		var _point = ZMap.getPoint(one);
		
		if (_point) {
			
			var distance = ZMap.mapObj.getDistance(me.point, _point);
			distance = parseFloat(distance);
			console.log(distance + '-' + me.distance);
			var sign = 'No';
			if (distance <= me.distance) {
				me.inCircles.push(_point);
				sign = 'Yes';
			}
			
			if (me.markered) {
				var marker = ZMap.labelMarker(sign, _point);
				me.markers.push(marker);
			}
			
			me.callback && me.callback(sign, _point);
		}
		
	}
	
	return me.inCircles;
};

/**
 * 定位城市
 * @param opts
 * @param flag
 */
ZMap.locaCity = function(opts, flag) {
	if (flag) {
		ZMap.createMap(ZMap.mapId, ZMap.opts);
	}
	
	if (!opts.city) {
		opts.city = '北京';
	}
	if (!opts.level) {
		opts.level = 12;
	}
	
	ZMap.mapObj.centerAndZoom(opts.city, opts.level);
};

/**
 * 本地搜索,生活服务查询
 * @param opts
 * @param flag
 * @returns {ZMap.liveSearch}
 */
ZMap.liveSearch = function(opts, flag) {
	if (flag) {
		ZMap.createMap(ZMap.mapId, ZMap.opts);
	}
	
	var autoview = (typeof opts.view == 'boolean') ? opts.view : true;
	
	this.local = new BMap.LocalSearch(ZMap.mapObj, {renderOptions: {map: ZMap.mapObj, autoViewport: autoview, panel: (opts.panelId || '')}});
	this.callback = opts.callback;
	this.markercall = opts.markercall;
	this.init();
};

ZMap.liveSearch.prototype.init = function(){
	var me = this;
	me.local.setSearchCompleteCallback(function(rs) {
    	if (me.local.getStatus() == BMAP_STATUS_SUCCESS) {
    		//var poi = rs.getPoi(0);
    		//var point = poi.point;
    		//var address = poi.address;
    		//var city = poi.city;
    		//var phone = poi.phoneNumber;
    		//var zip = poi.postcode;
    		//var province = poi.province;
    		//var tags = poi.tags; //array
    		//var title = poi.title;
    		//var resCount = res.getCurrentNumPois();
    		me.callback && me.callback(rs);
    	}
    });
	
	me.local.setMarkersSetCallback(function(pois) {
		/*
		 * for (var i=0;i<pois.length;i++) {
		 * 	var marker = pois[i].marker;
		 * }
		 */
		//var poi = pois[i]; 
		//poi 包含 属性上同 callback
		//这里的 poi.marker 是真正的 BMap.Marker
		//上面 callback 的 poi.marker 只是 BMap.Overlay
		me.markercall && me.markercall(pois);
	});
};

//矩形区域搜索
ZMap.liveSearch.prototype.searchBounds = function(items) {//items 数组 ['酒店','银行'...]
	var me = this;
	var bo = ZMap.mapObj.getBounds();
	me.local.searchInBounds(items ,bo);
};

//智能搜索
ZMap.liveSearch.prototype.search = function(addr) {
	var me = this;
	me.local.search(addr);
};

//附近搜索
ZMap.liveSearch.prototype.nearBy = function(addr, point, distance) {
	var me = this;
	me.local.searchNearby(addr, point, distance);
};

/**
 * 根据坐标返回地址信息;
 * @param opts
 * @param flag
 */
ZMap.pointToAdds = function(opts, flag) {
	if (flag) {
		ZMap.createMap(ZMap.mapId, ZMap.opts);
	}
	
	var gc = new BMap.Geocoder();
	
	ZMap.addListener(ZMap.mapObj, 'click', function(e) {
		
		if (e.overlay != null) {
    		return;
    	}
		
		var marker = ZMap.marker(e.point);
		marker.enableDragging();
		ZMap.events.add('pointToAdds_marker',marker, 'click', function(ep) {
			gc.getLocation(ep.point, function(rs){  
				opts.callback && opts.callback(ep.point, rs, marker);
			});
		});
		ZMap.events.add('pointToAdds_marker',marker, 'dragend', function(ep) {
			gc.getLocation(ep.point, function(rs){  
				opts.callback && opts.callback(ep.point, rs, marker);
			});
		});
		ZMap.events.add('pointToAdds_marker', marker, 'dblclick', function(ep) {
			ZMap.mapObj.removeOverlay(marker);
		});
	});
};

/**
 * 地图工具,测距,面积,打印
 */
ZMap.tools = {
	distance : {
		open : function() {
			if (!this.disTool) {
				this.disTool = new BMapLib.DistanceTool(ZMap.mapObj);
			}
			this.disTool.open();
		},
		close: function() {
			if (this.disTool) {
				this.disTool.close();
			}
		}
	},
	area : function(pointArr, flag) {
		if (flag) {
			ZMap.createMap(ZMap.mapId, ZMap.opts);
		}
		
		var historys = [];
		
		for (itm in pointArr) {
			var one = pointArr[itm];
			
			var _point = null;
			try {
				eval("_point=new BMap.Point("+one+")");
			}catch(e) {}
			
			if (_point) {
				historys.push(_point);
			}
		}
		
		
		var _polygon = new BMap.Polygon(historys, {strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.5});
		
		ZMap.mapObj.addOverlay(_polygon);
		
		ZMap.events.add('tools_area_polygon', _polygon, 'click', function(e) {
			var resultArea = BMapLib.GeoUtils.getPolygonArea(_polygon);
			
			var result = "面积为: " + resultArea.toFixed(2) + "平方米";
			ZMap.msgAlert({width:200, height:150, title:'区域面积'},result, ZMap.mapObj, e.point);
		});
	},
	print : function(opts) {
		var pot = ZMap.mapObj.getCenter();
		var zoom = ZMap.mapObj.getZoom();
		
		opts.width = opts.width || 700;
		opts.height = opts.height || 600;
		
		window.open(opts.url + '?lng='+pot.lng+'&lat='+pot.lat+'&zoom='+zoom, '打印地图', "height="+opts.height+", width="+opts.width+", top=10, left=10,toolbar=yes, menubar=no, scrollbars=yes, resizable=yes, location=no, status=no");
	}
};


/**
 * 地图全屏
 * @param opts
 * @returns {ZMap.fullMap}
 */
ZMap.fullMap = function(opts) {
	this.width = opts.width || 700;
	this.height = opts.height || 640;
	this.container = opts.container;
	this.mapId = opts.mapId;
	this.fullfunc = opts.fullfunc;
	this.origifunc = opts.origifunc;
};

ZMap.fullMap.prototype.toFull = function() {
	var me = this;
	var _width = $(window).width();
	var _height = $(window).height();
	var posi = $('#'+me.container).css('position');
	
	if (posi != 'absolute') {
		$('#'+me.container).css({
			position:'absolute',
			width: _width + 'px',
			height: _height + 'px'
		});
		
		$('#'+me.mapId).css('height', '100%');
		
		ZMap.mapObj.width = _width;
		ZMap.mapObj.height = _height;
		
		ZMap.mapObj.reset();
		
		me.fullfunc && me.fullfunc();
	}
};

ZMap.fullMap.prototype.toOrigi = function() {
	var me = this;
	var posi = $('#'+me.container).css('position');
	
	if (posi == 'absolute') {
		$('#'+me.container).css({
			position:'relative',
			width: me.width + 'px',
			height: me.height + 'px'
		});
		
		$('#'+me.mapId).css('height', me.height + 'px');
		
		ZMap.mapObj.width = me.width;
		ZMap.mapObj.height = me.height;
		
		ZMap.mapObj.reset();
		
		me.origifunc && me.origifunc();
	}
};

/**
 * 实时路况
 * @returns {ZMap.runtimeTraffic}
 */
ZMap.realtimeTraffic = function() {
	this.trafic = new BMapLib.TrafficControl({
		showPanel : true //true false 没啥区别
	});
	
	ZMap.mapObj.addControl(this.trafic); 
};

ZMap.realtimeTraffic.prototype.show = function() {
	var me = this;
	me.trafic.showTraffic();
};

ZMap.realtimeTraffic.prototype.hide = function() {
	var me = this;
	me.trafic.hideTraffic();
};

/**
 * 是否在 Polygon 区域内;
 */
ZMap.InPolygonMap = function(points) {
	this.historys = [];
	this.polygon = null;
	this.points = points;
	this.inarr = [];
	this.markers = [];
	this.chkIns = [];
	this.show = false;
	this.set();
};

ZMap.InPolygonMap.prototype.set = function(){
	var me = this;
	if (me.points && me.points.length > 0) {
		for (itm in me.points) {
			var one = me.points[itm];
			
			var _point = ZMap.getPoint(one);
			
			if (_point) {
				me.historys.push(_point);
			}
		}
		
		
		me.polygon = new BMap.Polygon(me.historys, {strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.5}); 
		
		ZMap.mapObj.addOverlay(me.polygon);
	} else {
		ZMap.addListener(ZMap.mapObj, 'click', function(e) {
			me.crtGon(e.point);
			me.isIn(me.chkIns, me.show);
		});
	}
};

ZMap.InPolygonMap.prototype.crtGon = function(point) {
	var me = this;
	if (me.polygon) {
		ZMap.mapObj.removeOverlay(me.polygon);
	}
	
	me.historys.push(point);
	
	me.polygon = new BMap.Polygon(me.historys, {strokeColor: "blue", strokeWeight: 5, strokeOpacity: 0.5}); 
	
	ZMap.mapObj.addOverlay(me.polygon);
};

ZMap.InPolygonMap.prototype.reset = function(points) {
	var me = this;
	
	ZMap.mapObj.removeOverlay(me.polygon);
	me.historys = [];
	
	if (points instanceof Array && points.length > 0) {
		me.points = points;
	} else {
		me.points = [];
	}
	
	me.set();
};

ZMap.InPolygonMap.prototype.isIn = function(potarr, show) {
	var me = this;
	
	me.chkIns = potarr.slice(0);
	me.show = show;
	
	me.inarr = [];
	
	if (me.markers.length > 0) {
		for (itm in me.markers) {
			var mke = me.markers[itm];
			ZMap.mapObj.removeOverlay(mke);
		}
	}
	
	me.markers = [];
	
	for (itm in potarr) {
		var one = potarr[itm];
		
		var _point = ZMap.getPoint(one);
		
		if (_point) {
			
			var nf = ZMap.isInsizePolygon(_point, me.historys);
			
			if (nf) {
				me.inarr.push(_point);
			}
			
			if (show) {
				var marker = ZMap.labelMarker((nf? 'In':'NotId'), _point);
				me.markers.push(marker);
			}
		}
	}
	
	return me.inarr;
};

ZMap.isInsizePolygon = function(point, gonPoints) {
	for (var c = false, i = -1, l = gonPoints.length, j = l - 1; ++i < l; j = i)   
        ((gonPoints[i].lat <= point.lat && point.lat < gonPoints[j].lat) || (gonPoints[j].lat <= point.lat && point.lat < gonPoints[i].lat)) &&  
        (point.lng < (gonPoints[j].lng - gonPoints[i].lng) * (point.lat - gonPoints[i].lat) / (gonPoints[j].lat - gonPoints[i].lat) + gonPoints[i].lng) &&  
        (c = !c);  
    return c;  
};

/***
 * 公交方案, 途经点
 * @returns {ZMap.crossPointTraffic}
 */
ZMap.crossPointTraffic = function(opts) {
	this.driving = new BMap.DrivingRoute(ZMap.mapObj, {renderOptions:{enableDragging: true,autoViewport: true}}); //renderOptions 下 map 会出现 起点,终点图标
	this.start = opts.start;
	this.end = opts.end;
	this.pass = opts.pass;
	this.icon = opts.icon;
	this.mkrType = opts.type || 'Label';
	this.polylines = [];
	
	this.init();
};

ZMap.crossPointTraffic.prototype.init = function() {
	var me = this;
	
	//me.reset();
	
	me.driving.setSearchCompleteCallback(function() {
		var pts = me.driving.getResults().getPlan(0).getRoute(0).getPath(); 
		var polyline = new BMap.Polyline(pts);       
		
		me.polylines.push(polyline);
		ZMap.mapObj.addOverlay(polyline);  
        
        if (me.start && me.end) {
        	me.mkrType == 'Label' ? ZMap.labelMarker(me.icon.start, pts[0]) : ZMap.iconMarker(me.icon.start, pts[0]);
        	me.mkrType == 'Label' ? ZMap.labelMarker(me.icon.end, pts[pts.length - 1]) : ZMap.iconMarker(me.icon.end, pts[pts.length - 1]);
        } else {
        	if (me.start) {
        		me.mkrType == 'Label' ? ZMap.labelMarker(me.icon.start, pts[0]) : ZMap.iconMarker(me.icon.start, pts[0]);
        		me.mkrType == 'Label' ? ZMap.labelMarker(me.icon.pass, pts[pts.length - 1]) : ZMap.iconMarker(me.icon.pass, pts[pts.length - 1]);
        	} else if (me.pass) {
        		me.mkrType == 'Label' ? ZMap.labelMarker(me.icon.pass, pts[pts.length - 1]) : ZMap.iconMarker(me.icon.pass, pts[pts.length - 1]);
        	} else {
        		me.mkrType == 'Label' ? ZMap.labelMarker(me.icon.end, pts[pts.length - 1]) : ZMap.iconMarker(me.icon.end, pts[pts.length - 1]);
        	}
        	
        }
	});
};

ZMap.crossPointTraffic.prototype.reset = function() {
	var me = this;
	if (me.polylines.length > 0) {
		for (itm in me.polylines){
			var line = me.polylines[itm];
			ZMap.mapObj.removeOverlay(line);
		}
		
		me.polylines = [];
	};
	me.start = false;
	me.pass = false;
	me.end = false;
};

ZMap.crossPointTraffic.prototype.search = function(start, end) {
	var me = this;
	me.driving.search(start, end);
};
