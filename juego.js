var fondo, carro, cursor, enemigos, timer, gasolinas, timerGasolina, puntosText, nivelText, nivel = 1, puntos = 0, maxNiveles = 3;
var estadoJuego = 'jugando'; // Controla el estado del juego (jugando, fin, ganado)
var mensajeTexto; // Variable para almacenar el mensaje en pantalla

var Juego = {
    preload: function () {
        juego.load.image("bg", "img/bg.png");
        juego.load.image("carro", "img/carro.png");
        juego.load.image("carroMalo", "img/carroMalo.png");
        juego.load.image("gasolina", "img/gas.png");
        juego.forceSingleUpdate = true;
    },
    create: function () {
        fondo = juego.add.tileSprite(0, 0, 290, 540, 'bg');
        carro = juego.add.sprite(juego.width / 2, 496, 'carro');
        carro.anchor.setTo(0.5);

        juego.physics.arcade.enable(carro);
        carro.body.collideWorldBounds = true;

        puntosText = juego.add.text(10, 10, 'Puntos: 0', { font: '20px Arial', fill: '#fff' });
        nivelText = juego.add.text(200, 10, 'Nivel: 1', { font: '20px Arial', fill: '#fff' });

        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;
        enemigos.createMultiple(20, 'carroMalo');
        enemigos.setAll('anchor.x', 0.5);
        enemigos.setAll('anchor.y', 0.5);
        enemigos.setAll('outOfBoundsKill', true);
        enemigos.setAll('checkWorldBounds', true);
    
        gasolinas = juego.add.group();
        gasolinas.enableBody = true;
        gasolinas.physicsBodyType = Phaser.Physics.ARCADE;
        gasolinas.createMultiple(20, 'gasolina');
        gasolinas.setAll('anchor.x', 0.5);
        gasolinas.setAll('anchor.y', 0.5);
        gasolinas.setAll('outOfBoundsKill', true);
        gasolinas.setAll('checkWorldBounds', true);

        timer = juego.time.events.loop(1500, this.crearCarroMalo, this);
        timerGasolina = juego.time.events.loop(2000, this.crearGasolina, this);

        cursor = juego.input.keyboard.createCursorKeys();
    },

    update: function () {
        if (estadoJuego === 'jugando') {
            fondo.tilePosition.y += 3;
        
            if (cursor.right.isDown && carro.position.x < 245) {
                carro.position.x += 5;
            } else if (cursor.left.isDown && carro.position.x > 45) {
                carro.position.x -= 5;
            }

            juego.physics.arcade.overlap(carro, enemigos, this.colisionEnemigo, null, this);
            juego.physics.arcade.overlap(carro, gasolinas, this.recogerGasolina, null, this);
        }
    },

    crearCarroMalo: function () {
        var posicion = Math.floor(Math.random() * 3) + 1;
        var enemigo = enemigos.getFirstDead();
        if (enemigo) {
            enemigo.reset(posicion * 73, 0);
            enemigo.body.velocity.y = 200;
            enemigo.anchor.setTo(0.5);
        }
    },

    crearGasolina: function () {
        var posicion = Math.floor(Math.random() * 3) + 1;
        var gasolina = gasolinas.getFirstDead();
        if (gasolina) {
            gasolina.reset(posicion * 73, 0);
            gasolina.body.velocity.y = 200;
            gasolina.anchor.setTo(0.5);
        }
    },

    colisionEnemigo: function (carro, enemigo) {
        enemigo.kill();
        estadoJuego = 'fin';
        this.mostrarMensaje("VUELVE A INTENTARLO", this.reiniciarJuego);
    },

    recogerGasolina: function (carro, gasolina) {
        gasolina.kill(); 

        puntos += 1;
        puntosText.text = 'Puntos: ' + puntos;

        if (puntos >= 3) {
            this.subirNivel();
        }
    },

    subirNivel: function () {
        puntos = 0; // Reinicia los puntos
        puntosText.text = 'Puntos: ' + puntos;
        nivel += 1;

        if (nivel > maxNiveles) {
            estadoJuego = 'ganado';
            this.mostrarMensaje("GANASTE", this.reiniciarJuego);
        } else {
            nivelText.text = 'Nivel: ' + nivel;
        }
    },

    mostrarMensaje: function (texto, callback) {
        switch (texto) {
            case "GANASTE":
                mensajeTexto = juego.add.text(juego.world.centerX, juego.world.centerY, texto, { font: '12px Arial', fill: '#11f211' });
                break;
                case "VUELVE A INTENTARLO":
                    mensajeTexto = juego.add.text(juego.world.centerX, juego.world.centerY, texto, { font: '12px Arial', fill: '#f54242' });
                break;        
            default:
                break;
        }
        
        mensajeTexto.anchor.setTo(0.5);
        
        juego.input.onTap.addOnce(callback, this);
    },

    reiniciarJuego: function () {
        if (mensajeTexto) {
            mensajeTexto.destroy(); // Destruye el mensaje antes de reiniciar
        }

        puntos = 0;
        nivel = 1;
        estadoJuego = 'jugando';
        puntosText.text = 'Puntos: ' + puntos;
        nivelText.text = 'Nivel: ' + nivel;
        enemigos.callAll('revive');
        gasolinas.callAll('revive');
    }
};
