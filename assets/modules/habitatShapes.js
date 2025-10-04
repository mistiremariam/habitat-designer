// HabitatShapes.js
// Module for defining different space habitat shapes

import * as THREE from 'three';

/**
 * Creates a cylinder habitat
 * @param {Object} options - { radiusTop, radiusBottom, height, radialSegments, materialOptions }
 * @returns {THREE.Mesh} Cylinder mesh
 */
export function createCylinderHabitat(options = {}) {
  const {
    radiusTop = 2,
    radiusBottom = 2,
    height = 5,
    radialSegments = 32,
    materialOptions = { color: 0x00bfff, wireframe: true },
  } = options;

  const geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    radialSegments
  );
  const material = new THREE.MeshStandardMaterial(materialOptions);
  const cylinder = new THREE.Mesh(geometry, material);

  return cylinder;
}

/**
 * Creates a dome habitat
 * @param {Object} options - { radius, widthSegments, heightSegments, materialOptions }
 * @returns {THREE.Mesh} Dome mesh
 */
export function createDomeHabitat(options = {}) {
  const {
    radius = 2.5,
    widthSegments = 32,
    heightSegments = 16,
    materialOptions = { color: 0x32cd32, wireframe: true },
  } = options;

  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments,
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );
  const material = new THREE.MeshStandardMaterial(materialOptions);
  const dome = new THREE.Mesh(geometry, material);
  dome.rotation.x = -Math.PI / 2;

  return dome;
}

/**
 * Creates a torus habitat
 * @param {Object} options - { radius, tube, radialSegments, tubularSegments, materialOptions }
 * @returns {THREE.Mesh} Torus mesh
 */
export function createTorusHabitat(options = {}) {
  const {
    radius = 2,
    tube = 0.5,
    radialSegments = 16,
    tubularSegments = 100,
    materialOptions = { color: 0xffa500, wireframe: true },
  } = options;

  const geometry = new THREE.TorusGeometry(
    radius,
    tube,
    radialSegments,
    tubularSegments
  );
  const material = new THREE.MeshStandardMaterial(materialOptions);
  const torus = new THREE.Mesh(geometry, material);
  torus.rotation.x = -Math.PI / 2;

  return torus;
}

/**
 * Factory function to select habitat type
 * @param {string} type - 'cylinder', 'dome', 'torus'
 * @param {Object} options - options for the habitat
 * @returns {THREE.Mesh} Habitat mesh
 */
export function createHabitat(type, options = {}) {
  switch (type.toLowerCase()) {
    case 'cylinder':
      return createCylinderHabitat(options);
    case 'dome':
      return createDomeHabitat(options);
    case 'torus':
      return createTorusHabitat(options);
    default:
      console.warn(`Unknown habitat type: ${type}. Returning cylinder as default.`);
      return createCylinderHabitat(options);
  }
}
