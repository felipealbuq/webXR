import React, { Component } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'

class Viewer extends Component {
    componentDidMount() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })

        this.container = document.getElementById('container')
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.container.appendChild(this.renderer.domElement)

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x00ffff)

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2000)
        // this.camera.position.set(0, 0, 5)
        this.camera.position.z = 5
        this.scene.add(this.camera)

        let ambientLight = new THREE.AmbientLight(0xffffff)
        ambientLight.intensity = 0.1
        this.scene.add(ambientLight)

        let directionalLight = new THREE.DirectionalLight(0xffffff)
        ambientLight.intensity = 0.5
        directionalLight.position.set(0.2, 1.1)
        this.scene.add(directionalLight)

        // let geometry = new THREE.BoxGeometry(1, 1, 1);
        // this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        // this.cube = new THREE.Mesh(geometry, this.material);
        // this.cube.position.z = -5
        // this.camera.add(this.cube);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.update()

        this.initScene()
        this.setupXR()

        window.addEventListener('resize', this.resize.bind(this))

        this.animate()
    }

    initScene() {
        let video = this.setUpVideo('http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_60fps_stereo_arcd.mp4')
        let texture = this.createTextureFromVideoElement(video)

        let PlaneGeometry = new THREE.PlaneGeometry(4, 0.9)
        let planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })

        this.plane = new THREE.Mesh(PlaneGeometry, planeMaterial)
        this.plane.position.z = -0.45
        // this.camera.add(this.plane)

    }

    setUpVideo(src) {
        var videoElement = document.createElement("video")

        var sourceMP4 = document.createElement("source")
        sourceMP4.type = "video/mp4"
        sourceMP4.src = src


        videoElement.appendChild(sourceMP4)

        videoElement.autoplay = true
        videoElement.muted = true
        videoElement.setAttribute("crossorigin", "anonymous")


        videoElement.style.display = "none"

        videoElement.load()
        videoElement.play()
        videoElement.loop = true
        return videoElement
    }

    createTextureFromVideoElement(video) {
        let texture = new THREE.VideoTexture(video);
        texture.crossOrigin = "anonymous";
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat
        return texture
    }

    setupXR() {
        this.renderer.xr.enabled = true
        this.renderer.xr.getCamera()
       
        this.container.appendChild(VRButton.createButton(this.renderer))
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    samePosition(a, b) {
        return ((a.x === b.x) &&
            (a.y === b.y) &&
            (a.z === b.z));
    }

    toDeg(a) {
        return (180 / Math.PI) * a.y;
    }

    animate() {
        let prevAngle = this.renderer.xr.getCamera().rotation.clone();
        let idle = true;
        let angleToApply = null;

        this.renderer.setAnimationLoop(() => {
            this.renderer.render(this.scene, this.camera)
            idle = this.samePosition(prevAngle,this.renderer.xr.getCamera().rotation)
            prevAngle = this.renderer.xr.getCamera().rotation.clone()
            console.log(idle ? "Idle" : "Moving")



            if (!idle) {
                angleToApply = this.toDeg(prevAngle)
            }

            if (idle && angleToApply) {
                let text = (angleToApply < 0) ? "clock-wise" : "anticlock-wise"
                // let angle = Math.abs(angleToApply)

                let geometry = new THREE.BoxGeometry(1, 1, 1);

                if (angleToApply < 0){    
                    let redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                    this.redCube = new THREE.Mesh(geometry, redMaterial);
                    this.redCube.position.z = -5
                    this.camera.add(this.redCube);
                } else {
                    let blueMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
                    this.blueCube = new THREE.Mesh(geometry, blueMaterial);
                    this.blueCube.position.z = -5
                    this.camera.add(this.blueCube);
                }
                
                console.log(this.renderer.xr.getCamera().rotation)

                angleToApply = null
                console.log(text)

                // let rotationStatus = { "angle": angle, "orientation": text }

                // const asyncPostCall = async () => {
                //     try {
                //         const response = await fetch('http://192.168.0.193:5000/api', {
                //             method: 'POST',
                //             headers: {
                //                 'Accept': '*/*',
                //                 'Content-Type': 'application/json'
                //             },
                //             body: JSON.stringify(rotationStatus)
                //         });
                //         const data = await response.status
                //         console.log(data);
                //     } catch (error) {
                //         console.log(error)
                //     }
                // }
                // asyncPostCall()

                // console.log(rotationStatus)

                // angleToApply = null
            }

        })

        this.controls.update()
    }

    render() {
        return (
            <div className="Viewer" />
        )
    }
}

export default Viewer
