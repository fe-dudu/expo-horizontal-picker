const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');
const librarySourceRoot = path.resolve(workspaceRoot, 'src');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [librarySourceRoot];
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'expo-horizontal-picker') {
    return context.resolveRequest(context, path.resolve(librarySourceRoot, 'index.tsx'), platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
