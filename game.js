const gameState = {
    role: null,
    ethicsPoints: 100,
    money: 50000,
    images: ['casa1', 'casa2', 'casa3']
};

class MainMenu extends Phaser.Scene {
    constructor() { super({ key: 'MainMenu' }); }

    preload() {
        this.load.image('casa1', 'casa1.jpg');
        this.load.image('casa2', 'casa2.jpg');
        this.load.image('casa3', 'casa3.jpg');
    }

    create() {
        this.add.text(400, 150, 'ETHICAL RENTAL', { fontSize: '48px', fill: '#e67e22', fontStyle: 'bold' }).setOrigin(0.5);
        
        const roleText = this.add.text(400, 250, 'Press to draw your role', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

        const startBtn = this.add.text(400, 350, 'Spin Roulette and Play', { 
            fontSize: '24px', fill: '#fff', backgroundColor: '#e67e22', padding: { x: 20, y: 10 } 
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        startBtn.on('pointerdown', () => {
            const roles = ['Real Estate Agent', 'Immigrant Apprentice', 'Assistant Intern'];
            gameState.role = roles[Math.floor(Math.random() * roles.length)];
            
            roleText.setText(`Assigned Role: ${gameState.role}`);
            roleText.setColor('#27ae60');
            startBtn.setVisible(false);

            this.time.delayedCall(1500, () => {
                this.scene.start('OfficeScene');
            });
        });
    }
}

class OfficeScene extends Phaser.Scene {
    constructor() { super({ key: 'OfficeScene' }); }

    create() {
        this.add.text(20, 20, `Role: ${gameState.role} | Money: ${gameState.money}€`, { fontSize: '18px', fill: '#fff' });
        this.add.text(780, 20, 'Press ESC to Pause', { fontSize: '18px', fill: '#999' }).setOrigin(1, 0);

        this.add.text(400, 80, 'Phase 1: Buy (Office)', { fontSize: '32px', fill: '#f39c12' }).setOrigin(0.5);

        const randomImg = Phaser.Utils.Array.GetRandom(gameState.images);
        const randomPrice = Phaser.Math.Between(120000, 450000);
        
        this.add.image(400, 250, randomImg).setScale(0.8);
        this.add.text(400, 420, `Offered Price: ${randomPrice}€`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        const btnAccept = this.add.text(250, 500, 'Accept Offer', { fontSize: '20px', backgroundColor: '#27ae60', padding: 10 }).setOrigin(0.5).setInteractive();
        const btnReject = this.add.text(550, 500, 'Reject Offer', { fontSize: '20px', backgroundColor: '#c0392b', padding: 10 }).setOrigin(0.5).setInteractive();

        btnAccept.on('pointerdown', () => this.scene.start('RepairScene'));
        btnReject.on('pointerdown', () => this.scene.restart());

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseMenu');
        });
    }
}

class RepairScene extends Phaser.Scene {
    constructor() { super({ key: 'RepairScene' }); }
    
    create() {
        this.add.text(400, 80, 'Phase 2: Renovate', { fontSize: '32px', fill: '#f39c12' }).setOrigin(0.5);
        this.add.text(400, 130, 'Click on the cracks to repair them', { fontSize: '18px', fill: '#fff' }).setOrigin(0.5);

        let cracksToFix = 2;

        const crack1 = this.add.text(300, 300, '⚡', { fontSize: '40px', color: 'red' }).setInteractive();
        const crack2 = this.add.text(500, 400, '⚡', { fontSize: '40px', color: 'red' }).setInteractive();

        const fixCrack = (crack) => {
            crack.destroy();
            cracksToFix--;
            if(cracksToFix === 0) {
                this.add.text(400, 500, 'House Repaired! Moving to find clients...', { fontSize: '20px', fill: '#27ae60' }).setOrigin(0.5);
                this.time.delayedCall(1500, () => this.scene.start('ResultsScene'));
            }
        };

        crack1.on('pointerdown', () => fixCrack(crack1));
        crack2.on('pointerdown', () => fixCrack(crack2));
    }
}

class ResultsScene extends Phaser.Scene {
    constructor() { super({ key: 'ResultsScene' }); }
    
    create() {
        this.add.text(400, 200, 'Final Results', { fontSize: '40px', fill: '#f39c12' }).setOrigin(0.5);
        this.add.text(400, 300, `Role: ${gameState.role}\nRemaining Money: ${gameState.money}€\nEthics Points: ${gameState.ethicsPoints}`, { fontSize: '24px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        
        const restartBtn = this.add.text(400, 450, 'Play Again', { fontSize: '24px', backgroundColor: '#e67e22', padding: 10 }).setOrigin(0.5).setInteractive();
        restartBtn.on('pointerdown', () => this.scene.start('MainMenu'));
    }
}

class PauseMenu extends Phaser.Scene {
    constructor() { super({ key: 'PauseMenu' }); }
    
    create() {
        const bg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        
        this.add.text(400, 200, 'GAME PAUSED', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        
        const resumeBtn = this.add.text(400, 350, 'Resume Game', { fontSize: '24px', backgroundColor: '#e67e22', padding: 10 }).setOrigin(0.5).setInteractive();
        
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
    scene: [MainMenu, OfficeScene, RepairScene, ResultsScene, PauseMenu]
};

const game = new Phaser.Game(config);