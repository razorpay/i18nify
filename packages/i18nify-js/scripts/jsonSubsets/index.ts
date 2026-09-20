import transformFormatterConfig from './phoneNumber/transformFormatterConfig';
import transformRegexConfig from './phoneNumber/transformRegexConfig';
import transformCurrencyConfig from './currency/transformCurrencyConfig';
import transformDenominations from './currency/transformDenominations';
import transformNumericCodes from './currency/transformNumericCodes';
import transformAddressTemplates from './geo/transformAddressTemplates';
import transformHonorificTitles from './names/transformHonorificTitles';
import createModuleSubsetFile from './createFile';

createModuleSubsetFile(transformFormatterConfig());
createModuleSubsetFile(transformRegexConfig());
createModuleSubsetFile(transformCurrencyConfig());
createModuleSubsetFile(transformDenominations());
createModuleSubsetFile(transformNumericCodes());
createModuleSubsetFile(transformAddressTemplates());
createModuleSubsetFile(transformHonorificTitles());
