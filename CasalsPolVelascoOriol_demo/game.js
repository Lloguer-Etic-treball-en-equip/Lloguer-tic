class Property {
    constructor(price, rooms, condition, isScam, image) {
        this.rentPrice = price;
        this.numRooms = rooms;
        this.condition = condition;
        this.isScam = isScam;
        this.image = image;
    }
}

const game = {
    propertyImages: ['casa1.jpg', 'casa2.jpg', 'casa3.jpg'],
    tenants: [
        { name: "Estudiant", budget: 400, profile: "Estudiant" },
        { name: "Família Nombrosa", budget: 900, profile: "Família" },
        { name: "Treballador Nouvingut", budget: 600, profile: "Immigrant" }
    ],
    player: { role: null, ethicsPoints: 100, money: 50000, currentProperty: null },
    lastScreen: '',

    init() {
        document.getElementById('start-btn').addEventListener('click', () => this.startRoleRoulette());
        this.setupCanvas();
    },

    startRoleRoulette() {
        const roles = ['Agent Immobiliari', 'Aprenent Immigrant', 'Becari Ajudant'];
        const display = document.getElementById('role-display');
        const btn = document.getElementById('start-btn');
        btn.disabled = true;
        let counter = 0;
        
        const interval = setInterval(() => {
            display.innerText = roles[counter % roles.length];
            display.style.color = counter % 2 === 0 ? '#e67e22' : '#ffffff';
            counter++;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            this.player.role = roles[Math.floor(Math.random() * roles.length)];
            display.innerText = this.player.role;
            display.style.color = '#27ae60';
            
            setTimeout(() => {
                this.generateNewOffer();
                this.showScreen('office-screen');
            }, 1500);
        }, 2000);
    },

    generateNewOffer() {
        const randomImg = this.propertyImages[Math.floor(Math.random() * this.propertyImages.length)];
        const randomPrice = Math.floor(Math.random() * (450000 - 120000) + 120000);
        const randomRooms = Math.floor(Math.random() * 5) + 1;
        
        this.player.currentProperty = new Property(randomPrice, randomRooms, 50, false, randomImg);
        
        const imgElement = document.getElementById('property-img-element');
        imgElement.src = randomImg;
        imgElement.style.display = 'block';
        document.getElementById('property-placeholder').style.display = 'none';
        
        document.getElementById('property-details').innerText = `Preu: ${randomPrice.toLocaleString()}€ | Habitacions: ${randomRooms}`;
    },

    processOffer(accepted) {
        if (accepted) this.randomEventCheck('repair-screen');
        else { 
            alert("Buscant noves ofertes..."); 
            this.generateNewOffer(); 
        }
    },

    checkRepairs(element) {
        element.style.display = 'none';
        const cracks = document.querySelectorAll('.crack');
        const hiddenCracks = Array.from(cracks).filter(c => c.style.display === 'none');
        if (hiddenCracks.length === cracks.length) {
            this.randomEventCheck('client-screen');
        }
    },

    setupCanvas() {
        const canvas = document.getElementById('ad-canvas');
        const ctx = canvas.getContext('2d');
        let drawing = false;
        canvas.onmousedown = () => drawing = true;
        canvas.onmouseup = () => drawing = false;
        canvas.onmousemove = (e) => {
            if (!drawing) return;
            ctx.fillStyle = "black";
            ctx.fillRect(e.offsetX, e.offsetY, 3, 3);
        };
    },

    finishAd() { this.randomEventCheck('rent-screen'); },

    randomEventCheck(nextScreen) {
        if (Math.random() < 0.3) {
            this.lastScreen = nextScreen;
            this.showScreen('maintenance-screen');
        } else {
            this.showScreen(nextScreen);
            if (nextScreen === 'rent-screen') this.loadTenants();
        }
    },

    resolveMaintenance() {
        alert("Problema resolt!");
        this.showScreen(this.lastScreen);
        if (this.lastScreen === 'rent-screen') this.loadTenants();
    },

    loadTenants() {
        const list = document.getElementById('tenant-list');
        list.innerHTML = '';
        this.tenants.forEach(t => {
            const btn = document.createElement('button');
            btn.innerText = `${t.name} - Pressupost: ${t.budget}€`;
            btn.onclick = () => {
                if (this.player.role === 'Agent Immobiliari') this.player.money += t.budget;
                else this.player.ethicsPoints += 10;
                this.showScreen('results-screen');
            };
            list.appendChild(btn);
        });
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
        if (screenId === 'results-screen') this.displayResults();
    },

    displayResults() {
        document.getElementById('stats-display').innerHTML = `
            <p>Rol: ${this.player.role}</p>
            <p>Punts d'Ètica: ${this.player.ethicsPoints}</p>
            <p>Diners: ${this.player.money}€</p>
        `;
    }
};

window.onload = () => game.init();