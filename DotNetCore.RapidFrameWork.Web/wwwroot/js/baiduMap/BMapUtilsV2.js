/*
 *@description 百度地图 JAVASCRIPT API V2.0 大众版 工具类 
 *@see http://developer.baidu.com/map/reference/index.php
 */
(function () {
    map = {};
    infoWindow = {};
    BmapUtils = {
        CONSTANT: {
            DYNAMIC_CITY: "合肥",
            CONTAINER: "baidumap",
            DEFAULT_ZOOM: 6,
            DEFAULT_INIT_ZOOM: 8,
            DEFAULT_MAX_ZOOM: 25,
            DEFAULT_MIN_ZOOM: 5
        },
        initNormalMap: function (lon, lat, zoom, maxzoom, minzoom) {
            /// <summary>
            /// 基本地图初始化
            /// </summary>
            /// <param name="lon">纬度</param>
            /// <param name="lat">经度</param>
            /// <param name="zoom">显示级别</param>
            /// <param name="maxzoom">地图最大级别</param>
            /// <param name="minzoom">地图最小级别</param>
            map = new BMap.Map(this.CONSTANT.CONTAINER, { enableMapClick: false });
            var point = new BMap.Point(lon || 117.225969, lat || 31.83026); // 默认地图初始化位置为合肥
            map.centerAndZoom(point, zoom || this.CONSTANT.DEFAULT_INIT_ZOOM);
            map.enableDragging(); // 开启拖拽
            map.setMinZoom(minzoom || this.CONSTANT.DEFAULT_MIN_ZOOM);//地图最小级别
            map.setMaxZoom(maxzoom || this.CONSTANT.DEFAULT_MAX_ZOOM);//地图最大级别
            map.enableScrollWheelZoom(true); // 允许鼠标滚轮缩放地图
            map.addControl(new BMap.NavigationControl(BMAP_ANCHOR_TOP_LEFT)); // 添加默认缩放平移控件
            map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })); // 左下角比例尺控件
            map.addControl(new BMap.OverviewMapControl()); // 添加默认缩略地图控件(鹰眼)
            var cr = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT });
            map.addControl(cr); // 添加版权控件（支持自定义版权控件）
        },
        addMapView: function () {
            /// <summary>
            /// 添加地图视图_普通街道_卫星视图_卫星和路网的混合
            /// </summary>
            if (map)
                map.addControl(new BMap.MapTypeControl({
                    anchor: BMAP_ANCHOR_TOP_LEFT, //地图摆放位置
                    mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP],//地图类型
                    offset: new BMap.Size(70, 5) //地图偏移，相对于左、上的距离。
                }));
        },
        addMarker: function (marker) {
            /// <summary>
            /// 将标记添加到地图
            /// </summary>
            /// <param name="marker">标记</param>
            if (map)
                map.addOverlay(marker);
        },
        focused: function (point, zoom) {
            /// <summary>
            /// 聚焦点
            /// </summary>
            /// <param name="point">point</param>
            /// <param name="zoom">级别</param>
            if (point) {
                var bounds = map.getBounds();
                map.centerAndZoom(point, zoom || this.CONSTANT.DEFAULT_ZOOM);
                if (!bounds.containsPoint(point)) {
                    setTimeout(function () {
                        map.panTo(point);
                    }, 500);
                }
            }
        }
    };
    BmapUtils.tool = {
        CONSTANT: {
            RANDOM_NUMER: 20
        },
        addRandomInViewRange: function (number) {
            /// <summary>
            /// </summary>
            /// <param name="number">标记个数</param>
            if (map) {
                var points = [
            { "lng": 116.092515, "lat": 33.045529, "name": "1#电站", "electric": "300Kw" },
            { "lng": 116.221296, "lat": 33.354881, "name": "2#电站", "electric": "300Kw" },
            { "lng": 116.975585, "lat": 34.016236, "name": "3#电站", "electric": "100Kw" },
            { "lng": 116.552447, "lat": 33.586169, "name": "4#电站", "electric": "200Kw" },
            { "lng": 116.67203, "lat": 32.991279, "name": "5#电站", "electric": "400Kw" },
            { "lng": 116.212097, "lat": 32.509313, "name": "6#电站", "electric": "350Kw" },
            { "lng": 117.564299, "lat": 33.323995, "name": "7#电站", "electric": "330Kw" },
            { "lng": 117.582696, "lat": 33.269919, "name": "8#电站", "electric": "320Kw" },
            { "lng": 116.837605, "lat": 32.384508, "name": "9#电站", "electric": "310Kw" },
            { "lng": 116.966386, "lat": 32.236076, "name": "10#电站", "electric": "220Kw" },
            { "lng": 117.361928, "lat": 32.259529, "name": "11#电站", "electric": "400Kw" },
            { "lng": 117.831059, "lat": 32.259529, "name": "12#电站", "electric": "410Kw" },
            { "lng": 118.300191, "lat": 32.204796, "name": "13#电站", "electric": "420Kw" },
            { "lng": 117.849457, "lat": 31.805023, "name": "14#电站", "electric": "450Kw" },
            { "lng": 117.969039, "lat": 31.616287, "name": "15#电站", "electric": "500Kw" },
            { "lng": 118.502561, "lat": 31.694974, "name": "16#电站", "electric": "600Kw" },
            { "lng": 117.315935, "lat": 31.348249, "name": "17#电站", "electric": "100Kw" },
            { "lng": 117.021578, "lat": 31.055681, "name": "18#电站", "electric": "520Kw" },
            { "lng": 118.447369, "lat": 31.364037, "name": "19#电站", "electric": "260Kw" },
            { "lng": 118.723328, "lat": 30.960598, "name": "20#电站", "electric": "180Kw" },
            { "lng": 119.450022, "lat": 30.897156, "name": "21#电站", "electric": "180Kw" },
            { "lng": 118.37378, "lat": 30.539506, "name": "22#电站", "electric": "190Kw" },
            { "lng": 117.536703, "lat": 30.340233, "name": "23#电站", "electric": "200Kw" },
            { "lng": 117.251545, "lat": 29.988518, "name": "24#电站", "electric": "400Kw" },
            { "lng": 117.085969, "lat": 30.419992, "name": "25#电站", "electric": "200Kw" },
            { "lng": 117.021578, "lat": 30.770145, "name": "26#电站", "electric": "600Kw" },
            { "lng": 116.39607, "lat": 30.873354, "name": "27#电站", "electric": "700Kw" },
            { "lng": 116.53405, "lat": 31.742154, "name": "28#电站", "electric": "800Kw" },
            { "lng": 116.73642, "lat": 31.37193, "name": "29#电站", "electric": "900Kw" }
                ];
             
                for (var i = 0; i < points.length ; i++) {
                    var marker = BmapUtils.marker.addWithTitle(points[i].lng, points[i].lat, points[i].name);
                    marker.id = i;
                    var myDate = new Date();//获取系统当前时间
                    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
                    var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
                    var day = myDate.getDate(); //获取当前日(1-31)
                    var hour = myDate.getHours(); //获取当前小时数(0-23)
                    var minute = myDate.getMinutes(); //获取当前分钟数(0-59)
                    var second = myDate.getSeconds(); //获取当前秒数(0-59)
                    var datetime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
                    BmapUtils.marker.setInfoWindow(marker, points[i].name, "", "累计发电量: " + points[i].electric + "</br>" + "召测时间: " + datetime + "</br>" + "<a style=\"color:blue;cursor:pointer;\" onclick=\"showDetail(" + i + ");\">点击查看详情</a>");
                    BmapUtils.marker.setLable(marker, points[i].name);
                    BmapUtils.addMarker(marker);
                }
            }
        }
    };
    BmapUtils.overlays = {
        find: function (properties, value) {
            /// <summary>
            /// 查找覆盖物
            /// </summary>
            /// <param name="properties">键</param>
            /// <param name="value">值</param>
            /// <returns type="">找到则返回覆盖物；若没找到则返回NULL</returns>
            var overlays = map.getOverlays();
            for (var i = 0; i < overlays.length; i++) {
                var overlay = overlays[i];
                if (overlay[properties] == value)
                    return overlay;
            }
        },
        findAll: function (properties, value) {
            /// <summary>
            /// 查找符合条件覆盖物的集合
            /// </summary>
            /// <param name="properties">键</param>
            /// <param name="value">值</param>
            /// <returns type="">Array</returns>
            var finded = new Array;
            var overlays = map.getOverlays();
            for (var i = 0; i < overlays.length; i++) {
                var overlay = overlays[i];
                if (overlay[properties] == value)
                    finded.push(overlay);
            }
            return finded;
        },
        count: function () {
            var overlays = map.getOverlays();
            return overlays.length;
        },
        show: function (properties, value) {
            /// <summary>
            /// 查找覆盖物并显示
            /// </summary>
            /// <param name="properties">键</param>
            /// <param name="value">值</param>
            var overlay = this.find(properties, value);
            if (overlay) {
                overlay.show();
            }
        },
        remove: function (properties, value) {
            /// <summary>
            /// 查找覆盖物并删除
            /// </summary>
            /// <param name="properties">键</param>
            /// <param name="value">值</param>
            var overlay = this.find(properties, value);
            if (overlay) {
                map.removeOverlay(overlay);
            }
        },
        hide: function (properties, value) {
            /// <summary>
            /// 查找覆盖物并隐藏
            /// </summary>
            /// <param name="properties">键</param>
            /// <param name="value">值</param>
            var overlay = this.find(properties, value);
            if (overlay) {
                overlay.hide();
            }
        },
        clearAll: function () {
            /// <summary>
            /// 清除地图上所有的覆盖物
            /// </summary>
            map.clearOverlays();
        }
    };
    BmapUtils.marker = {
        add: function (lon, lat) {
            /// <summary>
            /// 创建地图标记
            /// 说明：需要 map.addOverlay(marker)或MarkerManger进行管理
            /// </summary>
            /// <param name="lon">纬度</param>
            /// <param name="lat">经度</param>
            /// <returns type="">BMap.Marker</returns>
            if (map) {
                var marker = new BMap.Marker(new BMap.Point(lon, lat));
                return marker;
            }
        },
        addWithTitle: function (lon, lat, title) {
            /// <summary>
            ///创建标记并且设置toolTip文字
            ///说明：需要 map.addOverlay(marker)或MarkerManger进行管理
            /// </summary>
            /// <param name="lon">纬度</param>
            /// <param name="lat">经度</param>
            /// <param name="title">toolTip文字</param>
            /// <returns type="">BMap.Marker</returns>
            var marker = BmapUtils.marker.add(lon, lat);
            marker.setTitle(title);
            return marker;
        },
        setLable: function (marker, name) {
            /// <summary>
            /// 设置标记显示名称
            /// </summary>
            /// <param name="marker">标记</param>
            /// <param name="name">显示名称</param>
            if (marker) {
                var label = new BMap.Label(name, {
                    offset: new BMap.Size(20, -10)
                });
                marker.setLabel(label);
            }
        },
        setIcon: function (marker, iconpath, size) {
            /// <summary>
            /// 设置标记图标
            /// </summary>
            /// <param name="marker">标记</param>
            /// <param name="iconpath">图标路径</param>
            /// <param name="size">BMap.Size</param>
            if (marker) {
                var icon = new BMap.Icon(iconpath, size);
                marker.setIcon(icon);
            }
        },
        getBoundary: function (sRegion) {
            var bdary = new BMap.Boundary();
            bdary.get(sRegion, function (rs) { //获取行政区域
                var count = rs.boundaries.length; //行政区域的点有多少个
                for (var i = 0; i < count; i++) {
                    var ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeColor: "#ff0000" }); //建立多边形覆盖物
                    map.addOverlay(ply); //添加覆盖物
                }
            });
        },
        findInBounds: function (properties, value) {
            /// <summary>
            /// 查找可视范围内标记
            /// </summary>
            /// <param name="properties">键</param>
            /// <param name="value">值</param>
            /// <returns type="">若查找到则返回BMap.Marker；若查找不到则返回NULL</returns>
            var bounds = map.getBounds();
            var overlays = map.getOverlays();
            for (var i = 0; i < overlays.length; i++) {
                var overlay = overlays[i];
                if (bounds.containsPoint(overlay.getPosition())) {
                    if (overlay[properties] == value)
                        return overlay;
                }
            }
            return null;
        },
        findAllInBounds: function (properties, value) {
            /// <summary>
            /// 查找可视范围内符合条件标记的集合
            /// </summary>
            /// <param name="properties"></param>
            /// <param name="value"></param>
            /// <returns type=""></returns>
            var finded = new Array;
            var bounds = map.getBounds();
            var overlays = map.getOverlays();
            for (var i = 0; i < overlays.length; i++) {
                var overlay = overlays[i];
                if (bounds.containsPoint(overlay.getPosition())) {
                    if (overlay[properties] == value)
                        finded.push(overlay);
                }
            }
            return finded;
        },
        focused: function (marker, zoom) {
            /// <summary>
            /// 标记聚焦
            /// </summary>
            /// <param name="marker">标记</param>
            /// <param name="zoom">缩放级别</param>
            var point = marker.getPosition();
            BmapUtils.focused(point, zoom);
        },
        showInfoWindow: function (marker, title, message, htmlElement) {
            /// <summary>
            /// 显示InfoWindow
            /// </summary>
            /// <param name="marker">标记</param>
            /// <param name="title">信息窗标题文字</param>
            /// <param name="message">自定义部分的短信内容</param>
            /// <param name="htmlElement">htmlElement</param>
            var point = marker.getPosition();
            BmapUtils.infoWindow.add(point, title, message, htmlElement, true);
        },
        setInfoWindow: function (marker, title, message, htmlElement) {
            /// <summary>
            /// 设置marker标记点击时候展现的InfoWindow
            /// </summary>
            /// <param name="marker">标记</param>
            /// <param name="title">信息窗标题文字</param>
            /// <param name="message">自定义部分的短信内容</param>
            /// <param name="htmlElement">htmlElement</param>
            marker.addEventListener("click", function () {
                infoWindow = BmapUtils.infoWindow.create(title, message, htmlElement);
                marker.openInfoWindow(infoWindow);
            });
        }
    };
    BmapUtils.infoWindow =
        {
            create: function (title, message, htmlElement) {
                var sendMessage = false;
                if (message)
                    sendMessage = true;
                var opts = {
                    width: 100, //信息窗宽度，单位像素
                    height: 90, //信息窗高度，单位像素
                    title: title, // 信息窗标题文字，支持HTML内容
                    enableMessage: sendMessage, // 设置允许信息窗发送短息
                    message: message// 自定义部分的短信内容，可选项。完整的短信内容包括：自定义部分+位置链接，不设置时，显示默认短信内容。
                };
                infoWindow = new BMap.InfoWindow(htmlElement, opts); // 创建信息窗口对象
                return infoWindow;
            },
            add: function (point, title, message, htmlElement, focused) {
                /// <summary>
                /// 为point添加infoWindow对象
                /// </summary>
                /// <param name="point">point</param>
                /// <param name="title">信息窗标题文字</param>
                /// <param name="message">自定义部分的短信内容</param>
                /// <param name="htmlElement">htmlElement</param>
                /// <param name="focused">是否聚焦</param>
                if (point) {
                    infoWindow = this.create(title, message, htmlElement);
                    map.openInfoWindow(infoWindow, point);
                    if (focused) {
                        BmapUtils.focused(point, map.getZoom());
                    }
                }
            }
        };
})();