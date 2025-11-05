const API = 'http://localhost:3000/livros';

function showMessage(message, type = 'success') {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('mensagem', type);
    msgDiv.textContent = message;
    document.body.appendChild(msgDiv);

    setTimeout(() => {
      msgDiv.remove();
    }, 3000);
  const form = document.getElementById('livroForm');
  const tableBody = document.querySelector('#livrosTable tbody');
  const limparBtn = document.getElementById('limpar');
  const livroIdInput = document.getElementById('livroId');
  const tituloInput = document.getElementById('titulo');
  const autorInput = document.getElementById('autor');
  const anoInput = document.getElementById('ano');
  const generoInput = document.getElementById('genero');
  const quantidadeInput = document.getElementById('quantidade');

  async function load() {
    try {
      const res = await fetch(API);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      tableBody.innerHTML = '';
      data.forEach(l => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${l.id}</td>
          <td>${escapeHtml(l.titulo)}</td>
          <td>${escapeHtml(l.autor||'')}</td>
          <td>${l.ano||''}</td>
          <td>${escapeHtml(l.genero||'')}</td>
          <td>${l.quantidade||0}</td>
          <td>
            <button data-id="${l.id}" class="edit">Editar</button>
            <button data-id="${l.id}" class="del">Excluir</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    } catch (error) {
      console.error('Error loading books:', error);
      showMessage('Erro ao carregar livros.', 'error');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = livroIdInput.value;
    const body = {
      titulo: tituloInput.value,
      autor: autorInput.value,
      ano: anoInput.value,
      genero: generoInput.value,
      quantidade: Number(document.getElementById('quantidade').value)
    };

    try {
      let res;
      if (id) {
        res = await fetch(`${API}/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        showMessage('Livro atualizado com sucesso!');
      } else {
        res = await fetch(API, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        showMessage('Livro cadastrado com sucesso!');
      }
    } catch (error) {
      console.error('Error saving book:', error);
      showMessage('Erro ao salvar livro.', 'error');
    }
    form.reset();
    livroIdInput.value = '';
    load();
  });

  limparBtn.addEventListener('click', () => { form.reset(); document.getElementById('livroId').value = ''; });

  tableBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit')) {
      const id = e.target.dataset.id;
      try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const livro = await res.json();
        livroIdInput.value = livro.id;
        tituloInput.value = livro.titulo;
        autorInput.value = livro.autor || '';
        anoInput.value = livro.ano || '';
        generoInput.value = livro.genero || '';
        document.getElementById('quantidade').value = livro.quantidade || 0;
      } catch (error) {
        console.error('Error loading book for edit:', error);
        showMessage('Erro ao carregar dados do livro para edição.', 'error');
      }
    }
    if (e.target.classList.contains('del')) {
      if (!confirm('Excluir este livro?')) return;
      const id = e.target.dataset.id;
      try {
        const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        showMessage('Livro excluído com sucesso!');
        load();
      } catch (error) {
        console.error('Error deleting book:', error);
        showMessage('Erro ao excluir livro.', 'error');
      }
    }
  });

  load();
};

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
