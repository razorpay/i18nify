const transformFormatterConfig = require('./phoneNumber/transformFormatterConfig');
const transformRegexConfig = require('./phoneNumber/transformRegexConfig');
const createModuleSubsetFile = require('./createFile');

createModuleSubsetFile(transformFormatterConfig());
createModuleSubsetFile(transformRegexConfig());
