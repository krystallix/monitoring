$(document).ready(function(){
    $(document).on("click", ".list-row", function(){
        uniq_id = $(this).attr("uniq-id")
        current_token = uniq_id
        tokenName = $(this).attr("data-name")
        $(this).children().find(".icon-status").children("i:last").removeClass("text-danger").addClass("text-transparent")
        $(".list-row").removeClass("list-row-clicked")
        $(this).addClass("list-row-clicked")
        $(".notification-row").removeClass("list-row-clicked")
        $("#comparizon-section").addClass("hidden")
        read_status(uniq_id)
        detail_token(tokenName)
        feather.replace()
    })
    
    // func read status
    function read_status(id){
        $.ajax({
            method: "POST",
            url: "/read-status",
            data: "read_status="+id,
            success: function (response) {
            },
        });
    }
    
    function detail_token(token){
        $.ajax({
            beforeSend: function() {
                $('#loading').removeClass('hidden')
            },
            method: "POST",
            url: "/detail-token",
            data: "token_name="+token,
            success: function (response) {
                $('#loading').addClass('hidden')
                data = response.DetailData
                comment_section(data)
                mid_section(data)
                right_section(data, response.LastScan)
                $("#right-section").removeClass("hidden")
            },
        });
    }
    
    function mid_section(detail_data){
        $("#mid-section").removeClass("hidden")
        detail_data = JSON.parse(validate(detail_data))
        DetailArbitable = detail_data.DetailArbitable
        tr_detail_bo_so = ""
        // MID BOTTOM SECTION 
        for(i=0;i<DetailArbitable.length;i++){
            detailSellTo = DetailArbitable[i].SellTo;
            detailBuyFrom = DetailArbitable[i].BuyFrom;
            if(DetailArbitable[i].SellTo == "bithumb global"){
                detailSellTo = "bithumb"
            }
            if(DetailArbitable[i].SellTo == "huobi global"){
                detailSellTo = "huobi"
            }
            if(DetailArbitable[i].BuyFrom == "bithumb global"){
                detailBuyFrom = "bithumb"
            }
            if(DetailArbitable[i].BuyFrom == "huobi global"){
                detailBuyFrom = "huobi"
            }
            
            nomer = i + 1;
            header_bo_market = "<tr class='market-row'><td width='5%' class='text-center pt-2'>"+nomer+".</td><td width='35%' class='text-center py-1 pt-2' colspan='2'><span class='badge w-100 bg-light text-uppercase'>"+detailSellTo+"</span></td>"
            header_selisih_persen = "</td><td width='35%'  class='text-center py-1 pt-2'><span class='badge w-100 bg-primary'>"+DetailArbitable[i].SelisihPersen+"%</span></td>"
            header_selisih_eth = "<td width='35%'  class='text-center py-1 pt-2'><span class='badge w-100 bg-secondary'>"+DetailArbitable[i].SelisihEth+"</span></td>"
            header_so_market = "<td width='35%'  class='text-center py-1 pt-2' colspan='2'><span class=' badge w-100 bg-light text-uppercase'>"+detailBuyFrom+"</span></td></tr>"
            total_tr_used = 0;
            if(DetailArbitable[i].DtlSell.length>DetailArbitable[i].DtlBuy.length){
                total_tr_used=DetailArbitable[i].DtlSell.length
            }else{
                total_tr_used=DetailArbitable[i].DtlBuy.length
            }
            
            header_per_arbitable = header_bo_market + header_selisih_persen + header_selisih_eth + header_so_market;
            
            tr_detail_bo_so=tr_detail_bo_so+header_per_arbitable;
            for(x=0;x<total_tr_used;x++){
                if(x<DetailArbitable[i].DtlBuy.length){
                    PairBo="<tr><td class='text-center' width=5%>&nbsp;</td><td class='text-left text-uppercase'>"+DetailArbitable[i].DtlBuy[x].Pair+"</td>"
                    SubTotalPairBo="<td width='35%'  class='text-center'>"+DetailArbitable[i].DtlBuy[x].SubTotal+"</td>"
                    if(x==0){
                        SubTotalBo ="<td  width='35%'  class='text-center'><span class=' badge w-100 bg-secondary'>"+DetailArbitable[i].TotalSell+"</span></td>"
                    }else{
                        SubTotalBo ="<td  width='35%' class='text-center'>&nbsp;</td>"
                    }
                }else{
                    PairBo="<tr width='35%'><td class='text-center' width=5%>&nbsp;</td><td class='text-center'>&nbsp;</td>"
                    SubTotalPairBo="<td width='35%'   class='text-center'>&nbsp;</td>"
                    SubTotalBo ="<td  width='35%'  class='text-center'>&nbsp;</td>"
                }
                
                tr_detail_bo_so=tr_detail_bo_so+PairBo+SubTotalPairBo+SubTotalBo;
                
                if(x<DetailArbitable[i].DtlSell.length){
                    PairSo="<td width='35%'  class='text-right text-uppercase'>"+DetailArbitable[i].DtlSell[x].Pair+"</td></tr>"
                    SubTotalPairSo="<td width='35%'  class='text-center '>"+DetailArbitable[i].DtlSell[x].SubTotal+"</td>"
                    if(x==0){
                        SubTotalSo ="<td width='35%'  class='text-center'> <span class=' badge w-100 bg-primary'>"+DetailArbitable[i].TotalBuy+"</span></td>"
                    }else{
                        SubTotalSo ="<td width='35%'  class='text-center'>&nbsp;</td>"
                    }
                }else{
                    PairSo="<td width='35%'  class='text-center'>&nbsp;</td></tr>"
                    SubTotalPairSo="<td width='35%'  class='text-center'>&nbsp;</td>"
                    SubTotalSo ="<td width='35%'  class='text-center'>&nbsp;</td>"
                }
                tr_detail_bo_so=tr_detail_bo_so+SubTotalSo+SubTotalPairSo+PairSo;
                
            }
            
        }
        
        content_mid_bottom = "<table class='table mb-0'><thead><td class='text-center' width='5%'>&nbsp;</td><td class='text-center' colspan='2'>BIDS</td><td colspan='2' class='text-center'>SELISIH</td><td class='text-center' colspan='2'>ASK</td></thead></table>"
        content_mid_bottom += "<div class='scrollable-table'><table class='table table-hover fs-7 me-2 table-mid-bottom'>"
        content_mid_bottom += "<tbody class='mt-1 tbody-tengah'>"
        content_mid_bottom += tr_detail_bo_so
        content_mid_bottom += "</tbody></table></div>"    
        
        if(detail_data.Comment){
            content_mid = `
            <div class="card px-3 py-2 h-25 mb-3">
            <div class="d-flex justify-content-between">
            <div class="text-uppercase">`
            +detail_data.NamaToken+
            `</div>
            <div id="edit-comment">
            <img class="edit-comment" src="./asset/svg/edit.svg">
            </div>
            </div>
            <div class="py-2">
            <textarea class="form-control text-area-comment text-body" rows="6" readonly>`
            +validateComment(detail_data.Comment).replace("u0026", "&")+
            `</textarea>
            </div>
            </div>
            <div class="card px-3 py-2 h-75 max-h75 d-inline-block content-mid-bottom-comment" id="content-mid-bottom">
            </div>`
            $("#content-mid").html(content_mid)
        }else{
            content_mid = `
            <div class="card px-3 py-2 h-100 max-h100">
            <div class="d-flex justify-content-between">
            <div class="text-uppercase">`
            +detail_data.NamaToken+
            `</div>
            <div id="edit-comment">
            <img class="edit-comment" src="./asset/svg/edit.svg">
            </div>
            </div>
            <div id="content-mid-bottom" class="content-mid-bottom d-inline-block" style="height: 98%;">
            </div>
            </div>`
            $("#content-mid").html(content_mid)
        }
        
        $("#content-mid-bottom").html(content_mid_bottom)
    }
    
    function right_section(detail_data, lastScan){
        $("#right-section").removeClass("hidden")
        detail_data = JSON.parse(validate(detail_data))
        
        $("#compare-name-token").val(detail_data.NamaToken)
        
        // ICON NETWORK 
        icon_network = ["ethereum","binance-smart-chain","tron","eos", "chiliz", "komodo","polkadot", "polygon-pos", "ardor",
        "qtum","xdai","stellar","neo","terra","waves","avalanche","huobi-token","nem","bitshares","binancecoin","zilliqa","klay-token","solana","mainnet"]
        
        $.each(icon_network, function(k,v){
            if(detail_data.Platform.toLowerCase() == v){
                $("#icon-network").attr("src", "./asset/img/"+v+".png")
                tippy('#icon-network', {
                    content: v,
                    placement: 'bottom',
                });
            }
        })
        // ICON TOKEN
        $("#icon-token").attr("src", detail_data.LogoToken)
        // TOKEN NAME
        $("#token-name").text(detail_data.NamaToken)
        $("#singkatan").text("[ "+detail_data.Kepanjangan+" ]")
        // LAST SCAN
        date_now = new Date()
        last_scan = new Date(lastScan)
        $("#last-scan-text").text("last scan "+diffTime(date_now, last_scan) + " ago by " +detail_data.ScannerIdentifierCabang)
        
        // CONTENT TABLE RIGHT
        console.log(detail_data)
        standard_diff_percent = 5;
        detail_right_html = ""
        $.each(detail_data.DetailMarketBo, function(k,v){
            if((v.Price-detail_data.DetailMarketSo[0].Price)/detail_data.DetailMarketSo[0].Price*100>standard_diff_percent){
                badge_buy = "bg-success"
            }else{
                badge_buy = "text-body"
            }
            
            if(v.Price == "1e-12"){
                Price = 0;
            }else{
                Price = v.Price.toFixed(9);
            }
            
            detail_right_html += `
            <div class="row py-2">
            <div class="col-2">
            <span class="badge `+badge_buy+` text-center text-uppercase w-100">
            <label class="label-checkbox" for="buy_`+k+`">
            <input type="checkbox" name="compare_bo[]" class="checkbox-buy" id="buy_`+k+`" value="`+v.Pair+`_`+v.Market+`">
            `+v.Pair+`
            </label>
            </span>
            </div> 
            <div class="col-2 text-center">
            <span class="text-uppercase w-100">
            <a href="`+v.LinkMarket+`" class="link-market" target="_blank">`+limit(v.Market, 9, false)+`</a>
            </span>
            </div> 
            <div class="col-2">
            <span class="badge `+badge_buy+` text-center text-uppercase w-100">
            `+Price+`
            </span>
            </div>`
            
            if((detail_data.DetailMarketBo[0].Price-detail_data.DetailMarketSo[k].Price)/detail_data.DetailMarketSo[k].Price*100>standard_diff_percent){
                badge_sell = "bg-danger"
            }else{
                badge_sell = "text-body"
            }
            
            if(detail_data.DetailMarketSo[k].Price == "99999"){
                Price = detail_data.DetailMarketSo[k].Price;
            }else{
                Price = detail_data.DetailMarketSo[k].Price.toFixed(9);
            }
            
            detail_right_html += `
            <div class="col-2">
            <span class="badge `+badge_sell+` text-center text-uppercase w-100">
            `+Price+`
            </span>
            </div> 
            <div class="col-2 text-center">
            <span class="text-uppercase w-100">
            <a href="`+detail_data.DetailMarketSo[k].LinkMarket+`" class="link-market" target="_blank">`+limit(detail_data.DetailMarketSo[k].Market, 9, false)+`</a>
            </span>
            </div> 
            <div class="col-2">
            <span class="badge `+badge_sell+` text-center text-uppercase w-100">
            <label class="label-checkbox" for="sell_`+k+`">
            <input type="checkbox" name="compare_so[]" class="checkbox-sell" id="sell_`+k+`" value="`+detail_data.DetailMarketSo[k].Pair+`_`+detail_data.DetailMarketSo[k].Market+`">
            `+detail_data.DetailMarketSo[k].Pair+`
            </label>
            </span>
            </div>    
            </div>`
        })
        
        $("#detail-right").html(detail_right_html)
        
        // BUTTON BOTTOM
        if(!detail_data.Explorer1){
            $("#explorer1").attr("aria-disabled", true).removeClass("btn-success").addClass("btn-light btn-disable")
        }else{
            $("#explorer1").attr("href", detail_data.Explorer1).removeClass("btn-light btn-disable").addClass("btn-success")
        }
        if(!detail_data.Explorer2){
            $("#explorer2").attr("disabled", true).attr("aria-disabled", true).removeClass("btn-success").addClass("btn-light btn-disable")
        }else{
            $("#explorer2").attr("href", detail_data.Explorer2).removeClass("btn-light btn-disable").addClass("btn-success")
        }
        if(detail_data.Platform == "ethereum"){
            link_swap = "https://app.uniswap.org/#/swap?outputCurrency="+detail_data.ContractAddr
            $("#uniswap").attr("href", link_swap).removeClass("btn-light btn-disable")
            $("#uniswap").text("Uniswap")
        }else if(detail_data.Platform == "binance-smart-chain"){
            link_swap = "https://exchange.pancakeswap.finance/#/swap?outputcurrency="+detail_data.ContractAddr
            $("#uniswap").attr("href", link_swap).removeClass("btn-light btn-disable")
            $("#uniswap").text("Pancake")
        }else{
            $("#uniswap").text("Pancake").attr("aria-disabled", true).removeClass("btn-success").addClass("btn-light btn-disable")
        }
        $("#marketcap").attr("href", detail_data.LinkMarketCap.replace("u0026", "&"))    
    }

    function comment_section(detail_data){
        date_now = new Date()
        detail_data = JSON.parse(validate(detail_data))
        $("#modal-token-name").val(detail_data.NamaToken) 
        $("#title-namaToken").html(detail_data.NamaToken) 
        $("#title-kepanjangan").html(detail_data.Kepanjangan) 
        if(detail_data.Comment != ""){
            $("#textarea-comment").val(validateComment(detail_data.Comment).replace("u0026", "&"))
        }else{
            $("#textarea-comment").val(date_format(date_now))
        }
        if(detail_data.StatusVerif == 1){
            $(".verif-radio").prop("checked", true)
        }
        if(detail_data.StatusVerif == 2){
            $(".warning-radio").prop("checked", true)
        }
        if(detail_data.StatusVerif == 3){
            $(".unverif-radio").prop("checked", true)
        }
        $(document).on("click", "#edit-comment", function(){
            $("#modal-comment").modal("show")
        })
        $(document).on("click", ".btn-close-modal", function(){
            $("#modal-comment").modal("hide")
        })
    }
    
})

