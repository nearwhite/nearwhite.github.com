/*入口脚本*/
require.config({
	paths: { // -- 配置别名
		//"amazeui": "http://cdn.amazeui.org/amazeui/2.6.2/js/amazeui.min", // 妹子Ui
		//"jquery": "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min",
		"jquery": "plugs/jquery.min",
		"amazeui": "plugs/amazeui.min",
		"Vue": "plugs/vue.min",
		"lazyload": "plugs/jquery.lazyload.min",
		"swiper": "plugs/swiper-3.3.1.jquery.min",
		"cityselect" : "plugs/jquery.cityselect",
		"gsJsPlugs": "gsJsPlugs",
		"loadImage": "plugs/jquery.loadImage",
		"details": "details",
		"cart" : "cart"
	}
});
require(["jquery", "amazeui"], function($) {
	$(function() {
		if(typeof requireJs == "string"){
			homeInit();
		}else if (typeof(requireJs) == "object") {
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
		if(nwStoreVal){
			if(nwStoreVal.cartNumber > 0){
				nwFooter.find("div.footer-shopping-basket").addClass("have").children("span.basket-icon").text(nwStoreVal.cartNumber);
			}
		}
		
//		var bodyElm = document.getElementsByTagName("body")[0];
//		// 去除loading框
//		bodyElm.classList.remove("loading");
//		$("#nw-home-loading,#nprogress").remove();
	}
});