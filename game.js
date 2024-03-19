

class ImageAsset {

  image;
  width;
  height;
  x = 0;
  y = 0;

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  load(url) {
    return new Promise((resolve, reject) => {
      this.image = document.createElement('img');
      this.image.src = url;
      this.image.onload = () => {
        this.width = this.image.width;
        this.height = this.image.height;
        resolve();
      }
    });
  }

  scale(scale) {
    this.width = Math.floor(this.image.width * scale);
    this.height = Math.floor(this.image.height * scale);
  }

  setToHeight(height) {
    const scale = height / this.image.height;
    this.scale(scale);
  }

  setToWidth(width) {
    const scale = width / this.image.width;
    this.scale(scale);
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

}

class Game {

  canvas;
  context;
  lastTick = Date.now();
  deltaTime;

  assets = {
    background: null,
    pipe1: null,
    pipe2: null,
    character: null,
  };

  constructor() {
    this.canvas = document.getElementById('game');
    this.context = this.canvas.getContext('2d');
    this.prepare();
  }

  async prepare() {
    await this.loadAssets();
    this.draw();
  }

  async loadAssets() {
    return new Promise(async (resolve, reject) => {
      this.assets.background = new ImageAsset();
      await this.assets.background.load('./assets/FlappyLixBackground2.png');
      this.assets.pipe1 = new ImageAsset();
      this.assets.pipe1.setPosition(300, 0);
      await this.assets.pipe1.load('./assets/FlappyLixPipe.png');
      this.assets.pipe2 = new ImageAsset();
      this.assets.pipe2.setPosition(300, 500);
      await this.assets.pipe2.load('./assets/FlappyLixPipe2.png');
      this.assets.character = new ImageAsset();
      await this.assets.character.load('./assets/lixcloud1.png');
      this.assets.character.setToHeight(100);
      resolve();
    });
  }

  draw() {
    const currentTime = Date.now();
    this.deltaTime = currentTime - this.lastTick;
    this.lastTick = currentTime;

    this.assets.pipe1.x -= this.deltaTime / 10;
    this.assets.pipe2.x -= this.deltaTime / 10;
    if(this.assets.pipe1.x < 0) {
      this.assets.pipe1.x = this.assets.pipe1.width;
    }
    if(this.assets.pipe2.x < 0) {
      this.assets.pipe2.x = this.assets.pipe2.width;
    }

    this.assets.background.draw(this.context);
    this.assets.pipe1.draw(this.context);
    this.assets.pipe2.draw(this.context);
    this.assets.character.draw(this.context);

    requestAnimationFrame(() => {
      this.draw();
    });
  }

}

(() => {
  new Game();
})();
