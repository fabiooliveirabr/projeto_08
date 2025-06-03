CREATE DATABASE bd_construtora;
USE bd_construtora;
CREATE TABLE tb_engenheiros(
	id_engenheiro INT PRIMARY KEY AUTO_INCREMENT,
    nome_engenheiro VARCHAR(255) NOT NULL
);
CREATE TABLE tb_projetos(
	id_projeto INT PRIMARY KEY AUTO_INCREMENT,
    nome_projeto VARCHAR(255) NOT NULL,
    fk_id_engenheiro INT NOT NULL,
    situacao ENUM('Finalizado','Pendente','Em andamento') DEFAULT 'Em andamento',
    descricao TEXT(500) NOT NULL
);
ALTER TABLE tb_projetos ADD CONSTRAINT rel_proj_eng
FOREIGN KEY (fk_id_engenheiro) REFERENCES tb_engenheiros(id_engenheiro);

INSERT INTO tb_engenheiros (nome_engenheiro) VALUES
('Francisco de Assis'), ('Joelma Carla');

INSERT INTO tb_projetos (nome_projeto, descricao, fk_id_engenheiro) VALUES
('Escadaria central', 'Shopping Riomar', 2),
('Revitalização de fachada', 'Condomínio Vila Leal', 2),
('Pintura urbana', 'Prefeitura de Jaboatão dos Guararapes', 1);

SELECT * FROM tb_projetos;

CREATE VIEW vw_proj_eng AS
SELECT * FROM tb_projetos LEFT JOIN tb_engenheiros
ON tb_projetos.fk_id_engenheiro = tb_engenheiros.id_engenheiro;

SELECT * FROM vw_proj_eng;