/**
 * db管理器相关的js
 * @author xianliezhao
 */

var DbMgr = (function () {

    /**
     * 事件绑定
     */
    function bindEvent() {
        // 点击链接直接登录db
        $('ul.db-list li a.db-name').click(function (event) {
            var db = $(this).attr('data-db');
            var server = $(this).attr('data-server');
            $('input[name="auth[server]"]').val(server);
            var el = $('input[name="auth[db]"]').val(db);
            el[0].form.submit();
            event.preventDefault();
        });

        // 登录其他db
        $('#dbLoginBtn').click(function (event) {
            $('#loginForm').toggle();
        });

        $('#showDictionary').click(function(event){
            $('#boxDictionary').toggle();
        });

        SyntaxHighlighter.all();
    }

    function init() {
        $(function () {
            bindEvent();
        });
    }

    return {
        init: init
    };
})();

DbMgr.init();