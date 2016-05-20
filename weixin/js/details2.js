/*
 * gaoshi-github 
 * QQ:465040621
 * version: "0.0.3"
 * 开始时间 : 2016年4月28日10:26:33
 * 商品详情逻辑
 * */
(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		define(["jquery", "Vue", "gsJsPlugs", "amazeui"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("Vue"), require("gsJsPlugs"), require("amazeui"));
	} else {
		factory(root.jQuery);
	}
}(this, function($, Vue, gs) {
	// 数组求和函数
	Vue.config.debug = true;
	var amstore = $.AMUI.store;
	var nw = {
		id: gs.getUrlParam("id"), // 获取商品id
		storeKey: "nw_store", // 获取商品本地存储的key值
		storeVal: "", // 获取商品本地存储的value值
		cdata: false, // 当前商品数据
		isExist: false // 购物车是否存在此商品
	};

	//  判断是否有存储数据
	if (amstore.get(nw.storeKey)) {
		nw.storeVal = amstore.get(nw.storeKey);
	} else {
		nw.storeVal = amstore.set(nw.storeKey, {
			"cartPrice": "0",
			"cartNumber": 0,
			"items": []
		});
	}

	// 读取数据判断有没有已存储的的数据
	if (nw.storeVal.items.length > 0) {
		for (var item = 0, items = nw.storeVal.items.length; item < items; item++) {
			var itemData = nw.storeVal.items[item];
			if (itemData.id) {
				if (itemData.id == nw.id) {
					nw.isExist = true;
					nw.cdata = itemData;
				}
			}
		}
	}

	// 如果没有数据就去读取数据
	if (!nw.cdata) {
		nw.cdata = {
			"id": nw.id,
			"totalNumber": 0,
			"totalPrice": "0",
			"sizes": [{
				"number": 0,
				"sizeProvisionalNumber": 0,
				"storeNumber": 2,
				"sizeTitle": "XS(160/80A)",
				"totalPrice": "0.00"
			}, {
				"number": 0,
				"sizeProvisionalNumber": 0,
				"storeNumber": 3,
				"sizeTitle": "S (165/84A)",
				"totalPrice": "0.00"
			}, {
				"number": 0,
				"sizeProvisionalNumber": 0,
				"storeNumber": 4,
				"sizeTitle": "M (170/88A)",
				"totalPrice": "0.00"
			}, {
				"number": 0,
				"sizeProvisionalNumber": 0,
				"storeNumber": 5,
				"sizeTitle": "L (175/96A)",
				"totalPrice": "0.00"
			}],
			"imgs": [
				"img/img1.jpg",
				"img/img2.jpg",
				"img/img3.jpg",
				"img/img4.jpg",
				"img/img5.jpg"
			],
			"buttonTitle": "XS(160/80A)",
			"price": "100.00",
			"title": "白衬衫限量版"
		}
	}

	/* 记录购物车总价和总件数 */
	nw.cdata.cartNumber = nw.storeVal.cartNumber;
	nw.cdata.cartPrice = nw.storeVal.cartPrice;

	// 数据绑定
	var vueCData = new Vue({
		el: '#app',
		data: nw.cdata,
		methods: {
			add: function(index, event) {
				var size = this.$data.sizes[index];
				if (size.sizeProvisionalNumber < size.storeNumber) {
					size.sizeProvisionalNumber++;
				} else {
					// 大于库存时提醒
					var numberInput = $(event.target).prev();
					numberInput.popover("open");
					setTimeout(function() {
						numberInput.popover("close");
					}, 1000);
				}
			},
			minus: function(index) {
				this.$data.sizes[index].sizeProvisionalNumber--;
			},
			confirmPrice: function() {
				var _data = this.$data;
				// 点击确定按钮时  临时数据转为确认数据
				var addNumber = 0; // 记录尺码的总件数
				for (var i = 0, j = _data.sizes.length; i < j; i++) {
					var sizeData = _data.sizes[i];
					sizeData.number = sizeData.sizeProvisionalNumber;
					addNumber += sizeData.number;
					sizeData.totalPrice = gs.retainTwoNumber(gs.accMul(sizeData.number, _data.price)); // 记录尺码总价
				}

				// 判断件数是否小于或等于0 并存储在本地，是就删除
				if (addNumber <= 0) {
					if (typeof nw.id != "undefined") {
						console.info("删除这条数据吧");
					} else {
						console.info("什么都不用做，测试用！");
					}
				} else {
					_data.totalNumber = addNumber;
					_data.totalPrice = gs.retainTwoNumber(gs.accMul(_data.totalNumber, _data.price));
					_data.buttonTitle = "￥" + this.totalPrice;
					if (nw.isExist) {
						for (var item = 0, items = nw.storeVal.items.length; item < items; item++) {
							var itemData = nw.storeVal.items[item];
							if (itemData.id == nw.id) {
								nw.storeVal.items[item] = _data;
							}
						}
					} else {
						nw.isExist = true;
						nw.storeVal.items.push(_data);
					}
					_data.cartPrice = nw.storeVal.cartPrice = gs.retainTwoNumber(gs.objectSum(nw.storeVal.items, "totalPrice"));
					_data.cartNumber = nw.storeVal.cartNumber = gs.objectSum(nw.storeVal.items, "totalNumber");

					// 修改本地数据
					amstore.set(nw.storeKey, nw.storeVal);
					//console.info("修改后的数据：" + JSON.stringify(nw.storeVal));
				}
			}
		}
	});

	/* DOM 操作  */
	var $commodityChange = $("#commodity-change");
	var _dropdownBg = document.getElementById("dropdown-bg");
	/* 上拉框监控事件  */
	$commodityChange.on("open.dropdown.amui", function() {
		_dropdownBg.classList.add("am-active");
		$commodityChange.find(".clothes-change-ok").removeClass("am-hide");
	}).on("closed.dropdown.amui", function() {
		_dropdownBg.classList.remove("am-active");
		$commodityChange.find(".clothes-change-ok").addClass("am-hide");
		if (vueCData) {
			var sizes = vueCData.$data.sizes;
			for (var i = 0, j = sizes.length; i < j; i++) {
				sizes[i].sizeProvisionalNumber = sizes[i].number;
			}
		}
	});

	require(["swiper"], function(Swiper) {
		// 绑定内容弹层
		var $dContent = $("#details-content"),
			$dMoney = $dContent.find("div.details-money");
		var _detailsInfo = document.getElementById("details-info");
		// 开启上下触摸事件
		var mySwiper = new Swiper('#details-swiper', {
			pagination: '.swiper-pagination',
			paginationClickable: true,
			direction: "vertical",
			resistanceRatio: 0,
			onInit: function(swiper) {
				addTouchEvent(swiper);
			},
			onTouchMove: function(swiper) {
				if (_detailsInfo.classList.contains("active")) {
					$dMoney.removeClass("am-hide");
					$("#details-swiper").find("div.swiper-pagination").removeClass("active");
					_detailsInfo.classList.remove("active");
					_detailsInfo.style.transitionDuration = _detailsInfo.style.transitionDuration = "0ms";
					_detailsInfo.style.webkitTransform = _detailsInfo.style.transform = "translate3d(0px,0px,0px)";
				}
			}
		});

		// 设计师寄语等等
		var $dModel = $dContent.find("div.d-model"),
			$dModelContent = $dModel.find("div.d-model-content>div"),
			$detailsList = $dContent.find("ul.details-info-list");
		$detailsList.on("click", "li>p", function(e) {
			$dModelContent.html($(this).next().html());
			$dModel.removeClass("am-hide");
		});
		$dModel.on("click", "a.d-model-remove", function(e) {
			$dModel.addClass("am-hide");
		});

		// 商品信息等..滑上来事件
		function addTouchEvent(swiper) {
			var elm = swiper.slides[swiper.slides.length - 1];
			var _detailsInfo = document.getElementById("details-info");
			var $dSwiper = $("#details-swiper");
			var $swiperSlide = $dSwiper.find("div.swiper-slide");
			var $swiperPage = $dSwiper.find("div.swiper-pagination");
			var $detailsInfoList = $("#details-info-list");
			$detailsInfoList.css("padding-top", ($dSwiper.height() - $detailsInfoList.height()) / 2);
			$swiperSlide.css("lineHeight", $swiperSlide.height() + "px"); // 详情图片上下居中
			$swiperPage.append('<span class="swiper-pagination-bullet"><i class="am-icon-bars"></i></span>');

			$swiperPage.on("click", "span", function() {
				console.log($(this).index(),swiper.slides.length);
				if ($(this).index() == swiper.slides.length) {
					transform({
						active: true,
						d: "300ms",
						y: "translate3d(0px,-100%,0px)"
					});
				} else {
					transform({
						active: false,
						d: "300ms",
						y: "translate3d(0px,0px,0px)"
					});
				}
				return;
			});

			var touches = {
				bg: '',
				startY: '',
				endY: ''
			};

			elm.addEventListener("touchstart", function(event) {
				touches.startY = Number(event.touches[0].pageY);
				console.log(2);
			}, false);

			elm.addEventListener("touchmove", function(event) {
				touches.endY = Number(event.touches[0].pageY);;
				transform({
					active: false,
					d: "0ms",
					y: "translate3d(0px,-" + (touches.startY - touches.endY) + "px,0px)"
				});
			}, false);

			elm.addEventListener("touchend", function(event) {
				if (touches.startY > touches.endY) {
					transform({
						active: true,
						d: "300ms",
						y: "translate3d(0px,-100%,0px)"
					});
				} else {
					transform({
						active: false,
						d: "300ms",
						y: "translate3d(0px,0px,0px)"
					});
				}
			}, false);

			// 设置动画
			var transform = function(obj) {
				if (obj.active) {
					$dMoney.addClass("am-hide");
					$swiperPage.addClass("active");
					_detailsInfo.classList.add("active");
				} else {
					$dMoney.removeClass("am-hide");
					$swiperPage.removeClass("active");
					_detailsInfo.classList.remove("active");
				}
				_detailsInfo.style.transitionDuration = _detailsInfo.style.transitionDuration = obj.d;
				_detailsInfo.style.webkitTransform = _detailsInfo.style.transform = obj.y;
			}
			return {
				transform: transform
			}
		}
	});
}));