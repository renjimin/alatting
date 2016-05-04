/**
 *
 */
$(document).ready(function () {

    /*��½����ע��ҳ����ת*/
    $("#register").click(function () {
        window.location.href = "register";
    })
    /*�����ȡ��֤��*/
    $("#btncode").click(function () {
        $("#btncodeoff").show();
        $("#btncode").hide();
        var btncodeoff = document.getElementById("btncodeoff");
        settime(btncodeoff);
        var username = $("#username").val();
        if (!username) {
            return false;
        }

        $.ajax({
            type: 'POST',
            url: '/account/send_message',
            data: {"username": username},
            success: function (data) {
                alert(data.message);
            },
            error: function (data) {
                alert(data.message);
            }
        })
    })
    var countdown = 6;

    function settime(val) {
        if (countdown < 0) {
            $("#btncodeoff").hide();
            $("#btncode").show();
            val.removeAttribute("disabled");
            val.value = "��ȡ��֤��";
        } else {
            val.setAttribute("disabled", true);
            val.value = "��ȡ��֤��(" + countdown + ")";
            countdown--;
        }
        setTimeout(function () {
            settime(val)
        }, 1000)
    }
});

