import transformFormatterConfig from './phoneNumber/transformFormatterConfig';
import transformRegexConfig from './phoneNumber/transformRegexConfig';
import createModuleSubsetFile from './createFile';

createModuleSubsetFile(transformFormatterConfig());
createModuleSubsetFile(transformRegexConfig());
