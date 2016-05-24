/*
 * gaoshi-github 
 * QQ:465040621
 * version: "0.0.1"
 * 开始时间 : 2016年5月11日17:30:49
 * 支付页面
 * */
(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		define(["jquery", "vue", "gsJsPlugs", "amazeui"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"), require("vue"), require("gsJsPlugs"), require("amazeui"));
	} else {
		factory(root.jQuery);
	}
}(this, function($, Vue, gs) {
	$(function() {
		var cdata = {
			"totalPrice": "600.00", // 金额
			"totalNumber": 3, // 件数
			"favorablePrice": "0.00", // 优惠金额
			"favorableTotalPrice": "600.00", // 优惠后的总金额
			"favorable": "", // 优惠码
			"favorableStatus": false, // 优惠码是否正确
			"msg": "", // 留言
			"province": "北京", // 地址
			"city": "北京市",
			"district": "朝阳区",
			"houseaddress": "三里屯SOHO公寓17#2203", // 区域
			"userName": "小八", // 姓名
			"areaCode": "+86",
			"phone": "13701378834", // 手机
			"postcode": "100000", // 邮编
			"sites": [] // 地址集合
		};

		var $paySiteModel = $("#pay-site-popup"),
			$siteSlider = $paySiteModel.find(".site-slider");
		$("#pay-site").on("click", function() {
			if (vueCData.sites.length <= 1) {
				$.get("../js/data/sites.json", function(data) {
					vueCData.sites = data;
				});
				$siteSlider.flexslider({
					controlNav: false,
					touch: false,
					animationLoop: false,
					slideshow: false,
					directionNav: false
				});
			}
			$paySiteModel.modal();

			(function() {
				$.AMUI.validator.patterns.mobile = /^1((3|5|8){1}\d{1}|70|77)\d{8}$/;
				var $form = $('#add-site-form');
				var $tooltip = $('<div id="vld-tooltip">提示信息！</div>');
				$tooltip.appendTo(document.body);
				$form.validator({
					submit: function(e, validity) {
						var formValidity = this.isFormValid();
						if (formValidity) {
							var $inputDisabled = $form.find(".area-code,.district");
							$inputDisabled.prop("disabled", false);
							//var addSiteData = decodeURIComponent($form.serialize());
							var addSiteJson = $form.serializeArray();
							addSiteJson.forEach(function(v) {
								vueCData.$data[v.name] = v.value;
							})
							$inputDisabled.prop("disabled", true);
							$paySiteModel.modal("close");
						}
						return false;
					}
				});

				var validator = $form.data('amui.validator');
				$form.on('focusin focusout input', '.am-form-error input', function(e) {
					if (e.type === 'focusin') {
						var $this = $(this);
						var offset = $this.offset();
						var msg = $this.data('foolishMsg') || validator.getValidationMessage($this.data('validity'));
						$tooltip.text(msg).show().css({
							left: offset.left + 10,
							top: offset.top + $(this).outerHeight()
						});
					} else {
						$tooltip.hide();
					}
				});
			}());

			// 地区选择
			var citySel = $("#city-sel");
			require(["cityselect"], function() {　　
				citySel.citySelect({
					prov: "北京市",
					city: "东城区",
					nodata: "none"
				});
			});
		});
		$paySiteModel.on("closed.modal.amui", function() {
			$siteSlider.flexslider(0);
		});

		// 数据绑定
		var vueCData = new Vue({
			el: '#app',
			data: cdata,
			methods: {
				submit: function(event) {
					var payData = JSON.stringify(this.$data);
				},
				edit: function(index, event) {},
				change: function(index, event) {
					var changeSite = this.sites[index];
					for (var n in changeSite) {
						vueCData[n] = changeSite[n];
					}
					$paySiteModel.modal("close");
				},
				addSite: function() {
					$siteSlider.flexslider('next');
				}
			},
			computed: {
				msgLength: function() {
					return this.msg.length;
				}
			}
		});

		vueCData.$watch("favorablePrice", function() {
			var tp = parseFloat(vueCData.totalPrice),
				fp = parseFloat(vueCData.favorablePrice);
			vueCData.favorableTotalPrice = gs.retainTwoNumber(tp - fp);
		});

		$("#favorable").on("blur", function() {
			var $this = $(this);
			if (vueCData.favorable.length > 8) {
				vueCData.favorableStatus = true;
				vueCData.favorablePrice = "50.00";
			} else {
				vueCData.favorableStatus = false;
			}
		});
	});
}));