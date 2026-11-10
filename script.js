// Array em memória com os funcionários (os dados somem ao recarregar a página)
let funcionarios = [];

// Contador usado para gerar um ID único para cada funcionário
let proximoId = 1;

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

// Chamada ao clicar em "Cadastrar"
function cadastrarFuncionario() {
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

  // Cria uma instância da classe e a adiciona ao array
  const funcionario = new Funcionario(proximoId++, nome, Number(idadeTxt), cargo, Number(salarioTxt));
  funcionarios.push(funcionario);

  document.getElementById("form-funcionario").reset(); // limpa o formulário
  renderizarTabela();                                  // atualiza a tabela
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

    tbody.appendChild(tr);
  }
}