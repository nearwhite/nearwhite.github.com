/*入口脚本*/
require.config({
	paths: {
		"amazeui": "http://cdn.amazeui.org/amazeui/2.6.2/js/amazeui.min",
		"jquery": "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min",
		"Vue": "http://apps.bdimg.com/libs/vue/1.0.14/vue",
		"lazyload": "http://apps.bdimg.com/libs/jquery-lazyload/1.9.5/jquery.lazyload",
		"swiper": "plugs/swiper-3.3.1.jquery.min",
		"cityselect": "plugs/jquery.cityselect",
		"gsJsPlugs": "gsJsPlugs",
		"details": "details",
		"cart": "cart"
	}
});
require(["jquery", "amazeui"], function($) {
	$(function() {
		if (typeof requireJs == "string") {
			homeInit();
		} else if (typeof(requireJs) == "object") {
			require(requireJs);
		}

	});

	// 首页初始化
	function homeInit() {
		// 点击查看更多
		var $commodityShow = $("#nw-commodity-show");
		if ($commodityShow.length > 0) {
			require(["lazyload"], function() {
				$commodityShow.find("img").lazyload();
			});

			$commodityShow.on("click", ".nw-image-show-max", function() {
				var $this = $(this),
					$ulBox = $this.parent().siblings("ul");
				$this.addClass("am-hide");
				$ulBox.children("li.am-hide").removeClass("am-hide");
				$('html, body').animate({
					scrollTop: $(document).scrollTop() + 1
				}, 300);
			});
		}

		// 获取购物车数据
		var nwFooter = $("#nw-footer");
		var nwStoreVal = $.AMUI.store.get("nw_store");
		if (nwStoreVal) {
			if (nwStoreVal.cartNumber > 0) {
				nwFooter.find("div.footer-shopping-basket").addClass("have").children("span.basket-icon").text(nwStoreVal.cartNumber);
			}
		}

	}
});