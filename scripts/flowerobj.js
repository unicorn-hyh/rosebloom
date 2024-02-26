function polar(x) {
  return [x[0] * cos(x[1]), x[0] * sin(x[1])];
}

function Leaf(scale, pg, tscale) {
  this.drawing = pg;
  this.ts = tscale;
  colorMode(HSB);
  this.strokec = color(random(90,100), 80, random(30, 35));
  this.fillc = color(random(120,135), 80, random(25, 30));
  let t = random(6.28);
  let r = random(50, 85) * scale;
  this.x2 = polar([r,t])[0];
  this.y2 = polar([r,t])[1];
  let curve = random(-.2, .2);
  this.cx2 = polar([r*.9,t+curve])[0];
  this.cy2 = polar([r*.9,t+curve])[1];
  let veins = 6;
  this.controls = [];
  let size = random(0.8, 0.9);
  let left = t - size;
  let inc = size*2 / (veins-1);
  for (i=0; i<veins; i++) {
    this.controls.push(polar([r/2, left+(inc*i)]));
  }

  this.draw = function() {
    if (this.ts < 1) {
      this.ts += (1-this.ts)/14 + .005;
    }
    if (this.ts > 0) {
      this.drawing.stroke(this.strokec);
      this.drawing.fill(this.fillc);
      this.drawing.beginShape();
      this.drawing.vertex(imageSize, imageSize);
      this.drawing.bezierVertex(this.controls[0][0]*this.ts+imageSize, this.controls[0][1]*this.ts+imageSize,
        this.cx2*this.ts+imageSize, this.cy2*this.ts+imageSize,
        this.x2*this.ts+imageSize, this.y2*this.ts+imageSize);
      this.drawing.bezierVertex(this.cx2*this.ts+imageSize, this.cy2*this.ts+imageSize,
        this.controls[veins-1][0]*this.ts+imageSize, this.controls[veins-1][1]*this.ts+imageSize,
        imageSize, imageSize);
      this.drawing.endShape();
      this.drawing.noFill();
      for (let i=1; i<(veins-1); i++) {
        this.drawing.bezier(imageSize, imageSize,
          this.controls[i][0]*this.ts+imageSize, this.controls[i][1]*this.ts+imageSize,
          this.cx2*this.ts+imageSize, this.cy2*this.ts+imageSize,
          this.x2*this.ts+imageSize, this.y2*this.ts+imageSize);
      }
    }
  }

}


function Petal(pg, tscale, angleOffset, radius) {

  this.drawing = pg;
  colorMode(HSB);
  this.strokec = color(0, 0, 40);
  this.fillc = color(random(0, 8), random(85, 95), random(80, 90));
  this.ts = tscale;
  this.angleOffset = angleOffset;
  this.radius = radius;

  this.draw = function() {
    if (this.ts < 1) {
      this.ts += (1-this.ts)/14 + .005;
    }
     if (this.ts > 0) {
      this.drawing.stroke(this.strokec);
      this.drawing.fill(this.fillc);
      this.drawing.push();
      this.drawing.translate(imageSize, imageSize);
      this.drawing.rotate(this.angleOffset);
      this.drawing.beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i;
        let x = this.radius * this.ts * cos(angle);
        let y = this.radius * this.ts * sin(angle);
        this.drawing.vertex(x, y);
      }
      this.drawing.endShape(CLOSE);
      this.drawing.pop();
    }
  }
}

function Petalcir(pg, tscale, radius) {

  this.drawing = pg;
  colorMode(HSB);
  this.strokec = color(0, 0, 40);
  this.fillc = color(random(0, 8), random(85, 95), random(80, 90));
  this.ts = tscale;
  this.radius = radius;

  this.draw = function() {
    if (this.ts < 1) {
      this.ts += (1-this.ts)/14 + .005;
    }
     if (this.ts > 0) {
      this.drawing.stroke(this.strokec);
      this.drawing.fill(this.fillc);
      this.drawing.push();
      this.drawing.translate(imageSize, imageSize);

      // 使用 ellipse() 函数绘制一个圆形
      this.drawing.ellipse(0, 0, this.radius * 2 * this.ts, this.radius * 2 * this.ts);

      this.drawing.pop();
    }
  }
}

function Flower(scale) {
  this.x = mouseX;
  this.y = mouseY;
  this.counter = 0;
  let pg = createGraphics(imageSize*2, imageSize*2);
  if (check) {
    pg.strokeWeight(2);
  }
  let i;

  let dc = 0
  this.leaves = []
  for (i=0; i<3; i++) {
    this.leaves.push(new Leaf(scale, pg, dc));
    dc -= random(.6);
  }
  this.petals = []
  dc = 0
  
  for (i=0; i<5; i++) {
    let radius = 35 * (1 - i * random(0.19,0.21));
    let angleOffset = random(PI/12,PI / 9) * (i+1);
    this.petals.push(new Petal(pg, dc, angleOffset, radius));
    dc -= random(1.6);
    }
  dc = 0;

  this.draw = function() {
    if (this.counter < steps) {
      pg.clear();
      for (let i=0; i<3; i++) {
        this.leaves[i].draw();
      }
      for (let i=0; i<5; i++) {
        this.petals[i].draw();
      }
      image(pg, this.x-imageSize, this.y-imageSize);
      this.counter++;
      if (this.counter == steps) {
        fscache.image(pg, this.x-imageSize, this.y-imageSize);
        pg.remove();
      }
    }
  }

  this.die = function() {
    pg.remove();
  }

}