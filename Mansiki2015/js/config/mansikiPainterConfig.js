define([], function () {
    var PaintConfig = {};
    Object.defineProperty(PaintConfig, "imageMime", { //定数
	value : ["1280x800","1920x1080","800x480","800x600"]
	,writable : false });
    Object.defineProperty(PaintConfig, "canvasSizes", { //定数
	value : ["1280x800","1920x1080","800x480","800x600"]
	,writable : false });
    return PaintConfig;
});