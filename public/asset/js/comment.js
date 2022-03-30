$("#comment-form").submit(function(e){
    e.preventDefault()
    data = $(this).serializeObject()
    data = JSON.stringify(data)
    $.ajax({
        method: "POST",
        url: "/comment",
        data: data,
        dataType: "JSON",
        success: function(response){
            if(response == "sukses"){
                Snackbar.show({
                    text: 'Sukses edit comment!',
                    actionTextColor: '#8dc3a7',
                    backgroundColor: '#232323',
                    width: 'auto',
                    pos: 'top-center',
                    duration: '3000'
                });
                $("#modal-comment").modal("hide")
            }else{
                Snackbar.show({
                    text: 'Gagal Sumbit!',
                    actionTextColor: '#F66496',
                    backgroundColor: '#232323',
                    width: 'auto',
                    pos: 'top-center',
                    duration: '3000'
                });
            }
        }
    })
})

date_now = new Date()

$("#textarea-comment").off()
$("#textarea-comment").on("keyup", function(a){                
    if(a.which == 13){
        temp = $("#textarea-comment").val();
        temp += date_format(date_now);
        $('#textarea-comment').val(temp)
    }
});