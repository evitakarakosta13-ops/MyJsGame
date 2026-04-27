const canvas=document.getElementById('canvas1');
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth;//dinei platos parathyroy se pixels
canvas.height=window.innerHeight;
const collisionCanvas =document.getElementById('collisionCanvas');
const collisionCtx=collisionCanvas.getContext('2d');
collisionCanvas.width=window.innerWidth;//dinei platos parathyroy se pixels
collisionCanvas.height=window.innerHeight;

let timeToNextRaven=0;
let ravenInterval=500;//otan ftasei sta 500 kanei reset back to zero
let lastTime=0;
let score=0;
ctx.font='50px Impact';
let ravens=[];
let gameOver=false;
class Raven{
    constructor(){
        this.spriteWidth=271;
        this.spriteHeight=194;
        this.sizeModifier=Math.random()*0.6 +0.4;
        this.width=this.spriteWidth* this.sizeModifier;//gia na emfanizontai to kathena m ediaforetiko megethod
        this.height=this.spriteHeight * this.sizeModifier;
        this.x=canvas.width;//τοποτηετει το κορσκι δτην  δεξια ακρη του καμβα γιατι αριστερα ειναι η θεση 0 και το κανβασ.ςιντθ ειναι τερμα δεξια
        this.y=Math.random()*(canvas.height-this.height);//κανω αυτην τη  αφαιρεση ωστε το κορακι να παραμεινει μεσα στον κανβα μην  βγει εκτοσ οριων
        this.directionX=Math.random()*5+3;
        this.directionY=Math.random()*5-2.5;
        this.markedForDeletion=false;
        this.image=new Image();
        this.image.src = 'raven.png'; 
        this.sound=new Audio();
        this.sound.src = 'Fire impact 1.wav';
        
        
        this.frame=0;
        this.maxFrame=4;
        this.timeSinceFlap=0;
        this.flapInterval=100;//kathe 100ms allazoyme to frame ceydaisthsh oti koynAEI ftera
       // this.falling=false;
        //this.fall=0.5;
        this.randomColors=[Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
        this.color='rgb('+this.randomColors[0]+','+this.randomColors[1]+','+this.randomColors[2]+')';
        this.hasTrail=Math.random()>0.5;//κάθε κοράκι έχει 50% πιθανότητα να αφήνει “ουρά” (trail) πίσω του, δηλαδή εφέ σαν καπνό ή φως που το ακολουθεί
    }  
    update(deltatime){
      if(this.y<0 || this.y>canvas.height-this.height){
        this.directionY=this.directionY*-1;//an akoiumphsoun na allajoun kateythynshgia na mhn bgoyn ektos orivn 
      }
        this.x-=this.directionX;//metakineitai pros ta dejia
        this.y += this.directionY;
       
        if(this.x<0-this.width){//an to koaki pernaei ejv apo ta ori prepei na digrafei
              this.markedForDeletion=true;}
        
          this.timeSinceFlap+=deltatime;
          if(this.timeSinceFlap>this.flapInterval){
               if(this.frame>this.maxFrame){
                     this.frame=0;
                  } else {this.frame++;
                       this.timeSinceFlap=0;
                         }
                         if(this.hasTrail){
                            for(let i=0;i<5;i++){
                               particles.push(new Particle(this.x,this.y,this.width,this.color));
                         }
                            }
                         
          }
          if(this.x<0-this.width)gameOver=true;
        
    }
        
          
          
        
    
    draw(){
        collisionCtx.fillStyle=this.color;

        collisionCtx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
    }
     

}

let explosions =[ ];
class Explosion{
    constructor(x,y,size){
        this.image=new Image();
        this.image.src="C:/Users/evita/Desktop/boom.png";
        this.spriteWidth=200;
        this.spriteHeight=179;
        this.size=size;
        this.x=x;
        this.y=y;
        this.frame=0;
        this.sound=new Audio();
        this.image.src = 'boom.png';
        this.timeSinceLastFrame=0;
        this.frameInterval=200;
        this.markedForDeletion=false;
    }
    update(deltatime){
        if(this.frame===0)this.sound.play();
        this.timeSinceLastFrame+=deltatime;
        if(this.timeSinceLastFrame>this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame=0;

            if(this.frame>5)this.markedForDeletion=true;

        }
    }
        draw(){
            ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.size,this.size);
        }
   

}
let particles=[];
class Particle{
     constructor(x,y,size,color){
        this.size=size;
        this.x=x+this.size/2;//gia na to kentrarei kai na phgainei orizontia
        this.y=y+this.size/3;
        
        this.radius=Math.random()*this.size/10;
        this.maxRadius=Math.random()*20+35;
        this.markedForDeletion=false;
        this.speedX=Math.random()*1+0.5;
        this.color=color;
        ctx.save();
    ctx.globalAlpha = 1 - this.radius / this.maxRadius; // Διόρθωση spelling
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

     }
    update(){
        this.x+=this.speedX;
        this.radius+=0.5;
        if(this.radius>this.maxRadius-5)this.markedForDeletion=true;



    }
   draw(){
    ctx.save();
    ctx.gloabalAlpha=1-this.radius/this.maxRadius;
    ctx.beginPath();//Ξεκινάμε ένα νέο μονοπάτι (path) για να ζωγραφίσουμε τον κύκλο.
    ctx.fillStyle=this.color;
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
}
}

   function  drawScore(){
     ctx.fillStyle='black';
    ctx.fillText('Score:' +score,50,75);
     ctx.fillStyle='white'
    ctx.fillText('Score:' +score,55,80);

}
function drawgameOver(){
    ctx.textAlign='center';
    ctx.fillStyle='black';
    ctx.fillText('GAME OVER , your score is:'+score,canvas.width/2,canvas.height/2);
     ctx.fillStyle='white';
    ctx.fillText('GAME OVER , your score is:'+score,canvas.width/2+5,canvas.height/2+5);
}

