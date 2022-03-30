
// function 
function instantExecute( fn, delay ) {
    fn();
    setInterval( fn, delay );
}

btn_sort = ["btn-default", "btn-verified", "btn-warning", "btn-unverified"]

$(document).ready(function(){
    $.each(btn_sort, function(k, v){
        $("#"+v).click(function(){
            value_sort = $(this).attr("data-id")
            $(".btn-sort").removeClass("btn-sort-active")
            $(this).addClass("btn-sort-active")
        })
    })
    
    function listToken(){
        $.ajax({
            type: "POST",
            data: "sort_by="+value_sort,
            url: "/get-list",
            dataType: "json",
            complete: function (response) {
                var list_html = ""
                data = response.responseJSON
                new_list = data
                if(data === null){
                    $("#content-list-token").empty()
                    old_list = ""
                }
                
                //looping through object
                $.each(data, function(k, v){
                    // var for html element
                    row_id = "row_"+k
                    number = k+1
                    
                    // status verif icon 
                    if (v.StatusVerif == "1") {
                        icon_verif = " <i class='bx bxs-circle text-primary'></i>";
                    }else if (v.StatusVerif == "2") {
                        icon_verif = " <i class='bx bxs-circle text-orange'></i>";
                    }else if (v.StatusVerif == "3") {
                        icon_verif = " <i class='bx bxs-circle text-transparent'></i>";
                    }
                    
                    // platform icon
                    if (v.Platform == "ethereum") {
                        platform_icon = " <i class='bx bxs-circle text-success'></i>";
                    }else {
                        platform_icon = " <i class='bx bxs-circle text-warning'></i>";
                    }
                    
                    // status read icon
                    if (v.St_read == "0") {
                        read_icon = " <i class='bx bxs-circle text-danger'></i>";
                    }else {
                        read_icon = " <i class='bx bxs-circle text-transparent'></i>";
                    }
                    
                    // diff eth more than 0.05
                    if(v.SelisihEth >= 0.05){
                        bg_diff_eth = "bg-secondary"
                    }else{
                        bg_diff_eth = "bg-transparent"
                    }                
                    if(v.UniqKey == current_token){
                        list_row_clicked = "list-row-clicked"
                    }else{
                        list_row_clicked = ""
                    }
    
                    // html script 
                    base_row_html = "<div id='"+row_id+"' class='d-flex list-row align-items-baseline "+list_row_clicked+"' data-name='"+v.NamaToken+"' data-id='"+v.ComparizonKey+"' uniq-id='"+v.UniqKey+"'> <div class='number'>"+number+".</div>"
                    token_html = "<div class='token-name'>"+limit(v.NamaToken, 6, false)+"</div>"
                    icon_html = "<div class='d-flex icon-status'>"+icon_verif+platform_icon+read_icon+"</div>"
                    sell_html = "<div class='market-name'><span class='badge bg-danger w-100 text-white'>"+limit(v.Sell_to, 9, false)+"</span></div>"
                    buy_html = "<div class='market-name'><span class='badge bg-success w-100 text-white'>"+limit(v.Buy_from, 9, false)+"</span></div>"
                    diff_perc_html = "<div class='difference'><span class='badge bg-transparent w-100 text-body fw-normal'>"+v.SelisihPersen+"%</span></div>"
                    diff_eth_html = "<div class='difference'><span class='badge "+bg_diff_eth+" w-100 text-body fw-normal'>"+v.SelisihEth+"</span></div></div>"
                    
                    // do with new data
                    if(old_list === null || old_list == "" || old_list.length == 0){
                        list_html = list_html+base_row_html+token_html+icon_html+sell_html+buy_html+diff_perc_html+diff_eth_html
                        $("#content-list-token").html(list_html)
                    }else{
                        if(old_list === null){
                            new_row_html = base_row_html+token_html+icon_html+sell_html+buy_html+diff_perc_html+diff_eth_html
                            $("#content-list-token").append(new_row_html)
                        }else if(old_list.length==0){
                            new_row_html = base_row_html+token_html+icon_html+sell_html+buy_html+diff_perc_html+diff_eth_html
                            $("#content-list-token").append(new_row_html)
                        }else{
                            if(old_list.length>k){
                                new_row_html = base_row_html+token_html+icon_html+sell_html+buy_html+diff_perc_html+diff_eth_html
                                $("#"+row_id).replaceWith(new_row_html)
                            }else{
                                new_row_html = base_row_html+token_html+icon_html+sell_html+buy_html+diff_perc_html+diff_eth_html
                                $("#content-list-token").append(new_row_html)
                            }
                        }
                    }
                })
    
                // remove row if old data > new data
                if(old_list === null || old_list=="" || old_list.length==0){
                    // do nothing
                }else{
                    if(old_list.length>new_list.length){
                        for(x=new_list.length;x<old_list.length;x++){
                            $("#"+"row_"+x).remove();
                        }
                    }
                }
                old_list = new_list
            }
        })
    }
    
    instantExecute(listToken, 600)

})
