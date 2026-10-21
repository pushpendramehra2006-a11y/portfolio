document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('loginForm');
    const openLoginBtn = document.getElementById('openLoginBtn');

    const savedUser = localStorage.getItem("portfolioUser");
    if (savedUser) {
        modal.style.display = 'none';
        updatePortfolioView(JSON.parse(savedUser));
    }

    if (openLoginBtn) {
        openLoginBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userData = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                year: document.getElementById('userYear').value,
                branch: document.getElementById('userBranch').value,
                specialization: document.getElementById('userSpecialization').value
            };

            try {
                const response = await fetch('http://localhost:5000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });
                
                const result = await response.json();
                if (result.success) {
                    localStorage.setItem("portfolioUser", JSON.stringify(userData));
                    modal.style.display = 'none';
                    updatePortfolioView(userData);
                } else {
                    alert('Error saving data: ' + result.error);
                }
            } catch (err) {
                console.error('Backend connection failed:', err);
                alert('Could not connect to backend server.');
            }
        });
    }
});

function updatePortfolioView(user) {
    const nameEl = document.getElementById('dynamic-name');
    if (nameEl) {
        const parts = user.name.split(' ');
        nameEl.innerHTML = `${parts[0]} <span>${parts.slice(1).join(' ') || ''}</span>`;
    }

    const roleEl = document.getElementById('dynamic-role');
    if (roleEl) roleEl.textContent = `${user.specialization} Specialist`;

    const descEl = document.getElementById('dynamic-desc');
    if (descEl) {
        descEl.textContent = `${user.branch} Department | Year: ${user.year} | Focused on building projects and mastering ${user.specialization}.`;
    }

    const skillsGrid = document.getElementById('dynamic-skills-grid');
    if (skillsGrid) {
        skillsGrid.innerHTML = `
            <div class="skill-category">
                <div class="skill-icon"><i class="fas fa-code"></i></div>
                <h3>Primary Domain</h3>
                <p>Specialized in <strong>${user.specialization}</strong> workflows and development.</p>
            </div>
            <div class="skill-category">
                <div class="skill-icon"><i class="fas fa-graduation-cap"></i></div>
                <h3>Academic Status</h3>
                <p>${user.branch} - ${user.year}</p>
            </div>
            <div class="skill-category">
                <div class="skill-icon"><i class="fas fa-envelope"></i></div>
                <h3>Contact ID</h3>
                <p>${user.email}</p>
            </div>
        `;
    }
}