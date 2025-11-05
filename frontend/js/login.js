// Simplified login script: validates fixed admin credentials and sets session flag
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  const limparBtn = document.getElementById('limparForm');

  const adminCredentials = { email: 'admin@biblioteca.com', senha: '1234' };

  function showSuccess(msg) {
    if (errorMessage) errorMessage.style.display = 'none';
    if (successMessage) { successMessage.textContent = msg; successMessage.style.display = 'block'; }
  }

  function showError(msg) {
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) { errorMessage.textContent = msg; errorMessage.style.display = 'block'; }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (email === adminCredentials.email && senha === adminCredentials.senha) {
      // Mark session and redirect
      localStorage.setItem('biblioteca_logged', 'true');
      showSuccess('Bem-vindo, Administrador da Biblioteca. Redirecionando...');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
    } else {
      showError('Acesso negado. Verifique suas credenciais.');
    }
  });

  if (limparBtn) limparBtn.addEventListener('click', () => { form.reset(); if (errorMessage) errorMessage.style.display = 'none'; if (successMessage) successMessage.style.display = 'none'; });
});
