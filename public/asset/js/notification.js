function instantExecute( fn, delay ) {
    fn();
    setInterval( fn, delay );
}

$(document).ready(function(){

    // SHOW LAYOUT
    $(".notification-div").click(function(){
        $(".notification-tab").toggleClass('notification-tab-active')
        $( ".ul-title" ).animate({
            opacity: 0.78
        }, 199)
    })
    // $(document).mouseup(function(e) {
    //     var container = $(".notification-tab");
    //     if (!container.is(e.target) && container.has(e.target).length === 0)
    //     {
    //         container.removeClass("notification-tab-active");
    //     }
    // });

     // SHOW LAYOUT
     $(".volume-div").click(function(){
        $(".volume-tab").toggleClass('volume-tab-active')
        $( ".ul-title" ).animate({
            opacity: 0.78
        }, 199)
    })
    // $(document).mouseup(function(e) {
    //     var container = $(".volume-tab");
    //     if (!container.is(e.target) && container.has(e.target).length === 0)
    //     {
    //         container.removeClass("volume-tab-active");
    //     }
    // });
    

    // GET NOTIF 
    old_notification = []
    function notification(){
        parameter = "sort_by="+value_sort
        $.ajax({
            method: "POST",
            url: "/notification",
            data:  parameter,
            dataType: "JSON",
            success: function(response){

                // SHOW 
                notification_html = ""
                if(response != null){
                    $.each(response, function(k, v){
                        if(v.StatusVerif == "1"){
                            status_verif = "text-primary"
                        }else if(v.StatusVerif == "2"){
                            status_verif = "text-warning"
                        }else{
                            status_verif = "text-transparent"
                        }
                        notification_html = notification_html + `
                        <div class="row py-1 notification-row list-row" data-name="`+v.NamaToken+`">
                            <div class="col-2 text-center" style="margin: auto;">
                                <img src="`+v.LogoToken+`" alt="" style="width: 30px; height:30px; border-radius:5px;">
                            </div>
                            <div class="col-10 ps-0">
                                <div class="d-flex flex-column">
                                    <div class="notif-top">
                                        <span>Token</span>
                                        <span class="text-uppercase text-primary">
                                            `+v.NamaToken+`
                                        </span>
                                        <span>Arbitable</span>
                                        <i class='bx bxs-circle `+status_verif+`'></i>
                                    </div>
                                    <div class="notif-bot">
                                        `+v.SelisihPersen+`% / `+v.SelisihEth+` ETH
                                    </div>
                                </div>
                            </div>
                        </div>`
                    })
                    
                    $("#notification-show").html(notification_html)

                    new_notification = []
                    if(response != null){
                        for(i = 0; i<response.length; i++){
                            if(old_notification.length == 0){
                                new_notification = response
                                old_notification = response
                                break
                            }
                            for(x = 0; x < old_notification.length; x++){
                                if(response[i][0] == old_notification[x][0]){
                                    if(response[i][1] == old_notification[x][1]){
                                        break
                                    }
                                }
                                if(x==(old_notification.length)-1){
                                    new_notification.push(response[i])
                                }
                            }
                        }
                    }

                    toast_notification = ""
                    audio_level = 0
                    $.each(new_notification, function(k,v){
                        if(v.StatusVerif == "1"){
                            status_verif = "text-primary"
                        }
                        if(v.StatusVerif == "2"){
                            status_verif = "text-warning"
                        }
                        if(v.StatusVerif == "3"){
                            status_verif = "text-transparent"
                        }

                        toast_notification +=
                        `<div class="toast btn-close-toast fade" id="toast" role="alert" data-animation="true" aria-live="assertive"  data-delay="3000" aria-atomic="true">
                            <div class="toast-header">
                                <img src="`+v.LogoToken+`" class="rounded me-2" alt="">
                                <span class="me-auto text-uppercase fw-bold">`+v.NamaToken+`&nbsp; 
                                    <i class="bx bxs-check-circle `+status_verif+`"></i>
                                </span>
                                <small class="text-muted">just now</small>
                                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div class="toast-body text-uppercase list-row" data-name="`+v.NamaToken+`">
                                Token <span class="text-primary fw-bold">`+v.NamaToken+`</span> Arbitable
                            </div>
                        </div>`

                        $("#toast-container").html(toast_notification)
                        $(".toast").toast("show");
                        $(document).on("click", ".btn-close-toast", function(){
                            $(".toast").toast("hide");
                        })

                        if(k == 0){
                            audio_level = v.LevelNotif
                            return true
                        }if(audio_level > v.LevelNotif){
                            audio_level = v.LevelNotif
                        }

                    })
                    
                  

                    if(audio_level != 0 ){
                        if(audio_level == "1"){
                            $("#notification_1").delay(50).get(0).play()
                        }else if(audio_level == "2"){
                            $("#notification_2").delay(50).get(0).play()
                        }else if(audio_level == "3"){
                            $("#notification_3").delay(50).get(0).play()
                        }
                    }
                    old_notification = response

                }
            }
        })
    }

    instantExecute(notification, 1000)
})