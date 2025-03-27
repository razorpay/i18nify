import {
  SideNav,
  SideNavBody,
  SideNavLevel,
  SideNavSection,
} from '@razorpay/blade/components';
import React from 'react';
import {
  NavLink,
  getAllChildHrefs,
} from 'src/components/Dashboard/Sidebar/utils';

import { useLanguageContext } from 'src/context/languagesContext';

const SideNavBar = ({ toggleMobileNav, isMobileSidebarOpen }) => {
  const { sidebarItems } = useLanguageContext();

  return (
    <SideNav
      isOpen={isMobileSidebarOpen}
      onDismiss={() => toggleMobileNav(false)}
      top="52px"
      zIndex={2}
    >
      <SideNavBody>
        {sidebarItems.map((l1Sections) => (
          <SideNavSection key={l1Sections.title} title={l1Sections.title}>
            {l1Sections?.items.map((l1Item) => {
              if (!l1Item.items) {
                return <NavLink key={l1Item.title} {...l1Item} />;
              }

              return (
                <NavLink
                  key={l1Item.title}
                  {...l1Item}
                  activeOnLinks={getAllChildHrefs(l1Item.items)}
                  href={l1Item.items[0].href}
                >
                  <SideNavLevel key={l1Item.title}>
                    {l1Item.items?.map((l2Item) => {
                      if (!l2Item.items) {
                        return <NavLink key={l2Item.title} {...l2Item} />;
                      }

                      return (
                        <NavLink
                          key={l2Item.title}
                          {...l2Item}
                          activeOnLinks={getAllChildHrefs(l2Item.items)}
                          href={undefined}
                        >
                          <SideNavLevel key={l2Item.title}>
                            {l2Item.items?.map((l3Item) => (
                              <NavLink key={l3Item.title} {...l3Item} />
                            ))}
                          </SideNavLevel>
                        </NavLink>
                      );
                    })}
                  </SideNavLevel>
                </NavLink>
              );
            })}
          </SideNavSection>
        ))}
      </SideNavBody>
    </SideNav>
  );
};

export default SideNavBar;
