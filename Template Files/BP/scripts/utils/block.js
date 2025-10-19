function getBlock(dimension, location) {
  let block = void 0;
  try {
    block = dimension.getBlock(location);
  } catch (e) {
  }
  return block;
}
export {
  getBlock
};
