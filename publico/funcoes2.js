function carregarPendentes(){
    $("#pendente").html('<h1>Pendentes</h1>')
    $.ajax({
        url: 'http://localhost:3000/projetos_pendentes',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function(resposta){
            if(resposta.msg){
                $("#pendente").append(resposta.msg)
                return
            }
            resposta.forEach(function(item){
                $("#pendente").append(`
                    <div class='cartoes'>
                       <b>Nº </b> <span id='id_projeto'>${item.id_projeto}</span> <br>
                       <span id='nome_projeto'> ${item.nome_projeto}</span> <br>
                       <span id='descricao'>${item.descricao}</span> <br>
                       <span id='situacao'>${item.situacao}</span> <br>
                    </div>
                `)
            })
        },
        error: function(){
            alert("Falha ao acessar GET /projetos_pendentes")
        }
    })
}

// Executar ações ao abrir o site
$(document).ready(function(){
   carregarPendentes()
})