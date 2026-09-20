import transformFormatterConfig from './phoneNumber/transformFormatterConfig';
import transformRegexConfig from './phoneNumber/transformRegexConfig';
import transformCurrencyConfig from './currency/transformCurrencyConfig';
import transformDenominations from './currency/transformDenominations';
import transformNumericCodes from './currency/transformNumericCodes';
import createModuleSubsetFile from './createFile';

createModuleSubsetFile(transformFormatterConfig());
createModuleSubsetFile(transformRegexConfig());
createModuleSubsetFile(transformCurrencyConfig());
createModuleSubsetFile(transformDenominations());
createModuleSubsetFile(transformNumericCodes());
