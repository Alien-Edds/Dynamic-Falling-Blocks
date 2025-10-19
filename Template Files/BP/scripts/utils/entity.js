function spawnEntity(id, dimension, location) {
  const entity = dimension.spawnEntity(id, { x: location.x, y: 100, z: location.z });
  if (entity) entity.teleport(location);
  return entity;
}
export {
  spawnEntity
};
