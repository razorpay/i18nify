import { Box, SideNavLink } from '@razorpay/blade/components';
import React from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useLanguageContext } from 'src/context/languagesContext';

export const Page = ({ match }) => (
  <Box padding={{ base: 'spacing.2', m: 'spacing.6' }}>
    <pre>
      <code>{JSON.stringify(match, null, 4)}</code>
    </pre>
  </Box>
);

/**
 * Returns all hrefs in child tree for given item
 */
export const getAllChildHrefs = (items) => {
  const hrefs = [];

  if (!items) {
    return [];
  }

  items.forEach((item) => {
    if (item.href) {
      hrefs.push(item.href);
    }
    if (item.items) {
      hrefs.push(...getAllChildHrefs(item.items));
    }
  });

  return hrefs;
};

/**
 * Loops over JSON to return all routes including child routes
 */
export const getAllRoutesFromJSON = () => {
  let allHrefs = [];
  const { sidebarItems } = useLanguageContext();
  sidebarItems.forEach((section) => {
    if (section.items) {
      allHrefs = allHrefs.concat(getAllChildHrefs(section.items));
    }
  });

  return allHrefs;
};

/**
 * Returns if the given href or one of the items from activeOnLinks are active
 */
export const isItemActive = (location, { href, activeOnLinks }) => {
  const isCurrentPathActive = Boolean(matchPath(location.pathname, href ?? ''));

  const isSubItemActive = Boolean(
    activeOnLinks?.find((href) => matchPath(location.pathname, href)),
  );

  return isCurrentPathActive || isSubItemActive;
};

/**
 * React Router v6 Wrapper around Blade's SideNavLink that passes active state of item based on react router state
 */
export const NavLink = (props) => {
  const location = useLocation();

  return (
    <SideNavLink
      {...props}
      as={Link}
      isActive={isItemActive(location, {
        href: props.href,
        activeOnLinks: props.activeOnLinks,
      })}
    />
  );
};

export const getDefaultSectionExpanded = (items) => {
  const activeItem = items.find((l1Item) =>
    isItemActive(location, {
      href: l1Item.href,
      activeOnLinks: getAllChildHrefs(l1Item.items),
    }),
  );

  return Boolean(activeItem);
};
