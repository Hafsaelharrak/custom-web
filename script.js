// CumWeb JavaScript: Gestion du Modal et des Interactions
document.addEventListener('DOMContentLoaded', function() {
  // Modal functionality
  document.querySelectorAll('.nav-cta, .pricing-button.modal-button, .hero-cta').forEach(button => {
      button.addEventListener('click', function(e) {
          e.preventDefault();
          document.getElementById('startProjectModal').style.display = 'block';
      });
  });

  // Close Modal
  document.querySelector('.close-modal')?.addEventListener('click', function() {
      document.getElementById('startProjectModal').style.display = 'none';
  });

  // Close Modal when clicking outside
  window.addEventListener('click', function(e) {
      const modal = document.getElementById('startProjectModal');
      if (e.target === modal) {
          modal.style.display = 'none';
      }
  });

  // Project form submission
  document.getElementById('projectStartForm')?.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Merci! Nous vous contacterons très bientôt.');
      document.getElementById('startProjectModal').style.display = 'none';
      this.reset();
  });

  // Store selected product when clicking "Acheter"
  document.querySelectorAll('.pricing-button[href="payment.html"]').forEach(button => {
      button.addEventListener('click', function(e) {
          const card = this.closest('.pricing-card');
          const product = {
              name: card.querySelector('.pricing-title').textContent,
              price: card.querySelector('.pricing-price').textContent,
              features: Array.from(card.querySelectorAll('.pricing-features li')).map(li => li.textContent)
          };
          localStorage.setItem('selectedProduct', JSON.stringify(product));
      });
  });

  // Payment page functionality
  if (window.location.pathname.includes('payment.html')) {
      const product = JSON.parse(localStorage.getItem('selectedProduct'));
      
      if (!product) {
          window.location.href = 'cumweb.html';
          return;
      }

      // Display product info
      const summaryHTML = `
          <h3>Résumé de votre commande</h3>
          <div class="summary-item">
              <span>${product.name}</span>
              <span>${product.price}</span>
          </div>
          ${product.features.map(feature => `
              <div class="summary-item">
                  <span>${feature.split(' - ')[0]}</span>
                  <span>${feature.split(' - ')[1] || 'Inclus'}</span>
              </div>
          `).join('')}
          <div class="summary-item">
              <strong>Total</strong>
              <strong id="total-amount">${product.price}</strong>
          </div>
      `;

      document.querySelector('.payment-summary').innerHTML = summaryHTML;
      
      // Update payment button text
      const paymentButton = document.getElementById('submit-payment');
      paymentButton.textContent = `Payer ${product.price}`;
      
      // Form validation
      document.getElementById('payment-form').addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Validate fields
          const fullName = document.getElementById('full-name').value.trim();
          const email = document.getElementById('email').value.trim();
          const cardNumber = document.getElementById('credit-card').value.trim();
          const expiryDate = document.getElementById('expiry-date').value.trim();
          const cvv = document.getElementById('cvv').value.trim();

          let isValid = true;

          if (!fullName) {
              alert('Veuillez entrer votre nom complet.');
              isValid = false;
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
              alert('Veuillez entrer un email valide.');
              isValid = false;
          }

          const cardNumberRegex = /^\d{16}$/;
          if (!cardNumberRegex.test(cardNumber)) {
              alert('Veuillez entrer un numéro de carte valide (16 chiffres).');
              isValid = false;
          }

          const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
          if (!expiryDateRegex.test(expiryDate)) {
              alert('Veuillez entrer une date d\'expiration valide (MM/AA).');
              isValid = false;
          }

          const cvvRegex = /^\d{3}$/;
          if (!cvvRegex.test(cvv)) {
              alert('Veuillez entrer un code CVV valide (3 chiffres).');
              isValid = false;
          }

          if (isValid) {
              alert(`Paiement de ${product.price} réussi! Votre commande est en cours de traitement.`);
              localStorage.removeItem('selectedProduct');
              this.reset();
          }
      });
  }
});