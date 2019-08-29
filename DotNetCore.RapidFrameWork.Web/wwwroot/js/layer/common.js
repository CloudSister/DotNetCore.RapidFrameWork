$.extend({

    /**
     * alert弹出信息框，与layer一致
     * @param alertMsg 信息内容（文本）
     * @param alertType 提示图标（整数，0-10的选择）
     * @param alertTit 标题（文本）
     * @param alertYes 按钮的回调函数
     * @returns
     */
    alertPlus: function (alertMsg, alertType, alertTit, alertYes) {
        return layer.alert(alertMsg, alertType, alertTit, alertYes);
    },

    /***
     * layer 关闭弹出层
     * index 索引值
     */
    closeDialog: function (index) {
        return layer.close(index);
    },

    /**
     * 打开弹出层的方法
     * 0：信息框（默认），1：页面层，2：iframe层，3：加载层，4：tips层。
     * */
    alertDialog: function (setting) {
        return $.layer(setting);
    },
    /***
     *conMsg：信息内容（文本）
     * conYes：按钮一回调
     * conTit：标题（文本）
     * conNo : 关闭按钮回调(函数)
     */
    layerConfirm: function (conMsg, conYes, conTit, conNo) {
        return layer.confirm(conMsg, conYes, conTit, conNo);
    },
    /**
     * 加载tip层
     * content ：文本内容
     * follow : 要吸引的dom对象, 对象
     * parme : parme允许传这些属性{time: 自动关闭所需秒,
         * maxWidth: 最大宽度, guide: 指引方向, style: tips样式（参加api表格一中的style属性）
         */
    loadTip: function (content, follow, parme) {
        return layer.tips(content, follow, parme);
    },
    /***
     * 关闭 tip 层
     */
    closeTip: function () {
        return layer.closeTips();
    },
    /***
     * 加载层
     *loadTime：自动关闭所需等待秒数(0时则不自动关闭)，
     *loadgif：加载图标（整数，0-3的选择），
     *loadShade：是否遮罩（true 或 false）
     */
    loadTier: function (loadTime, loadgif, loadShade) {
        layer.load(loadTime, loadgif, loadShade);
    },
    /**
     * 修改层的标题
     * @param content 内容
     * @param index 层索引
     */
    updateTitle: function (content, index) {
        layer.title(content, index);
    }

});