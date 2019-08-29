/** 
 * 分页js
 */
(function ($) {
	$.fn.itemPage = function (options) {
		var defaults = {};
		var options = $.extend(defaults, options);

		var data = options.data, //数据  
            currpage = options.currpage, //当前页  
            pagesize = options.pagesize; //每页显示的数据条目器  

		var total = data.total;

		var items = $("<div id='items'></div>"),
            pagectrl = $("<div id='page_ctrl'></div>");

		var first = $("<div id=\"first\" class=\"page_ctrl\" onClick=\"showPage('first')\">首 页</div>"),
            prev = $("<div id=\"prev\" class=\"page_ctrl\" onClick=\"showPage('prev')\">前一页</div>"),
            next = $("<div id=\"next\" class=\"page_ctrl\" onClick=\"showPage('next')\">后一页</div>"),
            last = $("<div id=\"last\" class=\"page_ctrl\" onClick=\"showPage('last')\">末 页</div>");

		var start = getStartindex(),
            end = getEndindex();

		for (var i = start; i < end; i++) {
			var itemi = $("<div class='page_item' onclick='showInfo(" + i + ")' onmouseout='restoreObj(" + i + ")' onmouseover='showObj(" + i + ")'>" + data.items[i].text + "</div>");
			items.append(itemi);
		}

		pagectrl.append(first);
		pagectrl.append(prev);
		pagectrl.append(next);
		pagectrl.append(last);

		var container = $(this);
		container.append(items);
		container.append(pagectrl);

		function getStartindex() {
			return (currpage - 1) * pagesize;
		}

		function getEndindex() {
			var endIndex = 0;
			if (data.total % pagesize != 0 && currpage == getLastPage()) {
				endIndex = data.total;
			} else {
				endIndex = currpage * pagesize;
			}
			return endIndex;
		}

	};
})(jQuery);