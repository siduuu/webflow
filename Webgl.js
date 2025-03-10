// libs
import gsap from "gsap"
import * as THREE from "three";
import {isTouch} from "utils";

const vertex = `varying vec2 vUv;
    void main()
    {
        vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }`;


const fragment = `uniform float time;

    uniform sampler2D uTexture;
    uniform sampler2D uDisplacement;
    
    varying vec2 vUv;

    float PI = 3.141592653589793238;
    void main() {
        
        vec4 displacement = texture2D(uDisplacement, vUv);
        float theta = displacement.r*2.*PI;

        vec2 dir = vec2(sin(theta), cos(theta));

        vec2 uv = vUv + dir*displacement.r*0.2; //1.

        vec4 color = texture2D(uTexture, uv);

        gl_FragColor = color;
    }`;

export class Webgl
{
    constructor() {

        this.width = window.innerWidth;
        isTouch() ? this.height = window.innerHeight + 100 : this.height = window.innerHeight;

        this.actif = false;

        this.scene = new THREE.Scene();
        this.scene1 = new THREE.Scene();

        this.clock = new THREE.Clock();

        this.mouse = new THREE.Vector2(0,0)
        this.prevMouse = new THREE.Vector2(0,0)
        this.currentWave = 0

        this.sens = false;
        this.currentScr = 0;

        this.baseTexture = new THREE.WebGLRenderTarget(
            this.width, this.height, {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat
            }
        )

        this.renderer = new THREE.WebGLRenderer(); //{ antialias: true, alpha: true }

        this.renderer.setPixelRatio(0.5) //Math.min(window.devicePixelRatio, 2)
        if(isTouch()){
           this.renderer.setPixelRatio(2) 
        }
        //console.log(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize( this.width, this.height );

        let frustumSize = this.height;
        let aspect = this.width/this.height;

        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / - 2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            -1000,
            1000
        )
        //this.camera.position.set(0, 0, 2);

        this.renderer.setClearColor(0x000000, 1);

        document.body.appendChild( this.renderer.domElement );

