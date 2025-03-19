import {
  Box,
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  MenuOverlay,
  ShareIcon,
} from '@razorpay/blade/components';
import React from 'react';
import styled from 'styled-components';
import { LOCALS_LIST } from 'src/components/Dashboard/Header/LocalDropdown/constants';

const CustomMenuOverlay = styled(MenuOverlay)`
  max-height: 300px !important;
  overflow-y: auto;
`;

function LocaleDropdown() {
  return (
    <Box>
      <Menu>
        <Button>Languages</Button>
        <CustomMenuOverlay>
          {LOCALS_LIST.map((local, index) => {
            return (
              <React.Fragment key={index}>
                <Menu>
                  <MenuItem
                    leading={<ShareIcon size="small" />}
                    title={local.language}
                  />
                  <MenuOverlay>
                    {local.locales.map((locale, idx) => {
                      return <MenuItem key={idx} title={locale} />;
                    })}
                  </MenuOverlay>
                </Menu>
                <MenuDivider marginTop="spacing.3" />
              </React.Fragment>
            );
          })}
        </CustomMenuOverlay>
      </Menu>
    </Box>
  );
}

export default LocaleDropdown;
