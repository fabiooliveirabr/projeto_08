const db = require('./conexao');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Diz ao Express para servir arquivos da pasta 'publico'
app.use(express.static(path.join(__dirname, 'publico')));

app.use(session({
  secret: '46feb3e2fec47e6d6cd7bc44bfe1aef9',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 15 * 60 * 1000 }
}));

// Página principal
app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, 'privado', 'index.html'))
})

// Página gerenciar projetos
app.get('/projetos', (req, res)=>{
  res.sendFile(path.join(__dirname, 'privado', 'projetos.html'))
})

// Endpoint para consultar os engenheiros
app.get('/engenheiros', (req, res)=>{
    db.query('SELECT * FROM tb_engenheiros', (erro, resultado)=>{
        if(erro){return res.json({msg:'Falha ao consultar os engenheiros'+erro.message})}
        return res.json(resultado)
    })
})

// Endpoint para cadastrar
app.post('/projetos', (req, res)=>{
    const {nome_projeto, fk_id_engenheiro,
           situacao, descricao} = req.body;
    db.query(`INSERT INTO tb_projetos (nome_projeto, fk_id_engenheiro,
             situacao, descricao) VALUES (?, ?, ?, ?)`, 
             [nome_projeto, fk_id_engenheiro, situacao, descricao],
             (erro, resultado)=>{
                  if(erro){return res.json({msg:"Falha ao cadastrar"+erro.message}) }
                  return res.json({msg:"Cadastrado com sucesso!"})
             })
})


// Endpoint para cadastrar engenheiro
app.post('/engenheiro', (req, res)=>{
    const {nome_engenheiro} = req.body;
    db.query(`INSERT INTO tb_engenheiros (nome_engenheiro) VALUES (?)`,
             [nome_engenheiro],
             (erro, resultado)=>{
                if(erro) {return res.json({msg: "Falha ao cadastrar!"+erro.message})}
                return res.json({msg: "Cadastrado com sucesso!"})
             })
})

// Endpoint para consultar todos os projetos com status Pendente
app.get('/projetos_pendentes', (req, res)=>{
    db.query(`SELECT * FROM vw_proj_eng WHERE situacao='Pendente'`,
             (erro, resultado)=>{
                if(erro){return res.json({msg:"Falha ao consultar!"+erro.message})}
                if(resultado.length == 0){return res.json({msg:"Nenhum projeto"})}
                return res.json(resultado)
             })
})
// Endpoint para consultar todos os projetos com status finalizados
app.get('/projetos_finalizados', (req, res)=>{
    db.query(`SELECT * FROM vw_proj_eng WHERE situacao='Finalizado'`,
             (erro, resultado)=>{
                if(erro){return res.json({msg:"Falha ao consultar!"+erro.message})}
                if(resultado.length == 0){return res.json({msg:"Nenhum projeto"})}
                return res.json(resultado)
             })
})
// Endpoint para consultar todos os projetos com status em andamento
app.get('/projetos_em_andamento', (req, res)=>{
    db.query(`SELECT * FROM vw_proj_eng WHERE situacao='Em andamento'`,
             (erro, resultado)=>{
                if(erro){return res.json({msg:"Falha ao consultar!"+erro.message})}
                if(resultado.length == 0){return res.json({msg:"Nenhum projeto"})}
                return res.json(resultado)
             })
})

//Endpoint para deletar projetos
app.delete('/deletar_projeto/:id_projeto', (req, res)=>{
  const {id_projeto} = req.params;
  db.query('DELETE FROM tb_projetos WHERE id_projeto=?', [id_projeto],
    (erro, resultado)=>{
        if(erro){return res.json({msg:"Falha ao deletar! "+erro.message}) }
        if(resultado.affectedRows == 0){return res.json({msg:"Nada alterado!"})}
        return res.json({msg:"Deletado com sucesso!"})
    })
})

// Endpoint para editar um projeto
app.put('/alterar_projeto', (req, res)=>{
  const {id_projeto, nome_projeto, fk_id_engenheiro, situacao, descricao}
  = req.body;
  db.query(`UPDATE tb_projetos SET nome_projeto=?, fk_id_engenheiro=?,
            situacao=?, descricao=? WHERE id_projeto=?`,
           [nome_projeto, fk_id_engenheiro, situacao, descricao, id_projeto],
           (erro, resultado)=>{
              if(erro){return res.json({msg:"Falha ao atualizar! "+erro.message})}
              if(resultado.affectedRows == 0){return res.json({msg:"Nada alterado!"})}
              return res.json({msg:"Atualizado com sucesso!"})
            })
})

app.listen(3000, ()=>{
    console.log('Servidor rodando em http://localhost:3000');
});