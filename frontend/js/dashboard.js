document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Inicialização e Verificação de Segurança ---

    // Garante que o usuário esteja logado antes de carregar o dashboard.
    if (localStorage.getItem('biblioteca_logged') !== 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    // --- 2. Funções Utilitárias (Helpers) ---
    function validatePDFFile(file) {
        if (!file) return { valid: false, message: 'Nenhum arquivo selecionado' };
        if (!file.type || file.type !== 'application/pdf') {
            return { valid: false, message: 'O arquivo deve ser um PDF' };
        }
        if (file.size > 5 * 1024 * 1024) {
            return { valid: false, message: 'O arquivo não pode ser maior que 5MB' };
        }
        return { valid: true };
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Armazenamento de dados em memória, carregado do localStorage.
    // Funciona como um "banco de dados" no lado do cliente.
    const store = {
        users: JSON.parse(localStorage.getItem('biblioteca_users') || 'null'),
        books: JSON.parse(localStorage.getItem('biblioteca_books') || 'null')
    };

    if (!store.users) store.users = [
        { id: Date.now()-3000, name: 'João Silva', email: 'joao@email.com', phone: '', address: '' }
    ];
    if (!store.books) store.books = [
        { id: Date.now()-2000, title: 'Dom Casmurro', author: 'Machado de Assis', genre: 'Literatura Brasileira', year: 1899, description: '' }
    ];

    // Função para persistir os dados do 'store' no localStorage.
    function persist() {
        localStorage.setItem('biblioteca_users', JSON.stringify(store.users));
        localStorage.setItem('biblioteca_books', JSON.stringify(store.books));
    }

    // --- 3. Referências de Elementos do DOM ---
    const userCountEl = document.getElementById('userCount');
    const bookCountEl = document.getElementById('bookCount');
    const recentActivityEl = document.getElementById('recentActivity');

    const booksGrid = document.getElementById('booksGrid');

    // User Management
    const userForm = document.getElementById('userForm');
    const userSubmitBtn = document.getElementById('userSubmitBtn');
    const clearUserFormBtn = document.getElementById('clearUserFormBtn');
    const usersTableBody = document.getElementById('usersTableBody');
    const userSearch = document.getElementById('userSearch');
    const userTotalCount = document.getElementById('user-total-count');
    const userFormTitle = document.getElementById('user-form-title');

    // Book Management
    const bookForm = document.getElementById('bookForm');
    const addBookBtn = document.getElementById('addBookBtn');
    const clearBookFormBtn = document.getElementById('clearBookForm');
    const editBookModal = document.getElementById('editBookModal');
    const editBookForm = document.getElementById('editBookForm');
    const closeEditModalBtn = editBookModal.querySelector('.close-button');
    const cancelEditBtn = document.getElementById('cancelEdit');

    // Sidebar Management
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    let editingUserId = null;

    // --- 4. Manipuladores de Eventos (Event Handlers) ---

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('userId').value;
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const phone = document.getElementById('userPhone').value.trim();
        const address = document.getElementById('userAddress').value.trim();

        if (!name || !email) {
            showNotification('Nome e email são obrigatórios!', 'error');
            return;
        }

        if (editingUserId) {
            // Editing user
            const user = store.users.find(u => u.id === editingUserId);
            user.name = name;
            user.email = email;
            user.phone = phone;
            user.address = address;
            editingUserId = null;
            showNotification('Dados do usuário atualizados!', 'success');
        } else {
            // Adding new user
            const newUser = { id: Date.now(), name, email, phone, address };
            store.users.push(newUser);
            showNotification('Usuário cadastrado com sucesso!', 'success');
        }

        persist(); // Save changes to localStorage
        renderAll(); // Re-render all sections to reflect changes
        userForm.reset();
        userFormTitle.textContent = 'Adicionar Novo Usuário';
        userSubmitBtn.textContent = 'Cadastrar Usuário';
    });

    clearUserFormBtn.addEventListener('click', () => {
        userForm.reset();
        editingUserId = null;
        userFormTitle.textContent = 'Adicionar Novo Usuário';
        userSubmitBtn.textContent = 'Cadastrar Usuário';
    });

    // Garante que o clique no botão de submit dispare o evento do formulário
    userSubmitBtn.addEventListener('click', (e) => {
        userForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });

    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    mobileOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });


    userSearch.addEventListener('input', (e) => {
        renderUsers(e.target.value);
    });

    // Navegação e Logout
    const menuItems = document.querySelectorAll('.menu-item:not(.menu-logout)');
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Deseja realmente sair do sistema?')) {
                // Limpa a flag de login e outros dados da sessão
                localStorage.removeItem('biblioteca_logged');
                window.location.href = 'index.html';
            }
        });
    }

    const sections = document.querySelectorAll('.content-section');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.dataset.section;
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection)?.classList.add('active');
        });
    });

    function showNotification(message, type = 'success') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification-message ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);

        // Força a animação de entrada
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove a notificação após 3 segundos
        setTimeout(() => notification.remove(), 3000);
    }

    // --- 5. Funções de Renderização ---

    function renderCounts() {
        if (!userCountEl || !bookCountEl) return;
        userCountEl.textContent = store.users.length;
        bookCountEl.textContent = store.books.length;
    }

    function renderRecentActivity() {
        recentActivityEl.innerHTML = '';
        const activities = [];
        store.books.slice(-3).reverse().forEach(b => activities.push({type:'book',action:'Livro registrado',details:b.title,time:'agora'}));
        store.users.slice(-3).reverse().forEach(u => activities.push({type:'user',action:'Usuário cadastrado',details:u.name,time:'agora'}));
        activities.forEach(activity => {
            const div = document.createElement('div');
            div.className = 'activity-item';
            div.innerHTML = `<div class="activity-icon ${activity.type}"></div><div class="activity-details"><strong>${activity.action}</strong><p>${activity.details} - ${activity.time}</p></div>`;
            recentActivityEl.appendChild(div);
        });
    }

    function renderUsers(searchTerm = '') {
        const filteredUsers = store.users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        usersTableBody.innerHTML = ''; // Clear existing rows
        if (filteredUsers.length === 0) {
            usersTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum usuário encontrado.</td></tr>`;
        } else {
            filteredUsers.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone || 'N/A'}</td>
                    <td>${user.address || 'N/A'}</td>
                    <td class="actions-cell">
                        <button class="btn-icon edit" onclick="editUser(${user.id})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon delete" onclick="deleteUser(${user.id})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </td>
                `;
                usersTableBody.appendChild(row);
            });
        }
        userTotalCount.textContent = filteredUsers.length;
    }

    function deleteUser(id) {
        const user = store.users.find(u => u.id === id);
        if (user && confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
            store.users = store.users.filter(u => u.id !== id);
            renderAll();
            showNotification('Usuário excluído com sucesso!', 'success');
        } // A persistência ocorre dentro de renderAll() indiretamente
    }

    // Função para editar usuário (preenche o formulário)
    function editUser(id) {
        const user = store.users.find(u => u.id === id);
        if (user) {
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userPhone').value = user.phone;
            document.getElementById('userAddress').value = user.address;
            
            editingUserId = user.id;
            userFormTitle.textContent = 'Editar Usuário';
            userSubmitBtn.textContent = 'Salvar Alterações';
            userForm.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function renderBooks() {
        booksGrid.innerHTML = '';
        if (store.books.length === 0) {
            booksGrid.innerHTML = '<p>Nenhum livro cadastrado.</p>';
            return;
        }
        store.books.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card-item';
            const pdfAction = book.pdf ? `href="${book.pdf}" target="_blank"` : 'onclick="alert(\'PDF não disponível.\')"';
            const downloadAction = book.pdf ? `href="${book.pdf}" download="${book.title}.pdf"` : 'onclick="alert(\'PDF não disponível.\')"';

            card.innerHTML = `
                <a ${pdfAction} class="book-cover-link" title="Clique para ler">
                    <img src="${book.cover || 'assets/default-cover.png'}" alt="Capa de ${book.title}" class="book-cover-image">
                </a>
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author}</p>
                    <a ${downloadAction} class="download-btn">Baixar Livro</a>
                </div>
                <div class="book-actions">
                    <button class="btn-icon edit" onclick="openEditBookModal(${book.id})" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-icon delete" onclick="deleteBook(${book.id})" title="Excluir">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;
            booksGrid.appendChild(card);
        });
    }

    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('b_title').value.trim();
        const author = document.getElementById('b_author').value.trim();
        
        if (!title || !author) {
            showNotification('Título e autor são obrigatórios!', 'error');
            return;
        }

        const newBook = {
            id: Date.now(),
            title,
            author,
            genre: document.getElementById('b_genre').value,
            year: document.getElementById('b_year').value,
            description: document.getElementById('b_desc').value.trim(),
            cover: '',
            pdf: ''
        };

        const coverFile = document.getElementById('b_cover').files[0];
        if (coverFile) {
            newBook.cover = await fileToBase64(coverFile);
        }

        const pdfFile = document.getElementById('b_pdf').files[0];
        if (pdfFile) {
            const validation = validatePDFFile(pdfFile);
            if (validation.valid) {
                newBook.pdf = await fileToBase64(pdfFile);
            } else {
                showNotification(validation.message, 'error');
                return;
            }
        }

        store.books.push(newBook);
        persist();
        renderAll();
        bookForm.reset();
        showNotification('Livro registrado com sucesso!', 'success');
    });

    clearBookFormBtn.addEventListener('click', () => {
        bookForm.reset();
    });

    function openEditBookModal(id) {
        const book = store.books.find(b => b.id === id);
        if (book) {
            document.getElementById('edit_book_id').value = book.id;
            document.getElementById('edit_b_title').value = book.title;
            document.getElementById('edit_b_author').value = book.author;
            document.getElementById('edit_b_genre').value = book.genre;
            document.getElementById('edit_b_year').value = book.year;
            document.getElementById('edit_b_desc').value = book.description;
            editBookModal.style.display = 'block';
        }
    }

    function closeEditModal() {
        editBookModal.style.display = 'none';
    }

    closeEditModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    window.addEventListener('click', (event) => {
        if (event.target == editBookModal) {
            closeEditModal();
        }
    });

    editBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('edit_book_id').value, 10);
        const bookIndex = store.books.findIndex(b => b.id === id);

        if (bookIndex === -1) {
            showNotification('Erro: Livro não encontrado.', 'error');
            return;
        }

        // Atualiza os dados do livro com os valores do formulário de edição
        const updatedBook = {
            ...store.books[bookIndex], // Mantém os dados existentes como base
            title: document.getElementById('edit_b_title').value.trim(),
            author: document.getElementById('edit_b_author').value.trim(),
            genre: document.getElementById('edit_b_genre').value,
            year: document.getElementById('edit_b_year').value,
            description: document.getElementById('edit_b_desc').value.trim(),
        };

        // Verifica se uma nova capa foi enviada e a atualiza
        const newCoverFile = document.getElementById('edit_b_cover').files[0];
        if (newCoverFile) {
            updatedBook.cover = await fileToBase64(newCoverFile);
        }

        // Verifica se um novo PDF foi enviado e o atualiza
        const newPdfFile = document.getElementById('edit_b_pdf').files[0];
        if (newPdfFile) {
            const validation = validatePDFFile(newPdfFile);
            if (validation.valid) {
                updatedBook.pdf = await fileToBase64(newPdfFile);
            } else {
                showNotification(validation.message, 'error');
                return; // Impede a atualização se o PDF for inválido
            }
        }

        // Substitui o livro antigo pelo novo no array
        store.books[bookIndex] = updatedBook;

        persist(); // Salva o array atualizado no localStorage
        renderAll(); // Re-renderiza a interface para mostrar as alterações
        editBookForm.reset();
        closeEditModal();
        showNotification('Livro atualizado com sucesso!', 'success');
    });

    // Função para excluir livro
    function deleteBook(id) {
        if (confirm('Tem certeza que deseja excluir este livro?')) {
            store.books = store.books.filter(b => b.id !== id);
            persist();
            renderAll();
            showNotification('Livro excluído com sucesso!', 'success');
        }
    }

    // Função principal que orquestra todas as atualizações da UI.
    function renderAll() {
        renderCounts();
        renderRecentActivity();
        renderUsers(userSearch.value);
        renderBooks();
    }

    // --- 6. Exposição de Funções Globais e Renderização Inicial ---

    // Expõe funções ao escopo global para que os atributos `onclick` no HTML possam chamá-las.
    window.editUser = editUser;
    window.deleteUser = deleteUser;
    window.openEditBookModal = openEditBookModal;
    window.deleteBook = deleteBook;

    // Renderiza todos os componentes pela primeira vez ao carregar a página.
    renderAll();
});