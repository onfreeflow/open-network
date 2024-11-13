import fs from 'fs'

export function readDeviceTree(nodePath) {
  const tree = {};
  const nodes = fs.readdirSync(nodePath);
  nodes.forEach((node) => {
    const fullPath = `${nodePath}/${node}`;
    const stats = fs.lstatSync(fullPath);
    if (stats.isDirectory()) {
      tree[node] = readDeviceTree(fullPath);
    } else {
      tree[node] = fs.readFileSync(fullPath, 'utf8');
    }
  });
  return tree;
}