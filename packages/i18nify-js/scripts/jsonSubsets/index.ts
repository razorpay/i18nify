import transformFormatterConfig from './phoneNumber/transformFormatterConfig';
import transformRegexConfig from './phoneNumber/transformRegexConfig';
import transformCurrencyConfig from './currency/transformCurrencyConfig';
import createModuleSubsetFile from './createFile';

createModuleSubsetFile(transformFormatterConfig());
createModuleSubsetFile(transformRegexConfig());
createModuleSubsetFile(transformCurrencyConfig());
