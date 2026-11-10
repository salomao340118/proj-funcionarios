// Array em memória com os funcionários (os dados somem ao recarregar a página)
let funcionarios = [];

// Contador usado para gerar um ID único para cada funcionário
let proximoId = 1;

// ID do funcionário em edição (null = cadastro novo)
let idEdicao = null;

// Texto válido: só letras (com acento), separadas por espaço, hífen ou apóstrofo
const REGEX_TEXTO = /^\p{L}+(?:[ '\-]\p{L}+)*$/u;

// >>> MUDANÇA (Exercício 3): validarFuncionario virou ARROW FUNCTION
// (antes era "function validarFuncionario(...)")
// Retorna mensagem de erro ou null se estiver tudo certo
const validarFuncionario = (nome, idadeTxt, cargo, salarioTxt) => {
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
};

// >>> MUDANÇA (Exercício 3): funções de manipulação do array reescritas como
// ARROW FUNCTIONS (lambdas). Comparação com a versão do Exercício 2:
//
//   Antes: function buscarPorId(id) {
//            return funcionarios.find(function (f) { return f.id === id; });
//          }
//   Agora: const buscarPorId = (id) => funcionarios.find((f) => f.id === id);
//
// Com um único comando no corpo, dá para omitir as chaves e o "return".

// Busca um funcionário pelo ID (retorna undefined se não encontrar)
const buscarPorId = (id) => funcionarios.find((f) => f.id === id);

// Busca funcionários cujo nome contém o texto digitado (sem diferenciar maiúsculas)
const buscarPorNome = (termo) =>
  funcionarios.filter((f) => f.nome.toLowerCase().includes(termo.toLowerCase()));

// Adiciona um funcionário ao array
const adicionarFuncionario = (funcionario) => funcionarios.push(funcionario);

// Remove o funcionário com o ID indicado
const removerPorId = (id) => {
  funcionarios = funcionarios.filter((f) => f.id !== id);
};

// Atualiza os dados de um funcionário usando o método atualizar() da classe
const atualizarFuncionario = (id, nome, idade, cargo, salario) => {
  buscarPorId(id).atualizar(nome, idade, cargo, salario);
};

// Referências aos elementos da página, buscadas uma única vez
const btnSalvar = document.getElementById("btn-salvar");
const form = document.getElementById("form-funcionario");
const campoBusca = document.getElementById("busca");

// Sai do modo edição: limpa o formulário e volta o botão ao texto original
const cancelarEdicao = () => {
  idEdicao = null;
  form.reset();
  btnSalvar.textContent = "Cadastrar";
};

// Redesenha a tabela respeitando o texto que está no campo de busca
const atualizarTela = () => renderizarTabela(buscarPorNome(campoBusca.value));

// >>> MUDANÇA (Exercício 3): addEventListener com FUNÇÃO ANÔNIMA TRADICIONAL
// (substitui o onclick="salvarFuncionario()" que ficava no HTML)
btnSalvar.addEventListener("click", function () {
  const nome = document.getElementById("nome").value.trim();
  const idadeTxt = document.getElementById("idade").value;
  const cargo = document.getElementById("cargo").value.trim();
  const salarioTxt = document.getElementById("salario").value;

  // Se os dados forem inválidos, avisa e para
  const erro = validarFuncionario(nome, idadeTxt, cargo, salarioTxt);
  if (erro) {
    alert(erro);
    return;
  }

  if (idEdicao === null) {
    adicionarFuncionario(new Funcionario(proximoId++, nome, Number(idadeTxt), cargo, Number(salarioTxt)));
  } else {
    atualizarFuncionario(idEdicao, nome, Number(idadeTxt), cargo, Number(salarioTxt));
  }

  cancelarEdicao();
  atualizarTela();
});

// >>> MUDANÇA (Exercício 3): evento do campo de busca, com ARROW FUNCTION
campoBusca.addEventListener("input", () => atualizarTela());

// Carrega os dados do funcionário no formulário para edição (arrow function)
const preencherFormulario = (id) => {
  const f = buscarPorId(id);
  document.getElementById("nome").value = f.nome;
  document.getElementById("idade").value = f.idade;
  document.getElementById("cargo").value = f.cargo;
  document.getElementById("salario").value = f.salario;
  idEdicao = id;
  btnSalvar.textContent = "Salvar alteração";
};

// >>> MUDANÇA (Exercício 3): agora o botão usa addEventListener (antes era botao.onclick = ...)
const criarBotao = (texto, aoClicar) => {
  const botao = document.createElement("button");
  botao.textContent = texto;
  botao.addEventListener("click", aoClicar);
  return botao;
};

// >>> MUDANÇA (Exercício 3): a tabela agora recebe a lista a ser exibida
// (por padrão, todos os funcionários) e usa forEach com arrow function
const renderizarTabela = (lista = funcionarios) => {
  const tbody = document.getElementById("tabela-funcionarios");
  tbody.innerHTML = ""; // limpa as linhas antigas

  lista.forEach((f) => {
    const tr = document.createElement("tr");

    // Cria uma célula <td> para cada valor da linha
    [f.id, f.nome, f.idade, f.cargo, Funcionario.formatarMoeda(f.salario)].forEach((valor) => {
      const td = document.createElement("td");
      td.textContent = valor;
      tr.appendChild(td);
    });

    const tdAcoes = document.createElement("td");

    // Botão Editar: FUNÇÃO ANÔNIMA TRADICIONAL no evento de clique
    tdAcoes.appendChild(criarBotao("Editar", function () {
      preencherFormulario(f.id);
    }));

    // >>> MUDANÇA (Exercício 3): botão Excluir com ARROW FUNCTION no evento de clique.
    // Como substituir uma função anônima tradicional por uma arrow function:
    //
    //   Antes (anônima tradicional):  criarBotao("Excluir", function () { ... })
    //   Agora (arrow function):       criarBotao("Excluir", () => { ... })
    //
    // Basta trocar a palavra "function" pela seta "=>" depois dos parênteses.
    tdAcoes.appendChild(criarBotao("Excluir", () => {
      removerPorId(f.id);
      if (idEdicao === f.id) cancelarEdicao();
      atualizarTela();
    }));

    tr.appendChild(tdAcoes);
    tbody.appendChild(tr);
  });
};