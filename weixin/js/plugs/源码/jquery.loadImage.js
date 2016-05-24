/*
 * gaoshi-github 
 * QQ:465040621
 * version: "0.0.1"
 * time：2016年4月27日13:38:35
 * 图片加载进度监控
 * 
 * */

(function(root, factory) {
	if (typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require("jquery"));
	} else {
		factory(root.jQuery);
	}

}(this, function($) {
	//  添加到main.js内
	// 从这里开启页面图片加载进度监控
	/*$(function() {
		var $loadingHome = $("#nw-home-loading");
		if ($loadingHome.length > 0) {
			var photos = [],
				$loadingImage = $("img.loading-image"),
				$loadingProgress = $loadingHome.find("#loading-progress");
			if ($loadingImage.length > 0) { // 当页面有需要加载等待的内容时，进行load处理
				$loadingImage.each(function() {
					photos.push($(this).data("loadSrc"));
				});
				require(["loadImage"], function() {
					$(document).loadingImage({
						photos: photos,
						onLoading: function(progress) {
							$loadingProgress.text(progress)
						},
						onComplete: function(progress) {
							pageInit(progress);
							$loadingImage.each(function(k, v) {
								this.src = $(this).data("loadSrc");
							});
							// 开启轮播
							$("#nw-home-slider").flexslider({
								directionNav: false
							});
						}
					});
				});
			} else {
				// 没有加载等待的内容时，直接展示页面。
				pageInit("100");
			}

			function pageInit(progress) {
				$loadingProgress.text(progress)
				$loadingHome.addClass('loading-remove');
				setTimeout(function() {
					$loadingHome.remove();
				}, 1000);
			}
		}
	});*/
	
	$.fn.loadingImage = function(options, callback) {
		var thisEl = this;
		var options = $.extend($.fn.loadingImage.defaults, options);
		var loadend = 0, // 记录加载完成个数
			photosLength = options.photos.length; // 需要加载的总图片个数
		thisEl.on('image-loadend', function() {
			loadend++; // 加载完成个数 + 1
			var progress = parseInt((loadend / photosLength) * 100); // 获取加载百分比
			if (loadend / photosLength == 1) {
				// 加载完成回调，返回进度
				if ($.isFunction(options.onComplete)) {
					options.onComplete(progress);
				}
			} else {
				// 加载进度回调，返回进度
				if ($.isFunction(options.onLoading)) {
					options.onLoading(progress);
				}
			}

		});
		(function() {
			//  开启异步回调
			var deferred = $.Deferred().resolve();
			$.each(options.photos, function() {
				loadImage(thisEl, this, deferred);
			});
		}());

		function loadImage(elm, src, deferred) {
			var elem = elm;
			var img = $('<img>');

			//  加载完毕调用异步回调函数
			img.load(function() {
				deferred.always(function() {
					img.remove();
					elem.trigger('image-loadend');
				});
			});
			img.error(function() {
				deferred.always(function() {
					elem.trigger('image-loadend');
				});
			})
			img.attr('src', src);
		}
	}

	$.fn.loadingImage.defaults = {
		photos: [], // 需加载的图片数组
		onLoading: function() {
			// 加载中
		},
		onComplete: function() {
			// 加载完毕回调
		}
	};

}));