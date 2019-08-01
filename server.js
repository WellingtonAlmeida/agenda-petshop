const { GraphQLServer } = require('graphql-yoga')
const conexao = require('./infraestrutura/conexao')
const Tabelas = require('./infraestrutura/database/tabelas')
const Operacoes = require('./infraestrutura/operations')
const Cliente = new Operacoes('cliente')

conexao.connect(erro => {
  if (erro) {
    console.log(erro)
  }

  console.log('conectou no banco')

  Tabelas.init(conexao)
})

const resolvers = {
  Query: {
    status: () => 'Servidor rodando!',
    clientes: () => Cliente.lista(),
    cliente: (root, { id }) => Cliente.buscaPorId(id)
  },
  Mutation: {
    adicionarCliente: (root, params) => Cliente.adiciona(params),
    atualizarCliente: (root, params) => Cliente.atualiza(params),
    deletarCliente: (root, { id }) => Cliente.deleta(id)
  }
}

const servidor = new GraphQLServer({
  resolvers,
  typeDefs: './schema.graphql'
})

servidor.start(() => console.log('servidor ouvindo'))