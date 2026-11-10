// Array em memória com os funcionários (os dados somem ao recarregar a página)
let funcionarios = [];

// Contador usado para gerar um ID único para cada funcionário
let proximoId = 1;

// >>> MUDANÇA (Exercício 2): guarda o ID do funcionário que está sendo editado
// (null = estamos cadastrando um funcionário novo)
let idEdicao = null;

// Texto válido: só letras (com acento), separadas por espaço, hífen ou apóstrofo
const REGEX_TEXTO = /^\p{L}+(?:[ '\-]\p{L}+)*$/u;

// Valida os dados do formulário; retorna mensagem de erro ou null se estiver tudo certo
function validarFuncionario(nome, idadeTxt, cargo, salarioTxt) {
  // Nome: só letras, até 100 caracteres
  if (nome.length > 100 || !REGEX_TEXTO.test(nome)) {
    return "O nome deve conter apenas letras (sem números ou símbolos).";
  }

  // Idade: só dígitos (rejeita negativos e decimais), entre 14 e 100
  if (!/^\d+$/.test(idadeTxt) || Number(idadeTxt) < 14 || Number(idadeTxt) > 100) {
    return "A idade deve ser um número inteiro entre 14 e 100.";
  }

  // Cargo: só letras, até 60 caracteres
  if (cargo.length > 60 || !REGEX_TEXTO.test(cargo)) {
    return "O cargo deve conter apenas letras (sem números ou símbolos).";
  }

  // Salário: positivo, com no máximo 2 casas decimais, até 1.000.000
  const salario = Number(salarioTxt);
  if (!/^\d+(\.\d{1,2})?$/.test(salarioTxt) || salario <= 0 || salario > 1000000) {
    return "O salário deve ser maior que zero (até 2 casas decimais e no máximo 1.000.000).";
  }

  return null; // sem erros
}

// >>> MUDANÇA (Exercício 2): funções de manipulação do array, ainda no formato tradicional
// (no Exercício 3 elas serão reescritas como arrow functions)

// Busca um funcionário pelo ID (retorna undefined se não encontrar)
function buscarPorId(id) {
  return funcionarios.find(function (f) {
    return f.id === id;
  });
}

// Remove o funcionário com o ID indicado (filter mantém todos, menos ele)
function removerPorId(id) {
  funcionarios = funcionarios.filter(function (f) {
    return f.id !== id;
  });
}

// >>> MUDANÇA (Exercício 2): sai do modo edição, limpa o formulário
// e volta o botão ao texto original
function cancelarEdicao() {
  idEdicao = null;
  document.getElementById("form-funcionario").reset();
  document.getElementById("btn-salvar").textContent = "Cadastrar";
}

// >>> MUDANÇA (Exercício 2): antes era cadastrarFuncionario(); agora cadastra OU salva a edição
function salvarFuncionario() {
  // Lê os valores digitados (trim remove espaços nas pontas)
  const nome = document.getElementById("nome").value.trim();
  const idadeTxt = document.getElementById("idade").value;
  const cargo = document.getElementById("cargo").value.trim();
  const salarioTxt = document.getElementById("salario").value;

  // Valida antes de salvar; se houver erro, avisa e interrompe
  const erro = validarFuncionario(nome, idadeTxt, cargo, salarioTxt);
  if (erro) {
    alert(erro);
    return;
  }

  if (idEdicao === null) {
    // Modo cadastro: cria uma instância da classe e a adiciona ao array
    funcionarios.push(new Funcionario(proximoId++, nome, Number(idadeTxt), cargo, Number(salarioTxt)));
  } else {
    // >>> MUDANÇA (Exercício 2): modo edição: busca o funcionário e atualiza
    // os atributos dele com o método atualizar() da classe
    const funcionario = buscarPorId(idEdicao);
    funcionario.atualizar(nome, Number(idadeTxt), cargo, Number(salarioTxt));
  }

  cancelarEdicao();    // limpa o formulário e sai do modo edição (serve para os dois casos)
  renderizarTabela();  // atualiza a tabela
}

// >>> MUDANÇA (Exercício 2): carrega os dados do funcionário no formulário para edição
function preencherFormulario(id) {
  const f = buscarPorId(id);
  document.getElementById("nome").value = f.nome;
  document.getElementById("idade").value = f.idade;
  document.getElementById("cargo").value = f.cargo;
  document.getElementById("salario").value = f.salario;

  idEdicao = id; // lembra qual funcionário está sendo editado
  document.getElementById("btn-salvar").textContent = "Salvar alteração";
}

// >>> MUDANÇA (Exercício 2): cria um botão e associa o evento onclick à função recebida
function criarBotao(texto, aoClicar) {
  const botao = document.createElement("button");
  botao.textContent = texto;
  botao.onclick = aoClicar;
  return botao;
}

// Desenha a tabela com base no array de funcionários
function renderizarTabela() {
  const tbody = document.getElementById("tabela-funcionarios");
  tbody.innerHTML = ""; // limpa as linhas antigas

  for (let i = 0; i < funcionarios.length; i++) {
    const f = funcionarios[i];
    const tr = document.createElement("tr");

    // Usa os métodos de acesso (get) da classe para ler os dados
    const valores = [f.id, f.nome, f.idade, f.cargo, Funcionario.formatarMoeda(f.salario)];

    for (const valor of valores) {
      const td = document.createElement("td");
      td.textContent = valor; // textContent é seguro: não interpreta HTML
      tr.appendChild(td);
    }

    // >>> MUDANÇA (Exercício 2): célula de ações, com onclick recebendo FUNÇÕES ANÔNIMAS
    const tdAcoes = document.createElement("td");

    tdAcoes.appendChild(criarBotao("Editar", function () {
      preencherFormulario(f.id);
    }));

    tdAcoes.appendChild(criarBotao("Excluir", function () {
      removerPorId(f.id);
      // Se o funcionário excluído era o que estava em edição, cancela a edição
      if (idEdicao === f.id) cancelarEdicao();
      renderizarTabela();
    }));

    tr.appendChild(tdAcoes);
    tbody.appendChild(tr);
  }
}