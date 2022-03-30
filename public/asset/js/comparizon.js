$(document).ready(function(){

    // SHOW COMPARE DIV 
    $("#compare-btn").click(function(){
        if(current_token == ""){
            Snackbar.show({
                text: 'Please select token first!',
                actionTextColor: '#F66496',
                backgroundColor: '#232323',
                width: 'auto',
                pos: 'top-center',
                duration: '3000'
              });
        }else{
            console.log("Tes")
            $("#comparizon-section").toggleClass("hidden")
            $("#right-section, #mid-section").toggleClass("hidden")
        }
    })

    // GET PRICE 
    $("#get-price").submit(function(e){
        e.preventDefault()
        data = $(this).serializeObject()

        if( data.compare_bo != undefined && data.compare_so != undefined){
            $("#comparizon-section").toggleClass("hidden")
            $("#right-section, #mid-section").toggleClass("hidden")
            data = JSON.stringify(data)
            $.ajax({
                beforeSend: function() {
                    $('#loading-compare').removeClass('hidden')
                },
                method: "POST",
                url: "/get-price",
                data: data,
                dataType: "json",
                complete: function(response){
                    $('#loading-compare').addClass('hidden')
                }
            })
        }else{
            Snackbar.show({
                text: 'sell order atau buy order tidak boleh kosong.',
                actionTextColor: '#F66496',
                backgroundColor: '#232323',
                width: 'auto',
                pos: 'top-center',
                duration: '3000'
            });
        }
    }) 
    
})

