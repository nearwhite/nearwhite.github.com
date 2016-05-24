/*入口脚本*/
require.config({
	paths: {
		"amazeui": "http://cdn.amazeui.org/amazeui/2.6.2/js/amazeui.min",
		"jquery": "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min",
		"lazyload": "http://apps.bdimg.com/libs/jquery-lazyload/1.9.5/jquery.lazyload",
		"vue": "http://apps.bdimg.com/libs/vue/1.0.14/vue",
		"swiper": "plugs/swiper-3.3.1.jquery.min",
		"circliful": "plugs/jquery.circliful.min",
		"gsJsPlugs": "plugs/gsJsPlugs.min",
		"details": "details",
		"cart": "cart"
	}
});	
require(["jquery", "amazeui"], function($) {
	$(function() {
		if (typeof requireJs == "string") {
			if (requireJs) {
				indexInit();
			}
		} else if (typeof(requireJs) == "object") {
			require(requireJs);
		}
	});

	// 首页初始化
	function indexInit() {
		var $slider = $("#nw-home-slider");
		$slider.css("min-height",$slider.children("div.nw-home-slider-bg").height());
		$slider.flexslider({
			animationLoop:false,
			start : function(){
				$slider.children("div.nw-home-slider-bg").remove();
			}
	  	});
	  	// 获取购物车数据
		var nwFooter = $("#nw-footer");
		var nwStoreVal = $.AMUI.store.get("nw_store");
		if(nwStoreVal){
			if(nwStoreVal.cartNumber > 0){
				nwFooter.find("div.footer-shopping-basket").addClass("have").children("span.basket-icon").text(nwStoreVal.cartNumber);
			}
		}
		
		require(["circliful"], function() {
			$('div.circliful').circliful({
				dimension: 100,	// 圆形宽高
				width: 5,	// 厚度
				animationStep : 0.6,	// 动画速度
				text: "众筹中",	// 文本
				fgcolor: "#FFCC33",	// 前景颜色
				bgcolor: "#999999"	// 背景颜色
			});
		});
//		require(["swiper", "vue"])
	}
});