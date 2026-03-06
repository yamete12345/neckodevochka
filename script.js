/*
  Персонаж: Лунис
  Описание: Лунис — неко-девочка с кошачьими ушками и хвостом.
  Она игривая и любопытная, но быстро устаёт, забывает пить
  и привередлива в еде. Если не следить за её статами —
  она теряет силы и засыпает навсегда.
*/

document.addEventListener('DOMContentLoaded', function () {
    function createCharacter(config) {
        var water = config.stats.water;
        var food = config.stats.food;
        var energy = config.stats.energy;

        function clamp(value) {
            if (value < 0) return 0;
            if (value > 100) return 100;
            return value;
        }
        return {
            getWater: function () {
                return water;
            },

            getFood: function () {
                return food;
            },

            getEnergy: function () {
                return energy;
            },

            drink: function (amount) {
                if (water === 0 || food === 0 || energy === 0) return;
                if (amount === undefined) amount = config.actions.water;
                water = clamp(water + amount);
            },

            eat: function (amount) {
                if (water === 0 || food === 0 || energy === 0) return;
                if (amount === undefined) amount = config.actions.food;
                food = clamp(food + amount);
            },

            rest: function (amount) {
                if (water === 0 || food === 0 || energy === 0) return;
                if (amount === undefined) amount = config.actions.energy;
                energy = clamp(energy + amount);
            },

            tick: function () {
                if (water === 0 || food === 0 || energy === 0) return;

                var currentEnergyDecay = config.decay.energy;
                if (water < 20) {
                    currentEnergyDecay *= 2;
                }

                water = clamp(water - config.decay.water);
                food = clamp(food - config.decay.food);
                energy = clamp(energy - currentEnergyDecay);
            }
        };
    }
    var waterCount = document.querySelector('#water .count');
    var foodCount = document.querySelector('#food .count');
    var energyCount = document.querySelector('#energy .count');

    var btnWater = document.getElementById('btn-water');
    var btnFood = document.getElementById('btn-food');
    var btnRest = document.getElementById('btn-rest');

    var alertDiv = document.querySelector('.alert');
    var characterImg = document.querySelector('.character');
    var LUNIS_CONFIG = {
        name: "Lunis",
        stats: { water: 100, food: 100, energy: 100 },
        decay: { water: 8, food: 7, energy: 6 },
        actions: { water: 10, food: 15, energy: 20 }
    };
    var KAI_CONFIG = {
        name: "Kai Angel",
        stats: { water: 50, food: 80, energy: 100 },
        decay: { water: 5, food: 2, energy: 10 },
        actions: { water: 15, food: 5, energy: 10 }
    };

    var character;
    var timerId;

    var startScreen = document.getElementById('start-screen');
    var gameUI = document.getElementById('game-ui');
    var btnStart = document.getElementById('btn-start');
    var charSelect = document.getElementById('char-select');

    function updateUI() {
        waterCount.textContent = character.getWater();
        foodCount.textContent = character.getFood();
        energyCount.textContent = character.getEnergy();
    }
    function checkDeath() {
        if (character.getWater() === 0 || character.getFood() === 0 || character.getEnergy() === 0) {
            clearInterval(timerId);
            btnWater.disabled = true;
            btnFood.disabled = true;
            btnRest.disabled = true;
            alertDiv.style.display = 'block';
            characterImg.classList.add('dead');
            var restart = confirm('Ваш персонаж погиб! Начать заново?');
            if (restart) {
                location.reload();
            }
        }
    }
    btnWater.addEventListener('click', function () {
        character.drink();
        updateUI();
    });

    btnFood.addEventListener('click', function () {
        character.eat();
        updateUI();
    });

    btnRest.addEventListener('click', function () {
        character.rest();
        updateUI();
    });
    btnStart.addEventListener('click', function () {
        var selected = charSelect.value;
        var config = (selected === 'lunis') ? LUNIS_CONFIG : KAI_CONFIG;

        character = createCharacter(config);

        if (selected === 'kai') {
            characterImg.src = 'kaiangel.png';
        } else {
            characterImg.src = 'nekodevochka.png';
        }
        characterImg.style.display = 'block';

        startScreen.style.display = 'none';
        gameUI.style.display = 'flex';

        updateUI();

        timerId = setInterval(function () {
            character.tick();
            updateUI();
            checkDeath();
        }, 1000);
    });

});
