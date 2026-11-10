// Array em memória com os funcionários (os dados somem ao recarregar a página)
let funcionarios = [];

// Contador usado para gerar um ID único para cada funcionário
let proximoId = 1;

// ID do funcionário em edição (null = cadastro novo)
let idEdicao = null;

// Texto válido: só letras (com acento), separadas por espaço, hífen ou apóstrofo
const REGEX_TEXTO = /^\p{L}+(?:[ '\-]\p{L}+)*$/u;

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

// ---------- Arrow functions de manipulação do array ----------
const buscarPorId = (id) => funcionarios.find((f) => f.id === id);

const buscarPorNome = (termo) =>
  funcionarios.filter((f) => f.nome.toLowerCase().includes(termo.toLowerCase()));

const adicionarFuncionario = (funcionario) => funcionarios.push(funcionario);

const removerPorId = (id) => {
  funcionarios = funcionarios.filter((f) => f.id !== id);
};

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

// Evento de clique do botão do formulário (função anônima tradicional)
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

// Filtra a tabela enquanto o usuário digita na busca (arrow function)
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

// Cria um botão e associa a ele o evento de clique recebido
const criarBotao = (texto, aoClicar) => {
  const botao = document.createElement("button");
  botao.textContent = texto;
  botao.addEventListener("click", aoClicar);
  return botao;
};

// Redesenha a tabela com a lista recebida (por padrão, todos os funcionários)
const renderizarTabela = (lista = funcionarios) => {
  const tbody = document.getElementById("tabela-funcionarios");
  tbody.innerHTML = ""; // limpa as linhas antigas

  lista.forEach((f) => {
    const tr = document.createElement("tr");

    [f.id, f.nome, f.idade, f.cargo, Funcionario.formatarMoeda(f.salario)].forEach((valor) => {
      const td = document.createElement("td");
      td.textContent = valor;
      tr.appendChild(td);
    });

    const tdAcoes = document.createElement("td");

    // Botão Editar: função anônima tradicional
    tdAcoes.appendChild(criarBotao("Editar", function () {
      preencherFormulario(f.id);
    }));

    // Botão Excluir: arrow function
    tdAcoes.appendChild(criarBotao("Excluir", () => {
      removerPorId(f.id);
      if (idEdicao === f.id) cancelarEdicao();
      atualizarTela();
    }));

    tr.appendChild(tdAcoes);
    tbody.appendChild(tr);
  });
};

// =====================================================================
// >>> MUDANÇA (Exercício 4): TUDO daqui para baixo é NOVO (relatórios)
// =====================================================================

// Área da página onde os relatórios aparecem
const resultado = document.getElementById("resultado-relatorio");

// Mostra um relatório: um título e uma lista de linhas de texto
const mostrar = (titulo, linhas) => {
  resultado.innerHTML = ""; // limpa o relatório anterior

  const h3 = document.createElement("h3");
  h3.textContent = titulo;
  resultado.appendChild(h3);

  // Se não há dados, avisa e encerra
  if (linhas.length === 0) {
    resultado.appendChild(document.createTextNode("Nenhum dado para exibir."));
    return;
  }

  // Monta uma lista <ul> com um <li> por item
  const ul = document.createElement("ul");
  linhas.forEach((texto) => {
    const li = document.createElement("li");
    li.textContent = texto;
    ul.appendChild(li);
  });
  resultado.appendChild(ul);
};

// >>> MUDANÇA (Exercício 4): relatório de salários altos, com FILTER e MAP
// filter mantém só quem ganha MAIS de 5000 (estritamente maior); map transforma cada um em texto
document.getElementById("btn-salario-alto").addEventListener("click", () => {
  const altos = funcionarios.filter((f) => f.salario > 5000);
  mostrar("Funcionários com salário maior que R$ 5.000,00", altos.map((f) => f.toString()));
});

// >>> MUDANÇA (Exercício 4): média salarial, com REDUCE
// reduce soma todos os salários; depois dividimos pela quantidade
document.getElementById("btn-media-salarial").addEventListener("click", () => {
  if (funcionarios.length === 0) return mostrar("Média salarial", []); // evita dividir por zero
  const soma = funcionarios.reduce((acc, f) => acc + f.salario, 0);
  mostrar("Média salarial", [Funcionario.formatarMoeda(soma / funcionarios.length)]);
});

// >>> MUDANÇA (Exercício 4): cargos únicos, com MAP, NEW SET e FIND
// 1) map + toLowerCase pega os cargos em minúsculo, para "Dev" e "dev" contarem como iguais
// 2) new Set remove as repetições
// 3) [...set] converte o Set de volta em array
// 4) map + find recupera o texto original (com as maiúsculas digitadas) de cada cargo
document.getElementById("btn-cargos-unicos").addEventListener("click", () => {
  const chaves = [...new Set(funcionarios.map((f) => f.cargo.toLowerCase()))];
  const cargosUnicos = chaves.map(
    (chave) => funcionarios.find((f) => f.cargo.toLowerCase() === chave).cargo
  );
  mostrar("Cargos únicos", cargosUnicos);
});

// >>> MUDANÇA (Exercício 4): lista de nomes em maiúsculo, com MAP
document.getElementById("btn-nomes-maiusculos").addEventListener("click", () => {
  const nomes = funcionarios.map((f) => f.nome.toLocaleUpperCase("pt-BR"));
  mostrar("Nomes em maiúsculo", nomes);
});