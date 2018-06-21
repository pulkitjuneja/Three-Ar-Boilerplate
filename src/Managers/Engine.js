import * as THREE from 'three';
import { ARPerspectiveCamera } from 'three.ar.js';
import entityManager from './EntityManager';
import BasicTorus from '../Entities/BasicTorus';
import renderer from './Renderer';
import VRControls from '../Utils/VRControls';

export default class Engine {
  start() {
    renderer.initRenderer().then((success) => {
      if (success) {
        this.buildCamera();
        this.setupScene();
        this.startUpdate();
      }
    });
  }

  buildCamera() {
    const camera = new ARPerspectiveCamera(
      renderer.vrDisplay,
      60,
      window.innerWidth / window.innerHeight,
      renderer.vrDisplay.depthNear,
      renderer.vrDisplay.depthFar
    );
    entityManager.mainCamera = camera;
    this.vrControls = new VRControls(camera);
  }

  setupScene() {
    this.scene = new THREE.Scene();
    entityManager.addEntity(new BasicTorus('torus', this.scene, new THREE.Vector3(0, 0, -1.5)));
    const light = new THREE.PointLight(0xff0000, 1, 100);
    light.position.set(5, 5, 5);
    this.scene.add(light);
    this.scene.add(entityManager.mainCamera);
  }

  addCanvasEventHandlers() {
    window.addEventListener('resize', this.onWindowResize, false);
  }

  onWindowResize() {
    entityManager.mainCamera.aspect = window.innerWidth / window.innerHeight;
    entityManager.mainCamera.updateProjectionMatrix();
    renderer.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  startUpdate() {
    const currentInstance = this;
    this.update = () => {
      entityManager.update();
      entityManager.mainCamera.updateProjectionMatrix();
      currentInstance.vrControls.update();
      renderer.update(currentInstance.scene, entityManager.mainCamera, currentInstance.update);
    };
    this.update();
  }
}