window.addEventListener('click',function(e){
   const detectPixelColor=collisionCtx.getImageData(e.x, e.y,1,1);
  
   const pc=detectPixelColor.data;
   ravens.forEach(object=>{
    if(object.randomColors[0]===pc[0] && object.randomColors[1]===pc[1]&& object.randomColors[2]===pc[2]){
            //collisiondetected by colour
        object.markedForDeletion=true;
            score++;
            explosions.push(new Explosion(object.x,object.y,object.width));
    }
   });
});
function animate(timeStamp){
    ctx.clearRect(0,0,canvas.width,canvas.height);
  collisionCtx.clearRect(0,0,canvas.width,canvas.height);
   let deltatime=timeStamp-lastTime;//metraei posos xronos perase apo to prohgoumeno kare
   lastTime=timeStamp;
   timeToNextRaven+=deltatime;//ayjaneis ena rroloi pou metraei poso xronos exei perasei apo tote poy emfanisthke to teleytsio koraki
   if(timeToNextRaven>ravenInterval){
    ravens.push(new Raven());
    timeToNextRaven=0;
    ravens.sort(function(a,b){
        return a.width-b.width;//small one first big on top
    });
   };
   drawScore();//prvta gtiaxnv to score meta ta ravens
   [...ravens,...explosions,...particles].forEach(Object=>Object.update( deltatime));
   [...ravens,...explosions,...particles].forEach(Object=>Object.draw( ));
  
    ravens=ravens.filter(Object=>!Object.markedForDeletion);//reassign the first array apla xvris ta diegrammena
  
      ravens = ravens.filter(object => !object.markedForDeletion);
explosions = explosions.filter(object => !object.markedForDeletion);
particles = particles.filter(object => !object.markedForDeletion);
    if (!gameOver)requestAnimationFrame(animate);
    else drawgameOver();

}
animate(0);
//to [...]kanei ena antigrafo toy pinaka ravens dhladh neos pinakas
//strokerect  zvgrafizei san ena perigramma oxi san to fillrect poy gemizei olo to orthogonio
//otav exb sti ctx.drawImage ennia orismata tote anaferomai se ayto to frame ooy thellv na kocv dhl me spritewidth