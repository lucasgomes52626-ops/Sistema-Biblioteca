<div align="center">

  # 🏛️ Sistema de Biblioteca Clássica

  <p>Um sistema de gerenciamento de biblioteca com design clássico e sofisticado. Permite administrar livros e usuários de forma eficiente, com uma interface inspirada em bibliotecas tradicionais e foco na simplicidade de uso.</p>

</div>

![Prévia do Dashboard](https://i.imgur.com/link-para-sua-imagem.png) <!-- Sugestão: substitua pelo link de uma imagem real do seu dashboard -->

---

## 🚀 Funcionalidades

O sistema oferece um conjunto completo de ferramentas para a administração de uma pequena biblioteca:

- **🔐 Autenticação Segura**: Acesso ao painel administrativo através de uma tela de login.
- **📊 Dashboard Intuitivo**: Uma visão geral com estatísticas de livros e usuários, além de um feed de atividades recentes.
- **👥 Gerenciamento de Usuários**:
  - Cadastro, listagem, edição e exclusão de usuários.
  - Busca dinâmica por nome ou e-mail.
- **📚 Gerenciamento de Livros**:
  - Registro completo de livros com título, autor, gênero, ano e descrição.
  - Upload de imagem de capa e do arquivo do livro em formato PDF.
  - Visualização dos livros em formato de galeria com suas capas.
  - Opção para ler o PDF diretamente no navegador ou baixá-lo.
- **🎨 Design Clássico e Responsivo**: Interface elegante que se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis.
- **💾 Persistência de Dados**:
  - O frontend utiliza `localStorage` para uma experiência rápida e funcional sem a necessidade de um backend.
  - O backend está preparado para persistência de dados com um banco de dados relacional (MySQL ou SQLite).

---

## ⚙️ Tecnologias Utilizadas

**Frontend:**
- **HTML5**: Estrutura semântica e acessível.
- **CSS3**: Design clássico e responsivo com Flexbox e Grid.
- **JavaScript (ES6+)**: Manipulação do DOM, interatividade e gerenciamento de estado local (`localStorage`).

**Backend:**
- **Node.js**: Ambiente de execução para o servidor.
- **Express.js**: Framework para a construção da API REST.
- **SQLite / MySQL**: O backend está configurado para usar SQLite, mas pode ser facilmente adaptado para MySQL.
- **CORS**: Habilitado para permitir requisições do frontend.

---

## 📁 Estrutura do Projeto

O repositório está organizado da seguinte forma:

```
biblioteca_sistema/
├── backend/         # Contém a API e a lógica do servidor
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/        # Contém a interface do usuário
│   ├── css/
│   ├── js/
│   ├── assets/
│   └── dashboard.html
├── .gitignore       # Arquivos e pastas a serem ignorados pelo Git
├── README.md        # Este arquivo
└── LICENSE          # Licença do projeto
```

- **`frontend/`**: Responsável por toda a parte visual e interativa que o usuário vê no navegador.
- **`backend/`**: Responsável por receber as requisições do frontend, interagir com o banco de dados e fornecer os dados necessários.

---

## 🖥️ Como Executar Localmente

Siga os passos abaixo para rodar o projeto em sua máquina.

### Pré-requisitos:
- **Node.js**: Versão 14 ou superior.
- **Git**: Para clonar o repositório.

### Passos:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/biblioteca_sistema.git
    cd biblioteca_sistema
    ```

2.  **Configure e execute o Backend (com SQLite):**
    - Navegue até a pasta do backend:
      ```bash
      cd backend
      ```
    - Instale as dependências do Node.js:
      ```bash
      npm install
      ```
    - Inicie o servidor. Ele criará um arquivo `database.sqlite` automaticamente e estará disponível em `http://localhost:3000`.
      ```bash
      npm start
      ```

3.  **Execute o Frontend:**
    - Em outra aba do terminal, navegue até a pasta `frontend`.
    - A forma mais simples de executar o frontend é abrir o arquivo `frontend/index.html` diretamente no seu navegador.
      - **Dica**: Para uma melhor experiência, você pode usar uma extensão como o **Live Server** no VS Code para servir os arquivos estáticos.

4.  **Acesse o sistema:**
    - Abra o navegador e acesse a página de login.
    - Use as credenciais padrão para entrar:
      - **Email**: `admin@biblioteca.com`
      - **Senha**: `1234`

> **Nota**: Atualmente, o frontend opera com `localStorage`. Para conectar ao backend, é necessário descomentar e adaptar as funções de `fetch` no arquivo `frontend/js/dashboard.js` para se comunicarem com a API.

---

### 💡 Opcional: Conectando com MySQL

Para usar MySQL em vez de SQLite, você precisará fazer o seguinte:
1.  **Instalar o driver do MySQL**: No terminal, dentro da pasta `backend`, execute `npm install mysql2`.
2.  **Configurar o Banco**: Certifique-se de que você tem um servidor MySQL rodando e crie um banco de dados (ex: `biblioteca_db`).
3.  **Alterar o código**: Modifique o arquivo de conexão do banco de dados no backend (`backend/models/db.js`, por exemplo) para usar as credenciais e a lógica de conexão do MySQL em vez do SQLite.

---

## 🧑‍💻 Autor

Desenvolvido por: **Lucas**

📧 E-mail: `seuemail@gmail.com`