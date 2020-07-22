var timer=0;
var i=0;
var j=0;
var distCovered=0;

UPpipes = [];
DOWNpipes = [];


let config = {
    type: Phaser.AUTO,

    scale: {
        mode: Phaser.Scale.FIT,
        width:800,
        height:600,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    backgroundColor: 0x5bbdd6,

    scene : {
        preload: preload,
        create: create,
        update: update,
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y:500,
            }
        },
        debug:true,

    },
}

var game = new Phaser.Game(config);

function preload()
{
    this.load.image("title","Assets/img/title.png")
    this.load.image("pipeUP","Assets/img/pipeUP.png")
    this.load.image("pipeDOWN","Assets/img/pipeDOWN.png")
    this.load.image("ground","Assets/img/ground.png")
    this.load.image("sky","Assets/img/sky.png")
    this.load.image("bird","Assets/img/bird.png")
    this.load.audio("dieAudio","Assets/audio/sfx_die.wav")
    this.load.audio("flapAudio","Assets/audio/sfx_flap.wav")
    this.load.audio("hitAudio","Assets/audio/sfx_hit.wav")
    this.load.audio("pointAudio","Assets/audio/sfx_point.wav")
    this.load.audio("swooshingAudio","Assets/audio/sfx_swooshing.wav")
    this.load.image("fullscreen","Assets/img/fullscreen.png")    
    this.load.image("black","Assets/img/black.png")    
}

function create()
{   
    W = game.config.width;
    H = game.config.height;

    this.score=0;
    this.scoreText=this.add.text(16,16,'Score : 0',{font:'32px Impact,Charcoal,sans-serif',fill:'#000'})
    this.scoreText.depth = 2;

    var button = this.add.sprite(W-16,16,'fullscreen').setScale(0.25,0.25).setOrigin(1,0).setInteractive();
    button.depth = 3;
    button.on('pointerup', ()=>{

        if (this.scale.isFullscreen)
        {
            button.setFrame(0);

            this.scale.stopFullscreen();
        }
        else
        {
            button.setFrame(1);

            this.scale.startFullscreen();
        }

    }, this);

    var Fkey = this.input.keyboard.addKey('F')
    Fkey.on('down',()=>{
        if (this.scale.isFullscreen)
        {
            button.setFrame(0);

            this.scale.stopFullscreen();
        }
        else
        {
            button.setFrame(1);

            this.scale.startFullscreen();
        }
    })


    var title = this.add.sprite(300,100,'title').setOrigin(0,0).setScale(0.06,0.06)
    title.depth=2;

    this.background = this.add.tileSprite(0,H-100,W,H-100,'ground').setOrigin(0,0)
   
    this.sky = this.add.tileSprite(0,H-250,W,H-200,'sky').setOrigin(0,0);
    this.sky.depth=-1;

    this.bird = this.physics.add.sprite(200,200,'bird').setOrigin(0,0)
    this.bird.setCollideWorldBounds(true);
    this.bird.setBounce(0.2);
    
    flapAudio = this.sound.add("flapAudio")
    dieAudio = this.sound.add("dieAudio")
    hitAudio = this.sound.add("hitAudio")
    pointAudio = this.sound.add("pointAudio")
    swooshingAudio = this.sound.add("swooshingAudio")

    this.cursors = this.input.keyboard.createCursorKeys();

    // for(let a=0;a<UPpipes.length;a++)
    // {
    //     this.physics.add.overlap(this.bird,UPpipes[a],gameOver,null,this);
    // }
    // for(let b=0;b<DOWNpipes.length;b++)
    // {
    //     this.physics.add.overlap(this.bird,DOWNpipes[b],gameOver,null,this);
    // }


}
function update()
{   
    timer++;
    // console.log(timer);

    // crossedFirstPipe = false;
    // distCovered+=1;
    // if(distCovered==800 && !crossedFirstPipe)
    // {
    //     this.score+=10;
    //     this.scoreText.setText('Score: '+ this.score)
    //     distCovered=0;
    //     crossedFirstPipe=true;
    // }

    this.sky.tilePositionX+=2;
    this.background.tilePositionX+=2;

    if(this.cursors.up.isDown)
    {   
        flapAudio.play();
        this.bird.setVelocityY(-200);
    }

    // for(let a=0;a<UPpipes.length;a++)
    // {
    //     UPpipes[a].setVelocityX(-50)
    // }
    // for(let b=0;b<DOWNpipes.length;b++)
    // {
    //     DOWNpipes[b].setVelocityX(-50);
    // }
    if( (timer/200)%1 == 0 && timer!=0 )
    {
        let RandomY1 = randomInteger(600,800)
        let RandomY2 = randomInteger(200,0)
        
        // let RandomX = randomInteger(900,1000);

        UPpipes[i] = this.physics.add.sprite(900,RandomY1,'pipeUP').setOrigin(0,0).setScale(0.35,0.5);
        DOWNpipes[j] = this.physics.add.sprite(900,RandomY2,'pipeDOWN').setOrigin(0,0).setScale(0.35,0.5);

        UPpipes[i].body.allowGravity = false;
        DOWNpipes[j].body.allowGravity = false;

        UPpipes[i].setVelocityX(-50);
        DOWNpipes[i].setVelocityX(-50);

        UPpipes[i].body.immovable = true;
        DOWNpipes[i].body.immovable = true;
    
        this.physics.add.overlap(UPpipes[i],this.bird,Collision,null,this)
        this.physics.add.overlap(DOWNpipes[j],this.bird,Collision,null,this)
        
        i++;
        j++;
    }

    if(timer == 917 || ( (timer-917)%205==0 && (timer>917) ))
    {   
        pointAudio.play();
        this.score+=10;
        this.scoreText.setText('Score: '+ this.score)
    }
    
}
function randomInteger(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Collision()
{   
    dieAudio.play();
    alert("You LOSE! Score: " + this.score)
}