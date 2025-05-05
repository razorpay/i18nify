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
      <SideNavBody key="sidebar-body">
        {sidebarItems.map((l1Sections, index) => (
          <SideNavSection
            key={`section-${l1Sections.title || index}`}
            title={l1Sections.title}
          >
            {l1Sections?.items.map((l1Item, l1Index) => {
              if (!l1Item.items) {
                return (
                  <NavLink key={`l1-${l1Item.title || l1Index}`} {...l1Item} />
                );
              }

              return (
                <NavLink
                  key={`l1-${l1Item.title || l1Index}`}
                  {...l1Item}
                  activeOnLinks={getAllChildHrefs(l1Item.items)}
                  href={l1Item.items[0].href}
                >
                  <SideNavLevel key={`level-${l1Item.title || l1Index}`}>
                    {l1Item.items?.map((l2Item, l2Index) => {
                      if (!l2Item.items) {
                        return (
                          <NavLink
                            key={`l2-${l2Item.title || l2Index}`}
                            {...l2Item}
                          />
                        );
                      }

                      return (
                        <NavLink
                          key={`l2-${l2Item.title || l2Index}`}
                          {...l2Item}
                          activeOnLinks={getAllChildHrefs(l2Item.items)}
                          href={undefined}
                        >
                          <SideNavLevel
                            key={`level-${l2Item.title || l2Index}`}
                          >
                            {l2Item.items?.map((l3Item, l3Index) => (
                              <NavLink
                                key={`l3-${l3Item.title || l3Index}`}
                                {...l3Item}
                              />
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
