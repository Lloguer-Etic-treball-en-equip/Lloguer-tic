const gameState = {
    role: null,
    ethicsPoints: 100,
    money: 50000,
    images: ['casa1.jpg', 'casa2.jpg', 'casa3.jpg'],
    tenants: [
        { name: "Estudiant", budget: 400 },
        { name: "Família Nombrosa", budget: 900 },
        { name: "Treballador Nouvingut", budget: 600 }
    ],
    lastScene: ''
};

class MainMenu extends Phaser.Scene {
    constructor() { super({ key: 'MainMenu' }); }

    preload() {
        this.load.image('casa1', 'casa1.jpg');
        this.load.image('casa2', 'casa2.jpg');
        this.load.image('casa3', 'casa3.jpg');
    }

    create() {
        this.add.text(400, 150, 'LLOGUER ÈTIC', { fontSize: '48px', fill: '#e67e22', fontStyle: 'bold' }).setOrigin(0.5);
        
        const roleText = this.add.text(400, 250, 'Prem per sortejar el teu rol', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

        const startBtn = this.add.text(400, 350, 'Girar Ruleta i Jugar', { 
            fontSize: '24px', fill: '#fff', backgroundColor: '#e67e22', padding: { x: 20, y: 10 } 
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startBtn.on('pointerdown', () => {
            startBtn.setVisible(false);
            const roles = ['Agent Immobiliari', 'Aprenent Immigrant', 'Becari Ajudant'];
            let counter = 0;
            
            const rouletteEvent = this.time.addEvent({
                delay: 100,
                callback: () => {
                    roleText.setText(roles[counter % roles.length]);
                    roleText.setColor(counter % 2 === 0 ? '#e67e22' : '#ffffff');
                    counter++;
                },
                loop: true
            });

            this.time.delayedCall(2000, () => {
                rouletteEvent.destroy();
                gameState.role = roles[Math.floor(Math.random() * roles.length)];
                roleText.setText(gameState.role);
                roleText.setColor('#27ae60');
                
                this.time.delayedCall(1500, () => {
                    this.scene.start('OfficeScene');
                });
            });
        });
    }
}

class OfficeScene extends Phaser.Scene {
    constructor() { super({ key: 'OfficeScene' }); }

    create() {
        this.add.text(20, 20, `Rol: ${gameState.role} | Diners: ${gameState.money}€`, { fontSize: '18px', fill: '#fff' });
        this.add.text(780, 20, 'Prem ESC per Pausar', { fontSize: '18px', fill: '#999' }).setOrigin(1, 0);

        this.add.text(400, 80, 'Fase 1: Comprar (Oficina)', { fontSize: '32px', fill: '#f39c12' }).setOrigin(0.5);

        const randomImg = Phaser.Utils.Array.GetRandom(gameState.images);
        const imgKey = randomImg.split('.')[0];
        const randomPrice = Phaser.Math.Between(120000, 450000);
        const randomRooms = Phaser.Math.Between(1, 5);
        
        this.add.image(400, 250, imgKey).setDisplaySize(350, 220);
        this.add.text(400, 420, `Preu: ${randomPrice.toLocaleString()}€ | Habitacions: ${randomRooms}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        const btnAccept = this.add.text(250, 500, 'Acceptar Oferta', { fontSize: '20px', backgroundColor: '#27ae60', padding: 10 }).setOrigin(0.5).setInteractive();
        const btnReject = this.add.text(550, 500, 'Rebutjar Oferta', { fontSize: '20px', backgroundColor: '#c0392b', padding: 10 }).setOrigin(0.5).setInteractive();

        btnAccept.on('pointerdown', () => {
            this.checkRandomEvent('RepairScene');
        });
        btnReject.on('pointerdown', () => this.scene.restart());

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseMenu');
        });
    }

    checkRandomEvent(nextScene) {
        if (Math.random() < 0.3) {
            gameState.lastScene = nextScene;
            this.scene.start('MaintenanceScene');
        } else {
            this.scene.start(nextScene);
        }
    }
}

class RepairScene extends Phaser.Scene {
    constructor() { super({ key: 'RepairScene' }); }
    
    create() {
        this.add.text(400, 80, 'Fase 2: Reformar', { fontSize: '32px', fill: '#f39c12' }).setOrigin(0.5);
        this.add.text(400, 130, 'Clica a les esquerdes per reparar-les', { fontSize: '18px', fill: '#fff' }).setOrigin(0.5);

        let cracksToFix = 2;

        const crack1 = this.add.text(300, 300, '⚡', { fontSize: '40px', color: 'red' }).setInteractive();
        const crack2 = this.add.text(500, 400, '⚡', { fontSize: '40px', color: 'red' }).setInteractive();

        const fixCrack = (crack) => {
            crack.destroy();
            cracksToFix--;
            if(cracksToFix === 0) {
                this.add.text(400, 500, 'Reparat! Passant a buscar clients...', { fontSize: '20px', fill: '#27ae60' }).setOrigin(0.5);
                this.time.delayedCall(1500, () => {
                    this.checkRandomEvent('ClientScene');
                });
            }
        };

        crack1.on('pointerdown', () => fixCrack(crack1));
        crack2.on('pointerdown', () => fixCrack(crack2));
    }

    checkRandomEvent(nextScene) {
        if (Math.random() < 0.3) {
            gameState.lastScene = nextScene;
            this.scene.start('MaintenanceScene');
        } else {
            this.scene.start(nextScene);
        }
    }
}

class ClientScene extends Phaser.Scene {
    constructor() { super({ key: 'ClientScene' }); }

    create() {
        this.add.text(400, 80, 'Fase 3: Buscar Clients (Carrer)', { fontSize: '32px', fill: '#f39c12' }).setOrigin(0.5);
        this.add.text(400, 130, 'Dibuixa un cartell (clica i arrossega)', { fontSize: '18px', fill: '#fff' }).setOrigin(0.5);

        this.add.rectangle(400, 300, 400, 200, 0xffffff).setOrigin(0.5);
        
        const graphics = this.add.graphics();
        graphics.lineStyle(4, 0x000000, 1);
        
        let isDrawing = false;

        this.input.on('pointerdown', (pointer) => {
            if (pointer.x > 200 && pointer.x < 600 && pointer.y > 200 && pointer.y < 400) {
                isDrawing = true;
                graphics.moveTo(pointer.x, pointer.y);
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (isDrawing && pointer.x > 200 && pointer.x < 600 && pointer.y > 200 && pointer.y < 400) {
                graphics.lineTo(pointer.x, pointer.y);
                graphics.strokePath();
            } else {
                isDrawing = false;
            }
        });

        this.input.on('pointerup', () => {
            isDrawing = false;
        });

        const btnPublish = this.add.text(400, 450, 'Publicar Anunci', { fontSize: '20px', backgroundColor: '#e67e22', padding: 10 }).setOrigin(0.5).setInteractive();
        btnPublish.on('pointerdown', () => {
            this.checkRandomEvent('RentScene');
        });
    }

    checkRandomEvent(nextScene) {
        if (Math.random() < 0.3) {
            gameState.lastScene = nextScene;
            this.scene.start('MaintenanceScene');
        } else {
            this.scene.start(nextScene);
        }
    }
}

class RentScene extends Phaser.Scene {
    constructor() { super({ key: 'RentScene' }); }

    create() {
        this.add.text(400, 80, 'Fase 4: Llogar', { fontSize: '32px', fill: '#f39c12' }).setOrigin(0.5);
        this.add.text(400, 130, 'Tria el millor llogater:', { fontSize: '18px', fill: '#fff' }).setOrigin(0.5);

        let startY = 250;
        gameState.tenants.forEach((tenant) => {
            const btn = this.add.text(400, startY, `${tenant.name} - Pressupost: ${tenant.budget}€`, { 
                fontSize: '20px', backgroundColor: '#34495e', padding: 15 
            }).setOrigin(0.5).setInteractive();

            btn.on('pointerdown', () => {
                if (gameState.role === 'Agent Immobiliari') {
                    gameState.money += tenant.budget;
                } else {
                    gameState.ethicsPoints += 10;
                }
                this.scene.start('ResultsScene');
            });

            startY += 80;
        });
    }
}

class MaintenanceScene extends Phaser.Scene {
    constructor() { super({ key: 'MaintenanceScene' }); }

    create() {
        this.add.text(400, 200, 'AVÍS: Manteniment Urgent!', { fontSize: '40px', fill: '#e74c3c', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(400, 280, 'Ha sorgit un problema a la casa.', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        const btnFix = this.add.text(400, 400, 'Reparar Desperfecte', { fontSize: '24px', backgroundColor: '#e67e22', padding: 15 }).setOrigin(0.5).setInteractive();
        
        btnFix.on('pointerdown', () => {
            this.scene.start(gameState.lastScene);
        });
    }
}

class ResultsScene extends Phaser.Scene {
    constructor() { super({ key: 'ResultsScene' }); }
    
    create() {
        this.add.text(400, 200, 'Resultats Finals', { fontSize: '40px', fill: '#f39c12' }).setOrigin(0.5);
        this.add.text(400, 300, `Rol: ${gameState.role}\nDiners Restants: ${gameState.money}€\nPunts Ètica: ${gameState.ethicsPoints}`, { fontSize: '24px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        
        const restartBtn = this.add.text(400, 450, 'Tornar a jugar', { fontSize: '24px', backgroundColor: '#e67e22', padding: 10 }).setOrigin(0.5).setInteractive();
        restartBtn.on('pointerdown', () => this.scene.start('MainMenu'));
    }
}

class PauseMenu extends Phaser.Scene {
    constructor() { super({ key: 'PauseMenu' }); }
    
    create() {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        this.add.text(400, 200, 'JOC PAUSAT', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        
        const resumeBtn = this.add.text(400, 350, 'Reprendre el Joc', { fontSize: '24px', backgroundColor: '#e67e22', padding: 10 }).setOrigin(0.5).setInteractive();
        
        resumeBtn.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('OfficeScene'); 
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2d2d2d',
    resolution: window.devicePixelRatio || 1,
    autoRound: true,
    scene: [MainMenu, OfficeScene, RepairScene, ClientScene, RentScene, MaintenanceScene, ResultsScene, PauseMenu]
};

const game = new Phaser.Game(config);
