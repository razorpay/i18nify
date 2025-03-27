import {
  Box,
  Button,
  FlagIcon,
  Menu,
  MenuDivider,
  MenuItem,
  MenuOverlay,
  Text,
} from '@razorpay/blade/components';
import React from 'react';
import styled from 'styled-components';
import { useI18nContext } from '@razorpay/i18nify-react';

const CustomMenuOverlay = styled(MenuOverlay)`
  max-height: 300px !important;
  overflow-y: auto;
`;

function LocaleDropdown({ supportedLocals }) {
  const { i18nState, setI18nState } = useI18nContext();
  const { locale } = i18nState;

  return (
    <Box>
      <Text size="small" variant="caption">
        Selected locale: {locale}
      </Text>
      <Menu>
        <Button>Choose Locale</Button>
        <CustomMenuOverlay>
          {supportedLocals.map((local, index) => {
            return (
              <React.Fragment key={index}>
                <Menu>
                  <MenuItem leading={<FlagIcon />} title={local.language} />
                  <MenuOverlay>
                    {local.locales.map((subItem, idx) => {
                      return (
                        <Box
                          backgroundColor={
                            locale === subItem
                              ? 'surface.background.gray.subtle'
                              : 'transparent'
                          }
                        >
                          <MenuItem
                            key={idx}
                            title={subItem}
                            onClick={() => setI18nState({ locale: subItem })}
                          />
                        </Box>
                      );
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
