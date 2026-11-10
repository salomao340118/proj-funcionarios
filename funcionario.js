// Classe que representa um funcionário da startup
class Funcionario {
  // Construtor: chamado com "new Funcionario(...)" para inicializar os atributos.
  // Os atributos começam com "_" por convenção: devem ser acessados pelos get/set.
  constructor(id, nome, idade, cargo, salario) {
    this._id = id;
    this._nome = nome;
    this._idade = idade;
    this._cargo = cargo;
    this._salario = salario;
  }

  // Métodos de acesso (get) e de modificação (set)
  get id() { return this._id; } // só tem get: o ID não pode ser alterado depois

  get nome() { return this._nome; }
  set nome(valor) { this._nome = valor; }

  get idade() { return this._idade; }
  set idade(valor) { this._idade = valor; }

  get cargo() { return this._cargo; }
  set cargo(valor) { this._cargo = valor; }

  get salario() { return this._salario; }
  set salario(valor) { this._salario = valor; }

  // Método estático: pertence à classe, não a um funcionário específico.
  // Formata um número como moeda brasileira (ex.: 5000 -> "R$ 5.000,00")
  static formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  // Retorna os dados do funcionário em formato de texto
  toString() {
    return `${this.nome}, ${this.idade} anos, ${this.cargo}, salário ${Funcionario.formatarMoeda(this.salario)}`;
  }
}