import { withErrorBoundary } from '../../common/errorBoundary';
import { AddressComponents } from './types';

const formatAddress = (
  template: string,
  components: AddressComponents,
): string => {
  if (!template || typeof template !== 'string' || !template.trim())
    throw new Error('template must be a non-empty string.');

  // Replace each {placeholder} token in the template with the matching component value.
  const substituted = template
    .replace(/{name}/g, components.name ?? '')
    .replace(/{organization}/g, components.organization ?? '')
    .replace(/{street_address}/g, components.street_address ?? '')
    .replace(/{city}/g, components.city ?? '')
    .replace(/{state}/g, components.state ?? '')
    .replace(/{zip}/g, components.zip ?? '')
    .replace(/{district}/g, components.district ?? '')
    .replace(/{sorting_code}/g, components.sorting_code ?? '');

  // Split into lines and drop any that are blank — happens when optional fields are empty.
  return substituted
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
};

// withErrorBoundary wraps the function so any thrown Error is caught and
// re-thrown as an I18nifyError, keeping error handling consistent across modules.
export default withErrorBoundary<typeof formatAddress>(formatAddress);
