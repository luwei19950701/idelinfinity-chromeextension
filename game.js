(function () {
    var href = window.location.href.toLowerCase();
    var isInDungeonForEquip = href.indexOf("map/dungeonforequip") != -1;
    var dungeonSize = 20;
    var blocks = [];
    var mblocks = [];
    var mblocks2 = [];
    var isStop = false;
    var clicks = [];

    //重置并进入下一个秘境
    function runNext() {        
        var boss = $(".boss-left").text()
        if(boss == "0"){
            $("form").attr("action", "DungeonRefresh");
            $("form").trigger("submit");

            return true;
        }
        return false;
    }

    //if (isInDungeonForEquip || !runNext())
    {
        //移动，在原有逻辑后面加一点逻辑
        function moveTo(id) {
            console.log(id)
            $(".dungeon-container").on("click", "#"+id, null, function(a) {
                var b = $(this),
                    d = b.parent(),
                    g = b.attr("id"),
                    h = $("#cid").val();
                if (b.hasClass("monster")){
                    isStop = true;
                    window.location.replace("/Battle/InDungeon?id=" + h + "&bid=" + g);
                }
                else {
                    $(".dungeon-layer").show();
                    var e = [];
                    if (0 != a.pageX) {
                        e = $(d).offset();
                        var f = $(d).width();
                        d = $(d).height();
                        var k = Math.floor(Math.random() * f);
                        e = [a.pageX, k, a.pageY, e.left, f - k, e.top, f, Math.floor(Math.random() * d), d]
                    }

                    a = {
                        id: h,
                        bid: g,
                        m: e,
                        __RequestVerificationToken: $("[name='__RequestVerificationToken']").val()
                    };
                    console.log(a)

                    $.ajax({
                        url: "MoveTo",
                        type: "post",
                        data: a,
                        dataType: "json",
                        success: function(a) {
                            $.each(a, function(a, c) {
                                void 0 == c.id && (c.id = 0);
                                a = "";
                                0 == c.d[0] && (a += " top");
                                0 == c.d[1] && (a += " left");
                                if (1 == c.m) $("#" + c.id).addClass(a);
                                else {
                                    a += " public";
                                    var b = "";
                                    0 < c.mlvl && (b += "Lv" + c.mlvl + " " + c.mname, a = a + " monster " + c.mtype);
                                    $("#" + c.id).removeClass("mask").addClass(a);
                                    "" != b && $("#" + c.id).attr("title", b)
                                }
                            });
                            0 < a.length && ($("#explore").text(parseInt($("#explore").text()) + a.length), $("#not-explore").text(parseInt($("#not-explore").text()) - a.length));
                            $(".current").removeClass("current");
                            b.addClass("current");
                            $(".dungeon-layer").hide()
                            refresh(); //重新刷新一下可用队列
                            $.each(a, function (i, b) { //把本次新增的块判断后加入可用队列
                                if (b.id != id) {
                                    tryAdd(b.id);
                                }
                            });
                            if (!isStop) {
                                setTimeout(tryMove, 1000); //继续，形成循环
                            }

                        },
                        error: function(a) {
                            alert(a.responseText);
                            $(".dungeon-layer").hide()
                        }
                    })

                }
            })
            var width = $('#'+id).width() - 1
            var height = $('#'+id).height() - 1
            var postion = $('#'+id).offset()
            var x = Math.round(postion.left + 1 + width*Math.random())
            var y = Math.round(postion.top + 1 + height * Math.random())
            $('#'+id).unbind()
            $('#'+id).trigger({type:'click',pageX: x, pageY: y})
            // var cid = $("#cid").val();
            // var current = $("#" + id);
            // if (current.hasClass("monster")) {
            //     isStop = true;
            //     window.location.replace("/Battle/InDungeon?id=" + cid + "&bid=" + id);
            // }
            // else {
            //     arr = []
            //     d = current.parent()
            //     if (void 0 != a.pageX) {
            //         e = $(d).offset();
            //         var f = $(d).width();
            //         d = $(d).height();
            //         var k = Math.floor(Math.random() * f);
            //         e = [a.pageX, k, a.pageY, e.left, f - k, e.top, f, Math.floor(Math.random() * d), d]
            //     }
            //     var data = {
            //         id : cid,
            //         bid : id,
            //         m:arr,
            //         __RequestVerificationToken : $("[name='__RequestVerificationToken']").val()
            //     };
            //
            //     $.post("MoveTo", data, function (result) {
            //
            //         $.each(result, function (i, b) {
            //             if (b.id == undefined) {
            //                 b.id = 0;
            //             }
            //             var className = "public";
            //             var title = "";
            //             if (b.d[0] == 0) {
            //                 className += " north";
            //             }
            //             if (b.d[2] == 0) {
            //                 className += " south";
            //             }
            //             if (b.d[1] == 0) {
            //                 className += " west";
            //             }
            //             if (b.d[3] == 0) {
            //                 className += " east";
            //             }
            //             if (b.mlvl > 0) {
            //                 className += " monster ";
            //                 title += "Lv" + b.mlvl + " " + b.mname;
            //
            //                 className += b.mtype;
            //             }
            //
            //             $("#" + b.id).removeClass("mask").addClass(className);
            //             if (title != "") {
            //                 $("#" + b.id).attr("title", title);
            //             }
            //         })
            //
            //         if (result.length > 0) {
            //             $("#explore").text(parseInt($("#explore").text()) + result.length);
            //             $("#not-explore").text(parseInt($("#not-explore").text()) - result.length);
            //         }
            //
            //         $(".current").removeClass("current");
            //         current.addClass("current");
            //
            //         //新增的逻辑
            //         refresh(); //重新刷新一下可用队列
            //         $.each(result, function (i, b) { //把本次新增的块判断后加入可用队列
            //             if (b.id != id) {
            //                 tryAdd(b.id);
            //             }
            //         });
            //         if (!isStop) {
            //             setTimeout(tryMove, 500); //继续，形成循环
            //         }
            //     }, "json");
            //
            // }
        }

        function sleep(d){
            var t = Date.now();
            while(Date.now - t <= d);
        }

        //判断块是否可用（值得移动）
        // function isAvailable(id) {
        //     var current = $("#" + id);
        //     if (id >= dungeonSize) {
        //         var top = $("#" + (id - dungeonSize));
        //         if (top.hasClass("mask") && !current.hasClass("north")) {
        //             return true;
        //         }
        //     }
        //     if (id % dungeonSize >= 1) {
        //         var left = $("#" + (id - 1));
        //         if (left.hasClass("mask") && !current.hasClass("west")) {
        //             return true;
        //         }
        //     }
        //     if (id % dungeonSize <= dungeonSize - 1) {
        //         var right = $("#" + (id + 1));
        //         if (right.hasClass("mask") && !current.hasClass("east")) {
        //             return true;
        //         }
        //     }
        //     if (id + dungeonSize < dungeonSize * dungeonSize) {
        //         var bottom = $("#" + (id + dungeonSize));
        //         if (bottom.hasClass("mask") && !current.hasClass("south")) {
        //             return true;
        //         }
        //     }
        //     return false;
        // }
        function  isAvailable(id){
            if(id % 20 != 19){
                class_name = document.getElementById(id+1).getAttribute('class')
                left_flag = class_name.indexOf('left')
                if(left_flag + 1 == 0){
                    left_flag = true
                }else{
                    left_flag = false
                }
                mask_flag = class_name.indexOf('mask')
                if(mask_flag && left_flag){
                    return true
                }
            }
            if(id%20 != 0){
                class_name = document.getElementById(id-1).getAttribute('class')
                mask_class = document.getElementById(id).getAttribute('class')
                left_flag = class_name.indexOf('left')
                if(left_flag + 1 == 0){
                    left_flag = true
                }else{
                    left_flag = false
                }
                mask_flag = mask_class.indexOf('mask')
                if(mask_flag && left_flag){
                    return true
                }
            }
            if(id < 380){
                class_name = document.getElementById(id+20).getAttribute('class')
                top_flag = class_name.indexOf('top')
                if(top_flag + 1 == 0){
                    top_flag = true
                }else{
                    top_flag = false
                }
                mask_flag = class_name.indexOf('mask')
                if(mask_flag && top_flag){
                    return true
                }
            }
            if(id > 19){
                class_name = document.getElementById(id-20).getAttribute('class')
                mask_class = document.getElementById(id).getAttribute('class')
                top_flag = class_name.indexOf('left')
                if(top_flag + 1 == 0){
                    top_flag = true
                }else{
                    top_flag = false
                }
                mask_flag = mask_class.indexOf('mask')
                if(mask_flag && top_flag){
                    return true
                }
            }
            return false
        }

        //将可用的块加入队列
        function tryAdd(id) {
            var current = $("#" + id);
            if (current.hasClass("boss")) {//BOSS优先
                moveTo(id);
            }
            else if (isAvailable(id)) {
                if (current.hasClass("monster")) {
                    mblocks.push(id);
                }
                else {
                    if (!current.hasClass("current")) {
                        blocks.push(id);
                    }
                }
            }
            else if (current.hasClass("monster")) {
                mblocks2.push(id);
            }
        }

        //刷新
        function refresh() {
            var i = blocks.length;
            while (i--) {
                if (!isAvailable(blocks[i])) {
                    blocks.splice(i, 1);
                }
            }
        }

        //从可用队列中取出随机块并移动过去（优先移动到没有怪物的块）
        function tryMove() {
            if (blocks.length > 0) { //可以扩展范围，并且没有怪物挡路的格子
                var index = Math.floor(Math.random() * blocks.length)
                var id = blocks[index];
                console.log(blocks)
                blocks.splice(index, 1); //先移除自己
                console.log(blocks)
                console.log(6767)

                moveTo(id);
            }
            else if (mblocks.length > 0) {//可以扩展范围，并且有怪物挡路的格子
                var index = Math.floor(Math.random() * mblocks.length)
                var id = mblocks[index];
                mblocks.splice(index, 1);
                moveTo(id);
            }
            else if (mblocks2.length > 0) {//其它有怪物的格子
                var index = Math.floor(Math.random() * mblocks2.length)
                var id = mblocks2[index];
                mblocks2.splice(index, 1);
                moveTo(id);
            }
            else {
                alert(4)

                runNext();
            }
        }

        //战斗页面自动返回
        function tryReturn() {
            var href = $(".btn-default").attr("href");
            window.location.replace(href);
        }

        //
        function start() {
            if (href.indexOf("map/dungeon") != -1) {//秘境页面
                //初始化可用块队列
                $(".public").each(function () {
                    var id = parseInt($(this).attr("id"));
                    tryAdd(id);
                    return !isStop; //如果已经跳转页面，就不用继续了
                });
                console.log(mblocks)

                if (!isStop) {
                    setTimeout(function () {
                        tryMove();
                    },1000)
                }
            }
            else if (href.indexOf("battle/indungeon") != -1) { //战斗页面
                console.log(3333)
                var time = $(".turn").length;
                if (time == 0) {
                    time = parseInt($("#time").html());
                    if (!isNaN(time)) {
                        setTimeout(tryReturn, (time + 1) * 1000);
                    }
                }
                else {
                    setTimeout(tryReturn, time * 500);
                }
            }
        }
        if ($.currentConnection) {
            $.currentConnection.done(start);
        }
    }
})();