        //if(document.body.classList.contains('Webgl')){
        this.video = document.getElementById( 'video' );
        this.video.play();
        this.video.loop = this.video.muted = true;
        this.texture = new THREE.VideoTexture( video );
        // }else{
        //     this.texture = new THREE.TextureLoader().load(document.body.getAttribute('data-img-hero'))
        // }

        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: {value : 0},
                uDisplacement: {value: null},
                // uTexture: {value: new THREE.TextureLoader().load(document.body.getAttribute('data-fond'))},
                uTexture: {value: this.texture},
                resolution: {value: new THREE.Vector4()}
            },
            vertexShader: vertex,
            fragmentShader: fragment
        })
    
        
        this.plane = new THREE.Mesh(this.geometry, this.material1)
        this.scene.add(this.plane);

        // this.blocks = [];       
        // document.querySelectorAll('.bloc').forEach(bloc => {
        //     const mesh = {}
        //     mesh.el = bloc;
        //     mesh.prevY = 0;
        //     this.blocks.push(mesh);
        // })

        // num
        this.max = 100;
        if(window.innerWidth < 768){
            this.geometry = new THREE.PlaneGeometry(350, 350, 1, 1)
        }else{
            this.geometry = new THREE.PlaneGeometry(450, 450, 1, 1)
        }
        
        this.geometryFullScreen = new THREE.PlaneGeometry(this.width, this.height, 1, 1)

        // forme rectangle / K
        this.meshes = [];
        // forme eau
        this.meshes2 = [];

        this.meshesMouse = []

        this.textureEau = new THREE.TextureLoader().load(document.body.getAttribute('data-eau'))

        for(let i = 0; i < this.max; i++){
            let m = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(document.body.getAttribute('data-brush')),
                transparent: true,
                // blending: THREE.AdditiveBlending,
                // depthTest: false,
                // depthWrite: false
            })

            let mesh = new THREE.Mesh(
                this.geometry, m
            )

            mesh.visible = false;
            this.scene.add(mesh)
            this.meshes.push(mesh)
        }

        for(let i = 0; i < this.max; i++){
            let m = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(document.body.getAttribute('data-eau')),
                transparent: true,
            })

            let mesh = new THREE.Mesh(
                this.geometry, m
            )

            mesh.visible = false;
            this.scene.add(mesh)
            this.meshes2.push(mesh)
        }

        for(let i = 0; i < this.max; i++){
            let m = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(document.body.getAttribute('data-mouse')),
                transparent: true,
            })

            let mesh = new THREE.Mesh(
                this.geometry, m
            )

            mesh.visible = false;
            this.scene.add(mesh)
            this.meshesMouse.push(mesh)
        }

        this.quad = new THREE.Mesh(this.geometryFullScreen, this.material)
        this.scene1.add(this.quad);


        // lancement expe
        // this.animate();
        // this.mouseEvents();


        window.addEventListener('resize', () => {

            this.width = window.innerWidth;
            isTouch() ? this.height = window.innerHeight + 100 : this.height = window.innerHeight;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize( this.width, this.height );

        })


    }

    setNewWave(x, y, index, tableau, elDom, click) {

        const mesh = tableau[index];
        mesh.blocClassic = mesh.click = false;
        mesh.visible = true;
        mesh.position.x = x;
        mesh.position.y = y;

        mesh.scale.x = mesh.scale.y = 1;

        // forme K
        if(tableau == this.meshes){
            mesh.material.opacity = 0.5;
            mesh.scale.x = mesh.scale.y = 1.2;

        // forme eau pour bloc et logo
        }else if(tableau == this.meshes2){
            mesh.material.opacity = 0.2;
            mesh.rotation.z = Math.random() * 2*Math.PI

        // forme eau pour curseur
        }else if(tableau == this.meshesMouse){
            mesh.material.opacity = 0.55;
            mesh.scale.x = mesh.scale.y = 0.7;
            mesh.rotation.z = Math.random() * 2*Math.PI
        }

        // si pas logo et pas souris
        if(elDom != undefined && !elDom.el.classList.contains('bloc1')){
            mesh.scale.x = elDom.el.clientWidth/300;
            mesh.blocClassic = true;
        }

        if(click != undefined){
            mesh.click = true
            mesh.material.opacity = 0.4;
            mesh.scale.x = mesh.scale.y = click;
            mesh.rotation.z = 0;
        }
    }

    trackMousePos() {

        //mouvement souris
        if(
            Math.abs(this.mouse.x - this.prevMouse.x) < 4 &&
            Math.abs(this.mouse.y - this.prevMouse.y) < 4
        ){
            //nothing
        }else {
            this.setNewWave(this.mouse.x, this.mouse.y, this.currentWave, this.meshesMouse)
            this.currentWave = (this.currentWave + 1) % this.max;
        }
        this.prevMouse.x = this.mouse.x;
        this.prevMouse.y = this.mouse.y;

        for(const mesh of this.blocks)
        {

            // position de la déformation sauf pour le logo
            if(!mesh.el.classList.contains('bloc1')){
                let val = mesh.el.clientHeight - 210;
                if(!this.sens){val = 210 }
                mesh.y = -mesh.el.getBoundingClientRect().top + this.height/2 - val;
            }else {
                mesh.y = -mesh.el.getBoundingClientRect().top + this.height/2 - mesh.el.clientHeight/2;
            }

            if(
                mesh.y + this.height/2 < this.height && 
                mesh.y + this.height/2 > 0 &&

                //on supprime les vagues inutiles // A VOIR SI TU GARDES
                (
                    mesh.el.classList.contains('blocHaut') && !this.sens ||
                    mesh.el.classList.contains('blocBas') && this.sens
                )
            ){

                mesh.x = mesh.el.getBoundingClientRect().left - window.innerWidth/2 + mesh.el.clientWidth /2;

                if(
                    Math.abs(mesh.y - mesh.prevY) < 4
                ){
                    //nothing
                }else {
                    this.setNewWave(mesh.x, mesh.y, this.currentWave, this.meshes, mesh)
                    this.setNewWave(mesh.x, mesh.y, this.currentWave, this.meshes2, mesh)

                    this.currentWave = (this.currentWave + 1) % this.max;
                }

                mesh.prevY = mesh.y;
            }
        }
    }

    animate() {

        this.trackMousePos()
        this.rafWebgl = requestAnimationFrame(this.animate.bind(this))

        this.renderer.setRenderTarget(this.baseTexture);
        this.renderer.render(this.scene, this.camera)
        this.material.uniforms.uDisplacement.value = this.baseTexture.texture;
        this.renderer.setRenderTarget(null);
        this.renderer.clear();
        this.renderer.render(this.scene1, this.camera)

        const incr = this.clock.getDelta();

        this.meshes.forEach(mesh => {
            if (mesh.visible) {
                // mesh.rotation.z += incr/2;
                mesh.material.opacity *= 0.92; // 0.96

                
                mesh.scale.x = 0.982 * mesh.scale.x + 0.02; // + 0.25; //0.108;
                if(!mesh.blocClassic){
                    mesh.scale.y = mesh.scale.x;
                }

                if (mesh.material.opacity < 0.002) {
                    mesh.visible = false;
                }
            }
        })

        this.meshes2.forEach(mesh => {
            if (mesh.visible) {
                mesh.rotation.z += incr/2;
                mesh.material.opacity *= 0.98; // 0.96

                mesh.scale.x = 0.982 * mesh.scale.x + 0.04; // + 0.25; //0.108;
                if(!mesh.blocClassic){
                    mesh.scale.y = mesh.scale.x;
                }

                if (mesh.material.opacity < 0.002) {
                    mesh.visible = false;
                }
            }
        })

        this.meshesMouse.forEach(function (mesh) {
          if (mesh.visible) {
            if(mesh.click){
                // mesh.rotation.z += incr;
                mesh.material.opacity *= 0.95; // 0.96
            }else{
                mesh.rotation.z += incr / 2;
                mesh.material.opacity *= 0.98; // 0.96
            }

            mesh.scale.x = 0.982 * mesh.scale.x + 0.03; // + 0.25; //0.108;

            mesh.scale.y = mesh.scale.x;

            if (mesh.material.opacity < 0.002) {
              mesh.visible = false;
            }
          }
        }); // test ajout vague




        // SENS version pas smooth scroll
        if(window.pageYOffset < this.currentScr){
            this.sens = false;
        }else if(window.pageYOffset > this.currentScr){
            this.sens = true;
        }
        this.currentScr = window.pageYOffset;

        // SENS version smooth scroll
        // if(-this.scroll.current < this.currentScr){
        //  this.sens = false;
        // }else if(-this.scroll.current > this.currentScr){
        //  this.sens = true;
        // }
        // this.currentScr = -this.scroll.current;
    }

    init() {
        this.blocks = [];   

        this.mouseE = this.mouseMove.bind(this);
        window.addEventListener('mousemove', this.mouseE)

        this.mouseC = this.mouseClick.bind(this);
        document.body.addEventListener('click', this.mouseC)
    }

    updateBlocs() {
        this.blocks = [];       
        document.querySelectorAll('.bloc').forEach(bloc => {
            const mesh = {}
            mesh.el = bloc;
            mesh.prevY = 0;
            this.blocks.push(mesh);
        })
    }

    mouseMove(e) {
        this.mouse.x = e.clientX - this.width/2;
        this.mouse.y = this.height/2 - e.clientY;
    }

    mouseClick(e) {
        // let incr = 0;
            
        // // code de jean
        // for (let i = 0; i < 20; i++){
        //     ((iLocal) => {
        //         gsap.delayedCall(incr, () => {
        //             this.setNewWave(this.mouse.x, this.mouse.y, this.currentWave, this.meshesMouse, undefined, (0.5 + iLocal*0.1))
        //             this.currentWave = (this.currentWave + 1) % this.max;
        //         })
        //     })(i)

        //     incr += 0.008;
        //     // taille+= 0.1;
        // }

        let incr = 0;
            
        // code de jean
        for (let i = 0; i < 10; i++){
            ((iLocal) => {
                gsap.delayedCall(incr, () => {
                    this.setNewWave(this.mouse.x, this.mouse.y, this.currentWave, this.meshesMouse, undefined, (0.2 + iLocal*0.1))
                    this.currentWave = (this.currentWave + 1) % this.max;
                })
            })(i)

            incr += 0.02;
        }
    }

    killWebgl() {
        cancelAnimationFrame(this.rafWebgl);

        window.removeEventListener('mousemove', this.mouseE)
        document.body.removeEventListener('click', this.mouseC)
    }
}