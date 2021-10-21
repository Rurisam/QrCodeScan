chrome.contextMenus.create({
	title: '二维码识别', // %s表示选中的文字
	id: '0',
	contexts: ['image'], // 只有当选中文字时才会出现此右键菜单
	onclick: function (params) {
		const url = params.srcUrl;
		convertImgToBase64(url, function (base64Img) {
			qrcode.decode(base64Img);
			qrcode.callback = function (res) {
				if (res && IsURL(res)) {
					// 注意不能使用location.href，因为location是属于background的window对象
					chrome.tabs.create({url: res});
				} else {
					alert(res)
				}
			}
		});
	}
});

function IsURL(strUrl) {
	const regular = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
	return regular.test(strUrl);
}

function convertImgToBase64(url, callback, outputFormat) {
	let canvas = document.createElement('CANVAS'),
			ctx = canvas.getContext('2d'),
			img = new Image;
	img.crossOrigin = 'Anonymous';
	img.onload = function () {
		canvas.height = img.height;
		canvas.width = img.width;
		ctx.drawImage(img, 0, 0);
		const dataURL = canvas.toDataURL(outputFormat || 'image/png');
		callback.call(this, dataURL);
		canvas = null;
	};
	img.src = url;
}







